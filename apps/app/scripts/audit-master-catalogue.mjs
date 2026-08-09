import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? "/private/tmp/swiss-trails-geoadmin-audit.json";

if (!inputPath) {
  throw new Error("Usage: node audit-master-catalogue.mjs <list.txt> [output.json]");
}

const aliases = {
  "Aare Gorge": ["Aareschlucht"],
  "Abbey District of St. Gallen": ["Stiftsbezirk St. Gallen", "Stiftskirche St. Gallen"],
  "Aletsch Glacier": ["Grosser Aletschgletscher", "Aletschgletscher"],
  "Chapel Bridge": ["Kapellbrücke Luzern"],
  "Earth Pyramids of Euseigne": ["Erdpyramiden Euseigne", "Pyramides d'Euseigne"],
  "Grande Dixence Dam": ["Grande Dixence", "Barrage de la Grande Dixence"],
  "Grindelwald First": ["First Grindelwald", "First"],
  "Gorges de la Jogne": ["Jaunbachschlucht", "Gorges de la Jogne"],
  "Lake Lucerne": ["Vierwaldstättersee"],
  "Lauterbrunnen Valley": ["Lauterbrunnental", "Lauterbrunnen"],
  "Old City of Bern": ["Altstadt Bern", "Bern"],
  "Piora Valley and Lago Ritom": ["Val Piora", "Lago Ritom"],
  "Pizol Five Lakes": ["Pizol", "Wildsee Pizol"],
  "Rhine Falls": ["Rheinfall"],
  "Rhine Gorge (Ruinaulta)": ["Ruinaulta", "Rheinschlucht"],
  "Santa Petronilla Waterfall": ["Cascata di Santa Petronilla", "Santa Petronilla"],
  "Swiss National Park": ["Schweizerischer Nationalpark", "Parc Naziunal Svizzer"],
  "Swiss Tectonic Arena Sardona": ["Tektonikarena Sardona", "Sardona"],
  "Three Castles of Bellinzona": ["Castelgrande", "Castelli di Bellinzona"],
};

const cantonTokens = {
  Bern: ["BE"],
  "Appenzell Innerrhoden": ["AI"],
  Neuchâtel: ["NE"],
  Valais: ["VS"],
  Schaffhausen: ["SH"],
  Zürich: ["ZH"],
  Obwalden: ["OW"],
  Nidwalden: ["NW"],
  Schwyz: ["SZ"],
  Lucerne: ["LU"],
  Vaud: ["VD"],
  Graubünden: ["GR"],
  Ticino: ["TI"],
  "St. Gallen": ["SG"],
  Fribourg: ["FR"],
  Jura: ["JU"],
  Glarus: ["GL"],
  Uri: ["UR"],
};

const coordinateTypeByObjectClass = {
  TLM_STEHENDES_GEWAESSER: "lake_center",
  TLM_FLIESSGEWAESSER: "waterfall_or_watercourse",
  TLM_GIPFEL: "summit",
  TLM_SIEDLUNGSNAME: "village",
  TLM_GEBAEUDE: "attraction",
  TLM_BRUECKE: "attraction",
  TLM_STAUMAUER: "attraction",
};

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return stripHtml(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function haversineKm(a, b) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371.0088;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function parseList(text) {
  const pattern = /^(\d+)\.\s+(.+?)\s+—\s+(.+?)\s+—\s+(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\s*$/gm;
  return [...text.matchAll(pattern)].map((match) => ({
    index: Number(match[1]),
    name: match[2].trim(),
    canton: match[3].trim(),
    suppliedCoordinates: { lat: Number(match[4]), lng: Number(match[5]) },
  }));
}

function searchTerms(place) {
  const terms = [place.name, ...(aliases[place.name] ?? [])];
  const simplified = place.name
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+(and|et|und)\s+.+$/i, "")
    .replace(/[–—].+$/g, "")
    .trim();
  if (simplified && simplified !== place.name) terms.push(simplified);
  return [...new Set(terms)];
}

async function searchGazetteer(term) {
  const url = new URL("https://api3.geo.admin.ch/rest/services/ech/SearchServer");
  url.searchParams.set("searchText", term);
  url.searchParams.set("type", "locations");
  url.searchParams.set("origins", "gazetteer");
  url.searchParams.set("limit", "20");
  const response = await fetch(url, { headers: { "user-agent": "SwissTrailsContentAudit/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  const payload = await response.json();
  return { url: url.toString(), results: payload.results ?? [] };
}

function scoreResult(place, result) {
  const attrs = result.attrs;
  const label = stripHtml(attrs.label ?? "");
  const normalizedLabel = normalize(label);
  const queryNames = searchTerms(place).map(normalize);
  const nameTokens = new Set(queryNames.flatMap((name) => name.split(" ")).filter((token) => token.length > 2));
  const overlap = [...nameTokens].filter((token) => normalizedLabel.includes(token)).length;
  const exactName = queryNames.some((name) => normalizedLabel.includes(name));
  const coordinate = { lat: Number(attrs.lat), lng: Number(attrs.lon) };
  const distanceKm = haversineKm(place.suppliedCoordinates, coordinate);
  const cantonMatches = place.canton
    .split("/")
    .flatMap((name) => cantonTokens[name.trim()] ?? [])
    .some((abbreviation) => label.includes(`(${abbreviation})`));
  const score =
    (exactName ? 80 : 0) +
    overlap * 12 +
    (cantonMatches ? 15 : 0) +
    Math.max(0, 30 - distanceKm * 3) -
    Math.min(Number(result.weight ?? 0), 1000) / 200;

  return {
    score: Number(score.toFixed(2)),
    distanceKm: Number(distanceKm.toFixed(3)),
    label,
    detail: attrs.detail,
    origin: attrs.origin,
    objectClass: attrs.objectclass || null,
    federalCoordinates: coordinate,
    coordinateType: coordinateTypeByObjectClass[attrs.objectclass] ?? null,
    weight: result.weight,
  };
}

async function auditPlace(place) {
  const searches = [];
  const candidates = [];
  for (const term of searchTerms(place)) {
    try {
      const search = await searchGazetteer(term);
      searches.push({ term, url: search.url, resultCount: search.results.length });
      candidates.push(...search.results.map((result) => scoreResult(place, result)));
    } catch (error) {
      searches.push({ term, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const deduplicated = [...new Map(candidates.map((candidate) => [
    `${candidate.federalCoordinates.lat},${candidate.federalCoordinates.lng},${candidate.label}`,
    candidate,
  ])).values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const best = deduplicated[0] ?? null;
  const status = !best
    ? "no_match"
    : best.distanceKm <= 2 && best.score >= 80
      ? "candidate_match"
      : "manual_review";

  return { ...place, searches, status, best, candidates: deduplicated };
}

const text = await readFile(inputPath, "utf8");
const places = parseList(text);
if (places.length !== 100) throw new Error(`Expected 100 places, parsed ${places.length}`);

const audited = [];
for (let start = 0; start < places.length; start += 5) {
  const batch = places.slice(start, start + 5);
  audited.push(...(await Promise.all(batch.map(auditPlace))));
  process.stderr.write(`Audited ${Math.min(start + batch.length, places.length)}/${places.length}\n`);
}

const report = {
  generatedAt: new Date().toISOString(),
  input: basename(inputPath),
  officialService: "Swiss Confederation GeoAdmin SearchServer (gazetteer origin)",
  methodology:
    "Automated candidate matching only. A candidate is not publication approval; route access, restrictions, imagery and official destination sources still require manual review.",
  counts: {
    total: audited.length,
    candidateMatch: audited.filter((place) => place.status === "candidate_match").length,
    manualReview: audited.filter((place) => place.status === "manual_review").length,
    noMatch: audited.filter((place) => place.status === "no_match").length,
  },
  places: audited,
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, counts: report.counts }, null, 2));

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const cataloguePath = resolve("data/master-catalogue.json");
const existingPaths = [
  resolve("data/sourced-images.generated.json"),
  resolve("data/reviewed-images.generated.json"),
  resolve("data/gallery-images.generated.json"),
];
const outputPath = resolve("data/gallery-images.generated.json");
const reportPath = resolve("data/gallery-images.audit.json");
const USER_AGENT = "SwissTrailsGalleryAudit/1.0 (editorial image provenance)";
const ACCEPTED_LICENSE = /^(CC0|CC BY(?:-SA)?(?: [1-4]\.0)?|Public domain)$/i;
const REJECT_TITLE = /\b(map|karte|logo|flag|coat of arms|diagram|plan|icon|locator|sign|poster|stamp)\b/i;

const catalogue = JSON.parse(await readFile(cataloguePath, "utf8"));
const existingSets = await Promise.all(existingPaths.map(async (path) => JSON.parse(await readFile(path, "utf8"))));
const existingById = Object.assign({}, ...existingSets);
const priorGalleries = existingSets.at(-1);
const globallyUsed = new Set(Object.values(existingById).flat().map((image) => cleanUrl(image.url)));
let lastRequestAt = 0;

async function requestJson(url) {
  const wait = Math.max(0, 450 - (Date.now() - lastRequestAt));
  if (wait > 0) await new Promise((resolveDelay) => setTimeout(resolveDelay, wait));
  for (let attempt = 0; attempt < 5; attempt += 1) {
    lastRequestAt = Date.now();
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(20_000) });
    if (response.ok) return response.json();
    if (response.status !== 429 && response.status < 500) throw new Error(`${response.status}: ${url}`);
    const retryAfter = Number(response.headers.get("retry-after")) || 2 ** attempt;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, retryAfter * 1_000));
  }
  throw new Error(`Rate limit persisted: ${url}`);
}

function cleanUrl(value) {
  if (!value) return value;
  const url = new URL(value);
  url.search = "";
  return url.toString();
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function distanceKm(a, b) {
  const toRad = (degrees) => degrees * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function api(host, params) {
  const url = new URL(`https://${host}/w/api.php`);
  for (const [key, value] of Object.entries({ action: "query", format: "json", origin: "*", ...params })) {
    url.searchParams.set(key, String(value));
  }
  return requestJson(url);
}

async function wikidataEntity(location) {
  const searchUrl = new URL("https://www.wikidata.org/w/api.php");
  for (const [key, value] of Object.entries({
    action: "wbsearchentities", format: "json", origin: "*", language: "en", uselang: "en",
    search: location.name, type: "item", limit: "8",
  })) searchUrl.searchParams.set(key, value);
  const search = await requestJson(searchUrl);
  const ids = (search.search ?? []).map((item) => item.id);
  if (ids.length === 0) return null;
  const entitiesUrl = new URL("https://www.wikidata.org/w/api.php");
  for (const [key, value] of Object.entries({
    action: "wbgetentities", format: "json", origin: "*", props: "claims|labels|descriptions", languages: "en|de|fr|it", ids: ids.join("|"),
  })) entitiesUrl.searchParams.set(key, value);
  const payload = await requestJson(entitiesUrl);
  const candidates = ids.map((id) => payload.entities?.[id]).filter(Boolean).map((entity) => {
    const coordinate = entity.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    const category = entity.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
    return {
      id: entity.id,
      category,
      coordinate: coordinate ? { lat: coordinate.latitude, lng: coordinate.longitude } : null,
      label: entity.labels?.en?.value ?? entity.labels?.de?.value ?? location.name,
    };
  }).filter((entity) => entity.category && entity.coordinate);
  candidates.sort((a, b) => distanceKm(location.coordinates, a.coordinate) - distanceKm(location.coordinates, b.coordinate));
  const best = candidates[0];
  if (!best) return null;
  const distance = distanceKm(location.coordinates, best.coordinate);
  // Broad landscape records can legitimately use a valley/lake centre point.
  // Twenty kilometres still prevents a same-name match in another region.
  return distance <= 20 ? { ...best, distanceKm: Number(distance.toFixed(2)) } : null;
}

async function categoryFiles(category) {
  const payload = await api("commons.wikimedia.org", {
    generator: "categorymembers", gcmtitle: `Category:${category}`, gcmtype: "file", gcmlimit: "100",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata",
  });
  return Object.values(payload.query?.pages ?? {}).map((page) => ({ page, info: page.imageinfo?.[0] })).filter(({ info }) => info);
}

function normalizedTokens(value) {
  const ignored = new Set(["lake", "valley", "falls", "gorge", "glacier", "mount", "switzerland", "swiss", "and", "the", "old", "city"]);
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !ignored.has(token));
}

function candidateImage(location, category, entry, index) {
  const { page, info } = entry;
  const metadata = info.extmetadata ?? {};
  const license = stripHtml(metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value ?? "");
  const artist = stripHtml(metadata.Artist?.value ?? metadata.Credit?.value ?? "Unknown creator");
  const description = stripHtml(metadata.ImageDescription?.value ?? "");
  const url = cleanUrl(info.url);
  if (!url || globallyUsed.has(url)) return null;
  if (!info.mime?.startsWith("image/") || info.mime === "image/svg+xml") return null;
  if ((info.width ?? 0) < 1600 || (info.height ?? 0) < 900 || info.width / info.height < 1.15) return null;
  if (!ACCEPTED_LICENSE.test(license) || REJECT_TITLE.test(page.title)) return null;
  const haystack = `${page.title} ${description}`.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const identityTokens = [...new Set([...normalizedTokens(location.name), ...normalizedTokens(category)])];
  if (identityTokens.length > 0 && !identityTokens.some((token) => haystack.includes(token))) return null;
  return {
    id: `img-${location.slug}-gallery-${index + 1}`,
    url,
    alt: location.name,
    width: info.width,
    height: info.height,
    credit: `${artist} · ${license}`,
    sourceUrl: info.descriptionurl,
    isHero: false,
  };
}

const galleries = { ...priorGalleries };
const report = [];
for (const [position, location] of catalogue.entries()) {
  try {
    const entity = await wikidataEntity(location);
    if (!entity) {
      report.push({ id: location.id, name: location.name, status: "no-coordinate-matched-commons-category" });
      continue;
    }
    const current = existingById[location.id] ?? [];
    const needed = Math.max(0, 3 - current.length);
    if (needed === 0) {
      report.push({ id: location.id, name: location.name, status: "already-complete", wikidata: entity.id, category: entity.category });
      continue;
    }
    const files = await categoryFiles(entity.category);
    const selected = [];
    for (const entry of files) {
      const image = candidateImage(location, entity.category, entry, selected.length);
      if (!image) continue;
      globallyUsed.add(image.url);
      selected.push(image);
      if (selected.length === needed) break;
    }
    if (selected.length > 0) galleries[location.id] = [...current, ...selected];
    report.push({
      id: location.id, name: location.name, status: selected.length === needed ? "complete" : "partial",
      wikidata: entity.id, wikidataDistanceKm: entity.distanceKm, category: entity.category,
      existing: current.length, added: selected.length, total: current.length + selected.length,
    });
    process.stderr.write(`[${position + 1}/${catalogue.length}] ${location.name}: ${current.length + selected.length}/3\n`);
  } catch (error) {
    report.push({ id: location.id, name: location.name, status: "error", error: String(error) });
  }
}

await writeFile(outputPath, `${JSON.stringify(galleries, null, 2)}\n`);
await writeFile(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), method: "Wikidata P373 plus coordinate agreement, then exact Commons category", report }, null, 2)}\n`);
console.log(JSON.stringify({ locations: catalogue.length, galleries: Object.keys(galleries).length, photos: Object.values(galleries).flat().length, reportPath }, null, 2));

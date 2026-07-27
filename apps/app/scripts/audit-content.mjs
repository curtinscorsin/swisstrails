#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCATIONS_PATH = resolve(APP_DIR, "data/locations.ts");
const IMAGES_PATH = resolve(APP_DIR, "data/sourced-images.ts");

function parseLocations(source) {
  const starts = [...source.matchAll(/id:\s*"(loc-\d+)"/g)];
  return starts.map((match, index) => {
    const chunk = source.slice(match.index, starts[index + 1]?.index ?? source.length);
    const read = (pattern) => chunk.match(pattern)?.[1];
    return {
      id: match[1],
      slug: read(/slug:\s*"([^"]+)"/),
      name: read(/name:\s*"([^"]+)"/),
      tagline: read(/tagline:\s*"([^"]+)"/),
      description: read(/description:\s*"([^"]+)"/),
      category: read(/category:\s*"([^"]+)"/),
      region: read(/region:\s*"([^"]+)"/),
      difficulty: read(/difficulty:\s*"([^"]+)"/),
      lat: Number(read(/coordinates:\s*\{\s*lat:\s*(-?\d+(?:\.\d+)?)/)),
      lng: Number(read(/coordinates:\s*\{[^}]*lng:\s*(-?\d+(?:\.\d+)?)/)),
    };
  });
}

function parseImages(source) {
  const start = source.indexOf("{", source.indexOf("SOURCED_IMAGES"));
  const end = source.lastIndexOf("}");
  if (start < 0 || end <= start) return {};
  // Generated internally as JSON-compatible object-literal syntax.
  return Function(`"use strict"; return (${source.slice(start, end + 1)});`)();
}

function findDuplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].filter(([, count]) => count > 1).map(([value]) => value);
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const GENERIC_TOKENS = new Set([
  "above", "alp", "alpe", "approach", "around", "back", "bridge", "circuit",
  "east", "first", "floor", "from", "glacier", "gorge", "headwall", "hidden",
  "high", "lake", "lakes", "loop", "lower", "meadow", "mont", "monte", "near",
  "ober", "old", "panorama", "pass", "photo", "plateau", "quiet", "reservoir",
  "ridge", "road", "route", "side", "southern", "spot", "summit", "sunset",
  "swiss", "switzerland", "terraces", "trail", "trails", "traverse", "upper",
  "valle", "valley", "view", "viewpoint", "viewpoints", "village", "waterfall",
  "wildlife", "with",
]);

const REJECTED_IMAGE_SUBJECTS = [
  "map", "karte", "diagram", "logo", "icon", "coat of arms", "wappen",
  "topographic", "chart", "graph", "scan", "drawing", "sketch", "painting",
  "portrait", "poster", "museum", "museo", "musee", "herbarium", "flora", "flower", "blume", "orchid",
  "fungus", "xylaria", "bird", "vogel", "kleiber", "sitta", "ibex",
  "steinbock", "cattle", "cows", "cow", "horse", "sheep", "goat", "snake",
  "bothriechis", "wildlife", "chamois", "elephant", "wild baby", "cat runs",
  "interior", "inside", "binnen", "interieur", "gastraum",
  "aufenthaltsraum", "zimmer", "stube", "kitchen", "church", "kirche",
  "chapel", "kapelle", "bahnhof", "station", "gondola", "cable car",
  "funiculaire", "funivia", "bergbahn", "seilbahn", "luftseilbahn", "bahn",
  "ski lift", "chairlift", "bus", "railway", "tunnel", "restaurant", "hotel",
  "werbe", "carton", "kirchner", "installation design", "championship",
  "canoe", "slalom", "sekeri", "turkey", "cape town", "anvers", "antwerp",
  "poort", "relief", "swisstopo", "building site", "construction site",
  "denkmal", "friedhof", "cemetery", "cimiter", "grave", "grab ",
  "grenzposten", "schloss", "castle", "statue", "sculpture", "schiff", "ship",
  "panneaux", "fingerpost", "rhb", "stern club", "memorial", "monument",
  "schild", "blazon", "flag",
];

function primaryNameTokens(name) {
  return String(name)
    .split("(", 1)[0]
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !GENERIC_TOKENS.has(token));
}

const [locationSource, imageSource] = await Promise.all([
  readFile(LOCATIONS_PATH, "utf8"),
  readFile(IMAGES_PATH, "utf8"),
]);

const locations = parseLocations(locationSource);
const imagesByLocation = parseImages(imageSource);
const failures = [];

assert(locations.length === 500, `Expected 500 locations, found ${locations.length}`, failures);
for (const field of ["id", "slug", "name", "tagline", "description"]) {
  const duplicates = findDuplicates(locations.map((location) => location[field]));
  assert(duplicates.length === 0, `Duplicate ${field}: ${duplicates.join(", ")}`, failures);
}

for (const location of locations) {
  for (const field of ["id", "slug", "name", "tagline", "description", "category", "region", "difficulty"]) {
    assert(Boolean(location[field]), `${location.id}: missing ${field}`, failures);
  }
  assert(
    location.lat >= 45.7 && location.lat <= 47.9 && location.lng >= 5.7 && location.lng <= 10.7,
    `${location.id}: coordinates are outside Switzerland (${location.lat}, ${location.lng})`,
    failures,
  );

  for (const image of imagesByLocation[location.id] ?? []) {
    const decodedFileName = decodeURIComponent(new URL(image.url).pathname)
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const destinationTokens = primaryNameTokens(location.name);
    assert(image.alt === location.name, `${location.id}: image alt does not match destination`, failures);
    assert(
      image.url.startsWith("https://upload.wikimedia.org/"),
      `${location.id}: unexpected image host ${image.url}`,
      failures,
    );
    assert((image.width ?? 0) >= 1000, `${location.id}: image is below 1000px wide`, failures);
    assert(Boolean(image.credit), `${location.id}: missing image credit`, failures);
    const strongestToken = destinationTokens.reduce(
      (strongest, token) => (token.length >= strongest.length ? token : strongest),
      "",
    );
    assert(
      Boolean(strongestToken && decodedFileName.includes(strongestToken)),
      `${location.id}: image filename does not match its strongest destination token`,
      failures,
    );
    const rejectedSubject = REJECTED_IMAGE_SUBJECTS.find((term) =>
      decodedFileName.includes(term)
    );
    assert(
      !rejectedSubject,
      `${location.id}: image filename contains rejected subject "${rejectedSubject}"`,
      failures,
    );
  }
}

const allImages = Object.values(imagesByLocation).flat();
const duplicateUrls = findDuplicates(allImages.map((image) => image.url));
assert(duplicateUrls.length === 0, `${duplicateUrls.length} image URLs are reused`, failures);

const unknownIds = Object.keys(imagesByLocation).filter(
  (id) => !locations.some((location) => location.id === id),
);
assert(unknownIds.length === 0, `Images reference unknown locations: ${unknownIds.join(", ")}`, failures);

if (failures.length) {
  console.error(`Content audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Content audit passed");
console.log(`- ${locations.length} unique destinations and routes`);
console.log(`- ${Object.keys(imagesByLocation).length} destinations with verified photographs`);
console.log(`- ${locations.length - Object.keys(imagesByLocation).length} honest designed fallbacks`);
console.log(`- ${allImages.length} unique, credited image URLs`);

if (process.argv.includes("--network")) {
  const broken = [];
  let nextIndex = 0;

  async function checkUrl(url) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          headers: { "User-Agent": "SwissTrails-ContentAudit/1.0" },
          signal: AbortSignal.timeout(15_000),
        });
        if (response.ok) return;
        if (response.status === 429 || response.status >= 500) continue;
        broken.push(`${response.status} ${url}`);
        return;
      } catch {
        if (attempt === 1) broken.push(`unreachable ${url}`);
      }
    }
  }

  async function worker() {
    while (nextIndex < allImages.length) {
      const index = nextIndex++;
      await checkUrl(allImages[index].url);
      if ((index + 1) % 100 === 0) {
        process.stdout.write(`\r- checked ${index + 1}/${allImages.length} remote images`);
      }
    }
  }

  await Promise.all(Array.from({ length: 12 }, () => worker()));
  process.stdout.write(`\r- checked ${allImages.length}/${allImages.length} remote images\n`);
  if (broken.length) {
    console.error(`Remote image audit failed with ${broken.length} broken URL(s):`);
    for (const item of broken) console.error(`- ${item}`);
    process.exit(1);
  }
  console.log("- all remote images responded successfully");
}

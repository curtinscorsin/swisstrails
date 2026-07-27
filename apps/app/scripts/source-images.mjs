#!/usr/bin/env node
/**
 * source-images.mjs
 * ----------------------------------------------------------------------------
 * Sources REAL, free, attribution-only photos for each Swiss hiking location in
 * `apps/app/data/locations.ts` and writes them to `apps/app/data/sourced-images.ts`.
 *
 * Strategy (per location):
 *   1. Search Wikimedia Commons by the destination's exact name.
 *   2. Keep only real JPEG photos whose file title contains at least one
 *      destination-specific token (for example "Macun" for "Lai da Macun").
 *   3. If no verified match is found, omit the location instead of presenting
 *      a nearby-but-unrelated image as that destination.
 *
 * The script is RESUMABLE / IDEMPOTENT: it loads any locations already present in
 * `sourced-images.ts` and skips them, so it can be re-run to fill gaps.
 *
 * Usage:
 *   node apps/app/scripts/source-images.mjs                 # source everything missing
 *   LIMIT=20 node apps/app/scripts/source-images.mjs        # only process 20 (debug)
 *   FORCE=1 node apps/app/scripts/source-images.mjs         # ignore existing, redo all
 *
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(__dirname, "..");
const LOCATIONS_PATH = resolve(APP_DIR, "data/locations.ts");
const OUTPUT_PATH = resolve(APP_DIR, "data/sourced-images.ts");

const USER_AGENT =
  "SwissTrails-ImageSourcer/1.0 (https://swisstrails.example; hiking location photo sourcing; node fetch)";

const MAX_PER_LOCATION = 3;
const THUMB_WIDTH = 1200;
const CONCURRENCY = 4;
const POLITE_DELAY_MS = 120; // small delay between requests inside a worker
const SAVE_EVERY = 25; // checkpoint output every N newly-processed locations

const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity;
const FORCE = process.env.FORCE === "1" || process.env.FORCE === "true";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Parse locations.ts WITHOUT importing it (it depends on "@/types").  */
/* We extract id / name / coordinates with a light regex sweep over     */
/* each top-level object literal.                                       */
/* ------------------------------------------------------------------ */
async function loadLocations() {
  const src = await readFile(LOCATIONS_PATH, "utf8");
  const locations = [];
  // Split on the `id:` field boundaries to isolate each location object.
  const idRegex = /id:\s*"(loc-\d+)"/g;
  let match;
  const indices = [];
  while ((match = idRegex.exec(src)) !== null) {
    indices.push({ id: match[1], index: match.index });
  }
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = i + 1 < indices.length ? indices[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    const id = indices[i].id;
    const nameMatch = chunk.match(/name:\s*"((?:[^"\\]|\\.)*)"/);
    const coordMatch = chunk.match(
      /coordinates:\s*\{\s*lat:\s*(-?\d+(?:\.\d+)?)\s*,\s*lng:\s*(-?\d+(?:\.\d+)?)\s*\}/,
    );
    if (!nameMatch || !coordMatch) continue;
    const name = nameMatch[1].replace(/\\"/g, '"');
    const lat = Number(coordMatch[1]);
    const lng = Number(coordMatch[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    locations.push({ id, name, lat, lng });
  }
  return locations;
}

/* ------------------------------------------------------------------ */
/* Load already-sourced ids from an existing output file (resumable).   */
/* ------------------------------------------------------------------ */
async function loadExisting() {
  if (FORCE || !existsSync(OUTPUT_PATH)) return {};
  try {
    const src = await readFile(OUTPUT_PATH, "utf8");
    const jsonStart = src.indexOf("= {", src.indexOf("SOURCED_IMAGES"));
    if (jsonStart === -1) return {};
    const objStart = src.indexOf("{", jsonStart);
    const objEnd = src.lastIndexOf("}");
    if (objStart === -1 || objEnd === -1 || objEnd <= objStart) return {};
    const objText = src.slice(objStart, objEnd + 1);
    // The generated object is valid JS object syntax; eval in a sandboxed Function.
    // eslint-disable-next-line no-new-func
    const parsed = Function(`"use strict"; return (${objText});`)();
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn("Could not parse existing output, starting fresh:", err.message);
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* HTTP helper with timeout + retry.                                    */
/* ------------------------------------------------------------------ */
async function fetchJson(url, { headers = {}, retries = 3 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...headers },
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      if (res.status === 429 || res.status >= 500) {
        const wait = 800 * (attempt + 1);
        await sleep(wait);
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      if (attempt === retries) return null;
      await sleep(600 * (attempt + 1));
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Helpers for building LocationImage objects.                          */
/* ------------------------------------------------------------------ */
function stripHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/* Verified Wikimedia Commons name search (KEYLESS).                    */
/* ------------------------------------------------------------------ */
function isRealPhoto(info, title) {
  const mime = info?.mime ?? "";
  if (mime !== "image/jpeg") return false; // jpeg only -> excludes svg/png maps/icons/diagrams
  // Card and hero crops need a genuinely usable landscape source. Reject
  // thumbnails, portraits and tiny historical files rather than upscaling them.
  if ((info.width ?? 0) < 1000 || (info.height ?? 0) < 600) return false;
  if ((info.width ?? 0) / (info.height ?? 1) < 1.05) return false;
  const t = normalizeWords(title);
  // Filter out non-photographic assets that still happen to be jpeg.
  const bannedWords = [
    "map",
    "karte",
    "diagram",
    "logo",
    "icon",
    "coat of arms",
    "wappen",
    "panorama label",
    "topographic",
    "plan ",
    "chart",
    "graph",
    "scan",
    "drawing",
    "sketch",
    "painting",
    "portrait",
    "poster",
    "museum",
    "museo",
    "musee",
    "herbarium",
    "flora",
    "flower",
    "blume",
    "orchid",
    "fungus",
    "xylaria",
    "bird",
    "vogel",
    "kleiber",
    "sitta",
    "ibex",
    "steinbock",
    "cattle",
    "cows",
    "cow",
    "horse",
    "sheep",
    "goat",
    "snake",
    "bothriechis",
    "wildlife",
    "chamois",
    "elephant",
    "wild baby",
    "cat runs",
    "interior",
    "inside",
    " innen",
    "binnen",
    "interieur",
    "gastraum",
    "aufenthaltsraum",
    "zimmer",
    "stube",
    "kitchen",
    "church",
    "kirche",
    "chapel",
    "kapelle",
    "bahnhof",
    "station",
    "gondola",
    "cable car",
    "funiculaire",
    "funivia",
    "bergbahn",
    "seilbahn",
    "luftseilbahn",
    "bahn",
    "ski lift",
    "chairlift",
    "bus",
    "railway",
    " lok ",
    "tunnel",
    "restaurant",
    "hotel",
    "werbe",
    "carton",
    "kirchner",
    "installation design",
    "championship",
    "canoe",
    "slalom",
    "sekeri",
    "turkey",
    "cape town",
    "anvers",
    "antwerp",
    "poort",
    "relief",
    "swisstopo",
    "building site",
    "construction site",
    "denkmal",
    "friedhof",
    "cemetery",
    "cimiter",
    "grave",
    "grab ",
    "grenposten",
    "grenzposten",
    "schloss",
    "castle",
    "statue",
    "sculpture",
    "schiff",
    "ship",
    "panneaux",
    "fingerpost",
    "rhb",
    "stern club",
    "memorial",
    "monument",
    "schild",
    " sign",
    "blazon",
    "flag",
  ];
  if (bannedWords.some((w) => t.includes(w))) return false;
  return true;
}

const GENERIC_NAME_TOKENS = new Set([
  "above", "alp", "alpe", "approach", "around", "back", "bridge", "circuit", "east", "first", "floor",
  "from", "glacier", "gorge", "headwall", "hidden", "high", "lake", "lakes",
  "loop", "lower", "meadow", "mont", "monte", "near", "ober", "old", "panorama", "pass", "photo", "plateau",
  "quiet", "reservoir", "ridge", "road", "route", "side", "southern", "spot",
  "summit", "sunset", "swiss", "switzerland", "terraces", "trail", "trails",
  "traverse", "upper", "valle", "valley", "view", "viewpoint", "viewpoints",
  "village", "waterfall", "wildlife", "with",
]);

function strongestDestinationToken(tokens) {
  return tokens.reduce(
    (strongest, token) => (token.length >= strongest.length ? token : strongest),
    "",
  );
}

function normalizeWords(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function destinationTokens(name) {
  // Parentheses usually describe an access town/region, while slash-separated
  // names often provide the most distinctive secondary waypoint. Ignore only
  // the parenthetical qualifier so "(Bürglen)" cannot make a Bürglen viaduct
  // look like "Biel-Kinzig".
  const primaryName = String(name).split("(", 1)[0];
  return [...new Set(
    normalizeWords(primaryName)
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !GENERIC_NAME_TOKENS.has(token)),
  )];
}

function searchQueries(name, tokens) {
  const full = String(name)
    .replace(/[()[\],]/g, " ")
    .replace(/\s*\/\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const concise = full
    .replace(
      /\b(panorama|trails?|back|high|circuit|viewpoints?|hidden|upper|lower|above|around)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
  const strongestToken = strongestDestinationToken(tokens);
  return [
    ...new Set(
      [full, concise, strongestToken]
        .filter(Boolean)
        .map((query) => `${query} Switzerland`),
    ),
  ].slice(0, 3);
}

function titleMatchesDestination(title, tokens) {
  const normalizedTitle = normalizeWords(title.replace(/^File:/i, ""));
  // Requiring the longest usable place token avoids ambiguous partial matches:
  // "Trift bridge" must match Trift, not an unrelated bridge, and
  // "First / Entlebuch" must match Entlebuch, not any file containing "first".
  const strongestToken = strongestDestinationToken(tokens);
  return Boolean(strongestToken && normalizedTitle.includes(strongestToken));
}

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "16",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: String(THUMB_WIDTH),
  });
  const json = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(json?.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 1e9) - (b.index ?? 1e9),
  );
}

function distanceKm(aLat, aLng, bLat, bLng) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLng = toRadians(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(aLat)) *
      Math.cos(toRadians(bLat)) *
      Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function fromCommons(loc) {
  const tokens = destinationTokens(loc.name);
  if (!tokens.length) return [];

  const candidates = [];
  const seenTitles = new Set();
  for (const query of searchQueries(loc.name, tokens)) {
    const pages = await searchCommons(query);
    for (const page of pages) {
      if (seenTitles.has(page.title)) continue;
      seenTitles.add(page.title);
      if (!titleMatchesDestination(page.title, tokens)) continue;
      const info = page.imageinfo?.[0];
      if (!info || !isRealPhoto(info, page.title)) continue;
      const meta = info.extmetadata ?? {};
      const imageLat = Number.parseFloat(meta.GPSLatitude?.value);
      const imageLng = Number.parseFloat(meta.GPSLongitude?.value);
      if (
        Number.isFinite(imageLat) &&
        Number.isFinite(imageLng) &&
        distanceKm(loc.lat, loc.lng, imageLat, imageLng) > 80
      ) {
        continue;
      }
      const tokenMatches = tokens.filter((token) =>
        normalizeWords(page.title).includes(token),
      ).length;
      candidates.push({ page, info, score: tokenMatches * 100 - (page.index ?? 99) });
    }
    if (candidates.length >= MAX_PER_LOCATION) break;
    await sleep(POLITE_DELAY_MS);
  }

  candidates.sort((a, b) => b.score - a.score);
  const out = [];
  const seenUrls = new Set();
  for (const { info } of candidates) {
    const thumbUrl = info.thumburl ?? info.url;
    if (!thumbUrl || seenUrls.has(thumbUrl)) continue;
    seenUrls.add(thumbUrl);
    const meta = info.extmetadata ?? {};
    const artist = stripHtml(meta.Artist?.value) || "Unknown";
    const license =
      stripHtml(meta.LicenseShortName?.value) ||
      stripHtml(meta.License?.value) ||
      "see Wikimedia Commons";
    out.push({
      id: `${loc.id}-commons-${out.length}`,
      url: thumbUrl,
      alt: loc.name,
      width: info.thumbwidth ?? THUMB_WIDTH,
      credit: `${artist} / ${license} via Wikimedia Commons`,
    });
    if (out.length >= MAX_PER_LOCATION) break;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Source a single location from a destination-verified provider.       */
/* ------------------------------------------------------------------ */
async function sourceLocation(loc) {
  try {
    await sleep(POLITE_DELAY_MS);
    return await fromCommons(loc);
  } catch (err) {
    return [];
  }
}

function dedupeAcrossLocations(map, allLocations) {
  const seenUrls = new Set();
  const deduped = {};
  for (const loc of allLocations) {
    const images = (map[loc.id] ?? []).filter((image) => {
      if (!image?.url || seenUrls.has(image.url)) return false;
      seenUrls.add(image.url);
      return true;
    });
    if (images.length) deduped[loc.id] = images;
  }
  return deduped;
}

/* ------------------------------------------------------------------ */
/* Serialize the results map to a typed TS module.                      */
/* ------------------------------------------------------------------ */
function serialize(map) {
  const ids = Object.keys(map).sort((a, b) => {
    const na = Number(a.replace("loc-", ""));
    const nb = Number(b.replace("loc-", ""));
    return na - nb;
  });
  const lines = [];
  lines.push("// AUTO-GENERATED by scripts/source-images.mjs — do not edit by hand.");
  lines.push("// Real, free, attribution-only photos sourced from Wikimedia Commons.");
  lines.push("// Every file title is verified against a destination-specific name token;");
  lines.push("// unmatched nearby photos are intentionally omitted. Re-run to refresh.");
  lines.push('import type { LocationImage } from "@/types";');
  lines.push("");
  lines.push("export const SOURCED_IMAGES: Record<string, LocationImage[]> = {");
  for (const id of ids) {
    const imgs = map[id];
    if (!imgs || !imgs.length) continue;
    lines.push(`  ${JSON.stringify(id)}: [`);
    for (const img of imgs) {
      lines.push(`    ${JSON.stringify(img)},`);
    }
    lines.push("  ],");
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

async function save(map) {
  await writeFile(OUTPUT_PATH, serialize(map), "utf8");
}

/* ------------------------------------------------------------------ */
/* Main driver with a small concurrency pool.                           */
/* ------------------------------------------------------------------ */
async function main() {
  const allLocations = await loadLocations();
  console.log(`Parsed ${allLocations.length} locations from locations.ts`);

  const results = await loadExisting();
  const alreadyHave = new Set(Object.keys(results));
  if (alreadyHave.size) {
    console.log(`Resuming: ${alreadyHave.size} locations already in output.`);
  }

  let todo = allLocations.filter((l) => !alreadyHave.has(l.id));
  if (Number.isFinite(LIMIT)) todo = todo.slice(0, LIMIT);
  console.log(
    `Processing ${todo.length} locations (concurrency ${CONCURRENCY}, Commons keyless)...`,
  );

  let processed = 0;
  let withImages = 0;
  let nextIndex = 0;

  async function worker(workerId) {
    while (true) {
      const i = nextIndex++;
      if (i >= todo.length) break;
      const loc = todo[i];
      const imgs = await sourceLocation(loc);
      processed++;
      if (imgs.length) {
        results[loc.id] = imgs;
        withImages++;
      }
      if (processed % 10 === 0) {
        process.stdout.write(
          `\r  ${processed}/${todo.length} processed, ${withImages} with images   `,
        );
      }
      if (processed % SAVE_EVERY === 0) {
        await save(results);
      }
    }
  }

  const workers = [];
  for (let w = 0; w < CONCURRENCY; w++) workers.push(worker(w));
  await Promise.all(workers);

  const verifiedResults = dedupeAcrossLocations(results, allLocations);
  await save(verifiedResults);

  const totalImages = Object.values(verifiedResults).reduce((n, a) => n + a.length, 0);
  console.log("\n----------------------------------------------------");
  console.log("Coverage summary");
  console.log("----------------------------------------------------");
  console.log(`Total locations:               ${allLocations.length}`);
  console.log(`Locations with verified images: ${Object.keys(verifiedResults).length}`);
  console.log(`Total images sourced:          ${totalImages}`);
  console.log(`Output written to:             ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

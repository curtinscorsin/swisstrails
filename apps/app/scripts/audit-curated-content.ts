#!/usr/bin/env tsx

import { CURATED_LOCATIONS } from "../data/curated-locations";
import { CATEGORIES } from "../data/categories";
import { resolveSourcedImages } from "../lib/location-image-data";

const failures: string[] = [];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) failures.push(message);
}

function duplicates(values: string[]) {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function isSwissCoordinate(lat: number, lng: number) {
  return lat >= 45.7 && lat <= 47.9 && lng >= 5.7 && lng <= 10.7;
}

assert(CURATED_LOCATIONS.length === 100, `Expected 100 published places, found ${CURATED_LOCATIONS.length}`);

for (const field of ["id", "slug", "name"] as const) {
  const repeated = duplicates(CURATED_LOCATIONS.map((location) => location[field]));
  assert(repeated.length === 0, `Duplicate ${field}: ${repeated.join(", ")}`);
}

for (const category of CATEGORIES) {
  const actual = CURATED_LOCATIONS.filter((location) => location.category === category.id).length;
  assert(category.count === actual, `${category.id}: displayed count ${category.count} does not match ${actual}`);
}

const publishedImageUrls: string[] = [];
const publishedSourceUrls: string[] = [];
let fallbackCount = 0;
let destinationOnlyCount = 0;

for (const location of CURATED_LOCATIONS) {
  const prefix = `${location.id} (${location.name})`;
  const verification = location.verification;

  assert(Boolean(location.description), `${prefix}: missing description`);
  assert(Boolean(location.longDescription), `${prefix}: missing visit context`);
  assert(isSwissCoordinate(location.coordinates.lat, location.coordinates.lng), `${prefix}: destination coordinate is outside Switzerland`);
  assert(verification, `${prefix}: missing verification record`);
  if (!verification) continue;
  const destinationOnly = verification.routeType === "Destination reference only";
  if (destinationOnly) destinationOnlyCount += 1;

  assert(verification.country === "Switzerland", `${prefix}: wrong country`);
  assert(Boolean(verification.canton), `${prefix}: missing canton`);
  assert(verification.checkedAt === "2026-08-10", `${prefix}: stale checked date`);
  assert(verification.distanceKm === (location.distanceKm ?? null), `${prefix}: card and verified distance disagree`);
  assert(
    verification.durationMinutes === null || verification.durationMinutes > 0,
    `${prefix}: invalid duration`
  );
  assert(Boolean(verification.season), `${prefix}: missing exact season`);
  assert(Boolean(verification.statusNote), `${prefix}: missing status note`);
  assert(isSwissCoordinate(verification.start.coordinates.lat, verification.start.coordinates.lng), `${prefix}: access-point coordinate is outside Switzerland`);
  assert(Boolean(verification.start.parking), `${prefix}: parking status is not documented`);
  assert(Boolean(verification.start.publicTransport), `${prefix}: public-transport status is not documented`);
  assert(Boolean(verification.accessibility), `${prefix}: accessibility is not documented`);
  assert(Boolean(verification.feeInfo), `${prefix}: fee status is not documented`);
  assert(verification.restrictions.length > 0, `${prefix}: restrictions are missing`);
  assert(verification.safety.length > 0, `${prefix}: safety notes are missing`);
  assert(
    verification.sources.length >= (destinationOnly ? 2 : 4),
    `${prefix}: insufficient source trail`
  );
  if (destinationOnly && verification.distanceKm != null) {
    assert(
      verification.sources.length >= 3,
      `${prefix}: contextual route figures require a destination-specific source`
    );
  }

  const sourceDates = new Set(verification.sources.map((source) => source.checkedAt));
  assert(sourceDates.size === 1 && sourceDates.has(verification.checkedAt), `${prefix}: source dates do not match route review date`);

  for (const source of verification.sources) {
    assert(source.url.startsWith("https://"), `${prefix}: insecure source URL ${source.url}`);
    publishedSourceUrls.push(source.url);
  }

  const photos = resolveSourcedImages(location);
  if (photos.length === 0) fallbackCount += 1;
  for (const photo of photos) {
    assert(photo.alt === location.name, `${prefix}: photo alt and published name disagree`);
    assert(photo.url.startsWith("https://upload.wikimedia.org/"), `${prefix}: non-Wikimedia published photo`);
    assert(Boolean(photo.credit), `${prefix}: photo is missing creator/licence credit`);
    assert(photo.sourceUrl?.startsWith("https://commons.wikimedia.org/wiki/File:"), `${prefix}: photo is missing a Commons source page`);
    assert((photo.width ?? 0) >= 1000, `${prefix}: photo is under 1000px wide`);
    publishedImageUrls.push(photo.url);
    if (photo.sourceUrl) publishedSourceUrls.push(photo.sourceUrl);
  }
}

assert(duplicates(publishedImageUrls).length === 0, "A published photo is reused across routes");

if (failures.length > 0) {
  console.error(`Curated content audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Curated content audit passed");
console.log(`- ${CURATED_LOCATIONS.length} published, source-backed places`);
console.log(`- ${CURATED_LOCATIONS.length - destinationOnlyCount} places include detailed visit verification`);
console.log(`- ${destinationOnlyCount} places publish sourced identity only and label logistics unresolved`);
console.log(`- ${publishedImageUrls.length} unique, credited location photographs`);
console.log(`- ${fallbackCount} places use the honest designed image placeholder`);

if (process.argv.includes("--network")) {
  const urls = [...new Set([...publishedImageUrls, ...publishedSourceUrls])];
  const broken: string[] = [];
  let cursor = 0;

  async function check(url: string) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        let response = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          headers: { "User-Agent": "Mozilla/5.0 SwissTrailsContentAudit/1.0" },
          signal: AbortSignal.timeout(20_000),
        });
        await response.body?.cancel();
        // Some official sites reject automated HEAD requests while serving the
        // same page normally in a browser. Retry those with a small GET request.
        if (response.status === 403 || response.status === 405) {
          response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            headers: {
              "User-Agent": "Mozilla/5.0 SwissTrailsContentAudit/1.0",
              Range: "bytes=0-1023",
            },
            signal: AbortSignal.timeout(20_000),
          });
          await response.body?.cancel();
        }
        if (response.ok) return;
        if (response.status === 429 || response.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
          continue;
        }
        broken.push(`${response.status} ${url}`);
        return;
      } catch {
        if (attempt === 2) broken.push(`unreachable ${url}`);
      }
    }
  }

  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      await check(urls[index]);
    }
  }

  await Promise.all(Array.from({ length: 2 }, () => worker()));
  if (broken.length > 0) {
    console.error(`Network audit failed with ${broken.length} issue(s):`);
    for (const issue of broken) console.error(`- ${issue}`);
    process.exit(1);
  }
  console.log(`- ${urls.length} published image and source URLs responded successfully`);
}

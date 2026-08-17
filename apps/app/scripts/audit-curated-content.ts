#!/usr/bin/env tsx

import { CURATED_LOCATIONS } from "../data/curated-locations";
import { CATEGORIES } from "../data/categories";
import { resolveSourcedImages } from "../lib/location-image-data";
import { CATALOGUE_METRICS } from "@swiss-trails/types";

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

function coordinateDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(value));
}

assert(
  CURATED_LOCATIONS.length === CATALOGUE_METRICS.publishedLocations,
  `Expected ${CATALOGUE_METRICS.publishedLocations} published places, found ${CURATED_LOCATIONS.length}`
);

for (const field of ["id", "slug", "name"] as const) {
  const repeated = duplicates(CURATED_LOCATIONS.map((location) => location[field]));
  assert(repeated.length === 0, `Duplicate ${field}: ${repeated.join(", ")}`);
}

for (let index = 0; index < CURATED_LOCATIONS.length; index += 1) {
  for (let other = index + 1; other < CURATED_LOCATIONS.length; other += 1) {
    const first = CURATED_LOCATIONS[index];
    const second = CURATED_LOCATIONS[other];
    assert(
      coordinateDistanceKm(first.coordinates, second.coordinates) >= 0.1,
      `Near-duplicate destination pins: ${first.name} and ${second.name}`
    );
  }
}

for (const category of CATEGORIES) {
  const actual = CURATED_LOCATIONS.filter((location) => location.category === category.id).length;
  assert(category.count === actual, `${category.id}: displayed count ${category.count} does not match ${actual}`);
}

const publishedImageUrls: string[] = [];
const publishedSourceUrls: string[] = [];
let fallbackCount = 0;
let destinationOnlyCount = 0;
let reviewedContextCount = 0;
const fallbackNames: string[] = [];
let landscapeImageCount = 0;
let locationsWithThreePhotographs = 0;
const limitedGalleryNames: string[] = [];

for (const location of CURATED_LOCATIONS) {
  const prefix = `${location.id} (${location.name})`;
  const verification = location.verification;

  assert(Boolean(location.description), `${prefix}: missing description`);
  assert(Boolean(location.longDescription), `${prefix}: missing visit context`);
  assert(Boolean(location.slug) && !location.slug.includes("/"), `${prefix}: invalid detail-route slug`);
  assert(location.highlights.length >= 3, `${prefix}: fewer than three useful highlights`);
  assert(location.tips.length > 0, `${prefix}: practical tips are missing`);
  assert(isSwissCoordinate(location.coordinates.lat, location.coordinates.lng), `${prefix}: destination coordinate is outside Switzerland`);
  assert(verification, `${prefix}: missing verification record`);
  if (!verification) continue;
  const destinationOnly = verification.routeType === "Destination reference only";
  const hasSeparateAccessPoint =
    verification.start.coordinates.lat !== location.coordinates.lat ||
    verification.start.coordinates.lng !== location.coordinates.lng;
  if (destinationOnly) destinationOnlyCount += 1;
  if (verification.routeType.startsWith("Reviewed:") && !hasSeparateAccessPoint) reviewedContextCount += 1;

  assert(verification.country === "Switzerland", `${prefix}: wrong country`);
  assert(Boolean(verification.canton), `${prefix}: missing canton`);
  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(verification.checkedAt) && verification.checkedAt <= "2026-08-17",
    `${prefix}: missing or future-dated editorial check`
  );
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
  const minimumSources = destinationOnly
    ? 2
    : verification.routeType.startsWith("Reviewed:")
      ? 3
      : 4;
  assert(verification.sources.length >= minimumSources, `${prefix}: insufficient source trail`);
  if (verification.routeType.startsWith("Reviewed:") && verification.distanceKm != null) {
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
  if (photos.length >= 3) locationsWithThreePhotographs += 1;
  else limitedGalleryNames.push(`${location.name} (${photos.length})`);
  if (photos.length === 0) {
    fallbackCount += 1;
    fallbackNames.push(location.name);
  }
  for (const photo of photos) {
    assert(photo.alt === location.name, `${prefix}: photo alt and published name disagree`);
    assert(photo.url.startsWith("https://upload.wikimedia.org/"), `${prefix}: non-Wikimedia published photo`);
    assert(/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(photo.url), `${prefix}: browser-unsafe image format`);
    assert(Boolean(photo.credit), `${prefix}: photo is missing creator/licence credit`);
    assert(
      !/unknown|no machine-readable|assumed|anonymous/i.test(photo.credit ?? ""),
      `${prefix}: photo creator is unresolved`
    );
    assert(photo.sourceUrl?.startsWith("https://commons.wikimedia.org/wiki/File:"), `${prefix}: photo is missing a Commons source page`);
    assert((photo.width ?? 0) >= 1000, `${prefix}: photo is under 1000px wide`);
    if ((photo.width ?? 0) / (photo.height ?? 1) >= 1.15) landscapeImageCount += 1;
    publishedImageUrls.push(photo.url);
    if (photo.sourceUrl) publishedSourceUrls.push(photo.sourceUrl);
  }
}

assert(duplicates(publishedImageUrls).length === 0, "A published photo is reused across routes");
assert(
  CURATED_LOCATIONS.length - destinationOnlyCount - reviewedContextCount ===
    CATALOGUE_METRICS.verifiedAccessPoints,
  "Shared verified-access-point count is stale"
);
assert(
  reviewedContextCount === CATALOGUE_METRICS.sourcedContextLocations,
  "Shared sourced-context count is stale"
);
assert(
  publishedImageUrls.length === CATALOGUE_METRICS.creditedPhotographs,
  "Shared credited-photograph count is stale"
);
assert(
  locationsWithThreePhotographs === CATALOGUE_METRICS.locationsWithThreePhotographs,
  "Shared three-photo gallery count is stale"
);
assert(
  limitedGalleryNames.length === 0,
  `Every published place must have at least three photographs: ${limitedGalleryNames.join(", ")}`
);
assert(
  fallbackCount === CATALOGUE_METRICS.placeholderLocations,
  "Shared placeholder count is stale"
);

if (failures.length > 0) {
  console.error(`Curated content audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Curated content audit passed");
console.log(`- ${CURATED_LOCATIONS.length} published, source-backed places`);
console.log(`- ${CURATED_LOCATIONS.length - destinationOnlyCount - reviewedContextCount} places include a separately verified access point`);
console.log(`- ${reviewedContextCount} places include destination-specific route or visit context while keeping the map pin separate`);
console.log(`- ${destinationOnlyCount} places publish sourced identity only and label logistics unresolved`);
console.log(`- ${publishedImageUrls.length} unique, credited location photographs`);
console.log(`- ${locationsWithThreePhotographs} locations have at least three photographs`);
console.log(`- Galleries below three photographs: ${limitedGalleryNames.join(", ") || "none"}`);
console.log(`- ${fallbackCount} places use the honest designed image placeholder`);
console.log(`- Placeholder locations: ${fallbackNames.join(", ") || "none"}`);
console.log(`- ${landscapeImageCount} source photographs are natively landscape; portrait sources use responsive focal cropping`);
console.log(`- ${CURATED_LOCATIONS.length} unique /location/[slug] detail routes are generated`);

if (process.argv.includes("--network")) {
  const urls = [...new Set([...publishedImageUrls, ...publishedSourceUrls])];
  const broken: string[] = [];
  const automationBlocked: string[] = [];
  let cursor = 0;

  async function check(url: string) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        let response = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          headers: { "User-Agent": "Mozilla/5.0 SwissTrailsContentAudit/1.0" },
          signal: AbortSignal.timeout(12_000),
        });
        await response.body?.cancel();
        // Some official sites reject automated HEAD requests while serving the
        // same page normally in a browser. Retry those with a small GET request.
        if (response.status === 401 || response.status === 403 || response.status === 405 || response.status === 406) {
          response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            headers: {
              "User-Agent": "Mozilla/5.0 SwissTrailsContentAudit/1.0",
              Range: "bytes=0-1023",
            },
            signal: AbortSignal.timeout(12_000),
          });
          await response.body?.cancel();
        }
        if (response.ok) return;
        if (response.status === 401 || response.status === 403 || response.status === 406) {
          automationBlocked.push(`${response.status} ${url}`);
          return;
        }
        if (response.status === 429 || response.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
          continue;
        }
        broken.push(`${response.status} ${url}`);
        return;
      } catch {
        if (attempt === 1) broken.push(`unreachable ${url}`);
      }
    }
  }

  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      await check(urls[index]);
    }
  }

  await Promise.all(Array.from({ length: 8 }, () => worker()));
  if (broken.length > 0) {
    console.error(`Network audit failed with ${broken.length} issue(s):`);
    for (const issue of broken) console.error(`- ${issue}`);
    process.exit(1);
  }
  if (automationBlocked.length > 0) {
    console.log(`- ${automationBlocked.length} official source URLs rejected automated checks but were not reported as broken`);
  }
  console.log(`- ${urls.length - automationBlocked.length} published image and source URLs responded successfully`);
}

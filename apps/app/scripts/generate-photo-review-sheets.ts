import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CURATED_LOCATIONS } from "../data/curated-locations";
import { resolveSourcedImages } from "../lib/location-image-data";

const outputDir = process.argv[2] ?? "/private/tmp/swiss-trails-photo-review";
const columns = 4;
const rows = 4;
const cardWidth = 360;
const imageHeight = 210;
const labelHeight = 70;
const sheetSize = columns * rows;

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]!);
}

function commonsThumbnailUrl(sourceUrl: string) {
  const url = new URL(sourceUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[1] !== "commons" || segments[2] === "thumb") return sourceUrl;
  const fileName = segments.at(-1);
  if (!fileName) return sourceUrl;
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(decodeURIComponent(fileName))}?width=640`;
}

async function download(sourceUrl: string) {
  const url = commonsThumbnailUrl(sourceUrl);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": "SwissTrailsEditorialReview/1.0 (hello@swiss-trails.com)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (response.ok) {
      const data = Buffer.from(await response.arrayBuffer());
      await new Promise((resolve) => setTimeout(resolve, 600));
      return data;
    }
    if (response.status !== 429 || attempt === 7) throw new Error(`${response.status} ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 5_000 * (attempt + 1)));
  }
  throw new Error(`Unable to download ${url}`);
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T, index: number) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

const photographs = CURATED_LOCATIONS.flatMap((location) =>
  resolveSourcedImages(location).map((image, index) => ({
    locationId: location.id,
    locationName: location.name,
    position: index + 1,
    ...image,
  }))
);

await mkdir(outputDir, { recursive: true });

for (let offset = 0; offset < photographs.length; offset += sheetSize) {
  const batch = photographs.slice(offset, offset + sheetSize);
  const composites = await mapWithConcurrency(batch, 1, async (photo, index) => {
    const source = await download(photo.url);
    const image = await sharp(source)
      .rotate()
      .resize(cardWidth, imageHeight, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82 })
      .toBuffer();
    const x = (index % columns) * cardWidth;
    const y = Math.floor(index / columns) * (imageHeight + labelHeight);
    const label = Buffer.from(`
      <svg width="${cardWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0b1726"/>
        <text x="14" y="27" fill="#ffffff" font-family="Arial, sans-serif" font-size="17" font-weight="700">${escapeXml(photo.locationName)}</text>
        <text x="14" y="52" fill="#a8bdd1" font-family="Arial, sans-serif" font-size="14">Photo ${photo.position} · ${escapeXml(photo.credit ?? "")}</text>
      </svg>`);
    return [
      { input: image, left: x, top: y },
      { input: label, left: x, top: y + imageHeight },
    ];
  });

  const sheetNumber = Math.floor(offset / sheetSize) + 1;
  await sharp({
    create: {
      width: columns * cardWidth,
      height: rows * (imageHeight + labelHeight),
      channels: 3,
      background: "#0b1726",
    },
  })
    .composite(composites.flat())
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDir, `sheet-${String(sheetNumber).padStart(2, "0")}.jpg`));
}

await writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), photographs }, null, 2)
);

console.log(`Generated ${Math.ceil(photographs.length / sheetSize)} sheets for ${photographs.length} photographs in ${outputDir}`);

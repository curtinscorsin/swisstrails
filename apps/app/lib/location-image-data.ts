import { SOURCED_IMAGES } from "@/data/sourced-images";
import type { Location, LocationImage } from "@/types";

/**
 * Returns only destination-verified images.
 *
 * `SOURCED_IMAGES` contains manually reviewed Wikimedia files whose description
 * identifies the exact published place. Inline gallery images are accepted only
 * when they are explicitly attached to the curated record. Generic landscape
 * substitutes are intentionally excluded.
 */
export function resolveSourcedImages(location: Location): LocationImage[] {
  const seen = new Set<string>();
  const images: LocationImage[] = [];

  for (const image of [...(SOURCED_IMAGES[location.id] ?? []), ...location.gallery]) {
    if (!image?.url || seen.has(image.url)) continue;
    // Browsers do not reliably display archive formats such as TIFF. Keep
    // those files in the research data, but never expose them as card or hero
    // images where they would appear broken to visitors.
    if (!/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(image.url)) continue;
    if (!image.credit || !image.sourceUrl) continue;
    if (/unknown|no machine-readable|assumed|anonymous/i.test(image.credit)) continue;
    seen.add(image.url);
    // The curated record is the canonical place name. Generated source data may
    // still contain an older spelling, so keep the credit/URL but align the
    // accessible description with the published route.
    const sourceUrl =
      image.sourceUrl ?? (image.url.includes("upload.wikimedia.org") ? commonsPageUrl(image.url) : undefined);
    images.push({ ...image, alt: location.name, sourceUrl });
  }

  return images;
}

function commonsPageUrl(imageUrl: string): string | undefined {
  try {
    const parts = new URL(imageUrl).pathname.split("/").filter(Boolean);
    const thumbIndex = parts.indexOf("thumb");
    const fileName = decodeURIComponent(
      thumbIndex >= 0 ? parts[parts.length - 2] : parts[parts.length - 1]
    );
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;
  } catch {
    return undefined;
  }
}

export function getPrimaryLocationImage(location: Location): LocationImage | null {
  return resolveSourcedImages(location)[0] ?? null;
}

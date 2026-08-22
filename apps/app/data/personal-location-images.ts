import type { LocationImage } from "@/types";

const credit = "Corsin Curtins · Original photography";
const sourceUrl = "https://swiss-trails.com/#about-corsin";

function original(
  id: string,
  url: string,
  width: number,
  height: number,
  isHero = false
): LocationImage {
  return { id, url, alt: "", width, height, credit, sourceUrl, isHero };
}

/**
 * Photographs supplied and identified by Swiss Trails creator Corsin Curtins.
 * This collection is loaded before licensed third-party photography, so its
 * first image becomes the destination's cover while the remaining images stay
 * available in the gallery.
 */
export const PERSONAL_LOCATION_IMAGES: Record<string, LocationImage[]> = {
  "spot-schafler": [
    original(
      "img-schafler-corsin-cover",
      "/images/locations/schaefler/corsin-schaefler-trail.jpg",
      768,
      1024,
      true
    ),
  ],
  "spot-falensee": [
    original(
      "img-falensee-corsin-cover",
      "/images/locations/faelensee/corsin-faelensee-shore.jpg",
      768,
      1024,
      true
    ),
  ],
  "spot-lagh-da-saoseo": [
    original(
      "img-lagh-da-saoseo-corsin-cover",
      "/images/locations/lagh-da-saoseo/corsin-lagh-da-saoseo-1.jpg",
      768,
      1024,
      true
    ),
    original(
      "img-lagh-da-saoseo-corsin-lake-2",
      "/images/locations/lagh-da-saoseo/corsin-lagh-da-saoseo-2.jpg",
      768,
      1024
    ),
    original(
      "img-lagh-da-saoseo-corsin-approach",
      "/images/locations/lagh-da-saoseo/corsin-val-da-camp-approach.jpg",
      1024,
      768
    ),
  ],
  "spot-blausee": [
    original("img-blausee-corsin-cover", "/images/locations/blausee/corsin-blausee-1.jpg", 2400, 1800, true),
    original("img-blausee-corsin-2", "/images/locations/blausee/corsin-blausee-2.jpg", 2400, 1800),
  ],
  "spot-oeschinensee": [
    original(
      "img-oeschinensee-corsin-cover",
      "/images/locations/oeschinensee/corsin-oeschinensee-5.jpg",
      2400,
      1800,
      true
    ),
    ...[1, 2, 3, 4, 6, 7, 8, 9, 10].map((number) =>
      original(
        `img-oeschinensee-corsin-${number}`,
        `/images/locations/oeschinensee/corsin-oeschinensee-${number}.jpg`,
        2400,
        1800
      )
    ),
  ],
  "spot-stoos-fronalpstock": [
    original(
      "img-stoos-fronalpstock-corsin-1",
      "/images/locations/stoos-fronalpstock/corsin-stoos-fronalpstock-1.jpg",
      2400,
      1800,
      true
    ),
  ],
};

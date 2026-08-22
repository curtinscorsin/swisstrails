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

type PersonalPhoto = readonly [file: string, width?: number, height?: number];

function originals(
  locationSlug: string,
  alt: string,
  photos: readonly PersonalPhoto[]
): LocationImage[] {
  return photos.map(([file, width = 2000, height = 1500], index) => ({
    id: `img-${locationSlug}-corsin-${file.replace(/\.jpg$/, "")}`,
    url: `/images/locations/${locationSlug}/${file}`,
    alt,
    width,
    height,
    credit,
    sourceUrl,
    isHero: index === 0,
  }));
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
        "/images/locations/oeschinensee/corsin-oeschinensee-4.jpg",
        2400,
        1800,
        true
      ),
      ...[1, 2, 3, 5, 6, 7, 8, 9, 10].map((number) =>
      original(
        `img-oeschinensee-corsin-${number}`,
        `/images/locations/oeschinensee/corsin-oeschinensee-${number}.jpg`,
        2400,
        1800
      )
    ),
  ],
  "spot-stoos-fronalpstock": [
    ...originals("stoos-fronalpstock", "Fronalpstock panorama above Lake Lucerne", [
      ["corsin-stoos-fronalpstock-img_4158.jpg", 1500, 2000],
      ["corsin-stoos-fronalpstock-img_4070.jpg", 1500, 2000],
    ]),
    original(
      "img-stoos-fronalpstock-corsin-1",
      "/images/locations/stoos-fronalpstock/corsin-stoos-fronalpstock-1.jpg",
      2400,
      1800,
      false
    ),
  ],
  "spot-chapf-viewpoint": originals("chapf-viewpoint", "View from Chapf above Walensee", [
    ["corsin-chapf-viewpoint-img_1487.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1488.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1490.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1493.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1494.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1506.jpg", 1500, 2000],
    ["corsin-chapf-viewpoint-img_1520.jpg"],
    ["corsin-chapf-viewpoint-img_1521.jpg"],
  ]),
  "spot-gornergrat": originals("gornergrat", "High-alpine landscape above Zermatt", [
    ["corsin-gornergrat-img_5857.jpg", 1500, 2000],
    ["corsin-gornergrat-img_5977.jpg", 1280, 719],
    ["corsin-gornergrat-img_5989.jpg", 1280, 719],
  ]),
  "spot-rhine-gorge-ruinaulta": originals("rheinschlucht", "Rheinschlucht and the Vorderrhein", [
    ["corsin-rheinschlucht-img_8146.jpg", 1500, 2000],
    ["corsin-rheinschlucht-img_7711.jpg", 1500, 2000],
    ["corsin-rheinschlucht-img_8134.jpg", 1500, 2000],
    ["corsin-rheinschlucht-img_8135.jpg", 1500, 2000],
    ["corsin-rheinschlucht-img_8136.jpg", 1500, 2000],
    ["corsin-rheinschlucht-img_8143.jpg", 1500, 2000],
  ]),
  "spot-lake-lucerne": originals("lake-lucerne", "Lake Lucerne and its mountain shoreline", [
    ["corsin-lake-lucerne-img_7270.jpg", 1500, 2000],
    ["corsin-lake-lucerne-img_7272.jpg", 1500, 2000],
  ]),
  "spot-grindelwald": originals("grindelwald", "Grindelwald beneath the Bernese Alps", [
    ["corsin-grindelwald-img_5456.jpg", 1500, 2000],
    ["corsin-grindelwald-img_4618.jpg", 1500, 2000],
    ["corsin-grindelwald-img_5259.jpg", 1125, 2000],
    ["corsin-grindelwald-img_5262.jpg", 2000, 1125],
    ["corsin-grindelwald-img_5263.jpg", 1125, 2000],
    ["corsin-grindelwald-img_5265.jpg", 2000, 1125],
    ["corsin-grindelwald-img_5294.jpg", 2000, 1125],
    ["corsin-grindelwald-img_5440.jpg", 1500, 2000],
    ["corsin-grindelwald-img_5448.jpg", 1500, 2000],
    ["corsin-grindelwald-img_5450.jpg", 2000, 1500],
  ]),
  "spot-kropfenstein-castle": originals("kropfenstein-castle", "Kropfenstein Castle beneath its rock overhang", [
    ["corsin-kropfenstein-castle-img_7755.jpg", 1500, 2000],
    ["corsin-kropfenstein-castle-img_7736.jpg", 1500, 2000],
    ["corsin-kropfenstein-castle-img_7798.jpg", 1500, 2000],
    ["corsin-kropfenstein-castle-img_7798-2.jpg", 1500, 2000],
  ]),
  "spot-caumasee": originals("caumasee", "Turquoise water and forest at Caumasee", [
    ["corsin-caumasee-img_7685.jpg", 1500, 2000],
    ["corsin-caumasee-img_7683.jpg", 1500, 2000],
    ["corsin-caumasee-img_7697.jpg", 1500, 2000],
  ]),
  "spot-speer": originals("speer", "Hiking the grassy Speer ridge", [
    ["corsin-speer-img_8868.jpg", 1500, 2000],
    ["corsin-speer-img_8858.jpg", 1125, 2000],
    ["corsin-speer-img_8879.jpg", 1500, 2000],
    ["corsin-speer-img_8887.jpg", 1500, 2000],
  ]),
};

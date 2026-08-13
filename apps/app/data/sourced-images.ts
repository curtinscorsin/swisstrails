import type { LocationImage } from "@/types";
import generatedImages from "./sourced-images.generated.json";
import reviewedImages from "./reviewed-images.generated.json";
import galleryImages from "./gallery-images.generated.json";

/**
 * Photographs are selected only when the Commons file description identifies
 * the exact destination. Every entry keeps its author, licence and source page.
 */
const EDITORIALLY_REVIEWED_IMAGES: Record<string, LocationImage[]> = {
  "spot-oeschinensee": [
    {
      id: "img-oeschinensee-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/20190725_Oeschinensee-Panorama%2C_Kandersteg_%2806540-42_stitch%29.jpg",
      alt: "Oeschinensee below Blüemlisalp, Fründenhorn and Doldenhorn",
      width: 9603,
      height: 5138,
      credit: "Günter Seggebäing · CC BY-SA 3.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:20190725_Oeschinensee-Panorama,_Kandersteg_(06540-42_stitch).jpg",
      isHero: true,
    },
  ],
  "spot-rhine-falls": [
    {
      id: "img-rhine-falls-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Chutes_du_Rhin_-_Octobre_2021.jpg",
      alt: "Rhine Falls in October",
      width: 6240,
      height: 3510,
      credit: "Christian David · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chutes_du_Rhin_-_Octobre_2021.jpg",
      isHero: true,
    },
  ],
  "spot-chapel-bridge": [
    {
      id: "img-chapel-bridge-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Luzern_Kapellbruecke.jpg",
      alt: "Chapel Bridge and Water Tower in Lucerne",
      width: 3370,
      height: 2247,
      credit: "Ikiwaner · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Luzern_Kapellbruecke.jpg",
      isHero: true,
    },
  ],
  "spot-chillon": [
    {
      id: "img-chillon-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/48/001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg",
      alt: "Château de Chillon with the Dents du Midi",
      width: 7952,
      height: 5304,
      credit: "Giles Laurent · CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg",
      isHero: true,
    },
  ],
  "spot-landwasser-viaduct": [
    {
      id: "img-landwasser-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Alps_of_Switzerland_Landwasserviadukt_%2824402116421%29.jpg",
      alt: "A Rhaetian Railway train crossing the Landwasser Viaduct",
      width: 5888,
      height: 3312,
      credit: "kuhnmi · CC BY 2.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Landwasserviadukt_(24402116421).jpg",
      isHero: true,
    },
  ],
  "spot-bern-old-city": [
    {
      id: "img-bern-old-city-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Old_City_and_the_Aare_river_-_Bern%2C_Switzerland_-_panoramio.jpg",
      alt: "Bern Old City inside the bend of the Aare",
      width: 6052,
      height: 4185,
      credit: "Sergey Ashmarin · CC BY-SA 3.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Old_City_and_the_Aare_river_-_Bern,_Switzerland_-_panoramio.jpg",
      isHero: true,
    },
  ],
  "spot-bellinzona-fortress": [
    {
      id: "img-bellinzona-fortress-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Three_castles_of_Bellinzona.jpg",
      alt: "The three castles of Bellinzona seen from Sasso Corbaro",
      width: 3968,
      height: 2976,
      credit: "Ealgiuas · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Three_castles_of_Bellinzona.jpg",
      isHero: true,
    },
  ],
  "spot-stein-am-rhein": [
    {
      id: "img-stein-am-rhein-commons",
      url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Rathausplatz_5%2C_7%2C_9%2C_11_und_13_in_Stein_am_Rhein.jpg",
      alt: "Painted houses around Rathausplatz in Stein am Rhein",
      width: 3600,
      height: 2325,
      credit: "JoachimKohlerBremen · CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Rathausplatz_5,_7,_9,_11_und_13_in_Stein_am_Rhein.jpg",
      isHero: true,
    },
  ],
  "spot-saxer-lucke": [
    {
      id: "img-saxer-lucke-browser-safe",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Kreuzberge_Saxerl%C3%BCcke_1.JPG",
      alt: "The Kreuzberge and Saxer Lücke above the Rhine Valley",
      width: 4288,
      height: 2848,
      credit: "Böhringer Friedrich · CC BY-SA 2.5",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kreuzberge_Saxerl%C3%BCcke_1.JPG",
      isHero: true,
    },
  ],
};

/**
 * Generated entries come from the exact destination's Wikidata P18 statement
 * and retain the Wikimedia Commons creator, licence and file-description URL.
 * Hand-reviewed entries win when both datasets contain the same location.
 */
const IMAGE_SETS = [
  EDITORIALLY_REVIEWED_IMAGES,
  generatedImages as Record<string, LocationImage[]>,
  reviewedImages as Record<string, LocationImage[]>,
  galleryImages as Record<string, LocationImage[]>,
];

export const SOURCED_IMAGES: Record<string, LocationImage[]> = Object.fromEntries(
  [...new Set(IMAGE_SETS.flatMap((set) => Object.keys(set)))].map((locationId) => {
    const seen = new Set<string>();
    const images = IMAGE_SETS.flatMap((set) => set[locationId] ?? []).filter((image) => {
      const url = image.url.split("?")[0];
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
    return [locationId, images];
  })
);

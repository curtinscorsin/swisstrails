import type { LocationImage } from "@/types";
import generatedImages from "./sourced-images.generated.json";
import reviewedImages from "./reviewed-images.generated.json";
import galleryImages from "./gallery-images.generated.json";
import { PERSONAL_LOCATION_IMAGES } from "./personal-location-images";

/**
 * Photographs are selected only when a Commons description identifies the exact
 * destination or when the creator supplied and identified an original image.
 * Every entry keeps its author, licence/provenance and source page.
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
  "spot-hoher-kasten": [
    {
      id: "img-hoher-kasten-summit-cover",
      url: "https://upload.wikimedia.org/wikipedia/commons/8/80/HoherKasten_02.jpg",
      alt: "Hoher Kasten in the Alpstein",
      width: 4912,
      height: 3264,
      credit: "Albinfo · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:HoherKasten_02.jpg",
      isHero: true,
    },
    {
      id: "img-hoher-kasten-from-aescher",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/HoherKasten_01.jpg",
      alt: "Hoher Kasten seen from Äscher",
      width: 4912,
      height: 3264,
      credit: "Albinfo · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:HoherKasten_01.jpg",
    },
    {
      id: "img-hoher-kasten-from-ebenalp",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Ebenalpbahn_und_Hoher_Kasten.jpg",
      alt: "Hoher Kasten and its summit station seen from the Ebenalp area",
      width: 4632,
      height: 3088,
      credit: "Chme82 · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ebenalpbahn_und_Hoher_Kasten.jpg",
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
  "spot-tomasee": [
    {
      id: "img-tomasee-1",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Tomasee_1.JPG",
      alt: "Tomasee, the alpine lake known as Lai da Tuma",
      width: 4912,
      height: 3264,
      credit: "Albinfo · CC BY 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tomasee_1.JPG",
      isHero: true,
    },
    {
      id: "img-tomasee-2",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Tomasee_2.JPG",
      alt: "Rocky shoreline and mountain basin at Tomasee",
      width: 4912,
      height: 3264,
      credit: "Albinfo · CC BY 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tomasee_2.JPG",
    },
    {
      id: "img-tomasee-rhine-source",
      url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Lai_da_Tuma_%28Tomasee%29_-_Spring_of_Rhein.jpg",
      alt: "Lai da Tuma and its high alpine surroundings",
      width: 6000,
      height: 3375,
      credit: "Christoph Strässler · CC BY-SA 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lai_da_Tuma_(Tomasee)_-_Spring_of_Rhein.jpg",
    },
  ],
  "spot-lac-de-salanfe": [
    {
      id: "img-salanfe-tour-salliere",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Lac_de_salanfe_et_la_tour_saliere.jpg",
      alt: "Lac de Salanfe beneath Tour Sallière",
      width: 3264,
      height: 2448,
      credit: "Superpoor · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lac_de_salanfe_et_la_tour_saliere.jpg",
      isHero: true,
    },
    {
      id: "img-salanfe-dents-du-midi",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Salanfe_et_Dents_du_Midi.jpg",
      alt: "Salanfe basin and the Dents du Midi",
      width: 5200,
      height: 4160,
      credit: "Christian David · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Salanfe_et_Dents_du_Midi.jpg",
    },
    {
      id: "img-salanfe-reservoir",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Lac_de_Salanfe_with_Dents_de_Midi.jpg",
      alt: "Lac de Salanfe reservoir with the Dents du Midi",
      width: 2048,
      height: 1536,
      credit: "PhilippTillmann99 · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lac_de_Salanfe_with_Dents_de_Midi.jpg",
    },
  ],
  "spot-maderanertal-high-trail": [
    {
      id: "img-maderanertal-valley",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Maderanertal.jpg",
      alt: "Mountain landscape in the Maderanertal",
      width: 3648,
      height: 2432,
      credit: "BraunW · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Maderanertal.jpg",
      isHero: true,
    },
    {
      id: "img-maderanertal-high-trail",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/1486-Maderanertal.jpg",
      alt: "Alpine slopes and peaks above the Maderanertal",
      width: 6000,
      height: 4000,
      credit: "FkMohr · CC BY-SA 3.0 de",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:1486-Maderanertal.jpg",
    },
    {
      id: "img-maderanertal-bristen",
      url: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Das_Maderanertal%2C_Bristen_UR_20230825-jag9889.jpg",
      alt: "The Maderanertal above Bristen in canton Uri",
      width: 4608,
      height: 3456,
      credit: "Jag9889 · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Das_Maderanertal,_Bristen_UR_20230825-jag9889.jpg",
    },
  ],
  "spot-speer": [
    {
      id: "img-speer-northeast",
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8b/SpeerBergVonNordosten.jpg",
      alt: "Speer seen from the northeast",
      width: 4032,
      height: 2688,
      credit: "Patrick Kurmann · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SpeerBergVonNordosten.jpg",
      isHero: true,
    },
    {
      id: "img-speer-oberkaeseren",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Speer_Oberk%C3%A4seren.jpg",
      alt: "Speer summit seen from Oberkäseren",
      width: 3264,
      height: 2391,
      credit: "Albinfo · CC0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Speer_Oberk%C3%A4seren.jpg",
    },
    {
      id: "img-speer-southwest",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Der_Speer_aus_S%C3%BCdwesten.JPG",
      alt: "Speer seen from the southwest",
      width: 3984,
      height: 2656,
      credit: "Planomenos · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Der_Speer_aus_S%C3%BCdwesten.JPG",
    },
  ],
  "spot-santis": [
    {
      id: "img-santis-summit",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/dd/S%C3%A4ntis_Bergstation_und_Gipfel_20210812.jpg",
      alt: "Säntis summit, mountain station and broadcasting tower",
      width: 6582,
      height: 4301,
      credit: "Daniel Kraft · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:S%C3%A4ntis_Bergstation_und_Gipfel_20210812.jpg",
      isHero: true,
    },
    {
      id: "img-santis-schwaegalp",
      url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Schw%C3%A4galp-S%C3%A4ntis_-_panoramio_%2838%29.jpg",
      alt: "Säntis above Schwägalp",
      width: 4166,
      height: 2777,
      credit: "Patrick Nouhailler · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Schw%C3%A4galp-S%C3%A4ntis_-_panoramio_(38).jpg",
    },
    {
      id: "img-santis-sunset",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/40/S%C3%A4ntis_mountain_by_sunset.jpg",
      alt: "Säntis mountain at sunset",
      width: 5472,
      height: 3648,
      credit: "B0rder · CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:S%C3%A4ntis_mountain_by_sunset.jpg",
    },
  ],
  "spot-monte-san-salvatore": [
    {
      id: "img-san-salvatore-lugano",
      url: "https://upload.wikimedia.org/wikipedia/commons/7/79/Monte_San_Salvatore_LCD.jpg",
      alt: "Monte San Salvatore rising above Lugano",
      width: 5184,
      height: 3456,
      credit: "Murdockcrc · CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Monte_San_Salvatore_LCD.jpg",
      isHero: true,
    },
    {
      id: "img-san-salvatore-parco-ciani",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Lugano%2C_TI_-_Parco_Ciani_-_Lago_di_Lugano%2C_Monte_San_Salvatore.jpg",
      alt: "Monte San Salvatore and Lake Lugano from Parco Ciani",
      width: 4489,
      height: 3307,
      credit: "Flodur63 · CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lugano,_TI_-_Parco_Ciani_-_Lago_di_Lugano,_Monte_San_Salvatore.jpg",
    },
    {
      id: "img-san-salvatore-summit-view",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/03/View_from_the_Monte_San_Salvatore%2C_Lugano.jpg",
      alt: "View from the summit of Monte San Salvatore",
      width: 4800,
      height: 3200,
      credit: "Nikolai Karaneschev · CC BY 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:View_from_the_Monte_San_Salvatore,_Lugano.jpg",
    },
  ],
};

/**
 * Generated entries come from the exact destination's Wikidata P18 statement
 * and retain the Wikimedia Commons creator, licence and file-description URL.
 * Hand-reviewed entries win when both datasets contain the same location.
 */
const IMAGE_SETS = [
  PERSONAL_LOCATION_IMAGES,
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

import type { Difficulty, LocationSource, Season } from "@/types";
import type { ReviewedLocationEnrichment } from "@/data/reviewed-location-enrichments";

type Source = Omit<LocationSource, "checkedAt">;

interface CatalogueReview {
  id: string;
  tagline: string;
  summary: string;
  routeLabel: string;
  source: Source;
  difficulty?: Difficulty;
  bestSeason?: Season[];
  season?: string;
  distanceKm?: number | null;
  durationMinutes?: number | null;
  ascentM?: number | null;
  descentM?: number | null;
  grade?: string | null;
  startName: string;
  finish?: string | null;
  access: string;
  parking?: string;
  publicTransport?: string;
  accessibility?: string;
  feeInfo?: string;
  highlights: string[];
  tip?: string;
  restrictions?: string[];
  safety?: string[];
  uncertainties?: string[];
  parkingAvailable?: boolean;
  hasPublicTransport?: boolean;
  status?: ReviewedLocationEnrichment["status"];
  statusNote?: string;
}

const commonSafety = [
  "Check weather, trail and transport status with the linked official source on the day of travel.",
  "Follow current signs, barriers and instructions from the responsible local authority.",
];

const mountainSafety = [
  "Conditions can change quickly in the mountains; carry suitable footwear, layers, water and an offline route.",
  ...commonSafety,
];

function official(label: string, url: string): Source {
  return { label, url };
}

function review(item: CatalogueReview): ReviewedLocationEnrichment {
  const hasProfile =
    item.distanceKm != null ||
    item.durationMinutes != null ||
    item.ascentM != null ||
    item.descentM != null;
  const unresolved = item.uncertainties ?? [];
  return {
    tagline: item.tagline,
    description: item.summary,
    longDescription: hasProfile
      ? `${item.summary} The figures below apply only to “${item.routeLabel}”, the named itinerary in the linked official source; the map pin still marks the destination rather than a verified trailhead coordinate.`
      : `${item.summary} The official source does not publish a complete, unambiguous hiking profile for this catalogue point, so unsupported distance, ascent or walking-time figures remain blank.`,
    difficulty: item.difficulty ?? "not-rated",
    bestSeason: item.bestSeason ?? ["check-current"],
    highlights: item.highlights,
    tips: [
      item.tip ?? "Open the linked official source and current timetable before setting out.",
      "Treat the Explore map pin as the destination, not automatically as a parking place or route start.",
    ],
    whatToBring:
      item.difficulty && item.difficulty !== "easy" && item.difficulty !== "not-rated"
        ? ["Hiking footwear", "Weatherproof layers", "Water", "Offline route"]
        : ["Weather protection", "Shoes suited to the selected path"],
    accessInfo: item.access,
    parkingAvailable: item.parkingAvailable ?? true,
    publicTransport: item.hasPublicTransport ?? true,
    status: item.status,
    statusNote: item.statusNote,
    route: {
      label: item.routeLabel,
      season: item.season ?? "Check the current official source; no fixed opening period is claimed",
      distanceKm: item.distanceKm ?? null,
      durationMinutes: item.durationMinutes ?? null,
      ascentM: item.ascentM ?? null,
      descentM: item.descentM ?? null,
      grade: item.grade ?? null,
      startName: item.startName,
      finish: item.finish ?? null,
      parking: item.parking ?? "Use signed public parking for the named start; capacity and charges require a current check.",
      publicTransport: item.publicTransport ?? "Use the current SBB timetable for the named start; no timetable is reproduced here.",
      accessibility: item.accessibility ?? "Accessibility is not established by the reviewed source; do not assume a natural trail is step-free.",
      feeInfo: item.feeInfo ?? "No trail fee is claimed; transport, parking or managed attractions may charge separately.",
      restrictions: item.restrictions ?? ["Respect protected areas, livestock, private land and any temporary trail closure."],
      safety: item.safety ?? (item.difficulty === "easy" ? commonSafety : mountainSafety),
      uncertainties: [
        "An exact route-start coordinate has not been independently stored; directions therefore remain attached to the destination pin.",
        ...unresolved,
      ],
    },
    sources: [item.source],
  };
}

const reviews: CatalogueReview[] = [
  {
    id: "spot-matterhorn",
    tagline: "A signed descent beneath the Matterhorn from Schwarzsee to Furi",
    summary: "The Matterhorn pin identifies the summit; ordinary visitors should not read it as an ascent recommendation. The selected official Matterhorn Trail descends from Schwarzsee to Furi through the landscape below the mountain.",
    routeLabel: "Matterhorn Trail no. 29 — Schwarzsee to Furi",
    source: official("Zermatt Tourism — Matterhorn Trail no. 29", "https://zermatt.swiss/en/p/matterhorn-trail-no-29-01tVj000005EvgPIAS"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "Snow-free summer and autumn operating season", distanceKm: 7.4, durationMinutes: 120, descentM: 746,
    startName: "Schwarzsee mountain station", finish: "Furi", access: "Reach Schwarzsee by the operating Zermatt mountain lift; the sourced hike finishes at Furi.",
    parking: "Zermatt is car-free; use official parking in Täsch and continue by rail.", publicTransport: "Rail to Zermatt, then local connection and mountain lift to Schwarzsee.",
    accessibility: "Mountain trail with a long descent; not step-free.", highlights: ["Matterhorn views", "Schwarzsee", "Zermatt mountain landscape"],
    safety: ["This is not a Matterhorn summit route; alpinism on the mountain requires separate expert planning.", ...mountainSafety],
  },
  {
    id: "spot-jungfraujoch",
    tagline: "A high-alpine snow path from Jungfraujoch to Mönchsjochhütte",
    summary: "Jungfraujoch is a rail-accessed high-alpine destination. The operator marks a separate path across snow to Mönchsjochhütte and warns that it can close for avalanche, crevasse or storm risk.",
    routeLabel: "Jungfraujoch–Mönchsjochhütte return path", source: official("Jungfrau Railways — Mönchsjochhütte path", "https://www.jungfrau.ch/en-gb/jungfraujoch-top-of-europe/moenchsjochhuette/"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], season: "Usually mid-May to mid-October when the marked path is open", durationMinutes: 120, ascentM: 200, descentM: 200,
    startName: "Jungfraujoch station / Sphinx access area", finish: "Jungfraujoch", access: "Travel by the operating Jungfrau Railway via Eigergletscher; there is no road access to Jungfraujoch.",
    parking: "Use official valley parking only; Jungfraujoch itself has no car access.", publicTransport: "Rail via Interlaken Ost, Grindelwald Terminal or Lauterbrunnen/Wengen and Eigergletscher.",
    accessibility: "The snow path is high-alpine and not wheelchair suitable.", feeInfo: "The path has no separate fee listed; Jungfrau Railway travel is ticketed.", highlights: ["Aletsch high-alpine landscape", "Mönchsjochhütte", "Glacier views"],
    safety: ["Use only the prepared, open path; do not leave it because crevasses can be hidden by snow.", "Altitude can affect visitors even without strenuous walking.", ...mountainSafety],
  },
  {
    id: "spot-rigi",
    tagline: "A barrier-free panorama trail from Rigi Kaltbad to Rigi Scheidegg",
    summary: "Rigi is a mountain region with several access railways. The selected official panorama trail follows the former railway line between Rigi Kaltbad and Rigi Scheidegg/Burggeist.",
    routeLabel: "Rigi Kaltbad–Rigi Scheidegg panorama trail", source: official("Rigi — Summer Explorer Guide", "https://www.rigi.ch/_Resources/Persistent/37cdc2396b31441ba25aa36f51fc740ed31d6b1b/Rigi%20Explorer%20Guide%20Summer.pdf"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], season: "Snow-free season; check railway and trail status", distanceKm: 7.1, durationMinutes: 110,
    startName: "Rigi Kaltbad station", finish: "Rigi Scheidegg / Burggeist", access: "Use the operating Rigi mountain railway or cableway to Rigi Kaltbad; return options depend on the current timetable.",
    parking: "Use official valley-station parking; the mountain route itself is car-free.", publicTransport: "Mountain railway/cableway connections via Vitznau, Arth-Goldau or Weggis, then current return connection.",
    accessibility: "The official guide identifies this panorama trail as barrier-free; verify current surface and transport accessibility.", highlights: ["Lake Lucerne panorama", "Former railway alignment", "Rigi Scheidegg"],
  },
  {
    id: "spot-aletsch-glacier",
    tagline: "A sourced Moosfluh circuit overlooking the Great Aletsch Glacier",
    summary: "The Great Aletsch Glacier is viewed from several ridges in the car-free Aletsch Arena. The selected official circuit begins and ends at the Moosfluh mountain station.",
    routeLabel: "Aletsch Glacier viewpoint circuit from Moosfluh", source: official("Aletsch Arena — glacier viewpoint circuit", "https://willkommen.aletscharena.ch/de/aletscharena/streaming/detail/Tour/t_100298141/aletschgletscher-aussichtsweg"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "Snow-free summer and autumn while mountain transport operates", distanceKm: 6.8, durationMinutes: 170, ascentM: 399, descentM: 399,
    startName: "Moosfluh mountain station", finish: "Moosfluh mountain station", access: "Reach the car-free Aletsch Arena by rail and cableway, then use the operating Moosfluh lift.",
    parking: "Use designated valley parking; the plateau villages are car-free.", publicTransport: "Rail to Mörel or Betten valley stations, then cableways and local mountain transport to Moosfluh.",
    accessibility: "Natural mountain trail; not step-free.", highlights: ["Great Aletsch Glacier", "Moosfluh ridge", "UNESCO Jungfrau-Aletsch landscape"],
    safety: ["Do not approach glacier ice or unstable moraine beyond signed paths.", ...mountainSafety],
  },
  {
    id: "spot-gornergrat",
    tagline: "A mountain trail from Gornergrat down to Riffelberg",
    summary: "Gornergrat is a rail-accessed viewpoint above Zermatt. The selected official Mountain Mind Trail descends towards Riffelberg; it is not a route from the destination pin to the glacier.",
    routeLabel: "Mountain Mind Trail no. 90 — Gornergrat to Riffelberg", source: official("Zermatt Tourism — Mountain Mind Trail no. 90", "https://zermatt.swiss/en/p/mountain-mind-trail-no-90-01tVj000005Ew1NIAS"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "Snow-free season while the Gornergrat Railway and trail operate", distanceKm: 4.9, durationMinutes: 95,
    startName: "Gornergrat railway station", finish: "Riffelberg", access: "Take the Gornergrat Railway from car-free Zermatt to the named start.",
    parking: "Park in Täsch and continue by rail; Zermatt is car-free.", publicTransport: "Rail to Zermatt, then Gornergrat Railway to Gornergrat; return from Riffelberg.", accessibility: "Mountain trail; not step-free.", highlights: ["Matterhorn panorama", "Gorner Glacier views", "Riffelberg"],
  },
  {
    id: "spot-riffelsee",
    tagline: "The official Riffelsee trail from Rotenboden to Riffelberg",
    summary: "Riffelsee is a small alpine lake reached from the Gornergrat railway. The sourced route passes the lake between Rotenboden and Riffelberg.",
    routeLabel: "Riffelseeweg no. 21 — Rotenboden to Riffelberg", source: official("Zermatt Tourism — Riffelseeweg no. 21", "https://zermatt.swiss/en/p/riffelseeweg-no-21-01tVj000005Ew9KIAS"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "Snow-free season while the railway and trail operate", distanceKm: 2.9, durationMinutes: 60,
    startName: "Rotenboden railway station", finish: "Riffelberg", access: "Use the Gornergrat Railway from Zermatt to Rotenboden; return from Riffelberg.",
    parking: "Park in Täsch and continue by rail; Zermatt is car-free.", publicTransport: "Rail to Zermatt, then Gornergrat Railway to Rotenboden.", accessibility: "Natural mountain path; no step-free claim.", highlights: ["Matterhorn reflection at Riffelsee", "Gornergrat landscape", "Riffelberg"],
  },
  {
    id: "spot-schilthorn",
    tagline: "A summit destination reached by mountain transport, with route choice required",
    summary: "Schilthorn is a high mountain destination above Mürren. The operator publishes a network of separate walks around Birg, Mürren and Allmendhubel; no single summit hike is represented by the map pin.",
    routeLabel: "Destination visit — select an open Schilthorn-area route", source: official("Schilthorn — official summer guide", "https://schilthorn.ch/cmsfiles/posts/documents/sommerguide_2025_d_e_f.pdf"),
    difficulty: "not-rated", bestSeason: ["check-current"], startName: "Choose a named route and operating mountain station", access: "Use public transport and the current Schilthorn cableway system via Mürren; construction phases can change the connection.",
    parking: "Mürren is car-free; use official valley parking and public transport.", publicTransport: "Rail/PostBus and cableway via Lauterbrunnen/Grütschalp or Stechelberg, subject to current operations.", accessibility: "Station and attraction access differs from mountain-trail accessibility; check the operator's current accessibility information.", feeInfo: "Mountain transport and summit attractions are ticketed.", highlights: ["Bernese Alps panorama", "Birg ridge", "Schilthorn summit"], uncertainties: ["A single official hiking profile was not selected because the summit pin is not a trailhead."],
  },
  {
    id: "spot-schynige-platte",
    tagline: "An official panorama circuit from Schynige Platte mountain station",
    summary: "Schynige Platte is reached by seasonal cogwheel railway from Wilderswil. The official panorama hike starts and finishes by the mountain restaurant.",
    routeLabel: "Schynige Platte panorama hike", source: official("Jungfrau Railways — Schynige Platte panorama hike", "https://www.jungfrau.ch/en-gb/schynige-platte/panorama-hike/"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "13 June–25 October 2026, subject to railway and trail status", durationMinutes: 150,
    startName: "Schynige Platte mountain restaurant / station area", finish: "Schynige Platte", access: "Take the seasonal cogwheel railway from Wilderswil to Schynige Platte.",
    parking: "Use signed parking at Wilderswil; no road reaches the mountain route start.", publicTransport: "Rail to Wilderswil, then Schynige Platte Railway.", accessibility: "Mountain trail; not step-free.", feeInfo: "Trail has no separate fee; mountain railway is ticketed.", highlights: ["Lake Thun and Brienz views", "Alpine garden area", "Eiger–Mönch–Jungfrau panorama"],
  },
  {
    id: "spot-aare-gorge",
    tagline: "A managed gorge walkway with two separate entrances",
    summary: "Aare Gorge is a ticketed walkway between the west and east entrances near Meiringen. It is an attraction route with seasonal opening, not an unrestricted hiking trail.",
    routeLabel: "Aare Gorge managed walkway", source: official("Aare Gorge — official visitor facts", "https://aareschlucht.ch/cmsfiles/1400_zeichen_website.pdf"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], season: "Generally early April to 1 November; verify the current opening calendar", distanceKm: 1.4, durationMinutes: 45, startName: "Aare Gorge west entrance", finish: "East entrance", access: "The official facts describe rail access and parking at the west entrance; opening of each entrance can differ by season.",
    parking: "Official parking is available at the west entrance; check current capacity.", publicTransport: "Meiringen–Innertkirchen Railway serves the gorge approaches; check the current timetable.", accessibility: "The official facts describe the west entrance to the main attractions as wheelchair and pushchair accessible; the whole through-route is not claimed step-free.", feeInfo: "Admission is charged; the official facts say the local rail return is included, but current terms and prices must be checked.", highlights: ["Narrow limestone gorge", "Secured galleries", "Aare river"], restrictions: ["Enter only during published opening hours and remain on the managed walkway."], safety: ["Walkways can be wet and cool even in warm weather.", ...commonSafety], uncertainties: ["Current admission price is intentionally not reproduced because it can change."],
  },
  {
    id: "spot-rhine-gorge-ruinaulta",
    tagline: "A protected gorge where route choice matters",
    summary: "Ruinaulta is a broad Rhine-gorge landscape with several rail-accessed hikes. The regional tourism authority states that there is no continuous riverside trail between Versam and Trin because of nature protection.",
    routeLabel: "Ruinaulta destination — choose a named official gorge hike", source: official("Graubünden Tourism — Rhine Gorge / Ruinaulta", "https://www.graubuenden.ch/en/tours/rhine-gorgeruinaulta-ilanz-reichenau"),
    difficulty: "not-rated", bestSeason: ["spring", "summer", "autumn"], startName: "Choose an official station-to-station Rhine Gorge route", access: "Use the Rhaetian Railway stations and official route descriptions; the representative gorge pin is not an access point.",
    parking: "Route-specific; rail is recommended for one-way gorge walks.", publicTransport: "Rhaetian Railway serves Ilanz, Versam-Safien, Valendas-Sagogn, Trin and Reichenau-Tamins.", accessibility: "Varies by selected path; no gorge-wide step-free claim.", highlights: ["Rhine Gorge cliffs", "Rhaetian Railway", "Protected riverside habitat"], restrictions: ["Do not attempt a nonexistent riverside passage between Versam and Trin; use marked routes and respect nature-protection closures."], uncertainties: ["A single route profile is deliberately omitted because Ruinaulta contains several distinct hikes."],
  },
  {
    id: "spot-caumasee",
    tagline: "A managed lake destination near Flims with seasonal access controls",
    summary: "Caumasee is a forest lake below Flims Waldhaus. Access, bathing operations and the lift can be seasonal; the lake-centre pin is not the entrance or car park.",
    routeLabel: "Caumasee destination visit from Flims Waldhaus", source: official("Flims Laax — Lake Cauma visitor information", "https://www.flimslaax.com/en/outdoor-activities/mountain-lakes/lake-cauma"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], startName: "Flims Waldhaus / signed Caumasee approach", access: "Approach on signed forest paths from Flims Waldhaus; check the current local shuttle, lift and bathing information.",
    parking: "Use public parking in Flims; the forest/lake approach is not a visitor road.", publicTransport: "PostBus to Flims Waldhaus, then follow the signed walking approach.", accessibility: "The lift and paths have seasonal and surface limitations; verify current step-free access.", feeInfo: "Seasonal bathing admission or services may be charged; check the official page.", highlights: ["Turquoise forest lake", "Flims forest", "Swimming area when open"], restrictions: ["Follow bathing, fire and nature-protection notices around the lake."], uncertainties: ["No complete route distance or elevation profile is claimed for the destination visit."],
  },
  {
    id: "spot-swiss-national-park",
    tagline: "The official Alp Trupchun route under strict national-park rules",
    summary: "Swiss National Park protects a large high-alpine area, so one pin cannot represent every entrance. The selected official Alp Trupchun hike is paired with the park's binding visitor rules.",
    routeLabel: "Alp Trupchun official park route", source: official("Swiss National Park — trails and routes", "https://nationalpark.ch/en/visit/trails-routes/"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], season: "Hiking season is generally mid-May to mid-November, depending on altitude and conditions", distanceKm: 14, durationMinutes: 240,
    startName: "Official Alp Trupchun route start shown by the park", finish: "Same route area / follow official itinerary", access: "Use the route-specific park directions and current public-transport timetable; the catalogue pin represents the park, not the trailhead.",
    parking: "Only designated parking outside or at permitted access points; spaces are limited.", publicTransport: "The park recommends public transport; use the route-specific PostBus stop in its planner.", accessibility: "Park paths are not suitable for wheelchairs or pushchairs according to the visitor information.", feeInfo: "No general park entrance fee is published; transport and visitor-centre services may be separate.", highlights: ["Alp Trupchun wildlife habitat", "Strictly protected landscape", "Marked park trail"], restrictions: ["Remain on marked paths and official rest areas.", "No dogs, even on a lead; no fires, bathing, cycling, drones, camping or removing natural objects.", "The park may only be visited during daytime and is closed to hiking in winter."], safety: ["Mobile coverage is incomplete; carry the route and emergency information offline.", ...mountainSafety],
  },
  {
    id: "spot-ponte-dei-salti",
    tagline: "An official riverside hike from Lavertezzo to Brione",
    summary: "Ponte dei Salti is the historic double-arched bridge at Lavertezzo. The selected regional route follows the Verzasca valley from Lavertezzo to Brione rather than treating the bridge pin as the complete hike.",
    routeLabel: "Lavertezzo–Brione Verzasca hike", source: official("Ascona-Locarno — Lavertezzo to Brione", "https://www.ascona-locarno.com/en/hike/details/Lavertezzo-Brione-Verzasca/43157907"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], distanceKm: 6.6, durationMinutes: 120, ascentM: 225, descentM: 0,
    startName: "Lavertezzo", finish: "Brione Verzasca", access: "Use the valley PostBus or signed public parking in Lavertezzo; plan the one-way return before starting.",
    parking: "Use signed paid parking; spaces and local controls can be strict.", publicTransport: "PostBus serves Lavertezzo and Brione Verzasca; check the current timetable.", accessibility: "Natural riverside route; not step-free.", highlights: ["Ponte dei Salti", "Verzasca river", "Stone villages"], safety: ["The Verzasca can be lethal after rain or releases; obey every bathing warning and never infer safety from clear water.", ...commonSafety],
  },
  {
    id: "spot-gruyeres",
    tagline: "An official one-way walk from Charmey to medieval Gruyères",
    summary: "Gruyères is a medieval hill town and the finish of several regional routes. The selected Chemin du Gruyère currently uses a signed detour because the Jogne Gorges are closed in 2026.",
    routeLabel: "Chemin du Gruyère — Charmey to Gruyères", source: official("La Gruyère Tourism — Chemin du Gruyère", "https://fribourg.ch/en/la-gruyere/hiking/chemin-du-gruyere-charmey-gruyeres/"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], season: "Snow-free season; 2026 route follows the published gorge-closure detour", distanceKm: 11, durationMinutes: 195, ascentM: 452, descentM: 408,
    startName: "Charmey, Village", finish: "Gruyères", access: "The official route is one-way between public-transport stops at Charmey and Gruyères.",
    parking: "Car access exists, but a one-way walk is best planned with public transport.", publicTransport: "Bus to Charmey, Village; return from Gruyères, gare.", accessibility: "Mixed natural paths and gradients; not step-free.", highlights: ["Gruyères old town", "Lake Montsalvens landscape", "Regional heritage"], restrictions: ["The Gorges de la Jogne are closed in 2026; follow the official detour rather than old route files."],
  },
  {
    id: "spot-trummelbach-falls",
    tagline: "A seasonal, ticketed walkway through ten glacial waterfalls",
    summary: "Trümmelbach Falls is a managed attraction inside the mountain near Lauterbrunnen. Its tunnel lift, galleries and steps are not an open hiking route.",
    routeLabel: "Trümmelbach Falls managed visitor walkway", source: official("Trümmelbach Falls — official visitor information", "https://www.truemmelbachfaelle.ch/e/index.html"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], season: "Generally early April to November, weather permitting; verify exact dates and hours", distanceKm: 0.6,
    startName: "Trümmelbach Falls entrance", finish: "Entrance", access: "Use the official entrance in Lauterbrunnen valley; check the local bus and current attraction opening before travel.",
    parking: "Use the attraction's signed parking; capacity is not guaranteed.", publicTransport: "Local bus from Lauterbrunnen towards Stechelberg; use the current timetable and nearest named stop.", accessibility: "The route includes many stairs, galleries and wet surfaces; the lift does not make the full visit step-free.", feeInfo: "Admission is charged; current prices are available from the operator.", highlights: ["Ten glacial waterfalls", "Tunnel lift", "Rock galleries"], restrictions: ["Babies and children under four, and dogs, are not admitted for safety reasons."], safety: ["Expect loud water, low light, cool temperatures and wet stairs; hold handrails.", ...commonSafety],
  },
  {
    id: "spot-gelmersee",
    tagline: "A high mountain lake reached by the steep Gelmerbahn and mountain paths",
    summary: "Gelmersee lies above Handegg and is commonly reached by the seasonal Gelmerbahn. The official map marks the lake circuit as a mountain trail with narrow and exposed sections.",
    routeLabel: "Gelmersee mountain-lake visit and signed circuit", source: official("Grimselwelt — official area map", "https://www.grimselwelt.ch/media/grimselkarte_2025_dfe.pdf"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], season: "Summer operating season, only in snow-free safe conditions", startName: "Gelmerbahn upper station", finish: "Gelmerbahn upper station", access: "Reach Handegg by seasonal PostBus or road, then use the ticketed Gelmerbahn if operating.",
    parking: "Use designated Handegg/Gelmerbahn parking; reserve transport as required.", publicTransport: "Seasonal PostBus to Handegg, Gelmerbahn; verify connections.", accessibility: "Steep mountain paths and exposed shoreline sections; not step-free.", feeInfo: "Gelmerbahn is ticketed; reservations may be required.", highlights: ["Gelmersee", "Gelmerbahn", "Grimsel granite landscape"], safety: ["The lake circuit includes narrow, exposed terrain and can retain snowfields into early summer.", ...mountainSafety], uncertainties: ["A single distance/ascent profile is not published clearly enough in the reviewed map to reproduce."],
  },
  {
    id: "spot-engstligen-falls",
    tagline: "A steep mountain path beside the Engstligen Falls",
    summary: "The Engstligen Falls drop from Engstligenalp above Adelboden. The official destination material distinguishes the lower viewpoint from the steep mountain path between Unter dem Birg and the alp.",
    routeLabel: "Engstligen Falls destination and mountain path from Unter dem Birg", source: official("Adelboden-Lenk-Kandersteg — Engstligen Falls", "https://adelboden-lenk-kandersteg.ch/en/places/poi/detail/engstlige-falls"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], season: "Snow-free summer season; check cableway and mountain-path status", startName: "Unter dem Birg valley station / signed falls approach", finish: "Engstligenalp for the full mountain path", access: "Bus or road from Adelboden to Unter dem Birg; the lower falls viewpoint and steep ascent are different undertakings.",
    parking: "Use official valley-station parking.", publicTransport: "Bus from Adelboden to Unter dem Birg during the operating season.", accessibility: "Lower access and the steep mountain path differ; the ascent beside the falls is not step-free.", highlights: ["Engstligen Falls", "Engstligenalp plateau", "Cliff-side mountain path"], safety: ["The mountain ascent beside the falls is steep and unsuitable in snow, ice or poor visibility.", ...mountainSafety], uncertainties: ["The reviewed source does not publish a complete distance, time and ascent profile for the selected path."],
  },
  {
    id: "spot-lauenensee",
    tagline: "An easy official circuit around protected Lauenensee",
    summary: "Lauenensee is a protected lake above Lauenen. Gstaad's official lake circuit starts by the lake and can be reached by seasonal PostBus or road.",
    routeLabel: "Lauenensee circular walk", source: official("Gstaad — mountain waters and Lauenensee circuit", "https://www.gstaad.ch/en/summer/experience-enjoy/mountain-waters"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], season: "Snow-free season; check seasonal bus and road information", distanceKm: 3.1, durationMinutes: 45, ascentM: 23, descentM: 23,
    startName: "Lauenensee parking / PostBus stop", finish: "Lauenensee", access: "Use the seasonal PostBus from Lauenen/Gstaad or the controlled road to the paid lake parking.",
    parking: "Paid parking near the lake; capacity and road access can be limited.", publicTransport: "Seasonal PostBus to Lauenensee; check operating dates.", accessibility: "Mostly gentle natural lake path, but no universal step-free claim is made.", highlights: ["Lauenensee shoreline", "Nature reserve", "Waterfall and mountain views"], restrictions: ["Remain on paths and respect nature-reserve and bathing notices."],
  },
  {
    id: "spot-saut-du-doubs",
    tagline: "An official walk from Les Brenets to the Doubs waterfall",
    summary: "Saut du Doubs is a cross-border waterfall on the Doubs. The selected Jura & Three-Lakes route begins in Les Brenets and follows the river landscape to the falls.",
    routeLabel: "Les Brenets–Saut du Doubs", source: official("Jura & Three-Lakes — Saut du Doubs walk", "https://www.j3l.ch/fr/V2181/a-faire/sport-loisirs/randonnee/saut-du-doubs"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], distanceKm: 5, durationMinutes: 75, ascentM: 133, descentM: 116,
    startName: "Les Brenets", finish: "Saut du Doubs", access: "Reach Les Brenets by regional public transport or road and plan the return from the falls before departure.",
    parking: "Use signed public parking in Les Brenets.", publicTransport: "Regional train/bus connections to Les Brenets; seasonal boat options require a separate timetable check.", accessibility: "Natural riverside path; no step-free claim.", highlights: ["Saut du Doubs", "Doubs river", "Forest gorge"], safety: ["River levels and trail surfaces change after rainfall; obey barriers and navigation notices.", ...commonSafety],
  },
  {
    id: "spot-etang-de-la-gruere",
    tagline: "A short official circuit around a protected peatland lake",
    summary: "Étang de la Gruère is a protected raised-bog landscape in the Franches-Montagnes. The official circuit uses natural paths and boardwalks around the pond.",
    routeLabel: "Étang de la Gruère circuit", source: official("Jura & Three-Lakes — Étang de la Gruère", "https://www.j3l.ch/en/P33241/destinations/nature-sites/etang-de-la-gruere"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], distanceKm: 2.8, durationMinutes: 55,
    startName: "La Theurre or Moulin de la Gruère approach", finish: "Same selected approach", access: "Use bus line 32 to La Theurre or Moulin de la Gruère, or one of the signed paid car parks.",
    parking: "Two paid official car parks serve the reserve approaches.", publicTransport: "Bus line 32 to La Theurre or Moulin de la Gruère; check current service.", accessibility: "Natural peatland paths and boardwalks; verify current mobility access.", highlights: ["Raised bog", "Boardwalks", "Étang de la Gruère"], restrictions: ["Remain on marked paths and boardwalks to protect the sensitive peatland."], safety: ["Winter ice is not monitored and must not be treated as safe.", ...commonSafety],
  },
  {
    id: "spot-chasseral",
    tagline: "The official Chasseral ridge circuit through Jura pasture",
    summary: "Chasseral is a Jura summit landscape with a road, seasonal bus and several paths. The selected official circuit starts by Hôtel Chasseral and follows the ridge route.",
    routeLabel: "Chemin de Chasseral circuit", source: official("Jura & Three-Lakes — Chemin de Chasseral", "https://www.j3l.ch/de/V2878/erlebnisse/sport-freizeit/wandern/chemin-de-chasseral"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], distanceKm: 13, durationMinutes: 229, ascentM: 540, descentM: 540,
    startName: "Hôtel Chasseral / official route start", finish: "Hôtel Chasseral", access: "Road and seasonal public transport reach the summit area; verify the current bus and road status.",
    parking: "Use signed summit-area parking; capacity and seasonal road conditions vary.", publicTransport: "Seasonal bus service reaches Chasseral; check operating days and reservations.", accessibility: "Pasture and ridge paths; not step-free.", highlights: ["Jura ridge", "Three Lakes panorama", "Chasseral transmitter"], safety: ["The exposed ridge is vulnerable to fog, wind, thunderstorms and winter ice.", ...mountainSafety],
  },
  {
    id: "spot-lac-de-joux",
    tagline: "The official full circuit of Lac de Joux from Le Sentier",
    summary: "Lac de Joux is the largest lake in the Jura massif. The official circuit starts in Le Sentier and links villages, reedbeds, beaches and both shores.",
    routeLabel: "Tour du Lac de Joux", source: official("Vallée de Joux Tourism — Tour du Lac de Joux", "https://www.myvalleedejoux.ch/en/V1451/le-tour-du-lac-de-joux"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], distanceKm: 25.6, durationMinutes: 380, ascentM: 230, descentM: 230,
    startName: "Le Sentier", finish: "Le Sentier", access: "Le Sentier is served by regional rail; shorter one-way shore sections can be paired with public transport.",
    parking: "Use signed village parking; the full circuit is long and public transport offers shorter variants.", publicTransport: "Regional rail serves Le Sentier, Le Pont and other lake villages.", accessibility: "Long mixed-surface circuit; no full-route step-free claim.", highlights: ["Both shores of Lac de Joux", "Reedbeds and beaches", "Jura villages"], safety: ["Never enter an iced lake unless authorities have explicitly opened and monitored it.", ...commonSafety],
  },
  {
    id: "spot-dent-de-vaulion",
    tagline: "A Jura summit with several starts—choose the route before travelling",
    summary: "Dent de Vaulion overlooks Lac de Joux. Vaud Tourism describes approaches from Le Pont and Pétra-Félix but does not publish one universal route profile on the destination page.",
    routeLabel: "Dent de Vaulion destination — select the Le Pont or Pétra-Félix route", source: official("Vaud Tourism — Dent de Vaulion", "https://www.vaud.ch/en/tourism/activites/dent-de-vaulion/"),
    difficulty: "not-rated", bestSeason: ["spring", "summer", "autumn"], startName: "Le Pont or Pétra-Félix, after selecting an official route", access: "Regional rail reaches Le Pont; the seasonal road to the mountain restaurant is a dead end and is not a through route.",
    parking: "Route-specific signed parking; do not treat the summit pin as a car destination.", publicTransport: "Regional rail to Le Pont for a foot approach.", accessibility: "Summit hiking routes are not step-free.", highlights: ["Lac de Joux panorama", "Jura summit pasture", "Dent de Vaulion ridge"], uncertainties: ["Distance, duration and ascent remain unresolved until one of the official approaches is selected."],
  },
  {
    id: "spot-lac-des-chavonnes",
    tagline: "A short signed lake approach from Bretaye",
    summary: "Lac des Chavonnes is an alpine lake above Villars. Vaud Tourism describes it as about a 30-minute walk from the Bretaye cogwheel-railway terminus.",
    routeLabel: "Bretaye–Lac des Chavonnes approach", source: official("Vaud Tourism — Lac des Chavonnes", "https://www.vaud.ch/en/tourism/activites/lac-des-chavonnes/"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], durationMinutes: 30, startName: "Bretaye railway terminus", finish: "Lac des Chavonnes", access: "Take the cogwheel railway from Villars to Bretaye, then follow the signed wide path to the lake.",
    parking: "Use official parking in Villars; the practical approach uses the cogwheel railway.", publicTransport: "Rail/bus to Villars-sur-Ollon, then cogwheel railway to Bretaye.", accessibility: "Wide mountain path, but gradients and surface mean step-free access is not claimed.", highlights: ["Lac des Chavonnes", "Bretaye mountain railway", "Villars alpine landscape"], uncertainties: ["The cited destination page does not publish distance or ascent."],
  },
  {
    id: "spot-rochers-de-naye",
    tagline: "A sourced mountain walk between Rochers-de-Naye and Jaman",
    summary: "Rochers-de-Naye is reached by mountain railway from Montreux. The selected official summer walk links the summit station area with Jaman and avoids the currently closed interior Naye-caves route.",
    routeLabel: "Rochers-de-Naye–Jaman summer route", source: official("Montreux Riviera — Rochers-de-Naye to Jaman", "https://www.montreuxriviera.com/en/V3047/rochers-de-naye-jaman-in-summer"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], distanceKm: 2.7, durationMinutes: 90, ascentM: 391, descentM: 146,
    startName: "Rochers-de-Naye railway station", finish: "Jaman", access: "Take the mountain railway from Montreux; verify which intermediate stops and return trains operate.",
    parking: "Use public parking in Montreux; mountain access is by rail.", publicTransport: "Train from Montreux to Rochers-de-Naye; return planning is route-specific.", accessibility: "Mountain path; not step-free.", highlights: ["Lake Geneva panorama", "Rochers-de-Naye summit", "Jaman"], restrictions: ["The interior Naye Caves route is closed until further notice due to unstable ground; use the published alternative route."],
  },
  {
    id: "spot-mont-vully",
    tagline: "An official circuit from Sugiez through vineyards and Mont Vully",
    summary: "Mont Vully rises between Lakes Murten and Neuchâtel. The official circuit combines vineyard, botanical and historical paths and can start from Sugiez station or the Praz/Môtier boat landings.",
    routeLabel: "Mont Vully circuit from Sugiez", source: official("Region Murtensee — Hike on Mont Vully", "https://fribourg.ch/en/regionmurtensee/hiking/hike-on-the-mont-vully/"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], distanceKm: 11, durationMinutes: 195, ascentM: 327, descentM: 327,
    startName: "Sugiez railway station", finish: "Sugiez railway station", access: "Start by train at Sugiez or adapt the official route from Praz/Môtier boat landings.",
    parking: "Car access exists, but the official route is well suited to rail or boat arrival.", publicTransport: "Train to Sugiez or seasonal boat to Praz/Môtier.", accessibility: "Mixed vineyard and forest paths with a relatively steep botanical section; not step-free.", highlights: ["Three Lakes panorama", "Vully vineyards", "Historic fortifications and caves"],
  },
  {
    id: "spot-schwarzsee",
    tagline: "An easy official circuit around Schwarzsee",
    summary: "Schwarzsee is a mountain lake in the Fribourg Prealps. The official lake path starts by Gypsera and makes a gentle circuit of the shore.",
    routeLabel: "Schwarzsee lake path", source: official("Fribourg Region — Schwarzsee lake path", "https://fribourg.ch/en/schwarzsee/hiking/schwarzsee-the-lake-path/"),
    difficulty: "easy", bestSeason: ["year-round"], distanceKm: 4, durationMinutes: 75, ascentM: 50, descentM: 50,
    startName: "Schwarzsee, Gypsera", finish: "Schwarzsee, Gypsera", access: "Bus and road access reach the Gypsera area at Schwarzsee.",
    parking: "Use signed paid parking around Gypsera/Schwarzsee.", publicTransport: "Bus to Schwarzsee, Gypsera; check current service.", accessibility: "Gentle lakeside route, but surface and winter conditions require a current accessibility check.", highlights: ["Schwarzsee shoreline", "Fribourg Prealps", "Family lake circuit"], safety: ["In winter, use maintained paths and enter lake ice only if authorities explicitly declare it safe.", ...commonSafety],
  },
  {
    id: "spot-gorges-de-la-jogne",
    tagline: "A gorge destination currently closed in 2026",
    summary: "Gorges de la Jogne is a seasonal path between Broc and Châtel-sur-Montsalvens. The regional tourism authority states that the gorge is closed in 2026 and publishes detours for affected routes.",
    routeLabel: "Gorges de la Jogne — under closure review", source: official("La Gruyère Tourism — Chemin du Gruyère closure notice", "https://fribourg.ch/en/la-gruyere/hiking/chemin-du-gruyere-charmey-gruyeres/"),
    status: "closed", statusNote: "The responsible regional tourism organisation states that the gorge path is closed in 2026. A later reopening has not been verified.",
    difficulty: "not-rated", bestSeason: ["check-current"], season: "Closed in 2026; do not enter unless the responsible authority officially reopens it", startName: "No active trail start while the gorge is closed", access: "Do not navigate to the gorge as an open hike. Use the current official detour information for nearby routes.",
    parking: "No parking recommendation is made for a closed route.", publicTransport: "Use current public transport only for an alternative officially open route.", accessibility: "Closed; no accessibility claim.", feeInfo: "Not applicable while closed.", highlights: ["Jogne river gorge", "Rock galleries", "Lake Montsalvens area"], restrictions: ["The Gorges de la Jogne path is closed in 2026; barriers and detours must be respected."], safety: ["Do not bypass closure barriers; rockfall and maintenance hazards may not be visible.", ...commonSafety], uncertainties: ["A reopening date after 2026 has not been verified."], parkingAvailable: false,
  },
  {
    id: "spot-lac-de-taney",
    tagline: "The official Lac de Taney circuit from Miex",
    summary: "Lac de Taney lies in a protected mountain basin above Vouvry. The official Valais route begins east of Miex and includes the steep approach and a circuit near the lake.",
    routeLabel: "Chemin du Lac de Taney", source: official("Valais — Chemin du Lac de Taney", "https://www.valais.ch/fr/explorer/activites/randonnees/itineraires/chemin-du-lac-de-taney"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], distanceKm: 8.59, durationMinutes: 185,
    startName: "Le Vésenand / Miex official route start", finish: "Le Vésenand / Miex", access: "Approach from Vouvry to Miex/Le Vésenand; road and parking are constrained, so consult current local access information.",
    parking: "Parking near the start is limited; the official source recommends considering Vouvry and current bus access.", publicTransport: "Seasonal/local bus connections vary; check the current timetable to Miex/Le Flon.", accessibility: "Steep natural mountain route; not step-free.", highlights: ["Lac de Taney", "Protected basin", "Chablais peaks"], restrictions: ["Motor access beyond authorised points is restricted; respect reserve rules."], uncertainties: ["Ascent and descent were not reliably extracted from the reviewed official page and remain blank."],
  },
  {
    id: "spot-derborence",
    tagline: "An official circuit through the Derborence rockslide landscape",
    summary: "Derborence is a national nature reserve shaped by historic rockslides. The sourced circuit starts beside Lac de Derborence and links the debris landscape, old forest and lakeshore.",
    routeLabel: "Tour de l’éboulement des Diablerets", source: official("Valais — Derborence rockslide circuit", "https://www.valais.ch/en/explore/activities/hiking/hikes/tour-de-l-eboulement-des-diablerets"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], season: "Road closed from early November to the end of April; PostBus is seasonal", distanceKm: 6.61, durationMinutes: 125, ascentM: 330, descentM: 330,
    startName: "Derborence parking / bus stop", finish: "Derborence parking / bus stop", access: "The only road is narrow and winding; seasonal PostBus runs from Sion via Conthey according to the current timetable.",
    parking: "Parking near Lac de Derborence or below the Godey reservoir.", publicTransport: "Seasonal PostBus, generally daily late June–late September and weekends in October; verify the current year.", accessibility: "Natural reserve paths; not step-free.", highlights: ["Lac de Derborence", "Historic rockslide deposits", "Old-growth forest"], safety: ["The access road is narrow with tunnels; drive defensively or use the seasonal PostBus.", ...mountainSafety],
  },
  {
    id: "spot-lac-de-moiry",
    tagline: "The official high-alpine circuit around Lac de Moiry",
    summary: "Lac de Moiry is a reservoir above Grimentz. The official Valais circuit begins on the dam crest and follows a demanding high-altitude route around the lake.",
    routeLabel: "Tour du Lac de Moiry", source: official("Valais — Tour du Lac de Moiry", "https://www.valais.ch/en/explore/activities/hiking/hikes/tour-du-lac-de-moiry"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], season: "Usually late June until first snow, depending on road and trail conditions", distanceKm: 13.36, durationMinutes: 275, ascentM: 805, descentM: 805,
    startName: "Moiry dam crest", finish: "Moiry dam crest", access: "Seasonal PostBus and road access reach the dam above Grimentz; verify both before travel.",
    parking: "Official parking at the dam; capacity can be limited.", publicTransport: "PostBus via Sierre, Vissoie and Grimentz during the seasonal service period.", accessibility: "High-altitude mountain trail; not step-free.", highlights: ["Turquoise reservoir", "Moiry Glacier views", "Dam crest"], safety: ["The route is high and exposed; snow can remain and weather can close the access road.", ...mountainSafety],
  },
  {
    id: "spot-grande-dixence-dam",
    tagline: "A seasonal dam visit with separate cable-car and guided-tour operations",
    summary: "Grande Dixence is a major hydroelectric dam at the head of Val des Dix. The official visitor material separates valley access, cable-car operation, dam walks and guided interior tours.",
    routeLabel: "Grande Dixence destination visit", source: official("Grande Dixence — official visitor guide", "https://www.grande-dixence.ch/files/Grande-Dixence-Experience-the-energy-at-the-heart-of-the-Alps.pdf"),
    difficulty: "not-rated", bestSeason: ["summer", "autumn"], season: "Visitor operations are generally mid-June to the end of September; check current dates", startName: "Grande Dixence visitor/cable-car valley area", access: "Reach the signed visitor area by seasonal PostBus or road, then choose the pedestrian ascent or ticketed cable car according to current operation.",
    parking: "Official visitor parking in the valley access area.", publicTransport: "Seasonal PostBus to the Grande Dixence area; verify the current timetable.", accessibility: "Cable-car, dam-crest and interior-tour accessibility differ; contact the operator for current details.", feeInfo: "Cable car and guided interior tours are ticketed; outdoor access arrangements vary.", highlights: ["Dam wall", "Val des Dix", "Hydroelectric visitor experience"], restrictions: ["Interior access is only through authorised guided visits and operating areas."], uncertainties: ["No single hike profile applies to the combined visitor experience."],
  },
  {
    id: "spot-lac-bleu-d-arolla",
    tagline: "A short mountain-lake approach from La Gouille or Arolla",
    summary: "Lac Bleu d’Arolla is a small spring-fed lake above Val d’Hérens. Valais Tourism publishes approximate walking times from La Gouille and Arolla but not a complete profile on the destination page.",
    routeLabel: "Lac Bleu approach from La Gouille", source: official("Valais — Lac Bleu", "https://www.valais.ch/en/explore/activities/natural-sites/mountain-lakes/lac-bleu"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], durationMinutes: 45, startName: "La Gouille", finish: "Lac Bleu", access: "Use the Val d’Hérens road or PostBus to La Gouille; a longer approach is also possible from Arolla.",
    parking: "Use signed parking in La Gouille; capacity is limited.", publicTransport: "PostBus to La Gouille or Arolla; check seasonal timetable.", accessibility: "Mountain path; not step-free.", highlights: ["Blue spring-fed lake", "Arolla valley", "Larch forest"], safety: mountainSafety, uncertainties: ["The 45-minute figure is one-way from La Gouille; distance and ascent are not published by the cited destination page."],
  },
  {
    id: "spot-bisse-du-torrent-neuf",
    tagline: "An official bisse walk with exposed footbridges",
    summary: "Bisse du Torrent-Neuf is a restored irrigation-channel path above Savièse. The official Valais route includes narrow sections and suspended footbridges and is seasonal.",
    routeLabel: "Bisse du Torrent-Neuf — Les Biniis to Tripon", source: official("Valais — Bisse du Torrent-Neuf", "https://www.valais.ch/fr/explorer/activites/randonnees/bisses/bisse-du-torrent-neuf"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], distanceKm: 9, durationMinutes: 180, ascentM: 200, descentM: 280,
    startName: "Les Biniis", finish: "Tripon", access: "Use the official Savièse access information and plan the one-way return; bus frequency can be limited.",
    parking: "Use signed route parking only; avoid blocking local roads.", publicTransport: "Regional bus access is possible but the return connection is limited; verify before departure.", accessibility: "Narrow, exposed natural path and suspended bridges; not step-free.", highlights: ["Historic irrigation channel", "Suspended footbridges", "Valais panorama"], safety: ["A head for heights and sure footing are required on exposed sections.", ...mountainSafety],
  },
  {
    id: "spot-gorges-du-durnand",
    tagline: "A ticketed gorge walkway reached from Les Valettes",
    summary: "Gorges du Durnand is a managed attraction near Bovernier with stairs and galleries beside the torrent. It is not an unrestricted hiking route.",
    routeLabel: "Gorges du Durnand managed visit", source: official("Gorges du Durnand — access and opening information", "https://gorgesdudurnand.ch/en/contact/"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], startName: "Gorges du Durnand entrance, Les Valettes", finish: "Entrance", access: "Drive from the Martigny-Croix direction to the signed entrance, or take the train to Bovernier and walk about 20 minutes.",
    parking: "Free visitor parking is provided but space is limited.", publicTransport: "Train to Bovernier, then roughly 20 minutes on foot following Les Valettes/Champex signs.", accessibility: "Gorge stairs and wet natural conditions mean the full visit is not step-free.", feeInfo: "Admission is charged; verify current prices and attraction hours.", highlights: ["Durnand torrent", "Gorge stairways", "Rock galleries"], restrictions: ["Enter only during official opening hours and respect any weather closure."], safety: ["Stairs and walkways can be wet and slippery; use handrails.", ...commonSafety], uncertainties: ["The reviewed page does not publish a stable route length or visit duration."],
  },
  {
    id: "spot-val-ferret",
    tagline: "A broad alpine valley where a named route must be chosen",
    summary: "Val Ferret extends above La Fouly towards the Italian border and contains several trails. The regional material identifies La Fouly as the public-transport and visitor hub, but one valley pin cannot represent every route.",
    routeLabel: "Val Ferret destination — choose a named route from La Fouly", source: official("Pays du St-Bernard — La Fouly and Val Ferret access guide", "https://www.saint-bernard.ch/files/BrochureLaFouly_annexe5.pdf"),
    difficulty: "not-rated", bestSeason: ["summer", "autumn"], startName: "La Fouly village / bus stop after selecting a route", access: "Train via Martigny and Sembrancher to Orsières, then PostBus to La Fouly; road access ends within the valley according to local controls.",
    parking: "Free parking is described at the entrance to La Fouly; verify current restrictions.", publicTransport: "Rail to Orsières, then PostBus to La Fouly.", accessibility: "Varies from valley road to mountain trails; no valley-wide claim.", highlights: ["Mont Dolent and glacier scenery", "La Fouly", "Alpine pastures"], uncertainties: ["Distance, duration and ascent remain route-specific and are deliberately omitted."],
  },
  {
    id: "spot-brissago-islands",
    tagline: "A seasonal botanical-garden visit reached only by boat",
    summary: "The Brissago Islands are a cantonal botanical garden on Lake Maggiore, not a hiking destination. The public visitor island is reached by scheduled boat from lakeside towns.",
    routeLabel: "Brissago Islands botanical-garden visit", source: official("Canton Ticino — Brissago Islands", "https://www.isoledibrissago.ti.ch/en/"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], season: "2026 season: 18 March–8 November; boat timetable still governs access", startName: "Ascona or another scheduled boat landing", finish: "Same/selected boat landing", access: "Travel by scheduled boat; the official site states about 20 minutes from Ascona.",
    parking: "Use public parking at the chosen mainland departure; there is no car access to the island.", publicTransport: "Rail/bus to the chosen lakeside landing, then scheduled boat.", accessibility: "Boat and garden accessibility must both be checked for the selected service.", feeInfo: "Boat transport and garden admission/combined offers are ticketed; check current prices.", highlights: ["Cantonal botanical garden", "Lake Maggiore crossing", "Subtropical plant collections"], restrictions: ["Visit only during the published season and respect botanical-garden rules."], safety: commonSafety, uncertainties: ["No hiking distance is relevant to this managed island visit."], parkingAvailable: false,
  },
  {
    id: "spot-soglio",
    tagline: "The official Via Panoramica from Casaccia to Soglio",
    summary: "Soglio is a historic Bregaglia village and the finish of the official Via Panoramica. The selected route crosses the sunny side of the valley from Casaccia.",
    routeLabel: "Via Panoramica — Casaccia to Soglio", source: official("Graubünden Tourism — Via Panoramica", "https://www.graubuenden.ch/en/tours/via-panoramica-trail"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], distanceKm: 14.6, durationMinutes: 170, ascentM: 467, descentM: 826,
    startName: "Casaccia", finish: "Soglio", access: "Use PostBus to Casaccia and return from Soglio; road access and village parking are limited.",
    parking: "Public transport is preferred for this one-way route; use signed village parking only.", publicTransport: "PostBus serves Casaccia and Soglio; verify the current valley timetable.", accessibility: "Mountain and forest paths; not step-free.", highlights: ["Bregaglia panorama", "Chestnut landscape", "Soglio village"],
  },
  {
    id: "spot-val-roseg",
    tagline: "A gentle valley walk from Pontresina to Hotel Roseg Gletscher",
    summary: "Val Roseg is an alpine quiet zone reached from Pontresina. The tourism authority describes a seven-kilometre path from the station area to Hotel Roseg Gletscher, also used by authorised horse-drawn transport and bicycles.",
    routeLabel: "Pontresina–Hotel Roseg Gletscher valley path", source: official("Engadin — Val Roseg", "https://www.engadin.ch/en/guide/activities/leisure-activities-and-recreation-for-every-taste/val-roseg-bench"),
    difficulty: "easy", bestSeason: ["summer", "autumn", "winter"], distanceKm: 7, startName: "Pontresina railway station", finish: "Hotel Roseg Gletscher", access: "Begin by Pontresina station; walking, cycling and reserved horse-drawn transport share the valley access corridor.",
    parking: "Use public parking in Pontresina; private driving into the quiet valley is not presented as visitor access.", publicTransport: "Rail to Pontresina; the path begins near the station.", accessibility: "Gentle valley road/path, but distance, snow and shared traffic require an individual mobility check.", highlights: ["Roseg stream", "Sella and Roseg glacier views", "Alpine quiet zone"], safety: ["Expect shared use with bicycles and authorised horse-drawn carriages; keep to the appropriate side.", ...commonSafety], uncertainties: ["The cited page publishes the one-way distance but not a summer walking time or ascent profile."],
  },
  {
    id: "spot-morteratsch-glacier",
    tagline: "An educational glacier trail from Morteratsch station",
    summary: "The Morteratsch glacier trail follows a signed valley route from the railway station towards the retreating glacier forefield. Historic markers show earlier ice positions.",
    routeLabel: "Morteratsch glacier trail", source: official("Engadin — family summer adventures and Morteratsch route", "https://www.engadin.ch/en/guide/families/summer-adventures-for-families"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], distanceKm: 2.88, durationMinutes: 50, ascentM: 130, descentM: 0,
    startName: "Morteratsch railway station", finish: "Signed glacier-trail end / return by same route", access: "Take the Bernina-line train or use official station parking, then follow the educational trail.",
    parking: "Official parking is available near Morteratsch station; check charges.", publicTransport: "Rhaetian Railway to Morteratsch.", accessibility: "Wide natural valley path, but surface and final approach conditions vary; no full step-free claim.", highlights: ["Glacier-retreat markers", "Bernina massif", "Morteratsch forefield"], safety: ["Do not leave the signed trail or approach unstable ice, meltwater channels or rockfall zones.", ...mountainSafety], uncertainties: ["Published figures describe the one-way educational route; allow the same distance for return."],
  },
  {
    id: "spot-lai-da-palpuogna",
    tagline: "A short official walk from Preda to Lai da Palpuogna",
    summary: "Lai da Palpuogna is a forest-framed lake near the Albula Pass. The official route begins at Preda railway station and climbs gently to the lake.",
    routeLabel: "Preda–Lai da Palpuogna", source: official("Bergün Filisur Tourism — Preda to Palpuogna", "https://www.berguen-filisur.graubuenden.ch/en/overview/tours/preda-palpuogna-lake-lai-da-palpuogna"),
    difficulty: "easy", bestSeason: ["summer", "autumn"], distanceKm: 1.7, durationMinutes: 40, ascentM: 142, descentM: 11,
    startName: "Preda railway station", finish: "Lai da Palpuogna", access: "Take the Rhaetian Railway to Preda or use signed village parking, then follow the official route.",
    parking: "Use signed parking in Preda; do not park on the pass road or forest tracks.", publicTransport: "Rhaetian Railway to Preda.", accessibility: "Natural uphill path; no step-free claim.", highlights: ["Lai da Palpuogna", "Albula forest", "Preda railway access"],
  },
  {
    id: "spot-joriseen",
    tagline: "A demanding high-alpine circuit from Wägerhus to the Jöriseen",
    summary: "The Jöriseen are a group of turquoise lakes in the Flüela landscape. Graubünden Tourism identifies Wägerhus as the start for the long high-altitude circuit.",
    routeLabel: "Jöriseen circuit from Wägerhus", source: official("Graubünden Tourism — Jöriseen", "https://www.graubuenden.ch/en/attractions/joriseen"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], season: "Snow-free high-alpine season, commonly July to October; verify pass and trail conditions", distanceKm: 11, durationMinutes: 360, ascentM: 850, descentM: 850, grade: "Experienced mountain hikers",
    startName: "Wägerhus / Flüelapass PostBus stop", finish: "Wägerhus", access: "Take the seasonal PostBus from Davos Dorf towards the Flüela Pass to Wägerhus/Abzw., or use the very limited signed parking.",
    parking: "Only a few spaces are described near Wägerhus; public transport is safer for capacity.", publicTransport: "Seasonal PostBus from Davos Dorf to Wägerhus/Abzw.; verify operating period.", accessibility: "Long high-alpine mountain trail; not step-free.", highlights: ["Turquoise Jöriseen", "Jöri Glacier views", "Flüela high-alpine landscape"], safety: ["Snowfields, poor visibility and high altitude can make the circuit substantially harder; surefootedness and fitness are required.", ...mountainSafety],
  },
  {
    id: "spot-lej-da-staz",
    tagline: "A forest-lake walk from St. Moritz or Celerina",
    summary: "Lej da Staz lies in the Staz forest between St. Moritz and Celerina. Engadin Tourism describes it as roughly a 40-minute walk from either resort, with several possible approaches rather than one fixed circuit.",
    routeLabel: "Lej da Staz destination walk", source: official("Engadin — hiking around Celerina and Lej da Staz", "https://www.engadin.ch/en/guide/holiday-resorts/celerina/hiking-in-celerina"),
    difficulty: "easy", bestSeason: ["year-round"], durationMinutes: 40, startName: "Choose St. Moritz or Celerina signed approach", finish: "Lej da Staz", access: "Arrive by rail in St. Moritz or Celerina and follow the signed forest paths; winter paths differ from summer routes.",
    parking: "Use public parking in the chosen resort; the lake is reached on foot.", publicTransport: "Rail to St. Moritz or Celerina/Schlarigna.", accessibility: "Some forest approaches may be gentle, but seasonal surface and full step-free access are not verified.", highlights: ["Lej da Staz", "Staz forest", "Engadin lake landscape"], safety: ["Use maintained winter paths and never treat lake ice as safe without an explicit local opening.", ...commonSafety], uncertainties: ["The 40-minute statement is an approximate one-way walk; route distance and ascent depend on the selected approach."],
  },
  {
    id: "spot-val-mustair",
    tagline: "The official riverside route through Val Müstair",
    summary: "Val Müstair is a broad inhabited valley, not one viewpoint. The selected official A la riva dal Rom route follows the Rom river from Süsom-Tschierv to Müstair.",
    routeLabel: "A la riva dal Rom — Süsom-Tschierv to Müstair", source: official("Val Müstair — A la riva dal Rom", "https://www.val-muestair.ch/en/tours/a-la-riva-dal-rom"),
    difficulty: "moderate", bestSeason: ["spring", "summer", "autumn"], distanceKm: 14, durationMinutes: 210, ascentM: 110, descentM: 620,
    startName: "Süsom-Tschierv", finish: "Müstair", access: "Use PostBus to the named start and return from Müstair; the route is one-way through several villages.",
    parking: "Public transport is preferred for the one-way route; use signed village parking only.", publicTransport: "PostBus serves Süsom-Tschierv and Müstair.", accessibility: "Mixed riverside trail; only some sections are described as pushchair suitable.", highlights: ["Rom river", "Val Müstair villages", "UNESCO monastery area at Müstair"], safety: ["One section between Fuldera and Valchava is more exposed; choose a suitable section for your ability.", ...commonSafety],
  },
  {
    id: "spot-oberblegisee",
    tagline: "A mountain-lake destination above Luchsingen with route choice required",
    summary: "Oberblegisee lies above the Glarus valley and can be approached from Braunwald or the Brunnenberg cableway. The regional guide presents several variants, so one lake pin is not treated as a universal trailhead.",
    routeLabel: "Oberblegisee destination — choose the Braunwald or Brunnenberg route", source: official("Braunwald — official summer guide", "https://braunwald.ch/files/braunwald.ch/Brosch%C3%BCren/20260415_VG_Braunwald_Pocketprospekt_Sommer2026_686x415_JS_6_interaktiv.pdf?version=3f5bcefca118e2cb"),
    difficulty: "not-rated", bestSeason: ["summer", "autumn"], startName: "Braunwald or Brunnenberg after selecting an official variant", access: "Use rail and mountain transport to car-free Braunwald, or the Luchsingen–Brunnenberg cableway for the alternative approach.",
    parking: "Use official valley parking at the selected mountain-transport station.", publicTransport: "Rail to Linthal Braunwaldbahn or Luchsingen, then the selected cableway.", accessibility: "Mountain paths to the lake are not step-free.", highlights: ["Oberblegisee", "Glarus Alps", "Braunwald/Brunnenberg approaches"], uncertainties: ["A single current distance, ascent and time profile could not be assigned without choosing one of the official variants."],
  },
  {
    id: "spot-muttsee",
    tagline: "A difficult official circuit from the Kalktrittli mountain station",
    summary: "Muttsee lies high above Tierfehd beside the SAC hut and dam. The official Glarnerland route uses the Tierfehd–Kalktrittli cableway and a demanding mountain circuit.",
    routeLabel: "Muttsee hike from Kalktrittli", source: official("Glarnerland — hike to Muttsee", "https://glarnerland.ch/en/map/detail-poi/hike-to-the-muttsee--id--tou_4kq_dcfagafa.html"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], distanceKm: 10, durationMinutes: 270, ascentM: 906, descentM: 908,
    startName: "Kalktrittli mountain station", finish: "Kalktrittli mountain station", access: "Reach Tierfehd in Linthal and use the operating cableway to Kalktrittli; capacity and reservation rules must be checked.",
    parking: "Use designated Tierfehd parking only.", publicTransport: "Rail to Linthal, then local/seasonal connection or approved access to Tierfehd; verify current service.", accessibility: "Difficult mountain terrain and tunnels/steep paths; not step-free.", highlights: ["Muttsee", "Muttseehütte SAC", "High-alpine dam landscape"], safety: ["This is a strenuous high-mountain day; verify cableway, hut, snow and tunnel/path status before leaving.", ...mountainSafety],
  },
  {
    id: "spot-seerenbach-falls",
    tagline: "A short signed walk from Betlis landing stage to the falls viewpoint",
    summary: "Seerenbach Falls and the Rin spring lie above Betlis on Lake Walen. Heidiland Tourism describes the viewpoint as about 20 minutes on foot from the Betlis boat landing.",
    routeLabel: "Betlis landing stage–Seerenbach Falls viewpoint", source: official("Heidiland — Seerenbach Falls and Rinquelle", "https://en.heidiland.com/map/poi/seerenbachfalle-rinquelle-c9414279-6724-49fa-b026-7fb764b3ebde.html"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], durationMinutes: 20, startName: "Betlis landing stage", finish: "Seerenbach Falls viewing platform", access: "Use the seasonal Lake Walen boat to Betlis or select an officially permitted land approach; the falls are reached only on foot.",
    parking: "No parking is claimed at the boat start; use official parking at the selected mainland landing or land approach.", publicTransport: "Train/bus to a Lake Walen boat landing, then seasonal boat to Betlis.", accessibility: "Natural footpath to a viewing platform; step-free access is not verified.", highlights: ["Three-stage Seerenbach Falls", "Rin spring", "Lake Walen cliffs"], safety: ["Stay on the viewing path; rockfall and high water can affect the gorge area.", ...commonSafety], uncertainties: ["The 20-minute figure is one-way; the official destination page does not publish distance or ascent."],
  },
  {
    id: "spot-falensee",
    tagline: "A demanding official three-lake traverse through the Alpstein",
    summary: "Fälensee lies beneath the Hundstein and Kreuzberge and is reached only on mountain paths. The selected official route crosses the Alpstein from Wasserauen to Brülisau via Seealpsee, Fälensee and Sämtisersee.",
    routeLabel: "Alpstein three-lake hike", source: official("Appenzellerland Tourism — mountain lakes of the Alpstein", "https://www.appenzell.ch/en/summer/hiking.html?cHash=8a47fa7a8ddea572102c02a3333516c1&tx_wstourismus_tourismus%5Baction%5D=show&tx_wstourismus_tourismus%5Btour%5D=51"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], distanceKm: 17.62, durationMinutes: 405, ascentM: 1194, descentM: 1142, grade: "T3",
    startName: "Wasserauen railway station", finish: "Brülisau", access: "Start by rail in Wasserauen and return by bus from Brülisau; the route can be split with an authorised overnight stay.",
    parking: "Public transport is preferred for the point-to-point traverse; use official village parking only.", publicTransport: "Train to Wasserauen; bus from Brülisau for the return.", accessibility: "Long T3 mountain traverse; not step-free.", highlights: ["Fälensee", "Seealpsee and Sämtisersee", "Alpstein limestone walls"], safety: ["The route is long, steep and graded T3; allow adequate daylight and consider the official two-day option.", ...mountainSafety],
  },
  {
    id: "spot-schafler",
    tagline: "The official T3 circuit from Ebenalp via Schäfler",
    summary: "Schäfler is an exposed Alpstein viewpoint reached on mountain paths. The selected official circuit starts and finishes at the Ebenalp mountain station.",
    routeLabel: "Ebenalp–Schäfler circuit", source: official("Appenzellerland Tourism — Schäfler circuit", "https://www.appenzell.ch/en/summer/hiking/hiking-tour-suggestions.html?cHash=c8e4cd48e34bac247eff0c21a766b106&tx_wstourismus_tourismus%5Baction%5D=show&tx_wstourismus_tourismus%5Bcontroller%5D=Tour&tx_wstourismus_tourismus%5Btour%5D=84"),
    difficulty: "challenging", bestSeason: ["summer", "autumn"], distanceKm: 6.2, durationMinutes: 165, ascentM: 543, descentM: 543, grade: "T3",
    startName: "Ebenalp mountain station", finish: "Ebenalp mountain station", access: "Take the Wasserauen–Ebenalp cable car, then follow the official circuit.",
    parking: "Use official parking at Wasserauen; spaces can fill early.", publicTransport: "Train to Wasserauen, then cable car to Ebenalp.", accessibility: "Exposed T3 mountain route with steep and secured passages; not step-free.", highlights: ["Schäfler ridge", "Alpstein panorama", "Ebenalp"], safety: ["Surefootedness and a head for heights are required; avoid the route in snow, ice, thunderstorms or poor visibility.", ...mountainSafety],
  },
  {
    id: "spot-ascher-ebenalp",
    tagline: "An official mountain hike through Wildkirchli to Äscher and Ebenalp",
    summary: "Berggasthaus Äscher is built against the Ebenalp rock face beside the Wildkirchli caves. The selected official hike starts in Schwende and ends at Ebenalp; cable-car visitors can choose a shorter separately signed circuit.",
    routeLabel: "Schwende–Äscher–Wildkirchli–Ebenalp", source: official("Appenzellerland Tourism — Äscher and Wildkirchli hike", "https://www.appenzell.ch/en/service/tour-pdf.pdf?cHash=dc22543bc8e40192a4c80a5fa53d3c76&tx_wstourismus_tourismus%5Baction%5D=show&tx_wstourismus_tourismus%5Btour%5D=38"),
    difficulty: "moderate", bestSeason: ["summer", "autumn"], distanceKm: 4.35, durationMinutes: 150, ascentM: 823, descentM: 72, grade: "T2",
    startName: "Schwende", finish: "Ebenalp mountain station", access: "Use rail to Schwende for the full ascent; descend by cable car to Wasserauen and return by train.",
    parking: "For the full route, use signed parking in the valley; public transport simplifies the different finish.", publicTransport: "Train to Schwende; cable car from Ebenalp to Wasserauen, then train.", accessibility: "T2 mountain hike with caves, steps and steep ascent; not step-free.", highlights: ["Berggasthaus Äscher", "Wildkirchli caves", "Ebenalp panorama"], safety: ["Cave passages and mountain paths can be wet; use the route only when open and carry grippy footwear.", ...mountainSafety],
  },
  {
    id: "spot-lungernsee",
    tagline: "The official circuit around Lungernsee",
    summary: "Lungernsee is a valley lake on the Brünig rail line. Obwalden Tourism publishes a roughly ten-kilometre circuit that can be joined from Lungern village.",
    routeLabel: "Lungernsee circuit", source: official("Obwalden Tourism — summer hiking", "https://www.obwalden-tourismus.ch/en/aktivitaeten/sommer/wandern/"),
    difficulty: "easy", bestSeason: ["spring", "summer", "autumn"], distanceKm: 10, durationMinutes: 150,
    startName: "Lungern village / railway station", finish: "Lungern", access: "Arrive on the Brünig railway line and join the signed lake circuit from Lungern.",
    parking: "Use signed public parking in Lungern; do not park on lakeside access roads.", publicTransport: "Zentralbahn to Lungern.", accessibility: "Mixed lakeside paths and local roads; full step-free access is not verified.", highlights: ["Lungernsee shoreline", "Obwalden mountains", "Rail-accessible village circuit"], uncertainties: ["The reviewed overview publishes approximate circuit length and time but not a complete ascent/descent profile."],
  },
  {
    id: "spot-bannalpsee",
    tagline: "A mountain-lake visit tied to the seasonal Bannalp cableways",
    summary: "Bannalpsee lies on the Bannalp plateau above Oberrickenbach. Several mountain routes meet here, so the lake pin is kept separate from the Fellboden and Fell cableway stations.",
    routeLabel: "Bannalpsee destination from the operating Bannalp cableway", source: official("Bannalp — cableway timetable and prices", "https://www.bannalp.ch/sommer/luftseilbahnen/fahrplan-und-preise"),
    difficulty: "not-rated", bestSeason: ["summer", "autumn"], season: "Summer cableway season is generally mid-May to late October; verify current operation", startName: "Select Fellboden–Bannalpsee or Fell–Chrüzhütte access", access: "Reach Oberrickenbach by bus or road, then use the appropriate operating cableway and a signed path to the lake.",
    parking: "Use official valley-station parking; capacity and station choice matter.", publicTransport: "Train to Wolfenschiessen, then PostBus to Oberrickenbach and the selected cableway.", accessibility: "Cableway access does not make the mountain paths around the lake step-free.", feeInfo: "Cableways are ticketed; check current fares and reservation rules.", highlights: ["Bannalpsee", "Bannalp plateau", "Walenpfad connections"], uncertainties: ["No single route profile is published because several distinct approaches and onward hikes serve the lake."],
  },
  {
    id: "spot-sihlwald",
    tagline: "An official forest route from Sihlwald visitor centre to Langenberg",
    summary: "Sihlwald is a protected natural forest in the Wildnispark Zürich. The selected official forest route begins at the visitor centre and finishes at the Langenberg wildlife park.",
    routeLabel: "Sihlwald protected-forest visit from the visitor centre", source: official("Wildnispark Zürich — public-transport access map", "https://www.wildnispark.ch/?action=get_file&id=54&resource_link_id=e62"),
    difficulty: "not-rated", bestSeason: ["year-round"],
    startName: "Wildnispark Zürich visitor centre, Sihlwald", finish: null, access: "Take the Sihltal railway to Sihlwald station and choose a currently open, marked forest route from the visitor centre.",
    parking: "Use official visitor parking where available; public transport is the clearest access.", publicTransport: "Sihltal railway to Sihlwald; the official transport map also identifies Langenberg connections.", accessibility: "Access varies by selected path; the official transport map warns that approaches to Langenberg from Sihlau and Wildpark-Höfli are steep and only partly pushchair suitable.", feeInfo: "Outdoor-area and visitor-centre opening arrangements differ; check the official site before travel.", highlights: ["Near-natural beech forest", "Sihlwald visitor centre", "Protected forest processes"], restrictions: ["In the core zone, remain on paths and do not collect natural material; follow the full protected-area rules."], safety: ["Dead wood and natural forest processes can create changing hazards; obey temporary closures.", ...commonSafety], uncertainties: ["A current, stable official route profile could not be linked, so distance, duration and elevation are deliberately omitted."],
  },
];

export const CATALOGUE_LOCATION_ENRICHMENTS: Record<string, ReviewedLocationEnrichment> =
  Object.fromEntries(reviews.map((item) => [item.id, review(item)]));

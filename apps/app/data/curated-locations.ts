import { PLACEHOLDER_LOCATIONS } from "@/data/locations";
import type { Location, LocationSource, RouteVerification } from "@/types";

const CHECKED_AT = "2026-07-27";

const parkRules: LocationSource = {
  label: "Swiss National Park — protection regulations",
  url: "https://nationalpark.ch/en/protection-regulations/",
  checkedAt: CHECKED_AT,
};

const trailStatus: LocationSource = {
  label: "Swiss National Park — current trail status",
  url: "https://nationalpark.ch/en/visit/trails-routes/",
  checkedAt: CHECKED_AT,
};

const accessibilitySource: LocationSource = {
  label: "Swiss National Park — accessibility",
  url: "https://nationalpark.ch/en/accessibility/",
  checkedAt: CHECKED_AT,
};

const federalMap: LocationSource = {
  label: "Federal Geoportal — place coordinates",
  url: "https://map.geo.admin.ch/",
  checkedAt: CHECKED_AT,
};

function federalCoordinate(label: string, searchText: string): LocationSource {
  return {
    label: `Federal Geoportal — ${label}`,
    url: `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=${encodeURIComponent(searchText)}&type=locations&origins=gg25`,
    checkedAt: CHECKED_AT,
  };
}

const commonRestrictions = [
  "Stay on marked paths and designated rest areas.",
  "Daytime visits only; the park is closed to visitors in winter.",
  "Dogs are prohibited, including on a lead.",
  "No bathing, fires, cycling, drones, littering or removing natural objects.",
];

const commonSafety = [
  "Mountain weather and temperatures can change quickly.",
  "Mobile coverage is limited; carry an offline map and do not rely on this PWA as your only navigation tool.",
  "On-site closures and signs take precedence over information shown here.",
];

function original(id: string): Location {
  const location = PLACEHOLDER_LOCATIONS.find((item) => item.id === id);
  if (!location) throw new Error(`Missing source location: ${id}`);
  return location;
}

function verification(
  route: Omit<RouteVerification, "country" | "canton" | "checkedAt" | "restrictions" | "safety" | "sources"> & {
    restrictions?: string[];
    safety?: string[];
    sources: LocationSource[];
  }
): RouteVerification {
  return {
    country: "Switzerland",
    canton: "Graubünden",
    checkedAt: CHECKED_AT,
    restrictions: [...commonRestrictions, ...(route.restrictions ?? [])],
    safety: [...commonSafety, ...(route.safety ?? [])],
    ...route,
    sources: [...route.sources, trailStatus, parkRules, accessibilitySource, federalMap],
  };
}

export const CURATED_LOCATIONS: Location[] = [
  {
    ...original("loc-002"),
    slug: "alp-trupchun",
    name: "Alp Trupchun",
    tagline: "A 14 km return route through the Swiss National Park",
    description:
      "A marked return route from Prasüras follows Val Trupchun to Alp Trupchun through alpine forest and open pasture. The valley is especially popular during the red-deer rut in late September; wildlife sightings are possible, never guaranteed.",
    longDescription:
      "This is the National Park’s official Alp Trupchun route. It begins at Prasüras and returns by the same valley after reaching Alp Trupchun. The route is technically easy, but its 14 km length and 550 m of ascent still require normal mountain-hiking fitness.",
    coordinates: { lat: 46.5953979, lng: 10.0775614 },
    difficulty: "moderate",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 4, max: 4 },
    distanceKm: 14,
    elevation: 1692,
    highlights: ["Val Trupchun landscape", "Alp Trupchun", "Parkhütte Varusch on the approach"],
    tips: [
      "Check the separate Express Parc Naziunel timetable; the SBB journey planner can be incomplete.",
      "Late September is busy because of the deer rut. Observe wildlife quietly and from the path.",
    ],
    whatToBring: ["Mountain footwear", "Weatherproof layers", "Food and water", "Offline route map"],
    accessInfo:
      "Start at Prasüras (1,692 m), beside the S-chanf, Parc Naziunal bus stop and public car park. Motor traffic is prohibited beyond Prasüras.",
    parkingAvailable: true,
    publicTransport: true,
    verification: verification({
      routeType: "Return route",
      season: "June–October",
      distanceKm: 14,
      durationMinutes: 240,
      ascentM: 550,
      descentM: 550,
      sacGrade: "T2 · white-red-white · technically easy",
      status: "open",
      statusNote: "Official route status was Open when checked.",
      start: {
        name: "Prasüras (S-chanf, Parc Naziunal)",
        coordinates: { lat: 46.6173248, lng: 10.0086317 },
        parking: "Free public car park at Prasüras; driving is prohibited beyond it.",
        publicTransport:
          "Engadinbus to S-chanf, Parc Naziunal. The separate Express Parc Naziunel timetable may be more complete than SBB.",
      },
      finish: "Alp Trupchun, then return to Prasüras",
      accessibility:
        "Not wheelchair- or pushchair-accessible. The park classifies its routes as mountain or alpine paths.",
      feeInfo:
        "No self-guided trail admission fee is published on the official route page. Transport, food and guided excursions are separate paid services.",
      uncertainties: [],
      sources: [
        {
          label: "Swiss National Park — Alp Trupchun route",
          url: "https://nationalpark.ch/en/park/?offer=42086&reset=1",
          checkedAt: CHECKED_AT,
        },
        {
          label: "Swiss National Park — Prasüras parking and access",
          url: "https://nationalpark.ch/besuchen/exkursionen/trupchun/",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Alp Trupchun coordinate", "Alp Trupchun"),
        federalCoordinate("Prasüras trailhead coordinate", "Prasüras S-chanf"),
      ],
    }),
  },
  {
    ...original("loc-003"),
    slug: "chamanna-cluozza",
    name: "Chamanna Cluozza",
    tagline: "A steep 8.5 km approach from Zernez to the park’s serviced hut",
    description:
      "From Zernez, a maintained mountain path crosses steep valley flanks to Chamanna Cluozza, the only serviced hut inside the Swiss National Park. The route is well marked, but several passages require a head for heights.",
    longDescription:
      "The official route is one-way from Zernez to Chamanna Cluozza. A visit therefore requires a return hike, an overnight stay with a planned onward route, or another separately verified itinerary. Hut availability is not implied by the trail being open.",
    coordinates: { lat: 46.6628723, lng: 10.1176424 },
    category: "forest",
    difficulty: "moderate",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 3.5, max: 3.5 },
    distanceKm: 8.5,
    elevation: 1882,
    highlights: ["Val Cluozza gorge", "Chamanna Cluozza", "Maintained mountain path"],
    tips: [
      "Avoid the hottest part of the day on exposed slopes.",
      "Check and book the hut separately if you plan to stay overnight.",
    ],
    whatToBring: ["Mountain footwear", "Weatherproof layers", "Food and water", "Offline route map"],
    accessInfo:
      "Start at Zernez railway station or the Swiss National Park Centre (1,471 m). The published route ends at Chamanna Cluozza.",
    parkingAvailable: true,
    publicTransport: true,
    verification: verification({
      routeType: "One-way hut approach",
      season: "June–October",
      distanceKm: 8.5,
      durationMinutes: 210,
      ascentM: 800,
      descentM: 400,
      sacGrade: "T2 · white-red-white · medium route",
      status: "open-with-advisory",
      statusNote:
        "The official route overview said Open, while the route detail page said Closed (“Winterruhe”). Check with the park before travelling.",
      start: {
        name: "Zernez railway station / Swiss National Park Centre",
        coordinates: { lat: 46.697914, lng: 10.090912 },
        parking:
          "Parking availability and fees at the selected Zernez start were not confirmed by the route source.",
        publicTransport: "Rhaetian Railway to Zernez station.",
      },
      finish: "Chamanna Cluozza (1,882 m)",
      accessibility:
        "Not wheelchair- or pushchair-accessible. Steep valley flanks and exposed passages require a head for heights.",
      feeInfo:
        "No self-guided trail admission fee is published. Hut accommodation, meals and guided services are priced separately.",
      uncertainties: [
        "The park’s route overview and route detail page showed conflicting open/closed status when checked.",
        "The exact car park and current parking fee at the chosen Zernez starting point remain unverified.",
        "The official route is one-way; a safe return or onward itinerary must be planned separately.",
      ],
      safety: ["The route crosses steep valley flanks; turn back if exposure or conditions exceed your ability."],
      sources: [
        {
          label: "Swiss National Park — Chamanna Cluozza route",
          url: "https://nationalpark.ch/en/park/?offer=42347&reset=1",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Chamanna Cluozza coordinate", "Chamanna Cluozza"),
        federalCoordinate("Zernez station coordinate", "Bahnhof Zernez"),
      ],
    }),
  },
  {
    ...original("loc-004"),
    slug: "lais-da-macun",
    name: "Lais da Macun",
    tagline: "A demanding 21 km crossing of the high Macun lake plateau",
    description:
      "This demanding point-to-point route from Zernez to Lavin crosses Munt Baselgia and the Macun plateau, where 23 mountain lakes and tarns lie above the treeline. Snow or ice can remain near the pass even in summer.",
    longDescription:
      "The official route is an eight-hour high-mountain crossing, not a casual lake walk. A seasonal taxi can reduce the ascent from Zernez, but it does not remove the exposed, rough or potentially icy sections.",
    coordinates: { lat: 46.7265434, lng: 10.1330652 },
    difficulty: "expert",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 8, max: 8 },
    distanceKm: 21,
    elevation: 2945,
    highlights: ["Macun’s 23 lakes and tarns", "Munt Baselgia crossing", "Point-to-point finish in Lavin"],
    tips: [
      "Start early and verify snow conditions before leaving.",
      "A seasonal taxi can reduce the climb, but must be checked and booked independently.",
    ],
    whatToBring: ["Mountain boots", "Warm weatherproof layers", "Food and water", "Offline route map"],
    accessInfo:
      "Official route from Zernez (1,471 m) to Lavin (1,431 m). Both villages have railway stations; a seasonal taxi may shorten the initial ascent.",
    parkingAvailable: false,
    publicTransport: true,
    verification: verification({
      routeType: "Point-to-point mountain crossing",
      season: "July–October",
      distanceKm: 21,
      durationMinutes: 480,
      ascentM: 1550,
      descentM: 1600,
      sacGrade: "T3+ · white-red-white · difficult",
      status: "open-with-advisory",
      statusNote: "Open when checked, with sections reported as snow-covered.",
      start: {
        name: "Zernez railway station",
        coordinates: { lat: 46.697914, lng: 10.090912 },
        parking: "No parking claim is made; the route is documented from the railway station.",
        publicTransport: "Rhaetian Railway to Zernez; return by train from Lavin.",
      },
      finish: "Lavin railway station (1,431 m)",
      accessibility:
        "Not wheelchair- or pushchair-accessible. Requires sure-footedness, a head for heights and strong mountain fitness.",
      feeInfo:
        "No self-guided trail admission fee is published. Seasonal taxi and guided services cost extra.",
      uncertainties: [
        "Seasonal taxi operation, price and booking availability were not verified; check locally before relying on it.",
      ],
      safety: [
        "Snow and ice are possible at any time near Munt Baselgia.",
        "This is a long, committing crossing; do not start without a stable forecast and sufficient daylight.",
      ],
      sources: [
        {
          label: "Swiss National Park — Lais da Macun route",
          url: "https://nationalpark.ch/en/park/?offer=42120&reset=1",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Macun coordinate", "Macun"),
        federalCoordinate("Zernez station coordinate", "Bahnhof Zernez"),
      ],
    }),
  },
  {
    ...original("loc-005"),
    slug: "val-tantermozza",
    name: "Val Tantermozza",
    tagline: "A short marked route to Chamanna Tantermozza",
    description:
      "This short return route starts at God d’Arduond and follows a marked path through open conifer forest to Chamanna Tantermozza. The valley beyond the trail end is closed to visitors, and unstable rock can force temporary closures.",
    longDescription:
      "Val Tantermozza is included only as the official three-kilometre route to Chamanna Tantermozza—not as access to the protected valley beyond. Check the live route status immediately before travelling.",
    coordinates: { lat: 46.6635628, lng: 10.0784502 },
    difficulty: "easy",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 1.25, max: 1.25 },
    distanceKm: 3,
    elevation: 1773,
    highlights: ["Open conifer forest", "Chamanna Tantermozza", "Short official park route"],
    tips: [
      "Check the live status immediately before setting out; rock instability causes closures.",
      "Do not continue beyond the marked trail end.",
    ],
    whatToBring: ["Mountain footwear", "Weatherproof layer", "Water", "Offline route map"],
    accessInfo:
      "Start at God d’Arduond (1,625 m), reached by the power-station road or on foot from Zernez. The route returns from Chamanna Tantermozza.",
    parkingAvailable: false,
    publicTransport: false,
    verification: verification({
      routeType: "Short return route",
      season: "June–October",
      distanceKm: 3,
      durationMinutes: 75,
      ascentM: 200,
      descentM: 200,
      sacGrade: "T2 · white-red-white · technically medium",
      status: "open",
      statusNote: "Open when checked; the authority warns that unstable rock often causes closures.",
      start: {
        name: "God d’Arduond",
        coordinates: { lat: 46.6738243, lng: 10.0767651 },
        parking:
          "No verified public parking was found at the trailhead. Do not assume roadside parking is permitted.",
        publicTransport:
          "No direct public-transport stop was confirmed at the trailhead; the authority also describes a longer approach on foot from Zernez.",
      },
      finish: "Chamanna Tantermozza, then return to God d’Arduond",
      accessibility:
        "Not wheelchair- or pushchair-accessible. Although short, it is a mountain path with medium technical demand.",
      feeInfo: "No self-guided trail admission fee is published.",
      restrictions: ["The valley beyond the official trail end is closed to the public."],
      uncertainties: [
        "Legal parking and direct public-transport access at God d’Arduond remain unverified.",
      ],
      safety: ["Rock instability can close the route without much notice; check the official live status."],
      sources: [
        {
          label: "Swiss Parks Network — Val Tantermozza route",
          url: "https://www.parks.swiss/en/map/offer-detail/05-val-tantermozza-42345",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Chamanna Tantermozza coordinate", "Chamanna Tantermozza"),
        federalCoordinate("God d’Arduond trailhead coordinate", "God d'Arduond"),
      ],
    }),
  },
  {
    ...original("loc-006"),
    slug: "munt-la-schera",
    name: "Munt la Schera",
    tagline: "A 13 km crossing from Buffalora to Il Fuorn",
    description:
      "This point-to-point route crosses steppe-like slopes and former mining terrain from Buffalora to Il Fuorn, with an optional detour to the summit of Munt la Schera. Public transport serves both ends.",
    longDescription:
      "The summit detour provides the highest viewpoint but is optional. The official walking time and elevation figures cover a substantial mountain day even though the technical grading is easy.",
    coordinates: { lat: 46.6451378, lng: 10.2107744 },
    difficulty: "moderate",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 4.75, max: 4.75 },
    distanceKm: 13,
    elevation: 2587,
    highlights: ["Munt la Schera summit option", "Former mining terrain", "Buffalora to Il Fuorn crossing"],
    tips: [
      "Use public transport to avoid returning to the starting point for a car.",
      "The summit can be omitted if weather or time deteriorates.",
    ],
    whatToBring: ["Mountain footwear", "Weatherproof layers", "Food and water", "Offline route map"],
    accessInfo:
      "Start at Buffalora P10 (1,967 m) and finish at Il Fuorn (1,794 m). PostBus serves both points on the Ofenpass road.",
    parkingAvailable: true,
    publicTransport: true,
    verification: verification({
      routeType: "Point-to-point mountain route",
      season: "June–October",
      distanceKm: 13,
      durationMinutes: 285,
      ascentM: null,
      descentM: null,
      elevationNote:
        "The current official page publishes only “Vertical height 700 m”; it does not separate total ascent and descent.",
      sacGrade: "T2 · white-red-white · medium route",
      status: "open",
      statusNote: "Official route status was Open when checked.",
      start: {
        name: "Buffalora P10",
        coordinates: { lat: 46.6483192, lng: 10.2668056 },
        parking:
          "P10 is identified as a park-road parking area; current capacity and any fee were not confirmed.",
        publicTransport: "PostBus to Buffalora P10.",
      },
      finish: "Il Fuorn P6 / Hotel Parc Naziunal (1,794 m)",
      accessibility:
        "Not wheelchair- or pushchair-accessible. The route is technically easy but requires medium fitness.",
      feeInfo: "No self-guided trail admission fee is published. Transport and hospitality cost extra.",
      uncertainties: [
        "Exact cumulative ascent and descent could not be verified separately; the official page currently gives only a 700 m vertical-height summary.",
        "Current parking fee and capacity at P10 were not verified.",
      ],
      sources: [
        {
          label: "Swiss National Park — Munt la Schera route",
          url: "https://nationalpark.ch/en/park/?offer=42363&reset=1",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Munt la Schera coordinate", "Munt la Schera"),
        federalCoordinate("Buffalora trailhead coordinate", "Buffalora P10"),
      ],
    }),
  },
  {
    ...original("loc-007"),
    slug: "val-minger",
    name: "Val Mingèr",
    tagline: "An 11 km return route from Pradatsch to Sur il Foss",
    description:
      "A marked return route climbs from Pradatsch through Val Mingèr to Sur il Foss. The technical grade is easy, but the 700 m ascent still requires normal mountain fitness. Wildlife may be seen; no sighting is guaranteed.",
    longDescription:
      "The route begins on the S-charl road at the Val Mingèr public-transport stop. It follows the same protected-area rules as every Swiss National Park trail, including the strict requirement to remain on marked paths.",
    coordinates: { lat: 46.7092323, lng: 10.283021 },
    difficulty: "moderate",
    bestSeason: ["summer", "autumn"],
    visitDurationHours: { min: 3.75, max: 3.75 },
    distanceKm: 11,
    elevation: 2315,
    highlights: ["Val Mingèr", "Sur il Foss", "Marked National Park route"],
    tips: [
      "Carry binoculars if you hope to observe wildlife without approaching it.",
      "Check the seasonal PostBus timetable before travelling.",
    ],
    whatToBring: ["Mountain footwear", "Weatherproof layers", "Food and water", "Offline route map"],
    accessInfo:
      "Start at Pradatsch / Scuol, Val Mingèr (1,650 m) on the S-charl road. The route returns after reaching Sur il Foss.",
    parkingAvailable: true,
    publicTransport: true,
    verification: verification({
      routeType: "Return route",
      season: "June–October",
      distanceKm: 11,
      durationMinutes: 225,
      ascentM: 700,
      descentM: 700,
      sacGrade: "T2 · white-red-white · technically easy",
      status: "open",
      statusNote: "Official route status was Open when checked.",
      start: {
        name: "Pradatsch / Scuol, Val Mingèr",
        coordinates: { lat: 46.7305679, lng: 10.3055496 },
        parking:
          "A parking area is identified at the route start; current capacity and any fee were not confirmed.",
        publicTransport: "Seasonal PostBus to Scuol, Val Mingèr.",
      },
      finish: "Sur il Foss (2,315 m), then return to Pradatsch",
      accessibility:
        "Not wheelchair- or pushchair-accessible. The route is technically easy but has 700 m of ascent.",
      feeInfo: "No self-guided trail admission fee is published. Transport and guided services cost extra.",
      uncertainties: [
        "Current parking fee and capacity at the Val Mingèr trailhead were not verified.",
      ],
      sources: [
        {
          label: "Swiss National Park — Val Mingèr route",
          url: "https://nationalpark.ch/en/park/?offer=42366&reset=1",
          checkedAt: CHECKED_AT,
        },
        federalCoordinate("Val Mingèr coordinate", "Val Mingèr"),
        federalCoordinate("Val Mingèr trailhead coordinate", "Scuol Val Mingèr"),
      ],
    }),
  },
];

export const CURATED_LOCATION_IDS = new Set(CURATED_LOCATIONS.map((location) => location.id));

import { SOURCED_IMAGES } from "@/data/sourced-images";
import { REVIEWED_LOCATION_ENRICHMENTS } from "@/data/reviewed-location-enrichments";
import masterCatalogue from "@/data/master-catalogue.json";
import type {
  CoordinateType,
  Location,
  LocationCategory,
  LocationSource,
  Region,
  RouteVerification,
} from "@/types";

const CHECKED_AT = "2026-08-10";
const CREATED_AT = "2026-08-09T00:00:00.000Z";

function source(label: string, url: string): LocationSource {
  return { label, url, checkedAt: CHECKED_AT };
}

function federalPlaceSource(label: string, searchText: string): LocationSource {
  return source(
    `Federal Geoportal — ${label}`,
    `https://api3.geo.admin.ch/rest/services/ech/SearchServer?type=locations&origins=gazetteer&limit=20&searchText=${encodeURIComponent(searchText)}`
  );
}

function federalStopSource(label: string, searchText: string): LocationSource {
  return source(
    `Federal Office of Transport — ${label}`,
    `https://api3.geo.admin.ch/rest/services/ech/SearchServer?type=featuresearch&features=ch.bav.haltestellen-oev&limit=20&searchText=${encodeURIComponent(searchText)}`
  );
}

function imageFor(id: string) {
  const image = SOURCED_IMAGES[id]?.[0];
  if (!image) throw new Error(`Missing verified image for ${id}`);
  return image;
}

function verification(
  input: Omit<RouteVerification, "country" | "checkedAt">
): RouteVerification {
  return { country: "Switzerland", checkedAt: CHECKED_AT, ...input };
}

const sharedSafety = [
  "Check the linked official page again before travelling; access, weather and operating information can change.",
  "On-site signs and instructions take precedence over this catalogue.",
];

const DETAILED_LOCATIONS: Location[] = [
  {
    id: "spot-oeschinensee",
    slug: "oeschinensee",
    name: "Oeschinensee",
    tagline: "A mountain lake reached from Kandersteg by gondola or a signed walk",
    description:
      "Oeschinensee lies above Kandersteg beneath Blüemlisalp, Fründenhorn and Doldenhorn. The mapped point is the federal lake centre—not the cable-car station, hiking start or car park.",
    longDescription:
      "The official operator separates the lake from its access points. From Kandersteg railway station, walk 10–15 minutes or use the seasonal local bus to the gondola valley station. From the mountain station, the upper path to the shore takes about 30 minutes. Walking from the valley station to the lake takes about 90 minutes with roughly 450 metres of ascent.",
    category: "hidden-lake",
    difficulty: "moderate",
    region: "bern",
    coordinates: { lat: 46.49835968017578, lng: 7.72667121887207 },
    coordinateType: "lake_center",
    heroImage: imageFor("spot-oeschinensee"),
    gallery: [],
    tags: ["lake", "Kandersteg", "gondola", "UNESCO region"],
    bestSeason: ["summer", "autumn"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["Oeschinensee shoreline", "Blüemlisalp panorama", "Signed access paths"],
    tips: [
      "Reserve the required ascent time slot during the published summer reservation period.",
      "Arrive by public transport when possible; the operator warns that parking is limited.",
    ],
    whatToBring: ["Weatherproof layers", "Suitable walking shoes", "Water", "Sun protection"],
    accessInfo:
      "Primary access starts at Kandersteg (Talstation Oeschinen), 46.497478, 7.682684. The nearest mainline stop is Kandersteg railway station, 46.495396, 7.671812. Parking is at the valley station or designated hiking car parks in the village; the private road to the lake is closed to motor vehicles and bicycles.",
    parkingAvailable: true,
    publicTransport: true,
    elevation: 1578,
    isFeatured: true,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Bern",
      routeType: "Destination access from Kandersteg",
      season: "Summer and autumn recommended; check live operating status year-round",
      distanceKm: null,
      durationMinutes: 30,
      ascentM: null,
      descentM: null,
      elevationNote: "The 30-minute figure is the official walk from the gondola mountain station to the shore, not a complete return hike.",
      sacGrade: null,
      status: "check-current",
      statusNote: "Trails, gondola, rowing boats and the seasonal taxi have separate live statuses.",
      start: {
        name: "Kandersteg (Talstation Oeschinen)",
        coordinates: { lat: 46.49747848510742, lng: 7.682683944702148 },
        parking: "Paid valley-station parking and designated hiking car parks in Kandersteg; spaces are limited.",
        publicTransport: "Kandersteg railway station; seasonal local bus or a 10–15 minute walk to the valley station.",
      },
      finish: "Oeschinensee shore",
      accessibility:
        "The upper path from the mountain station is described as suitable for pushchairs. The seasonal electric taxi gives priority to people with disabilities; capacity is limited.",
      feeInfo: "The lake itself has no listed admission fee. Gondola, parking, taxi and boat services are paid separately.",
      restrictions: [
        "The private road to the lake is closed to motor vehicles and bicycles.",
        "A reserved ascent time slot is required from 20 June to 20 September 2026 in addition to a valid gondola ticket.",
      ],
      safety: sharedSafety,
      uncertainties: ["Live operating status must be rechecked on the day of travel."],
      sources: [
        source("Oeschinensee — live status, trails and arrival", "https://www.oeschinensee.ch/en/live/"),
        source("Oeschinensee — arrival and parking", "https://www.oeschinensee.ch/anreise/"),
        federalPlaceSource("Oeschinensee lake centre", "Oeschinensee"),
        federalPlaceSource("Kandersteg gondola valley station", "Kandersteg Oeschinen Talstation"),
        federalStopSource("Kandersteg railway station", "Kandersteg Bahnhof"),
        source("Photograph and licence", imageFor("spot-oeschinensee").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-rhine-falls",
    slug: "rhine-falls",
    name: "Rhine Falls",
    tagline: "Two official banks, distinct access conditions and year-round viewing",
    description:
      "The Rhine Falls can be visited from Neuhausen on the north bank or Schloss Laufen on the south bank. This card points to Rheinfall-Felsen, the federal-map viewpoint feature—not to either station or car park.",
    longDescription:
      "There is no single universal Rhine Falls entrance. The north bank in Neuhausen provides free viewing and a barrier-free rail approach; the south bank at Schloss Laufen has ticketed platforms and different step-free limits. The access details below keep those two visits separate.",
    category: "waterfall",
    difficulty: "easy",
    region: "zurich",
    coordinates: { lat: 47.6780891418457, lng: 8.614919662475586 },
    coordinateType: "viewpoint",
    heroImage: imageFor("spot-rhine-falls"),
    gallery: [],
    tags: ["waterfall", "Neuhausen", "Schloss Laufen", "year-round"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["North-bank basin", "Schloss Laufen platforms", "Rheinfall-Felsen"],
    tips: [
      "Choose a bank before travelling because tickets and step-free routes differ.",
      "Use Neuhausen Rheinfall station for the barrier-free north-bank approach.",
    ],
    whatToBring: ["Weather protection", "Shoes with grip near wet viewing areas"],
    accessInfo:
      "For the north bank, use Neuhausen Rheinfall station at 47.679806, 8.616942 and the signed descent to the basin. Rhine Falls P1–P4 are the official Neuhausen parking areas. The south bank uses Schloss Laufen am Rheinfall station and the castle visitor facilities.",
    parkingAvailable: true,
    publicTransport: true,
    isFeatured: true,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Schaffhausen / Zürich",
      routeType: "Destination visit — north or south bank",
      season: "Accessible around the clock, 365 days a year; paid facilities have their own hours",
      distanceKm: null,
      durationMinutes: null,
      ascentM: null,
      descentM: null,
      sacGrade: null,
      status: "open",
      statusNote: "The natural site is freely accessible year-round; paid south-bank platforms and boats operate separately.",
      start: {
        name: "Neuhausen Rheinfall station (north-bank access)",
        coordinates: { lat: 47.679805755615234, lng: 8.616942405700684 },
        parking: "Official Rhine Falls car parks P1–P4 in Neuhausen; posted tariffs apply.",
        publicTransport: "Neuhausen Rheinfall is the barrier-free north-bank rail stop; Schloss Laufen am Rheinfall serves the south bank.",
      },
      finish: null,
      accessibility:
        "The north-bank station and route to the basin are described as barrier-free. The south-bank panorama path has lift access, but the basin and boat pier are not accessible from that side.",
      feeInfo: "North-bank viewing has no entrance fee. Schloss Laufen platforms and Historama require a ticket; boats are separate.",
      restrictions: ["Boat lines have different dog rules; check the official list before boarding."],
      safety: sharedSafety,
      uncertainties: [],
      sources: [
        source("Rhine Falls — access, fees and accessibility", "https://rheinfall.ch/en/inform/journey/map"),
        source("Rhine Falls — parking and current notices", "https://rheinfall.ch/en/inform/parking/list"),
        federalPlaceSource("Rheinfall-Felsen viewpoint", "Rheinfall"),
        federalStopSource("Neuhausen Rheinfall station", "Neuhausen Rheinfall"),
        source("Photograph and licence", imageFor("spot-rhine-falls").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-chapel-bridge",
    slug: "chapel-bridge-lucerne",
    name: "Chapel Bridge",
    tagline: "Lucerne’s covered footbridge across the Reuss",
    description:
      "The Chapel Bridge links the Lucerne Theatre side of the Reuss with St. Peter’s Chapel and Rathausquai, passing the Water Tower. The map point is the federal bridge feature itself.",
    longDescription:
      "This is a public pedestrian landmark in central Lucerne, not a hiking route. Lucerne Tourism identifies it as wheelchair accessible, and the main railway station is the clearest verified arrival point for a short city-centre walk.",
    category: "photo-spot",
    difficulty: "easy",
    region: "lucerne",
    coordinates: { lat: 47.05156707763672, lng: 8.307458877563477 },
    coordinateType: "attraction",
    heroImage: imageFor("spot-chapel-bridge"),
    gallery: [],
    tags: ["bridge", "Lucerne", "old town", "wheelchair accessible"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["Covered timber bridge", "Water Tower", "Historic triangular paintings"],
    tips: ["Walk from Lucerne railway station rather than driving into the centre."],
    whatToBring: ["Nothing specialised; the bridge is in the city centre"],
    accessInfo:
      "Start at Lucerne railway station, 47.050755, 8.310246. The bridge is a short signed city-centre walk away. It has no dedicated visitor car park; use a public city car park if arriving by car.",
    parkingAvailable: false,
    publicTransport: true,
    isFeatured: false,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Lucerne",
      routeType: "Pedestrian city landmark",
      season: "Year-round",
      distanceKm: null,
      durationMinutes: null,
      ascentM: null,
      descentM: null,
      sacGrade: null,
      status: "open",
      statusNote: "Public pedestrian bridge; temporary event or maintenance controls remain possible.",
      start: {
        name: "Lucerne railway station",
        coordinates: { lat: 47.05075454711914, lng: 8.310245513916016 },
        parking: "No dedicated attraction parking verified; use an official public city car park.",
        publicTransport: "Luzern, Bahnhof is the nearest major transport hub.",
      },
      finish: "Either bridgehead",
      accessibility: "Lucerne Tourism lists the bridge as wheelchair accessible and centrally located.",
      feeInfo: "No admission fee is published for crossing the pedestrian bridge.",
      restrictions: ["Keep the narrow bridge passage clear and follow temporary city signage."],
      safety: sharedSafety,
      uncertainties: [],
      sources: [
        source("Lucerne Tourism — Chapel Bridge", "https://www.luzern.com/en/poi/chapel-bridge"),
        federalPlaceSource("Chapel Bridge", "Kapellbrücke Luzern"),
        federalStopSource("Lucerne railway station", "Luzern Bahnhof"),
        source("Photograph and licence", imageFor("spot-chapel-bridge").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-chillon",
    slug: "chateau-de-chillon",
    name: "Château de Chillon",
    tagline: "A lakeside fortress between Montreux and Villeneuve",
    description:
      "Château de Chillon stands directly on Lake Geneva at Veytaux. The federal coordinate identifies the historic castle precinct, while the station, bus stop and roadside parking are recorded separately.",
    longDescription:
      "Chillon is a ticketed historic monument with seasonal opening hours. Rail, bus and boat approaches are available, but the castle’s stone interiors are only partly accessible; the official visit information should be checked again before travelling.",
    category: "photo-spot",
    difficulty: "easy",
    region: "vaud",
    coordinates: { lat: 46.41454315185547, lng: 6.9274444580078125 },
    coordinateType: "attraction",
    heroImage: imageFor("spot-chillon"),
    gallery: [],
    tags: ["castle", "Lake Geneva", "museum", "Veytaux"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["Castle courtyards", "Lake Geneva setting", "Historic interior"],
    tips: ["Use public transport when possible; the castle says roadside parking is limited."],
    whatToBring: ["Ticket or valid museum pass", "Shoes suitable for stone stairs"],
    accessInfo:
      "The closest rail stop is Veytaux-Chillon at 46.417622, 6.927858, about six minutes on foot. Bus stop Veytaux, château de Chillon is at 46.414127, 6.928749. Limited free roadside parking is available for up to three hours with the required permit.",
    parkingAvailable: true,
    publicTransport: true,
    isFeatured: true,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Vaud",
      routeType: "Ticketed monument visit",
      season: "Open year-round except 25 December and 1 January; hours vary by month",
      distanceKm: null,
      durationMinutes: null,
      ascentM: null,
      descentM: null,
      sacGrade: null,
      status: "open-with-advisory",
      statusNote: "Admission hours and last entry vary seasonally; book and recheck the official page.",
      start: {
        name: "Château de Chillon entrance",
        coordinates: { lat: 46.41454315185547, lng: 6.9274444580078125 },
        parking: "Limited free roadside car and coach parking for up to three hours; a permit is required.",
        publicTransport: "Veytaux-Chillon railway station or Veytaux, château de Chillon bus stop; peak-season boats also call at Chillon.",
      },
      finish: "Château de Chillon exit",
      accessibility:
        "The historic interior is not easily accessible to wheelchair or walker users. Cobbled courtyards, the café and adapted toilets are accessible; official virtual-tour terminals cover inaccessible areas.",
      feeInfo: "Paid admission applies. Current prices and accepted passes are listed on the official visit page.",
      restrictions: ["Assistance-dog eligibility follows the castle’s published rules."],
      safety: [...sharedSafety, "Courtyard cobbles can be slippery when wet."],
      uncertainties: [],
      sources: [
        source("Chillon — hours, prices, arrival and accessibility", "https://www.chillon.ch/en/visit/"),
        source("Chillon — visitor FAQ", "https://www.chillon.ch/en/faq/"),
        federalPlaceSource("Château de Chillon precinct", "Château de Chillon"),
        federalStopSource("Veytaux-Chillon station and castle bus stop", "Veytaux-Chillon"),
        source("Photograph and licence", imageFor("spot-chillon").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-landwasser-viaduct",
    slug: "landwasser-viaduct",
    name: "Landwasser Viaduct",
    tagline: "A railway landmark with distinct north, south and Hennings viewpoints",
    description:
      "The Landwasser Viaduct carries the Rhaetian Railway into a tunnel above the Landwasser valley. This card marks the federal railway structure; the recommended viewing point and stop are separate.",
    longDescription:
      "The viaduct is best understood as a railway landmark with several viewing approaches rather than a single trailhead. The published 600-metre access route from the seasonal shuttle stop includes steps and a steep descent, while Hennings platform is the quickest named viewpoint.",
    category: "viewpoint",
    difficulty: "moderate",
    region: "graubunden",
    coordinates: { lat: 46.680946350097656, lng: 9.67599868774414 },
    coordinateType: "attraction",
    heroImage: imageFor("spot-landwasser-viaduct"),
    gallery: [],
    tags: ["railway", "viaduct", "UNESCO", "Filisur"],
    bestSeason: ["summer", "autumn"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    distanceKm: 0.6,
    highlights: ["Hennings viewing platform", "Viaduct shuttle", "RhB UNESCO railway"],
    tips: [
      "The quickest verified route is from the seasonal Schmitten GR Landwasserviadukt stop to Hennings platform.",
      "Check the shuttle timetable; it does not run daily throughout its whole season.",
    ],
    whatToBring: ["Shoes with grip", "Weather protection", "Valid rail ticket if using the shuttle"],
    accessInfo:
      "Start at Schmitten (Albula) Landwasserviadukt stop, 46.680286, 9.672232. Hennings platform is about five minutes away on a maintained path. The official 600 m route from the stop to the picnic area takes about 15 minutes and includes steps and a steep descent. Parking is available at the Landwasser Viaduct car park; Hennings is about 25 minutes from it.",
    parkingAvailable: true,
    publicTransport: true,
    isFeatured: true,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Graubünden",
      routeType: "One-way access from viaduct shuttle stop to picnic area",
      season: "Shuttle: 14 May–25 October 2026 on the published operating days",
      distanceKm: 0.6,
      durationMinutes: 15,
      ascentM: 7,
      descentM: 65,
      sacGrade: "T2 · steps and steep sections",
      status: "open-with-advisory",
      statusNote: "The footpath is independent of the seasonal shuttle; check rail and trail status before travel.",
      start: {
        name: "Schmitten (Albula) Landwasserviadukt stop",
        coordinates: { lat: 46.6802864074707, lng: 9.672231674194336 },
        parking: "Landwasser Viaduct car park; the Hennings platform is about 25 minutes away on foot.",
        publicTransport: "Seasonal viaduct shuttle to Schmitten (Albula) Landwasserviadukt.",
      },
      finish: "Schmitten GR viaduct picnic area",
      accessibility:
        "The shuttle itself is accessible, but the path to the viewing platform has steps and is not barrier-free.",
      feeInfo: "The viewing paths are free. A valid second-class ticket is required for the viaduct shuttle.",
      restrictions: ["Remain on signed paths and never enter the active railway alignment."],
      safety: [...sharedSafety, "The access path has steps and steep sections."],
      uncertainties: [],
      sources: [
        source("Rhaetian Railway — viaduct shuttle and accessibility", "https://www.rhb.ch/en/excursions/viaduct-shuttle/"),
        source("Landwasser World — verified 600 m access route", "https://shop.landwasserwelt.ch/en/pages/groups"),
        source("Landwasser World — Hennings viewing platform approaches", "https://shop.landwasserwelt.ch/en/products/aussichtsplattform-hennings"),
        federalPlaceSource("Landwasser Viaduct structure and viewpoints", "Landwasserviadukt"),
        federalStopSource("Landwasser viaduct stop", "Landwasserviadukt"),
        source("Photograph and licence", imageFor("spot-landwasser-viaduct").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-bern-old-city",
    slug: "old-city-of-bern",
    name: "Old City of Bern",
    tagline: "A UNESCO-listed living city inside the bend of the Aare",
    description:
      "Bern’s Old City preserves its medieval street plan, arcades and fountains while remaining a lived-in city centre. The map point is a federal old-town area reference, not a single building.",
    longDescription:
      "For a concrete and reproducible visit, the practical details use Bern Welcome’s published accessible circular route from the railway station. That route is distinct from the broader UNESCO property and provides verified distance, duration and elevation figures.",
    category: "photo-spot",
    difficulty: "easy",
    region: "bern",
    coordinates: { lat: 46.94916534423828, lng: 7.4490461349487305 },
    coordinateType: "heritage_area_reference",
    heroImage: imageFor("spot-bern-old-city"),
    gallery: [],
    tags: ["UNESCO", "city walk", "arcades", "accessible route"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 2, max: 2 },
    distanceKm: 4.2,
    highlights: ["Zytglogge", "Sandstone arcades", "Aare viewpoints"],
    tips: ["Start at Bern station and use the published accessible city route for a clearly defined itinerary."],
    whatToBring: ["Comfortable walking shoes", "Weather protection"],
    accessInfo:
      "The verified route starts at Bern railway station, 46.948833, 7.439132. Bern Welcome’s accessible city route is 4.2 km, takes 2 hours and has 48 m ascent and descent. No dedicated old-town parking is recommended; use rail or a signed city car park.",
    parkingAvailable: false,
    publicTransport: true,
    isFeatured: false,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Bern",
      routeType: "Accessible circular city route",
      season: "Year-round",
      distanceKm: 4.2,
      durationMinutes: 120,
      ascentM: 48,
      descentM: 48,
      sacGrade: "Easy city route",
      status: "open",
      statusNote: "Public city route; temporary construction and event diversions can occur.",
      start: {
        name: "Bern railway station",
        coordinates: { lat: 46.94883346557617, lng: 7.439131736755371 },
        parking: "No dedicated heritage-site parking; use official city car parks outside pedestrian areas.",
        publicTransport: "Bern railway station is the route start and principal transport hub.",
      },
      finish: "Bern railway station",
      accessibility:
        "The published route is designed to avoid most cobbled sections, although the historic centre includes gradients and uneven surfaces.",
      feeInfo: "The public streets and route are free. Museums, tours and attractions may charge separately.",
      restrictions: ["Respect pedestrian zones, local traffic controls and the privacy of residents."],
      safety: [...sharedSafety, "Cobbles and gradients can be slippery in wet or icy conditions."],
      uncertainties: [],
      sources: [
        source("UNESCO — Old City of Berne", "https://whc.unesco.org/en/list/267"),
        source("Bern Welcome — accessible 4.2 km city route", "https://bern.com/en/inform/barrier-free-bern/accessible-city-tour-bern"),
        federalPlaceSource("Bern old-town reference", "Altstadt Bern"),
        federalStopSource("Bern railway station", "Bern"),
        source("Photograph and licence", imageFor("spot-bern-old-city").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-bellinzona-fortress",
    slug: "three-castles-of-bellinzona",
    name: "Three Castles of Bellinzona",
    tagline: "A three-site fortress visit beginning at Castelgrande",
    description:
      "Bellinzona’s UNESCO fortress comprises Castelgrande, Montebello and Sasso Corbaro. Because one point cannot represent three separate castles, this card deliberately uses Castelgrande as the mapped starting reference.",
    longDescription:
      "The three castles occupy separate elevations and do not share one entrance, timetable or accessibility profile. This entry starts at Castelgrande and treats Montebello and Sasso Corbaro as additional sites whose seasonal opening information must be checked individually.",
    category: "viewpoint",
    difficulty: "moderate",
    region: "ticino",
    coordinates: { lat: 46.19284439086914, lng: 9.02198314666748 },
    coordinateType: "heritage_area_reference",
    heroImage: imageFor("spot-bellinzona-fortress"),
    gallery: [],
    tags: ["UNESCO", "castles", "Bellinzona", "museum"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["Castelgrande", "Montebello", "Sasso Corbaro"],
    tips: ["Treat the three castles as separate sites; check which interiors are open in winter."],
    whatToBring: ["Comfortable walking shoes", "Water in warm weather"],
    accessInfo:
      "Begin at Castelgrande, 46.192844, 9.021983. Bellinzona, Stazione is at 46.194824, 9.028221. Piazza del Sole is the closest verified central parking reference. Montebello and Sasso Corbaro are higher separate sites reached on foot, by road, public transport or the seasonal tourist train.",
    parkingAvailable: true,
    publicTransport: true,
    isFeatured: true,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Ticino",
      routeType: "Three separate fortress sites; Castelgrande start",
      season: "Castelgrande operates year-round; Montebello and Sasso Corbaro interiors are seasonal",
      distanceKm: null,
      durationMinutes: null,
      ascentM: null,
      descentM: null,
      sacGrade: null,
      status: "open-with-advisory",
      statusNote: "From 28 March to 8 November 2026 all three castles are listed open daily 10:00–18:00; winter access differs.",
      start: {
        name: "Castelgrande",
        coordinates: { lat: 46.19284439086914, lng: 9.02198314666748 },
        parking: "Use signed central Bellinzona parking; Piazza del Sole is the closest verified central reference.",
        publicTransport: "Bellinzona, Stazione; continue on foot or by local transport depending on the castle.",
      },
      finish: null,
      accessibility:
        "Official tourism information states that accessibility is only partial and links each castle to detailed Pro Infirmis information.",
      feeInfo: "Courtyards and paid interiors differ. The Fortress Pass covers museums, exhibitions, walls and towers as specified by the operator.",
      restrictions: ["Opening periods and accessible areas differ between the three castles."],
      safety: [...sharedSafety, "Routes between the castles include slopes, steps and uneven historic surfaces."],
      uncertainties: [],
      sources: [
        source("Bellinzona e Valli — 2026 Fortress Pass and opening period", "https://booking.bellinzonaevalli.ch/en/products/bellinzona-pass"),
        source("Bellinzona e Valli — Montebello access and accessibility", "https://www.bellinzonaevalli.ch/en/commons/details/The-Castle-of-Montebello/2796.html"),
        source("Bellinzona e Valli — Sasso Corbaro access", "https://www.bellinzonaevalli.ch/en/commons/details/The-Castle-of-Sasso-Corbaro/2797.html"),
        federalPlaceSource("Castelgrande historic precinct", "Castel Grande"),
        federalStopSource("Bellinzona railway station", "Bellinzona Stazione"),
        source("Photograph and licence", imageFor("spot-bellinzona-fortress").sourceUrl!),
      ],
    }),
  },
  {
    id: "spot-stein-am-rhein",
    slug: "stein-am-rhein-old-town",
    name: "Stein am Rhein",
    tagline: "A compact old-town visit centred on Rathausplatz",
    description:
      "Stein am Rhein’s historic centre is known for its painted façades and Rathausplatz. The mapped point is the federal settlement reference for the old town—not the railway station or a parking area.",
    longDescription:
      "This is a compact public old-town visit rather than a defined hiking route. The railway station south of the Rhine is the most dependable arrival reference; visitor parking sits around the historic core and remains subject to current municipal signs and tariffs.",
    category: "photo-spot",
    difficulty: "easy",
    region: "schaffhausen",
    coordinates: { lat: 47.65896987915039, lng: 8.857444763183594 },
    coordinateType: "village",
    heroImage: imageFor("spot-stein-am-rhein"),
    gallery: [],
    tags: ["old town", "painted façades", "Rhine", "Schaffhausen"],
    bestSeason: ["year-round"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: ["Rathausplatz", "Painted façades", "Rhine waterfront"],
    tips: ["Arrive by rail and walk across the Rhine into the old town to avoid searching for central parking."],
    whatToBring: ["Comfortable city shoes", "Weather protection"],
    accessInfo:
      "Stein am Rhein railway station is at 47.655857, 8.855719, south of the Rhine. The city promotes a signed walking connection to the old town. Public parking is managed around, rather than inside, the historic centre; follow the current municipal parking signs.",
    parkingAvailable: true,
    publicTransport: true,
    isFeatured: false,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: "Schaffhausen",
      routeType: "Old-town destination visit",
      season: "Year-round",
      distanceKm: null,
      durationMinutes: null,
      ascentM: null,
      descentM: null,
      sacGrade: null,
      status: "open",
      statusNote: "The public old town is open; individual museums, shops and boat services have separate hours.",
      start: {
        name: "Stein am Rhein railway station",
        coordinates: { lat: 47.65585708618164, lng: 8.855718612670898 },
        parking: "Use signed municipal visitor parking around the old town; availability and tariffs vary.",
        publicTransport: "Stein am Rhein, Bahnhof; local buses and seasonal Rhine boats provide additional access.",
      },
      finish: null,
      accessibility:
        "The station-to-old-town link is a normal urban walking route. Historic paving and individual heritage buildings may limit step-free access.",
      feeInfo: "The public streets are free. Museums, tours and boat services may charge separately.",
      restrictions: ["Observe pedestrian-zone and parking controls in the historic centre."],
      safety: sharedSafety,
      uncertainties: [],
      sources: [
        source("City of Stein am Rhein — transport and parking policy", "https://www.steinamrhein.ch/public/upload/assets/4924/Leitbild%20Siedlungsentwicklung.pdf"),
        source("URh — Stein am Rhein public-transport arrival", "https://www.urh.ch/stein-am-rhein"),
        federalPlaceSource("Stein am Rhein settlement reference", "Stein am Rhein"),
        federalStopSource("Stein am Rhein railway station", "Stein am Rhein Bahnhof"),
        source("Photograph and licence", imageFor("spot-stein-am-rhein").sourceUrl!),
      ],
    }),
  },
];

interface MasterCatalogueEntry {
  index: number;
  id: string;
  slug: string;
  name: string;
  canton: string;
  region: Region;
  coordinates: { lat: number; lng: number };
  coordinateType: CoordinateType;
  category: LocationCategory;
  federalSearchUrl: string | null;
  federalMatchStatus: "candidate_match" | "manual_review" | "no_match";
  federalMatchLabel: string | null;
}

function swisstopoMapUrl(lat: number, lng: number) {
  const phi = (lat * 3600 - 169028.66) / 10000;
  const lam = (lng * 3600 - 26782.5) / 10000;
  const east =
    2600072.37 +
    211455.93 * lam -
    10938.51 * lam * phi -
    0.36 * lam * phi * phi -
    44.54 * lam ** 3;
  const north =
    1200147.07 +
    308807.95 * phi +
    3745.25 * lam ** 2 +
    76.63 * phi ** 2 -
    194.56 * lam ** 2 * phi +
    119.79 * phi ** 3;

  return `https://map.geo.admin.ch/?lang=en&topic=ech&bgLayer=ch.swisstopo.pixelkarte-farbe&E=${Math.round(east)}&N=${Math.round(north)}&zoom=8`;
}

const placeTypeCopy: Record<CoordinateType, { tagline: string; description: string }> = {
  attraction: {
    tagline: "A sourced landmark reference with unfinished logistics labelled clearly",
    description: "The published pin identifies the named landmark. It is not presented as a verified trailhead, parking area or public-transport stop.",
  },
  summit: {
    tagline: "A sourced summit reference—not a route or access recommendation",
    description: "The published pin identifies the summit. It does not imply that a hiking route, ascent conditions or safe access have been verified.",
  },
  lake_center: {
    tagline: "A sourced lake reference kept separate from access and parking",
    description: "The published pin represents the lake itself. Shore access, trailheads, parking and public transport require separate confirmation.",
  },
  village: {
    tagline: "A sourced settlement reference for planning a future visit",
    description: "The published pin identifies the named settlement. Individual sights, parking areas and walking routes have their own current information.",
  },
  valley_reference: {
    tagline: "A broad landscape reference—not a single trail or entrance",
    description: "This is a representative point within the named valley or landscape. The area can have several access points, routes and local restrictions.",
  },
  viewpoint: {
    tagline: "A sourced destination point with access still to be confirmed",
    description: "The published pin identifies the named destination or viewpoint. It is not automatically a safe or publicly accessible route start.",
  },
  heritage_area_reference: {
    tagline: "A sourced reference within a wider protected or historic area",
    description: "This point represents the named area for orientation. One pin cannot describe every entrance, site, path or rule within the wider property.",
  },
};

function buildSourceBackedLocation(entry: MasterCatalogueEntry): Location {
  const copy = placeTypeCopy[entry.coordinateType];
  const image = SOURCED_IMAGES[entry.id]?.[0];
  const reviewed = REVIEWED_LOCATION_ENRICHMENTS[entry.id];
  const sources: LocationSource[] = [
    source(
      "Swiss federal map — published destination point",
      swisstopoMapUrl(entry.coordinates.lat, entry.coordinates.lng)
    ),
  ];

  if (entry.federalSearchUrl) {
    sources.push(source("Swiss federal gazetteer — name search", entry.federalSearchUrl));
  }
  if (image?.sourceUrl) {
    sources.push(source("Wikimedia Commons — photograph, creator and licence", image.sourceUrl));
  }
  if (reviewed) {
    sources.push(...reviewed.sources.map((item) => source(item.label, item.url)));
  }

  const matchUncertainty =
    entry.federalMatchStatus === "candidate_match"
      ? `The federal gazetteer returned a nearby candidate (${entry.federalMatchLabel ?? "unnamed result"}); the published point remains a destination reference, not a verified trailhead.`
      : "The federal name search did not return one unambiguous direct feature match. The supplied representative point is retained and should not be treated as a trailhead.";

  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.name,
    tagline: reviewed?.tagline ?? copy.tagline,
    description: reviewed?.description ?? `${entry.name} is listed in ${entry.canton}. ${copy.description}`,
    longDescription: reviewed?.longDescription ??
      "Swiss Trails currently publishes the destination identity, representative point and source trail for this place. Exact route distance, duration, elevation gain, parking, public transport, fees, accessibility and seasonal access are deliberately left unresolved until each claim has a suitable current source.",
    category: entry.category,
    difficulty: reviewed?.difficulty ?? "not-rated",
    region: entry.region,
    coordinates: entry.coordinates,
    coordinateType: entry.coordinateType,
    heroImage: image ?? {
      id: `placeholder-${entry.slug}`,
      url: "",
      alt: entry.name,
      isHero: true,
    },
    gallery: [],
    tags: [entry.name, entry.canton, entry.coordinateType.replaceAll("_", " "), reviewed ? "official-route-source" : "source-linked"],
    bestSeason: reviewed?.bestSeason ?? ["check-current"],
    travelTimeMinutes: 0,
    visitDurationHours: { min: 0, max: 0 },
    highlights: reviewed?.highlights ?? [
      `Named destination in ${entry.canton}`,
      `${entry.coordinateType.replaceAll("_", " ")} map reference`,
      image ? "Location-linked licensed photograph" : "Honest placeholder—no unverified photograph",
    ],
    tips: reviewed?.tips ?? ["Open the linked federal map and current local information before travelling."],
    whatToBring: reviewed?.whatToBring ?? [],
    accessInfo: reviewed?.accessInfo ?? "No route start, parking place or public-transport stop is claimed for this record yet.",
    parkingAvailable: reviewed?.parkingAvailable ?? false,
    publicTransport: reviewed?.publicTransport ?? false,
    distanceKm: reviewed?.route.distanceKm ?? undefined,
    isFeatured: false,
    isNew: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    verification: verification({
      canton: entry.canton,
      routeType: reviewed ? `Reviewed: ${reviewed.route.label}` : "Destination reference only",
      season: reviewed?.route.season ?? "Not independently verified—check current local information",
      distanceKm: reviewed?.route.distanceKm ?? null,
      durationMinutes: reviewed?.route.durationMinutes ?? null,
      ascentM: reviewed?.route.ascentM ?? null,
      descentM: reviewed?.route.descentM ?? null,
      elevationNote: reviewed
        ? "Published route figures describe the named route in the source—not the straight-line distance to the destination pin. The pin remains a destination reference."
        : "No walking route or access effort is published for this record.",
      sacGrade: reviewed?.route.grade ?? null,
      status: "check-current",
      statusNote: reviewed
        ? "The destination and cited planning details were reviewed online. The map pin is not claimed as the route start; check live conditions and the official source before departure."
        : "The destination identity and reference point are source-linked. Visit logistics and current operating conditions still require confirmation.",
      start: {
        name: reviewed?.route.startName ?? "Destination reference—not a verified trailhead",
        coordinates: entry.coordinates,
        parking: reviewed?.route.parking ?? "Not independently verified. Check official local visitor information and on-site signs.",
        publicTransport: reviewed?.route.publicTransport ?? "Not independently verified. Plan the journey with the current public-transport timetable.",
      },
      finish: reviewed?.route.finish ?? null,
      accessibility: reviewed?.route.accessibility ?? "Not independently verified for this destination record.",
      feeInfo: reviewed?.route.feeInfo ?? "Not independently verified; fees and operating periods can change.",
      restrictions: reviewed?.route.restrictions ?? [
        "Check current closures, protected-area rules, permits and seasonal restrictions with the responsible local authority before travel.",
      ],
      safety: reviewed?.route.safety ?? sharedSafety,
      uncertainties: reviewed
        ? [matchUncertainty, ...reviewed.route.uncertainties]
        : [matchUncertainty, "Route distance, duration, elevation gain and an exact access point are not yet published."],
      sources,
    }),
  };
}

const detailedByName = new Map(DETAILED_LOCATIONS.map((location) => [location.name, location]));

export const CURATED_LOCATIONS: Location[] = (masterCatalogue as MasterCatalogueEntry[]).map(
  (entry) => detailedByName.get(entry.name) ?? buildSourceBackedLocation(entry)
);

export const CURATED_LOCATION_IDS = new Set(CURATED_LOCATIONS.map((location) => location.id));

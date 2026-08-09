import { readFile, writeFile } from "node:fs/promises";

const inputPath = process.argv[2] ?? "/private/tmp/swiss-trails-geoadmin-audit.json";
const outputPath = process.argv[3] ?? "docs/location-audit-2026-08-09.csv";

const checkedAt = "2026-08-09";
const verified = {
  Oeschinensee: {
    lat: 46.49835968017578,
    lng: 7.72667121887207,
    type: "lake_center",
    start: "Kandersteg (Talstation Oeschinen), 46.497478, 7.682684",
    parking: "Paid valley-station parking and designated hiking car parks; capacity limited",
    transport: "Kandersteg railway station, 46.495396, 7.671812",
    source: "https://www.oeschinensee.ch/anreise/",
    uncertainty: "Live gondola, trail, boat and taxi status must be rechecked on travel day",
  },
  "Rhine Falls": {
    lat: 47.6780891418457,
    lng: 8.614919662475586,
    type: "viewpoint",
    start: "Neuhausen Rheinfall station (north-bank access), 47.679806, 8.616942",
    parking: "Official Rhine Falls P1–P4 in Neuhausen; tariffs apply",
    transport: "Neuhausen Rheinfall; Schloss Laufen am Rheinfall serves the south bank",
    source: "https://rheinfall.ch/en/inform/journey/map",
    uncertainty: "North- and south-bank tickets and accessibility differ",
  },
  "Chapel Bridge": {
    lat: 47.05156707763672,
    lng: 8.307458877563477,
    type: "attraction",
    start: "Lucerne railway station, 47.050755, 8.310246",
    parking: "No dedicated attraction parking verified; use an official city car park",
    transport: "Luzern, Bahnhof, 47.050755, 8.310246",
    source: "https://www.luzern.com/en/poi/chapel-bridge",
    uncertainty: "Temporary city maintenance or event controls remain possible",
  },
  "Château de Chillon": {
    lat: 46.41454315185547,
    lng: 6.9274444580078125,
    type: "attraction",
    start: "Château de Chillon entrance, 46.414543, 6.927444",
    parking: "Limited free roadside parking up to three hours; permit required",
    transport: "Veytaux-Chillon station, 46.417622, 6.927858; Veytaux, château de Chillon bus stop",
    source: "https://www.chillon.ch/en/visit/",
    uncertainty: "Admission hours and last entry vary by month",
  },
  "Landwasser Viaduct": {
    lat: 46.680946350097656,
    lng: 9.67599868774414,
    type: "attraction",
    start: "Schmitten (Albula) Landwasserviadukt stop, 46.680286, 9.672232",
    parking: "Landwasser Viaduct car park; approximately 25 minutes to Hennings platform",
    transport: "Seasonal viaduct shuttle to Schmitten (Albula) Landwasserviadukt",
    source: "https://www.rhb.ch/en/excursions/viaduct-shuttle/",
    uncertainty: "Shuttle runs only on published operating days",
  },
  "Old City of Bern": {
    lat: 46.94916534423828,
    lng: 7.4490461349487305,
    type: "heritage_area_reference",
    start: "Bern railway station, 46.948833, 7.439132",
    parking: "No dedicated heritage-site parking; use official city car parks",
    transport: "Bern railway station, 46.948833, 7.439132",
    source: "https://bern.com/en/inform/barrier-free-bern/accessible-city-tour-bern",
    uncertainty: "Temporary works and events can alter the public route",
  },
  "Three Castles of Bellinzona": {
    lat: 46.19284439086914,
    lng: 9.02198314666748,
    type: "heritage_area_reference",
    start: "Castelgrande, 46.192844, 9.021983",
    parking: "Signed central Bellinzona parking; Piazza del Sole is the closest central reference",
    transport: "Bellinzona, Stazione, 46.194824, 9.028221",
    source: "https://booking.bellinzonaevalli.ch/en/products/bellinzona-pass",
    uncertainty: "One point cannot represent all three castles; mapped point is explicitly Castelgrande",
  },
  "Stein am Rhein": {
    lat: 47.65896987915039,
    lng: 8.857444763183594,
    type: "village",
    start: "Stein am Rhein railway station, 47.655857, 8.855719",
    parking: "Signed municipal visitor parking around the historic centre",
    transport: "Stein am Rhein, Bahnhof, 47.655857, 8.855719",
    source: "https://www.urh.ch/stein-am-rhein",
    uncertainty: "Individual museums, boat services and parking tariffs have separate current information",
  },
};

function csv(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const audit = JSON.parse(await readFile(inputPath, "utf8"));
const headers = [
  "Number",
  "Name",
  "Canton",
  "Verified latitude",
  "Verified longitude",
  "Coordinate type",
  "Exact start",
  "Parking",
  "Nearest public transport",
  "Primary official source",
  "Last checked",
  "Publication status",
  "Uncertainties / next action",
];

const rows = audit.places.map((place) => {
  const item = verified[place.name];
  if (item) {
    return [
      place.index,
      place.name,
      place.canton,
      item.lat,
      item.lng,
      item.type,
      item.start,
      item.parking,
      item.transport,
      item.source,
      checkedAt,
      "published_source_checked",
      item.uncertainty,
    ];
  }

  return [
    place.index,
    place.name,
    place.canton,
    "",
    "",
    "",
    "",
    "",
    "",
    place.searches?.[0]?.url ?? "",
    checkedAt,
    "hidden_pending_manual_verification",
    "The supplied coordinate is not treated as verified. Exact map object, access point, parking, public transport, current rules and an authentic licensed photograph still require manual source review.",
  ];
});

const document = [headers, ...rows].map((row) => row.map(csv).join(",")).join("\n");
await writeFile(outputPath, `${document}\n`, "utf8");
console.log(`Wrote ${rows.length} audit rows to ${outputPath}`);

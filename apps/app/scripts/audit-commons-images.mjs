import { writeFile } from "node:fs/promises";

const outputPath = process.argv[2] ?? "/private/tmp/swiss-trails-commons-candidates.json";
const queries = [
  "Oeschinensee Switzerland",
  "Rhine Falls Rheinfall Switzerland",
  "Kapellbrücke Luzern",
  "Château de Chillon Switzerland",
  "Landwasserviadukt Switzerland",
  "Old City of Bern Switzerland",
  "Bellinzona three castles Switzerland",
  "Stein am Rhein old town Switzerland",
];

function metadataValue(metadata, key) {
  return metadata?.[key]?.value ?? null;
}

async function searchImages(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "12");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|mime|extmetadata");
  url.searchParams.set("iiurlwidth", "960");
  url.searchParams.set("origin", "*");

  const response = await fetch(url, { headers: { "user-agent": "SwissTrailsImageAudit/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  const payload = await response.json();
  const pages = Object.values(payload.query?.pages ?? {});
  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      const metadata = info?.extmetadata;
      return {
        title: page.title,
        pageUrl: info?.descriptionurl ?? null,
        imageUrl: info?.url ?? null,
        thumbnailUrl: info?.thumburl ?? null,
        width: info?.width ?? null,
        height: info?.height ?? null,
        mime: info?.mime ?? null,
        artist: metadataValue(metadata, "Artist"),
        credit: metadataValue(metadata, "Credit"),
        licenseShortName: metadataValue(metadata, "LicenseShortName"),
        licenseUrl: metadataValue(metadata, "LicenseUrl"),
        usageTerms: metadataValue(metadata, "UsageTerms"),
        description: metadataValue(metadata, "ImageDescription"),
        categories: metadataValue(metadata, "Categories"),
      };
    })
    .filter((candidate) => candidate.mime?.startsWith("image/") && candidate.width >= 1200);
}

const results = [];
for (const query of queries) {
  const candidates = await searchImages(query);
  results.push({ query, candidates });
  process.stderr.write(`Found ${candidates.length} candidates for ${query}\n`);
}

const report = {
  generatedAt: new Date().toISOString(),
  source: "Wikimedia Commons MediaWiki API",
  note: "Candidates require visual identity and license review before publication.",
  results,
};
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, queries: results.length }, null, 2));

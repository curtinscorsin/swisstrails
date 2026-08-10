import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-10T12:00:00Z");
  return ["", "/privacy", "/terms"].map((path) => ({
    url: `https://swiss-trails.com${path}`,
    lastModified,
    changeFrequency: path ? "yearly" : "monthly",
    priority: path ? 0.4 : 1,
  }));
}

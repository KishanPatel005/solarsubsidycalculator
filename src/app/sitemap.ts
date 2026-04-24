import type { MetadataRoute } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { statesAndUTs } from "@/lib/data/states";

function siteUrl() {
  return "https://solarsubsidycalculator.com";
}

async function listBlogSlugs(): Promise<string[]> {
  // Requested path: /content/blogs/ — in this repo it's under /src/content/blogs/
  // Return [] if directory doesn't exist.
  const root = process.cwd();
  const base = path.join(root, "src", "content", "blogs");

  try {
    const entries = await readdir(base, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => n.endsWith(".md") || n.endsWith(".mdx"))
      .map((n) => n.replace(/\.(md|mdx)$/i, ""));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap = [
    { url: `${siteUrl()}/`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl()}/calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const statePages: MetadataRoute.Sitemap = statesAndUTs.map((s) => ({
    // Canonical requested shape
    url: `${siteUrl()}/solar-subsidy-${s.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = [
    { url: `${siteUrl()}/solar-subsidy`, lastModified, changeFrequency: "weekly", priority: 0.7 },
  ];

  const blogSlugs = await listBlogSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl()}/blog/${slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...home, ...statePages, ...blogPages, ...guidePages];
}


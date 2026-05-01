import type { MetadataRoute } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { statesAndUTs } from "@/lib/data/states";
import { topCities2026 } from "@/lib/data/cities";
import { getSiteUrl } from "@/lib/siteUrl";

async function listBlogSlugs(): Promise<string[]> {
  const root = process.cwd();
  const base = path.join(root, "content", "blogs");

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
  const base = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    // Homepage
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1.0 },

    // Core calculator + calculators
    { url: `${base}/calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solar-rooftop-price-list`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solar-panel-calculator-government`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solar-power-calculator-kwh`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solar-rooftop-calculator-app`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/net-metering-calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solar-loan-calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/pm-kusum-calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/should-i-go-solar`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    // Guides
    { url: `${base}/solar-subsidy`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    // Hindi home
    { url: `${base}/hi`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/hi/solar-subsidy-gujarat`, lastModified, changeFrequency: "weekly", priority: 0.7 },

    // About
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];

  const statePages: MetadataRoute.Sitemap = statesAndUTs.map((s) => ({
    url: `${base}/solar-subsidy-${s.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = topCities2026.map((c) => ({
    // Public URL shape is via rewrite -> /solar-city/[city]
    url: `${base}/solar-subsidy-${c.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogSlugs = await listBlogSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...blogPages];
}


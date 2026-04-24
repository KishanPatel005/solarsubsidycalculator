import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import type { BlogPost } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blogs");

function toSlug(fileName: string) {
  return fileName.replace(/\.mdx$/i, "");
}

function safeString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function safeStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string") as string[];
}

function safeBool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function readMdxFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

function parsePost(slug: string, filePath: string): BlogPost {
  const parsed = readMdxFile(filePath);
  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content ?? "";
  const rt = readingTime(content).text;

  const heroImage =
    safeString(data.heroImage) || `/blogs/${slug}/hero.webp`;

  return {
    slug,
    title: safeString(data.title),
    description: safeString(data.description),
    date: safeString(data.date),
    category: safeString(data.category),
    keywords: safeStringArray(data.keywords),
    author: safeString(data.author, "Solar Subsidy Calculator Team"),
    readingTime: rt,
    featured: safeBool(data.featured, false),
    state: safeString(data.state) || undefined,
    heroImage,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));

  const posts = files.map((fileName) => {
    const slug = toSlug(fileName);
    const filePath = path.join(BLOG_DIR, fileName);
    const post = parsePost(slug, filePath);

    // Return array WITHOUT content field (runtime), while keeping TS shape stable.
    // Consumers should use getPostBySlug for full content.
    return { ...post, content: "" };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${slug}`);
  }
  return parsePost(slug, filePath);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const all = getAllPosts();
  return all.filter((p) => p.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  const all = getAllPosts();
  return all.filter((p) => p.featured).slice(0, 3);
}

export function getRelatedPosts(currentSlug: string, category: string): BlogPost[] {
  const all = getAllPosts();
  return all.filter((p) => p.slug !== currentSlug && p.category === category).slice(0, 3);
}


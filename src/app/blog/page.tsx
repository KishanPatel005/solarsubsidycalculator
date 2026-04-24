import type { Metadata } from "next";

import { getAllPosts, getFeaturedPosts } from "@/lib/blog";
import { BlogGrid } from "@/app/blog/BlogGrid";
import { BlogCard } from "@/components/blog/BlogCard";
import { Badge } from "@/components/ui/badge";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const base = getSiteUrl();
  return {
    title: "Solar Subsidy Blog — Guides & Tips India 2025",
    description:
      "Expert guides on PM Surya Ghar, solar subsidy by state, how to apply, and maximize your savings.",
    openGraph: {
      title: "Solar Subsidy Blog — Guides & Tips India 2025",
      description:
        "Expert guides on PM Surya Ghar, solar subsidy by state, how to apply, and maximize your savings.",
      url: `${base}/blog`,
      type: "website",
    },
  };
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();

  return (
    <div className="space-y-10 pb-10">
      {/* Hero */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">
            Updated 2025
          </Badge>
          <Badge variant="secondary">{posts.length} Guides</Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solar Subsidy Guides &amp; Tips
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Expert guides on solar subsidy, PM Surya Ghar scheme and state wise
          benefits for Indian homeowners.
        </p>
      </section>

      {/* Featured */}
      {featured.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Featured guides</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {featured.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* All posts with tabs */}
      <BlogGrid posts={posts} />
    </div>
  );
}


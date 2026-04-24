import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { MDXRemote } from "next-mdx-remote/rsc";

import type { BlogPost } from "@/types/blog";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MDXContent";
import { BlogHeroImage } from "@/components/blog/BlogHeroImage";
import { BlogCard } from "@/components/blog/BlogCard";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareRow } from "@/components/blog/ShareRow";
import { LeadForm } from "@/components/forms/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function siteUrl() {
  return "https://solarsubsidycalculator.com";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function breadcrumbSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl()}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl()}/blog/${post.slug}` },
    ],
  };
}

function articleSchema(post: BlogPost) {
  const imageUrl = post.heroImage.startsWith("http")
    ? post.heroImage
    : `${siteUrl()}${post.heroImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Solar Subsidy Calculator" },
    image: imageUrl,
    url: `${siteUrl()}/blog/${post.slug}`,
  };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  try {
    const post = getPostBySlug(params.slug);
    const imageUrl = post.heroImage.startsWith("http")
      ? post.heroImage
      : `${siteUrl()}${post.heroImage}`;

    return {
      title: `${post.title} | Solar Subsidy Calculator`,
      description: post.description,
      keywords: post.keywords.join(", "),
      openGraph: {
        title: post.title,
        description: post.description,
        images: [{ url: imageUrl }],
        url: `${siteUrl()}/blog/${post.slug}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Blog post not found | Solar Subsidy Calculator",
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: BlogPost;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    return notFound();
  }

  const related = getRelatedPosts(post.slug, post.category);
  const breadcrumbJson = JSON.stringify(breadcrumbSchema(post));
  const articleJson = JSON.stringify(articleSchema(post));

  const stateGuideHref = post.state ? `/solar-subsidy-${post.state}` : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJson }} />

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{post.title}</li>
            </ol>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">{post.category}</Badge>
            <Badge variant="secondary">{post.readingTime}</Badge>
            <Badge variant="outline">{formatDate(post.date)}</Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{post.title}</h1>

          <BlogHeroImage src={post.heroImage} alt={post.title} priority />

          <div className="prose prose-neutral max-w-none">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <Separator />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((k) => (
              <Badge key={k} variant="secondary">
                {k}
              </Badge>
            ))}
          </div>

          {/* Share */}
          <ShareRow title={post.title} />

          {/* Author */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 px-3 py-2 text-amber-800">☀️</div>
              <div>
                <div className="text-sm font-semibold">Solar Subsidy Calculator Team</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Helping Indian families navigate solar since 2025
                </div>
              </div>
            </div>
          </Card>

          {/* Related */}
          {related.length ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Related Guides</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Mobile-only lead form */}
          <div className="lg:hidden">
            <LeadForm calculatorType="subsidy" state={post.state} />
          </div>
        </div>

        {/* RIGHT */}
        <aside className="mt-10 hidden space-y-6 lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents content={post.content} />
            <Separator />
            <LeadForm calculatorType="subsidy" state={post.state} />
            <Separator />
            <Card className="p-4">
              <div className="text-sm font-semibold">Quick Links</div>
              <div className="mt-3 space-y-2 text-sm">
                <Link href="/calculator" className="block text-amber-700 hover:underline">
                  Open calculator
                </Link>
                {stateGuideHref ? (
                  <Link href={stateGuideHref} className="block text-amber-700 hover:underline">
                    View {post.state} subsidy guide
                  </Link>
                ) : null}
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}


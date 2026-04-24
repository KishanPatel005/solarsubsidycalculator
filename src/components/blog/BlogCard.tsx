"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogPost } from "@/types/blog";
import BlogImage from "@/components/blog/BlogImage";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="overflow-hidden rounded-xl shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-video">
          <div className="absolute inset-0">
            <BlogImage src={post.heroImage} alt={post.title} width={1200} height={630} />
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-3">{post.description}</p>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1">
              {post.readingTime} <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {post.state ? (
            <div className="mt-3">
              <Badge variant="secondary">State: {post.state}</Badge>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}


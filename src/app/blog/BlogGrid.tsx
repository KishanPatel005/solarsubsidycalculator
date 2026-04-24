"use client";

import * as React from "react";

import type { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORY_LABELS = [
  "All",
  "Scheme Guide",
  "State Guide",
  "Tips & Tools",
] as const;

type Category = (typeof CATEGORY_LABELS)[number];

function filterPosts(posts: BlogPost[], category: Category) {
  if (category === "All") return posts;
  return posts.filter((p) => p.category === category);
}

export function BlogGrid(props: { posts: BlogPost[] }) {
  const [category, setCategory] = React.useState<Category>("All");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">All Guides</h2>
      </div>

      <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
        <TabsList className="w-full flex-wrap justify-start">
          {CATEGORY_LABELS.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORY_LABELS.map((c) => (
          <TabsContent key={c} value={c} className="pt-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filterPosts(props.posts, c as Category).map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}


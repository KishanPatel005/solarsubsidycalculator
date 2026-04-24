"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TocItem = { id: string; text: string };

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractH2(content: string): TocItem[] {
  const matches = content.match(/^##\s+(.+)$/gm) ?? [];
  return matches
    .map((m) => m.replace(/^##\s+/, "").trim())
    .filter(Boolean)
    .map((t) => ({ text: t, id: slugify(t) }));
}

export function TableOfContents({ content }: { content: string }) {
  const items = React.useMemo(() => extractH2(content), [content]);
  const [open, setOpen] = React.useState(true);
  const [activeId, setActiveId] = React.useState<string | null>(items[0]?.id ?? null);

  React.useEffect(() => {
    if (!items.length) return;
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? -1 : 1));
        if (inView[0]?.target?.id) setActiveId(inView[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-gray-900">Table of contents</div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <div className={`${open ? "mt-3" : "hidden"} lg:mt-3 lg:block`}>
        <ol className="space-y-2 text-sm">
          {items.map((i) => {
            const active = i.id === activeId;
            return (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`block rounded px-2 py-1 ${
                    active ? "bg-amber-50 text-amber-800" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}


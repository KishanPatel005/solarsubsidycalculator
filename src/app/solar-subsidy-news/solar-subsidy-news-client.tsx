"use client";

import Link from "next/link";
import { ExternalLink, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { solarSubsidyNews2026 } from "@/lib/data/solarSubsidyNews";

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

export function SolarSubsidyNewsClient() {
  const items = [...solarSubsidyNews2026].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const lastUpdated = items[0]?.dateISO ?? null;

  return (
    <div className="space-y-10 pb-12">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          {lastUpdated ? <Badge variant="secondary">Last update: {formatDate(lastUpdated)}</Badge> : null}
          <Badge variant="secondary">Repeat visitors page</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Solar Subsidy News India 2026 — Latest Updates
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Track PM Surya Ghar updates, state scheme changes, budget announcements, and DISCOM tie-ups. We’ll keep this
            page refreshed whenever there’s meaningful news.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
            <Link href="/calculator">Open calculator</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/solar-subsidy">Browse state guides</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <RefreshCcw className="h-4 w-4 text-solar-700" />
          Latest updates
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((n) => (
            <Card key={`${n.dateISO}-${n.headline}`} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{formatDate(n.dateISO)}</div>
                  <div className="mt-1 text-base font-semibold text-foreground">{n.headline}</div>
                </div>
                <Badge variant="secondary">{n.tags[0] ?? "Update"}</Badge>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{n.summary}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {n.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>

                <a
                  href={n.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
                >
                  Source: {n.sourceLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold text-foreground">Want updates added?</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Share a DISCOM circular, MNRE update, or policy notification and we’ll add it here (with source link) so this
            page stays evergreen.
          </p>
        </Card>
      </section>
    </div>
  );
}


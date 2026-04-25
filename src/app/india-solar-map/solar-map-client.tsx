"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getSolarPotentialStateRows, type SolarPotentialGrade } from "@/lib/data/solarPotential";
import { formatINR } from "@/lib/utils/formatCurrency";

function centralSubsidyByKw(systemSizeKw: number) {
  let subsidy =
    systemSizeKw <= 2
      ? systemSizeKw * 30_000
      : systemSizeKw <= 3
        ? 60_000 + (systemSizeKw - 2) * 18_000
        : 78_000;
  subsidy = Math.min(subsidy, 78_000);
  return Math.max(0, Math.round(subsidy));
}

function gradeColor(g: SolarPotentialGrade) {
  switch (g) {
    case "A+":
      return "fill-emerald-600";
    case "A":
      return "fill-emerald-500";
    case "B+":
      return "fill-amber-500";
    case "B":
      return "fill-orange-500";
  }
}

function gradeBadgeVariant(g: SolarPotentialGrade) {
  switch (g) {
    case "A+":
      return "bg-emerald-600 text-white hover:bg-emerald-700";
    case "A":
      return "bg-emerald-500 text-white hover:bg-emerald-600";
    case "B+":
      return "bg-amber-500 text-white hover:bg-amber-600";
    case "B":
      return "bg-orange-500 text-white hover:bg-orange-600";
  }
}

const tilesLayout: readonly { slug: string; x: number; y: number; label: string }[] = [
  // A simple SVG tile-map (schematic) for backlinks/shares: click any state/UT.
  { slug: "ladakh", x: 7, y: 0, label: "LA" },
  { slug: "jammu-and-kashmir", x: 6, y: 1, label: "J&K" },
  { slug: "himachal-pradesh", x: 7, y: 1, label: "HP" },
  { slug: "punjab", x: 6, y: 2, label: "PB" },
  { slug: "chandigarh", x: 7, y: 2, label: "CH" },
  { slug: "haryana", x: 8, y: 2, label: "HR" },
  { slug: "delhi", x: 8, y: 3, label: "DL" },
  { slug: "uttarakhand", x: 9, y: 2, label: "UK" },
  { slug: "rajasthan", x: 6, y: 4, label: "RJ" },
  { slug: "uttar-pradesh", x: 9, y: 4, label: "UP" },
  { slug: "bihar", x: 11, y: 4, label: "BR" },
  { slug: "sikkim", x: 12, y: 3, label: "SK" },
  { slug: "arunachal-pradesh", x: 14, y: 3, label: "AR" },
  { slug: "assam", x: 13, y: 4, label: "AS" },
  { slug: "nagaland", x: 14, y: 4, label: "NL" },
  { slug: "manipur", x: 14, y: 5, label: "MN" },
  { slug: "mizoram", x: 13, y: 5, label: "MZ" },
  { slug: "tripura", x: 13, y: 6, label: "TR" },
  { slug: "meghalaya", x: 12, y: 5, label: "ML" },
  { slug: "west-bengal", x: 12, y: 4, label: "WB" },
  { slug: "jharkhand", x: 11, y: 5, label: "JH" },
  { slug: "odisha", x: 11, y: 6, label: "OD" },

  { slug: "gujarat", x: 5, y: 6, label: "GJ" },
  { slug: "dadra-and-nagar-haveli-and-daman-and-diu", x: 6, y: 7, label: "DN" },
  { slug: "maharashtra", x: 7, y: 7, label: "MH" },
  { slug: "goa", x: 6, y: 8, label: "GA" },
  { slug: "madhya-pradesh", x: 8, y: 6, label: "MP" },
  { slug: "chhattisgarh", x: 9, y: 6, label: "CG" },
  { slug: "telangana", x: 9, y: 8, label: "TG" },
  { slug: "andhra-pradesh", x: 10, y: 9, label: "AP" },
  { slug: "karnataka", x: 8, y: 9, label: "KA" },
  { slug: "tamil-nadu", x: 9, y: 11, label: "TN" },
  { slug: "kerala", x: 8, y: 11, label: "KL" },
  { slug: "puducherry", x: 10, y: 11, label: "PY" },

  // Islands
  { slug: "andaman-and-nicobar-islands", x: 14, y: 11, label: "AN" },
  { slug: "lakshadweep", x: 5, y: 11, label: "LD" },
];

export function IndiaSolarMapClient() {
  const rows = useMemo(() => getSolarPotentialStateRows(), []);

  const bySlug = useMemo(() => {
    const m = new Map(rows.map((r) => [r.slug, r]));
    return m;
  }, [rows]);

  const [activeSlug, setActiveSlug] = useState<string>("gujarat");
  const active = bySlug.get(activeSlug) ?? rows[0];

  const subsidyEstimate = useMemo(() => {
    // Backlink/share-friendly: show the max official central subsidy (up to 3kW).
    return centralSubsidyByKw(3);
  }, []);

  const tileSize = 34;
  const tileGap = 6;
  const pad = 10;
  const svgW = pad * 2 + (16 * (tileSize + tileGap));
  const svgH = pad * 2 + (13 * (tileSize + tileGap));

  return (
    <div className="space-y-10 pb-12">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">Interactive map</Badge>
          <Badge variant="secondary">State-wise sun hours</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            India Solar Potential Map 2026 — State Wise Solar Irradiance
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Click a state/UT to see typical peak sun hours, best districts for rooftop solar, and an official central
            subsidy estimate (up to 3kW).
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground">Interactive India solar map (schematic)</div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-600" /> A+
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-emerald-500" /> A
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-amber-500" /> B+
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-orange-500" /> B
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <svg
              width={svgW}
              height={svgH}
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="mx-auto block min-w-[640px]"
              role="img"
              aria-label="India solar potential map"
            >
              {tilesLayout.map((t) => {
                const r = bySlug.get(t.slug);
                if (!r) return null;
                const x = pad + t.x * (tileSize + tileGap);
                const y = pad + t.y * (tileSize + tileGap);
                const isActive = activeSlug === t.slug;
                return (
                  <g key={t.slug} onClick={() => setActiveSlug(t.slug)} className="cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={tileSize}
                      height={tileSize}
                      rx={8}
                      className={`${gradeColor(r.grade)} ${isActive ? "opacity-100" : "opacity-85"} transition-opacity`}
                      stroke={isActive ? "#111827" : "rgba(17,24,39,0.25)"}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      x={x + tileSize / 2}
                      y={y + tileSize / 2 + 4}
                      textAnchor="middle"
                      className="select-none fill-white text-[10px] font-semibold"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4" />
            <p>
              This is a schematic tile-map for fast comparison and sharing. For exact irradiance layers, use MNRE/NISE
              GIS tools—this page is designed for quick planning and backlinks.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Selected state / UT</div>
              <div className="mt-1 text-xl font-bold text-foreground">{active?.name}</div>
              <div className="mt-2">
                <Badge className={gradeBadgeVariant(active?.grade ?? "B")}>
                  Grade {active?.grade}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href={`/solar-subsidy-${activeSlug}`}>Open subsidy guide</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Typical peak sun hours</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{active?.sunHours.toFixed(1)} hrs/day</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Central subsidy estimate (up to 3kW)</div>
              <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(subsidyEstimate)}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Actual state bonus varies by policy/utility.
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-solar-700" />
              Best districts (planning shortlist)
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(active?.bestDistricts ?? []).map((d) => (
                <Badge key={d} variant="secondary">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Data table */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">State-wise solar potential table</h2>
          <p className="text-sm text-muted-foreground">
            Use this for quick comparisons and as a shareable reference.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">State / UT</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Grade</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Sun hours</th>
                  <th className="px-4 py-3 font-semibold">Best districts</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .slice()
                  .sort((a, b) => {
                    const order: Record<SolarPotentialGrade, number> = { "A+": 0, A: 1, "B+": 2, B: 3 };
                    const g = order[a.grade] - order[b.grade];
                    return g !== 0 ? g : b.sunHours - a.sunHours;
                  })
                  .map((r) => (
                    <tr key={r.slug} className="border-t">
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          className="font-medium text-solar-700 hover:underline"
                          onClick={() => setActiveSlug(r.slug)}
                        >
                          {r.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={gradeBadgeVariant(r.grade)}> {r.grade} </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{r.sunHours.toFixed(1)} hrs/day</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.bestDistricts.join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}


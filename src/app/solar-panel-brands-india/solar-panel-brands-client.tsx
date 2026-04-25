"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { formatINR } from "@/lib/utils/formatCurrency";
import { solarBrandsIndia2026, type SolarBrand } from "@/lib/data/solarBrands";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";

function stars(ratingOutOf5: number) {
  const full = Math.round(ratingOutOf5);
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-foreground">{ratingOutOf5.toFixed(1)}/5</span>
    </div>
  );
}

function BrandSpecRow(props: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t px-4 py-3 text-sm">
      <div className="text-muted-foreground">{props.label}</div>
      <div className="text-right font-medium text-foreground">{props.value}</div>
    </div>
  );
}

function brandAvgPricePerWatt(brand: SolarBrand) {
  const prices = brand.popularModels.map((m) => m.typicalPricePerWattINR);
  if (!prices.length) return null;
  return Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 10) / 10;
}

export function SolarPanelBrandsIndiaClient() {
  const brands = useMemo(() => [...solarBrandsIndia2026], []);
  const [activeBrandSlug, setActiveBrandSlug] = useState<SolarBrand["slug"]>("tata");

  const activeBrand = brands.find((b) => b.slug === activeBrandSlug) ?? brands[0];

  return (
    <div className="space-y-10 pb-12">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">6 brands compared</Badge>
          <Badge variant="secondary">Backlink-friendly comparison</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Best Solar Panel Brands in India 2026 — Complete Comparison
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Compare Tata Solar, Waaree, Luminous, Loom Solar, Vikram Solar, and Adani Solar by pricing, efficiency,
            warranty terms, and best use cases—then calculate subsidy for your preferred brand system.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
            <Link href="#comparison">Jump to comparison</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#brand-calculator">Calculate subsidy by brand</Link>
          </Button>
        </div>
      </section>

      {/* Comparison table */}
      <section id="comparison" className="scroll-mt-20 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Top comparison (quick view)</h2>
          <p className="text-sm text-muted-foreground">Numbers are typical market ranges and can vary by city and channel.</p>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Brand</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Avg ₹/W (typical)</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Efficiency</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Warranty</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.slug} className="border-t">
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        className="font-medium text-solar-700 hover:underline"
                        onClick={() => setActiveBrandSlug(b.slug)}
                      >
                        {b.name}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {brandAvgPricePerWatt(b) ? `₹${brandAvgPricePerWatt(b)}/W` : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{b.efficiency}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{b.warranty}</td>
                    <td className="whitespace-nowrap px-4 py-3">{stars(b.ratingOutOf5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Brand sections */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Brand-by-brand details</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {brands.map((b) => (
            <Card key={b.slug} className="overflow-hidden">
              <div className="flex items-start justify-between gap-3 px-4 py-4">
                <div>
                  <div className="text-base font-semibold text-foreground">{b.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stars(b.ratingOutOf5)}</div>
                </div>
                <Button
                  variant={activeBrandSlug === b.slug ? "default" : "outline"}
                  className={activeBrandSlug === b.slug ? "bg-solar-600 text-white hover:bg-solar-700" : ""}
                  onClick={() => setActiveBrandSlug(b.slug)}
                >
                  Select
                </Button>
              </div>

              <div className="border-t">
                <BrandSpecRow label="Founded" value={b.founded} />
                <BrandSpecRow label="HQ" value={b.hq} />
                <BrandSpecRow label="Capacity" value={b.capacity} />
                <BrandSpecRow label="Efficiency" value={b.efficiency} />
                <BrandSpecRow label="Warranty" value={b.warranty} />
              </div>

              <div className="space-y-4 px-4 py-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">Popular models (typical pricing)</div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {b.popularModels.map((m) => (
                      <li key={m.name} className="flex items-start justify-between gap-3">
                        <span>{m.name}{m.notes ? ` — ${m.notes}` : ""}</span>
                        <span className="whitespace-nowrap font-medium text-foreground">₹{m.typicalPricePerWattINR}/W</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Quick estimate: 3kW system ≈ {formatINR(Math.round((brandAvgPricePerWatt(b) ?? 24) * 3000))}
                    {" "}for panels (BOS + installation extra).
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Pros</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {b.pros.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Cons</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {b.cons.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground">Where to buy</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.whereToBuy.map((w) => (
                      <Badge key={w} variant="secondary">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Brand calculator */}
      <section id="brand-calculator" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold">Calculate subsidy on a {activeBrand.name} system</h2>
        <p className="text-sm text-muted-foreground">
          Select a brand (for planning) and calculate your subsidy using official PM Surya Ghar slabs. Final pricing and
          warranty depend on the exact module series and the installer channel.
        </p>

        <Card className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
            <div>
              <div className="text-sm font-semibold text-foreground">Brand</div>
              <Select value={activeBrandSlug} onValueChange={(v) => setActiveBrandSlug(v as SolarBrand["slug"])}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.slug} value={b.slug}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/solar-rooftop-price-list">See price list</Link>
              </Button>
              <Button asChild className="w-full bg-solar-600 text-white hover:bg-solar-700">
                <Link href="/calculator">Full calculator</Link>
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <SubsidyCalculator defaultStateSlug="gujarat" />
          </div>
        </Card>
      </section>
    </div>
  );
}


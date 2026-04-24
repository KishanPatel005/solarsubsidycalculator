import Link from "next/link";
import type { Metadata } from "next";

import { statesAndUTs } from "@/lib/data/states";
import { subsidyRates2025 } from "@/lib/data/subsidyRates";
import { formatINR } from "@/lib/utils/formatCurrency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Solar Subsidy by State 2025 | All States & UTs",
  description:
    "Browse solar subsidy guides for all Indian states and union territories. Check eligibility, required documents, and official portal links for PM Surya Ghar 2025.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://solarsubsidycalculator.com"}/solar-subsidy`,
  },
};

function getStateBonusAmount(stateSlug: string): number {
  const entry = subsidyRates2025.stateAdditional.find((s) => s.stateSlug === stateSlug);
  const amt = entry?.additionalSubsidyAmount;
  if (!amt) return 0;
  if (typeof amt.maxCap === "number") return amt.maxCap;
  if (typeof amt.flat === "number") return amt.flat;
  if (typeof amt.perKw === "number") return amt.perKw * 10;
  return 0;
}

function stateGuideHref(slug: string) {
  return `/solar-subsidy-${slug}`;
}

export default function SolarSubsidyIndexPage() {
  const centralMax = subsidyRates2025.central.maxAmount;

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2025</Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Solar Subsidy by State (India 2025)</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Select your state/UT to view eligibility, documents, portal links, and a pre-filled subsidy calculator.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statesAndUTs.map((s) => {
          const bonus = getStateBonusAmount(s.slug);
          const total = centralMax + bonus;
          return (
            <Card key={s.slug} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.type === "State" ? "State" : "Union Territory"} • {s.region}
                  </div>
                </div>
                <Badge variant="secondary">{formatINR(total)}</Badge>
              </div>

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={stateGuideHref(s.slug)}>Open guide</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


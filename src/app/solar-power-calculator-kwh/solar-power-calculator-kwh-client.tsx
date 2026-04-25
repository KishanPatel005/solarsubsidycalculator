"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LeadForm } from "@/components/forms/LeadForm";
import { CalculatorSchema, FAQSchema } from "@/components/seo/schemas";

import { formatINR } from "@/lib/utils/formatCurrency";
import { getSiteUrl } from "@/lib/siteUrl";

const sunHoursByState = {
  gujarat: 5.8,
  rajasthan: 6.0,
  maharashtra: 5.5,
  delhi: 5.2,
  karnataka: 5.4,
  "tamil-nadu": 5.3,
  "uttar-pradesh": 4.9,
  punjab: 4.8,
  default: 5.0,
} as const;

type SunStateSlug = Exclude<keyof typeof sunHoursByState, "default">;

const stateOptions: ReadonlyArray<{ slug: SunStateSlug; label: string }> = [
  { slug: "gujarat", label: "Gujarat" },
  { slug: "rajasthan", label: "Rajasthan" },
  { slug: "maharashtra", label: "Maharashtra" },
  { slug: "delhi", label: "Delhi" },
  { slug: "karnataka", label: "Karnataka" },
  { slug: "tamil-nadu", label: "Tamil Nadu" },
  { slug: "uttar-pradesh", label: "Uttar Pradesh" },
  { slug: "punjab", label: "Punjab" },
] as const;

const topSunTable = [
  { state: "Rajasthan", sun: sunHoursByState.rajasthan },
  { state: "Gujarat", sun: sunHoursByState.gujarat },
  { state: "Maharashtra", sun: sunHoursByState.maharashtra },
  { state: "Karnataka", sun: sunHoursByState.karnataka },
  { state: "Delhi", sun: sunHoursByState.delhi },
  { state: "Tamil Nadu", sun: sunHoursByState["tamil-nadu"] },
  { state: "Uttar Pradesh", sun: sunHoursByState["uttar-pradesh"] },
  { state: "Punjab", sun: sunHoursByState.punjab },
  { state: "Madhya Pradesh", sun: sunHoursByState.default },
  { state: "Haryana", sun: sunHoursByState.default },
] as const;

function gradeForSunHours(sun: number) {
  if (sun >= 5.6) return "A";
  if (sun >= 5.1) return "B";
  return "C";
}

function computeSubsidy(systemSizeKw: number) {
  let subsidy =
    systemSizeKw <= 2
      ? systemSizeKw * 30_000
      : systemSizeKw <= 3
        ? 60_000 + (systemSizeKw - 2) * 18_000
        : 78_000;

  subsidy = Math.min(subsidy, 78_000);
  return Math.max(0, subsidy);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

const faqItems = [
  {
    question: "How many kWh does a 3kW solar system produce per day?",
    answer:
      "It depends on your state’s peak sun hours. As a planning average, 3kW × ~5 hours/day × 0.8 system efficiency ≈ ~12 kWh/day. Actual output varies by season, shading, and tilt.",
  },
  {
    question: "How do I calculate solar panel size from my electricity bill?",
    answer:
      "Use your monthly electricity units (kWh). Divide by (peak sun hours × 30 × 0.8) to estimate the solar system size (kW) required to offset that usage.",
  },
  {
    question: "What is the formula for solar power calculation?",
    answer:
      "Recommended kW = Monthly Units ÷ (Peak Sun Hours × 30 × 0.8). We use 0.8 to account for real-world losses (temperature, wiring, inverter efficiency).",
  },
  {
    question: "How many units does a 5kW solar system produce monthly?",
    answer:
      "A planning estimate is 5kW × ~5 hours/day × 30 × 0.8 ≈ ~600 units/month. In high-sun states it can be higher; in monsoon months it can be lower.",
  },
  {
    question: "What is a good kWh consumption for solar installation?",
    answer:
      "If your home uses ~200–600 units per month, rooftop solar often makes financial sense. The ideal size depends on roof area, sanctioned load, and your goal (partial offset vs near-zero bill).",
  },
] satisfies Parameters<typeof FAQSchema>[0];

export function SolarPowerCalculatorKwhClient() {
  const [monthlyUnitsInput, setMonthlyUnitsInput] = useState<string>("");
  const [stateSlug, setStateSlug] = useState<SunStateSlug>("gujarat");
  const [dailyUsageHours, setDailyUsageHours] = useState<number>(8);
  const [result, setResult] = useState<null | {
    sunHours: number;
    systemSizeKw: number;
    panels: number;
    costBefore: number;
    subsidy: number;
    finalCost: number;
    monthlySavings: number;
  }>(null);

  const base = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();
  const pageUrl = `${base}/solar-power-calculator-kwh`;

  const faqJsonLd = useMemo(() => JSON.stringify(FAQSchema(faqItems)), []);
  const webAppJsonLd = useMemo(
    () =>
      JSON.stringify(
        CalculatorSchema({
          name: "Solar Power Calculator (kWh to kW)",
          url: pageUrl,
          description:
            "Calculator that converts monthly electricity units (kWh) into recommended solar system size (kW) using state sun hours, and estimates panels, cost, subsidy and savings.",
        }),
      ),
    [pageUrl],
  );

  const exampleAhmedabad = useMemo(() => {
    const monthlyUnits = 300;
    const systemSizeKw = monthlyUnits / (sunHoursByState.gujarat * 30 * 0.8);
    return { monthlyUnits, sunHours: sunHoursByState.gujarat, systemSizeKw: round2(systemSizeKw) };
  }, []);

  const onCalculate = () => {
    const monthlyUnits = Number(monthlyUnitsInput);
    if (!Number.isFinite(monthlyUnits) || monthlyUnits <= 0) {
      setResult(null);
      return;
    }

    const sunHours = sunHoursByState[stateSlug] ?? sunHoursByState.default;
    const systemSizeKwRaw = monthlyUnits / (sunHours * 30 * 0.8);
    const systemSizeKw = Math.max(0.1, systemSizeKwRaw);

    const panels = Math.ceil(systemSizeKw / 0.4);
    const costBefore = systemSizeKw * 65_000;
    const subsidy = computeSubsidy(systemSizeKw);
    const finalCost = Math.max(0, costBefore - subsidy);
    const monthlySavings = monthlyUnits * 8;

    setResult({
      sunHours,
      systemSizeKw,
      panels,
      costBefore,
      subsidy,
      finalCost,
      monthlySavings,
    });
  };

  return (
    <div className="space-y-10 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webAppJsonLd }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">Solar Power Calculator kWh</li>
        </ol>
      </nav>

      {/* 1) Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">kWh → kW sizing</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Solar Power Calculator — Monthly kWh to System Size | India 2026
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter your monthly electricity units (kWh) to get a recommended solar system size (kW), estimated panel count (400W), cost,
            subsidy, final price, and monthly savings.
          </p>
        </div>
      </section>

      {/* 2) Standalone calculator */}
      <section className="space-y-4" id="calculator">
        <h2 className="text-xl font-semibold">Solar system size calculator (kWh-based)</h2>

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Monthly electricity units (kWh)</div>
              <Input
                inputMode="numeric"
                placeholder="e.g. 300"
                value={monthlyUnitsInput}
                onChange={(e) => setMonthlyUnitsInput(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Tip: Find “units” on your electricity bill. 1 unit = 1 kWh.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">State (sun hours)</div>
              <Select value={stateSlug} onValueChange={(v) => setStateSlug(v as SunStateSlug)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">We use planning peak sun hours for sizing (state averages).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Daily usage hours</div>
              <Input
                inputMode="numeric"
                placeholder="8"
                value={String(dailyUsageHours)}
                onChange={(e) => setDailyUsageHours(Number(e.target.value || 0))}
              />
              <div className="text-xs text-muted-foreground">
                Not used in sizing formula right now (kept for future refinement). Default 8.
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button className="bg-solar-600 text-white hover:bg-solar-700" onClick={onCalculate}>
              Calculate
            </Button>
            {result ? (
              <span className="text-xs text-muted-foreground">
                Using {result.sunHours} peak sun hours/day and 0.8 performance factor.
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Enter monthly units and click calculate.</span>
            )}
          </div>

          {result ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Recommended system size</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{round2(result.systemSizeKw)} kW</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Panels needed (400W)</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{result.panels} panels</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Estimated cost (before subsidy)</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(result.costBefore))}</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Govt subsidy applicable</div>
                <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(Math.round(result.subsidy))}</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Final cost (after subsidy)</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(result.finalCost))}</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted-foreground">Estimated monthly savings</div>
                <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(result.monthlySavings))}</div>
                <div className="mt-1 text-xs text-muted-foreground">Assuming ₹8 per unit average.</div>
              </Card>
            </div>
          ) : null}
        </Card>
      </section>

      {/* 3) Sun hours info table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Peak sun hours by state (planning averages)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>State</th>
                  <th>Peak sun hours/day</th>
                  <th>Solar grade</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {topSunTable.map((r) => {
                  const grade = gradeForSunHours(r.sun);
                  return (
                    <tr key={r.state} className="[&>td]:px-4 [&>td]:py-3">
                      <td className="font-semibold text-foreground">{r.state}</td>
                      <td className="text-muted-foreground">{r.sun.toFixed(1)}</td>
                      <td>
                        <span
                          className={
                            grade === "A"
                              ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                              : grade === "B"
                                ? "rounded-full bg-solar-50 px-3 py-1 text-xs font-semibold text-solar-800"
                                : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground"
                          }
                        >
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          Grades: A ≥ 5.6, B 5.1–5.5, C ≤ 5.0. Real output varies by season, shading, tilt, and rooftop conditions.
        </p>
      </section>

      <Separator />

      {/* 4) Formula explanation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How we convert monthly kWh to solar kW (simple formula)</h2>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">
            We estimate the required system size using:
            <span className="ml-2 font-semibold text-foreground">
              System size (kW) = Monthly Units ÷ (Peak Sun Hours × 30 × 0.8)
            </span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Example: A family in <span className="font-semibold text-foreground">Ahmedabad</span> uses{" "}
            <span className="font-semibold text-foreground">{exampleAhmedabad.monthlyUnits} units/month</span>. Gujarat peak sun hours is ~{" "}
            <span className="font-semibold text-foreground">{exampleAhmedabad.sunHours.toFixed(1)}</span>. So the recommended size is about{" "}
            <span className="font-semibold text-foreground">{exampleAhmedabad.systemSizeKw} kW</span> (planning estimate).
          </p>
        </Card>
      </section>

      {/* 5) FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((f, idx) => (
            <AccordionItem key={f.question} value={`faq-${idx}`}>
              <AccordionTrigger>{f.question}</AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 6) Lead form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get a quote for your rooftop</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get help with system sizing, subsidy steps, and pricing.
        </p>
        <LeadForm calculatorType="subsidy" state={stateSlug} monthlyBill={3000} />
      </section>
    </div>
  );
}


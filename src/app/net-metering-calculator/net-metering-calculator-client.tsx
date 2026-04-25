"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { LeadForm } from "@/components/forms/LeadForm";

import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { stateData } from "@/lib/data/stateData";
import { formatINR } from "@/lib/utils/formatCurrency";

type Inputs = {
  stateSlug: string;
  monthlyConsumption: number;
  systemSizeKw: number;
  sunHours: number;
  tariffRate: number;
};

function numberFromInput(value: string) {
  const cleaned = value.replace(/[,\s₹]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function parseTariff(text: string): number | null {
  // e.g. "₹5.50/unit"
  const m = text.match(/([\d.]+)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

const policyRows = [
  { state: "Gujarat", limit: "Up to 1 MW (policy-dependent)", exportRate: "Net metering (≈90% credit here)", portal: "suryagujarat.guvnl.in" },
  { state: "Maharashtra", limit: "Varies by DISCOM", exportRate: "Net metering (policy)", portal: "mahaurja.com" },
  { state: "Rajasthan", limit: "Varies by DISCOM", exportRate: "Net metering (policy)", portal: "energy.rajasthan.gov.in" },
  { state: "Delhi", limit: "Policy-dependent", exportRate: "Net metering (policy)", portal: "solardelhi.in" },
  { state: "Karnataka", limit: "Policy-dependent", exportRate: "Net metering (policy)", portal: "bescom.org" },
  { state: "Tamil Nadu", limit: "Policy-dependent", exportRate: "Net metering (policy)", portal: "teda.in" },
  { state: "Uttar Pradesh", limit: "Policy-dependent", exportRate: "Net metering (policy)", portal: "upneda.in" },
] as const;

const faqItems = [
  {
    q: "What is net metering in India?",
    a: "Net metering allows you to export excess solar energy to the grid and receive credits on your electricity bill as per DISCOM rules.",
  },
  {
    q: "How is export credit calculated?",
    a: "It depends on your state/DISCOM policy. In this calculator we use a planning assumption that exported units are credited at 90% of your tariff rate.",
  },
  {
    q: "What is the net metering limit?",
    a: "Limits vary by state policy and DISCOM. Check your state portal and DISCOM net metering regulations for the latest cap and eligibility.",
  },
  {
    q: "What is the difference between net metering and gross metering?",
    a: "Net metering adjusts exports against your consumption. Gross metering typically sells all generation at a notified rate and you buy your consumption separately from the grid.",
  },
  {
    q: "Do I still pay a bill with net metering?",
    a: "Often yes—fixed charges and minimum charges may apply even if energy charges drop. Export credits and settlement rules depend on billing cycle and DISCOM policy.",
  },
] as const;

export function NetMeteringCalculatorClient() {
  const [stateSlug, setStateSlug] = useState<string>("gujarat");
  const [monthlyConsumptionInput, setMonthlyConsumptionInput] = useState<string>("300");
  const [systemSizeInput, setSystemSizeInput] = useState<string>("3");
  const [sunHoursInput, setSunHoursInput] = useState<string>("");
  const [tariffInput, setTariffInput] = useState<string>("");

  const stateOptions = useMemo(() => [...STATES, ...UNION_TERRITORIES].sort((a, b) => a.name.localeCompare(b.name)), []);

  const defaults = useMemo(() => {
    const entry = stateData[stateSlug];
    return {
      sunHours: entry?.sunHours ?? 5.0,
      tariffRate: parseTariff(entry?.avgTariff ?? "") ?? 6.0,
    };
  }, [stateSlug]);

  const inputs: Inputs = useMemo(() => {
    const monthlyConsumption = numberFromInput(monthlyConsumptionInput);
    const systemSizeKw = numberFromInput(systemSizeInput);
    const sunHours = sunHoursInput.trim() ? numberFromInput(sunHoursInput) : defaults.sunHours;
    const tariffRate = tariffInput.trim() ? numberFromInput(tariffInput) : defaults.tariffRate;

    return {
      stateSlug,
      monthlyConsumption: Number.isFinite(monthlyConsumption) ? monthlyConsumption : 0,
      systemSizeKw: Number.isFinite(systemSizeKw) ? systemSizeKw : 0,
      sunHours: Number.isFinite(sunHours) ? sunHours : defaults.sunHours,
      tariffRate: Number.isFinite(tariffRate) ? tariffRate : defaults.tariffRate,
    };
  }, [defaults.sunHours, defaults.tariffRate, monthlyConsumptionInput, stateSlug, sunHoursInput, systemSizeInput, tariffInput]);

  const calc = useMemo(() => {
    const monthlyProduction = inputs.systemSizeKw * inputs.sunHours * 30 * 0.8;
    const consumedFromSolar = Math.min(inputs.monthlyConsumption, monthlyProduction);
    const exported = Math.max(0, monthlyProduction - inputs.monthlyConsumption);
    const exportCredit = exported * inputs.tariffRate * 0.9;
    const netBill = Math.max(0, (inputs.monthlyConsumption - consumedFromSolar) * inputs.tariffRate - exportCredit);

    const beforeBill = inputs.monthlyConsumption * inputs.tariffRate;
    const afterBill = netBill;
    const monthlySavings = Math.max(0, beforeBill - afterBill);
    const annualSavings = monthlySavings * 12;

    return {
      monthlyProduction,
      consumedFromSolar,
      exported,
      exportCredit,
      netBill,
      beforeBill,
      afterBill,
      annualSavings,
    };
  }, [inputs.monthlyConsumption, inputs.sunHours, inputs.systemSizeKw, inputs.tariffRate]);

  const breadcrumbData = {
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://solarsubsidycalculator.com" },
      { "@type": "ListItem", position: 2, name: "Net Metering Calculator", item: "https://solarsubsidycalculator.com/net-metering-calculator" },
    ],
  };

  const faqData = {
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-10 pb-12">
      <SchemaMarkup schemaType="BreadcrumbList" data={breadcrumbData} />
      <SchemaMarkup schemaType="FAQPage" data={faqData} />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">Net Metering Calculator</li>
        </ol>
      </nav>

      {/* 1) Explain net metering */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">India</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Net Metering Calculator India 2026 — Calculate Solar Export Earnings
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Net metering lets your rooftop solar export excess units to the grid. Your bi-directional meter records import and export, and your
            bill is adjusted as per your DISCOM’s net metering policy. Use this calculator to estimate exports, credits, and your net bill.
          </p>
        </div>
      </section>

      {/* 2) Calculator */}
      <section className="space-y-4" id="calculator">
        <h2 className="text-xl font-semibold">Net metering calculator</h2>

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">State (auto-fills tariff + sun hours)</div>
              <Select value={stateSlug} onValueChange={setStateSlug}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state/UT" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {stateOptions.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Monthly units consumed (kWh)</div>
              <Input inputMode="numeric" value={monthlyConsumptionInput} onChange={(e) => setMonthlyConsumptionInput(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Solar system size (kW)</div>
              <Input inputMode="decimal" value={systemSizeInput} onChange={(e) => setSystemSizeInput(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Peak sun hours/day</div>
              <Input
                inputMode="decimal"
                placeholder={String(defaults.sunHours)}
                value={sunHoursInput}
                onChange={(e) => setSunHoursInput(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">Auto-filled from state (editable).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Tariff rate (₹/unit)</div>
              <Input
                inputMode="decimal"
                placeholder={String(defaults.tariffRate)}
                value={tariffInput}
                onChange={(e) => setTariffInput(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">Auto-filled from state (editable).</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Monthly solar production</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{round2(calc.monthlyProduction)} units</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Units consumed from solar</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{round2(calc.consumedFromSolar)} units</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Units exported to grid</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{round2(calc.exported)} units</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Export credit earned</div>
              <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(Math.round(calc.exportCredit))}</div>
              <div className="mt-1 text-xs text-muted-foreground">Assuming 90% of tariff rate.</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Net electricity bill</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(calc.netBill))}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Annual savings</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(calc.annualSavings))}</div>
            </Card>
            <Card className="p-4 sm:col-span-2">
              <div className="text-xs text-muted-foreground">Before vs after (energy charges estimate)</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Before solar</div>
                  <div className="mt-1 text-base font-semibold">{formatINR(Math.round(calc.beforeBill))}/month</div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">After net metering</div>
                  <div className="mt-1 text-base font-semibold">{formatINR(Math.round(calc.afterBill))}/month</div>
                </div>
              </div>
            </Card>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Note: This estimates energy charges only. Fixed charges, minimum charges, and settlement rules vary by DISCOM and billing cycle.
          </p>
        </Card>
      </section>

      {/* 3) Policy table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">State-wise net metering policy (quick reference)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>State</th>
                  <th>Net metering limit</th>
                  <th>Export rate</th>
                  <th>DISCOM portal</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {policyRows.map((r) => (
                  <tr key={r.state} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{r.state}</td>
                    <td className="text-muted-foreground">{r.limit}</td>
                    <td className="text-muted-foreground">{r.exportRate}</td>
                    <td>
                      <Link
                        href={`https://${r.portal}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
                      >
                        {r.portal} <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          This table is a quick reference. For official limits and settlement rules, always check your DISCOM regulations and state portal.
        </p>
      </section>

      <Separator />

      {/* 4) Net vs gross */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Net metering vs gross metering</h2>
        <Card className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>
                <span className="font-semibold text-foreground">Net metering</span>: your exports offset your imports (as per DISCOM billing
                rules).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              <span>
                <span className="font-semibold text-foreground">Gross metering</span>: your generation is sold at a notified rate, and you buy
                your consumption from the grid separately.
              </span>
            </li>
          </ul>
        </Card>
      </section>

      {/* 5) How to apply */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to apply for net metering (4 steps)</h2>
        <div className="grid gap-3">
          {[
            "Select an approved vendor and finalize system size as per sanctioned load and roof feasibility.",
            "Apply for net metering through your DISCOM / state portal and submit required documents.",
            "Install the system and complete DISCOM inspection / meter change (bi-directional meter).",
            "Commissioning approval is recorded; exports and credits start reflecting in billing cycles.",
          ].map((step, idx) => (
            <Card key={step} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solar-100 text-solar-700 font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Step {idx + 1}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{step}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6) FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((f, idx) => (
            <AccordionItem key={f.q} value={`faq-${idx}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 7) Lead form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Need help with net metering?</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get guidance on system sizing, net metering steps, and installation pricing.
        </p>
        <LeadForm calculatorType="subsidy" state={stateSlug} monthlyBill={3000} />
      </section>
    </div>
  );
}


"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { LeadForm } from "@/components/forms/LeadForm";

import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { formatINR } from "@/lib/utils/formatCurrency";

type PumpHp = 2 | 5 | 7.5 | 10;
type WaterSource = "borewell" | "canal" | "pond";

const benchmarkCostByHp: Record<number, number> = {
  2: 130_000,
  3: 172_000,
  5: 272_000,
  7.5: 384_000,
  10: 500_000,
};

function hpToKw(hp: number) {
  return hp * 0.746;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const faqItems = [
  {
    q: "What is PM-KUSUM subsidy structure in 2026?",
    a: "A common benchmark structure is: Central Government subsidy ~60%, State Government subsidy ~30%, and Farmer share ~10% (subject to state implementation and category rules). Always confirm on your state PM-KUSUM portal.",
  },
  {
    q: "Is PM KUSUM different from PM Surya Ghar?",
    a: "Yes. PM-KUSUM targets farmers (solar pumps / feeders / decentralised plants). PM Surya Ghar is for residential rooftop solar subsidy.",
  },
  {
    q: "How do I choose the right solar pump capacity (HP)?",
    a: "Start with your current pump HP and irrigation requirement. Solar pump capacity typically matches your existing pump HP (conversion ~1 HP ≈ 0.746 kW). Final sizing is confirmed by the implementing agency/vendor after site assessment.",
  },
  {
    q: "Can I use PM-KUSUM if I currently use diesel?",
    a: "Yes. Many applicants shift from diesel pumps to solar pumps to reduce recurring fuel cost. Savings depend on your current monthly diesel expense and usage.",
  },
  {
    q: "How long does PM-KUSUM approval take?",
    a: "Timelines vary by state nodal agency, quota availability, and vendor allocation. Track updates on your state PM-KUSUM portal and keep documents ready to avoid delays.",
  },
] as const;

const kusumStatesSample = [
  { state: "Gujarat", agency: "GEDA (Gujarat Energy Development Agency)" },
  { state: "Maharashtra", agency: "MEDA (Maharashtra Energy Development Agency)" },
  { state: "Rajasthan", agency: "RRECL (Rajasthan Renewable Energy Corporation Ltd.)" },
  { state: "Uttar Pradesh", agency: "UPNEDA (Uttar Pradesh New & Renewable Energy Development Agency)" },
  { state: "Punjab", agency: "PEDA (Punjab Energy Development Agency)" },
  { state: "Bihar", agency: "BREDA (Bihar Renewable Energy Development Agency)" },
  { state: "Tamil Nadu", agency: "TEDA (Tamil Nadu Energy Development Agency)" },
  { state: "Karnataka", agency: "KREDL (Karnataka Renewable Energy Development Ltd.)" },
  { state: "Madhya Pradesh", agency: "MP Urja Vikas Nigam Ltd. (MPUVNL)" },
  { state: "Telangana", agency: "TSREDCO (Telangana State Renewable Energy Development Corp.)" },
] as const;

export function PmKusumCalculatorClient() {
  const [stateSlug, setStateSlug] = useState<string>("gujarat");
  const [acresInput, setAcresInput] = useState<string>("2");
  const [pumpHp, setPumpHp] = useState<PumpHp>(5);
  const [monthlyCostInput, setMonthlyCostInput] = useState<string>("5000");
  const [waterSource, setWaterSource] = useState<WaterSource>("borewell");
  const [stateSubsidyPct, setStateSubsidyPct] = useState<number>(30);

  const stateOptions = useMemo(() => {
    return [...STATES, ...UNION_TERRITORIES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const monthlyCost = Number(monthlyCostInput);

  const benchmarkCost = benchmarkCostByHp[pumpHp];
  const centralPct = 60;
  const statePct = clamp(stateSubsidyPct, 0, 90);

  const centralSubsidy = Math.round((benchmarkCost * centralPct) / 100);
  const stateSubsidy = Math.round((benchmarkCost * statePct) / 100);
  const farmerShare = Math.max(0, benchmarkCost - centralSubsidy - stateSubsidy);

  const monthlySavings = Number.isFinite(monthlyCost) && monthlyCost > 0 ? monthlyCost : 0;
  const paybackMonths = monthlySavings > 0 ? farmerShare / monthlySavings : Infinity;
  const paybackYears = Number.isFinite(paybackMonths) ? paybackMonths / 12 : Infinity;
  const tenYearSavings = monthlySavings * 120 - farmerShare;

  const recommendedHp = pumpHp;
  const recommendedKw = hpToKw(recommendedHp);

  const breadcrumbData = {
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://solarsubsidycalculator.com" },
      { "@type": "ListItem", position: 2, name: "PM KUSUM Calculator", item: "https://solarsubsidycalculator.com/pm-kusum-calculator" },
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
          <li className="text-foreground">PM KUSUM Calculator</li>
        </ol>
      </nav>

      {/* 1) Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">For farmers</Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            PM KUSUM Scheme Calculator 2026 — Solar Pump Subsidy for Farmers
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            PM-KUSUM is a farmer-focused solar scheme (solar pumps / feeder solarisation / decentralised plants) and is{" "}
            <span className="font-semibold text-foreground">separate from PM Surya Ghar</span> (which is for residential rooftop solar).
            Use this calculator to estimate pump benchmark cost, subsidy split, farmer share, and savings.
          </p>
        </div>
      </section>

      {/* 2) Calculator */}
      <section className="space-y-4" id="calculator">
        <h2 className="text-xl font-semibold">PM-KUSUM solar pump subsidy calculator</h2>

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">State</div>
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
              <div className="text-xs text-muted-foreground">Used for guidance and lead context.</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Agricultural land (acres)</div>
              <Input inputMode="decimal" value={acresInput} onChange={(e) => setAcresInput(e.target.value)} placeholder="e.g. 2" />
              <div className="text-xs text-muted-foreground">Used for planning context (not in benchmark math).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Current pump HP</div>
              <Select value={String(pumpHp)} onValueChange={(v) => setPumpHp(Number(v) as PumpHp)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select HP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 HP</SelectItem>
                  <SelectItem value="5">5 HP</SelectItem>
                  <SelectItem value="7.5">7.5 HP</SelectItem>
                  <SelectItem value="10">10 HP</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">Benchmark costs are applied by HP category.</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Current monthly diesel/electricity cost (₹)</div>
              <Input
                inputMode="numeric"
                value={monthlyCostInput}
                onChange={(e) => setMonthlyCostInput(e.target.value)}
                placeholder="e.g. 5000"
              />
              <div className="text-xs text-muted-foreground">Used to estimate monthly savings.</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Water source</div>
              <Select value={waterSource} onValueChange={(v) => setWaterSource(v as WaterSource)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select water source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borewell">Borewell</SelectItem>
                  <SelectItem value="canal">Canal</SelectItem>
                  <SelectItem value="pond">Pond</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">May affect site design and approvals.</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">State subsidy % (default 30%)</div>
              <Input
                inputMode="numeric"
                value={String(stateSubsidyPct)}
                onChange={(e) => setStateSubsidyPct(Number(e.target.value || 0))}
                placeholder="30"
              />
              <div className="text-xs text-muted-foreground">Defaults to 30%. Update if your state notifies a different split.</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Recommended pump capacity</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {recommendedHp} HP (~{recommendedKw.toFixed(2)} kW)
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Benchmark system cost</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(benchmarkCost)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Central subsidy (60%)</div>
              <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(centralSubsidy)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">State subsidy ({statePct}%)</div>
              <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(stateSubsidy)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Farmer share (approx)</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(farmerShare)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Monthly savings vs diesel</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(monthlySavings)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Payback period</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {Number.isFinite(paybackYears) ? `${paybackYears.toFixed(1)} years` : "—"}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">10 year savings</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {formatINR(Math.max(0, Math.round(tenYearSavings)))}
              </div>
            </Card>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Notes: This uses benchmark costs + a simple savings model (monthly savings ≈ current monthly cost). Actual eligibility, benchmark
            category, and subsidy split depend on your state implementation and beneficiary category.
          </p>
        </Card>
      </section>

      {/* 3) Active states table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Which states have PM-KUSUM active?</h2>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">
            PM-KUSUM is implemented through State Implementing Agencies (SNAs/SIAs). The official state-wise list can change with quotas and
            portals. For the latest contact details, use the official portal.
          </p>
          <div className="mt-4 rounded-md border bg-muted/30 p-3">
            <p className="text-xs font-semibold text-foreground">Official portal</p>
            <Link
              href="https://pmkusum.mnre.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
            >
              pmkusum.mnre.gov.in <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>State</th>
                  <th>Nodal agency (example)</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {kusumStatesSample.map((r) => (
                  <tr key={r.state} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{r.state}</td>
                    <td className="text-muted-foreground">{r.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          If you want, I can expand this into a full state-by-state list once you confirm the exact source you want to mirror (PM-KUSUM portal
          vs a specific MNRE PDF/circular).
        </p>
      </section>

      {/* 4) How to apply */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to apply for PM-KUSUM (simple steps)</h2>
        <div className="grid gap-3">
          {[
            "Check your state PM-KUSUM portal/agency and confirm that applications are open for your component/category.",
            "Keep your land records and pump details ready (HP, water source, location).",
            "Submit the online application and pay any required registration fee (if applicable).",
            "Wait for verification, site survey, and vendor allocation/selection as per the state process.",
            "Complete installation + inspection. Pay your farmer share and collect commissioning documents.",
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

      {/* 5) Documents required */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Documents required for farmers</h2>
        <Card className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Aadhaar / ID proof",
              "Land ownership / land record documents (as per state)",
              "Khasra / Khatauni / 7/12 extract (state-specific)",
              "Bank account details for beneficiary contribution and any DBT",
              "Pump details (HP, existing connection details if grid-connected)",
              "Passport-size photo and mobile number",
            ].map((d) => (
              <li key={d} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Card>
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
        <h2 className="text-xl font-semibold">Get Help with PM KUSUM Application</h2>
        <p className="text-sm text-muted-foreground">
          Share your details to get guidance for your state, documents, and eligibility checks.
        </p>
        <LeadForm calculatorType="subsidy" state={stateSlug} monthlyBill={3000} />
      </section>
    </div>
  );
}


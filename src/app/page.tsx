import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Calculator, FileText, Leaf, PlugZap, Search, SunMedium } from "lucide-react";

import { subsidyRates2026 } from "@/lib/data/subsidyRates";
import { statesAndUTs } from "@/lib/data/states";
import { stateData } from "@/lib/data/stateData";
import { formatINR } from "@/lib/utils/formatCurrency";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { LeadForm } from "@/components/forms/LeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SmoothScrollButton } from "@/components/home/SmoothScrollButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMICalculator } from "@/components/calculators/EMICalculator";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { SavingsCalculator } from "@/components/calculators/SavingsCalculator";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export const metadata: Metadata = {
  title: "Solar Subsidy Calculator India 2026 | PM Surya Ghar",
  description:
    "Free solar subsidy calculator for India. Calculate PM Surya Ghar subsidy up to ₹78,000. Check eligibility for all 36 states. Instant results.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://solarsubsidycalculator.com",
    languages: {
      "en-IN": "https://solarsubsidycalculator.com/",
      "hi-IN": "https://solarsubsidycalculator.com/hi/",
    },
  },
};

function stateGuideHref(slug: string) {
  // Keep URL shape consistent with the state pages task
  return `/solar-subsidy-${slug}`;
}

export default function Home() {
  const faqItems = [
      {
        q: "What is PM Surya Ghar subsidy in 2026?",
        a: "Under PM Surya Ghar: Muft Bijli Yojana, the central subsidy (CFA) for residential rooftop solar is available up to ₹78,000 (for 3 kW and above).",
      },
      {
        q: "Is this calculator free to use?",
        a: "Yes. This is a free tool for all 36 Indian states and union territories.",
      },
      {
        q: "Which system size is eligible for the subsidy?",
        a: "Residential rooftop solar systems typically qualify when installed through approved vendors and commissioned with DISCOM inspection and net metering. Subsidy amounts are capped per scheme rules.",
      },
      {
        q: "Where do I apply for the subsidy?",
        a: "Apply on the official national portal at pmsuryaghar.gov.in and follow DISCOM feasibility, net metering and commissioning steps.",
      },
      {
        q: "How long does it take to receive the subsidy?",
        a: "Timelines vary by DISCOM. Subsidy is released via DBT after installation, inspection and commissioning are approved on the portal.",
      },
      {
        q: "Can I sell extra power back to the grid?",
        a: "If net metering is approved by your DISCOM, excess generation can be exported to the grid and credited as per your tariff/net metering rules.",
      },
      {
        q: "Does every state provide extra subsidy?",
        a: "Some states/UTs may provide additional benefits beyond the central subsidy, but they can vary by policy and DISCOM. Check your state guide for the latest details.",
      },
      {
        q: "Do I need a rooftop inspection?",
        a: "Yes—DISCOM inspection/commissioning is part of the standard process before subsidy is released via DBT.",
      },
    ] as const;

  const topStateSlugs = [
    "gujarat",
    "haryana",
    "maharashtra",
    "delhi",
    "kerala",
    "punjab",
    "telangana",
    "karnataka",
    "rajasthan",
    "uttar-pradesh",
    "tamil-nadu",
    "bihar",
  ] as const;

  const topStates = topStateSlugs
    .map((slug) => statesAndUTs.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const centralMax = subsidyRates2026.central.maxAmount;

  return (
    <div className="space-y-12 pb-16">
      <SchemaMarkup
        schemaType="WebSite"
        data={{
          name: "Solar Subsidy Calculator India",
          url: "https://solarsubsidycalculator.com",
          description: "Free solar subsidy calculator for all 36 Indian states. Based on PM Surya Ghar official data.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://solarsubsidycalculator.com/solar-subsidy/{search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <SchemaMarkup
        schemaType="FAQPage"
        data={{
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* 1) Calculator (all tabs, highlighted) */}
      <section className="space-y-4 pt-4 sm:pt-6" id="calculator">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Calculate Your Subsidy Now</h2>
          <p className="text-sm text-muted-foreground">
            Use the tabs to estimate subsidy, EMI, loan options, and long-term savings.
          </p>
        </div>

        <Card className="p-3 sm:p-4">
          <Tabs defaultValue="subsidy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="subsidy">Subsidy</TabsTrigger>
              <TabsTrigger value="emi">EMI</TabsTrigger>
              <TabsTrigger value="loan">Loan</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="subsidy">
                <SubsidyCalculator defaultStateSlug="gujarat" />
              </TabsContent>
              <TabsContent value="emi">
                <EMICalculator defaultPrincipal={null} />
              </TabsContent>
              <TabsContent value="loan">
                <LoanCalculator />
              </TabsContent>
              <TabsContent value="savings">
                <SavingsCalculator />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </section>

      <Separator />

      {/* 2) Hero */}
      <section>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              Based on govt data
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Solar Subsidy Calculator India 2026
            </h1>
            <h2 className="text-lg font-semibold text-foreground/90 sm:text-xl">
              Calculate Your PM Surya Ghar Subsidy Instantly
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Free calculator for all 36 states. Based on official government data.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-10 bg-solar-600 text-white hover:bg-solar-700 sm:h-11">
              <Link href="/calculator" className="inline-flex items-center gap-2">
                Calculate My Subsidy <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <SmoothScrollButton targetId="states" variant="outline" className="h-10 sm:h-11">
              Check My State <Search className="h-4 w-4" />
            </SmoothScrollButton>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Govt target</div>
              <div className="mt-1 text-base font-semibold">1 Crore+ Homes Targeted</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Central subsidy</div>
              <div className="mt-1 text-base font-semibold">Up to {formatINR(centralMax)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Coverage</div>
              <div className="mt-1 text-base font-semibold">500+ Districts Covered</div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3) How it works */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">How to Get Solar Subsidy in 3 Steps</h2>
          <p className="text-sm text-muted-foreground">
            A simple process: estimate your subsidy, apply on the official portal, and start saving.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 1: Calculate</div>
                <p className="mt-1 text-sm text-muted-foreground">Use our free calculator.</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 2: Apply</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit on{" "}
                  <Link href="https://pmsuryaghar.gov.in" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                    pmsuryaghar.gov.in
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <SunMedium className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 3: Save</div>
                <p className="mt-1 text-sm text-muted-foreground">Get subsidy + reduce bills.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4) Why solar */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Why Install Solar in 2026?</h2>
          <p className="text-sm text-muted-foreground">A practical upgrade: savings, stability, and cleaner energy.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Save via subsidy</div>
                <p className="mt-1 text-sm text-muted-foreground">Save up to {formatINR(centralMax)} via central subsidy.</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <PlugZap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Lower bills</div>
                <p className="mt-1 text-sm text-muted-foreground">Reduce electricity bill by up to 90% (usage-dependent).</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Long panel life</div>
                <p className="mt-1 text-sm text-muted-foreground">25-year panel life for long-term savings.</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Export extra power</div>
                <p className="mt-1 text-sm text-muted-foreground">Sell excess power back to the grid via net metering (where available).</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5) State guide */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Solar Subsidy by State</h2>
          <p className="text-sm text-muted-foreground">Open your state guide for eligibility, documents, and the official portal link.</p>
        </div>

        <div id="states" className="scroll-mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topStates.map((s) => {
            const bonus = stateData[s.slug]?.stateBonus ?? null;
            return (
              <Card key={s.slug} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Central max {formatINR(centralMax)}</div>
                  </div>
                  {typeof bonus === "number" ? (
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">{formatINR(bonus)} bonus</Badge>
                  ) : (
                    <Badge variant="secondary">Central subsidy only</Badge>
                  )}
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

        <div className="flex justify-center">
          <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
            <Link href="/solar-subsidy">
              View All States <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 6) Trending / urgency */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Solar Subsidy Deadline — Act Now</h2>
        </div>

        <Card className="border-solar-200 bg-solar-50/70 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                PM Surya Ghar scheme deadline approaching. 1 crore home target nearly reached.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Check eligibility, documents and apply through the official portal.</p>
            </div>
            <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
              <Link href="/calculator" className="inline-flex items-center gap-2">
                Check if You&apos;re Eligible <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* 7) FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "How much subsidy will I get for rooftop solar in 2026?",
              a: `Central subsidy is available up to ${formatINR(centralMax)} (cap for 3 kW and above). Some states may have additional benefits depending on policy and DISCOM.`,
            },
            {
              q: "Is the calculator accurate for my state?",
              a: "The calculator uses official central subsidy rates and includes state add-ons when verified/available. Always confirm final eligibility with your DISCOM and the official portal.",
            },
            {
              q: "Where can I apply for PM Surya Ghar subsidy?",
              a: "Apply on the official national portal at pmsuryaghar.gov.in and follow feasibility, installation and commissioning steps.",
            },
            {
              q: "Do I need net metering?",
              a: "Net metering (or an approved alternative) and DISCOM commissioning are typically required before subsidy is released.",
            },
            {
              q: "How long does the process take?",
              a: "Timelines vary by DISCOM and vendor. Subsidy is released after installation, inspection and commissioning approval on the portal.",
            },
            {
              q: "Can I finance solar with a loan?",
              a: "Yes—many banks offer solar loans. Use our EMI and loan calculators to estimate monthly payments.",
            },
            {
              q: "What documents are required?",
              a: "Usually electricity bill/consumer number, ID/address proof, bank details for DBT, and rooftop ownership/authorization as required by your DISCOM.",
            },
            {
              q: "How do I choose the right system size?",
              a: "Use your monthly bill, rooftop area and sanctioned load to estimate the recommended system size with our calculator.",
            },
          ].map((item, idx) => (
            <AccordionItem key={item.q} value={`faq-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 8) Final CTA */}
      <section className="space-y-4">
        <Card className="border-solar-200 bg-gradient-to-br from-solar-50 via-white to-solar-100 p-6 sm:p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Ready to Save on Electricity?</h2>
            <p className="text-sm text-muted-foreground">
              Get a free consultation and step-by-step help for your state&apos;s application process.
            </p>
          </div>
          <LeadForm calculatorType="subsidy" state="gujarat" monthlyBill={3000} />
        </Card>
      </section>
    </div>
  );
}

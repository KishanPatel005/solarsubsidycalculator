import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, Calculator, IndianRupee, Leaf, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { EMICalculator } from "@/components/calculators/EMICalculator";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { SavingsCalculator } from "@/components/calculators/SavingsCalculator";
import { LeadForm } from "@/components/forms/LeadForm";

import { FAQSchema } from "@/components/seo/schemas";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Free Solar Rooftop Calculator App India 2026 — No Download Needed",
  description:
    "Use India's best free solar rooftop calculator app online. No download required. Calculate subsidy, EMI, savings and system size for all 36 states instantly.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-rooftop-calculator-app`,
  },
};

const appBadges = [
  "✅ All 36 States",
  "✅ 4 Calculators in 1",
  "✅ Works on Mobile",
  "✅ Free Forever",
  "✅ Govt Data",
] as const;

const faqItems = [
  {
    question: "Is there a government app for solar rooftop calculation?",
    answer:
      "The official process is handled through the PM Surya Ghar portal and your DISCOM workflow. This online calculator follows the official subsidy slab structure for fast estimation, but final eligibility and approval happen on the official portal.",
  },
  {
    question: "Which is the best solar calculator app in India?",
    answer:
      "The best option is one that uses official subsidy slabs, supports your state, and shows clear outputs (subsidy, final cost, EMI, savings). This tool combines all four calculators in one place for quick decision-making.",
  },
  {
    question: "Can I use this solar calculator on my mobile?",
    answer:
      "Yes. It works in any modern mobile browser—no download needed. Open the page, select your state, and calculate instantly.",
  },
  {
    question: "Is this solar rooftop calculator free to use?",
    answer:
      "Yes. It's a free online calculator with no signup required.",
  },
  {
    question: "How accurate is this solar calculator?",
    answer:
      "Subsidy calculations follow official slab rules, but savings and payback are estimates based on typical assumptions. Your actual results vary by rooftop shading, orientation, tariff slab, net metering rules, and DISCOM verification.",
  },
] satisfies Parameters<typeof FAQSchema>[0];

export default function SolarRooftopCalculatorAppPage() {
  const faqJsonLd = JSON.stringify(FAQSchema(faqItems));

  return (
    <div className="space-y-10 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">Solar Rooftop Calculator App</li>
        </ol>
      </nav>

      {/* 1) Hero (app-store style) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">No download needed</Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Free Solar Rooftop Calculator App — Works on Any Device
          </h1>
          <p className="text-sm font-semibold text-foreground/90 sm:text-base">
            No download. No signup. Calculate in 30 seconds.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {appBadges.map((t) => (
            <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* 2) Feature highlights */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What this solar calculator app can do</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Subsidy Calculator</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Know exact PM Surya Ghar subsidy for your state and system size
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">EMI Calculator</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Plan your solar loan with monthly EMI breakdown
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Savings Calculator</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  See your 25-year savings projection instantly
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Separator />

      {/* 3) Launch calculator */}
      <section className="space-y-4" id="calculator">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Launch Calculator</h2>
          <p className="text-sm text-muted-foreground">
            Works like an app—fast, mobile-friendly, and designed for quick answers.
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

      {/* 4) How to use */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to use</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 1</div>
                <p className="mt-1 text-sm text-muted-foreground">Select your state</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 2</div>
                <p className="mt-1 text-sm text-muted-foreground">Enter monthly bill or system size</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 3</div>
                <p className="mt-1 text-sm text-muted-foreground">Click Calculate</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Step 4</div>
                <p className="mt-1 text-sm text-muted-foreground">Get subsidy, cost and savings instantly</p>
              </div>
            </div>
          </Card>
        </div>
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
        <h2 className="text-xl font-semibold">Get free help for installation</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get guidance for subsidy steps, system sizing, and pricing.
        </p>
        <LeadForm calculatorType="subsidy" state="gujarat" monthlyBill={3000} />
      </section>
    </div>
  );
}


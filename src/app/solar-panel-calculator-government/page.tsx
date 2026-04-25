import Link from "next/link";
import type { Metadata } from "next";

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

import { FAQSchema, CalculatorSchema } from "@/components/seo/schemas";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Government Solar Panel Calculator India 2026 | PM Surya Ghar Official",
  description:
    "Official government solar panel calculator for PM Surya Ghar Yojana 2026. Calculate your exact central government subsidy based on official MNRE slab rates.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-panel-calculator-government`,
  },
};

const slabRows = [
  { size: "Up to 2 kW", ratePerKw: "₹30,000/kW", maxSubsidy: "₹60,000" },
  { size: "2 kW to 3 kW (additional)", ratePerKw: "₹18,000/kW", maxSubsidy: "₹78,000" },
  { size: "Above 3 kW", ratePerKw: "Fixed cap", maxSubsidy: "₹78,000" },
] as const;

const faqItems = [
  {
    question: "What is the government subsidy for solar panels in India 2026?",
    answer:
      "Under PM Surya Ghar (MNRE central subsidy), residential rooftop solar can get up to ₹78,000 subsidy. Exact amount depends on your system size as per slab rates (₹30,000/kW up to 2 kW, then ₹18,000 for the next kW).",
  },
  {
    question: "How does the PM Surya Ghar subsidy calculator work?",
    answer:
      "It applies the official slab formula: 1–2 kW uses ₹30,000 per kW, the 3rd kW adds ₹18,000, and any capacity above 3 kW is capped at ₹78,000 central subsidy.",
  },
  {
    question: "Is there a government app for solar panel calculation?",
    answer:
      "The official route is the PM Surya Ghar portal workflow and DISCOM process. Many calculators (including this one) follow the official MNRE slab rates to estimate subsidy, but final approval is done on the official portal after DISCOM verification.",
  },
  {
    question: "What is the maximum subsidy under PM Surya Ghar?",
    answer:
      "The maximum central subsidy (CFA) is capped at ₹78,000 for 3 kW and above (as per the slab structure).",
  },
  {
    question: "How long does it take to receive the subsidy amount?",
    answer:
      "Timelines vary by DISCOM and inspection/commissioning schedules. Subsidy is typically released via DBT after installation, inspection and commissioning are completed and approved on the portal.",
  },
] satisfies Parameters<typeof FAQSchema>[0];

export default function GovernmentSolarPanelCalculatorPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();
  const pageUrl = `${base}/solar-panel-calculator-government`;

  const faqJsonLd = JSON.stringify(FAQSchema(faqItems));
  const webAppJsonLd = JSON.stringify(
    CalculatorSchema({
      name: "PM Surya Ghar Subsidy Calculator (Government Slabs)",
      url: pageUrl,
      description:
        "Web calculator that estimates PM Surya Ghar (MNRE) central subsidy using the official slab rates and cap.",
    }),
  );

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
          <li className="text-foreground">Government Solar Calculator</li>
        </ol>
      </nav>

      {/* 1) Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">MNRE slab-based</Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Government Solar Panel Calculator India 2026 | PM Surya Ghar Official
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            This subsidy calculator follows the official PM Surya Ghar central subsidy slabs (MNRE) to estimate your subsidy amount based on
            system size, with the scheme cap applied automatically.
          </p>
        </div>
      </section>

      {/* 2) Embed existing calculator component */}
      <section className="space-y-4" id="calculator">
        <h2 className="text-xl font-semibold">Calculate your subsidy instantly</h2>

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

      {/* 3) Official govt slab table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Official PM Surya Ghar Subsidy Slabs (MNRE 2026)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>System size</th>
                  <th>Rate</th>
                  <th>Max subsidy (central)</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {slabRows.map((r) => (
                  <tr key={r.size} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{r.size}</td>
                    <td className="text-muted-foreground">{r.ratePerKw}</td>
                    <td className="font-medium text-foreground">{r.maxSubsidy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 4) Formula explanation */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How the government calculates subsidy (simple examples)</h2>
        <Card className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">1kW</span> = ₹30,000
            </li>
            <li>
              <span className="font-semibold text-foreground">2kW</span> = ₹60,000
            </li>
            <li>
              <span className="font-semibold text-foreground">3kW</span> = ₹60,000 + ₹18,000 = ₹78,000
            </li>
            <li>
              <span className="font-semibold text-foreground">Above 3kW</span> = capped at ₹78,000
            </li>
          </ul>
        </Card>
      </section>

      {/* 5) Official portal link box */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Official portal</h2>
        <Card className="border-solar-200 bg-solar-50/60 p-5">
          <p className="text-sm text-foreground">
            Apply on the official portal:{" "}
            <Link
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-solar-700 hover:underline"
            >
              pmsuryaghar.gov.in
            </Link>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Final eligibility, DISCOM feasibility, inspection and commissioning are verified through the official process.
          </p>
        </Card>
      </section>

      {/* 6) FAQ */}
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

      {/* 7) Lead form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get help with subsidy & installation</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get guidance on system sizing, subsidy steps, and installation pricing.
        </p>
        <LeadForm calculatorType="subsidy" state="gujarat" monthlyBill={3000} />
      </section>
    </div>
  );
}


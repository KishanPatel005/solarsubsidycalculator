"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { EMICalculator } from "@/components/calculators/EMICalculator";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { SavingsCalculator } from "@/components/calculators/SavingsCalculator";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

const faqItems = [
  {
    q: "How is the central solar subsidy calculated in India (PM Surya Ghar)?",
    a: "Central subsidy is based on system size: up to 2 kW uses a per-kW rate, the 3rd kW adds a lower amount, and the total is capped for 3 kW and above as per official scheme guidelines.",
  },
  {
    q: "Does every state provide an additional subsidy on top of central subsidy?",
    a: "Not always. Central subsidy applies through the national portal. Some states may offer extra benefits (capital subsidy/GBI/rebates) depending on local policy and DISCOM rules.",
  },
  {
    q: "What documents are typically required for rooftop solar subsidy?",
    a: "Usually electricity consumer details, ID/address proof, bank details for DBT, and rooftop ownership/authorization (as per your DISCOM).",
  },
  {
    q: "How accurate are the savings and payback estimates?",
    a: "They are estimates based on typical Indian generation averages and a reasonable tariff range. Your actual savings depend on consumption pattern, tariff slab, shading, orientation, and net-metering rules.",
  },
  {
    q: "What is sanctioned load and why does it matter?",
    a: "Sanctioned load is the maximum load approved for your electricity connection. DISCOM feasibility and net metering approvals can depend on sanctioned load and technical limits.",
  },
  {
    q: "How much electricity does 1 kW solar generate per month in India?",
    a: "A common planning average is ~120 units per month per 1 kW, though real output varies by location, season, and rooftop conditions.",
  },
  {
    q: "Can I take a loan for rooftop solar installation?",
    a: "Yes. Several banks offer solar financing. Rates and eligibility vary by borrower profile and bank product, so always verify the latest terms on official bank pages.",
  },
  {
    q: "How do I apply for rooftop solar subsidy in my state?",
    a: "You typically apply through the national portal and your DISCOM for feasibility, net metering, inspection and commissioning. The subsidy is released via DBT after commissioning.",
  },
] as const;

export default function CalculatorPage() {
  const [prefillLoanAmount, setPrefillLoanAmount] = useState<number | null>(null);
  const [tab, setTab] = useState<"subsidy" | "emi" | "loan" | "savings">("subsidy");

  const faqSchema = useMemo(
    () => ({
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [],
  );

  useEffect(() => {
    const allowedTabs = new Set(["subsidy", "emi", "loan", "savings"]);

    const syncFromHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (allowedTabs.has(raw)) setTab(raw as typeof tab);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <div className="space-y-8">
      <SchemaMarkup
        schemaType="WebApplication"
        data={{
          name: "Solar Subsidy Calculator",
          url: "https://solarsubsidycalculator.com/calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          description: "Free calculator for PM Surya Ghar solar subsidy. Covers all 36 Indian states.",
        }}
      />
      <SchemaMarkup schemaType="FAQPage" data={faqSchema} />

      <div id="net-metering" className="scroll-mt-24" />

      {/* Section 1 — Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Solar Subsidy Calculator India 2026
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Calculate your subsidy, EMI, and savings instantly
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">
            Based on Govt Data
          </Badge>
          <Badge variant="secondary">Free Tool</Badge>
          <Badge variant="secondary">Updated 2026</Badge>
        </div>
      </div>

      {/* Section 2 — Tabs */}
      <Card className="p-3 sm:p-4">
        <Tabs
          value={tab}
          onValueChange={(next) => {
            setTab(next as typeof tab);
            window.location.hash = next;
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="subsidy">Subsidy</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="loan">Loan</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="subsidy">
              <SubsidyCalculator onFinalCostComputed={setPrefillLoanAmount} />
            </TabsContent>
            <TabsContent value="emi">
              <EMICalculator defaultPrincipal={prefillLoanAmount} />
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

      {/* Bottom — FAQ */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
        <p className="text-sm text-muted-foreground">
          Common questions about rooftop solar subsidy, savings, and loans in India.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((f, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}


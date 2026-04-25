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

import { formatINR } from "@/lib/utils/formatCurrency";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Solar Rooftop Price List 2026 — All Brands & System Sizes",
  description:
    "Complete solar rooftop price list for India 2026. Compare 1kW to 10kW system prices before and after government subsidy. All major brands included.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-rooftop-price-list`,
  },
};

const systemPriceRows = [
  { kw: 1, before: 75_000, subsidy: 30_000, after: 45_000 },
  { kw: 2, before: 140_000, subsidy: 60_000, after: 80_000 },
  { kw: 3, before: 190_000, subsidy: 78_000, after: 112_000 },
  { kw: 5, before: 290_000, subsidy: 78_000, after: 212_000 },
  { kw: 8, before: 440_000, subsidy: 78_000, after: 362_000 },
  { kw: 10, before: 550_000, subsidy: 78_000, after: 472_000 },
] as const;

const brandRows = [
  { brand: "Tata Solar", price3: 185_000, price5: 280_000, warranty: "25y panel / 5y inverter", rating: "Premium" },
  { brand: "Waaree", price3: 180_000, price5: 270_000, warranty: "25y panel / 5y inverter", rating: "Value+" },
  { brand: "Luminous", price3: 175_000, price5: 265_000, warranty: "25y panel / 5y inverter", rating: "Value" },
  { brand: "Loom Solar", price3: 170_000, price5: 260_000, warranty: "25y panel / 5y inverter", rating: "Value" },
  { brand: "Vikram Solar", price3: 182_000, price5: 275_000, warranty: "25y panel / 5y inverter", rating: "Premium" },
] as const;

const faqItems = [
  {
    q: "What is the price of 1kW solar panel in India 2026?",
    a: "A typical 1kW rooftop solar system can cost around ₹75,000 before subsidy and around ₹45,000 after central subsidy (planning estimate). Actual quotes vary by brand, inverter type, and installation complexity.",
  },
  {
    q: "Which brand is best for rooftop solar in India?",
    a: "There is no single ‘best’ for everyone. Compare module efficiency, warranty terms, service network, inverter brand, and installer quality. Premium brands often offer stronger service and performance consistency, while value brands can be cost-effective.",
  },
  {
    q: "How much does a 3kW solar system cost after subsidy?",
    a: "A common planning price is ~₹1,90,000 before subsidy. After the central subsidy cap (up to ₹78,000), the out-of-pocket cost can be ~₹1,12,000, depending on system design and installation.",
  },
  {
    q: "Does solar panel price include installation?",
    a: "Most quotes for rooftop solar are turnkey (modules + inverter + structure + wiring + installation). Always confirm whether net metering application, meter charges, and civil work are included or billed separately.",
  },
  {
    q: "How to get the lowest price for solar installation?",
    a: "Get 3–5 quotes, compare like-for-like (same inverter type, module wattage, structure grade), verify warranty and service terms, and choose an experienced installer. Avoid very low quotes that cut corners on BOS quality or after-sales support.",
  },
] as const;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function moneyCell(amount: number) {
  return <span className="font-medium text-foreground">{formatINR(amount)}</span>;
}

export default function SolarRooftopPriceListPage() {
  const faqJsonLd = JSON.stringify(buildFaqJsonLd());

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
          <li className="text-foreground">Solar Rooftop Price List</li>
        </ol>
      </nav>

      {/* 1) Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">India price guide</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Solar Rooftop Price List 2026 — All Brands &amp; System Sizes
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Compare typical rooftop solar prices for 1kW to 10kW systems in India, before and after government subsidy.
            Use this as a planning benchmark, then confirm final quotes with an approved vendor and your DISCOM.
          </p>
        </div>
      </section>

      {/* 2) Price table by system size */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Price by system size (before vs after subsidy)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>System Size</th>
                  <th>Price Before Subsidy</th>
                  <th>Govt Subsidy</th>
                  <th>Price After Subsidy</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {systemPriceRows.map((r) => (
                  <tr key={r.kw} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{r.kw} kW</td>
                    <td>{moneyCell(r.before)}</td>
                    <td className="text-emerald-700">{moneyCell(r.subsidy)}</td>
                    <td>{moneyCell(r.after)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          Note: These are typical market ranges for standard residential rooftop systems. Final price depends on roof type, wiring distance,
          inverter choice (string vs micro), and structure quality.
        </p>
      </section>

      {/* 3) Brand wise price comparison */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Brand-wise rooftop solar price comparison (benchmark)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>Brand</th>
                  <th>3kW Price</th>
                  <th>5kW Price</th>
                  <th>Warranty</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {brandRows.map((b) => (
                  <tr key={b.brand} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{b.brand}</td>
                    <td>{moneyCell(b.price3)}</td>
                    <td>{moneyCell(b.price5)}</td>
                    <td className="text-muted-foreground">{b.warranty}</td>
                    <td>
                      <span className="rounded-full bg-solar-50 px-3 py-1 text-xs font-semibold text-solar-800">
                        {b.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          Brand pricing varies heavily by module series, inverter brand, mounting structure, and installer margins. Treat this as a comparison
          baseline—not a final quote.
        </p>
      </section>

      {/* 4) State wise price variation */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">State-wise price variation (why your quote differs)</h2>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">
            Even for the same system size and brand, rooftop solar prices can vary by roughly{" "}
            <span className="font-semibold text-foreground">₹5,000–₹15,000</span> across states and cities due to installation labor costs,
            transport, roof access difficulty, and local installer competition.
          </p>
        </Card>
      </section>

      <Separator />

      {/* 5) Embed existing calculator from /calculator (tabs) */}
      <section className="space-y-4" id="calculator">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Calculate your subsidy, EMI &amp; savings</h2>
          <p className="text-sm text-muted-foreground">
            Use the same calculator as the{" "}
            <Link href="/calculator" className="font-medium text-solar-700 hover:underline">
              main calculator page
            </Link>
            .
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

      {/* 7) Lead capture form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get a quote for your rooftop</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get a price estimate and subsidy guidance from an installer.
        </p>
        <LeadForm calculatorType="subsidy" state="gujarat" monthlyBill={3000} />
      </section>
    </div>
  );
}


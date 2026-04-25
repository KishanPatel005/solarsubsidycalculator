import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, ExternalLink, Info } from "lucide-react";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { LeadForm } from "@/components/forms/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

import { getSiteUrl } from "@/lib/siteUrl";
import { getCityBySlug, getNearbyCities, topCities2026 } from "@/lib/data/cities";

type PageProps = {
  params: { city: string };
};

export function generateStaticParams() {
  return topCities2026.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const city = getCityBySlug(params.city);
  const name = city?.name ?? params.city;
  return {
    title: `Solar Subsidy in ${name} 2026 | PM Surya Ghar Guide`,
    description: `Solar subsidy guide for ${name} (2026). Check DISCOM details, tariff, peak sun hours, and calculate PM Surya Ghar subsidy instantly.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-subsidy-${params.city}`,
    },
  };
}

function faqForCity(cityName: string, stateName: string, discom: string, avgTariff: string, sunHours: number) {
  return [
    {
      q: `How much solar subsidy can I get in ${cityName} in 2026?`,
      a: `Central subsidy under PM Surya Ghar is applicable for residential rooftop solar (up to ₹78,000 cap for 3 kW and above). Final approval depends on DISCOM verification in ${cityName}.`,
    },
    {
      q: `Which DISCOM serves ${cityName} for rooftop solar approvals?`,
      a: `${discom} is commonly associated with ${cityName}. Always confirm the DISCOM and subdivision from your latest electricity bill before applying.`,
    },
    {
      q: `What is the average electricity tariff in ${cityName}?`,
      a: `A planning tariff benchmark for ${cityName} is about ${avgTariff} per unit (varies by category and slab). Use your bill to get the exact slab rate.`,
    },
    {
      q: `How many peak sun hours does ${cityName} get?`,
      a: `A planning average for ${cityName} is ~${sunHours.toFixed(1)} peak sun hours/day. Actual generation varies by season, shading, tilt, and rooftop conditions.`,
    },
    {
      q: `Where do I apply for solar subsidy in ${cityName}?`,
      a: `Apply via the PM Surya Ghar portal and follow the ${stateName} DISCOM process for feasibility, net metering, inspection and commissioning.`,
    },
  ] as const;
}

export default function CitySubsidyPage({ params }: PageProps) {
  const city = getCityBySlug(params.city);
  if (!city) return notFound();

  const nearby = getNearbyCities(city.slug);

  const breadcrumbData = {
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://solarsubsidycalculator.com" },
      { "@type": "ListItem", position: 2, name: "Solar Subsidy", item: "https://solarsubsidycalculator.com/solar-subsidy" },
      { "@type": "ListItem", position: 3, name: city.stateName, item: `https://solarsubsidycalculator.com/solar-subsidy-${city.stateSlug}` },
      { "@type": "ListItem", position: 4, name: city.name, item: `https://solarsubsidycalculator.com/solar-subsidy-${city.slug}` },
    ],
  };

  const faqs = faqForCity(city.name, city.stateName, city.discom, city.avgTariff, city.sunHours);
  const faqData = {
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-10 pb-10">
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
          <li>
            <Link href="/solar-subsidy" className="hover:text-foreground">
              Solar Subsidy
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/solar-subsidy-${city.stateSlug}`} className="hover:text-foreground">
              {city.stateName}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{city.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">{city.stateName}</Badge>
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solar Subsidy in {city.name} — Complete 2026 Guide
        </h1>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">State</div>
            <div className="mt-1 text-lg font-semibold">{city.stateName}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">DISCOM</div>
            <div className="mt-1 text-lg font-semibold">{city.discom}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Avg tariff</div>
            <div className="mt-1 text-lg font-semibold">{city.avgTariff}/unit</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Peak sun hours</div>
            <div className="mt-1 text-lg font-semibold">{city.sunHours.toFixed(1)} hrs/day</div>
          </Card>
        </div>

        <Card className="border-solar-200 bg-solar-50/60 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground">
              For official state-level process details, see the{" "}
              <Link href={`/solar-subsidy-${city.stateSlug}`} className="font-semibold text-solar-700 hover:underline">
                {city.stateName} subsidy guide
              </Link>
              .
            </p>
            <Link
              href={`/solar-subsidy-${city.stateSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
            >
              Open state page <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </section>

      {/* Calculator */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Calculate your subsidy in {city.name}</h2>
        <SubsidyCalculator defaultStateSlug={city.stateSlug} />
      </section>

      <Separator />

      {/* City facts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{city.name} rooftop solar facts</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm font-semibold text-foreground">City snapshot</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>
                  State: <span className="font-medium text-foreground">{city.stateName}</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>
                  DISCOM: <span className="font-medium text-foreground">{city.discom}</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>
                  Tariff benchmark: <span className="font-medium text-foreground">{city.avgTariff}/unit</span>
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-foreground">Solar potential</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>
                  Peak sun hours: <span className="font-medium text-foreground">{city.sunHours.toFixed(1)} hrs/day</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>Actual generation varies by season, shading and rooftop tilt.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-foreground">Next steps</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Apply via PM Surya Ghar portal + DISCOM feasibility.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Complete inspection + commissioning to unlock DBT subsidy.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, idx) => (
            <AccordionItem key={f.q} value={`faq-${idx}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Lead form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get help in {city.name}</h2>
        <LeadForm calculatorType="subsidy" state={city.stateSlug} monthlyBill={3000} />
      </section>

      {/* Nearby cities */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Nearby cities</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nearby.map((c) => (
            <Card key={c.slug} className="p-4">
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.stateName}</div>
              <div className="mt-3">
                <Link className="text-sm font-medium text-solar-700 hover:underline" href={`/solar-subsidy-${c.slug}`}>
                  View guide
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


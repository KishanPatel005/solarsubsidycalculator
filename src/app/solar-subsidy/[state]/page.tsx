import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, FileText, ExternalLink, Info } from "lucide-react";

import { statesSubsidyContent2025 } from "@/lib/data/states-subsidy-content";
import { statesAndUTs } from "@/lib/data/states";
import { subsidyRates2025 } from "@/lib/data/subsidyRates";
import { formatINR } from "@/lib/utils/formatCurrency";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { LeadForm } from "@/components/forms/LeadForm";

type PageProps = {
  params: { state: string };
};

export function generateStaticParams() {
  return statesSubsidyContent2025.map((s) => ({ state: s.stateSlug }));
}

function getStateData(stateSlug: string) {
  const content = statesSubsidyContent2025.find((s) => s.stateSlug === stateSlug);
  const stateMeta = statesAndUTs.find((s) => s.slug === stateSlug);
  return { content, stateMeta };
}

function getStateBonusAmount(stateSlug: string): number | null {
  const entry = subsidyRates2025.stateAdditional.find((s) => s.stateSlug === stateSlug);
  const amt = entry?.additionalSubsidyAmount;
  if (!amt) return null;
  // For display purposes, show max possible within our known structure.
  if (typeof amt.maxCap === "number") return amt.maxCap;
  if (typeof amt.flat === "number") return amt.flat;
  if (typeof amt.perKw === "number") return amt.perKw * 10;
  return null;
}

function buildBreadcrumbJsonLd(stateName: string, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://solarsubsidycalculator.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Solar Subsidy",
        item: "https://solarsubsidycalculator.com/solar-subsidy",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: stateName,
        item: canonical,
      },
    ],
  };
}

function buildFaqJsonLd(stateName: string, canonical: string) {
  const faqs = [
    {
      q: `Who is eligible for rooftop solar subsidy in ${stateName}?`,
      a: `Eligibility depends on being a residential electricity consumer and completing DISCOM feasibility, net metering and commissioning as per PM Surya Ghar process.`,
    },
    {
      q: `How much subsidy can I get in ${stateName} for rooftop solar?`,
      a: `Central subsidy is available up to ₹78,000 (cap at 3 kW and above). State-level additional benefits (if any) depend on state/DISCOM policy and may vary over time.`,
    },
    {
      q: `Where do I apply for rooftop solar subsidy in ${stateName}?`,
      a: `You apply through the national portal and follow DISCOM steps for feasibility, inspection and commissioning.`,
    },
    {
      q: `What documents are required to apply in ${stateName}?`,
      a: `Typically electricity bill/consumer number, ID and address proof, bank details for DBT, and rooftop ownership/authorization as required by the DISCOM.`,
    },
    {
      q: `How long does the subsidy process take in ${stateName}?`,
      a: `Timelines vary by DISCOM. Subsidy is released via DBT after installation, inspection and commissioning are completed and approved on the portal.`,
    },
  ] as const;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    url: canonical,
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { content } = getStateData(params.state);
  const stateName = content?.stateName ?? params.state;

  return {
    title: `Solar Subsidy in ${stateName} 2025 | Calculator & Guide`,
    description: `Get up to ₹78,000 solar subsidy in ${stateName}. Use our free calculator, check eligibility and apply for PM Surya Ghar Yojana 2025.`,
    alternates: {
      canonical: `https://solarsubsidycalculator.com/solar-subsidy-${params.state}`,
    },
  };
}

export default function StateSubsidyPage({ params }: PageProps) {
  const { content, stateMeta } = getStateData(params.state);
  if (!content || !stateMeta) return notFound();

  const stateName = content.stateName;
  const isVerified = content.verificationStatus === "verified";
  const stateBonus = getStateBonusAmount(content.stateSlug);

  const centralMax = subsidyRates2025.central.maxAmount;
  const stateBonusText = stateBonus ? formatINR(stateBonus) : "—";

  // For quick summary, assume max central at 3 kW+ plus state max cap if known
  const totalPotential = centralMax + (stateBonus ?? 0);

  const canonical = `https://solarsubsidycalculator.com/solar-subsidy-${content.stateSlug}`;
  const breadcrumbJsonLd = JSON.stringify(buildBreadcrumbJsonLd(stateName, canonical));
  const faqJsonLd = JSON.stringify(buildFaqJsonLd(stateName, canonical));

  const related = statesAndUTs
    .filter((s) => s.region === stateMeta.region && s.slug !== stateMeta.slug)
    .slice(0, 4);

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      {/* 1) Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-muted-foreground">Solar Subsidy</span>
          </li>
          <li>/</li>
          <li className="text-foreground">{stateName}</li>
        </ol>
      </nav>

      {/* 2) Hero */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2025</Badge>
          {isVerified ? (
            <Badge variant="secondary">Verified</Badge>
          ) : (
            <Badge variant="outline">Some data unverified</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solar Subsidy in {stateName} 2025 — Complete Guide
        </h1>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Central Subsidy</div>
            <div className="mt-1 text-lg font-semibold">Up to {formatINR(centralMax)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">State Bonus</div>
            <div className="mt-1 text-lg font-semibold">{stateBonusText}</div>
            {!isVerified ? (
              <div className="mt-1 text-xs text-muted-foreground">Verify with official portal</div>
            ) : null}
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Max System</div>
            <div className="mt-1 text-lg font-semibold">10 kW</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Scheme</div>
            <div className="mt-1 text-lg font-semibold">PM Surya Ghar</div>
          </Card>
        </div>
      </div>

      {/* 3) Quick summary */}
      <Card className="border-solar-200 bg-solar-50/60 p-5">
        <p className="text-sm text-foreground">
          In <span className="font-semibold">{stateName}</span>, homeowners can get up to{" "}
          <span className="font-semibold">{formatINR(totalPotential)}</span> subsidy on rooftop
          solar installation under PM Surya Ghar Yojana 2025.
        </p>
        {!isVerified ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Note: State-level “bonus” amounts may vary by DISCOM and policy. Please verify using the official portal.
          </p>
        ) : null}
      </Card>

      {/* 4) Embedded calculator */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Calculate your subsidy in {stateName}</h2>
        <SubsidyCalculator defaultStateSlug={content.stateSlug} />
      </div>

      <Separator />

      {/* 5) Eligibility */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Eligibility</h2>
        <div className="grid gap-2">
          {content.eligibilityRules.map((rule) => (
            <div key={rule} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <p className="text-sm text-foreground">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6) How to apply */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">How to apply</h2>
        <div className="grid gap-3">
          {content.howToApplySteps.map((step, idx) => (
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
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Official portal</p>
              </div>
              <Link
                href={content.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-solar-700 hover:underline"
              >
                Open portal
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 7) Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Documents required</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Primary documents</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {content.documentsRequired.slice(0, Math.ceil(content.documentsRequired.length / 2)).map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Supporting documents</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {content.documentsRequired.slice(Math.ceil(content.documentsRequired.length / 2)).map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* 8) State scheme details */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">State scheme details</h2>
          {!isVerified ? <Badge variant="outline">Unverified data</Badge> : null}
        </div>

        {content.extraStateBenefits.length ? (
          <Card className="p-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.extraStateBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              State-specific additional benefits are not confirmed in our dataset yet. Central subsidy still applies.
            </p>
          </Card>
        )}
      </div>

      {/* 9) Lead form */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Need Help Applying in {stateName}?</h2>
        <LeadForm calculatorType="subsidy" state={content.stateSlug} />
      </div>

      {/* 10) FAQ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            `How to apply for rooftop solar subsidy in ${stateName}?`,
            `What is the maximum subsidy in ${stateName} in 2025?`,
            `How long does DISCOM approval take in ${stateName}?`,
            `What system size is best for my home in ${stateName}?`,
            `Do I need net metering for subsidy in ${stateName}?`,
          ].map((q, idx) => (
            <AccordionItem key={q} value={`faq-${idx}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>
                Refer to the steps above and the official portal for the latest DISCOM requirements. Central subsidy is capped at {formatINR(subsidyRates2025.central.maxAmount)} for 3 kW and above.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 11) Related states */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Also check subsidy in nearby states</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((s) => (
            <Card key={s.slug} className="p-4">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.region} • Capital: {s.capital}</div>
              <div className="mt-3">
                <Link className="text-sm font-medium text-solar-700 hover:underline" href={`/solar-subsidy-${s.slug}`}>
                  View guide
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


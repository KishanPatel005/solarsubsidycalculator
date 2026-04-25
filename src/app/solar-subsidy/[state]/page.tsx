import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, FileText, ExternalLink, Info } from "lucide-react";

import { statesSubsidyContent2026 } from "@/lib/data/states-subsidy-content";
import { statesAndUTs } from "@/lib/data/states";
import { subsidyRates2026 } from "@/lib/data/subsidyRates";
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

type StateSolarFacts = {
  heading: string;
  discoms: ReadonlyArray<string>;
  policyAndProcess: ReadonlyArray<string>;
  solarPotential: ReadonlyArray<string>;
  statePortal?: { label: string; href: string };
};

export function generateStaticParams() {
  return statesSubsidyContent2026.map((s) => ({ state: s.stateSlug }));
}

function getStateData(stateSlug: string) {
  const content = statesSubsidyContent2026.find((s) => s.stateSlug === stateSlug);
  const stateMeta = statesAndUTs.find((s) => s.slug === stateSlug);
  return { content, stateMeta };
}

function getStateBonusAmount(stateSlug: string): number | null {
  const entry = subsidyRates2026.stateAdditional.find((s) => s.stateSlug === stateSlug);
  const amt = entry?.additionalSubsidyAmount;
  if (!amt) return null;
  // For display purposes, show max possible within our known structure.
  if (typeof amt.maxCap === "number") return amt.maxCap;
  if (typeof amt.flat === "number") return amt.flat;
  if (typeof amt.perKw === "number") return amt.perKw * 10;
  return null;
}

function getStateSolarFacts(stateSlug: string, stateName: string): StateSolarFacts | null {
  switch (stateSlug) {
    case "gujarat":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "UGVCL — Uttar Gujarat Vij Company (North Gujarat)",
          "MGVCL — Madhya Gujarat Vij Company (Central Gujarat)",
          "PGVCL — Paschim Gujarat Vij Company (Saurashtra / Kutch / West Gujarat)",
          "DGVCL — Dakshin Gujarat Vij Company (South Gujarat)",
        ],
        policyAndProcess: [
          "Gujarat Solar Power Policy 2021 (check latest amendments on official portal)",
          "Net metering is commonly available for residential rooftop consumers (capacity limits vary by DISCOM rules)",
          "Typical application-to-commissioning timelines can vary; many applicants see ~30–45 days depending on DISCOM workload",
          "Empanelled vendor lists are often published on the DISCOM/portal",
        ],
        solarPotential: [
          "Peak sun hours: ~5.6–6.2 hours/day (district and season dependent)",
          "Among India’s top regions for solar irradiance",
          "High solar potential districts: Kutch, Banaskantha, Patan, Mehsana",
          "Ahmedabad planning average: ~5.8 peak sun hours/day",
        ],
        statePortal: { label: "GUVNL / Surya Gujarat portal", href: "https://suryagujarat.guvnl.in" },
      };
    case "maharashtra":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "MSEDCL / Mahadiscom — Maharashtra State Electricity Distribution Co. Ltd.",
          "Best to confirm your sub-division (Circle/Division) on your electricity bill before applying",
        ],
        policyAndProcess: [
          "Net metering / rooftop solar approvals are processed via DISCOM feasibility + inspection flow",
          "In metro areas, timelines can be influenced by load, transformer capacity, and local inspection scheduling",
          "Keep consumer number, sanctioned load, and meter type handy to reduce back-and-forth",
        ],
        solarPotential: [
          "Pune planning average: ~5.2–5.6 peak sun hours/day (season dependent)",
          "Mumbai planning average: ~4.8–5.2 peak sun hours/day (higher monsoon/cloud impact)",
          "Best results come from unshaded south-facing roofs with adequate structural clearance",
        ],
      };
    case "rajasthan":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "JVVNL — Jaipur Vidyut Vitran Nigam (North/East Rajasthan)",
          "AVVNL — Ajmer Vidyut Vitran Nigam (Central/South Rajasthan)",
          "JDVVNL — Jodhpur Vidyut Vitran Nigam (West Rajasthan)",
        ],
        policyAndProcess: [
          "Rajasthan is one of India’s strongest solar states; rooftop adoption is supported by net metering frameworks",
          "DISCOM feasibility and meter availability are common approval checkpoints",
          "Keep rooftop ownership proof and recent bill copy ready for faster processing",
        ],
        solarPotential: [
          "Jodhpur region is among India’s highest solar potential zones (very high irradiance)",
          "Peak sun hours commonly plan around ~6.0+ hours/day in many districts (season dependent)",
          "Low shading and dry climate typically improve annual generation consistency",
        ],
      };
    case "delhi":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "BSES Rajdhani Power Ltd (BRPL) — South/West Delhi areas",
          "BSES Yamuna Power Ltd (BYPL) — Central/East Delhi areas",
          "TPDDL — Tata Power Delhi Distribution Ltd (North/North-West Delhi areas)",
        ],
        policyAndProcess: [
          "Delhi often provides state-level incentives in addition to central subsidy (verify current eligibility and caps)",
          "Some applicants may see an additional state bonus around ₹10,000 (subject to policy and DISCOM verification)",
          "Net metering and inspection scheduling are key steps; ensure sanctioned load and roof ownership documents are consistent",
        ],
        solarPotential: [
          "Delhi/NCR planning average: ~5.0–5.5 peak sun hours/day (season dependent)",
          "Dust/pollution can reduce output; regular module cleaning improves generation",
          "Flat roofs make it easier to optimize tilt and avoid shading from parapets/water tanks",
        ],
      };
    case "karnataka":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "BESCOM — Bengaluru Electricity Supply Company (Bengaluru region)",
          "HESCOM — Hubli Electricity Supply Company (North/West Karnataka)",
          "MESCOM / CESC / GESCOM also serve other zones (confirm on bill)",
        ],
        policyAndProcess: [
          "Karnataka rooftop approvals typically follow feasibility + installation + inspection + commissioning flow",
          "Net metering rules and meter availability can vary by service area and sanctioned load",
          "Bengaluru applicants should account for monsoon season when planning timelines",
        ],
        solarPotential: [
          "Bengaluru planning average: ~5.0–5.4 peak sun hours/day (season dependent)",
          "Coastal humidity and frequent clouds can reduce generation vs. north interior districts",
          "Proper tilt + minimal shading is especially important for consistent annual savings",
        ],
      };
    case "uttar-pradesh":
      return {
        heading: `${stateName} Solar Facts`,
        discoms: [
          "UPPCL umbrella + zone DISCOMs (e.g., PVVNL, MVVNL, DVVNL, PuVVNL) depending on your district",
          "Coverage spans ~75 districts; always confirm your DISCOM name on the bill/portal",
        ],
        policyAndProcess: [
          "DISCOM feasibility and net metering approvals are common checkpoints before commissioning",
          "Rooftop structural suitability and sanctioned load can affect the approved system size",
          "Keep KYC + bank details ready to avoid DBT delays after commissioning",
        ],
        solarPotential: [
          "UP planning average: ~4.8–5.4 peak sun hours/day (east vs west and season dependent)",
          "West UP often sees slightly higher irradiance than eastern districts",
          "Best results come from low-shade roofs and correct tilt for latitude",
        ],
      };
    default:
      return null;
  }
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
    title: `Solar Subsidy in ${stateName} 2026 | Calculator & Guide`,
    description: `Get up to ₹78,000 solar subsidy in ${stateName}. Use our free calculator, check eligibility and apply for PM Surya Ghar Yojana 2026.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://solarsubsidycalculator.com"}/solar-subsidy-${params.state}`,
    },
  };
}

export default function StateSubsidyPage({ params }: PageProps) {
  const { content, stateMeta } = getStateData(params.state);
  if (!content || !stateMeta) return notFound();

  const stateName = content.stateName;
  const isVerified = content.verificationStatus === "verified";
  const stateBonus = getStateBonusAmount(content.stateSlug);

  const centralMax = subsidyRates2026.central.maxAmount;
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
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          {isVerified ? (
            <Badge variant="secondary">Verified</Badge>
          ) : (
            <Badge variant="outline">Some data unverified</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solar Subsidy in {stateName} 2026 — Complete Guide
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
          solar installation under PM Surya Ghar Yojana 2026.
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

      {(() => {
        const facts = getStateSolarFacts(content.stateSlug, stateName);
        if (!facts) return null;
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">{facts.heading}</h2>
              <Badge variant="secondary">Local DISCOMs & solar potential</Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="p-4">
                <p className="text-sm font-semibold text-foreground">DISCOMs in {stateName}</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {facts.discoms.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <p className="text-sm font-semibold text-foreground">State policy & process notes</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {facts.policyAndProcess.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <p className="text-sm font-semibold text-foreground">Solar potential in {stateName}</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {facts.solarPotential.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                {facts.statePortal ? (
                  <div className="mt-4 rounded-md border bg-muted/30 p-3">
                    <p className="text-xs font-semibold text-foreground">State portal</p>
                    <Link
                      href={facts.statePortal.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
                    >
                      {facts.statePortal.label}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}
              </Card>
            </div>

            <p className="text-xs text-muted-foreground">
              Note: Solar generation figures are planning averages. For the latest net metering and incentives, rely on your DISCOM and the
              official portal links above.
            </p>
          </div>
        );
      })()}

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
            `What is the maximum subsidy in ${stateName} in 2026?`,
            `How long does DISCOM approval take in ${stateName}?`,
            `What system size is best for my home in ${stateName}?`,
            `Do I need net metering for subsidy in ${stateName}?`,
          ].map((q, idx) => (
            <AccordionItem key={q} value={`faq-${idx}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>
                Refer to the steps above and the official portal for the latest DISCOM requirements. Central subsidy is capped at {formatINR(subsidyRates2026.central.maxAmount)} for 3 kW and above.
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


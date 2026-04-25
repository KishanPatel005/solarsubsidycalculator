import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Calculator, FileText, Leaf, PlugZap, Search, SunMedium } from "lucide-react";

import { subsidyRates2026 } from "@/lib/data/subsidyRates";
import { formatINR } from "@/lib/utils/formatCurrency";
import { getSiteUrl } from "@/lib/siteUrl";

import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { LeadForm } from "@/components/forms/LeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export const metadata: Metadata = {
  title: "सोलर सब्सिडी कैलकुलेटर 2026 | PM सूर्य घर योजना",
  description:
    "मुफ्त सोलर सब्सिडी कैलकुलेटर - सभी 36 राज्यों के लिए। PM सूर्य घर योजना के तहत अपनी सब्सिडी की गणना करें।",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/hi`,
  },
};

const topStatesHi = [
  { slug: "gujarat", name: "गुजरात" },
  { slug: "maharashtra", name: "महाराष्ट्र" },
  { slug: "delhi", name: "दिल्ली" },
  { slug: "karnataka", name: "कर्नाटक" },
  { slug: "rajasthan", name: "राजस्थान" },
  { slug: "uttar-pradesh", name: "उत्तर प्रदेश" },
  { slug: "tamil-nadu", name: "तमिलनाडु" },
  { slug: "madhya-pradesh", name: "मध्य प्रदेश" },
] as const;

const faqItems = [
  {
    q: "2026 में PM सूर्य घर योजना के तहत अधिकतम सब्सिडी कितनी है?",
    a: "केंद्रीय सब्सिडी (CFA) आम तौर पर 3 kW और उससे अधिक के लिए अधिकतम ₹78,000 तक (कैप) उपलब्ध होती है। अंतिम राशि DISCOM सत्यापन और योजना नियमों पर निर्भर करती है।",
  },
  {
    q: "क्या यह कैलकुलेटर सभी 36 राज्यों/केंद्र शासित प्रदेशों के लिए काम करता है?",
    a: "हाँ, यह टूल भारत के सभी राज्यों/केंद्र शासित प्रदेशों के लिए केंद्रीय सब्सिडी नियमों के आधार पर अनुमान देता है।",
  },
  {
    q: "सब्सिडी के लिए कहाँ आवेदन करें?",
    a: "आवेदन आधिकारिक पोर्टल pmsuryaghar.gov.in पर करें और अपने DISCOM की feasibility, net metering, inspection और commissioning प्रक्रिया पूरी करें।",
  },
  {
    q: "क्या नेट मीटरिंग जरूरी है?",
    a: "अधिकांश मामलों में net metering/approved metering और DISCOM commissioning सब्सिडी जारी होने से पहले आवश्यक चरण होते हैं।",
  },
  {
    q: "सब्सिडी मिलने में कितना समय लगता है?",
    a: "समय DISCOM और निरीक्षण/commissioning शेड्यूल पर निर्भर करता है। इंस्टॉलेशन और अनुमोदन के बाद DBT के जरिए सब्सिडी जारी होती है।",
  },
] as const;

export default function HindiHomePage() {
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

      {/* Hero */}
      <section>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              सरकारी डेटा पर आधारित
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">सोलर सब्सिडी कैलकुलेटर 2026</h1>
            <h2 className="text-lg font-semibold text-foreground/90 sm:text-xl">
              PM सूर्य घर योजना की सब्सिडी तुरंत कैलकुलेट करें
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              सभी 36 राज्यों के लिए मुफ्त टूल। 2026 के केंद्रीय सब्सिडी नियमों के अनुसार।
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-10 bg-solar-600 text-white hover:bg-solar-700 sm:h-11">
              <Link href="/calculator" className="inline-flex items-center gap-2">
                सब्सिडी कैलकुलेट करें <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 sm:h-11">
              <Link href="#states" className="inline-flex items-center gap-2">
                राज्य चुनें <Search className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">केंद्रीय सब्सिडी</div>
              <div className="mt-1 text-base font-semibold">अधिकतम {formatINR(centralMax)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">टूल</div>
              <div className="mt-1 text-base font-semibold">मुफ्त • बिना लॉगिन</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">कवरेज</div>
              <div className="mt-1 text-base font-semibold">सभी राज्य/UT</div>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* 3 Steps */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">3 आसान स्टेप्स में सब्सिडी कैसे पाएं</h2>
          <p className="text-sm text-muted-foreground">
            पहले अनुमान लगाएं, फिर आधिकारिक पोर्टल पर आवेदन करें, और इंस्टॉलेशन के बाद बचत शुरू करें।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">स्टेप 1: कैलकुलेट</div>
                <p className="mt-1 text-sm text-muted-foreground">कैलकुलेटर से सब्सिडी/लागत का अनुमान लगाएं।</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">स्टेप 2: आवेदन</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  pmsuryaghar.gov.in पर आवेदन करें और DISCOM प्रक्रिया फॉलो करें।
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
                <div className="text-sm font-semibold">स्टेप 3: बचत</div>
                <p className="mt-1 text-sm text-muted-foreground">इंस्टॉलेशन + commissioning के बाद DBT से सब्सिडी।</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why solar */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">2026 में सोलर क्यों लगाएं?</h2>
          <p className="text-sm text-muted-foreground">सब्सिडी, कम बिल और लंबी अवधि की बचत।</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">सब्सिडी से बचत</div>
                <p className="mt-1 text-sm text-muted-foreground">केंद्रीय सब्सिडी से लागत कम होती है।</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <PlugZap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">बिजली बिल कम</div>
                <p className="mt-1 text-sm text-muted-foreground">उपयोग के अनुसार बिल में बड़ा फर्क।</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">25 साल तक लाभ</div>
                <p className="mt-1 text-sm text-muted-foreground">पैनल की लंबी लाइफ से दीर्घकालीन बचत।</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-solar-100 p-2 text-solar-700">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">नेट मीटरिंग</div>
                <p className="mt-1 text-sm text-muted-foreground">अतिरिक्त बिजली ग्रिड में एक्सपोर्ट (जहाँ उपलब्ध)।</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* State grid */}
      <section className="space-y-6" id="states">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">राज्य के अनुसार सोलर सब्सिडी गाइड</h2>
          <p className="text-sm text-muted-foreground">अपने राज्य का गाइड खोलें और कैलकुलेटर में प्री-फिल्ड डेटा देखें।</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topStatesHi.map((s) => (
            <Card key={s.slug} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">केंद्रीय अधिकतम {formatINR(centralMax)}</div>
                </div>
                <Badge variant="secondary">गाइड</Badge>
              </div>

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/hi/solar-subsidy-${s.slug}`}>खोलें</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Embedded calculator */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">अभी सब्सिडी कैलकुलेट करें</h2>
        <p className="text-sm text-muted-foreground">यह कैलकुलेटर अंग्रेज़ी संस्करण जैसा ही है (डेटा/लॉजिक वही)।</p>
        <SubsidyCalculator defaultStateSlug="gujarat" />
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">अक्सर पूछे जाने वाले प्रश्न</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, idx) => (
            <AccordionItem key={item.q} value={`faq-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="space-y-4">
        <Card className="border-solar-200 bg-gradient-to-br from-solar-50 via-white to-solar-100 p-6 sm:p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">अपनी सही राशि जानना चाहते हैं?</h2>
            <p className="text-sm text-muted-foreground">
              मुफ्त परामर्श और आवेदन प्रक्रिया में सहायता के लिए अपना विवरण साझा करें।
            </p>
          </div>
          <LeadForm calculatorType="subsidy" state="gujarat" monthlyBill={3000} />
        </Card>
      </section>
    </div>
  );
}


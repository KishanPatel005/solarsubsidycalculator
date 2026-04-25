import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { LeadForm } from "@/components/forms/LeadForm";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "सोलर सब्सिडी मध्य प्रदेश 2026 | PM सूर्य घर योजना",
  description: "मध्य प्रदेश में PM सूर्य घर योजना के तहत सोलर सब्सिडी गाइड और कैलकुलेटर (2026)।",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/hi/solar-subsidy-madhya-pradesh` },
};

export default function HiMadhyaPradeshPage() {
  const breadcrumbData = {
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://solarsubsidycalculator.com/hi/" },
      { "@type": "ListItem", position: 2, name: "Solar Subsidy", item: "https://solarsubsidycalculator.com/solar-subsidy" },
      { "@type": "ListItem", position: 3, name: "Madhya Pradesh", item: "https://solarsubsidycalculator.com/solar-subsidy-madhya-pradesh" },
    ],
  };

  return (
    <div className="space-y-8 pb-10">
      <SchemaMarkup schemaType="BreadcrumbList" data={breadcrumbData} />

      <div className="space-y-2">
        <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
        <h1 className="text-2xl font-bold tracking-tight">सोलर सब्सिडी मध्य प्रदेश — 2026 गाइड</h1>
        <p className="text-sm text-muted-foreground">
          यह हिंदी पेज मध्य प्रदेश के लिए त्वरित गाइड है। पूरी जानकारी के लिए राज्य पेज देखें।
        </p>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            State page (English):{" "}
            <Link href="/solar-subsidy-madhya-pradesh" className="font-semibold text-solar-700 hover:underline">
              /solar-subsidy-madhya-pradesh
            </Link>
          </div>
          <Link
            href="/solar-subsidy-madhya-pradesh"
            className="inline-flex items-center gap-2 text-sm font-medium text-solar-700 hover:underline"
          >
            Open <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">कैलकुलेटर</h2>
        <SubsidyCalculator defaultStateSlug="madhya-pradesh" />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">मुफ्त सहायता</h2>
        <LeadForm calculatorType="subsidy" state="madhya-pradesh" monthlyBill={3000} />
      </div>
    </div>
  );
}


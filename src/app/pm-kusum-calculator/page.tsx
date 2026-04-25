import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { PmKusumCalculatorClient } from "./pm-kusum-calculator-client";

export const metadata: Metadata = {
  title: "PM KUSUM Scheme Calculator 2026 — Solar Pump Subsidy for Farmers",
  description:
    "Free PM KUSUM calculator for farmers. Calculate solar pump subsidy, cost and savings under PM KUSUM scheme 2026. All states covered.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/pm-kusum-calculator`,
  },
};

export default function PmKusumCalculatorPage() {
  return <PmKusumCalculatorClient />;
}


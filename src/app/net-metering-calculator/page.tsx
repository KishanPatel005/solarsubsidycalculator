import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { NetMeteringCalculatorClient } from "./net-metering-calculator-client";

export const metadata: Metadata = {
  title: "Net Metering Calculator India 2026 — Calculate Solar Export Earnings",
  description:
    "Calculate how much you earn from net metering in India. Enter your solar production, consumption and tariff rate to get your exact net metering bill.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/net-metering-calculator`,
  },
};

export default function NetMeteringCalculatorPage() {
  return <NetMeteringCalculatorClient />;
}


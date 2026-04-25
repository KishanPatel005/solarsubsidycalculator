import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { SolarLoanCalculatorClient } from "./solar-loan-calculator-client";

export const metadata: Metadata = {
  title: "Solar Loan Calculator India 2026 — EMI & Interest Calculator",
  description:
    "Calculate your solar loan EMI, total interest and compare bank rates. SBI, PNB, Bank of Baroda solar loan calculator with PM Surya Ghar subsidy.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-loan-calculator`,
  },
};

export default function SolarLoanCalculatorPage() {
  return <SolarLoanCalculatorClient />;
}


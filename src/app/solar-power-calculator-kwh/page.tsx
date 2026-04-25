import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { SolarPowerCalculatorKwhClient } from "./solar-power-calculator-kwh-client";

export const metadata: Metadata = {
  title: "Solar Power Calculator — Monthly kWh to System Size | India 2026",
  description:
    "Free solar power calculator India. Enter your monthly electricity units (kWh) and get recommended solar system size, panel count, cost and subsidy instantly.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-power-calculator-kwh`,
  },
};

export default function SolarPowerCalculatorKwhPage() {
  return <SolarPowerCalculatorKwhClient />;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Subsidy Calculator India 2025 — Free Tool",
  description:
    "Calculate solar panel subsidy, EMI and savings instantly. Based on official PM Surya Ghar 2025 rates. Free calculator for all Indian states.",
  alternates: {
    canonical: "https://solarsubsidycalculator.com/calculator",
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


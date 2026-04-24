import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Subsidy Calculator India 2026 — Free Tool",
  description:
    "Calculate solar panel subsidy, EMI and savings instantly. Based on official PM Surya Ghar 2026 rates. Free calculator for all Indian states.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://solarsubsidycalculator.com"}/calculator`,
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


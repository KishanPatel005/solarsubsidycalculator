import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { SolarPanelBrandsIndiaClient } from "./solar-panel-brands-client";

export const metadata: Metadata = {
  title: "Best Solar Panel Brands in India 2026 — Complete Comparison",
  description:
    "Compare top solar panel brands in India—Tata, Waaree, Luminous, Loom Solar, Vikram Solar, and Adani—with models, pricing, efficiency, warranty, pros/cons, and where to buy.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-panel-brands-india`,
  },
};

export default function SolarPanelBrandsIndiaPage() {
  return <SolarPanelBrandsIndiaClient />;
}


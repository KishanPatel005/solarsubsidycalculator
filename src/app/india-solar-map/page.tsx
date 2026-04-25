import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { IndiaSolarMapClient } from "./solar-map-client";

export const metadata: Metadata = {
  title: "India Solar Potential Map 2026 — State Wise Solar Irradiance",
  description:
    "Interactive India solar potential map with state-wise solar irradiance grades, peak sun hours, best districts, and subsidy estimate.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/india-solar-map`,
  },
};

export default function IndiaSolarMapPage() {
  return <IndiaSolarMapClient />;
}


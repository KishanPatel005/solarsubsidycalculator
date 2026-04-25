import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { SolarSubsidyNewsClient } from "./solar-subsidy-news-client";

export const metadata: Metadata = {
  title: "Solar Subsidy News India 2026 — Latest Updates",
  description:
    "Latest updates on PM Surya Ghar, state subsidy scheme changes, budget announcements, and DISCOM tie-ups for rooftop solar in India.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/solar-subsidy-news`,
  },
};

export default function SolarSubsidyNewsPage() {
  return <SolarSubsidyNewsClient />;
}


import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { ShouldIGoSolarQuizClient } from "./should-i-go-solar-client";

export const metadata: Metadata = {
  title: "Should I Go Solar? — Free Quiz for Indian Homeowners 2026",
  description:
    "Take this 5-question quiz to find out if solar is right for your home. Get a personalized recommendation with subsidy amount and ROI.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl()}/should-i-go-solar`,
  },
};

export default function ShouldIGoSolarPage() {
  return <ShouldIGoSolarQuizClient />;
}


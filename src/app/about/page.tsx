import Link from "next/link";
import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Solar Subsidy Calculator",
  description:
    "Solar Subsidy Calculator is a free tool to help Indian homeowners calculate solar subsidy, understand PM Surya Ghar eligibility and prepare documents for their application.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">About Solar Subsidy Calculator</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Solar Subsidy Calculator is a free tool to help Indian homeowners calculate solar
          subsidy, understand PM Surya Ghar eligibility and prepare documents
          for their application.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Built by an independent developer in Ahmedabad, Gujarat.
          </p>
          <p>
            Data sources include{" "}
            <Link
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-solar-700 underline underline-offset-4 hover:text-solar-800"
            >
              pmsuryaghar.gov.in
            </Link>{" "}
            and MNRE guidelines/communications.
          </p>
          <p>
            Disclaimer: Data is for reference only. Final subsidy approval and
            amounts depend on DISCOM verification, scheme rules, and eligibility.
          </p>
        </div>

        <div className="mt-6">
          <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
            <Link href="/calculator">Open calculator</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}


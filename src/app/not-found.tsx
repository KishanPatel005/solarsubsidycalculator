import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { statesAndUTs } from "@/lib/data/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const suggestedSlugs = [
  "gujarat",
  "haryana",
  "maharashtra",
  "delhi",
  "karnataka",
  "telangana",
  "kerala",
  "punjab",
] as const;

function stateGuideHref(slug: string) {
  return `/solar-subsidy-${slug}`;
}

export default function NotFound() {
  const suggested = suggestedSlugs
    .map((slug) => statesAndUTs.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. Try the calculator or open a state subsidy guide below.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
          <Link href="/">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/calculator">Open calculator</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Suggested state guides</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggested.map((s) => (
            <Card key={s.slug} className="p-4">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="mt-3">
                <Link className="text-sm font-medium text-solar-700 hover:underline" href={stateGuideHref(s.slug)}>
                  Open guide
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


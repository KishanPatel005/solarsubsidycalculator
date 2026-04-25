"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, Share2 } from "lucide-react";

import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { formatINR } from "@/lib/utils/formatCurrency";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadForm } from "@/components/forms/LeadForm";

type BillBucket = "under_1000" | "1000_3000" | "3000_6000" | "above_6000";
type Ownership = "own" | "rent" | "society";
type RoofArea = "lt_100" | "100_300" | "300_600" | "gt_600";
type Goal = "bill" | "subsidy" | "environment" | "all";

type Answers = {
  bill: BillBucket | null;
  ownership: Ownership | null;
  roofArea: RoofArea | null;
  stateSlug: string | null;
  goal: Goal | null;
};

const totalQuestions = 5;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function centralSubsidyByKw(systemSizeKw: number) {
  let subsidy =
    systemSizeKw <= 2
      ? systemSizeKw * 30_000
      : systemSizeKw <= 3
        ? 60_000 + (systemSizeKw - 2) * 18_000
        : 78_000;
  subsidy = Math.min(subsidy, 78_000);
  return Math.max(0, subsidy);
}

function midpointMonthlyBill(b: BillBucket) {
  switch (b) {
    case "under_1000":
      return 800;
    case "1000_3000":
      return 2000;
    case "3000_6000":
      return 4500;
    case "above_6000":
      return 8000;
  }
}

function roofCapacityLimitKw(r: RoofArea) {
  // Rough planning limits; keeps results sane.
  switch (r) {
    case "lt_100":
      return 1;
    case "100_300":
      return 3;
    case "300_600":
      return 5;
    case "gt_600":
      return 10;
  }
}

function recommendedKwFromBill(billBucket: BillBucket) {
  // Simple planning mapping (typical Indian homes).
  switch (billBucket) {
    case "under_1000":
      return 1;
    case "1000_3000":
      return 2;
    case "3000_6000":
      return 3;
    case "above_6000":
      return 5;
  }
}

function verdictFromScore(score: number) {
  if (score >= 80) return "Strong Candidate" as const;
  if (score >= 60) return "Good Candidate" as const;
  return "Needs Assessment" as const;
}

function scoreModel(a: Answers) {
  let score = 0;

  // Bill: higher bill → stronger economics
  if (a.bill) {
    score +=
      a.bill === "under_1000"
        ? 5
        : a.bill === "1000_3000"
          ? 18
          : a.bill === "3000_6000"
            ? 28
            : 35;
  }

  // Ownership: ownership helps approvals
  if (a.ownership) {
    score += a.ownership === "own" ? 30 : a.ownership === "society" ? 18 : 5;
  }

  // Roof area: more area → more feasible
  if (a.roofArea) {
    score +=
      a.roofArea === "lt_100"
        ? 6
        : a.roofArea === "100_300"
          ? 18
          : a.roofArea === "300_600"
            ? 26
            : 30;
  }

  // Goal: doesn't change feasibility much, but indicates intent
  if (a.goal) {
    score += a.goal === "all" ? 5 : 3;
  }

  // If state chosen (always should be), small bump
  if (a.stateSlug) score += 5;

  // Penalties / constraints
  if (a.ownership === "rent") score -= 25;
  if (a.roofArea === "lt_100") score -= 15;
  if (a.bill === "under_1000") score -= 10;

  return clamp(Math.round(score), 0, 100);
}

function computeResults(a: Answers) {
  const score = scoreModel(a);
  const verdict = verdictFromScore(score);

  const billBucket = a.bill ?? "1000_3000";
  const monthlyBillMid = midpointMonthlyBill(billBucket);

  const roofLimit = roofCapacityLimitKw(a.roofArea ?? "100_300");
  const baseKw = recommendedKwFromBill(billBucket);
  const systemKw = clamp(baseKw, 1, roofLimit);

  const subsidy = Math.round(centralSubsidyByKw(systemKw));
  const monthlySavings = Math.round(monthlyBillMid * 0.85); // conservative: not always 100% offset
  const systemCost = Math.round(systemKw * 65_000);
  const finalCost = Math.max(0, systemCost - subsidy);
  const paybackYears = monthlySavings > 0 ? finalCost / (monthlySavings * 12) : Infinity;

  const notes: string[] = [];
  if (a.bill === "under_1000") notes.push("Solar may not be cost-effective yet");
  if (a.ownership === "rent") notes.push("Talk to your landlord first");
  if (a.roofArea === "lt_100") notes.push("Limited space — consider 1kW system");

  return {
    score,
    verdict,
    systemKw,
    subsidy,
    monthlySavings,
    paybackYears: Number.isFinite(paybackYears) ? Math.round(paybackYears * 10) / 10 : null,
    finalCost,
    notes,
  };
}

function optionButton(props: { label: string; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left"
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}

export function ShouldIGoSolarQuizClient() {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({
    bill: null,
    ownership: null,
    roofArea: null,
    stateSlug: null,
    goal: null,
  });

  const stateOptions = useMemo(() => {
    return [...STATES, ...UNION_TERRITORIES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const progressPct = Math.round(((step - 1) / totalQuestions) * 100);
  const canGoBack = step > 1 && step <= totalQuestions;

  const done = step === totalQuestions + 1;
  const result = useMemo(() => (done ? computeResults(answers) : null), [answers, done]);

  const shareText = result ? `I scored ${result.score}/100 on solar readiness!` : "";

  const onShare = async () => {
    if (!result) return;
    const text = shareText;

    try {
      const canShare = typeof navigator !== "undefined" && "share" in navigator;
      if (canShare) {
        await (navigator as Navigator & { share: (data: { text: string; url: string }) => Promise<void> }).share({
          text,
          url: window.location.href,
        });
        return;
      }
    } catch {
      // ignore
    }

    try {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
    } catch {
      // ignore
    }
  };

  const goNext = () => setStep((s) => Math.min(totalQuestions + 1, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="space-y-10 pb-12">
      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">5 questions</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Should I Go Solar? — Free Quiz for Indian Homeowners 2026
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Answer 5 quick questions to get a personalized recommendation with estimated system size, subsidy, and ROI.
          </p>
        </div>
      </section>

      {/* Progress */}
      {!done ? (
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground">
              Question {step} of {totalQuestions}
            </div>
            {canGoBack ? (
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
            ) : null}
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-solar-600 transition-[width] duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </Card>
      ) : null}

      {/* Quiz body */}
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-5">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-foreground">What is your monthly electricity bill?</div>
                  <div className="grid gap-2">
                    {optionButton({
                      label: "Under ₹1,000",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, bill: "under_1000" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "₹1,000–₹3,000",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, bill: "1000_3000" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "₹3,000–₹6,000",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, bill: "3000_6000" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "Above ₹6,000",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, bill: "above_6000" }));
                        goNext();
                      },
                    })}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-foreground">Do you own your home?</div>
                  <div className="grid gap-2">
                    {optionButton({
                      label: "Yes, I own it",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, ownership: "own" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "I rent it",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, ownership: "rent" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "Housing society/apartment",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, ownership: "society" }));
                        goNext();
                      },
                    })}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-foreground">How much rooftop area do you have?</div>
                  <div className="grid gap-2">
                    {optionButton({
                      label: "Less than 100 sq ft",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, roofArea: "lt_100" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "100–300 sq ft",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, roofArea: "100_300" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "300–600 sq ft",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, roofArea: "300_600" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "Above 600 sq ft",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, roofArea: "gt_600" }));
                        goNext();
                      },
                    })}
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-foreground">Which state are you in?</div>
                  <Select
                    value={answers.stateSlug ?? ""}
                    onValueChange={(v) => setAnswers((a) => ({ ...a, stateSlug: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state/UT" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {stateOptions.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full bg-solar-600 text-white hover:bg-solar-700"
                    disabled={!answers.stateSlug}
                    onClick={goNext}
                  >
                    Continue
                  </Button>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-foreground">What is your main goal?</div>
                  <div className="grid gap-2">
                    {optionButton({
                      label: "Reduce electricity bill",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, goal: "bill" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "Get govt subsidy",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, goal: "subsidy" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "Environment",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, goal: "environment" }));
                        goNext();
                      },
                    })}
                    {optionButton({
                      label: "All of the above",
                      onClick: () => {
                        setAnswers((a) => ({ ...a, goal: "all" }));
                        goNext();
                      },
                    })}
                  </div>
                </div>
              ) : null}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Solar Readiness Score</div>
                  <div className="mt-1 text-3xl font-bold text-foreground">{result?.score}/100</div>
                  <div className="mt-2">
                    <Badge className="bg-solar-600 text-white hover:bg-solar-700">
                      {result?.verdict}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!result) return;
                      try {
                        await navigator.clipboard.writeText(shareText);
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                  <div className="text-xs text-muted-foreground">Recommended system size</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{result?.systemKw} kW</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-muted-foreground">Estimated subsidy</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-700">{formatINR(result?.subsidy ?? 0)}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-muted-foreground">Estimated monthly savings</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(result?.monthlySavings ?? 0)}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-muted-foreground">Payback period</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {result?.paybackYears ? `${result.paybackYears} years` : "—"}
                  </div>
                </Card>
              </div>

              {result?.notes?.length ? (
                <div className="mt-5 rounded-lg border bg-muted/30 p-4">
                  <div className="text-sm font-semibold text-foreground">Quick notes</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {result.notes.map((n) => (
                      <li key={n} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
                  <Link href="/calculator">Open detailed calculator</Link>
                </Button>
                <Button variant="outline" onClick={() => { setStep(1); setAnswers({ bill: null, ownership: null, roofArea: null, stateSlug: null, goal: null }); }}>
                  Retake quiz
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-xl font-semibold">Get your free detailed solar assessment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your details and we’ll help you validate subsidy steps, sizing, and ROI for your home.
              </p>
              <LeadForm
                calculatorType="subsidy"
                subsidyAmount={result?.subsidy}
                finalCost={result?.finalCost}
                monthlySavings={result?.monthlySavings}
                state={answers.stateSlug ?? undefined}
                monthlyBill={3000}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


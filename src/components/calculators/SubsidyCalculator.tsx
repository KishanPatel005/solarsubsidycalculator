"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { formatINR } from "@/lib/utils/formatCurrency";
import {
  calculateAnnualSavings,
  calculateBreakevenYear,
  calculateROI,
} from "@/lib/calculations/savings";
import {
  calculateSubsidyResult,
  calculateSystemCost,
  calculateUnitsGeneratedPerMonth,
} from "@/lib/calculations/subsidy";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResultCard } from "./ResultCard";
import { LeadForm } from "@/components/forms/LeadForm";

const schema = z.object({
  stateSlug: z.string().min(1, "Select your state/UT"),
  monthlyBill: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter monthly bill")
    .min(500, "Min ₹500")
    .max(50_000, "Max ₹50,000"),
  rooftopArea: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter rooftop area")
    .min(50, "Min 50 sq ft")
    .max(5_000, "Max 5000 sq ft"),
  sanctionedLoad: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter sanctioned load")
    .min(1, "Min 1 kW")
    .max(20, "Max 20 kW"),
});

export type SubsidyFormValues = z.infer<typeof schema>;

function numberFromInput(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,\s₹]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

function ResultSkeleton() {
  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </Card>
        ))}
      </div>

      <Card className="p-4 sm:p-6">
        <Skeleton className="h-4 w-48" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="mt-6 h-3 w-56" />
        <Skeleton className="mt-2 h-3 w-full" />
      </Card>
    </div>
  );
}

export function SubsidyCalculator({
  onFinalCostComputed,
  defaultStateSlug,
}: {
  onFinalCostComputed?: (finalCostINR: number) => void;
  defaultStateSlug?: string;
}) {
  const form = useForm<SubsidyFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SubsidyFormValues>,
    mode: "onBlur",
    defaultValues: {
      stateSlug: defaultStateSlug ?? "gujarat",
      monthlyBill: 3000,
      rooftopArea: 200,
      sanctionedLoad: 3,
    },
  });

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateSubsidyResult> | null>(null);

  const watched = form.watch();
  const isFormValid = useMemo(() => schema.safeParse(watched).success, [watched]);

  const stateOptions = useMemo(() => {
    const all = [...STATES, ...UNION_TERRITORIES].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return all;
  }, []);

  const onSubmit = async (values: SubsidyFormValues) => {
    setLoading(true);
    setResult(null);

    // Skeleton for 1200ms (as requested)
    await new Promise((r) => setTimeout(r, 1200));

    const computed = calculateSubsidyResult({
      rooftopAreaSqft: values.rooftopArea,
      sanctionedLoadKw: values.sanctionedLoad,
      monthlyBillINR: values.monthlyBill,
      stateSlug: values.stateSlug,
      years: 25,
    });

    setResult(computed);
    setLoading(false);
    onFinalCostComputed?.(computed.finalCostINR);

    // Smooth scroll into results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const annualSavings = result
    ? calculateAnnualSavings(form.getValues("monthlyBill"), result.systemSizeKw)
    : 0;

  const systemCost = result ? calculateSystemCost(result.systemSizeKw) : 0;
  const breakevenYear = result
    ? calculateBreakevenYear(result.finalCostINR, annualSavings)
    : 0;
  const roi = result ? calculateROI(result.finalCostINR, annualSavings) : 0;

  const progressPercent = useMemo(() => {
    if (!result) return 0;
    if (annualSavings <= 0 || systemCost <= 0) return 0;
    const y = Math.max(1, Math.min(25, breakevenYear || 25));
    const saved = annualSavings * y;
    return Math.max(0, Math.min(100, Math.round((saved / systemCost) * 100)));
  }, [annualSavings, breakevenYear, result, systemCost]);

  useEffect(() => {
    // Ensure isValid is computed for default values (mode is onBlur).
    void form.trigger(["stateSlug", "monthlyBill", "rooftopArea", "sanctionedLoad"]);
  }, [form]);

  return (
    <div>
      <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="stateSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / UT</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px]">
                        {stateOptions.map((s) => (
                          <SelectItem key={s.slug} value={s.slug}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyBill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Bill (₹)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="e.g. 3000"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(numberFromInput(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooftopArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rooftop Area (sq ft)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="e.g. 200"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(numberFromInput(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sanctionedLoad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sanctioned Load (kW)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g. 3"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(numberFromInput(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="w-full bg-solar-600 text-white hover:bg-solar-700"
                disabled={!isFormValid || loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Calculations use official PM Surya Ghar central subsidy rules and
                public state policy references where available.
              </p>
            </div>
          </form>
        </Form>
      </Card>

      <div ref={resultsRef} />

      {loading ? <ResultSkeleton /> : null}

      <AnimatePresence>
        {result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-5"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultCard
                title="Total Subsidy"
                value={formatINR(result.totalSubsidyINR)}
                hint="Central + state"
                className="border-solar-200"
              />
              <ResultCard
                title="Final Cost"
                value={formatINR(result.finalCostINR)}
                hint="After subsidy"
              />
              <ResultCard
                title="Monthly Savings"
                value={formatINR(result.monthlySavingsINR)}
                hint="Estimated"
              />
              <ResultCard
                title="Payback Period"
                value={result.paybackPeriodYears ? `${result.paybackPeriodYears} yrs` : "—"}
                hint={roi ? `ROI ~ ${roi}%` : "Estimate"}
              />
            </div>

            <Card className="p-4 sm:p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold">Detailed breakdown</h3>
                <p className="text-sm text-muted-foreground">
                  A quick view of subsidy, savings, and environmental impact.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">System size recommended</span>
                  <span className="text-sm font-medium">{result.systemSizeKw} kW</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Central Govt Subsidy</span>
                  <span className="text-sm font-medium">{formatINR(result.centralSubsidyINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">State Additional Subsidy</span>
                  <span className="text-sm font-medium">{formatINR(result.stateSubsidyINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">System cost (before subsidy)</span>
                  <span className="text-sm font-medium">{formatINR(result.systemCostINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Your cost (after subsidy)</span>
                  <span className="text-sm font-medium">{formatINR(result.finalCostINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Monthly electricity savings</span>
                  <span className="text-sm font-medium">{formatINR(result.monthlySavingsINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Annual savings</span>
                  <span className="text-sm font-medium">{formatINR(annualSavings)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">25 year lifetime savings</span>
                  <span className="text-sm font-medium">{formatINR(result.lifetimeSavingsINR)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">CO₂ saved in 25 years</span>
                  <span className="text-sm font-medium">{result.co2SavedTonnes} tonnes</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Units generated per month</span>
                  <span className="text-sm font-medium">
                    {calculateUnitsGeneratedPerMonth(result.systemSizeKw)} units
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm">
                    You save {progressPercent}% of system cost in first{" "}
                    {breakevenYear ? Math.min(breakevenYear, 25) : 25} years
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    System cost: {formatINR(systemCost)}
                  </span>
                </div>
                <Progress value={progressPercent} className="mt-3" />
              </div>
            </Card>

            <LeadForm
              calculatorType="subsidy"
              subsidyAmount={result.totalSubsidyINR}
              finalCost={result.finalCostINR}
              monthlySavings={result.monthlySavingsINR}
              state={form.getValues("stateSlug")}
              monthlyBill={form.getValues("monthlyBill")}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}


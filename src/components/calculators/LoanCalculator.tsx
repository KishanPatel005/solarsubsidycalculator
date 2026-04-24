"use client";

import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import { bankSolarLoanOffers2025 } from "@/lib/data/bankRates";
import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { calculateCentralSubsidy, calculateFinalCost, calculateStateSubsidy, calculateSystemCost } from "@/lib/calculations/subsidy";
import { calculateEMIResult } from "@/lib/calculations/emi";
import { formatINR } from "@/lib/utils/formatCurrency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LeadForm } from "@/components/forms/LeadForm";

const schema = z.object({
  systemSize: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter system size")
    .min(1, "Min 1 kW")
    .max(10, "Max 10 kW"),
  stateSlug: z.string().min(1, "Select your state/UT"),
  downPaymentPct: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Select down payment")
    .min(0)
    .max(50),
});

export type LoanFormValues = z.infer<typeof schema>;

function numberFromInput(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,\s₹%]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

function parseAnnualRate(interestRateText: string): number | null {
  // Extract the first reasonable percentage number from text.
  const match = interestRateText.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n <= 0 || n > 30) return null;
  return n;
}

export function LoanCalculator() {
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<LoanFormValues>,
    mode: "onBlur",
    defaultValues: {
      systemSize: 3,
      stateSlug: "gujarat",
      downPaymentPct: 20,
    },
  });

  const stateOptions = useMemo(() => {
    const all = [...STATES, ...UNION_TERRITORIES].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return all;
  }, []);

  const values = form.watch();

  const computed = useMemo(() => {
    const systemCost = calculateSystemCost(values.systemSize);
    const central = calculateCentralSubsidy(values.systemSize);
    const state = calculateStateSubsidy(values.systemSize, values.stateSlug);
    const final = calculateFinalCost(systemCost, central + state);

    const downPayment = Math.round((final * values.downPaymentPct) / 100);
    const loanAmount = Math.max(0, final - downPayment);

    return { systemCost, central, state, final, downPayment, loanAmount };
  }, [values.downPaymentPct, values.stateSlug, values.systemSize]);

  const topBanks = useMemo(() => bankSolarLoanOffers2025.slice(0, 3), []);

  const comparisons = useMemo(() => {
    const tenureMonths = 60;
    const list = topBanks
      .map((b) => {
        const rate = parseAnnualRate(b.interestRate) ?? 9.5;
        const emi = calculateEMIResult(computed.loanAmount, rate, tenureMonths);
        return {
          name: b.name,
          annualRate: rate,
          tenureMonths,
          emi: emi.emi,
          totalPayment: emi.totalPayment,
        };
      })
      .sort((a, b) => a.emi - b.emi);

    const cheapest = list[0]?.name ?? null;
    return { list, cheapest };
  }, [computed.loanAmount, topBanks]);

  const downPaymentProgress = values.downPaymentPct * 2;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="systemSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Size (kW)</FormLabel>
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

            <FormField
              control={form.control}
              name="stateSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / UT</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
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
              name="downPaymentPct"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Down Payment</FormLabel>
                  <FormControl>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{field.value}%</span>
                        <span className="text-xs text-muted-foreground">
                          0% to 50%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="mt-3 w-full accent-orange-600"
                      />
                      <Progress value={downPaymentProgress} className="mt-3" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="sm:col-span-2">
              <Button
                type="button"
                className="w-full bg-solar-600 text-white hover:bg-solar-700"
                disabled={!form.formState.isValid}
                onClick={() => void form.trigger()}
              >
                Calculate Loan Options
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <div className="space-y-4">
        <Card className="p-4 sm:p-6">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">System cost (est.)</span>
              <span className="font-medium">{formatINR(computed.systemCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Central subsidy</span>
              <span className="font-medium">{formatINR(computed.central)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">State subsidy</span>
              <span className="font-medium">{formatINR(computed.state)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Final cost</span>
              <span className="font-medium">{formatINR(computed.final)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Down payment</span>
              <span className="font-medium">{formatINR(computed.downPayment)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Loan amount needed</span>
              <span className="text-base font-semibold text-foreground">
                {formatINR(computed.loanAmount)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Bank rates shown are indicative. Always verify the latest loan product
            details on the bank’s official site.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Top bank options (60 months)</h3>
            <Badge variant="secondary">Compare</Badge>
          </div>

          <div className="mt-4 space-y-3">
            {comparisons.list.map((b) => (
              <div
                key={b.name}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {b.name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Rate used: {b.annualRate}% p.a. • Tenure: {b.tenureMonths} months
                    </div>
                  </div>
                  {comparisons.cheapest === b.name ? (
                    <Badge className="bg-solar-600 text-white hover:bg-solar-700">
                      Cheapest
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Monthly EMI</div>
                    <div className="font-semibold">{formatINR(b.emi)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total payment</div>
                    <div className="font-semibold">{formatINR(b.totalPayment)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <LeadForm
          calculatorType="loan"
          subsidyAmount={computed.central + computed.state}
          finalCost={computed.final}
          state={values.stateSlug}
        />
      </div>
    </div>
  );
}


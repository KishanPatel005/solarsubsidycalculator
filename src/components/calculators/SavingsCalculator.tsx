"use client";

import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import {
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { STATES, UNION_TERRITORIES } from "@/lib/data/states";
import { calculateAnnualSavings, calculateBreakevenYear, calculateUnitsGenerated } from "@/lib/calculations/savings";
import { calculateCO2Saved } from "@/lib/calculations/subsidy";
import { formatINR } from "@/lib/utils/formatCurrency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  monthlyBill: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter monthly bill")
    .min(500, "Min ₹500")
    .max(50_000, "Max ₹50,000"),
  systemSize: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter system size")
    .min(1, "Min 1 kW")
    .max(10, "Max 10 kW"),
  stateSlug: z.string().min(1, "Select your state/UT"),
});

export type SavingsFormValues = z.infer<typeof schema>;

function numberFromInput(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,\s₹]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export function SavingsCalculator() {
  const form = useForm<SavingsFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SavingsFormValues>,
    mode: "onBlur",
    defaultValues: {
      monthlyBill: 3000,
      systemSize: 3,
      stateSlug: "gujarat",
    },
  });

  const stateOptions = useMemo(() => {
    const all = [...STATES, ...UNION_TERRITORIES].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return all;
  }, []);

  const values = form.watch();

  const annualSavings = calculateAnnualSavings(values.monthlyBill, values.systemSize);
  const monthlySavings = Math.round(annualSavings / 12);
  const tenYearSavings = Math.round(annualSavings * 10);
  const twentyFiveYearSavings = Math.round(annualSavings * 25);
  const unitsPerYear = calculateUnitsGenerated(values.systemSize);
  const co2PerYear = calculateCO2Saved(values.systemSize, 1);
  const breakeven = calculateBreakevenYear(
    // Final cost is unknown on this tab; use a conservative estimate as system cost (₹65k/kW).
    Math.round(values.systemSize * 65_000),
    annualSavings
  );

  const chartData = useMemo(() => {
    const data: { year: number; savings: number }[] = [];
    let cum = 0;
    for (let year = 1; year <= 25; year += 1) {
      cum += annualSavings;
      data.push({ year, savings: cum });
    }
    return data;
  }, [annualSavings]);

  const breakevenPoint = chartData.find((d) => d.year === breakeven);

  return (
    <div className="space-y-5">
      <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="monthlyBill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Monthly Bill (₹)</FormLabel>
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

            <div className="sm:col-span-3">
              <Button
                type="button"
                className="w-full bg-solar-600 text-white hover:bg-solar-700"
                disabled={!form.formState.isValid}
                onClick={() => void form.trigger()}
              >
                Calculate Savings
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Monthly savings</div>
          <div className="mt-1 text-xl font-semibold">{formatINR(monthlySavings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Annual savings</div>
          <div className="mt-1 text-xl font-semibold">{formatINR(annualSavings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Units generated / year</div>
          <div className="mt-1 text-xl font-semibold">{unitsPerYear.toLocaleString("en-IN")}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">10 year savings</div>
          <div className="mt-1 text-xl font-semibold">{formatINR(tenYearSavings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">25 year savings</div>
          <div className="mt-1 text-xl font-semibold">{formatINR(twentyFiveYearSavings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">CO₂ saved / year</div>
          <div className="mt-1 text-xl font-semibold">{co2PerYear} tonnes</div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Cumulative savings (1–25 years)</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Shows how savings add up over time. Breakeven is approximate.
            </div>
          </div>
          {breakeven ? <Badge variant="secondary">Breakeven ~ Year {breakeven}</Badge> : null}
        </div>

        <div className="mt-4 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${Math.round(v / 100000)}L`}
              />
              <Tooltip
                formatter={(v: unknown) => {
                  const n = typeof v === "number" ? v : 0;
                  return formatINR(n);
                }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#F97316"
                strokeWidth={2}
                dot={false}
              />
              {breakevenPoint ? (
                <ReferenceDot
                  x={breakevenPoint.year}
                  y={breakevenPoint.savings}
                  r={6}
                  fill="#EA580C"
                  stroke="white"
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <LeadForm
        calculatorType="savings"
        monthlySavings={monthlySavings}
        state={values.stateSlug}
        monthlyBill={values.monthlyBill}
      />
    </div>
  );
}


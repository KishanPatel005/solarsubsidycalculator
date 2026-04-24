"use client";

import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { calculateEMIResult } from "@/lib/calculations/emi";
import { formatINR } from "@/lib/utils/formatCurrency";

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
  principal: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter loan amount")
    .min(10_000, "Min ₹10,000")
    .max(5_000_000, "Max ₹50,00,000"),
  annualRate: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter interest rate")
    .min(0, "Min 0%")
    .max(30, "Max 30%"),
  tenureMonths: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Select tenure")
    .min(12, "Min 12 months")
    .max(240, "Max 240 months"),
});

export type EMIFormValues = z.infer<typeof schema>;

function numberFromInput(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,\s₹%]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export function EMICalculator({
  defaultPrincipal,
}: {
  defaultPrincipal?: number | null;
}) {
  const form = useForm<EMIFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<EMIFormValues>,
    mode: "onBlur",
    defaultValues: {
      principal: defaultPrincipal && defaultPrincipal > 0 ? defaultPrincipal : 200_000,
      annualRate: 7.5,
      tenureMonths: 60,
    },
  });

  useEffect(() => {
    if (defaultPrincipal && defaultPrincipal > 0) {
      form.setValue("principal", defaultPrincipal, { shouldValidate: true });
    }
  }, [defaultPrincipal, form]);

  const values = form.watch();

  const result = useMemo(() => {
    return calculateEMIResult(values.principal, values.annualRate, values.tenureMonths);
  }, [values.annualRate, values.principal, values.tenureMonths]);

  const chartData = useMemo(() => {
    return [
      { name: "Principal", value: Math.max(0, values.principal), fill: "#F97316" },
      { name: "Interest", value: Math.max(0, result.totalInterest), fill: "#FED7AA" },
    ];
  }, [result.totalInterest, values.principal]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="e.g. 200000"
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
              name="annualRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g. 7.5"
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
              name="tenureMonths"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Loan Tenure</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        {[12, 24, 36, 48, 60, 84, 120].map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                Calculate EMI
              </Button>
            </div>
          </form>
        </Form>
        </Card>

        <Card className="p-4 sm:p-6">
        <div className="text-xs font-medium text-muted-foreground">Monthly EMI</div>
        <div className="mt-1 text-3xl font-semibold text-foreground">
          {formatINR(result.emi)}
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Interest Payable</span>
            <span className="font-medium">{formatINR(result.totalInterest)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Payment Amount</span>
            <span className="font-medium">{formatINR(result.totalPayment)}</span>
          </div>
        </div>

        <div className="mt-6 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              />
              <Tooltip
                formatter={(v: unknown) => {
                  const n = typeof v === "number" ? v : 0;
                  return formatINR(n);
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Principal vs Interest split</span>
            <span>{values.tenureMonths} months</span>
          </div>
        </div>
        </Card>
      </div>

      <LeadForm
        calculatorType="emi"
        finalCost={values.principal}
        state={undefined}
        monthlyBill={undefined}
      />
    </div>
  );
}


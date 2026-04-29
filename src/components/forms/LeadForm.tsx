"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck, SunMedium, PhoneCall, BadgeCheck } from "lucide-react";

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

export type CalculatorType = "subsidy" | "emi" | "loan" | "savings";

export interface LeadFormProps {
  calculatorType: CalculatorType;
  subsidyAmount?: number;
  finalCost?: number;
  monthlySavings?: number;
  state?: string;
  monthlyBill?: number;
}

const schema = z.object({
  name: z.string().min(2, "Enter full name").max(50, "Max 50 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().min(2, "Enter your city").max(80, "Max 80 characters"),
  bill: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), "Enter monthly bill")
    .min(0, "Min ₹0")
    .max(50_000, "Max ₹50,000"),
  callTime: z.enum(["morning", "afternoon", "evening"], {
    message: "Select best time to call",
  }),
});

type Values = z.infer<typeof schema>;

function trustItem(icon: React.ReactNode, title: string) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/60 px-3 py-2 text-xs text-muted-foreground">
      <span className="text-solar-700">{icon}</span>
      <span className="font-medium text-foreground">{title}</span>
    </div>
  );
}

export function LeadForm(props: LeadFormProps) {
  const [submitted, setSubmitted] = useState<null | { name: string; phone: string }>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema) as unknown as Resolver<Values>,
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      bill: props.monthlyBill ?? 3000,
      callTime: "evening",
    },
  });

  const stateGuideHref = useMemo(() => {
    if (!props.state) return "/solar-subsidy";
    return `/solar-subsidy-${props.state}`;
  }, [props.state]);

  const onSubmit = async (values: Values) => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      bill: values.bill,
      callTime: values.callTime,
      calculatorType: props.calculatorType,
      subsidyAmount: props.subsidyAmount,
      finalCost: props.finalCost,
      monthlySavings: props.monthlySavings,
      state: props.state,
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!res || !res.ok) {
      setSubmitting(false);
      form.setError("phone", { message: "Submission failed. Please try again." });
      return;
    }

    // Fire Google Analytics lead event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        currency: "INR",
        value: values.bill,
        calculator_type: props.calculatorType,
        state: props.state,
      });
    }

    setSubmitted({ name: values.name, phone: values.phone });
    setSubmitting(false);
  };

  return (
    <Card className="mt-8 overflow-hidden border-0 bg-gradient-to-br from-solar-50 via-white to-solar-100 p-[1px]">
      <div className="rounded-xl bg-background p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-solar-100 p-2 text-solar-700">
            <SunMedium className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              Get Free Solar Consultation
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Free tool — no login, no spam
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {trustItem(<ShieldCheck className="h-4 w-4" />, "Free Advice")}
          {trustItem(<PhoneCall className="h-4 w-4" />, "Expert Call")}
          {trustItem(<BadgeCheck className="h-4 w-4" />, "No Spam")}
        </div>

        {/* Optional context chips */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {typeof props.subsidyAmount === "number" ? (
            <span className="rounded-full bg-muted px-3 py-1">
              Subsidy: <span className="font-medium text-foreground">{formatINR(props.subsidyAmount)}</span>
            </span>
          ) : null}
          {typeof props.finalCost === "number" ? (
            <span className="rounded-full bg-muted px-3 py-1">
              Final cost: <span className="font-medium text-foreground">{formatINR(props.finalCost)}</span>
            </span>
          ) : null}
          {typeof props.monthlySavings === "number" ? (
            <span className="rounded-full bg-muted px-3 py-1">
              Monthly savings: <span className="font-medium text-foreground">{formatINR(props.monthlySavings)}</span>
            </span>
          ) : null}
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4"
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-emerald-600"
              >
                <CheckCircle2 className="h-6 w-6" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Thank you {submitted.name}! Our solar expert will call you within 2 hours on{" "}
                  {submitted.phone}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  While you wait, check your state&apos;s subsidy guide.
                </p>
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <Link href={stateGuideHref}>Open subsidy guide</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input inputMode="numeric" placeholder="10-digit mobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ahmedabad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Electricity Bill (₹)</FormLabel>
                      <FormControl>
                        <Input inputMode="numeric" placeholder="e.g. 3000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="callTime"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Best Time to Call</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9-12)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12-5)</SelectItem>
                            <SelectItem value="evening">Evening (5-8)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    className="w-full bg-solar-600 text-white hover:bg-solar-700"
                    disabled={submitting || form.formState.isSubmitting}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Get Free Consultation →"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </Card>
  );
}


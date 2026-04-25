"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { LeadForm } from "@/components/forms/LeadForm";

import { formatINR } from "@/lib/utils/formatCurrency";

type BankKey = "sbi" | "pnb" | "bob" | "canara" | "other";

const bankRates: Record<BankKey, { label: string; ratePa: number; note?: string }> = {
  sbi: { label: "SBI", ratePa: 7.0, note: "Up to ₹10 lakh, up to 10 years (verify latest)" },
  pnb: { label: "PNB", ratePa: 7.25 },
  bob: { label: "Bank of Baroda", ratePa: 7.5 },
  canara: { label: "Canara Bank", ratePa: 7.25 },
  other: { label: "Other", ratePa: 9.0 },
};

const tenureOptions = [12, 24, 36, 60, 84] as const;

function numberFromInput(value: string) {
  const cleaned = value.replace(/[,\s₹]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function computeCentralSubsidy(systemSizeKw: number) {
  // PM Surya Ghar slab logic used elsewhere in project (planning).
  let subsidy =
    systemSizeKw <= 2
      ? systemSizeKw * 30_000
      : systemSizeKw <= 3
        ? 60_000 + (systemSizeKw - 2) * 18_000
        : 78_000;
  subsidy = Math.min(subsidy, 78_000);
  return Math.max(0, subsidy);
}

function emi(principal: number, annualRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const x = Math.pow(1 + r, months);
  return (principal * r * x) / (x - 1);
}

type AmRow = {
  month: number;
  opening: number;
  emi: number;
  interest: number;
  principal: number;
  closing: number;
};

function amortizationFirstMonths(principal: number, annualRatePct: number, months: number, count: number): AmRow[] {
  const out: AmRow[] = [];
  const r = annualRatePct / 12 / 100;
  const payment = emi(principal, annualRatePct, months);
  let bal = principal;

  for (let m = 1; m <= Math.min(count, months); m += 1) {
    const opening = bal;
    const interest = r * bal;
    const principalPaid = Math.min(bal, payment - interest);
    const closing = Math.max(0, bal - principalPaid);
    out.push({
      month: m,
      opening,
      emi: payment,
      interest,
      principal: principalPaid,
      closing,
    });
    bal = closing;
  }

  return out;
}

function breakevenMonthBySavings(monthlySavings: number, monthlyEmi: number, months: number) {
  if (monthlySavings <= 0) return null;
  if (monthlyEmi <= 0) return 1;

  let cumSavings = 0;
  let cumPaid = 0;
  for (let m = 1; m <= months; m += 1) {
    cumSavings += monthlySavings;
    cumPaid += monthlyEmi;
    if (cumSavings >= cumPaid) return m;
  }
  return null;
}

const faqItems = [
  {
    q: "What interest rate is used for solar loans in India?",
    a: "Rates vary by bank, borrower profile, and scheme. This page includes planning rates for SBI/PNB/Bank of Baroda/Canara—always confirm the latest rate with the bank before applying.",
  },
  {
    q: "Does PM Surya Ghar subsidy reduce my loan amount?",
    a: "Typically, you pay the net amount after subsidy (or bridge finance until subsidy is released). Many homeowners estimate loan amount as (system cost − expected subsidy). Actual flow depends on vendor/bank process.",
  },
  {
    q: "What is a good loan tenure for rooftop solar?",
    a: "Many borrowers choose 3–7 years depending on EMI comfort. Longer tenure lowers EMI but increases total interest paid.",
  },
  {
    q: "How accurate is the break-even month?",
    a: "It’s an estimate based on an assumed monthly savings from generation and tariff. Actual savings depend on your consumption pattern, net metering credits, and tariff slab.",
  },
  {
    q: "Can I prepay a solar loan?",
    a: "Some banks allow prepayment/foreclosure, sometimes with charges. Prepaying typically reduces total interest—check your bank’s terms.",
  },
] as const;

export function SolarLoanCalculatorClient() {
  const [systemSizeInput, setSystemSizeInput] = useState<string>("3");
  const [bank, setBank] = useState<BankKey>("sbi");
  const [interestInput, setInterestInput] = useState<string>(String(bankRates.sbi.ratePa));
  const [tenureMonths, setTenureMonths] = useState<(typeof tenureOptions)[number]>(60);
  const [downPaymentPctInput, setDownPaymentPctInput] = useState<string>("10");

  const [subsidyInput, setSubsidyInput] = useState<string>(""); // editable
  const [loanAmountInput, setLoanAmountInput] = useState<string>(""); // editable

  const systemSizeKw = Math.max(0, numberFromInput(systemSizeInput) || 0);
  const baseCost = systemSizeKw * 65_000;

  const autoSubsidy = computeCentralSubsidy(systemSizeKw);
  const subsidy = subsidyInput.trim() ? Math.max(0, numberFromInput(subsidyInput) || 0) : autoSubsidy;

  const downPaymentPct = clamp(numberFromInput(downPaymentPctInput) || 0, 0, 100);
  const downPayment = (baseCost * downPaymentPct) / 100;

  const autoLoan = Math.max(0, baseCost - subsidy - downPayment);
  const loanAmount = loanAmountInput.trim() ? Math.max(0, numberFromInput(loanAmountInput) || 0) : autoLoan;

  const interestRate = interestInput.trim() ? Math.max(0, numberFromInput(interestInput) || 0) : bankRates[bank].ratePa;
  const monthlyEmi = emi(loanAmount, interestRate, tenureMonths);
  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // Savings assumption: ~120 units/month/kW × ₹8/unit = ₹960 per kW per month.
  const assumedMonthlySavings = systemSizeKw * 120 * 8;
  const breakevenMonth = breakevenMonthBySavings(assumedMonthlySavings, monthlyEmi, tenureMonths);

  const amortRows = useMemo(
    () => amortizationFirstMonths(loanAmount, interestRate, tenureMonths, 6),
    [interestRate, loanAmount, tenureMonths],
  );

  const faqData = useMemo(
    () => ({
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [],
  );

  return (
    <div className="space-y-10 pb-12">
      <SchemaMarkup
        schemaType="FAQPage"
        data={faqData}
      />

      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-solar-600 text-white hover:bg-solar-700">Updated 2026</Badge>
          <Badge variant="secondary">EMI + interest</Badge>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Solar Loan Calculator India 2026 — EMI &amp; Interest Calculator
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Estimate your EMI, total interest, and payments for a solar loan. Includes planning bank rates (SBI, PNB, Bank of Baroda, Canara)
            and subtracts PM Surya Ghar central subsidy as a baseline.
          </p>
        </div>
      </section>

      {/* 2) Enhanced loan calculator */}
      <section className="space-y-4" id="calculator">
        <h2 className="text-xl font-semibold">Solar loan EMI calculator</h2>

        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">System size (kW)</div>
              <Input inputMode="decimal" value={systemSizeInput} onChange={(e) => setSystemSizeInput(e.target.value)} />
              <div className="text-xs text-muted-foreground">Auto cost uses ₹65,000 per kW (planning).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Subsidy amount (₹)</div>
              <Input
                inputMode="numeric"
                placeholder={String(Math.round(autoSubsidy))}
                value={subsidyInput}
                onChange={(e) => setSubsidyInput(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">Auto-calculated from central slabs (editable).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Down payment (%)</div>
              <Input inputMode="numeric" value={downPaymentPctInput} onChange={(e) => setDownPaymentPctInput(e.target.value)} />
              <div className="text-xs text-muted-foreground">Reduces loan amount.</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Loan amount (₹)</div>
              <Input
                inputMode="numeric"
                placeholder={String(Math.round(autoLoan))}
                value={loanAmountInput}
                onChange={(e) => setLoanAmountInput(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">Auto = cost − subsidy − down payment (editable).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Bank</div>
              <Select
                value={bank}
                onValueChange={(v) => {
                  const b = v as BankKey;
                  setBank(b);
                  setInterestInput(String(bankRates[b].ratePa));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">SBI</SelectItem>
                  <SelectItem value="pnb">PNB</SelectItem>
                  <SelectItem value="bob">Bank of Baroda</SelectItem>
                  <SelectItem value="canara">Canara</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {bankRates[bank].note ? <div className="text-xs text-muted-foreground">{bankRates[bank].note}</div> : null}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Interest rate (% p.a.)</div>
              <Input inputMode="decimal" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} />
              <div className="text-xs text-muted-foreground">Auto-filled by bank (editable).</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">Loan tenure (months)</div>
              <Select value={String(tenureMonths)} onValueChange={(v) => setTenureMonths(Number(v) as typeof tenureMonths)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  {tenureOptions.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Monthly EMI</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(monthlyEmi))}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Total interest paid</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(totalInterest))}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Total payment</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{formatINR(Math.round(totalPayment))}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Break-even month</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{breakevenMonth ? `Month ${breakevenMonth}` : "—"}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Assumes monthly savings ~ {formatINR(Math.round(assumedMonthlySavings))} (120 units/kW × ₹8).
              </div>
            </Card>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-sm font-semibold text-foreground">Amortization (first 6 months)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr className="[&>th]:px-3 [&>th]:py-2">
                    <th>Month</th>
                    <th>Opening</th>
                    <th>EMI</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Closing</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t">
                  {amortRows.map((r) => (
                    <tr key={r.month} className="[&>td]:px-3 [&>td]:py-2">
                      <td className="font-semibold text-foreground">{r.month}</td>
                      <td>{formatINR(Math.round(r.opening))}</td>
                      <td>{formatINR(Math.round(r.emi))}</td>
                      <td>{formatINR(Math.round(r.interest))}</td>
                      <td>{formatINR(Math.round(r.principal))}</td>
                      <td>{formatINR(Math.round(r.closing))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Tip: You can open the main calculator EMI tab directly at{" "}
            <Link href="/calculator#emi" className="font-medium text-solar-700 hover:underline">
              /calculator#emi
            </Link>
            .
          </p>
        </Card>
      </section>

      {/* 3) Bank comparison table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bank rate comparison (planning)</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th>Bank</th>
                  <th>Rate (p.a.)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t">
                {(["sbi", "pnb", "bob", "canara"] as const).map((k) => (
                  <tr key={k} className="[&>td]:px-4 [&>td]:py-3">
                    <td className="font-semibold text-foreground">{bankRates[k].label}</td>
                    <td className="text-muted-foreground">{bankRates[k].ratePa.toFixed(2)}%</td>
                    <td className="text-muted-foreground">{bankRates[k].note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <Separator />

      {/* 4) Tips */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tips to get the best solar loan rate</h2>
        <Card className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Compare offers across banks and ask for any green/priority-sector rates.",
              "Keep income proof and credit score strong to unlock lower rates.",
              "Choose a tenure where EMI stays below your comfortable monthly savings range.",
              "Prefer transparent quotes (processing fee, insurance, foreclosure charges).",
              "If possible, increase down payment to reduce interest outgo.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* 5) FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((f, idx) => (
            <AccordionItem key={f.q} value={`faq-${idx}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 6) Lead form */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get help with solar loan & subsidy</h2>
        <p className="text-sm text-muted-foreground">
          Share your monthly bill and city to get help with system sizing, subsidy steps, and financing options.
        </p>
        <LeadForm calculatorType="loan" finalCost={Math.round(baseCost - subsidy)} monthlySavings={Math.round(assumedMonthlySavings)} />
      </section>
    </div>
  );
}


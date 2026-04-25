import * as React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import BlogImage from "@/components/blog/BlogImage";
import { Card } from "@/components/ui/card";
import { SavingsCalculator } from "@/components/calculators/SavingsCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubsidyCalculator } from "@/components/calculators/SubsidyCalculator";
import { EMICalculator } from "@/components/calculators/EMICalculator";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";

function slugFromChildren(children: React.ReactNode) {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.join("")
        : "";

  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mt-0.5 text-amber-500">
        <Info className="h-5 w-5" />
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="mt-0.5 text-red-500">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

function StepBox(props: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex gap-3 rounded-lg border border-amber-200 bg-white p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
        {props.number}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-900">{props.title}</div>
        <div className="mt-1 text-sm text-gray-700">{props.children}</div>
      </div>
    </div>
  );
}

function CheckList(props: { items?: string[] }) {
  const items = Array.isArray(props.items) ? props.items : [];
  return (
    <div className="mb-4 rounded-lg bg-green-50 p-4">
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JsonLd(props: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(props.data)}
    </script>
  );
}

function SavingsCalculatorEmbed() {
  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/40 p-4">
      <div className="text-sm font-semibold text-gray-900">Savings calculator</div>
      <div className="mt-3">
        <SavingsCalculator />
      </div>
    </Card>
  );
}

function CalculatorTabsEmbed() {
  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/40 p-4">
      <div className="text-sm font-semibold text-gray-900">Calculator</div>
      <div className="mt-3">
        <Tabs defaultValue="subsidy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="subsidy">Subsidy</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="loan">Loan</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="subsidy">
              <SubsidyCalculator defaultStateSlug="gujarat" />
            </TabsContent>
            <TabsContent value="emi">
              <EMICalculator defaultPrincipal={null} />
            </TabsContent>
            <TabsContent value="loan">
              <LoanCalculator />
            </TabsContent>
            <TabsContent value="savings">
              <SavingsCalculator />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      id={slugFromChildren(props.children)}
      className="mt-8 mb-4 border-l-4 border-amber-500 pl-4 text-2xl font-bold text-gray-900"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="mt-6 mb-3 text-xl font-semibold text-gray-800" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-4 text-gray-700 leading-relaxed" />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-semibold text-amber-700" />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic text-gray-600" />
  ),
  a: ({ href = "", children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = isExternalHref(href);
    if (!href) return <a {...rest}>{children}</a>;

    if (external) {
      return (
        <a
          {...rest}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-amber-600 underline hover:text-amber-800"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className="text-amber-600 underline hover:text-amber-800">
        {children}
      </Link>
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="mb-4 list-disc space-y-2 pl-6" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="mb-4 list-decimal space-y-2 pl-6" />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="text-gray-700 leading-relaxed" />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote {...props} className="mb-4 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 italic" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className="rounded bg-amber-100 px-1 font-mono text-sm text-amber-800" />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white" />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="my-8 border-amber-200" />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <table {...props} className="mb-6 w-full border-collapse" />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="border border-gray-200 bg-amber-100 p-3 text-left font-semibold text-gray-800" />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border border-gray-200 p-3 text-gray-700" />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props} className="even:bg-gray-50" />
  ),

  InfoBox,
  WarningBox,
  StepBox,
  CheckList,
  BlogImage,
  JsonLd,
  SavingsCalculatorEmbed,
  CalculatorTabsEmbed,
};

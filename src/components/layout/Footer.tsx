import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const topStates = [
  { href: "/solar-subsidy-maharashtra", label: "Maharashtra" },
  { href: "/solar-subsidy-gujarat", label: "Gujarat" },
  { href: "/solar-subsidy-rajasthan", label: "Rajasthan" },
  { href: "/solar-subsidy-karnataka", label: "Karnataka" },
  { href: "/solar-subsidy-uttar-pradesh", label: "Uttar Pradesh" },
] as const;

const calculators = [
  { href: "/calculator", label: "Rooftop subsidy calculator" },
  { href: "/calculator", label: "Net metering estimate" },
  { href: "/calculator", label: "Payback period estimate" },
] as const;

const blogLinks = [
  { href: "/blog", label: "Solar subsidy updates" },
  { href: "/blog/pm-surya-ghar-yojana-2026", label: "PM Surya Ghar scheme" },
  { href: "/blog/solar-subsidy-documents-required", label: "Documents checklist" },
] as const;

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-base font-semibold">Solar Subsidy Calculator</span>
            </Link>
            <p className="max-w-md text-sm text-muted-foreground">
              Tools and guides for India’s rooftop solar subsidy schemes—estimate
              eligibility, understand state rules, and prepare documents for your
              application.
            </p>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Disclaimer</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Data based on govt guidelines. Final subsidy approval and amounts
                depend on your DISCOM, scheme rules, and verification outcomes.
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterSection title="All calculators" links={calculators} />
            <FooterSection title="Top states" links={topStates} />
            <FooterSection title="Blogs" links={blogLinks} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SolarSubsidyCalculator.com</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/blog/solar-subsidy-status-check" className="hover:text-foreground">
              Subsidy Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


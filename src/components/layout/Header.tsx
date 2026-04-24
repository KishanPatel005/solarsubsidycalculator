"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, SunMedium } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteNav } from "./site-nav";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
      {siteNav.map((item) => {
        const isActive =
          pathname === item.href || Boolean(pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-muted hover:text-foreground",
              isActive ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-solar-100 text-solar-700">
            <SunMedium className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-foreground sm:text-base">
              Solar Subsidy Calculator
            </span>
            <span className="block text-xs text-muted-foreground">
              India rooftop solar schemes
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <NavLinks />
          <Button asChild className="ml-2 bg-solar-600 text-white hover:bg-solar-700">
            <Link href="/calculator">Start calculation</Link>
          </Button>
        </div>

        <div className="sm:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-solar-100 text-solar-700">
                    <SunMedium className="h-4 w-4" aria-hidden="true" />
                  </span>
                  Solar Subsidy Calculator
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
                <div className="mt-4">
                  <Button
                    asChild
                    className="w-full bg-solar-600 text-white hover:bg-solar-700"
                  >
                    <Link href="/calculator" onClick={() => setMobileOpen(false)}>
                      Start calculation
                    </Link>
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Built for India’s rooftop solar subsidy rules and state guides.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


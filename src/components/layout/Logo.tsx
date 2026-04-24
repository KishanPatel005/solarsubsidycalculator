"use client";

import * as React from "react";
import Image from "next/image";
import { SunMedium } from "lucide-react";

import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

export function Logo({
  size = "md",
  showText = true,
  className,
}: {
  size?: Size;
  showText?: boolean;
  className?: string;
}) {
  const [errored, setErrored] = React.useState(false);

  const h = size === "sm" ? 28 : size === "lg" ? 48 : 36;
  const logoSrc = showText ? "/logo.png" : "/favicon-32x32.png";

  if (errored) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span className="inline-flex items-center justify-center rounded-full bg-solar-100 p-2 text-solar-700">
          <SunMedium className="h-4 w-4" aria-hidden="true" />
        </span>
        {showText ? (
          <span className="text-base font-bold text-solar-700">SolarHelp</span>
        ) : null}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src={logoSrc}
        alt="SolarHelp"
        width={showText ? Math.round(h * 4.2) : h}
        height={h}
        priority
        className="h-auto"
        onError={() => setErrored(true)}
      />
      {showText ? (
        <span className="sr-only">SolarHelp</span>
      ) : null}
    </span>
  );
}


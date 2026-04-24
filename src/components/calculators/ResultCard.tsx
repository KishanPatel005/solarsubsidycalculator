"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ResultCard({
  title,
  value,
  hint,
  className,
}: {
  title: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <div className="text-xl font-semibold text-foreground sm:text-2xl">
          {value}
        </div>
        {hint ? (
          <div className="text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </div>
    </Card>
  );
}


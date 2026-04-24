"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function SmoothScrollButton(
  props: React.ComponentProps<typeof Button> & { targetId: string }
) {
  const { targetId, onClick, ...rest } = props;

  return (
    <Button
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        const el = document.getElementById(targetId);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    />
  );
}


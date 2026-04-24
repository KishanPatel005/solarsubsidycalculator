"use client";

import * as React from "react";
import { Copy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = React.useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const waText = encodeURIComponent(`${title}\n${url}`);
  const waHref = `https://wa.me/?text=${waText}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
        <a href={waHref} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </a>
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            // no-op
          }
        }}
      >
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}


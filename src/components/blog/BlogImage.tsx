"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function BlogImage({
  src,
  alt,
  caption,
  priority,
  width = 1200,
  height = 630,
}: Props) {
  const [errored, setErrored] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  if (!alt.trim()) {
    // Enforce non-empty alt; still render placeholder in dev to avoid hard crash.
    alt = "Blog image";
  }

  return (
    <figure className="w-full">
      <div className="relative w-full overflow-hidden rounded-lg shadow-md">
        {!loaded && !errored ? (
          <Skeleton className="aspect-video w-full" />
        ) : null}

        {errored ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-amber-600 bg-amber-100 px-4 text-center">
            <Camera className="h-7 w-7 text-amber-700" aria-hidden="true" />
            <p className="text-sm text-gray-500">{alt}</p>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className="h-auto w-full"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-2 text-sm italic text-gray-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}


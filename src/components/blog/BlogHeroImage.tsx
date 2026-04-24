"use client";

import * as React from "react";
import Image from "next/image";
import { SunMedium } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  priority: boolean;
};

export function BlogHeroImage({ src, alt, priority }: Props) {
  const [errored, setErrored] = React.useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
      {errored ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-amber-100 p-3 text-amber-700">
              <SunMedium className="h-7 w-7" />
            </div>
            <div className="text-sm text-gray-500">{alt}</div>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          onError={() => setErrored(true)}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      )}
    </div>
  );
}


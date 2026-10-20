"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-line2">
        <Photo src={images[i]} alt={alt} priority sizes="(min-width:1024px) 55vw, 100vw" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, n) => (
            <button
              key={src + n}
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              aria-current={n === i}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border",
                n === i ? "border-brand-red" : "border-ink-line2 opacity-70 hover:opacity-100",
              )}
            >
              <Photo src={src} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

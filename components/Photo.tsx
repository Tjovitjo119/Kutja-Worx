import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fills its (relatively positioned) parent. Uses, in order: a Sanity image,
 * a local fallback path (flyer crop), or a clearly-labelled placeholder.
 */
export default function Photo({
  image,
  fallback,
  alt = "",
  width = 1400,
  priority,
  className = "object-cover",
  label = "Photo placeholder",
}: {
  image?: any;
  fallback?: string;
  alt?: string;
  width?: number;
  priority?: boolean;
  className?: string;
  label?: string;
}) {
  const src = image ? urlFor(image).width(width).quality(80).url() : fallback;
  if (!src) {
    return (
      <div className="placeholder-photo absolute inset-0 flex items-center justify-center">
        <span className="px-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill priority={priority} unoptimized={!!image || src.endsWith(".svg")} sizes="(min-width:1024px) 50vw, 100vw" className={className} />;
}

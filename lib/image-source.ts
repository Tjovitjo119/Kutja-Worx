import { urlFor } from "@/sanity/lib/image";
import { sanityConfigured } from "@/sanity/env";

/** URL for an uploaded Sanity image, or null when there is none (or Sanity is not connected). */
export function imageForSource(source: any, width = 1200): string | null {
  if (!source?.asset || !sanityConfigured) return null;
  return urlFor(source).width(width).quality(80).auto("format").url();
}

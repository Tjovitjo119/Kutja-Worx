import type { ReactNode } from "react";
import { Photo, StripeBackground } from "@/components/ui/primitives";

/** Sub-page banner: a full-bleed background photo with the two-tone title laid over it. */
export default function PageHero({
  eyebrow,
  white,
  red,
  sub,
  photo = "/cars/bmw-e30-325i.webp",
  children,
}: {
  eyebrow?: string;
  white: string;
  red: string;
  sub?: ReactNode;
  photo?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink-line bg-ink">
      <Photo src={photo} priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />
      <StripeBackground className="-z-10 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20 md:py-24">
        {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-red">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl">
          {white} <span className="text-brand-red">{red}</span>
        </h1>
        {sub && <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

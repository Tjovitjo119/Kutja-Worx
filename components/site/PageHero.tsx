import type { ReactNode } from "react";
import DiagonalPanel from "@/components/DiagonalPanel";
import { Photo, StripeBackground } from "@/components/ui/primitives";

/** Sub-page banner: two-tone title on the left, diagonally cut art/photo on the right. */
export default function PageHero({
  eyebrow,
  white,
  red,
  sub,
  art = "/api/art/engine",
  children,
}: {
  eyebrow?: string;
  white: string;
  red: string;
  sub?: ReactNode;
  art?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink-line bg-ink">
      <StripeBackground className="opacity-40" />
      <div className="relative md:min-h-[15rem]">
        <DiagonalPanel side="left" cut="18%" className="relative h-40 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
          <Photo src={art} priority sizes="60vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
        </DiagonalPanel>
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
          {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-red">{eyebrow}</p>}
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            {white} <span className="text-brand-red">{red}</span>
          </h1>
          {sub && <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">{sub}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

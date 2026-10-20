import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  red: "bg-brand-red text-white hover:bg-brand-dark shadow-[0_4px_18px_rgba(230,0,18,0.35)]",
  outline: "border border-white/60 text-white hover:border-brand-red hover:text-brand-red",
  ghost: "text-white/80 hover:text-brand-red",
};

export const btn = (variant: keyof typeof variants = "red", size: "sm" | "md" = "md") =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
    size === "sm" ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm",
    variants[variant],
  );

export function LinkButton({
  href,
  variant = "red",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: keyof typeof variants;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^(tel:|mailto:|https?:)/.test(href);
  const cls = cn(btn(variant, size), className);
  return external ? (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Badge({ tone = "muted", children }: { tone?: "ok" | "warn" | "info" | "muted" | "red"; children: ReactNode }) {
  const tones = {
    ok: "bg-green-500/15 text-green-500",
    warn: "bg-amber-500/15 text-amber-600",
    info: "bg-blue-500/15 text-blue-500",
    muted: "bg-gray-500/15 text-gray-500",
    red: "bg-brand-red/15 text-brand-red",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", tones[tone])}>{children}</span>
  );
}

/** Two-tone heading: white words + red words (red always on the right). */
export function SectionHeading({
  white,
  red,
  eyebrow,
  sub,
  className,
  as: Tag = "h2",
}: {
  white: string;
  red: string;
  eyebrow?: string;
  sub?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-red">{eyebrow}</p>}
      <Tag className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {white} <span className="text-brand-red">{red}</span>
      </Tag>
      {sub && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{sub}</p>}
    </div>
  );
}

/** Image that fills a relatively-positioned parent. Placeholder art is SVG, so it skips the optimiser. */
export function Photo({
  src,
  alt = "",
  className,
  priority,
  sizes = "(min-width:1024px) 33vw, 100vw",
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const unopt = src.startsWith("/api/art") || src.endsWith(".svg");
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} unoptimized={unopt} className={cn("object-cover", className)} />;
}

/** Diagonal red/black stripe motif used behind hero sections. */
export function StripeBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -right-10 top-0 h-full w-24 origin-top-right -skew-x-[22deg] bg-brand-red/90" />
      <div className="absolute right-28 top-0 h-full w-8 -skew-x-[22deg] bg-brand-red/60" />
      <div className="absolute right-44 top-0 h-full w-3 -skew-x-[22deg] bg-brand-red/40" />
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-ink-line2 bg-ink-panel transition-colors hover:border-brand-red/70", className)}>
      {children}
    </div>
  );
}

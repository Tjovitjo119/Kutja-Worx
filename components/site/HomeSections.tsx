import Link from "next/link";
import { ArrowRight, Cog, Cpu, Gauge, Laptop, Phone, Star, Wrench } from "lucide-react";
import DiagonalPanel from "@/components/DiagonalPanel";
import { GearIcon } from "@/components/Logo";
import { Icon } from "@/components/ui/Icon";
import { LinkButton, Photo, SectionHeading, StripeBackground } from "@/components/ui/primitives";
import { formatZAR, telHref } from "@/lib/utils";
import type { HeroContent, Service, SiteSettings, Special, Testimonial, Vehicle } from "@/lib/types";

type VehicleWithImg = Vehicle & { _img: string };
import { imageForSource } from "@/lib/image-source";

export function HomeHero({ hero, settings }: { hero: HeroContent; settings: SiteSettings }) {
  const bg = imageForSource(hero.backgroundImage, 1920) ?? (hero as { photo?: string }).photo ?? "/api/art/hero?c=343a4c";
  const primaryHref = !hero.ctaPrimary?.href || hero.ctaPrimary.href === "tel" ? telHref(settings.phones[0]) : hero.ctaPrimary.href;
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <StripeBackground className="opacity-60" />
      <div className="relative md:min-h-[31rem]">
        {/* Phones: the photo fills the whole hero with the text laid over it. Desktop: photo on the right with a diagonal cut. */}
        <DiagonalPanel side="left" cut="16%" className="absolute inset-0 md:left-auto md:w-[68%]">
          <Photo src={bg} priority sizes="(min-width:768px) 70vw, 100vw" className="object-cover object-[68%_center] md:object-right" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/40 md:to-transparent" />
          <GearIcon className="absolute right-10 top-10 hidden h-52 w-52 text-white/[0.07] md:block" />
        </DiagonalPanel>
        <div className="relative mx-auto flex min-h-[36rem] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 md:block md:min-h-0 md:py-20">
          <h1 className="max-w-xl font-display text-5xl font-bold uppercase italic leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
            <span className="block">{hero.headline}</span>
            <span className="block text-brand-red">{hero.headlineAccent}</span>
          </h1>
          {!!hero.brands?.length && <p className="mt-5 text-sm font-medium text-white">{hero.brands.join(" • ")}</p>}
          {hero.subhead && <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">{hero.subhead}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href={primaryHref}>
              <Phone className="h-4 w-4" />
              <span className="text-left leading-tight">
                {hero.ctaPrimary?.label ?? "Call Now"}
                <br />
                <span className="text-[11px] font-semibold">{settings.phones[0]}</span>
              </span>
            </LinkButton>
            <LinkButton href={hero.ctaSecondary?.href ?? "/contact"} variant="outline">
              {hero.ctaSecondary?.label ?? "Get a Quote"} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  { Icon: Wrench, title: "Servicing & Repairs", sub: "All makes & models" },
  { Icon: Cog, title: "Engine Overhauling", sub: "Builds & rebuilds" },
  { Icon: Gauge, title: "Performance Upgrades", sub: "More power, more control" },
  { Icon: Laptop, title: "Diagnostics", sub: "Advanced fault finding" },
  { Icon: Cpu, title: "Engine Management", sub: "Installation & tuning" },
];

export function FeatureStrip() {
  return (
    <section className="border-y border-ink-line2 bg-ink-deep">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-6 md:grid-cols-3 lg:grid-cols-5">
        {features.map(({ Icon: I, title, sub }) => (
          <div key={title} className="flex items-center gap-3 lg:border-r lg:border-ink-line2 lg:last:border-0">
            <I className="h-9 w-9 shrink-0 text-brand-red" aria-hidden />
            <p className="text-[11px] font-semibold uppercase leading-snug tracking-wider">
              {title}
              <br />
              <span className="font-normal normal-case text-muted">{sub}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedBuilds({ vehicles }: { vehicles: VehicleWithImg[] }) {
  return (
    <section className="bg-ink py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading white="Cars We" red="Work On" sub="Servicing, repairs and builds on all makes and models." />
          <Link
            href="/gallery"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-red hover:underline"
          >
            See our gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {vehicles.slice(0, 6).map((v) => (
            <article key={v._id} className="overflow-hidden rounded-2xl border border-ink-line2 bg-ink-panel">
              <div className="relative aspect-[4/3]">
                <Photo src={v._img} alt={v.title} sizes="(min-width:1024px) 16vw, (min-width:768px) 30vw, 50vw" />
              </div>
              <div className="p-3">
                <h3 className="break-words font-display text-base font-bold uppercase leading-tight">{v.title}</h3>
                {v.tagline && <p className="mt-0.5 text-xs text-muted">{v.tagline}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Link
      href="/services"
      className="group flex flex-col gap-3 rounded-2xl border border-ink-line2 bg-ink-panel p-5 transition-all hover:-translate-y-1 hover:border-brand-red/70 hover:shadow-[0_0_24px_rgba(230,0,18,0.25)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-red/15 text-brand-red">
        <Icon name={s.iconName} className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg font-bold uppercase leading-tight">{s.title}</h3>
      {s.shortDescription && <p className="text-sm text-muted">{s.shortDescription}</p>}
      <span className="mt-auto flex items-center justify-between pt-2 text-sm">
        <span className="font-semibold text-brand-red">{s.priceFrom ? `From ${formatZAR(s.priceFrom)}` : (s.priceNote ?? "")}</span>
        <ArrowRight className="h-4 w-4 text-brand-red transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            white="Our"
            red="Services"
            sub="From routine maintenance to high-performance builds, we have the expertise and equipment to get the job done."
          />
          <Link
            href="/services"
            className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-red hover:underline sm:flex"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s._id} s={s} />
          ))}
        </div>
        <LinkButton href="/services" variant="outline" className="mt-8 sm:hidden">
          View all services
        </LinkButton>
      </div>
    </section>
  );
}

export function SpecialsBanner({ specials }: { specials: Special[] }) {
  if (!specials.length) return null;
  return (
    <section className="bg-brand-red py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-display text-3xl font-bold uppercase">Current Specials</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {specials.map((s) => {
            const img = imageForSource(s.image, 400);
            return (
              <article key={s._id} className="flex overflow-hidden rounded-2xl bg-ink">
                {img && (
                  <div className="relative w-32 shrink-0 sm:w-44">
                    <Photo src={img} sizes="180px" />
                  </div>
                )}
                <div className="p-5">
                  {s.discountText && <p className="font-display text-2xl font-bold text-brand-red">{s.discountText}</p>}
                  <h3 className="font-display text-xl font-semibold uppercase">{s.title}</h3>
                  {s.description && <p className="mt-1 text-sm text-white/80">{s.description}</p>}
                  {s.validUntil && (
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted">
                      Valid until {new Date(s.validUntil).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                  {s.ctaHref && (
                    <LinkButton href={s.ctaHref} size="sm" className="mt-3">
                      {s.ctaLabel ?? "Learn more"}
                    </LinkButton>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-ink py-14">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading white="Happy" red="Customers" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.slice(0, 3).map((t) => (
            <figure key={t._id} className="rounded-2xl border border-ink-line2 bg-ink-panel p-6">
              <div className="flex gap-0.5 text-brand-red" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/85">&ldquo;{t.message}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {t.name} {t.vehicle && <span className="font-normal text-muted">· {t.vehicle}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaStrip({ phone }: { phone: string }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-ink-line2 bg-ink-deep py-12">
      <StripeBackground className="opacity-50" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Ready to <span className="text-brand-red">book?</span>
          </h2>
          <p className="mt-2 text-sm text-white/80">Call us or send an enquiry and we&apos;ll get back to you quickly.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={telHref(phone)}>
            <Phone className="h-4 w-4" /> Call {phone}
          </LinkButton>
          <LinkButton href="/contact" variant="outline">
            Send an enquiry <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

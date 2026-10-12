import { telHref, type SiteContent } from "@/lib/content";
import { GearIcon } from "./Logo";
import { Arrow, Phone, Shield, Gear, Wrench, Gauge } from "./Icons";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";

const features = [
  { icon: Shield, title: "Quality workmanship", sub: "Guaranteed" },
  { icon: Gear, title: "Engine management", sub: "Dictator · Sustech · Spitronics · Powermods" },
  { icon: Wrench, title: "Expert technicians", sub: "Minor to major repairs" },
  { icon: Gauge, title: "Performance", sub: "& reliability" },
];

export default function Hero({ hero, settings }: { hero: SiteContent["hero"]; settings: SiteContent["settings"] }) {
  const words = hero.headline.split(" ");
  const half = Math.ceil(words.length / 2);
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink">
      <div className="relative">
      {/* photo: stacked on top on phones, right side with a diagonal cut on desktop */}
      <div className="relative h-64 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[68%]">
        <DiagonalPanel side="left" cut="16%" className="absolute inset-0">
          <Photo image={hero.backgroundImage} fallback="/art/hero.svg" priority width={1920} className="object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </DiagonalPanel>
        <GearIcon className="absolute right-6 top-6 hidden h-44 w-44 text-white/[0.06] md:block" />
      </div>
      <div className="pointer-events-none absolute -bottom-6 right-0 hidden h-28 w-56 bg-brand-red md:block [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 md:pb-24 md:pt-24">
        <Reveal>
          <p className="eyebrow">Silverton, Pretoria</p>
          <h1 className="display mt-4 max-w-xl text-5xl sm:text-6xl lg:text-7xl">
            <span className="block">{words.slice(0, half).join(" ")}</span>
            {words.length > 1 && <span className="block text-brand-red">{words.slice(half).join(" ")}</span>}
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/90">{hero.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telHref(settings.phoneNumbers[0])} className="btn btn-red">
              <Phone className="h-5 w-5" />
              <span className="text-left leading-tight">Call Now<br /><span className="text-[11px] font-semibold">{settings.phoneNumbers[0]}</span></span>
            </a>
            <a href="/contact" className="btn btn-outline">
              Get a Quote <Arrow className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>

      </div>

      <div className="relative border-t border-white/10 bg-ink-deep/90">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-4 py-6 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 lg:border-r lg:border-white/10 lg:last:border-0">
              <f.icon className="h-10 w-10 shrink-0 text-brand-red" />
              <p className="text-[10px] font-semibold uppercase leading-snug tracking-wider">
                {f.title}
                <br />
                <span className="text-white/70">{f.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { SiteContent } from "@/lib/content";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { Gear, Shield, Wrench } from "./Icons";

const points = [
  { icon: Wrench, title: "Minor to major", sub: "Services, overhauls and conversions" },
  { icon: Gear, title: "Engine management", sub: "Dictator, Sustech, Spitronics, Powermods" },
  { icon: Shield, title: "Done right", sub: "Honest work, quality workmanship" },
];

export default function About({ settings }: { settings: SiteContent["settings"] }) {
  return (
    <section id="about" className="relative overflow-hidden bg-ink">
      <div className="relative min-h-[34rem]">
        <DiagonalPanel side="left" cut="16%" className="relative h-52 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[55%]">
          <Photo fallback="/art/workshop.svg" alt="" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
        </DiagonalPanel>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-brand-red md:block [clip-path:polygon(0_0,55%_0,0_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 className="section-title mt-2">
              About <span className="text-brand-red">Us</span>
            </h2>
            <p className="mt-5 max-w-md whitespace-pre-line leading-relaxed text-white/90">{settings.about}</p>
            <ul className="mt-8 space-y-5">
              {points.map((p) => (
                <li key={p.title} className="flex items-center gap-4">
                  <p.icon className="h-9 w-9 shrink-0 text-brand-red" />
                  <p className="text-[11px] font-semibold uppercase leading-snug tracking-wider">
                    {p.title}
                    <br />
                    <span className="text-white/70">{p.sub}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

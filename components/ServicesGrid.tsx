"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Service } from "@/lib/content";
import { Arrow, serviceIcon } from "./Icons";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";

// Flyer crops used until a service gets its own photo in the CMS.
const fallbackFor = (t: string) => {
  const s = t.toLowerCase();
  if (s.includes("clutch")) return "/art/clutch.svg";
  if (s.includes("diagnos")) return "/art/diagnostics.svg";
  if (s.includes("suspension")) return "/art/suspension.svg";
  if (s.includes("overhaul") || s.includes("conversion") || s.includes("modif")) return "/art/engine.svg";
  return "/art/workshop.svg";
};

export default function ServicesGrid({ services, children }: { services: Service[]; children?: ReactNode }) {
  return (
    <section id="services" className="relative overflow-hidden bg-ink">
      {/* header band */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-48 bg-brand-red md:block [clip-path:polygon(0_0,55%_0,0_100%)]" />
        <DiagonalPanel side="left" cut="18%" className="relative h-44 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[55%]">
          <Photo fallback="/art/engine.svg" alt="" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
        </DiagonalPanel>
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 md:pb-14 md:pt-16">
          <Reveal>
            <p className="eyebrow">Our Services</p>
            <h2 className="section-title mt-2">
              Professional
              <br />
              <span className="text-brand-red">Auto Services</span>
            </h2>
            <p className="mt-4 max-w-sm text-white/90">
              Expert care for your car. Performance, reliability and peace of mind.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.a
              key={s._id}
              href="/contact"
              className="card group flex flex-col"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative h-28 w-full border-b border-brand-red/40">
                <Photo image={s.image} fallback={fallbackFor(s.title)} width={600} label="Add photo in Studio" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-brand-red">{serviceIcon(s.title, "h-7 w-7")}</span>
                  <h3 className="text-sm font-bold leading-tight">{s.title}</h3>
                </div>
                {s.description && <p className="mt-2 pl-10 text-xs leading-snug text-white/70">{s.description}</p>}
                <Arrow className="mt-3 h-4 w-4 self-end text-brand-red transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
          {children}
        </div>
      </div>
    </section>
  );
}

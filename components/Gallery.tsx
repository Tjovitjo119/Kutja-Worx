"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/lib/content";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";

const baseCats = ["Engine Builds", "Suspension", "Diagnostics", "Workshop"];

export default function Gallery({ items }: { items: SiteContent["gallery"] }) {
  const extra = items.map((i) => i.category).filter((c): c is string => !!c && !baseCats.includes(c));
  const cats = Array.from(new Set([...baseCats, ...extra]));
  const [active, setActive] = useState("All");
  const [page, setPage] = useState(0);
  const PER = 8;
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice(page * PER, page * PER + PER);
  const feature = items.find((i) => i.image) ?? items[4] ?? items[0];

  return (
    <section id="gallery" className="relative overflow-hidden bg-ink-deep">
      {/* header band with feature photo */}
      <div className="relative">
        <DiagonalPanel side="left" cut="18%" className="relative h-44 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
          <Photo image={feature?.image} fallback={feature?.src ?? "/art/lift.svg"} width={1600} className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/40 to-transparent" />
        </DiagonalPanel>
        <div className="pointer-events-none absolute inset-y-0 right-[52%] hidden w-24 bg-brand-red md:block [clip-path:polygon(60%_0,100%_0,40%_100%,0_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 md:pb-10 md:pt-14">
          <Reveal>
            <p className="eyebrow">Our Gallery</p>
            <h2 className="section-title mt-2">
              Builds <span className="text-brand-red">&amp; Work</span>
            </h2>
            <p className="mt-4 max-w-sm text-white/90">From stock to fully modified. See some of our recent work and custom builds.</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
        <div className="flex flex-wrap gap-2">
          {["All", ...cats].map((c) => (
            <button
              key={c}
              onClick={() => { setActive(c); setPage(0); }}
              className={`px-5 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                active === c ? "bg-brand-red" : "border border-white/20 hover:border-brand-red"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {shown.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {shown.map((g, i) => (
              <motion.figure
                key={g._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
                className={`group relative overflow-hidden border border-brand-red/70 bg-ink-panel aspect-[4/3]`}
              >
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}>
                  <Photo image={g.image} fallback={g.src} alt={g.caption || "Kutja Worx workshop"} width={900} label="Your photo here" className="object-cover" />
                </motion.div>
                {g.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-[10px] font-semibold uppercase tracking-wider">
                    {g.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-dashed border-white/20 p-8 text-center text-white/60">No photos in this category yet.</p>
        )}
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`} className={`h-8 w-8 rounded-full text-xs font-bold ${i === page ? "bg-brand-red" : "border border-white/30"}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

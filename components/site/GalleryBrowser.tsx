"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { Photo } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/types";

export type GalleryWithImg = GalleryImage & { _img: string; _full: string };
const chips = ["All", "BMW", "VW", "Mercedes", "Ford", "Other"];
const PER = 12;

export default function GalleryBrowser({ items }: { items: GalleryWithImg[] }) {
  const { data: session } = useSession();
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(-1);
  const filtered = cat === "All" ? items : items.filter((i) => i.category === cat);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice(page * PER, page * PER + PER);

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  setPage(0);
                }}
                aria-pressed={cat === c}
                className={cn(
                  "rounded-md px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors",
                  cat === c ? "bg-brand-red" : "border border-ink-line2 hover:border-brand-red",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          {session?.user && (
            <Link
              href="/admin/gallery/new"
              className="flex items-center gap-2 rounded-md border border-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-red hover:bg-brand-red hover:text-white"
            >
              <Upload className="h-4 w-4" /> Upload Photos
            </Link>
          )}
        </div>

        {shown.length ? (
          <div className="mt-6 columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
            {shown.map((g, i) => (
              <button
                key={g._id}
                onClick={() => setOpen(page * PER + i)}
                aria-label={`Open ${g.caption || "photo"}`}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-ink-line2 hover:border-brand-red"
              >
                <div className={cn("relative", i % 5 === 0 ? "aspect-[3/4]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/3]")}>
                  <Photo
                    src={g._img}
                    alt={g.caption || "Kutja Worx workshop"}
                    className="transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width:1024px) 25vw, 50vw"
                  />
                </div>
                {g.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-left text-[11px] font-semibold uppercase tracking-wider">
                    {g.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-lg border border-dashed border-ink-line2 p-10 text-center text-muted">
            No photos in this category yet.
          </p>
        )}

        {pages > 1 && (
          <nav aria-label="Gallery pages" className="mt-8 flex items-center justify-center gap-2">
            <button
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded p-2 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-current={i === page}
                className={cn(
                  "h-9 w-9 rounded-full text-sm font-bold",
                  i === page ? "bg-brand-red" : "border border-ink-line2 hover:border-brand-red",
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={page === pages - 1}
              onClick={() => setPage(page + 1)}
              className="rounded p-2 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        )}
      </div>
      <Lightbox open={open >= 0} index={open} close={() => setOpen(-1)} slides={filtered.map((g) => ({ src: g._full, alt: g.caption }))} />
    </section>
  );
}

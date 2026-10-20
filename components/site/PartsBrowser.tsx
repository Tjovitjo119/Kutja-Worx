"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, FilePlus2 } from "lucide-react";
import { Photo } from "@/components/ui/primitives";
import { useCart } from "./CartProvider";
import { cn, formatZAR } from "@/lib/utils";
import type { Category, Part } from "@/lib/types";

export type PartWithImg = Part & { _img: string };

export default function PartsBrowser({ parts, categories }: { parts: PartWithImg[]; categories: Category[] }) {
  const { add } = useCart();
  const [cat, setCat] = useState("All Parts");
  const [q, setQ] = useState("");
  const shown = parts.filter(
    (p) =>
      (cat === "All Parts" || p.category === cat) &&
      (!q || `${p.title} ${p.brand ?? ""} ${p.sku ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  const menu = ["All Parts", ...categories.map((c) => c.title)];

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
        <aside>
          <h2 className="mb-3 font-display text-lg font-bold uppercase">
            Parts <span className="text-brand-red">Categories</span>
          </h2>
          <nav aria-label="Parts categories" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {menu.map((m) => (
              <button
                key={m}
                onClick={() => setCat(m)}
                aria-pressed={cat === m}
                className={cn(
                  "shrink-0 rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors",
                  cat === m ? "bg-brand-red text-white" : "bg-ink-panel text-white/80 hover:bg-white/10",
                )}
              >
                {m}
              </button>
            ))}
          </nav>
        </aside>
        <div>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <label htmlFor="part-search" className="sr-only">
              Search parts
            </label>
            <input
              id="part-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search parts…"
              className="w-full rounded-md border border-ink-line2 bg-ink-panel py-2.5 pl-9 pr-3 text-sm placeholder:text-white/40 focus:border-brand-red focus:outline-none"
            />
          </div>
          {shown.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {shown.map((p) => (
                <article
                  key={p._id}
                  className="group overflow-hidden rounded-2xl border border-ink-line2 bg-ink-panel transition-colors hover:border-brand-red/70"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Photo
                      src={p._img}
                      alt={p.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width:1024px) 22vw, 50vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-base font-bold uppercase leading-tight">{p.title}</h3>
                    {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
                    <p className="mt-1 text-sm font-semibold text-brand-red">{formatZAR(p.price)}</p>
                    <button
                      onClick={() => add({ id: p._id, title: p.title, price: p.price })}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2 font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-dark"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-ink-line2 p-10 text-center text-muted">No parts match your search.</p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-line2 bg-ink-panel p-5">
            <div className="flex items-center gap-3">
              <FilePlus2 className="h-8 w-8 text-brand-red" />
              <div>
                <h3 className="font-display text-lg font-bold uppercase">Request Custom Part</h3>
                <p className="text-sm text-muted">Can&apos;t find what you need? Contact us and we&apos;ll source it for you.</p>
              </div>
            </div>
            <Link
              href="/contact?service=Custom%20part"
              className="rounded-md border border-white/60 px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider hover:border-brand-red hover:text-brand-red"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

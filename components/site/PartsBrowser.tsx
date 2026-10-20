"use client";

import { useState } from "react";
import Link from "next/link";
import { FilePlus2, Search, ShoppingCart } from "lucide-react";
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
    <section className="bg-ink py-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
        <aside className="min-w-0">
          <h2 className="mb-3 hidden font-display text-lg font-bold uppercase lg:block">
            Parts <span className="text-brand-red">Categories</span>
          </h2>
          {/* phones: a dropdown; desktop: a vertical list */}
          <div className="lg:hidden">
            <label htmlFor="part-cat" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              Category
            </label>
            <select
              id="part-cat"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-lg border border-ink-line2 bg-ink-panel px-4 py-3 text-sm font-medium text-white focus:border-brand-red focus:outline-none"
            >
              {menu.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <nav aria-label="Parts categories" className="hidden flex-col gap-2 lg:flex">
            {menu.map((m) => (
              <button
                key={m}
                onClick={() => setCat(m)}
                aria-pressed={cat === m}
                className={cn(
                  "rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors",
                  cat === m ? "bg-brand-red text-white" : "bg-ink-panel text-white/80 hover:bg-white/10",
                )}
              >
                {m}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
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
              className="w-full rounded-md border border-ink-line2 bg-ink-panel py-3 pl-9 pr-3 text-sm placeholder:text-white/40 focus:border-brand-red focus:outline-none"
            />
          </div>

          {shown.length ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (
                <article
                  key={p._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink-line2 bg-ink-panel transition-colors hover:border-brand-red/70"
                >
                  <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                    <Photo
                      src={p._img}
                      alt={p.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width:1280px) 22vw, (min-width:480px) 45vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="break-words font-display text-lg font-bold uppercase leading-tight">{p.title}</h3>
                    {p.brand && <p className="mt-0.5 text-xs text-muted">{p.brand}</p>}
                    <p className="mt-2 text-base font-semibold text-brand-red">{formatZAR(p.price)}</p>
                    <button
                      onClick={() => add({ id: p._id, title: p.title, price: p.price })}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2.5 font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-dark"
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

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-ink-line2 bg-ink-panel p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FilePlus2 className="mt-0.5 h-7 w-7 shrink-0 text-brand-red" />
              <div>
                <h3 className="font-display text-lg font-bold uppercase">Request Custom Part</h3>
                <p className="text-sm text-muted">Can&apos;t find what you need? Contact us and we&apos;ll source it for you.</p>
              </div>
            </div>
            <Link
              href="/contact?service=Custom%20part"
              className="rounded-md border border-white/60 px-5 py-3 text-center font-display text-sm font-semibold uppercase tracking-wider hover:border-brand-red hover:text-brand-red"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

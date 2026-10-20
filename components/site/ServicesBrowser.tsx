"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/primitives";
import { PriceTable, groupPrices, priceText } from "./PriceTables";
import { cn, formatZAR } from "@/lib/utils";
import type { Category, PriceListItem, Service } from "@/lib/types";

export default function ServicesBrowser({
  services,
  categories,
  prices,
  initialTab = "services",
}: {
  services: Service[];
  categories: Category[];
  prices: PriceListItem[];
  initialTab?: "services" | "price";
}) {
  const [tab, setTab] = useState<"services" | "price">(initialTab);
  const [cat, setCat] = useState("All Services");
  const shown = cat === "All Services" ? services : services.filter((s) => s.category === cat);
  const menu = ["All Services", ...categories.map((c) => c.title)];

  const tabBtn = (id: "services" | "price", label: string) => (
    <button
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={cn(
        "flex-1 rounded-md px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider sm:flex-none sm:px-6",
        tab === id ? "bg-brand-red" : "border border-ink-line2 text-white/80 hover:border-brand-red",
      )}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-ink py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div role="tablist" className="mb-6 flex gap-2">
          {tabBtn("services", "Services")}
          {tabBtn("price", "Price List")}
        </div>

        {tab === "services" ? (
          <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
            {/* phones: a dropdown; desktop: a vertical list */}
            <div className="lg:hidden">
              <label htmlFor="svc-cat" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Category
              </label>
              <select
                id="svc-cat"
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
            <nav aria-label="Service categories" className="hidden flex-col gap-2 lg:flex">
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

            <div className="grid min-w-0 gap-3">
              {shown.length === 0 && (
                <p className="rounded-lg border border-dashed border-ink-line2 p-8 text-center text-muted">
                  No services in this category yet.
                </p>
              )}
              {shown.map((s) => (
                <article
                  key={s._id}
                  className="rounded-xl border border-ink-line2 bg-ink-panel p-4 transition-colors hover:border-brand-red/70 sm:flex sm:items-center sm:gap-4"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/15 text-brand-red sm:h-14 sm:w-14">
                      <Icon name={s.iconName} className="h-6 w-6 sm:h-7 sm:w-7" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="break-words font-display text-lg font-bold uppercase leading-tight">{s.title}</h3>
                      {s.shortDescription && <p className="mt-1 text-sm leading-snug text-muted">{s.shortDescription}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-line pt-3 sm:mt-0 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <p className="text-sm font-semibold text-brand-red">
                      {s.priceFrom ? `From ${formatZAR(s.priceFrom)}` : (s.priceNote ?? "Quote on request")}
                    </p>
                    <Link
                      href={`/contact?service=${encodeURIComponent(s.title)}`}
                      className="rounded-md bg-brand-red px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-dark"
                    >
                      Book Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {groupPrices(prices).map(([group, rows]) => (
              <PriceTable
                key={group}
                title={group}
                rows={rows.map((r) => ({ name: r.name, description: r.description, price: priceText(r) }))}
              />
            ))}
            <div className="mt-2 flex flex-col gap-4 rounded-lg border border-ink-line2 bg-ink-panel p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-sm text-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> Prices are estimates and may vary depending on the car and parts
                used.
              </p>
              <LinkButton href="/contact?service=Quote">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

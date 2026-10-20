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
        "rounded-md px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-wider",
        tab === id ? "bg-brand-red" : "border border-ink-line2 text-white/80 hover:border-brand-red",
      )}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div role="tablist" className="mb-6 flex gap-2">
          {tabBtn("services", "Services")}
          {tabBtn("price", "Price List")}
        </div>

        {tab === "services" ? (
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <nav aria-label="Service categories" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
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
            <div className="grid gap-3">
              {shown.length === 0 && (
                <p className="rounded-lg border border-dashed border-ink-line2 p-8 text-center text-muted">
                  No services in this category yet.
                </p>
              )}
              {shown.map((s) => (
                <article
                  key={s._id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-ink-line2 bg-ink-panel p-4 transition-colors hover:border-brand-red/70"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-red/15 text-brand-red">
                    <Icon name={s.iconName} className="h-7 w-7" />
                  </span>
                  <div className="min-w-[12rem] flex-1">
                    <h3 className="font-display text-lg font-bold uppercase leading-tight">{s.title}</h3>
                    {s.shortDescription && <p className="mt-0.5 text-sm text-muted">{s.shortDescription}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-red">
                      {s.priceFrom ? `From ${formatZAR(s.priceFrom)}` : (s.priceNote ?? "Quote on request")}
                    </p>
                  </div>
                  <Link
                    href={`/contact?service=${encodeURIComponent(s.title)}`}
                    className="rounded-md bg-brand-red px-5 py-2 font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-dark"
                  >
                    Book Now
                  </Link>
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
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ink-line2 bg-ink-panel p-4">
              <p className="flex items-center gap-2 text-sm text-muted">
                <Info className="h-4 w-4 text-brand-red" /> Prices are estimates and may vary depending on the car and parts used.
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

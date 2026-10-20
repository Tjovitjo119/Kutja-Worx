"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/primitives";
import { PriceTable, groupPrices, priceText } from "./PriceTables";
import { cn, formatZAR } from "@/lib/utils";
import type { Part, PriceListItem } from "@/lib/types";

export default function PriceListBrowser({ prices, parts }: { prices: PriceListItem[]; parts: Part[] }) {
  const [tab, setTab] = useState<"services" | "parts">("services");
  const tabs: [typeof tab, string][] = [
    ["services", "Services"],
    ["parts", "Parts"],
  ];

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div role="tablist" className="mb-6 flex gap-2">
          {tabs.map(([id, label]) => (
            <button
              key={id}
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
          ))}
        </div>

        {tab === "services" &&
          groupPrices(prices).map(([g, rows]) => (
            <PriceTable key={g} title={g} rows={rows.map((r) => ({ name: r.name, description: r.description, price: priceText(r) }))} />
          ))}
        {tab === "parts" && (
          <PriceTable
            title="Parts"
            rows={parts.map((p) => ({
              name: p.title,
              description: [p.category, p.brand].filter(Boolean).join(" · "),
              price: formatZAR(p.price),
            }))}
          />
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ink-line2 bg-ink-panel p-4">
          <p className="text-sm text-muted">Prices are estimates and may vary depending on the car, condition and parts used.</p>
          <LinkButton href="/contact?service=Quote">
            Request Custom Quote <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

import { formatZAR } from "@/lib/utils";
import type { PriceListItem } from "@/lib/types";

export const th = "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted";
export const td = "px-4 py-2.5 text-sm";

type Row = { name: string; description?: string; price: string };

/** Stacked cards on phones (no sideways scrolling), a normal table from sm up. */
export function PriceTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="mb-8">
      <h3 className="mb-3 font-display text-lg font-bold uppercase text-brand-red">{title}</h3>

      <ul className="space-y-2 sm:hidden">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start justify-between gap-4 rounded-xl border border-ink-line2 bg-ink-panel p-4">
            <div className="min-w-0">
              <p className="break-words font-semibold leading-snug">{r.name}</p>
              {r.description && <p className="mt-0.5 break-words text-sm text-muted">{r.description}</p>}
            </div>
            <p className="shrink-0 text-right font-display text-lg font-bold text-brand-red">{r.price}</p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-lg border border-ink-line2 sm:block">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className={th}>Service</th>
              <th className={th}>Description</th>
              <th className={`${th} text-right`}>Price (ZAR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line">
            {rows.map((r, i) => (
              <tr key={i} className="bg-ink-panel/60">
                <td className={`${td} font-medium`}>{r.name}</td>
                <td className={`${td} text-muted`}>{r.description}</td>
                <td className={`${td} text-right font-semibold`}>{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const priceText = (p: PriceListItem) => (p.priceTo ? `${formatZAR(p.priceFrom)} - ${formatZAR(p.priceTo)}` : formatZAR(p.priceFrom));

export function groupPrices(items: PriceListItem[]) {
  const groups = new Map<string, PriceListItem[]>();
  for (const i of items) groups.set(i.group || "Other", [...(groups.get(i.group || "Other") ?? []), i]);
  return [...groups.entries()];
}

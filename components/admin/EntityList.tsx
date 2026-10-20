"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, Eye, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { entityByKey, type ColumnDef, type EntityDef } from "@/lib/admin-config";
import { artFor } from "@/lib/art";
import { urlFor } from "@/sanity/lib/image";
import { sanityConfigured } from "@/sanity/env";
import { cn, formatZAR, slugify } from "@/lib/utils";
import { AButton, ALink, PageHeader, StatusBadge, inputCls } from "./ui";

const PER = 10;
const publicLink = (e: EntityDef, d: any) =>
  e.type === "vehicle"
    ? `/cars/${d.slug}`
    : ({ part: "/parts", service: "/services", priceListItem: "/price-list", galleryImage: "/gallery" }[e.type as string] ?? null);

function thumb(e: EntityDef, d: any) {
  const img = d.image ?? d.images?.[0];
  if (img?.asset?._ref && sanityConfigured) return urlFor(img).width(96).height(72).fit("crop").url();
  return e.imageType ? artFor(e.imageType, d) : null;
}

function Cell({ e, c, d }: { e: EntityDef; c: ColumnDef; d: any }) {
  const v = d[c.field];
  if (c.kind === "image") {
    const src = thumb(e, d);
    return (
      <div className="flex items-center gap-3">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-9 w-12 rounded object-cover" />
        )}
        <span className="font-medium">{d[e.titleField] || "Untitled"}</span>
      </div>
    );
  }
  if (c.kind === "price") return <>{v ? formatZAR(v) : <span className="text-gray-400">-</span>}</>;
  if (c.kind === "date")
    return (
      <>
        {v ? (
          new Date(v).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </>
    );
  if (c.kind === "status") {
    const s = e.status ? e.status(d) : { label: String(v ?? ""), tone: "muted" as const };
    return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>;
  }
  return <>{v ?? <span className="text-gray-400">-</span>}</>;
}

export default function EntityList({ entityKey }: { entityKey: string }) {
  const entity = entityByKey(entityKey)!;
  const [docs, setDocs] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [del, setDel] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/${entityKey}`)
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setDocs(d.docs)))
      .catch(() => setError("Could not load"));
  }, [entityKey]);
  useEffect(load, [load]);

  const filterCol = entity.columns.find((c, i) => i > 0 && (!c.kind || c.kind === "text"));
  const filterOpts = useMemo(
    () => (filterCol && docs ? Array.from(new Set(docs.map((d) => d[filterCol.field]).filter(Boolean))) : []),
    [docs, filterCol],
  );

  const filtered = useMemo(() => {
    if (!docs) return [];
    const fields = entity.searchFields ?? [entity.titleField];
    return docs
      .filter(
        (d) =>
          !q ||
          fields.some((f) =>
            String(d[f] ?? "")
              .toLowerCase()
              .includes(q.toLowerCase()),
          ),
      )
      .filter((d) => !filter || !filterCol || d[filterCol.field] === filter)
      .sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || (b._updatedAt ?? "").localeCompare(a._updatedAt ?? ""));
  }, [docs, q, filter, filterCol, entity]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const rows = filtered.slice(page * PER, page * PER + PER);

  async function remove() {
    if (!del) return;
    setBusy(true);
    const res = await fetch(`/api/admin/${entityKey}/${del._id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) setError(data.error || "Could not delete");
    setDel(null);
    load();
  }

  async function duplicate(d: any) {
    const copy: any = { ...d, [entity.titleField]: `${d[entity.titleField] ?? ""} (copy)` };
    if (entity.fields.some((f) => f.name === "slug"))
      copy.slug = slugify(`${copy[entity.titleField]}-${Math.random().toString(36).slice(2, 5)}`);
    delete copy.password;
    const res = await fetch(`/api/admin/${entityKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setError(data.error || "Could not duplicate");
    load();
  }

  return (
    <>
      <PageHeader title={entity.label} sub={entity.hint ?? `Manage your ${entity.label.toLowerCase()}.`}>
        <ALink href={`/admin/${entityKey}/new`}>
          <Plus className="h-4 w-4" /> Add New
        </ALink>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="list-search" className="sr-only">
            Search
          </label>
          <input
            id="list-search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder={`Search ${entity.label.toLowerCase()}…`}
            className={cn(inputCls, "pl-9")}
          />
        </div>
        {filterCol && filterOpts.length > 0 && (
          <select
            aria-label={`Filter by ${filterCol.label}`}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
            className={cn(inputCls, "w-auto min-w-[10rem]")}
          >
            <option value="">All {filterCol.label.toLowerCase()}s</option>
            {filterOpts.map((o) => (
              <option key={String(o)} value={String(o)}>
                {String(o)}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {entity.columns.map((c) => (
                <th key={c.label} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!docs && (
              <tr>
                <td colSpan={entity.columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {docs && rows.length === 0 && (
              <tr>
                <td colSpan={entity.columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50">
                {entity.columns.map((c) => (
                  <td key={c.label} className="px-4 py-3">
                    <Cell e={entity} c={c} d={d} />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 text-gray-500">
                    {publicLink(entity, d) && (
                      <Link
                        href={publicLink(entity, d)!}
                        target="_blank"
                        aria-label="View on site"
                        className="rounded p-1.5 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/${entityKey}/${d._id}`}
                      aria-label={`Edit ${d[entity.titleField] ?? ""}`}
                      className="rounded p-1.5 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {entity.type !== "user" && (
                      <button
                        aria-label="Duplicate"
                        onClick={() => duplicate(d)}
                        className="rounded p-1.5 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      aria-label={`Delete ${d[entity.titleField] ?? ""}`}
                      onClick={() => setDel(d)}
                      className="rounded p-1.5 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </span>
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="rounded p-1.5 hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>
              Page {page + 1} of {pages}
            </span>
            <button
              aria-label="Next page"
              disabled={page >= pages - 1}
              onClick={() => setPage(page + 1)}
              className="rounded p-1.5 hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {del && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">Delete {entity.singular.toLowerCase()}?</h2>
              <button onClick={() => setDel(null)} aria-label="Close">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              &ldquo;{del[entity.titleField] || "This item"}&rdquo; will be removed from the website. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <AButton variant="outline" onClick={() => setDel(null)}>
                Cancel
              </AButton>
              <AButton onClick={remove} disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete
              </AButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

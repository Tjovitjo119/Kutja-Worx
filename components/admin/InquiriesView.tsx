"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, Search, X } from "lucide-react";
import { AButton, PageHeader, StatusBadge, inputCls } from "./ui";
import { cn, telHref, timeAgo } from "@/lib/utils";

const statuses = ["new", "in-progress", "contacted", "closed"] as const;
const label = (s: string) => ({ new: "New", "in-progress": "In Progress", contacted: "Contacted", closed: "Closed" })[s] ?? s;
const tone = (s: string) =>
  (s === "new" ? "info" : s === "in-progress" ? "warn" : s === "contacted" ? "ok" : "muted") as "info" | "warn" | "ok" | "muted";
const sourceLabel: Record<string, string> = {
  contact: "Contact form",
  "parts-cart": "Parts quote",
  "vehicle-enquiry": "Car enquiry",
  quote: "Quote request",
};

export default function InquiriesView() {
  const [docs, setDocs] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setDocs(d.docs)))
      .catch(() => setError("Could not load inquiries"));
  }, []);
  useEffect(load, [load]);

  const rows = useMemo(
    () =>
      (docs ?? [])
        .filter((d) => !status || d.status === status)
        .filter(
          (d) =>
            !q || `${d.name} ${d.phone} ${d.email ?? ""} ${d.service ?? ""} ${d.message ?? ""}`.toLowerCase().includes(q.toLowerCase()),
        )
        .sort((a, b) => (b._createdAt ?? "").localeCompare(a._createdAt ?? "")),
    [docs, q, status],
  );

  async function patch(d: any, body: Record<string, any>) {
    setSaving(true);
    const res = await fetch(`/api/admin/inquiries/${d._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: d.status, notes: d.notes, ...body }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setOpen(data.doc);
      load();
    } else setError(data.error || "Could not update");
  }

  return (
    <>
      <PageHeader title="Inquiries" sub="Messages, quote requests and car enquiries from the website." />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="inq-search" className="sr-only">
            Search inquiries
          </label>
          <input
            id="inq-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search inquiries…"
            className={cn(inputCls, "pl-9")}
          />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={cn(inputCls, "w-auto min-w-[10rem]")}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!docs && (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" />
                </td>
              </tr>
            )}
            {docs && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No inquiries yet.
                </td>
              </tr>
            )}
            {rows.map((d) => (
              <tr
                key={d._id}
                onClick={() => {
                  setOpen(d);
                  setNotes(d.notes ?? "");
                }}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-gray-600">{d.service ?? d.relatedItem ?? sourceLabel[d.source] ?? "-"}</td>
                <td className="px-4 py-3 text-gray-500">{timeAgo(d._createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone(d.status)}>{label(d.status)}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-brand-red hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Inquiry details">
          <button className="absolute inset-0 bg-black/50" aria-label="Close" onClick={() => setOpen(null)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{open.name}</h2>
                <p className="text-xs text-gray-500">
                  {sourceLabel[open.source] ?? open.source} · {timeAgo(open._createdAt)}
                </p>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Close">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <a href={telHref(open.phone)} className="flex items-center gap-2 font-medium text-brand-red hover:underline">
                <Phone className="h-4 w-4" /> {open.phone}
              </a>
              {open.email && (
                <a href={`mailto:${open.email}`} className="flex items-center gap-2 text-gray-700 hover:underline">
                  <Mail className="h-4 w-4" /> {open.email}
                </a>
              )}
              {open.service && (
                <p>
                  <span className="text-gray-500">Service:</span> {open.service}
                </p>
              )}
              {open.relatedItem && (
                <p>
                  <span className="text-gray-500">Regarding:</span> {open.relatedItem}
                </p>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-800">{open.message}</p>
            <label htmlFor="inq-status" className="mt-5 text-sm font-medium">
              Status
            </label>
            <select
              id="inq-status"
              value={open.status}
              disabled={saving}
              onChange={(e) => patch(open, { status: e.target.value })}
              className={cn(inputCls, "mt-1")}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
            <label htmlFor="inq-notes" className="mt-4 text-sm font-medium">
              Internal notes
            </label>
            <textarea id="inq-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={cn(inputCls, "mt-1")} />
            <div className="mt-4 flex justify-end">
              <AButton onClick={() => patch(open, { notes })} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save notes
              </AButton>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

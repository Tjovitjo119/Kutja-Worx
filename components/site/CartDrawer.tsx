"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatZAR } from "@/lib/utils";
import { btn } from "@/components/ui/primitives";

export default function CartDrawer() {
  const { items, total, open, setOpen, setQty, remove, clear } = useCart();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/parts-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, items }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
      setState("sent");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setState("error");
    }
  }

  if (!open) return null;
  const field =
    "w-full rounded-md border border-white/15 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none";
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Parts quote cart">
      <button className="absolute inset-0 bg-black/70" aria-label="Close cart" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink-line2 bg-ink-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-line2 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
            <ShoppingCart className="h-5 w-5 text-brand-red" /> Parts <span className="text-brand-red">Quote</span>
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {state === "sent" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-display text-2xl font-bold uppercase text-brand-red">Request sent</p>
            <p className="text-sm text-white/80">Thanks! We&apos;ll contact you shortly with availability and a final price.</p>
            <button
              className={btn("outline", "sm")}
              onClick={() => {
                setState("idle");
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/70">Your quote list is empty. Add parts from the Parts page.</p>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-5">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 rounded-lg border border-ink-line2 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{i.title}</p>
                    <p className="text-xs text-brand-red">{formatZAR(i.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Decrease"
                      onClick={() => setQty(i.id, i.qty - 1)}
                      className="rounded border border-white/20 p-1 hover:border-brand-red"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button
                      aria-label="Increase"
                      onClick={() => setQty(i.id, i.qty + 1)}
                      className="rounded border border-white/20 p-1 hover:border-brand-red"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button aria-label={`Remove ${i.title}`} onClick={() => remove(i.id)} className="text-white/50 hover:text-brand-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={submit} className="space-y-2 border-t border-ink-line2 p-5">
              <p className="flex justify-between text-sm font-semibold">
                <span>Estimated total</span>
                <span className="text-brand-red">{formatZAR(total)}</span>
              </p>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <input name="name" required placeholder="Full name" aria-label="Full name" className={field} />
              <input name="phone" required type="tel" placeholder="Phone number" aria-label="Phone number" className={field} />
              <input name="email" type="email" placeholder="Email (optional)" aria-label="Email" className={field} />
              <button disabled={state === "sending"} className={btn("red") + " w-full disabled:opacity-60"}>
                {state === "sending" ? "Sending…" : "Send quote request"}
              </button>
              {state === "error" && <p className="text-xs text-brand-red">{error || "Something went wrong. Please call us."}</p>}
              <p className="text-[11px] text-white/50">No payment is taken online. We confirm stock and final pricing with you.</p>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}

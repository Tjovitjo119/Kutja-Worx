"use client";

import { useState } from "react";
import { Arrow } from "./Icons";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest">Send us a message</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className="field" aria-label="Full name" />
        <input name="phone" required type="tel" placeholder="Phone number" className="field" aria-label="Phone number" />
      </div>
      <input name="email" type="email" placeholder="Email address (optional)" className="field" aria-label="Email address" />
      <textarea name="message" required rows={4} placeholder="What do you need done? (car make, model, problem)" className="field" aria-label="Message" />
      <button type="submit" disabled={status === "sending"} className="btn btn-red w-full disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send Message"} <Arrow />
      </button>
      {status === "sent" && <p className="text-green-400">Thanks! We&apos;ll get back to you shortly.</p>}
      {status === "error" && <p className="text-brand-red">Something went wrong. Please call us instead.</p>}
    </form>
  );
}

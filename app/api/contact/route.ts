import { NextResponse } from "next/server";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // honeypot: bots fill this in, pretend success
  if (data.website) return NextResponse.json({ ok: true });

  const name = String(data.name || "").trim().slice(0, 100);
  const phone = String(data.phone || "").trim().slice(0, 30);
  const message = String(data.message || "").trim().slice(0, 2000);
  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error("Contact form: RESEND_API_KEY / CONTACT_TO_EMAIL not set");
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Kutja Worx <onboarding@resend.dev>",
      to: [to],
      subject: `New quote request from ${name}`,
      html: `<p><b>Name:</b> ${esc(name)}</p><p><b>Phone:</b> ${esc(phone)}</p><p><b>Email:</b> ${esc(String(data.email || "").slice(0, 120)) || "-"}</p><p><b>Message:</b><br>${esc(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", await res.text());
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createInquiry } from "./store";
import { notifyWorkshop } from "./email";
import { enquirySchema } from "./validation";
import type { Inquiry } from "./types";

const labels: Record<Inquiry["source"], string> = {
  contact: "New enquiry",
  "vehicle-enquiry": "Car enquiry",
  "parts-cart": "Parts quote request",
  quote: "Quote request",
};

/** Shared by /api/contact and /api/vehicle-enquire: validate, store as an inquiry, email the workshop. */
export async function handleEnquiry(req: Request, source: Inquiry["source"]) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  const d = parsed.data;

  // Honeypot filled in => bot. Pretend success.
  if ((body as { website?: string }).website) return NextResponse.json({ ok: true });

  const isQuote = d.service === "Quote";
  const src: Inquiry["source"] = source === "contact" && isQuote ? "quote" : source;
  try {
    await createInquiry({
      name: d.name,
      phone: d.phone,
      email: d.email || undefined,
      service: d.service || undefined,
      message: d.message,
      source: src,
      relatedItem: d.relatedItem || undefined,
    });
  } catch (e) {
    console.error("createInquiry failed", e);
    return NextResponse.json({ error: "We could not save your enquiry" }, { status: 500 });
  }
  await notifyWorkshop({
    subject: `${labels[src]} from ${d.name}`,
    rows: [
      ["Name", d.name],
      ["Phone", d.phone],
      ["Email", d.email ?? ""],
      ["Service", d.service ?? ""],
      ["Regarding", d.relatedItem ?? ""],
    ],
    message: d.message,
    replyTo: d.email || undefined,
  });
  return NextResponse.json({ ok: true });
}

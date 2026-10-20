import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/store";
import { notifyWorkshop } from "@/lib/email";
import { partsQuoteSchema } from "@/lib/validation";
import { formatZAR } from "@/lib/utils";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = partsQuoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  const { name, phone, email, items } = parsed.data;
  if ((body as { website?: string }).website) return NextResponse.json({ ok: true });

  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  const list = items.map((i) => `${i.qty} x ${i.title} (${formatZAR(i.price)} each)`).join("\n");
  const message = `${list}\n\nEstimated total: ${formatZAR(total)}`;
  try {
    await createInquiry({ name, phone, email: email || undefined, service: "Parts quote", message, source: "parts-cart" });
  } catch (e) {
    console.error("createInquiry failed", e);
    return NextResponse.json({ error: "We could not save your request" }, { status: 500 });
  }
  await notifyWorkshop({
    subject: `Parts quote request from ${name}`,
    rows: [
      ["Name", name],
      ["Phone", phone],
      ["Email", email ?? ""],
      ["Items", String(items.length)],
    ],
    message,
    replyTo: email || undefined,
  });
  return NextResponse.json({ ok: true });
}

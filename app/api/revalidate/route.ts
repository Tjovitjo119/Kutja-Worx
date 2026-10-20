import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/** Sanity webhook target. Configure at sanity.io/manage > API > Webhooks with the same secret. */
export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const given = req.headers.get("x-webhook-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!secret || given !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  revalidateTag("sanity");
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

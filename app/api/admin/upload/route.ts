import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin-api";
import { isDemo } from "@/lib/store";
import { writeClient, writeConfigured } from "@/sanity/lib/write-client";

const MAX = 12 * 1024 * 1024;

export async function POST(req: Request) {
  const auth = await requireSession();
  if ("error" in auth) return auth.error;
  if (isDemo)
    return NextResponse.json({ error: "Photo upload needs the Sanity project connected (demo mode is active)." }, { status: 503 });
  if (!writeConfigured) return NextResponse.json({ error: "SANITY_API_WRITE_TOKEN is not set." }, { status: 503 });

  const form = await req.formData();
  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No file received" }, { status: 400 });

  const out = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: `${file.name} is not an image` }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: `${file.name} is larger than 12 MB` }, { status: 400 });
    const asset = await writeClient.assets.upload("image", Buffer.from(await file.arrayBuffer()), {
      filename: file.name,
      contentType: file.type,
    });
    out.push({ _type: "image", _key: crypto.randomUUID().slice(0, 12), asset: { _type: "reference", _ref: asset._id } });
  }
  return NextResponse.json({ images: out });
}

import { NextResponse } from "next/server";
import { renderArt } from "@/lib/art";

export async function GET(req: Request, { params }: { params: { kind: string } }) {
  const color = new URL(req.url).searchParams.get("c");
  const svg = renderArt(params.kind, color);
  if (!svg) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

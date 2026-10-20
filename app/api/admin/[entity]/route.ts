import { NextResponse } from "next/server";
import { adminCreate, adminList } from "@/lib/store";
import { buildBody, lookupEntity, requireSession, safeDoc } from "@/lib/admin-api";

export async function GET(_req: Request, { params }: { params: { entity: string } }) {
  const auth = await requireSession(params.entity);
  if ("error" in auth) return auth.error;
  const entity = lookupEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const docs = await adminList(entity.type);
  return NextResponse.json({ docs: docs.map((d) => safeDoc(d)) });
}

export async function POST(req: Request, { params }: { params: { entity: string } }) {
  const auth = await requireSession(params.entity);
  if ("error" in auth) return auth.error;
  const entity = lookupEntity(params.entity);
  if (!entity || entity.singleton) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  try {
    const body = await buildBody(entity, await req.json());
    const doc = await adminCreate(entity.type, body);
    return NextResponse.json({ doc: safeDoc(doc) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}

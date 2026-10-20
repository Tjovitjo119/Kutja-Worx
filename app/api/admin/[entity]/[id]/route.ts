import { NextResponse } from "next/server";
import { adminCreate, adminDelete, adminGet, adminUpdate } from "@/lib/store";
import { buildBody, lookupEntity, requireSession, safeDoc } from "@/lib/admin-api";

type Ctx = { params: { entity: string; id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireSession(params.entity);
  if ("error" in auth) return auth.error;
  const entity = lookupEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const id = entity.singleton ? entity.singletonId! : params.id;
  const doc = await adminGet(entity.type, id);
  // Singletons that were never saved yet return an empty form instead of a 404.
  if (!doc && !entity.singleton) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ doc: safeDoc(doc) ?? { _id: id, _type: entity.type } });
}

export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireSession(params.entity);
  if ("error" in auth) return auth.error;
  const entity = lookupEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  const id = entity.singleton ? entity.singletonId! : params.id;
  try {
    const input = await req.json();
    const existing = await adminGet(entity.type, id);
    const body = await buildBody(entity, input, existing);
    // Owners keep at least one active owner: block self-demotion/disable.
    if (entity.type === "user" && auth.userId === id && (body.role !== "owner" || body.active === false) && existing?.role === "owner") {
      return NextResponse.json({ error: "You cannot remove your own owner access." }, { status: 400 });
    }
    const doc = existing ? await adminUpdate(entity.type, id, body) : await adminCreate(entity.type, body, id);
    return NextResponse.json({ doc: safeDoc(doc) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireSession(params.entity);
  if ("error" in auth) return auth.error;
  const entity = lookupEntity(params.entity);
  if (!entity || entity.singleton) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  if (entity.type === "user" && auth.userId === params.id)
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  try {
    await adminDelete(entity.type, params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not delete" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions, canAccess } from "./auth";
import { entityByKey, type EntityDef } from "./admin-config";
import { getPath, setPath } from "./path";
import { slugify } from "./utils";
import { adminList } from "./store";
import type { Doc, Role } from "./types";

export async function requireSession(entityKey?: string) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  if (entityKey && !canAccess(role, entityKey)) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) } as const;
  return { session, role, userId: session.user.id } as const;
}

export const lookupEntity = (key: string) => entityByKey(key) ?? (key === "inquiries" ? inquiriesEntity : undefined);

/** Inquiries are managed through a dedicated screen but use the same API. */
export const inquiriesEntity: EntityDef = {
  key: "inquiries",
  type: "inquiry",
  label: "Inquiries",
  singular: "Inquiry",
  titleField: "name",
  columns: [],
  fields: [
    { name: "status", label: "Status", type: "select", options: ["new", "in-progress", "contacted", "closed"] },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
};

const coerce = (type: string, v: any) => {
  switch (type) {
    case "number": {
      if (v === "" || v == null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }
    case "toggle":
      return Boolean(v);
    case "lines":
      return (Array.isArray(v) ? v : String(v ?? "").split("\n")).map((s) => String(s).trim()).filter(Boolean);
    case "images":
      return Array.isArray(v) ? v.filter((i) => i?.asset?._ref) : [];
    case "image":
      return v?.asset?._ref ? v : undefined;
    case "specs":
      return (Array.isArray(v) ? v : [])
        .filter((s: any) => s?.label && s?.value)
        .map((s: any) => ({ _key: s._key ?? Math.random().toString(36).slice(2, 10), label: String(s.label), value: String(s.value) }));
    default:
      return v === "" ? undefined : typeof v === "string" ? v.trim() : v;
  }
};

/** Build a clean document body from the posted data using only the fields the entity defines. */
export async function buildBody(entity: EntityDef, input: Record<string, any>, existing?: Doc | null) {
  let body: Record<string, any> = {};
  for (const f of entity.fields) {
    if (f.type === "password") continue;
    const value = coerce(f.type, getPath(input, f.name));
    body = setPath(body, f.name, value);
  }
  // Fields the form does not submit (e.g. inquiry list fields) keep their stored value via the merge in adminUpdate.
  if (entity.fields.some((f) => f.name === "slug") && !body.slug && body.title) body.slug = slugify(body.title);
  if (body.slug) body.slug = slugify(String(body.slug));

  if (entity.type === "user") {
    body.email = String(body.email ?? "").toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(body.email)) throw new Error("Please enter a valid email address.");
    const others = await adminList("user");
    if (others.some((u) => u._id !== existing?._id && (u.email ?? "").toLowerCase() === body.email))
      throw new Error("A user with that email already exists.");
    const pw = String(input.password ?? "");
    if (pw) {
      if (pw.length < 8) throw new Error("Password must be at least 8 characters.");
      body.passwordHash = await bcrypt.hash(pw, 11);
    } else if (!existing?.passwordHash) {
      throw new Error("A password is required for new users.");
    }
  }
  for (const f of entity.fields)
    if (f.required && f.type !== "password" && getPath(body, f.name) == null) throw new Error(`${f.label} is required.`);
  return body;
}

/** Never send password hashes to the browser. */
export const safeDoc = (d: Doc | null) => {
  if (!d) return d;
  const { passwordHash, ...rest } = d as any;
  return { ...rest, hasPassword: Boolean(passwordHash) } as Doc;
};

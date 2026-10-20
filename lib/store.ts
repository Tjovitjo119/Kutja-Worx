import { revalidateTag } from "next/cache";
import { sanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { writeClient, writeConfigured } from "@/sanity/lib/write-client";
import { seedByType } from "./seed-data";
import type { Doc, Inquiry, UserDoc } from "./types";

/**
 * Data access for the admin dashboard, APIs and public pages.
 *  - Sanity configured  -> reads/writes the real dataset.
 *  - Not configured     -> "demo mode": an in-memory copy of the seed data, so the
 *    whole site and admin can be previewed before the Sanity project exists.
 *    (Resets on server restart. Demo login only works when NODE_ENV !== "production".)
 */
export const isDemo = !sanityConfigured;

const g = globalThis as unknown as { __kwStore?: Record<string, Doc[]> };

function demoStore(): Record<string, Doc[]> {
  if (!g.__kwStore) {
    const now = Date.now();
    const store: Record<string, Doc[]> = {};
    let n = 0;
    for (const [type, docs] of Object.entries(seedByType)) {
      store[type] = docs.map((d) => {
        const t = new Date(now - (n++ % 40) * 1000 * 60 * 47).toISOString();
        return { ...structuredClone(d), _type: type, _createdAt: t, _updatedAt: t } as Doc;
      });
    }
    store.user = [
      {
        _id: "user-demo-owner",
        _type: "user",
        name: "Demo Owner",
        email: "owner@kutjaworx.local",
        role: "owner",
        active: true,
        _createdAt: new Date(now).toISOString(),
        _updatedAt: new Date(now).toISOString(),
      },
    ];
    g.__kwStore = store;
  }
  return g.__kwStore;
}

function assertWritable() {
  if (isDemo) return;
  if (!writeConfigured) throw new Error("SANITY_API_WRITE_TOKEN is not set, so the dashboard cannot save changes.");
}

const bust = () => {
  try {
    revalidateTag("sanity");
  } catch {
    /* outside a request (scripts) */
  }
};

export async function adminList(type: string): Promise<Doc[]> {
  if (isDemo) return [...(demoStore()[type] ?? [])].sort((a, b) => (b._updatedAt ?? "").localeCompare(a._updatedAt ?? ""));
  return writeClient.fetch(`*[_type==$type]|order(_updatedAt desc)`, { type });
}

export async function adminGet(type: string, id: string): Promise<Doc | null> {
  if (isDemo) return demoStore()[type]?.find((d) => d._id === id) ?? null;
  return writeClient.fetch(`*[_type==$type && _id==$id][0]`, { type, id });
}

export async function adminCreate(type: string, data: Record<string, any>, id?: string): Promise<Doc> {
  assertWritable();
  const now = new Date().toISOString();
  const _id = id ?? `${type}-${crypto.randomUUID()}`;
  if (isDemo) {
    const doc = { ...data, _id, _type: type, _createdAt: now, _updatedAt: now } as Doc;
    const s = demoStore();
    (s[type] ??= []).unshift(doc);
    return doc;
  }
  const doc = await writeClient.create({ ...data, _id, _type: type });
  bust();
  return doc as Doc;
}

export async function adminUpdate(type: string, id: string, data: Record<string, any>): Promise<Doc> {
  assertWritable();
  const existing = await adminGet(type, id);
  if (isDemo) {
    const s = demoStore();
    const doc = {
      ...(existing ?? { _id: id, _type: type, _createdAt: new Date().toISOString() }),
      ...data,
      _id: id,
      _type: type,
      _updatedAt: new Date().toISOString(),
    } as Doc;
    s[type] = [doc, ...(s[type] ?? []).filter((d) => d._id !== id)];
    return doc;
  }
  const { _createdAt, _updatedAt, _rev, ...rest } = (existing ?? {}) as any;
  void _createdAt;
  void _updatedAt;
  void _rev;
  const doc = await writeClient.createOrReplace({ ...rest, ...data, _id: id, _type: type });
  bust();
  return doc as Doc;
}

export async function adminDelete(type: string, id: string) {
  assertWritable();
  if (isDemo) {
    const s = demoStore();
    s[type] = (s[type] ?? []).filter((d) => d._id !== id);
    return;
  }
  await writeClient.delete(id);
  bust();
}

/** Public (cached) read: Sanity CDN client, or the demo store. */
export async function publicList(type: string, groq: string): Promise<Doc[] | null> {
  if (isDemo) return demoStore()[type] ?? [];
  try {
    return await client.fetch(groq, {}, { next: { revalidate: 60, tags: ["sanity"] } });
  } catch (e) {
    console.error(`Sanity fetch failed for ${type}`, e);
    return null;
  }
}

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const e = email.trim().toLowerCase();
  if (isDemo) return ((demoStore().user ?? []).find((u) => (u.email ?? "").toLowerCase() === e) as UserDoc | null) ?? null;
  return writeClient.fetch(`*[_type=="user" && lower(email)==$e][0]`, { e });
}

export async function createInquiry(data: Omit<Inquiry, "_id" | "_type" | "status"> & { status?: Inquiry["status"] }): Promise<Doc> {
  const now = new Date().toISOString();
  const _id = `inquiry-${crypto.randomUUID()}`;
  const doc = { status: "new", ...data, _id, _type: "inquiry", createdAt: now } as any;
  if (isDemo) {
    const s = demoStore();
    (s.inquiry ??= []).unshift({ ...doc, _createdAt: now, _updatedAt: now });
    return doc;
  }
  if (!writeConfigured) throw new Error("SANITY_API_WRITE_TOKEN is not set");
  const created = await writeClient.create(doc);
  bust();
  return created as Doc;
}

export async function dashboardStats() {
  const count = async (type: string) => (isDemo ? (demoStore()[type] ?? []).length : writeClient.fetch(`count(*[_type==$type])`, { type }));
  const [vehicles, parts, services, inquiries, newInquiries] = await Promise.all([
    count("vehicle"),
    count("part"),
    count("service"),
    count("inquiry"),
    isDemo
      ? (demoStore().inquiry ?? []).filter((i) => i.status === "new").length
      : writeClient.fetch(`count(*[_type=="inquiry" && status=="new"])`),
  ]);
  const types = ["vehicle", "part", "service", "galleryImage", "special", "inquiry", "priceListItem"];
  const recent: Doc[] = isDemo
    ? types
        .flatMap((t) => demoStore()[t] ?? [])
        .sort((a, b) => (b._updatedAt ?? "").localeCompare(a._updatedAt ?? ""))
        .slice(0, 10)
    : await writeClient.fetch(
        `*[_type in $types]|order(_updatedAt desc)[0...10]{_id,_type,_createdAt,_updatedAt,title,name,caption,service}`,
        { types },
      );
  return { vehicles, parts, services, inquiries, newInquiries, recent };
}

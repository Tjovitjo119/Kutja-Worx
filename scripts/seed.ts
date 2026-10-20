/**
 * Seeds the Sanity dataset with the default Kutja Worx content (see lib/seed-data.ts).
 * Safe to re-run: existing documents are left untouched (createIfNotExists).
 *   npm run seed
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { seedByType } from "../lib/seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing or invalid in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing in .env.local (create an Editor token at sanity.io/manage > API > Tokens)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

/** Retry flaky network calls (ECONNRESET, timeouts) a few times before giving up. */
async function withRetry<T>(label: string, fn: () => Promise<T>, tries = 4): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (i >= tries) throw e;
      console.log(`  ${label} failed (${msg}), retrying ${i}/${tries - 1}...`);
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

/** Upload each doc's local /public photo to Sanity and attach it as a proper image field. */
async function uploadPhotos() {
  const cache = new Map<string, string>();
  let n = 0;
  for (const docs of Object.values(seedByType)) {
    for (const d of docs as Record<string, any>[]) {
      if (typeof d.photo !== "string") continue;
      const file = path.join(process.cwd(), "public", d.photo);
      if (!fs.existsSync(file)) {
        delete d.photo;
        continue;
      }
      let ref = cache.get(file);
      if (!ref) {
        const asset = await withRetry(`Uploading ${path.basename(file)}`, () =>
          client.assets.upload("image", fs.readFileSync(file), { filename: path.basename(file) }),
        );
        ref = asset._id;
        cache.set(file, ref);
        n++;
      }
      const image = { _type: "image", _key: "seed-" + n, asset: { _type: "reference", _ref: ref } };
      if (d._type === "vehicle") d.images = [image];
      else if (d._type === "heroContent") d.backgroundImage = image;
      else d.image = image;
      delete d.photo;
    }
  }
  return cache.size;
}

async function main() {
  const uploaded = await uploadPhotos();
  if (uploaded) console.log(`Uploaded ${uploaded} photos from /public.`);
  let created = 0;
  let skipped = 0;
  const tx = client.transaction();
  for (const docs of Object.values(seedByType)) {
    for (const d of docs) {
      tx.createIfNotExists(d as { _id: string; _type: string });
    }
  }
  const total = Object.values(seedByType).reduce((n, d) => n + d.length, 0);
  const res = await withRetry("Saving content", () => tx.commit());
  created = res.results.filter((r) => r.operation === "create").length;
  skipped = total - created;
  console.log(`Seed complete: ${created} created, ${skipped} already existed (dataset "${dataset}").`);
  console.log("Replace the placeholder car types, parts and prices in /admin before launch.");
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});

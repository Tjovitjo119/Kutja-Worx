/**
 * Creates (or resets the password of) an owner account in Sanity.
 *   npm run create-owner
 */
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !/^[a-z0-9-]+$/.test(projectId) || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

/** Prompt without echoing the typed characters. */
function askHidden(q: string) {
  return new Promise<string>((res) => {
    const out = rl as unknown as { _writeToOutput: (s: string) => void };
    const orig = out._writeToOutput;
    process.stdout.write(q);
    out._writeToOutput = () => {};
    rl.question("", (v) => {
      out._writeToOutput = orig;
      process.stdout.write("\n");
      res(v);
    });
  });
}

async function main() {
  const name = (await ask("Full name: ")).trim();
  const email = (await ask("Email: ")).trim().toLowerCase();
  const password = await askHidden("Password (min 8 characters): ");
  const confirm = await askHidden("Confirm password: ");
  rl.close();

  if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a name and a valid email.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (password !== confirm) throw new Error("Passwords do not match.");

  const existing = await client.fetch(`*[_type=="user" && lower(email)==$email][0]{_id}`, { email });
  const passwordHash = await bcrypt.hash(password, 11);
  const doc = {
    _id: existing?._id ?? `user-${Date.now().toString(36)}`,
    _type: "user",
    name,
    email,
    passwordHash,
    role: "owner",
    active: true,
  };
  await client.createOrReplace(doc);
  console.log(existing ? `Updated owner ${email}.` : `Created owner ${email}.`);
  console.log("You can now log in at /admin/login.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, adminUpdate, isDemo } from "./store";
import type { Role } from "./types";

/** Dev-only demo login, active only while Sanity is not configured AND NODE_ENV !== "production". */
export const DEMO_LOGIN = { email: "owner@kutjaworx.local", password: "kutja-demo" };
export const demoLoginEnabled = isDemo && process.env.NODE_ENV !== "production";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV !== "production" ? "kutja-dev-only-secret-change-me" : undefined),
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        if (demoLoginEnabled && email === DEMO_LOGIN.email && password === DEMO_LOGIN.password) {
          return { id: "user-demo-owner", name: "Demo Owner", email, role: "owner" as Role };
        }
        const user = await findUserByEmail(email);
        if (!user || user.active === false || !user.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        try {
          await adminUpdate("user", user._id, { lastLogin: new Date().toISOString() });
        } catch {
          /* non-fatal */
        }
        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.uid;
      }
      return session;
    },
  },
};

/** Which admin areas each role may use. */
export const roleAccess: Record<Role, string[]> = {
  owner: ["*"],
  admin: ["*"],
  reception: ["", "reception", "inquiries", "gallery"],
};

/** `segment` = first path segment after /admin (or /api/admin). */
export function canAccess(role: Role | undefined, segment: string) {
  if (!role) return false;
  if (segment === "users") return role === "owner";
  const allowed = roleAccess[role];
  return allowed.includes("*") || allowed.includes(segment);
}

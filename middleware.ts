import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { Role } from "@/lib/types";

// Edge-safe copy of lib/auth.ts access rules (middleware cannot import bcrypt/Sanity code).
const access: Record<Role, string[]> = { owner: ["*"], admin: ["*"], reception: ["", "reception", "inquiries", "gallery"] };

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as Role | undefined;
    const path = req.nextUrl.pathname;
    if (path === "/admin/login") return NextResponse.next();
    const isApi = path.startsWith("/api/admin");
    const segment = path.replace(/^\/(api\/)?admin\/?/, "").split("/")[0] ?? "";
    const allowed =
      role &&
      (segment === "users"
        ? role === "owner"
        : access[role].includes("*") || access[role].includes(segment) || (isApi && ["stats", "upload", "options"].includes(segment)));
    if (allowed) return NextResponse.next();
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL(role === "reception" ? "/admin/reception" : "/admin/login", req.url));
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // The login page itself is public.
        if (req.nextUrl.pathname === "/admin/login") return true;
        return !!token;
      },
    },
    pages: { signIn: "/admin/login" },
  },
);

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

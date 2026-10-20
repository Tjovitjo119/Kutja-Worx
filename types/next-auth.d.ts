import "next-auth";
import "next-auth/jwt";
import type { Role } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: { name?: string | null; email?: string | null; image?: string | null; role?: Role; id?: string };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    uid?: string;
  }
}

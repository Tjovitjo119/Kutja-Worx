import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin-api";
import { dashboardStats } from "@/lib/store";

export async function GET() {
  const auth = await requireSession();
  if ("error" in auth) return auth.error;
  return NextResponse.json(await dashboardStats());
}

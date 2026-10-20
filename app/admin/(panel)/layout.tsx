import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminShell from "@/components/admin/AdminShell";
import { authOptions } from "@/lib/auth";
import { isDemo } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) redirect("/admin/login");
  return (
    <AdminShell role={session.user.role} name={session.user.name ?? "Staff"} demo={isDemo}>
      {children}
    </AdminShell>
  );
}

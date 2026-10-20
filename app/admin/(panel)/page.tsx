import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { OwnerDashboard } from "@/components/admin/Dashboards";
import { authOptions } from "@/lib/auth";
import { dashboardStats } from "@/lib/store";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "reception") redirect("/admin/reception");
  const stats = await dashboardStats();
  return <OwnerDashboard name={session?.user?.name ?? "there"} stats={stats} />;
}

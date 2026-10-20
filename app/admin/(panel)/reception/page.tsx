import { ReceptionDashboard } from "@/components/admin/Dashboards";
import { adminList, dashboardStats } from "@/lib/store";

export default async function ReceptionPage() {
  const [stats, inquiries] = await Promise.all([dashboardStats(), adminList("inquiry")]);
  return <ReceptionDashboard stats={stats} inquiries={inquiries} />;
}

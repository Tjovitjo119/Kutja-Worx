import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import ServicesGrid from "@/components/ServicesGrid";
import EngineManagementList from "@/components/EngineManagementList";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Services | Kutja Worx - Auto Repair & Performance Silverton, Pretoria",
  description: "Minor & major services, engine overhauling, clutch kits, suspension, conversions, modifications, diagnosis and engine management installations.",
};

export default async function ServicesPage() {
  const c = await getContent();
  return (
    <SiteShell settings={c.settings}>
      <ServicesGrid services={c.services.filter((s) => s.category !== "Engine Management")}>
        <EngineManagementList services={c.services.filter((s) => s.category === "Engine Management")} />
      </ServicesGrid>
    </SiteShell>
  );
}

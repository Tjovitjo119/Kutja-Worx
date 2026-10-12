import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import About from "@/components/About";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "About | Kutja Worx - Auto Repair & Performance Silverton, Pretoria",
  description: "About Kutja Worx, a performance and repair workshop in Silverton, Pretoria.",
};

export default async function AboutPage() {
  const c = await getContent();
  return (
    <SiteShell settings={c.settings}>
      <About settings={c.settings} />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import ContactSection from "@/components/ContactSection";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Contact | Kutja Worx - Auto Repair & Performance Silverton, Pretoria",
  description: "Call or visit Kutja Worx at 213A Dykor Street, Silverton, Pretoria, or request a quote online.",
};

export default async function ContactPage() {
  const c = await getContent();
  return (
    <SiteShell settings={c.settings}>
      <ContactSection settings={c.settings} />
    </SiteShell>
  );
}

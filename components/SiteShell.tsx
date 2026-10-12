import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import type { SiteContent } from "@/lib/content";

export default function SiteShell({ settings, children }: { settings: SiteContent["settings"]; children: ReactNode }) {
  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}

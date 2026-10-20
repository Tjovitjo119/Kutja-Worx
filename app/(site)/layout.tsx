import type { ReactNode } from "react";
import SiteProviders from "@/components/site/SiteProviders";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: settings.name,
    url: base,
    telephone: settings.phones[0],
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "213A Dykor Street",
      addressLocality: "Silverton",
      addressRegion: "Pretoria",
      addressCountry: "ZA",
    },
    ...(settings.openingHours?.length ? { openingHours: settings.openingHours } : {}),
    sameAs: Object.values(settings.socials ?? {}).filter(Boolean),
  };
  return (
    <SiteProviders>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-brand-red focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header name={settings.name} logo={settings.logo} phone={settings.phones[0]} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </SiteProviders>
  );
}

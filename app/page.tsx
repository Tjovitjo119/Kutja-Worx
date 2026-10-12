import { getContent } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import Hero from "@/components/Hero";
import HomeTeasers from "@/components/HomeTeasers";
import Specials from "@/components/Specials";

export const revalidate = 60;

export default async function Home() {
  const c = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: c.settings.businessName,
    telephone: c.settings.phoneNumbers[0],
    address: { "@type": "PostalAddress", streetAddress: "213A Dykor Street", addressLocality: "Silverton", addressRegion: "Pretoria", addressCountry: "ZA" },
  };

  return (
    <SiteShell settings={c.settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero hero={c.hero} settings={c.settings} />
      <Specials specials={c.specials} />
      <HomeTeasers settings={c.settings} />
    </SiteShell>
  );
}

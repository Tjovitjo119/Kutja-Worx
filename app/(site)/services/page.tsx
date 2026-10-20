import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import ServicesBrowser from "@/components/site/ServicesBrowser";
import { getPriceList, getServiceCategories, getServices } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Services & Price List",
  description:
    "Servicing, engine overhauling, clutch & gearbox, suspension & brakes, conversions, modifications, diagnostics and engine management in Silverton, Pretoria.",
};

export default async function ServicesPage({ searchParams }: { searchParams: { tab?: string } }) {
  const [services, categories, prices] = await Promise.all([getServices(), getServiceCategories(), getPriceList()]);
  return (
    <>
      <PageHero
        white="Services &"
        red="Price List"
        sub="Professional service, competitive pricing. Keep your car running at its best."
        art="/api/art/engine"
      />
      <ServicesBrowser
        services={services}
        categories={categories}
        prices={prices}
        initialTab={searchParams.tab === "price" ? "price" : "services"}
      />
    </>
  );
}

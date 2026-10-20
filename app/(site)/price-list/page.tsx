import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import PriceListBrowser from "@/components/site/PriceListBrowser";
import { getParts, getPriceList } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "Price List", description: "Transparent pricing for Kutja Worx services and parts." };

export default async function PriceListPage() {
  const [prices, parts] = await Promise.all([getPriceList(), getParts()]);
  return (
    <>
      <PageHero white="Price" red="List" sub="Transparent pricing for all our services and parts." photo="/cars/vw-polo.webp" />
      <PriceListBrowser prices={prices} parts={parts} />
    </>
  );
}

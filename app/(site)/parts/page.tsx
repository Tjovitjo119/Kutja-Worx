import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import PartsBrowser from "@/components/site/PartsBrowser";
import { getPartCategories, getParts, withImage } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Parts & Accessories",
  description: "Genuine parts. Trusted brands. Better performance. Request a quote on performance and replacement parts.",
};

export default async function PartsPage() {
  const [parts, categories] = await Promise.all([getParts(), getPartCategories()]);
  return (
    <>
      <PageHero white="Parts &" red="Accessories" sub="Genuine parts. Trusted brands. Better performance." photo="/cars/bmw-e30-red.jpg" />
      <PartsBrowser parts={withImage("part", parts)} categories={categories} />
    </>
  );
}

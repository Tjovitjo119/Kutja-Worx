import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import CarsBrowser from "@/components/site/CarsBrowser";
import { getVehicles, withImage } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Car Types",
  description: "The makes and models Kutja Worx services, repairs and modifies in Silverton, Pretoria.",
};

export default async function CarsPage() {
  const vehicles = withImage("vehicle", await getVehicles());
  return (
    <>
      <PageHero
        white="Car"
        red="Types"
        sub="The makes and models we service, repair and modify. Don't see yours? Get in touch, we work on all makes."
        art="/api/art/hero?c=1b2a4a"
      />
      <CarsBrowser vehicles={vehicles} />
    </>
  );
}

import { getHero, getServices, getSettings, getSpecials, getTestimonials, getVehicles, withImage } from "@/lib/data";
import {
  CtaStrip,
  FeatureStrip,
  FeaturedBuilds,
  HomeHero,
  ServicesPreview,
  SpecialsBanner,
  Testimonials,
} from "@/components/site/HomeSections";

export const revalidate = 60;

export default async function Home() {
  const [settings, hero, vehicles, services, specials, testimonials] = await Promise.all([
    getSettings(),
    getHero(),
    getVehicles(),
    getServices(),
    getSpecials(),
    getTestimonials(),
  ]);
  const featured = vehicles.filter((v) => v.featured);
  const builds = withImage("vehicle", featured.length ? featured : vehicles);
  const featuredServices = services.filter((s) => s.featured);

  return (
    <>
      <HomeHero hero={hero} settings={settings} />
      <FeatureStrip />
      <FeaturedBuilds vehicles={builds} />
      <SpecialsBanner specials={specials} />
      <ServicesPreview services={featuredServices.length >= 3 ? featuredServices : services} />
      <Testimonials items={testimonials} />
      <CtaStrip phone={settings.phones[0]} />
    </>
  );
}

import { client } from "@/sanity/lib/client";
import { sanityConfigured } from "@/sanity/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Service = { _id: string; title: string; description?: string; category: string; image?: any };

// Local flyer crops used as placeholder photos until real ones are added in the CMS.
export const placeholderGallery: SiteContent["gallery"] = [
  ["Black coupe", "Workshop", "car-black"],
  ["Engine build", "Engine Builds", "engine"],
  ["Red hatch", "Workshop", "car-red"],
  ["Suspension", "Suspension", "suspension"],
  ["Clutch kit", "Engine Builds", "clutch"],
  ["Diagnostics", "Diagnostics", "diagnostics"],
  ["White coupe", "Workshop", "car-white"],
  ["On the lift", "Suspension", "lift"],
].map(([caption, category, f], i) => ({ _id: "p" + i, caption, category, image: null, src: "/art/" + f + ".svg" }));
export type SiteContent = {
  settings: {
    businessName: string;
    logo?: any;
    phoneNumbers: string[];
    email?: string;
    address: string;
    hours?: string;
    about?: string;
    socialLinks: { platform: string; url: string }[];
  };
  hero: { headline: string; subheadline: string; backgroundImage?: any };
  services: Service[];
  gallery: { _id: string; caption?: string; category?: string; image: any; src?: string }[];
  specials: { _id: string; title: string; description?: string; expiryDate?: string; image?: any }[];
};

// Used until the client has filled in the CMS, so the site never looks empty.
const defaultServices = [
  ["Minor & Major Services", "Full vehicle servicing, oil changes, filters and more."],
  ["Engine Overhauling", "Complete engine rebuilds and repairs."],
  ["Clutch Kit Replacement", "Smooth shifting, better performance."],
  ["Suspension Replacement", "Improved handling, total control."],
  ["Engine Conversions", "More power. More possibilities."],
  ["Engine Modifications", "Unlock your car's true potential."],
  ["Diagnosis", "Accurate faults. Real solutions."],
].map(([title, description], i) => ({ _id: `d-s-${i}`, title, description, category: "General Service" }));

const defaultEngineMgmt = ["Dictator", "Sustech", "Spitronics", "Powermods"].map((title, i) => ({
  _id: `d-e-${i}`,
  title,
  category: "Engine Management",
}));

export const defaults: SiteContent = {
  settings: {
    businessName: "Kutja Worx",
    phoneNumbers: ["071 673 8293", "068 028 1903"],
    address: "213A Dykor Street, Silverton, Pretoria",
    about:
      "Kutja Worx is a Silverton workshop built on mechanical know-how and a love of performance. From routine servicing to full engine builds and engine management installations, we do the job properly and treat your car like our own.",
    socialLinks: [],
  },
  hero: {
    headline: "Kutja Worx",
    subheadline: "Performance & Repair Specialists",
  },
  services: [...defaultServices, ...defaultEngineMgmt],
  gallery: [],
  specials: [],
};
// (placeholderGallery is applied by <Gallery> when the CMS has no photos yet)

const query = `{
  "settings": *[_type == "siteSettings"][0],
  "hero": *[_type == "heroContent"][0],
  "services": *[_type == "service"] | order(order asc, title asc) { _id, title, description, category, image },
  "gallery": *[_type == "galleryImage" && defined(image)] | order(order asc) { _id, caption, category, image },
  "specials": *[_type == "specialOrPromo" && (!defined(expiryDate) || expiryDate >= $today)] | order(expiryDate asc) { _id, title, description, expiryDate, image }
}`;

export async function getContent(): Promise<SiteContent> {
  if (!sanityConfigured) return defaults;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data: any = await client.fetch(query, { today }, { next: { revalidate: 60 } });
    const s = data.settings || {};
    const h = data.hero || {};
    return {
      settings: {
        businessName: s.businessName || defaults.settings.businessName,
        logo: s.logo,
        phoneNumbers: s.phoneNumbers?.length ? s.phoneNumbers : defaults.settings.phoneNumbers,
        email: s.email,
        address: s.address || defaults.settings.address,
        hours: s.hours,
        about: s.about || defaults.settings.about,
        socialLinks: (s.socialLinks || []).filter((l: any) => l?.url),
      },
      hero: {
        headline: h.headline || defaults.hero.headline,
        subheadline: h.subheadline || defaults.hero.subheadline,
        backgroundImage: h.backgroundImage,
      },
      services: data.services?.length ? data.services : defaults.services,
      gallery: data.gallery || [],
      specials: data.specials || [],
    };
  } catch (e) {
    console.error("Sanity fetch failed, using defaults", e);
    return defaults;
  }
}

export const telHref = (n: string) => `tel:+27${n.replace(/\D/g, "").replace(/^0/, "")}`;

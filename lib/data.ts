import { cache } from "react";
import { queries } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { isDemo, publicList } from "./store";
import { artFor } from "./art";
import { seedByType, siteSettings as seedSettings, heroContent as seedHero } from "./seed-data";
import type {
  Category,
  Doc,
  GalleryImage,
  HeroContent,
  Part,
  PriceListItem,
  Service,
  SiteSettings,
  Special,
  Testimonial,
  Vehicle,
} from "./types";

// Types where "no documents in Sanity yet" should show the seed content instead of an empty page.
const FALLBACK = new Set(["serviceCategory", "partCategory", "service", "priceListItem", "vehicle", "part", "galleryImage"]);

const getDocs = cache(async (type: string): Promise<Doc[]> => {
  const docs = await publicList(type, queries[type]);
  if (docs && (docs.length || !FALLBACK.has(type))) return docs;
  return (seedByType[type] as Doc[]) ?? [];
});

const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 100) - (b.order ?? 100);

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const doc = ((await getDocs("siteSettings"))[0] ?? {}) as Partial<SiteSettings>;
  const s = { ...(seedSettings as any), ...doc } as SiteSettings;
  if (!s.phones?.length) s.phones = (seedSettings as any).phones;
  if (!s.about) s.about = (seedSettings as any).about;
  return s;
});

export const getHero = cache(async (): Promise<HeroContent> => {
  const doc = ((await getDocs("heroContent"))[0] ?? {}) as Partial<HeroContent>;
  const h = { ...(seedHero as any), ...doc } as HeroContent;
  if (!h.headline) h.headline = (seedHero as any).headline;
  if (!h.brands?.length) h.brands = (seedHero as any).brands;
  return h;
});

export const getServices = async () => ((await getDocs("service")) as Service[]).filter((s) => s.published !== false).sort(byOrder);
export const getServiceCategories = async () => ((await getDocs("serviceCategory")) as Category[]).sort(byOrder);
export const getPriceList = async () => ((await getDocs("priceListItem")) as PriceListItem[]).sort(byOrder);
export const getVehicles = async () => ((await getDocs("vehicle")) as Vehicle[]).sort(byOrder);
export const getVehicle = async (slug: string) => (await getVehicles()).find((v) => v.slug === slug) ?? null;
export const getParts = async () => ((await getDocs("part")) as Part[]).filter((p) => p.published !== false).sort(byOrder);
export const getPartCategories = async () => ((await getDocs("partCategory")) as Category[]).sort(byOrder);
export const getGallery = async () => ((await getDocs("galleryImage")) as GalleryImage[]).sort(byOrder);
export const getTestimonials = async () => (await getDocs("testimonial")) as Testimonial[];

export const getSpecials = async (): Promise<Special[]> => {
  const today = new Date().toISOString().slice(0, 10);
  return ((await getDocs("special")) as Special[]).filter(
    (s) => s.active !== false && (!s.validFrom || s.validFrom <= today) && (!s.validUntil || s.validUntil >= today),
  );
};

/** Image URL for a document: its first uploaded photo, otherwise placeholder art. */
export function docImage(type: string, doc: Doc, opts: { width?: number; index?: number } = {}): { src: string; placeholder: boolean } {
  const width = opts.width ?? 900;
  if (typeof doc.photo === "string" && !(doc.image?.asset || doc.images?.[0]?.asset)) return { src: doc.photo, placeholder: false };
  const source = doc.image ?? doc.images?.[0] ?? doc.backgroundImage;
  if (source?.asset && !isDemo) return { src: urlFor(source).width(width).quality(80).auto("format").url(), placeholder: false };
  return { src: artFor(type, doc, opts.index ?? 0), placeholder: true };
}

export function docImages(type: string, doc: Doc, width = 1400): { src: string; placeholder: boolean }[] {
  if (typeof doc.photo === "string" && !(doc.images ?? []).some((i: any) => i?.asset)) return [{ src: doc.photo, placeholder: false }];
  const real = (doc.images ?? []).filter((i: any) => i?.asset);
  if (real.length && !isDemo)
    return real.map((i: any) => ({ src: urlFor(i).width(width).quality(80).auto("format").url(), placeholder: false }));
  return [{ src: artFor(type, doc), placeholder: true }];
}

/** Attach a resolved image URL (uploaded photo or placeholder art) so client components need no server code. */
export function withImage<T extends Doc>(type: string, docs: T[], width = 700): (T & { _img: string })[] {
  return docs.map((d, i) => ({ ...d, _img: docImage(type, d, { width, index: i }).src }));
}

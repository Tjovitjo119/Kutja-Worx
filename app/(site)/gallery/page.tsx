import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import GalleryBrowser from "@/components/site/GalleryBrowser";
import { docImage, getGallery } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gallery",
  description: "Real work. Real results. A look at recent builds, repairs and projects from Kutja Worx.",
};

export default async function GalleryPage() {
  const items = (await getGallery()).map((g, i) => ({
    ...g,
    _img: docImage("galleryImage", g, { width: 700, index: i }).src,
    _full: docImage("galleryImage", g, { width: 1800, index: i }).src,
  }));
  return (
    <>
      <PageHero
        white="Our"
        red="Gallery"
        sub="Real work. Real results. A look at some of our latest builds, repairs and projects."
        photo="/cars/bmw-stance-pair.jpg"
      />
      <GalleryBrowser items={items} />
    </>
  );
}

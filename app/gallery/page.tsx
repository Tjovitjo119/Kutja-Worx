import type { Metadata } from "next";
import { getContent, placeholderGallery } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import Gallery from "@/components/Gallery";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gallery | Kutja Worx - Auto Repair & Performance Silverton, Pretoria",
  description: "Builds, repairs and workshop action from Kutja Worx in Silverton, Pretoria.",
};

export default async function GalleryPage() {
  const c = await getContent();
  return (
    <SiteShell settings={c.settings}>
      <Gallery items={c.gallery.length ? c.gallery : placeholderGallery} />
    </SiteShell>
  );
}

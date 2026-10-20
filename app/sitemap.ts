import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const pages = ["", "/services", "/cars", "/parts", "/price-list", "/gallery", "/about", "/contact"];
  const vehicles = await getVehicles();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...vehicles.map((v) => ({ url: `${base}/cars/${v.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}

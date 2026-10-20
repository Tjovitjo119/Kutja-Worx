import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kutja Worx",
    short_name: "Kutja Worx",
    description: "Performance & Repair Specialists, Silverton, Pretoria",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#E60012",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}

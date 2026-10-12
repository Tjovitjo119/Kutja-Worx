import type { Metadata, Viewport } from "next";

// Fonts are self-hosted through @fontsource (no runtime Google Fonts fetch).
import "@fontsource-variable/oswald";
import "@fontsource-variable/inter";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "Kutja Worx | Auto Repair & Performance Silverton, Pretoria";
const description =
  "Kutja Worx in Silverton, Pretoria: minor & major services, engine overhauls, clutch kits, suspension, engine conversions, modifications, diagnostics and engine management installations (Dictator, Sustech, Spitronics, Powermods).";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_ZA",
    siteName: "Kutja Worx",
    images: [{ url: "/flyer.jpg", width: 905, height: 1280, alt: "Kutja Worx workshop flyer" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/flyer.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body className="font-sans">{children}</body>
    </html>
  );
}

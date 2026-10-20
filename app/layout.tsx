import type { Metadata, Viewport } from "next";
// Fonts are self-hosted through @fontsource (no runtime Google Fonts fetch).
import "@fontsource-variable/oswald";
import "@fontsource-variable/inter";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "Kutja Worx | Auto Repair & Performance Silverton, Pretoria";
const description =
  "Kutja Worx in Silverton, Pretoria: servicing, engine overhauls, clutch kits, suspension, conversions, modifications, diagnostics, engine management, performance parts and car care.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Kutja Worx" },
  description,
  applicationName: "Kutja Worx",
  openGraph: { title, description, type: "website", locale: "en_ZA", siteName: "Kutja Worx" },
  twitter: { card: "summary_large_image", title, description },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body>{children}</body>
    </html>
  );
}

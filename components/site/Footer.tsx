import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/Brands";
import Logo from "@/components/Logo";
import type { SiteSettings } from "@/lib/types";
import { telHref } from "@/lib/utils";

const quick = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Car Types", "/cars"],
  ["Parts", "/parts"],
  ["Price List", "/price-list"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
const serviceLinks = [
  "General Servicing",
  "Engine Overhauling",
  "Clutch & Gearbox",
  "Suspension & Brakes",
  "Engine Management",
  "Diagnostics",
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const s = settings.socials ?? {};
  const socials = [
    { href: s.facebook, label: "Facebook", Icon: Facebook },
    { href: s.instagram, label: "Instagram", Icon: Instagram },
    { href: s.whatsapp, label: "WhatsApp", Icon: MessageCircle },
    { href: s.youtube, label: "YouTube", Icon: Youtube },
  ].filter((x) => x.href);
  return (
    <footer className="border-t-2 border-brand-red bg-ink-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo name={settings.name} logo={settings.logo} />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {settings.tagline ?? "Performance & Repair Specialists"}. Servicing, engine work, performance upgrades, parts and car care in
            Silverton, Pretoria.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-colors hover:bg-brand-red hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase">
            Quick <span className="text-brand-red">Links</span>
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {quick.map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase">
            Our <span className="text-brand-red">Services</span>
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {serviceLinks.map((l) => (
              <li key={l}>
                <Link href="/services" className="hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase">
            Get in <span className="text-brand-red">Touch</span>
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {settings.address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <span>
                {settings.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="block hover:text-white">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            {settings.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {settings.name}. All rights reserved.
      </div>
    </footer>
  );
}

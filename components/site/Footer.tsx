import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/ui/Brands";
import Logo from "@/components/Logo";
import type { SiteSettings } from "@/lib/types";
import { telHref } from "@/lib/utils";

const quick = [
  ["Home", "/"],
  ["Services", "/services"],
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
  const pill = "flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/80";
  const iconWrap = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red";

  return (
    <footer className="px-3 pb-3 pt-12 sm:px-4 sm:pb-4">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-panel to-ink-deep shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
        {/* call-to-action band */}
        <div className="relative isolate overflow-hidden bg-gradient-to-r from-brand-dark via-brand-red to-brand-dark px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute -right-10 top-0 -z-10 h-full w-40 -skew-x-[22deg] bg-white/10" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase leading-tight sm:text-3xl">Need work done on your car?</h2>
              <p className="mt-1 text-sm text-white/85">Call us or send an enquiry and we&apos;ll get back to you quickly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={telHref(settings.phones[0])}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink hover:bg-white/90"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white/10"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* link columns */}
        <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <Logo name={settings.name} logo={settings.logo} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {settings.tagline ?? "Performance & Repair Specialists"}. Servicing, engine work, performance upgrades and parts in Silverton,
              Pretoria.
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-red"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 lg:contents">
            <div>
              <h3 className="font-display text-base font-bold uppercase tracking-wide">
                Quick <span className="text-brand-red">Links</span>
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {quick.map(([l, h]) => (
                  <li key={h}>
                    <Link href={h} className="transition-colors hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-base font-bold uppercase tracking-wide">
                Our <span className="text-brand-red">Services</span>
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {serviceLinks.map((l) => (
                  <li key={l}>
                    <Link href="/services" className="transition-colors hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              Get in <span className="text-brand-red">Touch</span>
            </h3>
            <ul className="mt-4 space-y-3">
              <li className={pill}>
                <span className={iconWrap}>
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1.5">{settings.address}</span>
              </li>
              <li className={pill}>
                <span className={iconWrap}>
                  <Phone className="h-4 w-4" />
                </span>
                <span className="pt-0.5">
                  {settings.phones.map((p) => (
                    <a key={p} href={telHref(p)} className="block hover:text-white">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              {settings.email && (
                <li className={pill}>
                  <span className={iconWrap}>
                    <Mail className="h-4 w-4" />
                  </span>
                  <a href={`mailto:${settings.email}`} className="break-all pt-1.5 hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-6 py-5 text-xs text-muted sm:flex-row sm:px-10">
          <p>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <p>Silverton, Pretoria</p>
        </div>
      </div>
    </footer>
  );
}

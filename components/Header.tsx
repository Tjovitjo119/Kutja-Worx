"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Phone } from "./Icons";
import { telHref, type SiteContent } from "@/lib/content";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings }: { settings: SiteContent["settings"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const tel = telHref(settings.phoneNumbers[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-5 px-4">
        <Link href="/" aria-label={settings.businessName} className="shrink-0">
          <Logo name={settings.businessName} logo={settings.logo} />
        </Link>
        <span className="hidden h-9 w-px bg-white/20 lg:block" />
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white lg:block">
          Performance &amp; Repair Specialists
        </span>
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`border-b-2 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:text-brand-red ${
                pathname === l.href ? "border-brand-red text-brand-red" : "border-transparent text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={tel}
            className="flex items-center gap-2 bg-brand-red px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] hover:bg-brand-dark"
          >
            <Phone className="h-4 w-4" />
            <span className="leading-tight">Call Now<br /><span className="text-[10px] font-semibold tracking-wide">{settings.phoneNumbers[0]}</span></span>
          </a>
        </nav>
        <button className="ml-auto md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-white/10 bg-ink px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-widest">
              {l.label}
            </Link>
          ))}
          <a href={tel} className="btn btn-red mt-2">
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </nav>
      )}
    </header>
  );
}

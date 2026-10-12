import Logo from "./Logo";
import { Facebook } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function Footer({ settings }: { settings: SiteContent["settings"] }) {
  return (
    <footer className="border-t-2 border-brand-red bg-ink-deep py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-white/70 md:flex-row">
        <Logo name={settings.businessName} logo={settings.logo} />
        <p className="font-semibold">Performance &amp; Repair Specialists</p>
        <div className="flex items-center gap-3">
          {settings.socialLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.platform}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink hover:bg-brand-red hover:text-white"
            >
              {l.platform === "Facebook" ? <Facebook className="h-4 w-4" /> : <span className="text-[10px] font-bold">{l.platform.slice(0, 2)}</span>}
            </a>
          ))}
        </div>
        <p>
          © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

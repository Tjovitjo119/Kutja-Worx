"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, Phone, ShoppingCart, User, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useCart } from "./CartProvider";
import { cn, telHref } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/parts", label: "Parts" },
  { href: "/price-list", label: "Price List" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ name, logo, phone }: { name: string; logo?: unknown; phone: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { count, setOpen: openCart } = useCart();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const loginHref = session?.user ? (session.user.role === "reception" ? "/admin/reception" : "/admin") : "/admin/login";

  // Close the menu on navigation and lock page scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-line2 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4">
          <Link href="/" aria-label={`${name} home`} className="shrink-0">
            <Logo name={name} logo={logo} />
          </Link>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className={cn(
                  "border-b-2 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:text-brand-red",
                  active(l.href) ? "border-brand-red text-brand-red" : "border-transparent text-white",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <button
              onClick={() => openCart(true)}
              aria-label={`Open parts quote cart (${count} items)`}
              className="relative rounded-md p-2 hover:bg-white/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
            <Link
              href={loginHref}
              className="hidden items-center gap-1.5 rounded-md border border-white/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider hover:border-brand-red hover:text-brand-red sm:flex"
            >
              <User className="h-4 w-4" /> {session?.user ? "Dashboard" : "Login"}
            </Link>
            <a
              href={telHref(phone)}
              className="flex items-center gap-1.5 rounded-md bg-brand-red px-3 py-2 text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(230,0,18,0.4)] hover:bg-brand-dark"
            >
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Call Now</span>
            </a>
            <button
              className="rounded-md p-2 hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu. Rendered outside <header> because backdrop-blur would otherwise trap a fixed child. */}
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <Image src="/cars/bmw-e30-325i.webp" alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,0,18,0.18),transparent_65%)]" />

          <div className="relative z-10 flex h-[68px] shrink-0 items-center justify-between px-4">
            <Link href="/" onClick={() => setOpen(false)} aria-label={`${name} home`}>
              <Logo name={name} logo={logo} />
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-full border border-white/30 p-2 hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto px-6 py-4"
            aria-label="Mobile"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active(l.href) ? "page" : undefined}
                className={cn(
                  "w-full max-w-xs rounded-xl py-3 text-center font-display text-3xl font-bold uppercase tracking-wide transition-colors",
                  active(l.href) ? "text-brand-red" : "text-white hover:text-brand-red",
                )}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={telHref(phone)}
              className="mt-5 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 font-display text-lg font-semibold uppercase tracking-wider shadow-[0_6px_24px_rgba(230,0,18,0.45)]"
            >
              <Phone className="h-5 w-5" /> Call {phone}
            </a>
            <Link
              href={loginHref}
              onClick={() => setOpen(false)}
              className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white"
            >
              {session?.user ? "Dashboard" : "Staff login"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

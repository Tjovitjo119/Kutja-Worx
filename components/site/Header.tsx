"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, Phone, ShoppingCart, User, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useCart } from "./CartProvider";
import { cn, telHref } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/cars", label: "Car Types" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line2 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4">
        <Link href="/" aria-label={`${name} home`} className="shrink-0">
          <Logo name={name} logo={logo} />
        </Link>
        <nav className="ml-auto hidden items-center gap-5 xl:flex" aria-label="Main">
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
        <div className="ml-auto flex items-center gap-2 xl:ml-4">
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
            className="rounded-md p-2 hover:bg-white/10 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid border-t border-ink-line2 bg-ink px-4 pb-4 xl:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "border-b border-ink-line py-3 text-sm font-semibold uppercase tracking-widest",
                active(l.href) && "text-brand-red",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={loginHref}
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-semibold uppercase tracking-widest text-white/70"
          >
            {session?.user ? "Dashboard" : "Login"}
          </Link>
        </nav>
      )}
    </header>
  );
}

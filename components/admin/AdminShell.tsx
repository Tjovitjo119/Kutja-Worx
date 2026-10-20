"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { NavIcon } from "./ui";
import { navFor } from "@/lib/admin-config";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export default function AdminShell({ role, name, demo, children }: { role: Role; name: string; demo: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const items = navFor(role);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setNewCount(s.newInquiries ?? 0))
      .catch(() => {});
  }, [pathname]);

  const isActive = (href: string) => (href === "/admin" || href === "/admin/reception" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={() => setOpen(false)}
          aria-current={isActive(n.href) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(n.href) ? "bg-brand-red text-white" : "text-gray-300 hover:bg-white/10 hover:text-white",
          )}
        >
          <NavIcon name={n.icon} className="h-4 w-4" />
          {n.label}
          {n.badge === "inquiries" && newCount > 0 && (
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-brand-red">{newCount}</span>
          )}
        </Link>
      ))}
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo name="Kutja Worx" />
        </div>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/60" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-ink text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo name="Kutja Worx" />
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {demo && (
          <div role="status" className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
            Demo mode: Sanity isn&apos;t connected yet, so changes are temporary and photo upload is disabled.
          </div>
        )}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <button className="rounded p-1 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="flex items-center gap-1 text-gray-500 hover:text-brand-red">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize">
              {name} · {role}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

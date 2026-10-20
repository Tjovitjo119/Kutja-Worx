"use client";

import Link from "next/link";
import { createElement, type ReactNode } from "react";
import {
  Car,
  Cog,
  FolderOpen,
  Image as ImageIcon,
  Images,
  Inbox,
  LayoutDashboard,
  Receipt,
  Settings,
  SlidersHorizontal,
  Tag,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navIcons: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "folder-open": FolderOpen,
  "sliders-horizontal": SlidersHorizontal,
  image: ImageIcon,
  wrench: Wrench,
  car: Car,
  cog: Cog,
  receipt: Receipt,
  images: Images,
  tag: Tag,
  inbox: Inbox,
  users: Users,
  settings: Settings,
};
export const NavIcon = ({ name, className }: { name: string; className?: string }) =>
  createElement(navIcons[name] ?? LayoutDashboard, { className });

export const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-100";

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-gray-500">{sub}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export const AButton = ({
  variant = "red",
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "red" | "outline" | "ghost" }) => (
  <button
    {...p}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
      variant === "red" && "bg-brand-red text-white shadow hover:bg-brand-dark",
      variant === "outline" && "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      variant === "ghost" && "text-gray-600 hover:bg-gray-100",
      className,
    )}
  />
);

export const ALink = ({
  href,
  variant = "red",
  className,
  children,
}: {
  href: string;
  variant?: "red" | "outline";
  className?: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
      variant === "red"
        ? "bg-brand-red text-white shadow hover:bg-brand-dark"
        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      className,
    )}
  >
    {children}
  </Link>
);

export const Panel = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("rounded-xl border border-gray-200 bg-white p-5 shadow-sm", className)}>{children}</div>
);

export function StatCard({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-red/60">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function StatusBadge({ tone, children }: { tone: "ok" | "warn" | "info" | "muted" | "red"; children: ReactNode }) {
  const t = {
    ok: "bg-green-100 text-green-700",
    warn: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    muted: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-700",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", t[tone])}>{children}</span>;
}

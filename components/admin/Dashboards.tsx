import Link from "next/link";
import { Car, Cog, Plus, Tag, Wrench, DollarSign } from "lucide-react";
import { ALink, Panel, StatCard, StatusBadge } from "./ui";
import { timeAgo } from "@/lib/utils";
import type { Doc } from "@/lib/types";

const activityText = (d: any) => {
  const created = d._createdAt && d._updatedAt && new Date(d._updatedAt).getTime() - new Date(d._createdAt).getTime() < 2000;
  switch (d._type) {
    case "vehicle":
      return `${created ? "New car type added" : "Car type updated"}: ${d.title}`;
    case "part":
      return `${created ? "New part added" : "Part updated"}: ${d.title}`;
    case "service":
      return `${created ? "Service added" : "Service updated"}: ${d.title}`;
    case "priceListItem":
      return `Price updated: ${d.name}`;
    case "galleryImage":
      return `Gallery image ${created ? "uploaded" : "updated"}${d.caption ? `: ${d.caption}` : ""}`;
    case "special":
      return `Special ${created ? "added" : "updated"}: ${d.title}`;
    case "inquiry":
      return `New inquiry from ${d.name}${d.service ? ` (${d.service})` : ""}`;
    default:
      return `${d._type} updated`;
  }
};

export function RecentActivity({ items }: { items: Doc[] }) {
  return (
    <Panel>
      <h2 className="mb-3 font-semibold">Recent Activity</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((d) => (
            <li key={d._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="truncate">{activityText(d)}</span>
              <span className="shrink-0 text-xs text-gray-400">{timeAgo(d._updatedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function QuickActions() {
  const actions = [
    { href: "/admin/vehicles/new", label: "Add Car Type", Icon: Car },
    { href: "/admin/parts/new", label: "Add Part", Icon: Cog },
    { href: "/admin/services/new", label: "Add Service", Icon: Wrench },
    { href: "/admin/specials/new", label: "Add Special", Icon: Tag },
  ];
  return (
    <Panel>
      <h2 className="mb-3 font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map(({ href, label, Icon }) => (
          <ALink key={href} href={href} className="py-3">
            <Icon className="h-4 w-4" /> {label}
          </ALink>
        ))}
      </div>
    </Panel>
  );
}

export function OwnerDashboard({
  name,
  stats,
}: {
  name: string;
  stats: { vehicles: number; parts: number; services: number; inquiries: number; recent: Doc[] };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {name}!</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Car Types" value={stats.vehicles} href="/admin/vehicles" />
        <StatCard label="Total Parts" value={stats.parts} href="/admin/parts" />
        <StatCard label="Total Services" value={stats.services} href="/admin/services" />
        <StatCard label="Total Inquiries" value={stats.inquiries} href="/admin/inquiries" />
      </div>
      <RecentActivity items={stats.recent} />
      <QuickActions />
    </div>
  );
}

export function ReceptionDashboard({ stats, inquiries }: { stats: { newInquiries: number }; inquiries: Doc[] }) {
  const open = inquiries.filter((i: any) => i.status !== "closed");
  const quotes = inquiries.filter((i: any) => ["quote", "parts-cart"].includes(i.source) && i.status !== "closed").length;
  const tone = (s: string) => (s === "new" ? "info" : s === "in-progress" ? "warn" : s === "contacted" ? "ok" : "muted");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reception Dashboard</h1>
        <p className="text-sm text-gray-500">Front-desk overview</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New Inquiries" value={stats.newInquiries} href="/admin/inquiries" />
        <StatCard label="Pending Quotes" value={quotes} href="/admin/inquiries" />
        <StatCard label="Open Inquiries" value={open.length} href="/admin/inquiries" />
        <StatCard label="All Inquiries" value={inquiries.length} href="/admin/inquiries" />
      </div>
      <Panel>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm font-medium text-brand-red hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-gray-500">
                <th className="py-2">Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.slice(0, 6).map((i: any) => (
                <tr key={i._id}>
                  <td className="py-2.5 font-medium">{i.name}</td>
                  <td className="text-gray-600">{i.service ?? "-"}</td>
                  <td className="text-gray-500">{timeAgo(i._createdAt)}</td>
                  <td>
                    <StatusBadge tone={tone(i.status) as any}>{i.status}</StatusBadge>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No inquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel>
        <h2 className="mb-3 font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ALink href="/admin/gallery/new" variant="outline">
            <Plus className="h-4 w-4" /> Upload Photo
          </ALink>
          <ALink href="/admin/inquiries" variant="outline">
            <DollarSign className="h-4 w-4" /> Inquiries
          </ALink>
          <ALink href="/admin/gallery" variant="outline">
            Gallery
          </ALink>
          <ALink href="/" variant="outline">
            View site
          </ALink>
        </div>
      </Panel>
    </div>
  );
}

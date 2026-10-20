import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";

const sections = [
  { href: "/admin/site-settings", title: "Site Settings", text: "Business name, phones, address, social links, about text, statistics." },
  { href: "/admin/hero-content", title: "Hero Content", text: "Home page headline, brands strip, buttons and background photo." },
  { href: "/admin/services", title: "Services", text: "What the workshop offers, with prices." },
  { href: "/admin/service-categories", title: "Service Categories", text: "The groups shown on the Services page." },
  { href: "/admin/vehicles", title: "Car Types", text: "The makes and models you work on." },
  { href: "/admin/parts", title: "Parts", text: "Parts catalogue and prices." },
  { href: "/admin/part-categories", title: "Part Categories", text: "Groups shown on the Parts page." },
  { href: "/admin/price-list", title: "Price List", text: "Service price tables." },
  { href: "/admin/gallery", title: "Gallery", text: "Workshop and project photos." },
  { href: "/admin/specials", title: "Specials", text: "Promotions shown on the home page." },
  { href: "/admin/testimonials", title: "Testimonials", text: "Genuine customer reviews (shown on the home page when added)." },
];

export default function ContentHub() {
  return (
    <>
      <PageHeader title="Content" sub="Everything that appears on the website." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Panel className="flex h-full items-center justify-between gap-3 transition-colors hover:border-brand-red/60">
              <div>
                <h2 className="font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{s.text}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </Panel>
          </Link>
        ))}
      </div>
    </>
  );
}

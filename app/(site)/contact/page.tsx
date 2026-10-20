import type { Metadata } from "next";
import { BadgeDollarSign, Mail, MapPin, Phone, ShieldCheck, ThumbsUp, Wrench } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import EnquiryForm from "@/components/site/EnquiryForm";
import { getServices, getSettings } from "@/lib/data";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call or visit Kutja Worx at 213A Dykor Street, Silverton, Pretoria, or request a quote online.",
};

const trust = [
  { Icon: ShieldCheck, t: "Quality Workmanship", s: "Guaranteed" },
  { Icon: BadgeDollarSign, t: "Competitive Pricing", s: "No hidden costs" },
  { Icon: Wrench, t: "Expert Technicians", s: "Skilled & experienced" },
  { Icon: ThumbsUp, t: "Customer Satisfaction", s: "Our priority" },
];

export default async function ContactPage({ searchParams }: { searchParams: { service?: string } }) {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  const map = s.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;
  const options = [...new Set([...services.map((x) => x.title), "Quote", "Custom part", "Other"])];
  const icon = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red";
  return (
    <>
      <PageHero
        white="Get in"
        red="Touch"
        sub="Have a question or need a quote? We're here to help. Contact us for quotes, bookings or any enquiries."
        photo="/cars/bmw-e30-325i.webp"
      />
      <section className="bg-ink py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className={icon}>
                <Phone className="h-5 w-5" />
              </span>
              <div className="text-lg font-semibold">
                {s.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="block hover:text-brand-red">
                    {p}
                  </a>
                ))}
              </div>
            </div>
            {s.email && (
              <div className="flex items-center gap-4">
                <span className={icon}>
                  <Mail className="h-5 w-5" />
                </span>
                <a href={`mailto:${s.email}`} className="text-lg font-semibold hover:text-brand-red">
                  {s.email}
                </a>
              </div>
            )}
            <div className="flex items-center gap-4">
              <span className={icon}>
                <MapPin className="h-5 w-5" />
              </span>
              <p className="max-w-xs text-lg font-semibold">{s.address}</p>
            </div>
            {!!s.openingHours?.length && (
              <ul className="pl-14 text-sm text-muted">
                {s.openingHours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <div className="relative h-72 overflow-hidden rounded-xl border border-ink-line2">
              <iframe
                title="Kutja Worx location map"
                src={map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full [filter:invert(92%)_hue-rotate(180deg)_saturate(0.7)_brightness(0.9)_contrast(0.95)]"
              />
            </div>
          </div>
          <div className="self-start rounded-2xl border border-brand-red/70 bg-ink-panel p-6 shadow-[inset_0_0_30px_rgba(230,0,18,0.08)] sm:p-8">
            <EnquiryForm services={options} defaultService={searchParams.service} />
          </div>
        </div>
      </section>
      <section className="border-t border-ink-line2 bg-ink-deep">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-6 lg:grid-cols-4">
          {trust.map(({ Icon, t, s: sub }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="h-9 w-9 shrink-0 text-brand-red" aria-hidden />
              <p className="text-[11px] font-semibold uppercase leading-snug tracking-wider">
                {t}
                <br />
                <span className="font-normal normal-case text-muted">{sub}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

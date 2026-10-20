import type { Metadata } from "next";
import { BadgeDollarSign, ShieldCheck, ThumbsUp, Wrench } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { CtaStrip } from "@/components/site/HomeSections";
import { SectionHeading } from "@/components/ui/primitives";
import { getSettings } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "About",
  description: "About Kutja Worx, a performance and repair workshop in Silverton, Pretoria.",
};

const values = [
  { Icon: ShieldCheck, title: "Quality Workmanship", text: "Every job is done properly, the first time." },
  { Icon: BadgeDollarSign, title: "Competitive Pricing", text: "Fair, transparent prices with no hidden costs." },
  { Icon: Wrench, title: "Expert Technicians", text: "Skilled, experienced and passionate about cars." },
  { Icon: ThumbsUp, title: "Customer Satisfaction", text: "Your trust is our priority, always." },
];

export default async function AboutPage() {
  const s = await getSettings();
  const counters = [
    { n: s.stats?.yearsInBusiness, label: "Years in business" },
    { n: s.stats?.carsServiced, label: "Cars serviced" },
    { n: s.stats?.happyCustomers, label: "Happy customers" },
  ].filter((c) => (c.n ?? 0) > 0);

  return (
    <>
      <PageHero white="About" red="Us" sub={`Meet the team behind ${s.name}.`} art="/api/art/workshop" />
      <section className="bg-ink py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading white="Built for" red="Performance" eyebrow="Our story" />
          <p className="mt-5 max-w-2xl whitespace-pre-line leading-relaxed text-white/85">{s.about}</p>
          {counters.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-8">
              {counters.map((c) => (
                <div key={c.label}>
                  <dd className="font-display text-5xl font-bold text-brand-red">{c.n}+</dd>
                  <dt className="text-xs uppercase tracking-widest text-muted">{c.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-ink-line2 bg-ink-panel p-6 transition-colors hover:border-brand-red/70">
                <Icon className="h-9 w-9 text-brand-red" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaStrip phone={s.phones[0]} />
    </>
  );
}

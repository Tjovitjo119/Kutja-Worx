import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import EnquiryForm from "@/components/site/EnquiryForm";
import ImageGallery from "@/components/site/ImageGallery";
import { docImages, getSettings, getVehicle } from "@/lib/data";
import { telHref } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const v = await getVehicle(params.slug);
  if (!v) return { title: "Car type not found" };
  return {
    title: `${v.title} servicing & repairs`,
    description: v.description?.slice(0, 160) ?? `${v.title} servicing, repairs and modifications at Kutja Worx, Silverton, Pretoria.`,
  };
}

export default async function CarTypePage({ params }: { params: { slug: string } }) {
  const [v, settings] = await Promise.all([getVehicle(params.slug), getSettings()]);
  if (!v) notFound();
  const images = docImages("vehicle", v).map((i) => i.src);
  const details = v.specs ?? [];

  return (
    <section className="bg-ink py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href="/cars"
          className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All car types
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ImageGallery images={images} alt={v.title} />
          <div>
            <h1 className="font-display text-4xl font-bold uppercase leading-none sm:text-5xl">{v.title}</h1>
            {v.tagline && <p className="mt-2 text-sm uppercase tracking-widest text-brand-red">{v.tagline}</p>}
            {v.yearRange && <p className="mt-2 text-sm text-muted">{v.yearRange}</p>}
            {v.description && <p className="mt-4 text-sm leading-relaxed text-white/80">{v.description}</p>}
            {details.length > 0 && (
              <table className="mt-6 w-full overflow-hidden rounded-lg border border-ink-line2 text-sm">
                <tbody className="divide-y divide-ink-line">
                  {details.map((s) => (
                    <tr key={s.label} className="bg-ink-panel/60">
                      <th className="w-1/3 px-4 py-2 text-left font-medium text-muted">{s.label}</th>
                      <td className="px-4 py-2">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <a
              href={telHref(settings.phones[0])}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-3 font-display text-sm font-semibold uppercase tracking-wider hover:bg-brand-dark"
            >
              <Phone className="h-4 w-4" /> Call {settings.phones[0]}
            </a>
          </div>
        </div>
        <div id="enquire" className="mt-10 max-w-2xl rounded-2xl border border-brand-red/60 bg-ink-panel p-6">
          <EnquiryForm
            endpoint="/api/vehicle-enquire"
            relatedItem={v.title}
            defaultMessage={`I'd like a quote for work on my ${v.title}. `}
            title={`Get a quote for your ${v.title}`}
            button="Request Quote"
          />
        </div>
      </div>
    </section>
  );
}

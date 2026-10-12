import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SiteContent } from "@/lib/content";

export default function Specials({ specials }: { specials: SiteContent["specials"] }) {
  if (!specials.length) return null;
  return (
    <section id="specials" className="bg-brand-red py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="section-title mb-6">Specials</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {specials.map((s) => (
            <article key={s._id} className="flex overflow-hidden bg-ink">
              {s.image && (
                <Image src={urlFor(s.image).width(300).height(300).url()} alt="" width={150} height={150} unoptimized className="h-auto w-28 object-cover sm:w-40" />
              )}
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold uppercase">{s.title}</h3>
                {s.description && <p className="mt-1 text-white/80">{s.description}</p>}
                {s.expiryDate && (
                  <p className="mt-2 text-sm uppercase tracking-wide text-brand-red">
                    Valid until {new Date(s.expiryDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

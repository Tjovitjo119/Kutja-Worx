import Link from "next/link";
import { Photo } from "@/components/ui/primitives";
import type { Vehicle } from "@/lib/types";

export type VehicleWithImg = Vehicle & { _img: string };

/** A car type the workshop works on (not a car for sale). */
export default function VehicleCard({ v }: { v: VehicleWithImg; compact?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-ink-line2 bg-ink-panel transition-colors hover:border-brand-red/70">
      <Link href={`/cars/${v.slug}`} className="relative block aspect-[4/3] overflow-hidden" aria-label={`View ${v.title}`}>
        <Photo
          src={v._img}
          alt={v.title}
          className="transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width:1024px) 25vw, 50vw"
        />
      </Link>
      <div className="p-3">
        <h3 className="font-display text-base font-bold uppercase leading-tight">{v.title}</h3>
        {v.tagline && <p className="mt-0.5 text-xs text-muted">{v.tagline}</p>}
        <Link
          href={`/cars/${v.slug}`}
          className="mt-3 block rounded-md bg-brand-red py-2 text-center font-display text-xs font-semibold uppercase tracking-wider hover:bg-brand-dark"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

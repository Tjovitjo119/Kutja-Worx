import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { Arrow } from "./Icons";

const cta = "btn btn-red !px-4 !py-2 !text-xs";

export default function HomeTeasers({ settings }: { settings: SiteContent["settings"] }) {
  return (
    <>
      {/* About teaser */}
      <section className="relative overflow-hidden border-t-4 border-white/90 bg-ink">
        <div className="relative md:min-h-[22rem]">
          <DiagonalPanel side="right" cut="12%" className="relative h-48 md:absolute md:inset-y-0 md:left-0 md:h-auto md:w-[45%]">
            <Photo fallback="/art/car-black.svg" alt="" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/20 to-transparent" />
          </DiagonalPanel>
          <div className="relative mx-auto flex max-w-7xl justify-end px-4 py-10 md:py-16">
            <Reveal className="md:w-[50%]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-red">About {settings.businessName}</p>
              <h2 className="display mt-2 text-4xl sm:text-5xl">
                Built for <span className="text-brand-red">Performance</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">{settings.about}</p>
              <Link href="/about" className={`${cta} mt-6`}>
                Learn more <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="relative overflow-hidden bg-ink-deep">
        <div className="relative md:min-h-[18rem]">
          <DiagonalPanel side="left" cut="14%" className="relative h-48 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[55%]">
            <Photo fallback="/art/lift.svg" alt="" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/30 to-transparent" />
          </DiagonalPanel>
          <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
            <Reveal className="md:w-[45%]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-red">Our Services</p>
              <h2 className="display mt-2 text-4xl sm:text-5xl">
                What we <span className="text-brand-red">do</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
                From routine maintenance to high-performance builds, we have the expertise and equipment to get the job done.
              </p>
              <Link href="/services" className={`${cta} mt-6`}>
                View all services <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

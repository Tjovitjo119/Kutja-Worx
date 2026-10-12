import ContactForm from "./ContactForm";
import DiagonalPanel from "./DiagonalPanel";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { Facebook, Phone, Pin } from "./Icons";
import { telHref, type SiteContent } from "@/lib/content";

const circle = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-white";

export default function ContactSection({ settings }: { settings: SiteContent["settings"] }) {
  const map = `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`;
  return (
    <section id="contact" className="relative overflow-hidden bg-ink">
      <div className="relative">
        <DiagonalPanel side="left" cut="16%" className="relative h-52 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
          <Photo fallback="/art/lift.svg" alt="Kutja Worx workshop" width={1600} className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
        </DiagonalPanel>
        <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-20 bg-brand-red md:block [clip-path:polygon(60%_0,100%_0,40%_100%,0_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 md:pb-14 md:pt-14">
          <Reveal>
            <h2 className="section-title">
              Get in <span className="text-brand-red">Touch</span>
            </h2>
            <p className="mt-4 max-w-xs text-white/90">Have a question or need a quote? We&apos;re here to help.</p>
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <span className={circle}>
                  <Pin className="h-5 w-5" />
                </span>
                <p className="max-w-[16rem] text-sm font-semibold">{settings.address}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={circle}>
                  <Phone className="h-5 w-5" />
                </span>
                <div className="text-sm font-semibold">
                  {settings.phoneNumbers.map((n) => (
                    <a key={n} href={telHref(n)} className="block hover:text-brand-red">
                      {n}
                    </a>
                  ))}
                </div>
              </div>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="block pl-14 text-sm font-semibold hover:text-brand-red">
                  {settings.email}
                </a>
              )}
              {settings.hours && <p className="whitespace-pre-line pl-14 text-sm text-white/80">{settings.hours}</p>}
              <div className="flex items-center gap-3 border-t border-brand-red/70 pt-5">
                {settings.socialLinks.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.platform} className={circle}>
                    {l.platform === "Facebook" ? <Facebook /> : <span className="text-xs font-bold">{l.platform.slice(0, 2)}</span>}
                  </a>
                ))}
                <p className="text-[11px] font-semibold leading-tight">
                  {settings.businessName}
                  <br />
                  <span className="font-normal text-white/70">Performance &amp; Repair Specialists</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 lg:grid-cols-[1fr_1.7fr] md:pb-24">
        <div className="relative h-72 overflow-hidden border border-white/15 lg:h-auto lg:min-h-[320px]">
          <iframe
            title="Kutja Worx location"
            src={map}
            className="absolute inset-0 h-full w-full [filter:invert(92%)_hue-rotate(180deg)_saturate(0.7)_brightness(0.9)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="relative border border-brand-red/80 bg-ink-deep p-6 shadow-[inset_0_0_30px_rgba(227,30,36,0.12)] sm:p-8">
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-16 bg-brand-red/90 md:block [clip-path:polygon(0_0,60%_0,0_70%)]" />
          <div className="relative md:pl-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

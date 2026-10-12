import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function GearIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm9 4.5v-2l-2.1-.5a7 7 0 0 0-.7-1.6l1.1-1.9-1.4-1.4-1.9 1.1a7 7 0 0 0-1.6-.7L14 3h-2l-.5 2.1a7 7 0 0 0-1.6.7L8 4.7 6.6 6.1l1.1 1.9a7 7 0 0 0-.7 1.6L5 10.1v2l2.1.5c.2.6.4 1.1.7 1.6l-1.1 1.9L8 17.5l1.9-1.1c.5.3 1 .5 1.6.7L12 19.2h2l.5-2.1c.6-.2 1.1-.4 1.6-.7l1.9 1.1 1.4-1.4-1.1-1.9c.3-.5.5-1 .7-1.6L21 13Z" />
    </svg>
  );
}

export default function Logo({ name, logo }: { name: string; logo?: any }) {
  if (logo) {
    return (
      <Image src={urlFor(logo).height(96).url()} alt={name} width={160} height={48} className="h-11 w-auto" unoptimized />
    );
  }
  const [first, ...rest] = name.split(" ");
  return (
    <span className="flex items-center gap-2">
      <GearIcon className="h-9 w-9 text-white" />
      <span className="flex flex-col font-display font-bold italic leading-[0.85]">
        <span className="text-3xl uppercase text-brand-red">{first}</span>
        <span className="self-end text-lg uppercase text-white">{rest.join(" ")}</span>
      </span>
    </span>
  );
}

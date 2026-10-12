type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Phone = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const Pin = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const Mail = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Arrow = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} strokeWidth={2.5} className={className}><path d="m5 12 5 5 9-10" /></svg>
);
export const Wrench = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><path d="M14.5 6.5a4 4 0 0 0 5 5L10 21a2.1 2.1 0 0 1-3-3l9.5-9.5a4 4 0 0 0-2-2Z" transform="rotate(0)" /><path d="M14 4a4 4 0 0 1 5.5 5.5L17 7l-3-1Z" /></svg>
);
export const Gear = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" /><circle cx="12" cy="12" r="6.5" /></svg>
);
export const Clutch = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>
);
export const Spring = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><path d="M12 3v3M7 8l10-1.5M7 12l10-1.5M7 16l10-1.5M12 18v3" /></svg>
);
export const Engine = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><path d="M4 9h3l1-2h6l1 2h2v3h2v4h-2v2H7l-2-2v-2H3V9Z" /></svg>
);
export const Gauge = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><path d="M4 18a9 9 0 1 1 16 0" /><path d="m12 14 4-5" /></svg>
);
export const Laptop = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2 19h20" /></svg>
);
export const Shield = ({ className = "h-7 w-7" }: P) => (
  <svg {...base} className={className}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const Facebook = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M13.5 21v-7.5H16l.5-3h-3V8.700c0-.9.3-1.500 1.600-1.500h1.500V4.500A20 20 0 0 0 14.500 4.400c-2.300 0-3.800 1.400-3.800 3.900v2.200H8.200v3h2.500V21h2.800Z" /></svg>
);

export function serviceIcon(title: string, className?: string) {
  const t = title.toLowerCase();
  if (t.includes("clutch")) return <Clutch className={className} />;
  if (t.includes("suspension")) return <Spring className={className} />;
  if (t.includes("overhaul") || t.includes("conversion")) return <Engine className={className} />;
  if (t.includes("modif")) return <Gauge className={className} />;
  if (t.includes("diagnos")) return <Laptop className={className} />;
  if (t.includes("service")) return <Wrench className={className} />;
  return <Gear className={className} />;
}

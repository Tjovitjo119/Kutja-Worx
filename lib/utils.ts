import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** R8,500 style, as in the design mockups. */
export const formatZAR = (n?: number | null) => (typeof n === "number" ? "R" + Math.round(n).toLocaleString("en-US") : "");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const telHref = (n: string) => `tel:+27${n.replace(/\D/g, "").replace(/^0/, "")}`;
export const whatsappHref = (n: string, text = "") =>
  `https://wa.me/27${n.replace(/\D/g, "").replace(/^0/, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function timeAgo(iso?: string) {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 45) return "just now";
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, name] of units) {
    if (s >= secs) {
      const v = Math.floor(s / secs);
      return `${v} ${name}${v > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

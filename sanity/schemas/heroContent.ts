import { defineField, defineType } from "sanity";
import { img, str, text } from "./_helpers";

const cta = (name: string, title: string) => defineField({ name, title, type: "object", fields: [str("label"), str("href")] });

export default defineType({
  name: "heroContent",
  title: "Hero (home banner)",
  type: "document",
  fields: [
    str("headline", "Headline (white)"),
    str("headlineAccent", "Headline accent (red)"),
    text("subhead", 2, "Sub-headline"),
    defineField({ name: "brands", title: "Brands strip", type: "array", of: [{ type: "string" }] }),
    img("backgroundImage", "Background image"),
    cta("ctaPrimary", "Primary button"),
    cta("ctaSecondary", "Secondary button"),
  ],
  preview: { prepare: () => ({ title: "Hero (home banner)" }) },
});

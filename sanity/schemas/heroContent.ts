import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroContent",
  title: "Hero (top banner)",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheadline", title: "Sub-headline", type: "string" }),
    defineField({ name: "backgroundImage", title: "Background image", type: "image", options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: "Hero (top banner)" }) },
});

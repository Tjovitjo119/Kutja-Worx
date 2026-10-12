import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Photo",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "category",
      title: "Category (used for the filter buttons)",
      type: "string",
      options: { list: ["Engine Builds", "Suspension", "Diagnostics", "Workshop"] },
    }),
    defineField({ name: "order", title: "Display order (1 = first)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "caption", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Untitled photo", media }),
  },
});

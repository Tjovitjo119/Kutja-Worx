import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Short description (optional)", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Card photo (optional)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["General Service", "Engine Management"], layout: "radio" },
      initialValue: "General Service",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Display order (1 = first)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category" } },
});

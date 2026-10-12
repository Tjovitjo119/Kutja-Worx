import { defineField, defineType } from "sanity";

export default defineType({
  name: "specialOrPromo",
  title: "Special / Promo",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "expiryDate",
      title: "Expiry date",
      type: "date",
      description: "Hidden from the site automatically after this date. Leave empty to always show.",
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "title", subtitle: "expiryDate", media: "image" } },
});

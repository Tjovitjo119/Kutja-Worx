import { defineField } from "sanity";

export const img = (name: string, title: string) => defineField({ name, title, type: "image", options: { hotspot: true } });

export const imagesArray = (name = "images", title = "Images") =>
  defineField({ name, title, type: "array", of: [{ type: "image", options: { hotspot: true } }] });

export const order = defineField({ name: "order", title: "Display order (1 = first)", type: "number", initialValue: 100 });

export const slugField = defineField({
  name: "slug",
  title: "Slug (URL name)",
  type: "string",
  description: "Lower-case letters, numbers and dashes, e.g. bmw-e30-325i",
  validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: "slug" }),
});

export const str = (name: string, title?: string) => defineField({ name, title, type: "string" });
export const num = (name: string, title?: string) => defineField({ name, title, type: "number" });
export const text = (name: string, rows = 3, title?: string) => defineField({ name, title, type: "text", rows });
export const bool = (name: string, initial = false) => defineField({ name, type: "boolean", initialValue: initial });
export const titleReq = defineField({ name: "title", type: "string", validation: (r) => r.required() });

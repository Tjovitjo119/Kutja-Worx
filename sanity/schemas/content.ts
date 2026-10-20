import { defineField, defineType } from "sanity";
import { bool, img, order, str, text, titleReq } from "./_helpers";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery photo",
  type: "document",
  fields: [
    img("image", "Photo"),
    str("caption"),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "category", type: "string", options: { list: ["BMW", "VW", "Mercedes", "Ford", "Other"] }, initialValue: "Other" }),
    order,
  ],
  preview: { select: { title: "caption", subtitle: "category", media: "image" } },
});

export const special = defineType({
  name: "special",
  title: "Special / promo",
  type: "document",
  fields: [
    titleReq,
    text("description"),
    img("image", "Image"),
    str("discountText", "Discount text (e.g. 10% OFF)"),
    defineField({ name: "validFrom", type: "date" }),
    defineField({ name: "validUntil", type: "date", description: "Hidden from the site after this date." }),
    str("ctaLabel"),
    str("ctaHref"),
    bool("active", true),
  ],
  preview: { select: { title: "title", subtitle: "validUntil", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    str("vehicle"),
    defineField({ name: "rating", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "message", type: "text", rows: 3, validation: (r) => r.required() }),
    img("avatar", "Avatar"),
  ],
  preview: { select: { title: "name", subtitle: "vehicle" } },
});

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    str("name"),
    str("phone"),
    str("email"),
    str("service"),
    text("message", 4),
    defineField({ name: "source", type: "string", options: { list: ["contact", "parts-cart", "vehicle-enquiry", "quote"] } }),
    str("relatedItem"),
    defineField({ name: "status", type: "string", options: { list: ["new", "in-progress", "contacted", "closed"] }, initialValue: "new" }),
    text("notes"),
  ],
  preview: { select: { title: "name", subtitle: "status" } },
});

export const user = defineType({
  name: "user",
  title: "Staff user",
  type: "document",
  fields: [
    str("name"),
    str("email"),
    defineField({ name: "passwordHash", type: "string", hidden: true, readOnly: true }),
    defineField({ name: "role", type: "string", options: { list: ["owner", "admin", "reception"] } }),
    defineField({ name: "lastLogin", type: "datetime" }),
    bool("active", true),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});

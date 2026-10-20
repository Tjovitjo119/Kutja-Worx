import { defineField, defineType } from "sanity";
import { bool, imagesArray, num, order, slugField, str, text, titleReq } from "./_helpers";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    titleReq,
    slugField,
    str("category", "Category (service category title)"),
    text("shortDescription", 2),
    text("longDescription", 5),
    str("iconName", "Icon name (lucide icon)"),
    num("priceFrom", "Price from (R)"),
    str("priceNote"),
    order,
    bool("featured"),
    bool("published", true),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});

export const priceListItem = defineType({
  name: "priceListItem",
  title: "Price list item",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Service / item", type: "string", validation: (r) => r.required() }),
    str("description"),
    defineField({
      name: "group",
      type: "string",
      options: { list: ["General Servicing", "Engine Overhauling", "Clutch & Gearbox", "Suspension & Brakes"] },
    }),
    num("priceFrom", "Price from (R)"),
    num("priceTo", "Price to (R, optional)"),
    order,
  ],
  preview: { select: { title: "name", subtitle: "group" } },
});

export const vehicle = defineType({
  name: "vehicle",
  title: "Car type",
  type: "document",
  description: "A make/model the workshop works on. These are not cars for sale.",
  fields: [
    titleReq,
    slugField,
    str("make"),
    str("model"),
    str("yearRange", "Year / spec label"),
    str("tagline"),
    text("description", 5),
    defineField({
      name: "specs",
      title: "Common work / details",
      type: "array",
      of: [{ type: "object", fields: [str("label"), str("value")], preview: { select: { title: "label", subtitle: "value" } } }],
    }),
    imagesArray(),
    bool("featured"),
    order,
  ],
  preview: { select: { title: "title", subtitle: "make" } },
});

export const part = defineType({
  name: "part",
  title: "Part",
  type: "document",
  fields: [
    titleReq,
    slugField,
    str("category", "Category (part category title)"),
    str("brand"),
    str("sku"),
    defineField({ name: "price", title: "Price (R)", type: "number", validation: (r) => r.required().min(0) }),
    num("stock"),
    text("description", 4),
    imagesArray(),
    bool("featured"),
    bool("published", true),
    order,
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});

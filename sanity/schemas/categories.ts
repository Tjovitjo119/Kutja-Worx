import { defineType } from "sanity";
import { order, slugField, titleReq } from "./_helpers";

const category = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: "document",
    fields: [titleReq, slugField, order],
    preview: { select: { title: "title", subtitle: "slug" } },
  });

export const serviceCategory = category("serviceCategory", "Service category");
export const partCategory = category("partCategory", "Part category");
export const vehicleCategory = category("vehicleCategory", "Car make category");

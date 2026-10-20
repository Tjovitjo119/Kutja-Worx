import { defineField, defineType } from "sanity";
import { img, num, str, text } from "./_helpers";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Business name", type: "string", initialValue: "Kutja Worx" }),
    str("tagline", "Tagline"),
    img("logo", "Logo"),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [{ type: "string" }],
      description: "The first number is used for Call Now buttons.",
    }),
    str("email", "Email"),
    str("address", "Address"),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed URL (optional)", type: "url" }),
    defineField({ name: "openingHours", title: "Opening hours (one line each)", type: "array", of: [{ type: "string" }] }),
    text("about", 5, "About us text"),
    defineField({
      name: "socials",
      title: "Social links",
      type: "object",
      fields: ["facebook", "instagram", "whatsapp", "youtube"].map((n) => defineField({ name: n, title: n, type: "url" })),
    }),
    defineField({
      name: "stats",
      title: "Business statistics (shown on About page when above 0)",
      type: "object",
      fields: [num("yearsInBusiness", "Years in business"), num("carsServiced", "Cars serviced"), num("happyCustomers", "Happy customers")],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

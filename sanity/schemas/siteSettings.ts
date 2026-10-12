import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", title: "Business name", type: "string", initialValue: "Kutja Worx" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "phoneNumbers",
      title: "Phone numbers",
      type: "array",
      of: [{ type: "string" }],
      description: "The first number is used for the Call Now button.",
    }),
    defineField({ name: "email", title: "Email (shown on site, optional)", type: "string" }),
    defineField({ name: "about", title: "About us text", type: "text", rows: 5 }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({ name: "hours", title: "Opening hours (optional)", type: "text", rows: 3 }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: { list: ["Facebook", "Instagram", "TikTok", "WhatsApp", "X / Twitter", "YouTube"] },
            },
            { name: "url", title: "URL", type: "url" },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

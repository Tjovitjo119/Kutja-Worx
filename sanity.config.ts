"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

const singletons = ["siteSettings", "heroContent"];

/**
 * Raw Studio (power-user fallback at /studio). Day-to-day editing happens in the
 * custom dashboard at /admin; both edit the same Sanity dataset.
 */
export default defineConfig({
  name: "kutja-worx",
  title: "Kutja Worx",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      singletons.includes(schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Kutja Worx")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Hero (home banner)")
              .id("heroContent")
              .child(S.document().schemaType("heroContent").documentId("heroContent")),
            S.divider(),
            S.documentTypeListItem("vehicle").title("Car types"),
            S.documentTypeListItem("part").title("Parts"),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("priceListItem").title("Price list"),
            S.documentTypeListItem("galleryImage").title("Gallery"),
            S.documentTypeListItem("special").title("Specials"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.divider(),
            S.documentTypeListItem("inquiry").title("Inquiries"),
            S.documentTypeListItem("serviceCategory").title("Service categories"),
            S.documentTypeListItem("partCategory").title("Part categories"),
            S.documentTypeListItem("vehicleCategory").title("Car make categories"),
            S.documentTypeListItem("user").title("Staff users"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

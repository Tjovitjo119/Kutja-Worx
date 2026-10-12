"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

const singletons = ["siteSettings", "heroContent"];

export default defineConfig({
  name: "kutja-worx",
  title: "Kutja Worx",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  schema: {
    types: schemaTypes,
    // singletons can't be created again from the "new document" menu
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
            S.listItem().title("Site Settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem().title("Hero (top banner)").id("heroContent").child(S.document().schemaType("heroContent").documentId("heroContent")),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("galleryImage").title("Gallery Photos"),
            S.documentTypeListItem("specialOrPromo").title("Specials / Promos"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

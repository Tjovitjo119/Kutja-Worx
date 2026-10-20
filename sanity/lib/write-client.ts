import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

/** Server-side only. Needs SANITY_API_WRITE_TOKEN (Editor role or higher). */
export const writeConfigured = Boolean(projectId && process.env.SANITY_API_WRITE_TOKEN);

export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

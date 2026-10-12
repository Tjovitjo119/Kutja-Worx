const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// A real Sanity project ID is lowercase a-z, 0-9 and dashes only.
// This also catches the unfilled ".env.example" placeholder
// ("your_project_id") so the site falls back to default content
// instead of crashing when Sanity hasn't been set up yet.
const validProjectId = /^[a-z0-9-]+$/.test(rawProjectId);

export const projectId = validProjectId ? rawProjectId : "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-10-01";
export const sanityConfigured = Boolean(projectId);

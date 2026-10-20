/**
 * Default content, used (a) as the fallback while Sanity is empty/unconfigured,
 * (b) as the demo-mode store, and (c) by `npm run seed`.
 * Contact details come from the client's flyer. Prices/vehicles/parts are
 * PLACEHOLDERS from the design mockups -- replace them in /admin before launch.
 * No testimonials, social links, opening hours or business statistics are
 * seeded on purpose: those must come from the client, not from us.
 */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type D = Record<string, any>;

export const serviceCategories = [
  "General Servicing",
  "Engine Overhauling",
  "Clutch & Gearbox",
  "Suspension & Brakes",
  "Engine Conversions",
  "Engine Modifications",
  "Diagnostics",
  "Engine Management",
  "Performance Upgrades",
].map((title, i): D => ({ _id: `serviceCategory-${slug(title)}`, _type: "serviceCategory", title, slug: slug(title), order: i + 1 }));

export const partCategories = [
  "Engine Parts",
  "Suspension & Brakes",
  "Clutch & Gearbox",
  "Performance Parts",
  "Electrical & Sensors",
  "Exhaust Systems",
  "Cooling Systems",
  "Filters & Fluids",
  "Body & Interior",
  "Tools & Workshop",
].map((title, i): D => ({ _id: `partCategory-${slug(title)}`, _type: "partCategory", title, slug: slug(title), order: i + 1 }));

const svc = (
  title: string,
  category: string,
  iconName: string,
  shortDescription: string,
  priceFrom: number | undefined,
  order: number,
  featured = false,
): D => ({
  _id: `service-${slug(title)}`,
  _type: "service",
  title,
  slug: slug(title),
  category,
  iconName,
  shortDescription,
  priceFrom,
  priceNote: priceFrom ? undefined : "Quote on request",
  order,
  featured,
  published: true,
});

export const services: D[] = [
  svc("Minor & Major Services", "General Servicing", "wrench", "Full vehicle servicing, oil changes, filters and more.", 850, 1, true),
  svc("Engine Overhauling", "Engine Overhauling", "cog", "Complete engine rebuilds and repairs.", 12000, 2, true),
  svc("Clutch Kit Replacement", "Clutch & Gearbox", "disc", "Smooth shifting, better performance.", 4500, 3, true),
  svc("Suspension Replacement", "Suspension & Brakes", "arrow-down-up", "Improved handling, total control.", 5500, 4, true),
  svc("Engine Conversions", "Engine Conversions", "settings", "More power. More possibilities.", 18000, 5, true),
  svc("Engine Modifications", "Engine Modifications", "gauge", "Unlock your vehicle's true potential.", 10000, 6, true),
  svc("Diagnosis", "Diagnostics", "laptop", "Accurate fault finding. Real solutions.", 600, 7, false),
  svc("Performance Upgrades", "Performance Upgrades", "zap", "More power, more control.", 2500, 8, false),
  svc("Dictator", "Engine Management", "cpu", "Dictator engine management installation and tuning.", undefined, 9),
  svc("Sustech", "Engine Management", "cpu", "Sustech engine management installation and tuning.", undefined, 10),
  svc("Spitronics", "Engine Management", "cpu", "Spitronics engine management installation and tuning.", undefined, 11),
  svc("Powermods", "Engine Management", "cpu", "Powermods engine management installation and tuning.", undefined, 12),
];

const pl = (group: string, name: string, description: string, priceFrom: number, order: number): D => ({
  _id: `price-${slug(group)}-${slug(name)}`,
  _type: "priceListItem",
  group,
  name,
  description,
  priceFrom,
  order,
});

export const priceListItems: D[] = [
  pl("General Servicing", "Minor Service", "Oil & filter, basic check", 1200, 1),
  pl("General Servicing", "Major Service", "Full service, filters, inspection", 2500, 2),
  pl("General Servicing", "Diagnostic Check", "Full system scan", 600, 3),
  pl("Engine Overhauling", "1.4 / 1.6 (Polo / Golf)", "Rebuild & restore", 12000, 4),
  pl("Engine Overhauling", "2.0 (TFSI / GTI)", "Performance build", 18000, 5),
  pl("Engine Overhauling", "BMW E30 / E36", "Full rebuild", 20000, 6),
  pl("Engine Overhauling", "VR6 (3.2 / 2.8)", "Engine rebuild", 25000, 7),
  pl("Clutch & Gearbox", "Clutch Kit Replacement", "OEM / Performance", 4500, 8),
  pl("Clutch & Gearbox", "Gearbox Repair", "Rebuild / Replace", 7500, 9),
  pl("Suspension & Brakes", "Suspension Kit", "Lowering / Performance", 5500, 10),
  pl("Suspension & Brakes", "Brake Upgrade", "Pads, Discs, Calipers", 4000, 11),
];

// "Vehicles" are the car types the workshop works on (NOT cars for sale): no prices, mileage or stock status.
const veh = (
  title: string,
  make: string,
  model: string,
  yearRange: string,
  tagline: string,
  order: number,
  featured: boolean,
  photo?: string,
): D => ({
  _id: `vehicle-${slug(title)}`,
  _type: "vehicle",
  title,
  slug: slug(title),
  make,
  model,
  yearRange,
  tagline,
  description: `We service, repair and modify the ${title}: ${tagline.toLowerCase()}. Placeholder text, replace it in the admin dashboard.`,
  specs: [],
  featured,
  order,
  // Local file in /public, uploaded to Sanity by `npm run seed`; shown directly until then.
  ...(photo ? { photo } : {}),
});

export const vehicles: D[] = [
  veh("BMW E30 325i", "BMW", "E30 325i", "1982 - 1991", "Classic / Performance", 1, true, "/cars/bmw-e30-325i.webp"),
  veh("BMW E36", "BMW", "E36", "1992 - 1999", "Performance / Builds", 2, true, "/cars/bmw-e36.webp"),
  veh("BMW E36 Group A", "BMW", "E36 Group A", "1992 - 1999", "Motorsport / Track Build", 3, true, "/cars/bmw-e36-group-a.webp"),
  veh("VW Polo", "Volkswagen", "Polo", "Mk6", "Hot Hatch / Daily", 4, true, "/cars/vw-polo.webp"),
  veh("VW Golf GTI", "Volkswagen", "Golf GTI", "Mk7 / Mk7.5", "Hot Hatch / Performance", 5, true, "/cars/vw-golf-gti-red.jpg"),
  veh("BMW E30 Build", "BMW", "E30", "1982 - 1991", "Modified / Show Car", 6, true, "/cars/bmw-e30-red.jpg"),
  veh("VW Polo GTI", "Volkswagen", "Polo GTI", "6R / 6C", "Hot Hatch / Tuning", 7, false),
  veh("VW Caddy", "Volkswagen", "Caddy", "Mk3", "Utility / Build", 8, false),
  veh("Mercedes-Benz C-Class", "Mercedes-Benz", "C-Class", "W204", "Luxury / Performance", 9, false),
  veh("VW Golf VR6", "Volkswagen", "Golf VR6", "Mk3", "Performance / Engine Swap", 10, false),
  veh("Ford Fiesta ST", "Ford", "Fiesta ST", "Mk7", "Hot Hatch / Tuning", 11, false),
];

const part = (title: string, category: string, price: number, brand: string, order: number): D => ({
  _id: `part-${slug(title)}`,
  _type: "part",
  title,
  slug: slug(title),
  category,
  brand,
  price,
  stock: 5,
  description: `${title}. Placeholder listing, replace with real stock in the admin dashboard.`,
  featured: order <= 6,
  published: true,
  order,
});

export const parts: D[] = [
  part("Turbocharger", "Engine Parts", 8500, "Garrett", 1),
  part("Performance Intake", "Performance Parts", 4200, "Forge", 2),
  part("Brake Discs & Pads", "Suspension & Brakes", 2800, "Brembo", 3),
  part("Coilovers", "Suspension & Brakes", 7500, "KW", 4),
  part("Exhaust System", "Exhaust Systems", 6800, "Milltek", 5),
  part("Engine Mounts", "Engine Parts", 1800, "Powerflex", 6),
  part("GTI Intake Kit", "Performance Parts", 4500, "APR", 7),
  part("Clutch Kit", "Clutch & Gearbox", 3900, "Sachs", 8),
  part("ECU Tuning (Stage 1)", "Electrical & Sensors", 5500, "Kutja Worx", 9),
];

const gal = (caption: string, category: string, order: number, photo?: string): D => ({
  _id: `gallery-${slug(caption)}-${order}`,
  _type: "galleryImage",
  caption,
  category,
  tags: [],
  order,
  ...(photo ? { photo } : {}),
});

export const galleryImages: D[] = [
  gal("BMW E30 325i", "BMW", 1, "/cars/bmw-e30-325i.webp"),
  gal("BMW E36 Group A", "BMW", 2, "/cars/bmw-e36-group-a.webp"),
  gal("BMW E36", "BMW", 3, "/cars/bmw-e36.webp"),
  gal("VW Polo", "VW", 4, "/cars/vw-polo.webp"),
  gal("VW Golf GTI", "VW", 5, "/cars/vw-golf-gti-red.jpg"),
  gal("BMW E30 build", "BMW", 6, "/cars/bmw-e30-red.jpg"),
  gal("Stanced BMWs", "BMW", 7, "/cars/bmw-stance-pair.jpg"),
  gal("Engine build", "Other", 8),
  gal("Workshop lift", "Other", 9),
  gal("Clutch kit", "Other", 10),
  gal("Suspension work", "Other", 11),
  gal("Diagnostics", "Other", 12),
];

export const siteSettings: D = {
  _id: "siteSettings",
  _type: "siteSettings",
  name: "Kutja Worx",
  tagline: "Performance & Repair Specialists",
  phones: ["071 673 8293", "068 028 1903"],
  email: "kutjaworx@gmail.com",
  address: "213A Dykor Street, Silverton, Pretoria",
  mapEmbedUrl: "",
  openingHours: [],
  socials: {},
  stats: {},
  about:
    "Kutja Worx is a Silverton workshop built on mechanical know-how and a love of performance. From routine servicing to full engine builds and engine management installations, we do the job properly and treat your car like our own.",
};

export const heroContent: D = {
  _id: "heroContent",
  _type: "heroContent",
  photo: "/cars/bmw-e30-325i.webp",
  headline: "Performance &",
  headlineAccent: "Repair Specialists",
  subhead: "From daily drivers to high performance builds, we do it all. Quality work. Expert service. Trusted.",
  brands: ["Volkswagen", "BMW", "Audi", "Ford", "Mercedes", "All Makes"],
  ctaPrimary: { label: "Call Now", href: "tel" },
  ctaSecondary: { label: "Get a Quote", href: "/contact" },
};

/** Everything keyed by Sanity _type. */
export const seedByType: Record<string, D[]> = {
  serviceCategory: serviceCategories,
  partCategory: partCategories,
  service: services,
  priceListItem: priceListItems,
  vehicle: vehicles,
  part: parts,
  galleryImage: galleryImages,
  special: [],
  testimonial: [],
  inquiry: [],
  user: [],
  siteSettings: [siteSettings],
  heroContent: [heroContent],
};

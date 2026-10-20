import type { Role } from "./types";

export type FieldType =
  "text" | "textarea" | "number" | "select" | "toggle" | "date" | "image" | "images" | "lines" | "specs" | "icon" | "password";

export interface FieldDef {
  name: string; // dotted paths allowed, e.g. socials.facebook
  label: string;
  type: FieldType;
  options?: string[];
  optionsFrom?: string; // another entity key whose `title` values populate the select
  placeholder?: string;
  help?: string;
  required?: boolean;
  half?: boolean;
  slugFrom?: string; // for the slug text field: auto-fills from this field
  side?: boolean; // render in the right-hand column (media etc.)
}

export interface ColumnDef {
  label: string;
  field: string;
  kind?: "text" | "price" | "status" | "date" | "image";
}

export interface EntityDef {
  key: string; // URL segment
  type: string; // Sanity _type
  label: string; // plural
  singular: string;
  titleField: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  singleton?: boolean;
  singletonId?: string;
  status?: (doc: any) => { label: string; tone: "ok" | "warn" | "info" | "muted" | "red" };
  searchFields?: string[];
  imageType?: string; // for list thumbnails via docImage
  hint?: string;
}

const publishedStatus = (d: any) =>
  d.published === false ? { label: "Draft", tone: "warn" as const } : { label: "Published", tone: "ok" as const };

const slugField: FieldDef = {
  name: "slug",
  label: "URL name (slug)",
  type: "text",
  slugFrom: "title",
  required: true,
  half: true,
  help: "Auto-filled from the title. Lower-case, dashes.",
};
const order: FieldDef = { name: "order", label: "Display order (1 = first)", type: "number", half: true };

export const entities: EntityDef[] = [
  {
    key: "vehicles",
    type: "vehicle",
    label: "Car Types",
    singular: "Car type",
    titleField: "title",
    imageType: "vehicle",
    searchFields: ["title", "make", "model"],
    hint: "The makes and models the workshop works on. These are not cars for sale.",
    columns: [
      { label: "Car type", field: "title", kind: "image" },
      { label: "Make", field: "make" },
      { label: "Year / spec", field: "yearRange" },
      { label: "Featured", field: "featured", kind: "status" },
    ],
    status: (d) => (d.featured ? { label: "Featured", tone: "ok" } : { label: "Standard", tone: "muted" }),
    fields: [
      { name: "title", label: "Car type", type: "text", required: true, half: true, placeholder: "BMW E30 325i" },
      slugField,
      { name: "make", label: "Make", type: "text", half: true, placeholder: "BMW" },
      { name: "model", label: "Model", type: "text", half: true },
      { name: "yearRange", label: "Year / spec label", type: "text", half: true, placeholder: "1982 - 1991" },
      { name: "tagline", label: "Short line (e.g. Classic / Performance)", type: "text", half: true },
      { name: "description", label: "Description (what you do on this car)", type: "textarea" },
      { name: "specs", label: "Common work / details (optional)", type: "specs" },
      { name: "featured", label: "Featured on the home page", type: "toggle", side: true },
      { name: "order", label: "Display order (1 = first)", type: "number", side: true },
      { name: "images", label: "Photos (first = primary)", type: "images", side: true },
    ],
  },
  {
    key: "parts",
    type: "part",
    label: "Parts",
    singular: "Part",
    titleField: "title",
    imageType: "part",
    searchFields: ["title", "category", "brand", "sku"],
    columns: [
      { label: "Part", field: "title", kind: "image" },
      { label: "Category", field: "category" },
      { label: "Price", field: "price", kind: "price" },
      { label: "Status", field: "published", kind: "status" },
    ],
    status: publishedStatus,
    fields: [
      { name: "title", label: "Part name", type: "text", required: true, half: true },
      slugField,
      { name: "category", label: "Category", type: "select", optionsFrom: "part-categories", half: true },
      { name: "brand", label: "Brand", type: "text", half: true },
      { name: "sku", label: "SKU", type: "text", half: true },
      { name: "price", label: "Price (R)", type: "number", required: true, half: true },
      { name: "stock", label: "Stock", type: "number", half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "published", label: "Published (visible on the site)", type: "toggle", side: true },
      { name: "featured", label: "Featured", type: "toggle", side: true },
      { name: "order", label: "Display order (1 = first)", type: "number", side: true },
      { name: "images", label: "Photos (first = primary)", type: "images", side: true },
    ],
  },
  {
    key: "services",
    type: "service",
    label: "Services",
    singular: "Service",
    titleField: "title",
    searchFields: ["title", "category"],
    columns: [
      { label: "Title", field: "title" },
      { label: "Category", field: "category" },
      { label: "Price (from)", field: "priceFrom", kind: "price" },
      { label: "Status", field: "published", kind: "status" },
    ],
    status: publishedStatus,
    fields: [
      { name: "title", label: "Service name", type: "text", required: true, half: true, placeholder: "Engine Overhauling" },
      slugField,
      { name: "category", label: "Category", type: "select", optionsFrom: "service-categories", half: true },
      { name: "priceFrom", label: "Price from (R)", type: "number", half: true },
      { name: "priceNote", label: "Price note (shown if no price)", type: "text", half: true, placeholder: "Quote on request" },
      { name: "shortDescription", label: "Short description", type: "textarea" },
      { name: "longDescription", label: "Full description", type: "textarea" },
      { name: "iconName", label: "Icon", type: "icon", side: true },
      { name: "published", label: "Published", type: "toggle", side: true },
      { name: "featured", label: "Featured on home page", type: "toggle", side: true },
      { name: "order", label: "Display order (1 = first)", type: "number", side: true },
    ],
  },
  {
    key: "price-list",
    type: "priceListItem",
    label: "Price List",
    singular: "Price list row",
    titleField: "name",
    searchFields: ["name", "group", "description"],
    columns: [
      { label: "Service / item", field: "name" },
      { label: "Group", field: "group" },
      { label: "Price (from)", field: "priceFrom", kind: "price" },
    ],
    fields: [
      { name: "name", label: "Service / item", type: "text", required: true, half: true },
      {
        name: "group",
        label: "Group",
        type: "select",
        options: ["General Servicing", "Engine Overhauling", "Clutch & Gearbox", "Suspension & Brakes"],
        half: true,
      },
      { name: "description", label: "Description", type: "text" },
      { name: "priceFrom", label: "Price from (R)", type: "number", required: true, half: true },
      { name: "priceTo", label: "Price to (R, optional)", type: "number", half: true },
      order,
    ],
  },
  {
    key: "gallery",
    type: "galleryImage",
    label: "Gallery",
    singular: "Gallery photo",
    titleField: "caption",
    imageType: "galleryImage",
    searchFields: ["caption", "category"],
    columns: [
      { label: "Photo", field: "caption", kind: "image" },
      { label: "Category", field: "category" },
      { label: "Added", field: "_createdAt", kind: "date" },
    ],
    fields: [
      { name: "caption", label: "Caption", type: "text", half: true },
      { name: "category", label: "Category", type: "select", options: ["BMW", "VW", "Mercedes", "Ford", "Other"], half: true },
      { name: "order", label: "Display order (1 = first)", type: "number", half: true },
      { name: "image", label: "Photo", type: "image", side: true },
    ],
  },
  {
    key: "specials",
    type: "special",
    label: "Specials",
    singular: "Special",
    titleField: "title",
    searchFields: ["title"],
    columns: [
      { label: "Title", field: "title" },
      { label: "Valid until", field: "validUntil", kind: "date" },
      { label: "Status", field: "active", kind: "status" },
    ],
    status: (d) => {
      const today = new Date().toISOString().slice(0, 10);
      if (d.active === false) return { label: "Off", tone: "muted" };
      if (d.validUntil && d.validUntil < today) return { label: "Expired", tone: "warn" };
      return { label: "Active", tone: "ok" };
    },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "discountText", label: "Discount text", type: "text", half: true, placeholder: "10% OFF" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "validFrom", label: "Valid from", type: "date", half: true },
      { name: "validUntil", label: "Valid until", type: "date", half: true, help: "Hidden automatically after this date." },
      { name: "ctaLabel", label: "Button label", type: "text", half: true },
      { name: "ctaHref", label: "Button link", type: "text", half: true, placeholder: "/contact" },
      { name: "active", label: "Active", type: "toggle", side: true },
      { name: "image", label: "Image", type: "image", side: true },
    ],
  },
  {
    key: "testimonials",
    type: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    titleField: "name",
    columns: [
      { label: "Customer", field: "name" },
      { label: "Vehicle", field: "vehicle" },
      { label: "Rating", field: "rating" },
    ],
    hint: "Only add genuine reviews from real customers (with their permission).",
    fields: [
      { name: "name", label: "Customer name", type: "text", required: true, half: true },
      { name: "vehicle", label: "Vehicle", type: "text", half: true },
      { name: "rating", label: "Rating (1-5)", type: "number", half: true },
      { name: "message", label: "Review", type: "textarea", required: true },
      { name: "avatar", label: "Photo (optional)", type: "image", side: true },
    ],
  },
  {
    key: "service-categories",
    type: "serviceCategory",
    label: "Service categories",
    singular: "Service category",
    titleField: "title",
    columns: [
      { label: "Title", field: "title" },
      { label: "Order", field: "order" },
    ],
    fields: [{ name: "title", label: "Title", type: "text", required: true, half: true }, slugField, order],
  },
  {
    key: "part-categories",
    type: "partCategory",
    label: "Part categories",
    singular: "Part category",
    titleField: "title",
    columns: [
      { label: "Title", field: "title" },
      { label: "Order", field: "order" },
    ],
    fields: [{ name: "title", label: "Title", type: "text", required: true, half: true }, slugField, order],
  },
  {
    key: "users",
    type: "user",
    label: "Users",
    singular: "User",
    titleField: "name",
    searchFields: ["name", "email"],
    columns: [
      { label: "Name", field: "name" },
      { label: "Email", field: "email" },
      { label: "Role", field: "role" },
      { label: "Last login", field: "lastLogin", kind: "date" },
      { label: "Status", field: "active", kind: "status" },
    ],
    status: (d) => (d.active === false ? { label: "Disabled", tone: "muted" } : { label: "Active", tone: "ok" }),
    hint: "Owner: everything. Admin: everything except users. Reception: dashboard, inquiries and gallery uploads.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, half: true },
      { name: "email", label: "Email", type: "text", required: true, half: true },
      { name: "role", label: "Role", type: "select", options: ["owner", "admin", "reception"], required: true, half: true },
      {
        name: "password",
        label: "Password",
        type: "password",
        half: true,
        help: "Leave blank to keep the current password. Min 8 characters.",
      },
      { name: "active", label: "Active (can log in)", type: "toggle", side: true },
    ],
  },
  {
    key: "site-settings",
    type: "siteSettings",
    label: "Site Settings",
    singular: "Site settings",
    titleField: "name",
    singleton: true,
    singletonId: "siteSettings",
    columns: [],
    fields: [
      { name: "name", label: "Business name", type: "text", half: true },
      { name: "tagline", label: "Tagline", type: "text", half: true },
      { name: "phones", label: "Phone numbers (one per line)", type: "lines", help: "First number is used for Call Now." },
      { name: "email", label: "Email", type: "text", half: true },
      { name: "address", label: "Address", type: "text", half: true },
      { name: "mapEmbedUrl", label: "Google Maps embed URL (optional)", type: "text" },
      { name: "openingHours", label: "Opening hours (one per line)", type: "lines" },
      { name: "about", label: "About us text", type: "textarea" },
      { name: "socials.facebook", label: "Facebook URL", type: "text", half: true },
      { name: "socials.instagram", label: "Instagram URL", type: "text", half: true },
      { name: "socials.whatsapp", label: "WhatsApp URL", type: "text", half: true },
      { name: "socials.youtube", label: "YouTube URL", type: "text", half: true },
      { name: "stats.yearsInBusiness", label: "Years in business", type: "number", half: true },
      { name: "stats.carsServiced", label: "Cars serviced", type: "number", half: true },
      { name: "stats.happyCustomers", label: "Happy customers", type: "number", half: true },
      { name: "logo", label: "Logo", type: "image", side: true },
    ],
  },
  {
    key: "hero-content",
    type: "heroContent",
    label: "Hero Content",
    singular: "Hero content",
    titleField: "headline",
    singleton: true,
    singletonId: "heroContent",
    columns: [],
    fields: [
      { name: "headline", label: "Headline (white)", type: "text", half: true },
      { name: "headlineAccent", label: "Headline accent (red)", type: "text", half: true },
      { name: "subhead", label: "Sub-headline", type: "textarea" },
      { name: "brands", label: "Brands strip (one per line)", type: "lines" },
      { name: "ctaPrimary.label", label: "Primary button label", type: "text", half: true },
      {
        name: "ctaPrimary.href",
        label: "Primary button link",
        type: "text",
        half: true,
        help: 'Use "tel" to call the first phone number.',
      },
      { name: "ctaSecondary.label", label: "Secondary button label", type: "text", half: true },
      { name: "ctaSecondary.href", label: "Secondary button link", type: "text", half: true },
      { name: "backgroundImage", label: "Hero photo", type: "image", side: true },
    ],
  },
];

export const entityByKey = (key: string) => entities.find((e) => e.key === key);
export const entityByType = (type: string) => entities.find((e) => e.type === type);

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: Role[];
  badge?: "inquiries";
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { label: "Content", href: "/admin/content", icon: "folder-open", roles: ["owner", "admin"] },
  { label: "Site Settings", href: "/admin/site-settings", icon: "sliders-horizontal", roles: ["owner", "admin"] },
  { label: "Hero Content", href: "/admin/hero-content", icon: "image", roles: ["owner", "admin"] },
  { label: "Services", href: "/admin/services", icon: "wrench", roles: ["owner", "admin"] },
  { label: "Car Types", href: "/admin/vehicles", icon: "car", roles: ["owner", "admin"] },
  { label: "Parts", href: "/admin/parts", icon: "cog", roles: ["owner", "admin"] },
  { label: "Price List", href: "/admin/price-list", icon: "receipt", roles: ["owner", "admin"] },
  { label: "Gallery", href: "/admin/gallery", icon: "images" },
  { label: "Specials", href: "/admin/specials", icon: "tag", roles: ["owner", "admin"] },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inbox", badge: "inquiries" },
  { label: "Users", href: "/admin/users", icon: "users", roles: ["owner"] },
  { label: "Settings", href: "/admin/settings", icon: "settings", roles: ["owner", "admin"] },
];

export const navFor = (role?: Role) => {
  if (role === "reception")
    return [
      { label: "Dashboard", href: "/admin/reception", icon: "layout-dashboard" },
      ...navItems.filter((n) => ["Gallery", "Inquiries"].includes(n.label)),
    ];
  return navItems.filter((n) => !n.roles || (role && n.roles.includes(role)));
};

/** Icons offered in the service icon picker (lucide names). */
export const iconChoices = [
  "wrench",
  "cog",
  "settings",
  "gauge",
  "disc",
  "laptop",
  "cpu",
  "zap",
  "car",
  "fuel",
  "battery-charging",
  "thermometer",
  "arrow-down-up",
  "shield-check",
  "hammer",
  "activity",
  "circle-dot",
  "gem",
  "flame",
  "key-round",
  "timer",
  "wind",
  "droplets",
  "sparkles",
  "list-checks",
  "truck",
];

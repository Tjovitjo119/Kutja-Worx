export type Doc = { _id: string; _type: string; _createdAt?: string; _updatedAt?: string; [k: string]: any };

export interface SiteSettings extends Doc {
  name: string;
  tagline?: string;
  logo?: any;
  phones: string[];
  email?: string;
  address: string;
  mapEmbedUrl?: string;
  openingHours?: string[];
  socials?: { facebook?: string; instagram?: string; whatsapp?: string; youtube?: string };
  stats?: { yearsInBusiness?: number; carsServiced?: number; happyCustomers?: number };
  about?: string;
}

export interface HeroContent extends Doc {
  headline: string;
  headlineAccent: string;
  subhead?: string;
  brands?: string[];
  backgroundImage?: any;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export interface Service extends Doc {
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  longDescription?: string;
  iconName?: string;
  priceFrom?: number;
  priceNote?: string;
  order?: number;
  featured?: boolean;
  published?: boolean;
}

export interface PriceListItem extends Doc {
  name: string;
  description?: string;
  priceFrom: number;
  priceTo?: number;
  group: string;
  order?: number;
}

export interface Vehicle extends Doc {
  title: string;
  slug: string;
  make: string;
  model?: string;
  year?: number;
  yearRange?: string;
  tagline?: string;
  description?: string;
  specs?: { label: string; value: string }[];
  images?: any[];
  featured?: boolean;
  order?: number;
}

export interface Part extends Doc {
  title: string;
  slug: string;
  category: string;
  brand?: string;
  sku?: string;
  price: number;
  stock?: number;
  description?: string;
  images?: any[];
  featured?: boolean;
  published?: boolean;
  order?: number;
}

export interface GalleryImage extends Doc {
  image?: any;
  caption?: string;
  tags?: string[];
  category: string;
  order?: number;
}

export interface Special extends Doc {
  title: string;
  description?: string;
  image?: any;
  discountText?: string;
  validFrom?: string;
  validUntil?: string;
  ctaLabel?: string;
  ctaHref?: string;
  active?: boolean;
}

export interface Testimonial extends Doc {
  name: string;
  vehicle?: string;
  rating?: number;
  message: string;
  avatar?: any;
}

export interface Category extends Doc {
  title: string;
  slug: string;
  order?: number;
}

export type InquiryStatus = "new" | "in-progress" | "contacted" | "closed";
export interface Inquiry extends Doc {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  source: "contact" | "parts-cart" | "vehicle-enquiry" | "quote";
  relatedItem?: string;
  status: InquiryStatus;
  notes?: string;
}

export type Role = "owner" | "admin" | "reception";
export interface UserDoc extends Doc {
  name: string;
  email: string;
  passwordHash?: string;
  role: Role;
  lastLogin?: string;
  active?: boolean;
}

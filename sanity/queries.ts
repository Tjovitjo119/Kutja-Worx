/** GROQ per entity (used by the public site; cached 60s, busted by the /api/revalidate webhook). */
export const queries: Record<string, string> = {
  siteSettings: `*[_type=="siteSettings"]`,
  heroContent: `*[_type=="heroContent"]`,
  service: `*[_type=="service" && published != false] | order(order asc, title asc)`,
  serviceCategory: `*[_type=="serviceCategory"] | order(order asc, title asc)`,
  priceListItem: `*[_type=="priceListItem"] | order(order asc, name asc)`,
  vehicle: `*[_type=="vehicle"] | order(order asc, _createdAt desc)`,
  part: `*[_type=="part" && published != false] | order(order asc, title asc)`,
  partCategory: `*[_type=="partCategory"] | order(order asc, title asc)`,
  galleryImage: `*[_type=="galleryImage"] | order(order asc, _createdAt desc)`,
  special: `*[_type=="special" && active != false] | order(validUntil asc)`,
  testimonial: `*[_type=="testimonial"] | order(_createdAt desc)`,
};

import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.union([z.literal(""), z.string().trim().email("Invalid email address").max(120)]).optional(),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Please tell us a little more").max(2000),
  relatedItem: z.string().trim().max(160).optional(),
  website: z.string().max(0).optional(), // honeypot
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const quoteItemSchema = z.object({
  id: z.string(),
  title: z.string().max(160),
  price: z.number().min(0),
  qty: z.number().int().min(1).max(99),
});
export const partsQuoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.union([z.literal(""), z.string().trim().email().max(120)]).optional(),
  items: z.array(quoteItemSchema).min(1).max(50),
  website: z.string().max(0).optional(),
});

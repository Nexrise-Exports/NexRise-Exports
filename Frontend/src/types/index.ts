import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  id: z.any(),
  name: z.string(),
  description: z.string(),
  region: z.string(),
  tasteProfile: z.string(),
  imageUrl: z.string(),
  tags: z.array(z.string()).optional(),
  story: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().nullable().optional(),
});

export const insertProductSchema = productSchema.omit({ id: true });

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Inquiry Schema
export const inquirySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["general", "product", "supplier", "buyer"]).default("general"),
  productId: z.string().optional(),
  productName: z.string().optional(),
  // Supplier and Buyer fields
  company: z.string().optional(),
  companyWebsite: z.string().optional(),
  certifications: z.string().optional(),
  categories: z.array(z.string()).optional(),
  yearsInBusiness: z.string().optional(),
  anticipatedVolume: z.string().optional(),
  distributionModel: z.array(z.string()).optional(),
  productsOfInterest: z.array(z.string()).optional(),
});

export const insertInquirySchema = inquirySchema.omit({ id: true });

export type Inquiry = z.infer<typeof inquirySchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

// API Routes
export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
    },
  },
  inquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/inquiries',
      input: insertInquirySchema,
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}


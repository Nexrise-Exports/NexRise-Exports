"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { Product, InsertInquiry } from "@/types";

export function useProducts() {
  return useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<{ products: Product[], pagination: any }>;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json() as Promise<Product>;
    },
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to send inquiry");
      }
      return res.json();
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });
}

export function useFlags() {
  return useQuery({
    queryKey: ["/api/flags"],
    queryFn: async () => {
      const res = await fetch("/api/flags");
      if (!res.ok) throw new Error("Failed to fetch flags");
      return res.json();
    },
  });
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/types";
import Image from "next/image";

interface MagicSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MagicSearch({ open, onOpenChange }: MagicSearchProps) {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // Block scroll on main screen when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Add keyboard shortcut (Ctrl+K) to open Magic Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Handle the case where products might be an object with { products: [...] } due to pagination API change
  const productList: Product[] = Array.isArray(products)
    ? products
    : (products as { products: Product[] })?.products || [];

  // Show all products when no search query, otherwise filter
  const displayProducts = searchQuery.trim() === ""
    ? productList.slice(0, 10) // Show only top 10 when no search
    : productList.filter((product: Product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.region?.toLowerCase().includes(query) ||
        product.tasteProfile?.toLowerCase().includes(query)
      );
    });

  const handleSelectProduct = (product: Product) => {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    router.push(`/products/${slug}`);
    onOpenChange(false);
  };

  const handleViewMore = () => {
    router.push("/products");
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="relative">
        <CommandInput
          placeholder="Search products..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-none outline-none focus:ring-0 focus:outline-none focus:border-none"
        />
      </div>

      {/* Scrollable list with hidden scrollbar */}
      <CommandList className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <>
            {/* Show products horizontally in pill format - both for all products and search results */}
            <div className="p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                {searchQuery.trim() === "" ? "All Products" : "Search Results"}
              </p>
              {displayProducts && displayProducts.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    {displayProducts.map((product: Product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="group flex items-center gap-2 px-2 py-1 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/30 hover:bg-accent/20 hover:border-accent/50 transition-all duration-300"
                      >
                        {/* Small Product Image */}
                        <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Title */}
                        <span className="text-xs font-medium text-black group-hover:text-accent transition-colors uppercase">
                          {product.name}
                        </span>
                      </button>
                    ))}

                    {/* View More Button - Only show when no search query */}
                    {searchQuery.trim() === "" && (
                      <button
                        onClick={handleViewMore}
                        className="group flex items-center gap-2 px-2 py-1 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/30 hover:bg-accent/20 hover:border-accent/50 transition-all duration-300"
                      >
                        {/* Icon placeholder */}
                        <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-accent/20 flex items-center justify-center">
                          <span className="text-accent text-lg font-bold">+</span>
                        </div>

                        {/* View More Text */}
                        <span className="text-xs font-medium text-black group-hover:text-accent transition-colors uppercase">
                          View More
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No products found.
                </div>
              )}
            </div>
          </>
        )}
      </CommandList>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Remove all input borders */
        [cmdk-input-wrapper] input,
        [cmdk-input] {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        [cmdk-input-wrapper] input:focus,
        [cmdk-input]:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          ring: 0 !important;
        }
      `}</style>
    </CommandDialog>
  );
}

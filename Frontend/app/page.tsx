"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Search } from "lucide-react";
import { MagicSearch } from "@/components/MagicSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const [filter, setFilter] = useState<string>("all");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMagicSearchOpen, setIsMagicSearchOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    totalItems: number;
  }>({ totalPages: 0, totalItems: 0 });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const category = filter !== "all" ? filter : undefined;
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        params.append("status", "active");
        params.append("page", currentPage.toString());
        params.append("limit", "9");

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          setPagination({
            totalPages: data.pagination?.totalPages || 0,
            totalItems: data.pagination?.totalItems || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="grain-overlay" />

      {/* Magic Search */}
      <MagicSearch open={isMagicSearchOpen} onOpenChange={setIsMagicSearchOpen} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Our Collection
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            Premium <span className="italic text-accent">Products</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked, single-origin products sourced directly from our farming partners. Each product tells a story of heritage and excellence.
          </p>
        </motion.div>
        {/* Search Bar with Category Dropdown */}
        <motion.div
          className="flex items-center justify-center mt-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-full max-w-2xl px-4">
            <div className="flex items-center bg-stone-50/50 backdrop-blur-sm border border-stone-200 rounded-full overflow-hidden hover:bg-white transition-all duration-300 hover:shadow-xl group/search">
              {/* Search Icon and Input Area */}
              <button
                onClick={() => setIsMagicSearchOpen(true)}
                className="flex items-center flex-1 px-3 md:px-5 py-3 md:py-4 text-left group"
              >
                <Search className="w-5 h-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-muted-foreground group-hover:text-black transition-colors text-sm md:text-base truncate">
                  Search products...
                </span>
                <div className="hidden sm:flex items-center gap-1 ml-auto mr-2 px-2 py-1 bg-white border border-stone-100 rounded text-[10px] text-stone-600 font-mono tracking-tight">
                  Ctrl + K
                </div>
              </button>

              {/* Decorative Separator */}
              <div className="hidden md:block h-6 w-px bg-stone-200 mx-2" />

              {/* Category Dropdown replaces "View Products" */}
              <div className="mr-1 py-1">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px] md:w-[180px] bg-accent text-white border-none rounded-full h-10 md:h-12 font-serif text-sm md:text-md hover:bg-primary hover:text-black transition-all duration-300 px-4 md:px-6 shadow-sm focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="font-serif bg-white">
                    <SelectItem value="all" className="text-black">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.name} className="text-black">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 px-6 container mx-auto max-w-6xl">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-sans text-lg text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {products.map((product, i) => {
                // Generate slug from product name
                const slug = product.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    slug={slug}
                  />
                );
              })}
            </motion.div>

            {/* Pagination UI */}
            <div className="mt-20 flex flex-col items-center gap-6">
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 border border-accent/60 hover:border-accent disabled:opacity-30 transition-colors text-black"
                  >
                    <motion.span whileTap={{ x: -2 }}>Previous</motion.span>
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center font-mono text-sm transition-all duration-300 ${currentPage === i + 1
                        ? "bg-accent text-primary"
                        : "border border-accent/20 hover:border-accent text-primary-foreground"
                        }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    className="p-2 border border-accent/60 hover:border-accent disabled:opacity-30 transition-colors text-black"
                  >
                    <motion.span whileTap={{ x: 2 }}>Next</motion.span>
                  </button>
                </div>
              )}

              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Total Products: <span className="text-accent font-bold">{pagination.totalItems}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </section>


      <Footer />
    </div>
  );
}


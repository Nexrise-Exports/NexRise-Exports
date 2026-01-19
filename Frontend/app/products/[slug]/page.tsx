"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { ProductEnquiryPopup } from "@/components/ProductEnquiryPopup";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  origin: string;
  biologicalBackground: string;
  usage: string;
  keyCharacteristics: string;
  displayPhoto: string;
  additionalPhotos: string[];
  category: string;
  status: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Convert slug to product ID (for now, we'll use the slug as ID or fetch all products and match)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get all products to find the one matching the slug
        const productsResponse = await fetch("/api/products?status=active&limit=100");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await productsResponse.json();
        const products = Array.isArray(data) ? data : data.products || [];

        // Find product by matching slug (convert title to slug)
        const slug = params.slug as string;
        const foundProduct = products.find((p: any) => {
          const productSlug = (p.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          return productSlug === slug;
        });

        if (!foundProduct || !foundProduct.id) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        // Fetch full product details by ID
        const productResponse = await fetch(`/api/products/${foundProduct.id}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productData = await productResponse.json();
        setProduct(productData);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const allImages = product
    ? [product.displayPhoto, ...product.additionalPhotos].filter(Boolean)
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-lg text-muted-foreground mb-4">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-2 bg-accent text-primary-foreground hover:bg-primary hover:text-black transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="grain-overlay" />

      {/* Header with Back Button */}
      <section className="pt-32 pb-12 px-6 container mx-auto max-w-7xl">
        <motion.button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-sans">Back to Products</span>
        </motion.button>
      </section>

      {/* Product Details */}
      <section className="pb-20 px-6 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden border border-primary/10">
              {allImages.length > 0 && (
                <>
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    quality={90}
                    unoptimized
                  />

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-primary-foreground" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-primary-foreground" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-mono">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                        ? "border-accent"
                        : "border-transparent hover:border-primary/30"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      quality={75}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-semibold text-xs uppercase tracking-widest bg-accent/30 px-3 py-1 rounded-full text-primary-foreground">
                  {product.category}
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl text-accent mb-4">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-xs uppercase tracking-widest text-accent mb-2">
                Description
              </h2>
              <p className="font-sans text-base text-primary-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                {product.description}
              </p>
            </div>

            {/* Origin */}
            <div>
              <h2 className="font-semibold text-xs uppercase tracking-widest text-accent mb-2">
                Origin
              </h2>
              <p className="font-sans text-sm text-primary-foreground leading-relaxed whitespace-pre-line">
                {product.origin}
              </p>
            </div>

            {/* Biological Background */}
            <div>
              <h2 className="font-semibold text-xs uppercase tracking-widest text-accent mb-2">
                Biological Background
              </h2>
              <p className="font-sans text-sm text-primary-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                {product.biologicalBackground}
              </p>
            </div>

            {/* Usage */}
            <div>
              <h2 className="font-semibold text-xs uppercase tracking-widest text-accent mb-2">
                Usage
              </h2>
              <p className="font-sans text-sm text-primary-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                {product.usage}
              </p>
            </div>

            {/* Key Characteristics */}
            <div>
              <h2 className="font-semibold text-xs uppercase tracking-widest text-accent mb-2">
                Key Characteristics
              </h2>
              <p className="font-sans text-sm text-primary-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                {product.keyCharacteristics}
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsEnquiryOpen(true)}
              className="w-full bg-accent text-white py-4 hover:bg-primary hover:text-black transition-colors duration-300 font-medium tracking-wide"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send an Enquiry
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Product Enquiry Popup */}
      <ProductEnquiryPopup
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productId={product?.id}
        productName={product?.name}
      />

      <Footer />
    </div>
  );
}


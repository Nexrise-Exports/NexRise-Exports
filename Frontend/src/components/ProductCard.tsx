"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
  slug: string;
}

export function ProductCard({ product, index, slug }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="group cursor-pointer"
        whileHover={{ y: -8 }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 ease-out border border-primary/5 rounded-lg">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-500"
          />

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 z-20 pointer-events-none rounded-lg"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />

          {/* Image Container with rotation */}
          <div className="w-full h-full bg-stone-100 flex items-center justify-center relative overflow-hidden">
            {product.imageUrl ? (
              <motion.div
                whileHover={{ scale: 1.15, rotate: 2 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: "transform", width: "100%", height: "100%" }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  quality={90}
                  unoptimized
                />
              </motion.div>
            ) : (
              <div className="text-primary/10 font-serif text-6xl italic">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Floating Region Tag with enhanced animation */}
          {/* <motion.div 
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span 
            className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-accent/20 shadow-md text-accent"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.98)" }}
          >
            {product.region}
          </motion.span>
        </motion.div> */}

          {/* Floating Badge with quality indicator or subcategory */}
          <motion.div
            className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-sm"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
            >
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[12px] font-mono uppercase tracking-widest text-accent">
                {product.subcategory ? product.subcategory : "Premium"}
              </span>
            </motion.div>
          </motion.div>

          {/* Hover Reveal Button with staggered animation */}
          <motion.div
            className="absolute bottom-6 right-6 z-20"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            whileHover={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.2, rotate: 45 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{ willChange: "transform" }}
            >
              <ArrowRight className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>

          {/* Animated corner accents */}
          <motion.div className="absolute top-0 left-0 w-0 h-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-accent/10 group-hover:border-t-accent/20 transition-colors duration-300" />
          <motion.div className="absolute bottom-0 right-0 w-0 h-0 border-r-[40px] border-b-[40px] border-r-transparent border-b-accent/10 group-hover:border-b-accent/20 transition-colors duration-300" />
        </div>

        {/* Text Section with enhanced animations */}
        <div className="mt-6 space-y-2 px-2">
          <motion.h3
            className="font-serif text-2xl text-accent group-hover:text-muted-foreground transition-colors duration-300 uppercase"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.15 + 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            {product.name}
          </motion.h3>
          <motion.p
            className="font-sans text-sm text-muted-foreground line-clamp-2"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            {product.tasteProfile}
          </motion.p>

          
        </div>
      </motion.div>
    </Link>
  );
}


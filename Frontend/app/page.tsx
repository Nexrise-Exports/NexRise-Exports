"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Star } from "lucide-react";
import { useTestimonials } from "@/hooks/use-products";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase() || "??";
};


export default function Testimonials() {
  const { data: testimonialData } = useTestimonials();
  const testimonials = testimonialData?.data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="grain-overlay" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Customer Stories
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-8 text-primary-foreground">
            What Our <span className="italic text-accent">Customers</span> Say
          </h1>
          <p className="font-sans text-xl text-primary-foreground max-w-3xl mx-auto leading-relaxed">
            From home cooks to professional chefs, discover how NexRise Spices has transformed kitchens across India with authentic, premium quality spices.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-10 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial: any) => (
              <motion.div
                key={testimonial._id}
                variants={itemVariants}
                className="bg-white border border-primary/10 p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(Math.max(0, Math.min(5, testimonial.rating || 0)))].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="font-sans text-primary-foreground leading-relaxed mb-6 flex-grow">
                  "{testimonial.content}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-primary/10">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-lg font-semibold text-primary-foreground">
                      {getInitials(testimonial.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="font-sans text-xs text-primary-foreground mt-1">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Ready to Experience the <span className="italic text-accent">Difference</span>?
            </h2>
            <p className="font-sans text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust NexRise for authentic, premium quality spices.
            </p>
            <motion.a
              href="/products"
              className="inline-block bg-accent text-primary px-8 py-4 font-medium hover:bg-accent/90 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Products
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


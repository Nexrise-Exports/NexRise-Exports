"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { ChevronDown } from "lucide-react";



export default function FAQs() {
  const [faqs, setFaqs] = useState<{ _id: string; question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs`);
        const data = await response.json();
        if (data.success) {
          setFaqs(data.data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

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
    hidden: { opacity: 0, y: 20 },
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
      <section className="pt-40 pb-10 px-6 container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Customer Support
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            Frequently Asked <span className="italic text-accent">Questions</span>
          </h1>
          <p className="font-sans text-lg text-primary-foreground max-w-2xl mx-auto">
            Everything you need to know about NexRise Spices.
          </p>
        </motion.div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-20 px-6 container mx-auto max-w-4xl">
        {loading ? (
          <div className="text-center">Loading FAQs...</div>
        ) : (
          <motion.div
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              {faqs.map((item, index) => {
                const itemId = item._id;
                const isExpanded = expanded === itemId;

                return (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    className="border border-primary/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                  >
                    <button
                      onClick={() => setExpanded(isExpanded ? null : itemId)}
                      className="w-full p-6 flex items-start justify-between gap-4 text-left"
                    >
                      <span className="font-serif text-lg font-medium leading-relaxed text-primary-foreground">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-accent" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-primary/10"
                        >
                          <p className="p-6 font-sans leading-relaxed text-primary-foreground">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
            {faqs.length === 0 && (
              <p className="text-center text-muted-foreground">No FAQs found.</p>
            )}
          </motion.div>
        )}
      </section>

      {/* Contact CTA Section */}
      <motion.section
        className="py-20 bg-primary text-primary-foreground px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Didn't find your answer?</h2>
          <p className="font-sans text-lg opacity-90 mb-8">
            Our customer support team is here to help. Reach out anytime.
          </p>
          <motion.a
            href="/contact"
            className="inline-block bg-accent text-primary font-medium px-8 py-4 hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

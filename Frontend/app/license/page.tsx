"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Loader2, FileText, X } from "lucide-react";
import Image from "next/image";

interface Documentation {
  _id: string;
  title: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Documentation() {
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/documentation?status=active");
        if (response.ok) {
          const data = await response.json();
          setDocumentation(data || []);
        }
      } catch (error) {
        console.error("Error fetching documentation:", error);
        setDocumentation([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
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
      <section className="pt-40 pb-20 px-6 container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Resources & Guides
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6 text-primary-foreground">
            License/Certification <span className="italic text-accent">Library</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of license/certification, resources, and documentation to help you make the most of our premium spices.
          </p>
        </motion.div>
      </section>

      {/* Documentation Grid */}
      <section className="pb-32 px-6 container mx-auto max-w-6xl relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : documentation.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="font-sans text-lg text-muted-foreground">
              No license/certification available at the moment.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {documentation.map((doc) => (
              <motion.div
                key={doc._id}
                variants={itemVariants}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedDoc(doc);
                  setIsPopupOpen(true);
                }}
              >
                <div className="border border-primary/10 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 overflow-hidden rounded-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={doc.image}
                      alt={doc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif text-xl font-medium text-primary-foreground group-hover:text-accent transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Image Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && selectedDoc && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />

            {/* Popup */}
            <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-6xl bg-white border border-primary/10 shadow-2xl pointer-events-auto rounded-t-2xl md:rounded-lg overflow-hidden flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/20 rounded-full z-10 transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col flex-1 min-h-0">
                  <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-accent mb-3 md:mb-4 pr-12 flex-shrink-0">
                    {selectedDoc.title}
                  </h2>
                  <div className="relative w-full flex-1 min-h-0 bg-muted rounded-md overflow-auto flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
                      <Image
                        src={selectedDoc.image}
                        alt={selectedDoc.title}
                        width={1200}
                        height={1200}
                        className="max-w-full max-h-full object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}


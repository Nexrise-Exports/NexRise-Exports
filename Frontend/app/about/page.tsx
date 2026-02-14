"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Timeline } from "@/components/ui/timeline";

const timelineEvents = [
  { year: 2026, title: "Founded", description: "NexRise Spices established in Varanasi, Uttar Pradesh" },
];

const values = [
  {
    title: "Purity",
    description: "No additives, no colors, no compromises. Just pure, authentic spices."
  },
  {
    title: "Heritage",
    description: "A firm of tradition meets modern standards of excellence."
  },
  {
    title: "Sustainability",
    description: "Fair trade practices and organic farming for our planet's future."
  },
  {
    title: "Innovation",
    description: "Preserving flavor through cutting-edge processing technology."
  },
];

export default function About() {
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
      <section className="pt-40 pb-10 px-6 container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0">
              <Image
                src="/logo-nobg.png"
                alt="NexRise Exports"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80px, 96px"
                quality={90}
              />
            </div>
          </div>
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-8 text-primary-foreground">
            A Firm of <span className="italic text-accent">Heritage</span>
          </h1>
          <p className="font-sans text-xl text-primary-foreground max-w-3xl mx-auto leading-relaxed">
            Since 2026, NexRise Exports has been the custodian of flavor, tradition, and excellence. What started as a single family business in the spice markets of Varanasi has grown into a global ambassador of authentic Indian spices.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-10 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="font-serif text-5xl text-center mb-16 text-primary-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Core <span className="italic text-accent">Values</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 border border-primary/10 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="font-serif text-2xl mb-4 text-accent">{value.title}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 px-6 bg-white relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.h2
            className="font-serif text-5xl md:text-6xl text-center mb-20 text-primary-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our <span className="italic text-accent">Journey</span>
          </motion.h2>

          <Timeline
            data={timelineEvents.map((event) => ({
              title: `${event.year}`,
              content: (
                <div className="p-6 md:p-8 bg-accent rounded-lg border shadow-xl hover:shadow-xl transition-shadow">
                  <div className="flex flex-col gap-2 mb-3">
                    <span className="font-mono text-lg md:text-xl font-semibold text-white">
                      {event.year}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                      {event.title}
                    </h3>
                  </div>
                  <p className="font-sans text-gray-100 text-base md:text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-muted text-primary-foreground px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {[
              { number: "20+", label: "Spices Produced" },
              { number: "5", label: "Countries Served" },
              { number: "100+", label: "Happy Customers" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-5xl font-bold mb-2">{stat.number}</div>
                <p className="font-sans text-lg opacity-90">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

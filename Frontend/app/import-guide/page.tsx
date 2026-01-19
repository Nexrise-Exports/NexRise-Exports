"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FileText, Package, Globe, CheckCircle, AlertCircle, ArrowRight, Download } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Documentation & Compliance",
    description: "Ensure all required documents are in place including import licenses, phytosanitary certificates, and customs declarations.",
    icon: FileText,
    details: [
      "Import License from relevant authority",
      "Phytosanitary Certificate from origin country",
      "Certificate of Origin",
      "Commercial Invoice and Packing List",
      "Bill of Lading or Airway Bill",
      "FSSAI Registration (for food products)"
    ]
  },
  {
    number: "02",
    title: "Quality Standards",
    description: "Verify that your spices meet international quality standards and regulations of the importing country.",
    icon: CheckCircle,
    details: [
      "Purity and authenticity verification",
      "Pesticide residue testing",
      "Heavy metal contamination checks",
      "Microbiological analysis",
      "Moisture content standards",
      "Packaging and labeling compliance"
    ]
  },
  {
    number: "03",
    title: "Packaging & Shipping",
    description: "Proper packaging ensures freshness and compliance with international shipping regulations.",
    icon: Package,
    details: [
      "Food-grade packaging materials",
      "Moisture-proof containers",
      "Proper labeling with origin and batch numbers",
      "Temperature-controlled shipping for sensitive spices",
      "Insurance coverage for transit",
      "Compliance with IATA/IMDG regulations"
    ]
  },
  {
    number: "04",
    title: "Customs & Clearance",
    description: "Navigate customs procedures efficiently to avoid delays and additional costs.",
    icon: Globe,
    details: [
      "Customs declaration filing",
      "Duty and tax calculations",
      "Port handling and clearance",
      "Storage facility arrangements",
      "Inspection and sampling procedures",
      "Release documentation"
    ]
  }
];

const benefits = [
  {
    title: "Direct Sourcing",
    description: "Work directly with farmers and processors for better quality control and pricing."
  },
  {
    title: "Bulk Pricing",
    description: "Import in larger quantities to benefit from economies of scale and reduced per-unit costs."
  },
  {
    title: "Quality Assurance",
    description: "Access to premium-grade spices with guaranteed purity and authenticity."
  },
  {
    title: "Customization",
    description: "Request specific grades, packaging, and blends tailored to your business needs."
  }
];

const requirements = [
  {
    category: "Legal Requirements",
    items: [
      "Valid Import License",
      "Business Registration",
      "Tax Identification Number",
      "FSSAI License (for food products)",
      "IEC (Import Export Code)"
    ]
  },
  {
    category: "Documentation",
    items: [
      "Commercial Invoice",
      "Packing List",
      "Certificate of Origin",
      "Phytosanitary Certificate",
      "Bill of Lading",
      "Insurance Certificate"
    ]
  },
  {
    category: "Quality Certifications",
    items: [
      "Organic Certification (if applicable)",
      "Fair Trade Certification",
      "ISO 22000 (Food Safety)",
      "HACCP Certification",
      "GMP Compliance"
    ]
  }
];

export default function ImportGuide() {
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
            Import Guide
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-8 text-primary-foreground">
            Guide to <span className="italic text-accent">Import Spices</span>
          </h1>
          <p className="font-sans text-xl text-primary-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive guide to importing premium spices from India. Learn about documentation, compliance, quality standards, and best practices for successful spice imports.
          </p>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-gray-800">
                Why Import from <span className="italic text-accent">India?</span>
              </h2>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
                India is the world's largest producer, consumer, and exporter of spices, accounting for over 75% of global spice production. With a heritage spanning centuries, Indian spices are renowned for their quality, purity, and authentic flavor profiles.
              </p>
              <div className="space-y-4">
                {[
                  "75% of global spice production",
                  "200+ varieties of spices",
                  "Centuries of expertise",
                  "Strict quality standards"
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-sans text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                alt="Spice Import"
                fill
                className="object-cover"
                quality={90}
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="font-serif text-5xl md:text-6xl text-center mb-4 text-primary-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Import <span className="italic text-accent">Process</span>
          </motion.h2>
          <motion.p
            className="font-semibold text-xs uppercase tracking-widest text-accent text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Four Essential Steps
          </motion.p>

          <div className="space-y-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                >
                  <div className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-accent mb-2 block">{step.number}</span>
                        <h3 className="font-serif text-3xl md:text-4xl mb-4 text-primary-foreground">{step.title}</h3>
                        <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-20 space-y-3">
                      {step.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.2 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          <span className="font-sans text-primary-foreground">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className={`${idx % 2 === 1 ? 'md:order-1' : ''} relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl`}>
                    <Image
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                      alt={step.title}
                      fill
                      className="object-cover"
                      quality={90}
                      unoptimized
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="font-serif text-5xl text-center mb-16 text-primary-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Benefits of <span className="italic text-accent">Direct Import</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 border border-primary/10 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow rounded-lg"
              >
                <h3 className="font-serif text-xl mb-3 text-accent">{benefit.title}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-32 px-6 bg-[#1A1A1A]">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="font-serif text-5xl md:text-6xl text-center mb-4 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Import <span className="italic text-accent">Requirements</span>
          </motion.h2>
          <motion.p
            className="font-mono text-xs uppercase tracking-widest text-accent text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Essential Checklist
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requirements.map((req, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 bg-[#2D2D2D] rounded-lg border border-[#3D3D3D]"
              >
                <h3 className="font-serif text-2xl mb-6 text-white">{req.category}</h3>
                <ul className="space-y-3">
                  {req.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-[#B0B0B0]">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Ready to Start <span className="italic text-accent">Importing?</span>
            </h2>
            <p className="font-sans text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Contact our export team for personalized assistance with your spice import requirements. We'll guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 font-medium hover:bg-accent/90 transition-colors rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Export Team
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.button
                className="inline-flex items-center gap-2 border-2 border-accent text-accent px-8 py-4 font-medium hover:bg-accent/10 transition-colors rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Download Import Guide PDF
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-accent/10 border-l-4 border-accent p-8 rounded-lg"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-2xl mb-4 text-primary-foreground">Important Notes</h3>
                <ul className="space-y-3 font-sans text-muted-foreground">
                  <li>• Import regulations vary by country. Always check with your local customs authority for the most current requirements.</li>
                  <li>• Some spices may require special permits or have restrictions in certain countries.</li>
                  <li>• Quality testing and certification may be mandatory depending on the destination country.</li>
                  <li>• Consider working with a customs broker or freight forwarder for smoother import processes.</li>
                  <li>• Keep all documentation organized and easily accessible for customs clearance.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Linkedin, Mail, Award, Users } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "Piyush Gupta",
    role: "Founder & CEO",
    description: "Visionary leader with a passion for preserving authentic spice heritage. Piyush brings decades of experience in the spice industry, combining traditional knowledge with modern innovation to deliver exceptional quality products worldwide.",
    image: "https://res.cloudinary.com/dzle7cpta/image/upload/v1767349748/WhatsApp_Image_2025-12-30_at_3.20.45_PM_lj78bb.jpg",
    achievements: [
      "25+ years in spice industry",
      "Global expansion strategist",
      "Heritage preservation advocate"
    ],
    email: "piyush@nexrisespices.com",
    linkedin: "https://linkedin.com/in/piyushgupta"
  },
  {
    id: 2,
    name: "Gaurav Agrawal",
    role: "Co-Founder",
    description: "Innovation-driven co-founder specializing in sustainable sourcing and quality assurance. Gaurav's expertise in supply chain management and farmer partnerships ensures we maintain the highest standards while supporting local communities.",
    image: "https://res.cloudinary.com/dzle7cpta/image/upload/v1767349535/WhatsApp_Image_2025-12-30_at_3.20.42_PM_nsef8v.jpg",
    achievements: [
      "Supply chain optimization expert",
      "Sustainable farming advocate",
      "Quality assurance specialist"
    ],
    email: "gaurav@nexrisespices.com",
    linkedin: "https://linkedin.com/in/gauravagrawal"
  }
];

export default function Team() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      <section className="pt-40 pb-20 px-6 container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Leadership & Vision
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            Meet Our <span className="italic text-accent">Team</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate leaders dedicated to bringing you the finest spices while preserving heritage and supporting sustainable practices.
          </p>
        </motion.div>
      </section>

      {/* Team Members Section */}
      <section className="pb-12 px-6 container mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-white border border-primary/10 overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-lg">
                {/* Image Section */}
                <div className="relative h-96 overflow-hidden bg-stone-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Role Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-widest px-4 py-2">
                      {member.role}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-16 h-16 border-2 border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45 z-20" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform rotate-45 z-20" />
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Name */}
                  <h3 className="font-serif text-3xl md:text-4xl text-accent mb-3 text-primary-foreground">
                    {member.name}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm text-primary-foreground leading-relaxed mb-6">
                    {member.description}
                  </p>

                  {/* Achievements */}
                  {/* <div className="mb-6 pb-6 border-b border-primary/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Key Achievements
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {member.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <span className="font-sans text-sm text-foreground">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div> */}

                  {/* Contact Links */}
                  {/* <div className="flex items-center gap-4">
                    <motion.a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-accent hover:text-muted-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-sans text-sm">Email</span>
                    </motion.a>
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-muted-foreground transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="font-sans text-sm">LinkedIn</span>
                    </motion.a>
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-10 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="font-serif text-4xl md:text-5xl text-center mb-12 text-primary-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our <span className="italic text-accent">Commitment</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "Uncompromising quality in every product we deliver"
              },
              {
                icon: Users,
                title: "Community",
                description: "Supporting farmers and local communities worldwide"
              },
              {
                icon: Award,
                title: "Heritage",
                description: "Preserving traditional methods and authentic flavors"
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-8 border border-primary/10 bg-white/50 hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-2xl mb-3 text-accent">{value.title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="py-20 bg-primary text-primary-foreground px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Join Our Journey</h2>
          <p className="font-sans text-lg opacity-90 mb-8">
            Experience the passion and dedication behind every spice we offer.
          </p>
          <motion.a
            href="/products"
            className="inline-block bg-accent text-accent-foreground font-medium px-8 py-3 hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Products
          </motion.a>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}


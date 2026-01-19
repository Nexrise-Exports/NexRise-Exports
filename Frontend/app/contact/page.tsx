"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@nexriseexports.com",
    description: "We respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 95658 51852",
    description: "Monday - Friday, 9AM - 6PM IST"
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "D 47/210 A Ramapura, Varanasi, Uttar Pradesh, India",
    description: "Est. 2026"
  },
];

type InquiryType = "general" | "supplier" | "buyer";

export default function Contact() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");

  // General form data
  const [generalFormData, setGeneralFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Supplier form data
  const [supplierFormData, setSupplierFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    companyWebsite: "",
    certifications: "",
    categories: [] as string[],
    message: "",
  });

  // Buyer form data
  const [buyerFormData, setBuyerFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companyWebsite: "",
    yearsInBusiness: "",
    anticipatedVolume: "",
    distributionModel: [] as string[],
    productsOfInterest: [] as string[],
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supplierCategories = [
    "Whole Spices",
    "Powder Spices",
    "Popular Spices",
    "Other"
  ];

  const distributionModels = [
    "Retail",
    "Wholesale",
    "Industrial",
    "Online",
    "Foodservice",
    "Other"
  ];

  const productsOfInterest = [
    "Whole Spices", "Powder Spices", "Popular Spices", "Other"
  ];

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneralFormData({
      ...generalFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSupplierFormData({
      ...supplierFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSupplierCategoryToggle = (category: string) => {
    setSupplierFormData({
      ...supplierFormData,
      categories: supplierFormData.categories.includes(category)
        ? supplierFormData.categories.filter(c => c !== category)
        : [...supplierFormData.categories, category],
    });
  };

  const handleBuyerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBuyerFormData({
      ...buyerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDistributionToggle = (model: string) => {
    setBuyerFormData({
      ...buyerFormData,
      distributionModel: buyerFormData.distributionModel.includes(model)
        ? buyerFormData.distributionModel.filter(m => m !== model)
        : [...buyerFormData.distributionModel, model],
    });
  };

  const handleProductsToggle = (product: string) => {
    setBuyerFormData({
      ...buyerFormData,
      productsOfInterest: buyerFormData.productsOfInterest.includes(product)
        ? buyerFormData.productsOfInterest.filter(p => p !== product)
        : [...buyerFormData.productsOfInterest, product],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload: any = {
        type: inquiryType,
      };

      if (inquiryType === "general") {
        payload = {
          ...payload,
          name: `${generalFormData.firstName} ${generalFormData.lastName}`,
          email: generalFormData.email,
          message: generalFormData.message,
        };
      } else if (inquiryType === "supplier") {
        payload = {
          ...payload,
          name: `${supplierFormData.firstName} ${supplierFormData.lastName}`,
          email: supplierFormData.email,
          message: supplierFormData.message,
          company: supplierFormData.company,
          companyWebsite: supplierFormData.companyWebsite,
          certifications: supplierFormData.certifications,
          categories: supplierFormData.categories,
        };
      } else if (inquiryType === "buyer") {
        payload = {
          ...payload,
          name: `${buyerFormData.firstName} ${buyerFormData.lastName}`,
          email: buyerFormData.email,
          phone: buyerFormData.phone,
          message: buyerFormData.message,
          company: buyerFormData.company,
          companyWebsite: buyerFormData.companyWebsite,
          yearsInBusiness: buyerFormData.yearsInBusiness,
          anticipatedVolume: buyerFormData.anticipatedVolume,
          distributionModel: buyerFormData.distributionModel,
          productsOfInterest: buyerFormData.productsOfInterest,
        };
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setSubmitted(true);

      // Reset forms
      setGeneralFormData({ firstName: "", lastName: "", email: "", message: "" });
      setSupplierFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        companyWebsite: "",
        certifications: "",
        categories: [],
        message: ""
      });
      setBuyerFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        companyWebsite: "",
        yearsInBusiness: "",
        anticipatedVolume: "",
        distributionModel: [],
        productsOfInterest: [],
        message: ""
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <section className="pt-40 pb-16 px-6 container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Get in Touch
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            Expert Support, Just a <br /><span className="italic text-accent"> Click Away!</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe every inquiry deserves a direct path to expertise. Whether you’re interested in our products, want a customized approach, or are exploring opportunities within our worldwide supply chain, our team is here to ensure your message reaches the right hands quickly and effectively.

          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-1 px-1">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-4 md:p-8 bg-white border border-primary/10 text-center hover:shadow-lg transition-shadow rounded-lg"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <Icon className="w-8 h-8 text-accent" />
                  </motion.div>
                  <h3 className="font-serif text-2xl mb-2 text-primary-foreground">{info.title}</h3>
                  <p className="font-sans font-medium text-accent mb-1">{info.value}</p>
                  <p className="font-sans text-sm text-primary-foreground">{info.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-5 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-serif text-4xl text-center mb-4 text-primary-foreground">Send us a Message</h2>
          </motion.div>

          {/* Inquiry Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 p-6 bg-white border border-primary/20"
          >
            <label className="font-mono text-xs uppercase tracking-widest block mb-4 text-accent">
              Type of Inquiry
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="inquiryType"
                  value="general"
                  checked={inquiryType === "general"}
                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  className="mt-1 w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-primary-foreground">General </span>
                  <span className="text-muted-foreground"> for inquiries, comments, or feedback about NexRise Exports.</span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="inquiryType"
                  value="supplier"
                  checked={inquiryType === "supplier"}
                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  className="mt-1 w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-primary-foreground">Supplier</span>
                  <span className="text-muted-foreground"> for inquiries about becoming an approved vendor or offering us your spices.</span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="inquiryType"
                  value="buyer"
                  checked={inquiryType === "buyer"}
                  onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  className="mt-1 w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-primary-foreground">Buyer</span>
                  <span className="text-muted-foreground"> for purchasing NexRise Exports products or exploring our services.</span>
                </div>
              </label>
            </div>
          </motion.div>

          <motion.form
            key={inquiryType}
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs text-muted-foreground mb-4">* Required fields</p>

            {/* General Form */}
            {inquiryType === "general" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={generalFormData.firstName}
                      onChange={handleGeneralChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="First Name"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={generalFormData.lastName}
                      onChange={handleGeneralChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Last Name"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="relative">
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Email *
                  </label>
                  <Mail className="absolute right-4 top-10 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={generalFormData.email}
                    onChange={handleGeneralChange}
                    required
                    className="text-black w-full px-4 py-3 pr-10 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={generalFormData.message}
                    onChange={handleGeneralChange}
                    required
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors resize-none min-h-32"
                    placeholder="Your message..."
                  />
                </motion.div>
              </>
            )}

            {/* Supplier Form */}
            {inquiryType === "supplier" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={supplierFormData.firstName}
                      onChange={handleSupplierChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="First Name"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={supplierFormData.lastName}
                      onChange={handleSupplierChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Last Name"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="relative">
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Email *
                  </label>
                  <Mail className="absolute right-4 top-10 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={supplierFormData.email}
                    onChange={handleSupplierChange}
                    required
                    className="text-black w-full px-4 py-3 pr-10 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={supplierFormData.company}
                    onChange={handleSupplierChange}
                    required
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Company Name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={supplierFormData.companyWebsite}
                    onChange={handleSupplierChange}
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="https://www.example.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Certifications
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={supplierFormData.certifications}
                    onChange={handleSupplierChange}
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Organic, Fair Trade, FSSC 22000"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Categories (check all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {supplierCategories.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={supplierFormData.categories.includes(category)}
                          onChange={() => handleSupplierCategoryToggle(category)}
                          className="w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                        />
                        <span className="text-sm text-primary-foreground">{category}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={supplierFormData.message}
                    onChange={handleSupplierChange}
                    required
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors resize-none min-h-32"
                    placeholder="Your message..."
                  />
                </motion.div>
              </>
            )}

            {/* Buyer Form */}
            {inquiryType === "buyer" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={buyerFormData.firstName}
                      onChange={handleBuyerChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="First Name"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={buyerFormData.lastName}
                      onChange={handleBuyerChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Last Name"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="relative">
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Email *
                  </label>
                  <Mail className="absolute right-4 top-10 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={buyerFormData.email}
                    onChange={handleBuyerChange}
                    required
                    className="text-black w-full px-4 py-3 pr-10 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={buyerFormData.phone}
                    onChange={handleBuyerChange}
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="+91 XXXX XXXXXX"
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={buyerFormData.company}
                      onChange={handleBuyerChange}
                      required
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Company Name"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={buyerFormData.companyWebsite}
                      onChange={handleBuyerChange}
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="https://www.example.com"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Years in Business
                    </label>
                    <input
                      type="text"
                      name="yearsInBusiness"
                      value={buyerFormData.yearsInBusiness}
                      onChange={handleBuyerChange}
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="e.g., 5"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                      Anticipated Annual Volume (lb)
                    </label>
                    <input
                      type="text"
                      name="anticipatedVolume"
                      value={buyerFormData.anticipatedVolume}
                      onChange={handleBuyerChange}
                      className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="e.g., 10000"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Distribution model (choose all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {distributionModels.map((model) => (
                      <label key={model} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={buyerFormData.distributionModel.includes(model)}
                          onChange={() => handleDistributionToggle(model)}
                          className="w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                        />
                        <span className="text-sm text-primary-foreground">{model}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Products of interest (choose all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {productsOfInterest.map((product) => (
                      <label key={product} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={buyerFormData.productsOfInterest.includes(product)}
                          onChange={() => handleProductsToggle(product)}
                          className="w-4 h-4 text-accent border-primary/20 focus:ring-accent"
                        />
                        <span className="text-sm text-primary-foreground">{product}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-accent">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={buyerFormData.message}
                    onChange={handleBuyerChange}
                    required
                    className="text-black w-full px-4 py-3 border border-primary/20 bg-white/50 focus:outline-none focus:border-accent transition-colors resize-none min-h-32"
                    placeholder="Your message..."
                  />
                </motion.div>
              </>
            )}

            <motion.button
              type="submit"
              variants={itemVariants}
              className="w-full bg-accent text-accent-foreground py-4 font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitted || isSubmitting}
            >
              <Send className="w-4 h-4" />
              {submitted ? "Message Sent!" : isSubmitting ? "Sending..." : "SEND"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Saffron: India's Red Gold",
    excerpt: "Discover the centuries-old tradition of saffron cultivation in Kashmir and why it's considered the world's most precious spice.",
    date: "December 20, 2024",
    author: "Rajesh Vora",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "From Farm to Table: Our Quality Process",
    excerpt: "Behind every bottle of NexRise Spices is a rigorous quality control process that ensures purity and potency.",
    date: "December 15, 2024",
    author: "Priya Sharma",
    category: "Process",
    image: "https://plus.unsplash.com/premium_photo-1666174933753-36abe3cb834b?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Sustainable Spice Farming: Building the Future",
    excerpt: "How NexRise Spices supports organic farming practices and fair trade with our farming partners across India.",
    date: "December 10, 2024",
    author: "Amit Patel",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Cooking with Cinnamon: Recipes & Benefits",
    excerpt: "Explore delicious recipes and discover the health benefits of Ceylon cinnamon in your daily cooking.",
    date: "December 5, 2024",
    author: "Chef Maya",
    category: "Recipes",
    image: "https://plus.unsplash.com/premium_photo-1666174933753-36abe3cb834b?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "100 Years of Excellence: Our Legacy",
    excerpt: "A century of crafting premium spices. Read about the milestones that shaped NexRise Spices into what it is today.",
    date: "November 28, 2024",
    author: "Rajesh Vora",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Black Pepper: The King of Spices",
    excerpt: "Learn about Malabar black pepper, its unique flavor profile, and how to use it to enhance your dishes.",
    date: "November 20, 2024",
    author: "Priya Sharma",
    category: "Spice Guide",
    image: "https://plus.unsplash.com/premium_photo-1666174933753-36abe3cb834b?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: "5 min read"
  },
];

export default function Blog() {
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
          className="text-center mb-12"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Stories & Insights
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            The NexRise <span className="italic text-accent">Blog</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore stories of heritage, recipes, sustainability, and the art of crafting premium spices.
          </p>
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-32 px-6 container mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="group cursor-pointer border border-primary/10 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              whileHover={{ y: -8 }}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Category Badge */}
                <motion.span
                  className="absolute top-4 right-4 bg-accent text-primary font-mono text-xs uppercase tracking-widest px-3 py-1"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {post.category}
                </motion.span>
              </div>

              {/* Content */}
              <div className="p-6">
                <motion.h3
                  className="font-serif text-2xl mb-3 text-accent group-hover:text-muted-foreground transition-colors "
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {post.title}
                </motion.h3>

                <p className="font-sans text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="space-y-3 mb-6 pb-6 border-t border-primary/10 pt-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="font-sans text-xs uppercase tracking-widest opacity-50 text-gray-700">
                    {post.readTime}
                  </div>
                </div>

                {/* Read More Button */}
                {/* <motion.button
                  className="flex items-center gap-2 font-sans text-sm group/btn text-accent hover:text-muted-foreground transition-colors hover:underline"
                  whileHover={{ gap: 8 }}
                >
                  Read More
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button> */}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

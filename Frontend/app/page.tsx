"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Image from "next/image";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { useProducts, useTestimonials, useFlags } from "@/hooks/use-products";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { ArrowDown, Star, Search } from "lucide-react";
import Link from "next/link";
import { SpiceLoader } from "@/components/SpiceLoader";
import { MagicSearch } from "@/components/MagicSearch";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase() || "??";
};

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: products } = useProducts();
  const { data: testimonialData } = useTestimonials();
  const { data: flagData } = useFlags();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMagicSearchOpen, setIsMagicSearchOpen] = useState(false);

  const testimonials = testimonialData?.data || [];
  const dynamicFlags = flagData?.data || [];

  useEffect(() => {
    // Initialize Lenis for smooth scrolling with optimized settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Integrate Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP Animations with hardware acceleration
    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroRef.current) {
        const heroTitle = heroRef.current.querySelector(".hero-title");
        const heroSubtitle = heroRef.current.querySelector("h2");
        const heroText = heroRef.current.querySelector("p");
        const heroArrow = heroRef.current.querySelector("svg");

        gsap.set([heroTitle, heroSubtitle, heroText, heroArrow], {
          willChange: "transform, opacity",
          force3D: true
        });

        gsap.from(heroTitle, {
          opacity: 0,
          y: 100,
          scale: 0.8,
          ease: "power4.out",
          duration: 1.2,
          delay: 0.2,
        });

        gsap.from(heroSubtitle, {
          opacity: 0,
          y: 30,
          ease: "power3.out",
          duration: 0.8,
          delay: 0.6,
        });

        gsap.from(heroText, {
          opacity: 0,
          y: 20,
          ease: "power2.out",
          duration: 0.8,
          delay: 0.9,
        });

        gsap.from(heroArrow, {
          opacity: 0,
          y: 10,
          ease: "power2.out",
          duration: 0.6,
          delay: 1.2,
          yoyo: true,
          repeat: -1,
        });
      }

      // Journey Section animations with hardware acceleration
      if (journeyRef.current) {
        const journeyCards = journeyRef.current.querySelectorAll(".journey-card");

        journeyCards.forEach((card, idx) => {
          gsap.set(card as HTMLElement, {
            willChange: "transform, opacity",
            force3D: true
          });

          gsap.from(card as HTMLElement, {
            opacity: 0,
            y: 80,
            scale: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card as HTMLElement,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            duration: 1,
            delay: idx * 0.15,
          });
        });

        // Animate journey numbers with hardware acceleration
        const journeyNumbers = journeyRef.current.querySelectorAll(".journey-number");
        journeyNumbers.forEach((num) => {
          gsap.set(num as HTMLElement, {
            willChange: "transform, opacity",
            force3D: true,
            transformOrigin: "center center"
          });

          gsap.from(num as HTMLElement, {
            opacity: 0,
            scale: 0,
            rotation: -180,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: num as HTMLElement,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            duration: 0.8,
          });
        });
      }

      // Stagger number animation on scroll with smooth counting
      const statElements = document.querySelectorAll<HTMLElement>(".stat-number");
      statElements.forEach((stat) => {
        gsap.set(stat, { willChange: "contents" });

        const value = parseInt(stat.dataset.value || "0");
        gsap.to(stat, {
          textContent: value,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          onUpdate: function () {
            const currentValue = Math.round(parseInt(this.targets()[0].textContent || "0"));
            this.targets()[0].textContent = currentValue.toString();
          }
        });
      });
    }, containerRef);

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlayThrough = () => {
      // Ensure video can play through without stopping
      video.play().catch(() => {
        // Autoplay might be blocked, but we still show the content
        setIsVideoLoaded(true);
      });
      setIsVideoLoaded(true);
    };

    const handleLoadedData = () => {
      // Ensure video is ready to play
      if (video.readyState >= 3) {
        video.play().catch(() => {
          setIsVideoLoaded(true);
        });
        setIsVideoLoaded(true);
      }
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);

    // If video is already loaded
    if (video.readyState >= 3) {
      video.play().catch(() => {
        setIsVideoLoaded(true);
      });
      setIsVideoLoaded(true);
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);


  return (
    <div ref={containerRef} className="bg-background relative overflow-hidden">
      {/* Loading overlay - hides content until video is loaded */}
      {!isVideoLoaded && (
        <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground"><SpiceLoader /></div>
        </div>
      )}

      <div className="grain-overlay" />

      {/* Magic Search Dialog */}
      <MagicSearch open={isMagicSearchOpen} onOpenChange={setIsMagicSearchOpen} />


      {/* Hero Section with enhanced animations */}
      <header ref={heroRef} className="relative h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0" style={{ height: "120%" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          >
            <source src="/B_B_Export_Product_Montage_Video.mp4" type="video/mp4" />
          </video>
          {/* Black backdrop overlay */}
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 text-center px-3">
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-8 opacity-60">
            Est. 2026 • Varanasi, Uttar Pradesh
          </p>

          <div className="overflow-hidden mb-4">
            <h1 className="hero-title font-serif text-[13vw] leading-[1.5] md:text-[8rem] text-primary tracking-tighter mr-3 italic">
              NexRise Exports
            </h1>
          </div>

          <h2 className="font-serif text-xl md:text-xl italic text-accent mt-8">
            Crafted in silence. Delivered with care. Celebrated across the world.
          </h2>

          <p className="font-sans text-sm md:text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
            Let's spice up your life.
          </p>

          {/* Search Bar with View Products Button */}
          <div className="flex items-center justify-center mt-8">
            <div className="relative w-full max-w-xl">
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden hover:bg-white/15 transition-all duration-300">
                {/* Search Icon and Input Area */}
                <button
                  onClick={() => setIsMagicSearchOpen(true)}
                  className="flex items-center flex-1 px-3 py-2 text-left group"
                >
                  <Search className="w-5 h-5 text-primary mr-3 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground group-hover:text-white transition-colors">
                    Search products...
                  </span>
                  <div className="hidden sm:flex items-center gap-1 ml-auto mr-2 px-2 py-1 bg-stone-100/10 border border-white/20 rounded text-[10px] text-white/60 font-mono tracking-tight grayscale">
                    Ctrl + K
                  </div>
                </button>

                {/* View Products Button */}
                <Link href="/products">
                  <button className="bg-accent text-white px-3 py-1 font-serif text-md hover:bg-primary hover:text-black transition-all duration-300 rounded-full whitespace-nowrap mr-1">
                    View Products
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Marquee items={["Organic Certified", "Single Origin", "Hand Picked", "Sun Dried", "Small Batch", "Global GAP Certified"]} />

      {/* Heritage / About Section with scroll animations */}
      {/* <section id="heritage" className="py-32 px-6 container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <h3 className="text-4xl md:text-6xl font-serif leading-tight">
              A century of <br/>
              <span className="italic text-accent text-4xl md:text-6xl">uncompromising</span> <br/>
              flavor.
            </h3>
            <p className="font-sans text-lg md:text-xl leading-relaxed text-muted-foreground text-balance">
              From the bustling spice markets of Unjha to kitchens across the globe, 
              NexRise Spices has remained the gold standard for purity and potency. 
              We don't just sell spices; we curate history.
            </p>
          </motion.div>

          <motion.div 
            className="aspect-[4/5] relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?q=80&w=1123&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Vintage Spice Market" 
              fill
              className="object-cover shadow-2xl"
              quality={90}
              unoptimized
            />
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-background p-8 border border-primary/10 shadow-lg max-w-xs hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <p className="font-serif italic text-2xl">
                "Flavor is the memory of the earth."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-10 bg-primary text-primary-foreground px-6">
        <div className="container mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Est. 2026", value: 1 },
            { label: "Countries", value: 5 },
            { label: "Spices", value: 20 },
            { label: "Happy Customers", value: 100 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="stat-number text-4xl md:text-5xl font-serif font-bold text-black" data-value={stat.value} >
                0
              </div>
              <p className="font-bold text-sm uppercase tracking-widest mt-2 opacity-80 text-accent">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collection Grid */}
      <section ref={collectionRef} id="collection" className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="collection-header flex justify-between items-end mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <div>
              <motion.p
                className="font-mono text-sm uppercase tracking-widest text-accent mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                The Collection
              </motion.p>
              <motion.h2
                className="text-5xl font-serif text-primary-foreground"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                Curated <span className="italic text-accent">Essentials</span>
              </motion.h2>
            </div>
            <motion.a
              href="/products"
              className="hidden md:block font-serif italic text-lg hover:underline decoration-1 underline-offset-4 text-accent"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ x: 5 }}
              style={{ willChange: "transform, opacity" }}
            >
              View Full Products →
            </motion.a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {(() => {
              const productList = Array.isArray(products) ? products : (products as any)?.products || [];
              return productList.slice(0, 6).map((product: any, i: number) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  slug={product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                />
              ));
            })()}

            {(() => {
              const productList = Array.isArray(products) ? products : (products as any)?.products || [];
              return !productList.length && Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-stone-100 animate-pulse" />
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Journey Section - From Source to Table */}
      <section ref={journeyRef} id="process" className="py-12 px-6 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Our Process
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-4">
              From Source to <span className="italic text-accent">Table</span>
            </h2>
            <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
              A journey of uncompromising quality at every step
            </p>
          </motion.div>

          {/* Journey Cards */}
          <div className="space-y-8 md:space-y-12">
            {/* Step 1: Sourcing */}
            <div className="journey-card relative">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <motion.div
                  className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                    alt="Spice Farming"
                    fill
                    className="object-cover"
                    quality={90}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="journey-number w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-serif text-2xl font-bold shadow-lg">
                      01
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                      Step One
                    </p>
                    <h3 className="font-serif text-4xl md:text-5xl text-accent mb-4">
                      Direct Sourcing
                    </h3>
                  </div>
                  <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                    We work directly with farmers in Guntur, Alleppey, and Unjha,
                    ensuring fair trade practices and the highest oil content in every batch.
                    Our relationships span generations, built on trust and quality.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {["Fair Trade", "Single Origin", "Organic Certified"].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-accent/10 text-primary-foreground text-sm font-medium rounded-full border border-accent/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Step 2: Processing */}
            <div className="journey-card relative">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <motion.div
                  className="space-y-6 order-2 md:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                      Step Two
                    </p>
                    <h3 className="font-serif text-4xl md:text-5xl text-accent mb-4">
                      Cryogenic Processing
                    </h3>
                  </div>
                  <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                    Our state-of-the-art cryogenic grinding preserves the volatile oils
                    that give spices their soul. No additives, no colors, just pure essence
                    captured at the perfect moment of freshness.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {["No Additives", "Cold Processed", "Volatile Oils Preserved"].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-accent/10 text-primary-foreground text-sm font-medium rounded-full border border-accent/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl order-1 md:order-2"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Image
                    src="https://plus.unsplash.com/premium_photo-1692776206795-60a58a4dc817?q=80&w=1028&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Spice Processing"
                    fill
                    className="object-cover"
                    quality={90}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 right-6">
                    <div className="journey-number w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-serif text-2xl font-bold shadow-lg ml-auto">
                      02
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Step 3: Delivery */}
            <div className="journey-card relative">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <motion.div
                  className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                    alt="Global Delivery"
                    fill
                    className="object-cover"
                    quality={90}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="journey-number w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-serif text-2xl font-bold shadow-lg">
                      03
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                      Step Three
                    </p>
                    <h3 className="font-serif text-4xl md:text-5xl text-accent mb-4">
                      Global Reach
                    </h3>
                  </div>
                  <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                    From our facility to 45 countries worldwide, we deliver the authentic
                    taste of India to global kitchens. Each package is sealed with care,
                    ensuring freshness from our hands to yours.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {["45 Countries", "Fast Shipping", "Fresh Sealed"].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-accent/10 text-primary-foreground text-sm font-medium rounded-full border border-accent/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Only show if data exists */}
      {testimonials.length > 0 && (
        <section className="py-12 px-6 bg-white relative">
          <div className="container mx-auto max-w-6xl">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
                Customer Stories
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-4">
                Loved by <span className="italic text-accent">Thousands</span>
              </h2>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our customers across India have to say about NexRise Spices
              </p>
            </motion.div>

            {/* Testimonials Grid - Show exactly 3 for premium layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {testimonials.slice(0, 3).map((testimonial: any, idx: number) => (
                <motion.div
                  key={testimonial._id || idx}
                  className="bg-white border border-primary/10 p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: "transform, opacity" }}
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
                  <p className="font-sans text-muted-foreground leading-relaxed mb-6 flex-grow">
                    "{testimonial.content}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-primary/10">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-lg font-semibold text-primary">
                        {getInitials(testimonial.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View More Button - Link to full testimonials page */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <Link href="/testimonials">
                <motion.button
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 font-medium hover:bg-primary hover:text-black transition-colors duration-300 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: "transform" }}
                >
                  View More Testimonials
                  <ArrowDown className="w-4 h-4 rotate-[-90deg]" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Countries We Import To Section - Only show if data exists */}
      {dynamicFlags.length > 0 && (
        <section className="py-12 px-6 bg-white relative">
          <div className="container mx-auto max-w-6xl">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
                Global Reach
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-4">
                Countries We <span className="italic text-accent">Import To</span>
              </h2>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                Our premium spices reach kitchens and markets across the globe, bringing authentic flavors to every corner of the world.
              </p>
            </motion.div>

            {/* Countries Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {dynamicFlags.map((country: any, idx: number) => (
                <motion.div
                  key={country._id || idx}
                  className="group bg-white border border-primary/10 p-4 rounded-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  
                  <div className="relative w-24 h-24 mt-4 overflow-hidden rounded-full bg-stone-50 border border-primary/5 mx-auto">
                    <Image
                      src={country.imageUrl}
                      alt={country.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110 p-2"
                      unoptimized
                    />
                    
                  </div>
                  <h3 className="font-serif text-lg text-primary-foreground group-hover:text-accent transition-colors">
                    {country.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Product Detail Modal with animations */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none shadow-2xl rounded-none h-[90vh] md:h-auto">
          {selectedProduct && (
            <motion.div
              className="grid md:grid-cols-2 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity" }}
            >
              <motion.div
                className="bg-stone-100 relative h-64 md:h-full overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  quality={90}
                  unoptimized
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-accent">
                    {selectedProduct.region}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="p-8 md:p-12 flex flex-col justify-center"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <DialogHeader>
                  <DialogTitle className="font-serif text-4xl md:text-5xl mb-4">
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription className="font-sans text-lg text-muted-foreground leading-relaxed">
                    {selectedProduct.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-12 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-2 opacity-50">Taste Profile</h4>
                    <p className="font-serif text-xl italic">{selectedProduct.tasteProfile}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <h4 className="font-mono text-xs uppercase tracking-widest mb-3 opacity-50">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags?.map((tag, idx) => (
                        <motion.span
                          key={tag}
                          className="border border-primary/20 px-3 py-1 text-xs rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="pt-8 border-t border-primary/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <motion.button
                      className="w-full bg-primary text-primary-foreground py-4 hover:bg-accent transition-colors duration-300 font-medium tracking-wide"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      style={{ willChange: "transform" }}
                    >
                      Request Sample
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


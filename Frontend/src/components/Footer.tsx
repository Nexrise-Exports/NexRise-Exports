"use client";

import Image from "next/image";
import { useCreateInquiry } from "@/hooks/use-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Linkedin, Instagram } from "lucide-react";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
export function Footer() {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateInquiry();

  const form = useForm<z.infer<typeof insertInquirySchema>>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      type: "general",
    },
  });

  const onSubmit = (data: z.infer<typeof insertInquirySchema>) => {
    mutate(
      {
        ...data,
        type: "general",
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "We will respond to your request shortly.",
          });
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <footer id="contact" className="bg-primary text-primary-foreground pt-5 pb-10 px-3">
      <div className="container mx-auto max-w-7xl">
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-[10vw] lg:text-[8rem] leading-[0.8] font-serif tracking-tighter select-none text-accent">
                NEXRISE
              </h2>
              <div className="mt-8 space-y-2 font-mono text-sm opacity-60">
                <p>HERITAGE SPICES & BLENDS</p>
                <p>EST. 2026 — VARANASI</p>
              </div>
              
              <div className="mt-12 font-sans text-sm opacity-80 space-y-3">
                <div>
                  <h4 className="font-mono text-xs uppercase mb-2 opacity-50">Headquarters</h4>
                  <p>124 Spice Market Road</p>
                  <p>Varanasi, Uttar Pradesh 221002</p>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-3xl font-serif italic">Begin your journey.</h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-1">
                <input
                  {...form.register("name")}
                  placeholder="Your Name"
                  className="w-full bg-gray-300 border-b border-white/20 py-4 text-xl focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans p-2 rounded-md"
                />
                {form.formState.errors.name && (
                  <span className="text-destructive text-xs">{form.formState.errors.name.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <input
                  {...form.register("email")}
                  placeholder="Email Address"
                  type="email"
                  className="w-full bg-gray-300 border-b border-white/20 py-4 text-xl focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans p-2 rounded-md"
                />
                {form.formState.errors.email && (
                  <span className="text-destructive text-xs">{form.formState.errors.email.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <input
                  {...form.register("phone")}
                  placeholder="Phone Number (Optional)"
                  type="tel"
                  className="w-full bg-gray-300 border-b border-white/20 py-4 text-xl focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans p-2 rounded-md"
                />
                {form.formState.errors.phone && (
                  <span className="text-destructive text-xs">{form.formState.errors.phone.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <textarea
                  {...form.register("message")}
                  placeholder="Tell us about your needs..."
                  rows={3}
                  className="w-full bg-gray-300 border-b border-white/20 py-4 text-xl focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans p-2 rounded-md resize-none"
                />
                {form.formState.errors.message && (
                  <span className="text-destructive text-xs">{form.formState.errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group flex items-center gap-4 text-lg font-serif italic hover:text-accent transition-colors disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Submit Inquiry"}
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          

          <div className="space-y-6">
            <h3 className="text-3xl font-serif italic">Begin your journey.</h3>
            <p className="font-sans text-lg opacity-80 max-w-md">
              Ready to explore our premium spices? Get in touch with us today.
            </p>
            <div className="space-y-4">
              <a 
                href="mailto:heritage@nexrisespices.com" 
                className="group flex items-center gap-3 text-lg font-serif italic hover:text-accent transition-colors"
              >
                heritage@nexrisespices.com
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="tel:+912767254422" 
                className="group flex items-center gap-3 text-lg font-serif italic hover:text-accent transition-colors"
              >
                +91 2767 254422
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div> */}

        {/* Quick Links Section */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8 mb-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-xs uppercase mb-6 tracking-wider">Quick Links</h4>
              <ul className="space-y-3 font-sans text-sm opacity-80">
                <li>
                  <a href="/" className="hover:text-accent transition-colors">Home</a>
                </li>
                <li>
                  <a href="/products" className="hover:text-accent transition-colors">Products</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-accent transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/spices" className="hover:text-accent transition-colors">Know Your Spices</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-accent transition-colors">Contact</a>
                </li>
                <li>
                  <a href="/faqs" className="hover:text-accent transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="/license" className="hover:text-accent transition-colors">License/Certification</a>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-bold text-xs uppercase mb-6 tracking-wider">Explore</h4>
              <ul className="space-y-3 font-sans text-sm opacity-80">
                <li>
                  <a href="/import-guide" className="hover:text-accent transition-colors">Import Guide</a>
                </li>
                <li>
                  <a href="/testimonials" className="hover:text-accent transition-colors">Testimonials</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-accent transition-colors">Blog</a>
                </li>
                <li>
                  <a href="/team" className="hover:text-accent transition-colors">Team</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-xs uppercase mb-6 tracking-wider">Get in Touch</h4>
              <ul className="space-y-3 font-sans text-sm opacity-80">
                <li className="pt-2">
                  <p className="">D 47/210 A Ramapura, Varanasi, Uttar Pradesh 221001, India</p>
                </li>
                <li>
                  <a href="mailto:heritage@nexrisespices.com" className="hover:text-accent transition-colors">
                    contact@nexriseexports.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919565851852" className="hover:text-accent transition-colors">
                    +91 95658 51852
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-2">
                  <a
                    href="https://www.linkedin.com/in/nexrise-exports-28527539b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/nexriseexports8666?igsh=cnh4cmQ3ZXo1cmg2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-xs uppercase mb-6 tracking-wider">Legal</h4>
              <ul className="space-y-3 font-sans text-sm opacity-80">
                <li>
                  <a href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="hover:text-accent transition-colors">Terms & Conditions</a>
                </li>
              </ul>
            </div>


          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono  ">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
                <Image
                  src="/logo-nobg.png"
                  alt="NexRise Exports"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 48px, 56px"
                  quality={90}
                />
              </div>
              <p className="text-4xl text-accent font-serif italic">NexRise Exports</p>
            </div>
            <p className="opacity-60 mt-5">© 2026 NexRise Exports. All rights reserved.</p>
          </div>
          <Separator className="w-full mt-5 mb-5" />
          <p className="text-center text-xs font-mono opacity-60 cursor-pointer" onClick={() => window.open("https://nexerve.in", "_blank")}>Made by Nexerve India</p>
        </div>
      </div>
    </footer>
  );
}


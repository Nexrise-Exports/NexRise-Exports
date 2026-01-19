import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import CardNav from "@/components/CardNav";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { EnquiryPopup } from "@/components/EnquiryPopup";
import { SpiceLoader } from "@/components/SpiceLoader";
import { ChatbotButton } from "@/components/ChatbotButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "NexRise Spices - Heritage Spices & Blends",
  description: "Crafted in silence. Delivered with care. Celebrated across the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    {
      label: "Explore",
      bgColor: "#1A1A1A",
      textColor: "#fff",
      links: [
        { label: "Home", href: "/", ariaLabel: "Home" },
        { label: "Products", href: "/products", ariaLabel: "View Our Products" },
        { label: "Import Guide", href: "/import-guide", ariaLabel: "Guide to Import Spices" },
        { label: "License/Certification", href: "/license", ariaLabel: "License/Certification" },
      ],
    },
    {
      label: "Heritage",
      bgColor: "#2D2D2D",
      textColor: "#fff",
      links: [
        { label: "About Us", href: "/about", ariaLabel: "About NexRise Spices" },
        { label: "Know Your Spices", href: "/spices", ariaLabel: "Our Spices" },
        { label: "Team", href: "/team", ariaLabel: "Our Team" }
      ],
    },
    {
      label: "Connect",
      bgColor: "#1A1A1A",
      textColor: "#fff",
      links: [
        { label: "Contact", href: "/contact", ariaLabel: "Contact Us" },
        { label: "Testimonials", href: "/testimonials", ariaLabel: "Customer Testimonials" },
        { label: "Blog", href: "/blog", ariaLabel: "Read Our Blog" },
        { label: "FAQs", href: "/faqs", ariaLabel: "Frequently Asked Questions" }
      ],
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <SpiceLoader />
          <CardNav
            logo="/nexrise-logo.svg"
            logoAlt="NexRise Spices Logo"
            items={navItems}
            baseColor="white"
            menuColor="#1A1A1A"
            buttonBgColor="#1A1A1A"
            buttonTextColor="#F9F7F2"
            ease="power3.out"
          />
          {children}
          
          {/* Floating Action Button - appears on all pages */}
          <FloatingActionButton />
          
          {/* Chatbot Button - appears on all pages */}
          <ChatbotButton />
          
          {/* Enquiry Popup - appears on all pages after delay */}
          <EnquiryPopup delay={3} />
        </Providers>
      </body>
    </html>
  );
}


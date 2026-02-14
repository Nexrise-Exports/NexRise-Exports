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
  metadataBase: new URL("https://nexriseexports.com"),
  title: {
    default: "NexRise Exports | Premium Indian Spices & Heritage Blends",
    template: "%s | NexRise Exports"
  },
  description: "NexRise Exports is a premier B2B wholesaler of authentic Indian spices. Sourced directly from farmers, our heritage blends bring the true essence of India to the global market.",
  keywords: [
    "NexRise Exports",
    "Indian spices",
    "spice exporters India",
    "wholesale spices",
    "premium spices",
    "organic spices",
    "B2B spice supplier",
    "Varanasi spices",
    "heritage spice blends",
    "turmeric wholesale",
    "red chilli exports",
    "cardamom suppliers",
    "cumin traders",
    "authentic Indian flavors"
  ],
  authors: [{ name: "NexRise Exports" }],
  creator: "NexRise Exports",
  publisher: "NexRise Exports",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexriseexports.com",
    siteName: "NexRise Exports",
    title: "NexRise Exports | Premium Indian Spices & Heritage Blends",
    description: "Discover the rich heritage of Indian spices with NexRise Exports. Premium quality, single-origin spices delivered globally.",
    images: [
      {
        url: "/favicon.ico", // Fallback to icon if no high-res OG image exists
        width: 512,
        height: 512,
        alt: "NexRise Exports Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexRise Exports | Premium Indian Spices & Heritage Blends",
    description: "Premium Indian spices sourced directly from heritage farms. Delivered with care, celebrated worldwide.",
    images: ["/favicon.ico"],
    creator: "@NexRiseExports",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
  verification: {
    google: "verification_id", // Replace with actual ID when available
  },
};

export const viewport = {
  themeColor: "#1A1A1A",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
            logo="/logo-nobg.png"
            logoAlt="NexRise Exports Logo"
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


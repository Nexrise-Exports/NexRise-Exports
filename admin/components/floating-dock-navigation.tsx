"use client"

import React from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import {
  IconHome,
  IconPlus,
  IconList,
  IconMessage,
  IconBrandBooking,
  IconUserPlus,
  IconHelpCircle,
  IconFileText,
  IconDots,
} from "@tabler/icons-react"
import { useAuth } from "@/contexts/AuthContext"

export default function FloatingDockNavigation() {
  const { admin } = useAuth()
  const isSuperAdmin = admin?.role === 'superadmin'

  const mainLinks = [
    {
      title: "Dashboard",
      icon: (
        <IconHome className="h-full w-full text-foreground/70" />
      ),
      href: "/",
    },
    {
      title: "Add Products",
      icon: (
        <IconPlus className="h-full w-full text-foreground/70" />
      ),
      href: "/add-products",
    },
    {
      title: "All Products",
      icon: (
        <IconList className="h-full w-full text-foreground/70" />
      ),
      href: "/products",
    },
    {
      title: "Enquiries",
      icon: (
        <IconMessage className="h-full w-full text-foreground/70" />
      ),
      href: "/enquiries",
    },
    {
      title: "License/Certification",
      icon: (
        <IconBrandBooking className="h-full w-full text-foreground/70" />
      ),
      href: "/documentation",
    },
  ]

  // Add Create Admin link for superadmin
  if (isSuperAdmin) {
    mainLinks.push({
      title: "Create Admin",
      icon: (
        <IconUserPlus className="h-full w-full text-foreground/70" />
      ),
      href: "/create-admin",
    })
  }

  // Add footer links
  const footerLinks = [
    {
      title: "FAQ",
      icon: (
        <IconFileText className="h-full w-full text-foreground/70" />
      ),
      href: "/faq",
    },
    {
      title: "Other",
      icon: (
        <IconDots className="h-full w-full text-foreground/70" />
      ),
      href: "/other",
    },
    {
      title: "Help & Support",
      icon: (
        <IconHelpCircle className="h-full w-full text-foreground/70" />
      ),
      href: "/help-support",
    },
  ]

  // Desktop: all links including FAQ and Help & Support
  const desktopLinks = [...mainLinks, ...footerLinks]

  // Mobile: only main links (FAQ and Help & Support moved to profile dropdown)
  const mobileLinks = [...mainLinks]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock
        items={desktopLinks}
        mobileItems={mobileLinks}
        desktopClassName="shadow-xl"
      />
    </div>
  )
}


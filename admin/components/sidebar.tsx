"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plus, List, CreditCard, HelpCircle, Mail, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-products", label: "Add Products", icon: Plus },
  { href: "/products", label: "All Products", icon: List },
  { href: "/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/other", label: "Other", icon: List },
]

const footerLinks = [
  { href: "/help-support", label: "Help & Support", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", icon: Mail },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-primary">NexRise</h1>
        <p className="text-sm text-sidebar-foreground/60">Admin Dashboard</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {mainLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Navigation */}
      <nav className="border-t border-sidebar-border p-4 space-y-2">
        {footerLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef, startTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plus, List, HelpCircle, FileText, ChevronLeft, ChevronRight, UserPlus, MessageSquare, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/AuthContext"

// Shared state for sidebar across components
let sidebarState = { open: false, collapsed: false }
let sidebarListeners: Set<(state: { open: boolean; collapsed: boolean }) => void> = new Set()

function setSidebarState(updates: { open?: boolean; collapsed?: boolean }) {
  sidebarState = { ...sidebarState, ...updates }
  // Use startTransition to batch updates and avoid render-time updates
  startTransition(() => {
    sidebarListeners.forEach(listener => listener(sidebarState))
  })
}

function subscribeToSidebarState(listener: (state: { open: boolean; collapsed: boolean }) => void, immediate = false) {
  sidebarListeners.add(listener)
  // Only call immediately if requested (for initial sync, but defer to avoid render-time updates)
  if (immediate) {
    startTransition(() => {
      listener(sidebarState)
    })
  }
  return () => {
    sidebarListeners.delete(listener)
  }
}

// Export hook to get sidebar collapsed state
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => sidebarState.collapsed)

  useEffect(() => {
    const unsubscribe = subscribeToSidebarState((state) => {
      setCollapsed(state.collapsed)
    }, true)
    return unsubscribe
  }, [])

  return collapsed
}

// Mobile Sidebar Trigger Button Component
export function MobileSidebarTrigger() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSidebarState({ open: true })}
      className="text-foreground hover:bg-muted relative w-10 h-10 flex items-center justify-center md:hidden"
      title="Open menu"
    >
      {/* Hamburger menu icon - optimized with CSS for instant render */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >

      </svg>
    </Button>
  )
}

const getMainLinks = (isSuperAdmin: boolean) => {
  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add-products", label: "Add Products", icon: Plus },
    { href: "/products", label: "All Products", icon: List },
    { href: "/enquiries", label: "Enquiries", icon: MessageSquare },
    { href: "/documentation", label: "License/Certification", icon: BookOpen },
    { href: "/other", label: "Other", icon: List },
  ]

  // Add Create Admin link for superadmin
  if (isSuperAdmin) {
    links.push({ href: "/create-admin", label: "Create Admin", icon: UserPlus })
  }

  return links
}

const footerLinks = [
  { href: "/faq", label: "FAQ", icon: FileText },
  { href: "/help-support", label: "Help & Support", icon: HelpCircle },
]



export default function ResponsiveSidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { admin } = useAuth()
  const [open, setOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => sidebarState.collapsed)
  const isInitialMount = useRef(true)
  const isSuperAdmin = admin?.role === 'superadmin'
  const mainLinks = getMainLinks(isSuperAdmin)

  // Sync with shared state (but skip initial mount to avoid circular updates)
  useEffect(() => {
    const unsubscribe = subscribeToSidebarState((state) => {
      // Only update if we're not the source of the change
      if (isInitialMount.current) {
        isInitialMount.current = false
        return
      }
      setOpen(state.open)
      setIsCollapsed(state.collapsed)
    }, false)
    return unsubscribe
  }, [])

  // Update shared state when local state changes (deferred to avoid render-time updates)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    // Use startTransition to batch the update
    startTransition(() => {
      setSidebarState({ open, collapsed: isCollapsed })
    })
  }, [open, isCollapsed])

  // Handle collapse toggle
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  // Close sidebar on pathname change (for navigation)
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [pathname, isMobile])

  // Handler to close sidebar immediately when link is clicked
  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      setOpen(false)
    }
  }, [isMobile])

  const SidebarContent = ({ isMobileMenu }: { isMobileMenu?: boolean }) => (
    <div className={cn("flex flex-col h-full", isMobileMenu && "space-y-2")}>
      {/* Logo Section with mudrika_international branding */}
      {!isMobileMenu && (
        <div className={cn(
          "px-5 py-3 border-b border-sidebar-border flex items-center gap-1 shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "justify-center px-2" : "justify-start"
        )}>

          {/* Text - Hidden when collapsed */}
          <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
          )}>
            <h1 className="text-sm font-bold text-sidebar-primary whitespace-nowrap">NexRise</h1>
            <p className="text-sm text-sidebar-foreground/60 whitespace-nowrap">
              {isSuperAdmin ? "Superadmin" : "Admin Dashboard"}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Menu Header with Logo and mudrika_international */}
      {isMobileMenu && (
        <div className="p-4 border-b border-sidebar-border flex items-center gap-1 shrink-0">
          <h2 className="text-sm font-bold text-sidebar-primary">Admin Dashboard</h2>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn("space-y-2", isMobileMenu ? "px-4 pb-4 pt-0" : "flex-1 px-4 pb-4 pt-0")}>
        {mainLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={isMobileMenu ? handleLinkClick : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                !isMobileMenu && isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed && !isMobileMenu ? link.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={cn(
                "font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                isCollapsed && !isMobileMenu ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Navigation */}
      <nav className={cn("border-t border-sidebar-border space-y-2 shrink-0", isMobileMenu ? "p-4" : "p-4")}>
        {footerLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={isMobileMenu ? handleLinkClick : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
                !isMobileMenu && isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed && !isMobileMenu ? link.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={cn(
                "font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                isCollapsed && !isMobileMenu ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
              )}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            className="w-64 bg-sidebar text-sidebar-foreground border-sidebar-border p-0"
            hideClose={true}
            title="Navigation Menu"
          >
            <div className="absolute top-3 right-3 z-50">
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-md border border-sidebar-border hover:bg-sidebar-accent flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <SidebarContent isMobileMenu={true} />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop sidebar with collapse toggle */}
      {!isMobile && (
        <aside
          className={cn(
            "border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-64",
          )}
          style={{
            transitionProperty: 'width',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-in-out'
          }}
        >
          {/* Toggle Button */}
          <div className="absolute -right-4 top-6 z-50">
            <Button
              size="icon"
              variant="outline"
              onClick={handleToggleCollapse}
              className="bg-card text-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shadow-md transition-all duration-200 hover:scale-110"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronLeft className="w-4 h-4 transition-transform duration-200" />
              )}
            </Button>
          </div>

          <SidebarContent />
        </aside>
      )}
    </>
  )
}

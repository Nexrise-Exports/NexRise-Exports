"use client"

import { useState } from "react"
import { Moon, Sun, LogOut, User, FileText, HelpCircle, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import ResponsiveSidebar, { MobileSidebarTrigger } from "@/components/responsive-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface PageHeaderProps {
  isDark: boolean
  toggleTheme: () => void
  title: string
}

export default function PageHeader({ isDark, toggleTheme, title }: PageHeaderProps) {
  const isMobile = useIsMobile()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const { admin } = useAuth()

  return (
    <>
      <header className="border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <MobileSidebarTrigger />
            {admin?.role === "superadmin" && <h1 className="text-sm sm:text-lg font-bold text-foreground">Superadmin - {title}</h1>}
            {admin?.role === "admin" && <h1 className="text-lg sm:text-2xl font-bold text-foreground">Admin Dashboard - {title}</h1>}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:bg-muted">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-muted"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}

            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    Light/Dark Mode
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/faq" className="flex items-center cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help-support" className="flex items-center cursor-pointer">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/other" className="flex items-center cursor-pointer">
                      <List className="w-4 h-4 mr-2" />
                      Other
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

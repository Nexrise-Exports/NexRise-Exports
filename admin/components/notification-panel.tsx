"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
  type: "info" | "success" | "warning" | "error"
  customerName?: string | null
  propertyName?: string | null
  amount?: number | null
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  onNotificationRead?: () => void
}

export default function NotificationPanel({ isOpen, onClose, onNotificationRead }: NotificationPanelProps) {
  const isMobile = useIsMobile()
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await api.getNotifications(token, false) // Only unread notifications
      if (response.success && response.data) {
        setNotifications(response.data.notifications || [])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [token])

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications()
    }
  }, [isOpen, token, fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return

    try {
      await api.markNotificationAsRead(token, notificationId)
      // Remove notification from list (hide it)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      // Notify parent to update unread count
      if (onNotificationRead) {
        onNotificationRead()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!token) return

    try {
      await api.markAllNotificationsAsRead(token)
      // Clear all notifications from list
      setNotifications([])
      // Notify parent to update unread count
      if (onNotificationRead) {
        onNotificationRead()
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-accent text-accent-foreground"
      case "warning":
        return "bg-primary text-primary-foreground"
      case "error":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Panel - Responsive positioning and sizing for mobile */}
      <div
        className={cn(
          "fixed bg-card border border-border shadow-lg z-50 overflow-hidden",
          // Mobile: smaller dropdown from bell icon, positioned top-right (below header)
          // Desktop: larger dropdown positioned top-right
          // Both have rounded-lg for rounded corners
          isMobile
            ? "top-[60px] right-2 w-[calc(100vw-1rem)] max-w-[320px] max-h-[70vh] rounded-lg"
            : "top-16 right-4 w-96 max-h-[calc(100vh-80px)] rounded-lg"
        )}
      >
        <div className={cn("border-b border-border flex items-center justify-between bg-card sticky top-0 rounded-t-lg", isMobile ? "p-2" : "p-3 sm:p-4")}>
          <h2 className={cn("font-semibold text-foreground flex-1", isMobile ? "text-sm" : "text-base sm:text-lg")}>
            Notifications
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "rounded-md hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0",
              isMobile ? "h-7 w-7" : "h-8 w-8"
            )}
          >
            <X className={cn("text-foreground", isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </button>
        </div>

        <ScrollArea className={cn("overflow-hidden", isMobile ? "max-h-[calc(70vh-80px)]" : "h-96")}>
          <div className="divide-y divide-border">
            {loading ? (
              <div className={cn("text-center text-muted-foreground", isMobile ? "p-4 text-xs" : "p-8 text-sm")}>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className={cn("text-center text-muted-foreground", isMobile ? "p-4 text-xs" : "p-8 text-sm")}>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "hover:bg-muted/50 transition-colors relative group",
                    !notification.isRead ? "bg-muted/30" : "",
                    isMobile ? "p-2 pr-9" : "p-3 sm:p-4 pr-10"
                  )}
                >
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={cn(
                      "absolute rounded-md hover:bg-muted/80 active:bg-muted flex items-center justify-center transition-colors z-10",
                      isMobile 
                        ? "top-1.5 right-1.5 opacity-100 h-3 w-3 bg-muted/50" 
                        : "top-2 right-2 opacity-0 group-hover:opacity-100 h-6 w-6"
                    )}
                    aria-label="Mark as read"
                  >
                    <X className={cn("text-foreground", isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
                  </button>
                  <div className={cn("flex items-start gap-2", isMobile ? "gap-1.5" : "sm:gap-3")}>
                    <Badge
                      className={cn(
                        `${getTypeColor(notification.type)} variant-secondary flex-shrink-0`,
                        isMobile ? "text-[10px] px-1.5 py-0.5" : "text-xs"
                      )}
                    >
                      {notification.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-semibold text-foreground break-words",
                          isMobile ? "text-[11px] leading-tight" : "text-xs sm:text-sm"
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.customerName && (
                        <p className={cn("text-foreground font-medium mt-1", isMobile ? "text-[10px]" : "text-xs")}>
                          User: {notification.customerName}
                        </p>
                      )}
                      {notification.propertyName && (
                        <p className={cn("text-foreground font-medium", isMobile ? "text-[10px]" : "text-xs")}>
                          Property: {notification.propertyName}
                        </p>
                      )}
                      {notification.amount && (
                        <p className={cn("text-foreground font-medium", isMobile ? "text-[10px]" : "text-xs")}>
                          Amount: ₹{notification.amount.toLocaleString("en-IN")}
                        </p>
                      )}
                      <p className={cn("text-muted-foreground mt-1", isMobile ? "text-[9px]" : "text-xs mt-2")}>
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className={cn("border-t border-border flex gap-2 bg-card sticky bottom-0 rounded-b-lg", isMobile ? "p-2" : "p-3 sm:p-4")}>
          <Button
            onClick={handleMarkAllAsRead}
            className={cn(
              "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg",
              isMobile
                ? "text-[10px] h-7 px-2 py-1"
                : "text-xs sm:text-sm h-8 sm:h-10"
            )}
            size={isMobile ? "sm" : "sm"}
          >
            Mark All as Read
          </Button>
        </div>
      </div>
    </div>
  )
}


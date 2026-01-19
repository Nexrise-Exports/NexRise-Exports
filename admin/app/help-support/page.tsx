"use client"

import React, { useState, useEffect } from "react"
import { Mail, Phone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { cn } from "@/lib/utils"
import emailjs from "@emailjs/browser"

function HelpSupportPageContent() {
  const [isDark, setIsDark] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Initialize EmailJS on component mount
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // EmailJS service configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ""
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing. Please check your environment variables.")
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "info@mudrikainternational.com", // Support email
      }

      // Send email via EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Failed to send support request. Please try again later or contact us directly at info@mudrikainternational.com")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Help & Support" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
            <div className="w-full">
              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <Mail className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-2" />
                    <CardTitle className="text-sm sm:text-base text-foreground">Email Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-foreground text-base sm:text-lg font-semibold">contact@nexerve.in</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                      We typically respond within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <Phone className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-2" />
                    <CardTitle className="text-sm sm:text-base text-foreground">Contact Number</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground text-base sm:text-lg font-semibold">+91 6362907673</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-2">Monday to Saturday, 10 AM - 8 PM EST</p>
                  </CardContent>
                </Card>
              </div>

              {/* Support Request Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Submit a Support Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2 bg-input text-foreground border-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2 bg-input text-foreground border-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground text-sm">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What is your issue?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-2 bg-input text-foreground border-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground text-sm">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your issue in detail..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full h-32 p-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Submit Support Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Request Sent Successfully!</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              The request has been sent successfully. The Nexerve Team will contact you in 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <FloatingDockNavigation />
      </div>
  )
}

export default function HelpSupportPage() {
  return (
    <ProtectedRoute>
      <HelpSupportPageContent />
    </ProtectedRoute>
  )
}

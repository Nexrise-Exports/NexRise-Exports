'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function LoginPage() {
  const { theme, setTheme } = useTheme()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = React.useState<{
    email?: string
    password?: string
  }>({})

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, authLoading, router])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Show validation errors
      if (errors.email) {
        toast.error('Validation Error', {
          description: errors.email,
        })
      }
      if (errors.password) {
        toast.error('Validation Error', {
          description: errors.password,
        })
      }
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      // Success toast will be shown after redirect
      // Don't show success toast here as it will be cut off by redirect
    } catch (error: any) {
      // Extract error message from various possible error formats
      let errorMessage = 'Login failed. Please try again.'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      // Check if it's a validation error with multiple messages
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: string) => {
          toast.error('Validation Error', {
            description: err,
          })
        })
      } else if (error?.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: string) => {
          toast.error('Validation Error', {
            description: err,
          })
        })
      } else {
        // Show error toast for unauthorized or other login errors
        toast.error('Login Failed', {
          description: errorMessage,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      {/* Theme Toggle Button - Fixed Position */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "fixed top-4 right-4 sm:top-6 sm:right-6 z-50",
          "h-10 w-10 sm:h-11 sm:w-11",
          "rounded-full",
          "bg-card hover:bg-accent",
          "border border-border",
          "shadow-lg shadow-black/5 dark:shadow-black/20"
        )}
        aria-label="Toggle theme"
      >
        {mounted ? (
          theme === 'dark' ? (
            <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
          )
        ) : (
          <div className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </Button>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div
          className={cn(
            "bg-card rounded-lg shadow-lg shadow-black/5 dark:shadow-black/20",
            "p-6 sm:p-8 lg:p-10",
            "border border-border",
            "backdrop-blur-sm"
          )}
        >
          {/* Logo */}
          {/* <Logo /> */}

          {/* Title */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center text-[#B87333] mb-2">
            Welcome to NexRise
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Admin Login
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className={cn(
                  "w-full h-11 sm:h-12",
                  errors.email && "border-destructive"
                )}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className={cn(
                  "w-full h-11 sm:h-12",
                  errors.password && "border-destructive"
                )}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(
                "w-full h-11 sm:h-12 text-base font-semibold",
                "bg-[#B87333]",
                "text-white border-0",
                "transition-all duration-200",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}


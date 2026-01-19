'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface Admin {
  id: string
  email: string
  role: string
}

interface AuthContextType {
  admin: Admin | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedAdmin = localStorage.getItem('admin')

    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken)
        setAdmin(JSON.parse(storedAdmin))
      } catch (error) {
        console.error('Error parsing stored admin data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      
      if (response.success && response.data) {
        const { token, admin } = response.data
        
        // Store in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('admin', JSON.stringify(admin))
        
        setToken(token)
        setAdmin(admin)

        // Redirect to dashboard (root page) if admin or superadmin role
        if (admin.role === 'admin' || admin.role === 'superadmin') {
          router.push('/')
        } else {
          // Clear stored data if role is not admin or superadmin
          localStorage.removeItem('token')
          localStorage.removeItem('admin')
          setToken(null)
          setAdmin(null)
          throw new Error('You are not authorized to access this website.')
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      // Re-throw the error with the proper message
      // The error message from the API should already be in error.message
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint if token exists
      if (token) {
        try {
          await api.logout(token)
        } catch (error) {
          // Even if backend logout fails, continue with client-side logout
          console.error('Backend logout error:', error)
        }
      }
      
      // Clear client-side storage and state
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      setToken(null)
      setAdmin(null)
      
      // Redirect to login page
      router.push('/login-form')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local storage and redirect even if there's an error
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      setToken(null)
      setAdmin(null)
      router.push('/login-form')
    }
  }

  const isAuthenticated = !!token && !!admin

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


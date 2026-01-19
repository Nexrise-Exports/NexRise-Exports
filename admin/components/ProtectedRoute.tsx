'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, admin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login-form')
      } else if (admin?.role !== 'admin' && admin?.role !== 'superadmin') {
        router.push('/login-form')
      }
    }
  }, [isAuthenticated, isLoading, admin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || (admin?.role !== 'admin' && admin?.role !== 'superadmin')) {
    return null
  }

  return <>{children}</>
}


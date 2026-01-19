"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, UserPlus, Loader2, Users, Trash2 } from "lucide-react"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Admin {
  _id: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

function CreateAdminPageContent() {
  const { token, admin } = useAuth()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Check if user is superadmin
  if (admin?.role !== 'superadmin') {
    router.push('/')
    return null
  }

  const fetchAdmins = async () => {
    if (!token) return
    
    try {
      setLoadingAdmins(true)
      const response = await api.getAllAdmins(token)
      if (response.success && response.data) {
        setAdmins(response.data.admins || [])
      }
    } catch (error: any) {
      console.error("Error fetching admins:", error)
      toast.error("Failed to load admins", {
        description: error.message || "Please try again later",
      })
    } finally {
      setLoadingAdmins(false)
    }
  }

  // Fetch all admins
  useEffect(() => {
    if (token) {
      fetchAdmins()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else {
      // Check for password strength
      if (!/[a-z]/.test(password)) {
        newErrors.password = "Password must contain at least one lowercase letter"
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain at least one uppercase letter"
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Password must contain at least one number"
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        newErrors.password = "Password must contain at least one special character"
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    if (!token) {
      setSubmitError("Authentication required. Please login again.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.createAdmin(token, {
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (response.success) {
        // Reset form
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setErrors({})
        // Refresh admins list
        await fetchAdmins()
        // Show success dialog
        setShowSuccessDialog(true)
        toast.success("Admin created successfully", {
          description: "The new admin can now login with their credentials.",
        })
      }
    } catch (error: any) {
      console.error("Error creating admin:", error)
      
      // Handle validation errors from backend
      if (error.data) {
        const errorData = error.data
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          setSubmitError(errorData.errors.join(", "))
        } else {
          setSubmitError(errorData?.message || error.message || "Failed to create admin. Please try again.")
        }
      } else {
        setSubmitError(error.message || "Failed to create admin. Please try again.")
      }
      toast.error("Failed to create admin", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDeleteClick = (id: string) => {
    setAdminToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!token || !adminToDelete) return

    setDeleteLoading(true)
    try {
      await api.deleteAdmin(token, adminToDelete)
      // Remove from local state
      setAdmins(admins.filter((admin) => admin._id !== adminToDelete))
      setIsDeleteDialogOpen(false)
      setAdminToDelete(null)
      
      toast.success("Admin deleted successfully", {
        description: "The admin account has been removed from the system.",
      })
    } catch (error: any) {
      console.error("Error deleting admin:", error)
      toast.error("Failed to delete admin", {
        description: error.message || "Please try again later",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Create Admin" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition w-full pb-24">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Create Admin Form */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create New Admin Account
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fill in the details below to create a new admin account. The new admin will be able to login and access the dashboard.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-foreground text-sm font-medium mb-1.5 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) {
                            setErrors({ ...errors, email: undefined })
                          }
                        }}
                        className={cn(
                          "w-full bg-input text-foreground border-border rounded-md h-10 sm:h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-primary/50",
                          errors.email && "border-destructive"
                        )}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-foreground text-sm font-medium mb-1.5 block">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errors.password) {
                            setErrors({ ...errors, password: undefined })
                          }
                        }}
                        className={cn(
                          "w-full bg-input text-foreground border-border rounded-md h-10 sm:h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-primary/50",
                          errors.password && "border-destructive"
                        )}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <p className="text-xs text-destructive mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-foreground text-sm font-medium mb-1.5 block">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: undefined })
                          }
                        }}
                        className={cn(
                          "w-full bg-input text-foreground border-border rounded-md h-10 sm:h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-primary/50",
                          errors.confirmPassword && "border-destructive"
                        )}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                        <p className="text-destructive text-sm">{submitError}</p>
                      </div>
                    )}

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Admin...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Admin
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* All Admins List */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    All Admins ({admins.length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    List of all admin accounts in the system.
                  </p>
                </CardHeader>
                <CardContent>
                  {loadingAdmins ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading admins...
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No admins found. Create your first admin above.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-foreground font-semibold">Email</TableHead>
                            <TableHead className="text-foreground font-semibold">Role</TableHead>
                            <TableHead className="text-foreground font-semibold">Created At</TableHead>
                            <TableHead className="text-foreground font-semibold">Last Updated</TableHead>
                            <TableHead className="text-foreground font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {admins.map((adminItem) => (
                            <TableRow key={adminItem._id} className="border-border hover:bg-muted/50">
                              <TableCell className="text-foreground font-medium">
                                {adminItem.email}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={adminItem.role === 'superadmin' ? 'default' : 'secondary'}
                                  
                                  className={
                                    adminItem.role === 'superadmin'
                                      ? 'bg-purple-600 hover:bg-purple-700 text-white '
                                      : 'bg-blue-600 hover:bg-blue-700 text-white '
                                  }
                                >
                                  {adminItem.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-foreground text-sm">
                                {formatDate(adminItem.createdAt)}
                              </TableCell>
                              <TableCell className="text-foreground text-sm">
                                {formatDate(adminItem.updatedAt)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  disabled={adminItem.role === 'superadmin'}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteClick(adminItem._id)}
                                  title="Delete Admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-foreground">
              Admin Created Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-foreground text-base">
              The new admin account has been created. They can now login with their email and password.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin account from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading} onClick={() => setAdminToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FloatingDockNavigation />
      </div>
  )
}

export default function CreateAdminPage() {
  return (
    <ProtectedRoute>
      <CreateAdminPageContent />
    </ProtectedRoute>
  )
}


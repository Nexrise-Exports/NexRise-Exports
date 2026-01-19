"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, Search, Plus, Loader2, Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { uploadToCloudinaryWithFolder } from "@/lib/cloudinary"

interface Documentation {
  _id: string
  title: string
  image: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

function DocumentationPageContent() {
  const { token } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formTitle, setFormTitle] = useState("")

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Fetch documentation
  const fetchDocumentation = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const response = await api.getAllDocumentation(token)
      if (response.success && response.data) {
        setDocumentation(response.data.documentation || [])
      }
    } catch (error: any) {
      console.error("Error fetching documentation:", error)
      toast.error("Failed to load documentation", {
        description: error.message || "Please try again later",
      })
      setDocumentation([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchDocumentation()
  }, [fetchDocumentation])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    const input = document.getElementById("doc-image") as HTMLInputElement
    if (input) input.value = ""
  }

  // Handle add documentation
  const handleAddDocumentation = async () => {
    if (!token) return

    if (!formTitle.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (!imageFile) {
      toast.error("Please upload an image")
      return
    }

    setIsSubmitting(true)
    try {
      // Upload image to Cloudinary with documentation folder
      const uploadResult = await uploadToCloudinaryWithFolder(imageFile, "mudrika_international/documentation")
      
      // Extract the secure_url from the response
      const imageUrl = uploadResult.secure_url
      
      // Create documentation
      await api.createDocumentation(token, {
        title: formTitle.trim(),
        image: imageUrl,
        status: "active",
      })

      toast.success("Documentation added successfully")
      setIsAddDialogOpen(false)
      setFormTitle("")
      setImageFile(null)
      setImagePreview("")
      await fetchDocumentation()
    } catch (error: any) {
      console.error("Error adding documentation:", error)
      toast.error("Failed to add documentation", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDeleteClick = (docId: string) => {
    setDocToDelete(docId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!token || !docToDelete) return

    setDeleteLoading(true)
    try {
      await api.deleteDocumentation(token, docToDelete)
      toast.success("License/Certification deleted successfully")
      await fetchDocumentation()
      setIsDeleteDialogOpen(false)
      setDocToDelete(null)
    } catch (error: any) {
      console.error("Error deleting documentation:", error)
      toast.error("Failed to delete documentation", {
        description: error.message || "Please try again later",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter documentation
  const filteredDocs = documentation.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="License/Certification" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search License/Certification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add License/Certification
              </Button>
            </div>

            {/* Documentation Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No License/Certification found" : "No License/Certification yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <Card key={doc._id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted h-64">
                      <Image
                        src={doc.image}
                        alt={doc.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(doc._id)}
                        >
                          Delete
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>

      {/* Add Documentation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add License/Certification</DialogTitle>
            <DialogDescription>
              Upload an image and provide a title for the documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Title</Label>
              <Input
                id="doc-title"
                placeholder="Enter documentation title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-image">Image</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <Label htmlFor="doc-image" className="cursor-pointer">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </Label>
                  <Input
                    id="doc-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setFormTitle("")
                  setImageFile(null)
                  setImagePreview("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddDocumentation}
                disabled={isSubmitting || !formTitle.trim() || !imageFile}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add License/Certification"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License/Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this License/Certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground"
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

export default function DocumentationPage() {
  return (
    <ProtectedRoute>
      <DocumentationPageContent />
    </ProtectedRoute>
  )
}


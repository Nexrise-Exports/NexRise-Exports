"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X as LucideX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, X, Image as ImageIcon, Loader2, Sparkles } from "lucide-react"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"

function AddProductPageContent() {
  const { token } = useAuth()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)

  // Form state
  const [productTitle, setProductTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [origin, setOrigin] = useState("")
  const [biologicalBackground, setBiologicalBackground] = useState("")
  const [usage, setUsage] = useState("")
  const [keyCharacteristics, setKeyCharacteristics] = useState("")

  // Category & Subcategory logic
  const [subcategory, setSubcategory] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [isLoadingCats, setIsLoadingCats] = useState(true)

  // Image state - allow 3 images
  const [displayImages, setDisplayImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await api.getAllCategories()
        if (response.success) {
          setCategories(response.data || [])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoadingCats(false)
      }
    }
    fetchCats()
  }, [])

  // Handle image upload (max 3 images)
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const remainingSlots = 3 - displayImages.length

    if (remainingSlots <= 0) {
      toast.error("Maximum 3 images allowed")
      return
    }

    const filesToAdd = fileArray.slice(0, remainingSlots)
    const newImages = [...displayImages, ...filesToAdd]

    if (newImages.length > 3) {
      toast.error("Maximum 3 images allowed")
      return
    }

    setDisplayImages(newImages)

    // Create previews
    const previewPromises = filesToAdd.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(previewPromises).then((newPreviews) => {
      setImagePreviews([...imagePreviews, ...newPreviews])
    })
  }

  const removeImage = (index: number) => {
    setDisplayImages(displayImages.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    // Reset file input
    const input = document.getElementById("display-images") as HTMLInputElement
    if (input) input.value = ""
  }

  // Generate product details using Gemini
  const handleGenerate = async () => {
    if (!productTitle.trim()) {
      toast.error("Please enter a product title first")
      return
    }

    if (!token) {
      toast.error("Authentication required. Please login again.")
      return
    }

    setIsGenerating(true)
    setSubmitError(null)

    try {
      const response = await api.generateProductDetails(token, productTitle.trim())

      if (response.success && response.data) {
        const data = response.data
        setDescription(data.description || "")
        setOrigin(data.origin || "")
        setBiologicalBackground(data.biologicalBackground || "")
        setUsage(data.usage || "")
        setKeyCharacteristics(data.keyCharacteristics || "")
        toast.success("Product details generated successfully!")
      }
    } catch (error: any) {
      console.error("Error generating product details:", error)
      toast.error(error.message || "Failed to generate product details")
      setSubmitError(error.message || "Failed to generate product details")
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Validation
    if (!productTitle.trim()) {
      setSubmitError("Product title is required")
      return
    }

    if (!category) {
      setSubmitError("Category is required")
      return
    }

    if (displayImages.length === 0) {
      setSubmitError("At least one display image is required")
      return
    }

    if (!description.trim()) {
      setSubmitError("Description is required")
      return
    }

    if (!origin.trim()) {
      setSubmitError("Origin is required")
      return
    }

    if (!biologicalBackground.trim()) {
      setSubmitError("Biological background is required")
      return
    }

    if (!usage.trim()) {
      setSubmitError("Usage is required")
      return
    }

    if (!keyCharacteristics.trim()) {
      setSubmitError("Key characteristics is required")
      return
    }

    if (!token) {
      setSubmitError("Authentication required. Please login again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images to Cloudinary
      const imageUrls: string[] = []

      for (const image of displayImages) {
        try {
          const result = await uploadToCloudinary(image)
          imageUrls.push(result.secure_url)
        } catch (error: any) {
          throw new Error(`Failed to upload image: ${error.message}`)
        }
      }

      // Prepare product data
      const productData = {
        propertyTitle: productTitle.trim(),
        category: category,
        subcategory: (category.toLowerCase() === "spice" || category.toLowerCase() === "spices") ? (subcategory || null) : null,
        description: description.trim(),
        origin: origin.trim(),
        biologicalBackground: biologicalBackground.trim(),
        usage: usage.trim(),
        keyCharacteristics: keyCharacteristics.trim(),
        displayPhoto: imageUrls[0] || null,
        additionalPhotos: imageUrls.slice(1) || [],
        status: "active",
      }

      // Create product via API
      const response = await api.createProduct(token, productData)

      if (!response.success) {
        throw new Error(response.message || "Failed to create product")
      }

      toast.success("Product created successfully!")

      // Reset form
      setProductTitle("")
      setCategory("")
      setDescription("")
      setOrigin("")
      setBiologicalBackground("")
      setUsage("")
      setKeyCharacteristics("")
      setSubcategory("")
      setDisplayImages([])
      setImagePreviews([])

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error: any) {
      console.error("Error creating product:", error)
      setSubmitError(error.message || "Failed to create product. Please try again.")
      toast.error(error.message || "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Add New Product" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition w-full pb-24">
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* Display Images Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Display Images <span className="text-destructive">*</span></CardTitle>
                <p className="text-sm text-muted-foreground">Upload up to 3 images</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  id="display-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  disabled={displayImages.length >= 3}
                />
                {imagePreviews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                          <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-border">
                            <img
                              src={preview}
                              alt={`Display image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {displayImages[index]?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                    {displayImages.length < 3 && (
                      <label
                        htmlFor="display-images"
                        className="inline-block text-sm text-primary hover:text-primary/80 cursor-pointer underline"
                      >
                        Add more images ({displayImages.length}/3)
                      </label>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="display-images"
                    className="mt-2 border-2 border-dashed border-destructive/50 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-2 min-h-[200px]"
                  >
                    <ImageIcon className="w-12 h-12 text-destructive/70" />
                    <p className="text-foreground font-medium">Display Images Required</p>
                    <p className="text-muted-foreground">Click to upload up to 3 images</p>
                    <p className="text-xs text-muted-foreground">Recommended: Square images, max 5MB each</p>
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Product Details Section */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-lg font-semibold">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Title with Generate Button */}
                <div className="space-y-2">
                  <Label htmlFor="product-title" className="text-foreground text-sm font-medium">
                    Product Title <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="product-title"
                      placeholder="Enter product title"
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      className="flex-1 bg-input text-foreground border-border rounded-md h-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                    {productTitle.trim() && (
                      <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {productTitle.trim() && (
                    <p className="text-xs text-muted-foreground">
                      Click Generate to auto-fill product details using AI
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-foreground text-sm font-medium mb-1.5 block">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={(val) => {
                    setCategory(val);
                    setSubcategory("");
                  }}>
                    <SelectTrigger className="w-full bg-input text-foreground border-border rounded-md h-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <SelectValue placeholder={isLoadingCats ? "Loading categories..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory for Spice */}
                {(category.toLowerCase() === "spice" || category.toLowerCase() === "spices") && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="subcategory" className="text-foreground text-sm font-medium mb-1.5 block">
                      Subcategory <span className="text-destructive">*</span>
                    </Label>
                    <Select value={subcategory} onValueChange={setSubcategory}>
                      <SelectTrigger className="w-full bg-input text-foreground border-border rounded-md h-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whole">Whole</SelectItem>
                        <SelectItem value="powder">Powder</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        {/* Optionally show custom subcategories if any were added via Category modal */}
                        {categories.find(c => c.name.toLowerCase() === "spice" || c.name.toLowerCase() === "spices")?.subcategories?.filter((s: string) => !["whole", "powder", "both"].includes(s.toLowerCase())).map((sub: string) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-foreground text-sm font-medium mb-1.5 block">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                {/* Origin */}
                <div>
                  <Label htmlFor="origin" className="text-foreground text-sm font-medium mb-1.5 block">
                    Origin <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="origin"
                    placeholder="Enter product origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-input text-foreground border-border rounded-md h-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Biological Background */}
                <div>
                  <Label htmlFor="biological-background" className="text-foreground text-sm font-medium mb-1.5 block">
                    Biological Background <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="biological-background"
                    placeholder="Enter biological background..."
                    value={biologicalBackground}
                    onChange={(e) => setBiologicalBackground(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                {/* Usage */}
                <div>
                  <Label htmlFor="usage" className="text-foreground text-sm font-medium mb-1.5 block">
                    Usage <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="usage"
                    placeholder="Enter product usage..."
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                {/* Key Characteristics */}
                <div>
                  <Label htmlFor="key-characteristics" className="text-foreground text-sm font-medium mb-1.5 block">
                    Key Characteristics <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="key-characteristics"
                    placeholder="Enter key characteristics..."
                    value={keyCharacteristics}
                    onChange={(e) => setKeyCharacteristics(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {submitError && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">{submitError}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="border-border text-foreground bg-transparent w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </main>
      </div>
      <FloatingDockNavigation />

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
              Success!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-foreground text-base">
              Product created successfully!
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/")
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProductPageContent />
    </ProtectedRoute>
  )
}

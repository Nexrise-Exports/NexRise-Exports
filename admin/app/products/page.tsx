"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2, Search, Eye, Loader2, Image as ImageIcon, Pencil, X as LucideX } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Product {
  _id: string
  propertyTitle: string
  category: string
  subcategory?: string
  description: string
  origin: string
  biologicalBackground: string
  usage: string
  keyCharacteristics: string
  displayPhoto: string
  additionalPhotos: string[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

function ProductsPageContent() {
  const { token } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Edit logic state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editFormState, setEditFormState] = useState<Partial<Product>>({})
  const [saveLoading, setSaveLoading] = useState(false)

  // Category state
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategories, setNewSubcategories] = useState<string[]>([])
  const [subcatInput, setSubcatInput] = useState("")
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [isCatDeleteDialogOpen, setIsCatDeleteDialogOpen] = useState(false)
  const [catToDelete, setCatToDelete] = useState<Category | null>(null)
  const [catDeleteLoading, setCatDeleteLoading] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const params: any = {
        limit: 100,
      }
      if (filterCategory !== "all") {
        params.category = filterCategory
      }
      if (filterStatus !== "all") {
        params.status = filterStatus
      }

      const response = await api.getAllProducts(token, params)
      if (response.success && response.data) {
        setProducts(response.data.products || [])
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products", {
        description: error.message || "Please try again later",
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [token, filterCategory, filterStatus])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getAllCategories()
      if (response.success && response.data) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  const handleCatDeleteConfirm = async () => {
    if (!token || !catToDelete) return

    setCatDeleteLoading(true)
    try {
      await api.deleteCategory(token, catToDelete._id)
      toast.success(`Category "${catToDelete.name}" deleted successfully`)
      fetchCategories()
      setIsCatDeleteDialogOpen(false)
      setCatToDelete(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
    } finally {
      setCatDeleteLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  // Handle delete
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!token || !productToDelete) return

    setDeleteLoading(true)
    try {
      await api.deleteProduct(token, productToDelete)
      toast.success("Product deleted successfully")
      // Refresh products list
      await fetchProducts()
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product", {
        description: error.message || "Please try again later",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Handle view product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setSelectedImageIndex(0)
    setIsViewModalOpen(true)
  }

  // Handle edit product
  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setEditFormState({
      propertyTitle: product.propertyTitle,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      origin: product.origin,
      biologicalBackground: product.biologicalBackground,
      usage: product.usage,
      keyCharacteristics: product.keyCharacteristics,
    })
    setIsEditModalOpen(true)
  }

  const handleEditSave = async () => {
    if (!token || !editingProduct) return

    setSaveLoading(true)
    try {
      const finalFormState = {
        ...editFormState,
        subcategory: (editFormState.category?.toLowerCase() === "spice" || editFormState.category?.toLowerCase() === "spices")
          ? (editFormState.subcategory || null)
          : null
      }
      await api.updateProduct(token, editingProduct._id, finalFormState)
      toast.success("Product updated successfully")
      // Refresh products list
      await fetchProducts()
      setIsEditModalOpen(false)
      setEditingProduct(null)
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product", {
        description: error.message || "Please try again later",
      })
    } finally {
      setSaveLoading(false)
    }
  }

  // Handle status toggle
  const handleStatusToggle = async (productId: string, currentStatus: string) => {
    if (!token) return

    const newStatus = currentStatus === "active" ? "inactive" : "active"
    setUpdatingStatus(productId)

    try {
      await api.updateProduct(token, productId, { status: newStatus })
      toast.success(`Product status changed to ${newStatus}`)
      // Refresh products list
      await fetchProducts()
      // Update selected product if it's the one being toggled
      if (selectedProduct && selectedProduct._id === productId) {
        setSelectedProduct({ ...selectedProduct, status: newStatus as "active" | "inactive" })
      }
    } catch (error: any) {
      console.error("Error updating product status:", error)
      toast.error("Failed to update product status", {
        description: error.message || "Please try again later",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Filter products by search term
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm || (
      product.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const matchesCategory = filterCategory === "all" || product.category.toLowerCase() === filterCategory.toLowerCase()
    const matchesStatus = filterStatus === "all" || product.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-gray-500"
  }

  const getCategoryColor = (category: string) => {
    return category === "powder" ? "bg-blue-500" : "bg-purple-500"
  }

  const allImages = (product: Product) => {
    const images = [product.displayPhoto, ...product.additionalPhotos].filter(Boolean)
    return images
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="All Products" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
          {/* Search and Filter Section */}
          <Card className="mb-6 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by product title, description, origin..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input text-foreground border-border"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-input text-foreground border-border">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-input text-foreground border-border">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="bg-accent text-white"
                >
                  Create Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const images = allImages(product)
                return (
                  <Card
                    key={product._id}
                    className="bg-card border-border hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                          {product.propertyTitle}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10"
                            onClick={() => handleEditClick(product)}
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(product._id)}
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500 text-white">
                            {product.category}
                          </Badge>
                          {product.subcategory && (
                            <Badge className="bg-indigo-500 text-white">
                              {product.subcategory}
                            </Badge>
                          )}
                          <Badge className={cn(getStatusColor(product.status), "text-white")}>
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Status:</span>
                          <Switch
                            checked={product.status === "active"}
                            onCheckedChange={() => handleStatusToggle(product._id, product.status)}
                            disabled={updatingStatus === product._id}
                          />
                          {updatingStatus === product._id && (
                            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden border border-border">
                        <img
                          src={product.displayPhoto}
                          alt={product.propertyTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {product.description}
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p className="truncate"><span className="font-medium text-foreground">Origin:</span> {product.origin}</p>
                        {images.length > 1 && (
                          <p><span className="font-medium text-foreground">Number of Images:</span> {images.length}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => handleViewProduct(product)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* View Product Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedProduct?.propertyTitle}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Product Details
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              {/* Images */}
              {allImages(selectedProduct).length > 0 && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border">
                    <img
                      src={allImages(selectedProduct)[selectedImageIndex]}
                      alt={selectedProduct.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {allImages(selectedProduct).length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {allImages(selectedProduct).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                            selectedImageIndex === index
                              ? "border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <img
                            src={img}
                            alt={`${selectedProduct.propertyTitle} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-foreground font-medium capitalize">
                    {selectedProduct.category}
                    {selectedProduct.subcategory && <span className="text-muted-foreground ml-1">({selectedProduct.subcategory})</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Status</Label>
                  <div className="flex items-center gap-3">
                    <Badge className={cn(getStatusColor(selectedProduct.status), "text-white")}>
                      {selectedProduct.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={selectedProduct.status === "active"}
                        onCheckedChange={() => handleStatusToggle(selectedProduct._id, selectedProduct.status)}
                        disabled={updatingStatus === selectedProduct._id}
                      />
                      {updatingStatus === selectedProduct._id && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Origin</Label>
                  <p className="text-foreground">{selectedProduct.origin}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-foreground">{selectedProduct.description}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Biological Background</Label>
                  <p className="text-foreground">{selectedProduct.biologicalBackground}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Usage</Label>
                  <p className="text-foreground">{selectedProduct.usage}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Key Characteristics</Label>
                  <p className="text-foreground">{selectedProduct.keyCharacteristics}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading} onClick={() => setProductToDelete(null)}>
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

      {/* Create Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Create New Category
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new category or manage existing ones. Only "Spice" will have subcategories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* List Existing Categories */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Existing Categories</Label>
              <div className="max-h-[200px] overflow-y-auto border border-border rounded-md p-2 space-y-1 bg-muted/20">
                {categories.length > 0 ? categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md group transition-colors">
                    <span className="text-sm font-medium">{cat.name}</span>
                    {(cat.name.toLowerCase() !== "spice" && cat.name.toLowerCase() !== "spices") ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setCatToDelete(cat);
                          setIsCatDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-50">System</Badge>
                    )}
                  </div>
                )) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No categories found</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Label htmlFor="category-name" className="text-sm font-semibold">Create New Category</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Spice, Herbs, Seeds"
                className="mt-2"
              />
            </div>

            {(newCategoryName.toLowerCase() === "spice" || newCategoryName.toLowerCase() === "spices") && (
              <div className="space-y-4 pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between">
                  <Label>Subcategories</Label>
                  <span className="text-[10px] text-muted-foreground">Press Enter to add</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-muted/30 rounded-md border border-dashed border-border">
                  {newSubcategories.length > 0 ? newSubcategories.map((sub, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                      {sub}
                      <LucideX
                        className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                        onClick={() => setNewSubcategories(newSubcategories.filter((_, i) => i !== idx))}
                      />
                    </Badge>
                  )) : (
                    <span className="text-xs text-muted-foreground opacity-50 italic">No subcategories added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={subcatInput}
                    onChange={(e) => setSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && subcatInput.trim()) {
                        e.preventDefault();
                        if (!newSubcategories.includes(subcatInput.trim())) {
                          setNewSubcategories([...newSubcategories, subcatInput.trim()]);
                        }
                        setSubcatInput("");
                      }
                    }}
                    placeholder="Add Whole, Powder, Both..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (subcatInput.trim()) {
                        if (!newSubcategories.includes(subcatInput.trim())) {
                          setNewSubcategories([...newSubcategories, subcatInput.trim()]);
                        }
                        setSubcatInput("");
                      }
                    }}
                  >
                    <Search className="w-4 h-4 rotate-45" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
              <Button variant="outline" onClick={() => {
                setIsCategoryModalOpen(false);
                setNewCategoryName("");
                setNewSubcategories([]);
              }}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!newCategoryName.trim()) {
                    toast.error("Category name is required");
                    return;
                  }
                  setCategoryLoading(true);
                  try {
                    await api.createCategory(token!, {
                      name: newCategoryName.trim(),
                      subcategories: (newCategoryName.toLowerCase() === "spice" || newCategoryName.toLowerCase() === "spices") ? newSubcategories : [],
                    });
                    toast.success("Category created successfully");
                    setNewCategoryName("");
                    setNewSubcategories([]);
                    setIsCategoryModalOpen(false);
                    fetchCategories();
                  } catch (error: any) {
                    toast.error(error.message || "Failed to create category");
                  } finally {
                    setCategoryLoading(false);
                  }
                }}
                disabled={categoryLoading}
                className="bg-primary text-primary-foreground min-w-[120px]"
              >
                {categoryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Category"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Delete Confirmation */}
      <AlertDialog open={isCatDeleteDialogOpen} onOpenChange={setIsCatDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category <span className="font-bold text-foreground">"{catToDelete?.name}"</span>?
              This action cannot be undone and may affect products in this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={catDeleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCatDeleteConfirm}
              disabled={catDeleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {catDeleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Modify product details. Images cannot be edited here.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Product Title</Label>
                <Input
                  id="edit-title"
                  value={editFormState.propertyTitle || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, propertyTitle: e.target.value })}
                  placeholder="Enter product title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editFormState.category}
                  onValueChange={(value) => setEditFormState({ ...editFormState, category: value, subcategory: "" })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
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

              {(editFormState.category?.toLowerCase() === "spice" || editFormState.category?.toLowerCase() === "spices") && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="edit-subcategory">Subcategory</Label>
                  <Select
                    value={editFormState.subcategory}
                    onValueChange={(value) => setEditFormState({ ...editFormState, subcategory: value })}
                  >
                    <SelectTrigger id="edit-subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whole">Whole</SelectItem>
                      <SelectItem value="powder">Powder</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-origin">Origin</Label>
                <Input
                  id="edit-origin"
                  value={editFormState.origin || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, origin: e.target.value })}
                  placeholder="Enter origin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormState.description || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-biological">Biological Background</Label>
                <Textarea
                  id="edit-biological"
                  value={editFormState.biologicalBackground || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, biologicalBackground: e.target.value })}
                  placeholder="Enter biological background"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-usage">Usage</Label>
                <Textarea
                  id="edit-usage"
                  value={editFormState.usage || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, usage: e.target.value })}
                  placeholder="Enter usage"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-characteristics">Key Characteristics</Label>
                <Textarea
                  id="edit-characteristics"
                  value={editFormState.keyCharacteristics || ""}
                  onChange={(e) => setEditFormState({ ...editFormState, keyCharacteristics: e.target.value })}
                  placeholder="Enter key characteristics"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave} disabled={saveLoading}>
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <FloatingDockNavigation />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageContent />
    </ProtectedRoute>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { MessageSquare, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface Enquiry {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  type: "general" | "product" | "supplier" | "buyer"
  productId?: {
    _id: string
    propertyTitle: string
    displayPhoto?: string
    category?: string
  } | null
  productName?: string | null
  // Supplier and buyer fields
  company?: string
  companyWebsite?: string
  certifications?: string
  categories?: string[]
  yearsInBusiness?: string
  anticipatedVolume?: string
  distributionModel?: string[]
  productsOfInterest?: string[]
  status: "pending" | "read" | "replied" | "closed"
  createdAt: string
  updatedAt: string
}

function EnquiriesPageContent() {
  const { token } = useAuth()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Fetch enquiries
  const fetchEnquiries = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== "all") {
        params.status = statusFilter
      }
      if (typeFilter !== "all") {
        params.type = typeFilter
      }

      const response = await api.getAllEnquiries(token, params)
      if (response.success && response.data) {
        setEnquiries(response.data.enquiries || [])
      }
    } catch (error: any) {
      console.error("Error fetching enquiries:", error)
      toast.error("Failed to load enquiries", {
        description: error.message || "Please try again later",
      })
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter, typeFilter])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const handleViewEnquiry = async (enquiryId: string) => {
    if (!token) return

    try {
      const response = await api.getEnquiryById(token, enquiryId)
      if (response.success && response.data) {
        setSelectedEnquiry(response.data.enquiry)
        setShowReplyDialog(true)
      }
    } catch (error: any) {
      console.error("Error fetching enquiry:", error)
      toast.error("Failed to load enquiry", {
        description: error.message || "Please try again later",
      })
    }
  }

  const handleUpdateStatus = async (enquiryId: string, status: string) => {
    if (!token) return

    try {
      await api.updateEnquiry(token, enquiryId, { status })
      toast.success("Enquiry status updated")
      await fetchEnquiries()
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: status as any })
      }
    } catch (error: any) {
      console.error("Error updating enquiry:", error)
      toast.error("Failed to update status", {
        description: error.message || "Please try again later",
      })
    }
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        enquiry.name.toLowerCase().includes(searchLower) ||
        enquiry.email.toLowerCase().includes(searchLower) ||
        (enquiry.productName && enquiry.productName.toLowerCase().includes(searchLower)) ||
        enquiry.message.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "read":
        return "bg-blue-500"
      case "replied":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-purple-500"
      case "supplier":
        return "bg-orange-500"
      case "buyer":
        return "bg-green-500"
      case "general":
      default:
        return "bg-blue-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Product"
      case "supplier":
        return "Supplier"
      case "buyer":
        return "Buyer"
      case "general":
      default:
        return "General"
    }
  }

  return (
    <ProtectedRoute>
      <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
        <div className="flex flex-col">
          <PageHeader
            isDark={isDark}
            toggleTheme={toggleTheme}
            title="Enquiries"
          />

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
                        placeholder="Search by name, email, product, or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input text-foreground border-border"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-input text-foreground border-border">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-input text-foreground border-border">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Enquiries List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No enquiries found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enquiry) => {
                  const isPending = enquiry.status === "pending"

                  return (
                    <Card
                      key={enquiry._id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-shadow bg-card border-border",
                        isPending && "border-l-4 border-l-primary"
                      )}
                      onClick={() => handleViewEnquiry(enquiry._id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg truncate text-foreground">
                                {enquiry.type === "product" && enquiry.productName
                                  ? enquiry.productName
                                  : enquiry.type === "supplier" && enquiry.company
                                    ? enquiry.company
                                    : enquiry.type === "buyer" && enquiry.company
                                      ? enquiry.company
                                      : "General Enquiry"}
                              </h3>
                              <Badge className={cn(getTypeColor(enquiry.type), "text-white text-xs")}>
                                {getTypeLabel(enquiry.type)}
                              </Badge>
                              {enquiry.status === "pending" && (
                                <Badge variant="destructive" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium text-foreground">{enquiry.name}</span> (
                              {enquiry.email})
                            </p>
                            {enquiry.phone && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Phone: {enquiry.phone}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground truncate">
                              {enquiry.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(enquiry.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={cn(getStatusColor(enquiry.status), "text-white")}>
                              {enquiry.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </main>
        </div>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Enquiry Details</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selectedEnquiry?.type === "product" && selectedEnquiry?.productName
                  ? selectedEnquiry.productName
                  : selectedEnquiry?.type === "supplier" && selectedEnquiry?.company
                    ? selectedEnquiry.company
                    : selectedEnquiry?.type === "buyer" && selectedEnquiry?.company
                      ? selectedEnquiry.company
                      : "General Enquiry"} - {selectedEnquiry?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedEnquiry && (
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                {/* User Info */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-sm text-foreground">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <span className="font-medium">Name:</span> {selectedEnquiry.name}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Email:</span> {selectedEnquiry.email}
                    </p>
                    {selectedEnquiry.phone && (
                      <p className="text-foreground">
                        <span className="font-medium">Phone:</span> {selectedEnquiry.phone}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium">Type:</span>
                      <Badge className={cn(getTypeColor(selectedEnquiry.type), "text-white")}>
                        {getTypeLabel(selectedEnquiry.type)} Enquiry
                      </Badge>
                    </div>
                    {selectedEnquiry.type === "product" && selectedEnquiry.productName && (
                      <div className="mt-2">
                        <span className="font-medium">Product:</span> {selectedEnquiry.productName}
                      </div>
                    )}
                    {selectedEnquiry.productId && (
                      <div className="mt-2">
                        {selectedEnquiry.productId.displayPhoto && (
                          <img
                            src={selectedEnquiry.productId.displayPhoto}
                            alt={selectedEnquiry.productId.propertyTitle}
                            className="w-32 h-32 object-cover rounded-lg mt-2"
                          />
                        )}
                      </div>
                    )}
                    {/* Supplier Fields */}
                    {selectedEnquiry.type === "supplier" && (
                      <>
                        {selectedEnquiry.company && (
                          <p className="text-foreground mt-2">
                            <span className="font-medium">Company:</span> {selectedEnquiry.company}
                          </p>
                        )}
                        {selectedEnquiry.companyWebsite && (
                          <p className="text-foreground">
                            <span className="font-medium">Website:</span>{" "}
                            <a href={selectedEnquiry.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {selectedEnquiry.companyWebsite}
                            </a>
                          </p>
                        )}
                        {selectedEnquiry.certifications && (
                          <p className="text-foreground">
                            <span className="font-medium">Certifications:</span> {selectedEnquiry.certifications}
                          </p>
                        )}
                        {selectedEnquiry.categories && selectedEnquiry.categories.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Categories:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedEnquiry.categories.map((cat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Buyer Fields */}
                    {selectedEnquiry.type === "buyer" && (
                      <>
                        {selectedEnquiry.company && (
                          <p className="text-foreground mt-2">
                            <span className="font-medium">Company:</span> {selectedEnquiry.company}
                          </p>
                        )}
                        {selectedEnquiry.companyWebsite && (
                          <p className="text-foreground">
                            <span className="font-medium">Website:</span>{" "}
                            <a href={selectedEnquiry.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {selectedEnquiry.companyWebsite}
                            </a>
                          </p>
                        )}
                        {selectedEnquiry.yearsInBusiness && (
                          <p className="text-foreground">
                            <span className="font-medium">Years in Business:</span> {selectedEnquiry.yearsInBusiness}
                          </p>
                        )}
                        {selectedEnquiry.anticipatedVolume && (
                          <p className="text-foreground">
                            <span className="font-medium">Anticipated Annual Volume:</span> {selectedEnquiry.anticipatedVolume} lb
                          </p>
                        )}
                        {selectedEnquiry.distributionModel && selectedEnquiry.distributionModel.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Distribution Model:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedEnquiry.distributionModel.map((model, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedEnquiry.productsOfInterest && selectedEnquiry.productsOfInterest.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Products of Interest:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedEnquiry.productsOfInterest.map((product, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {product}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <span className="font-medium">Status:</span>
                      <Select
                        value={selectedEnquiry.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(selectedEnquiry._id, value)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Message */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-sm text-foreground">Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap text-foreground">
                      {selectedEnquiry.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Received: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <FloatingDockNavigation />
      </div>
    </ProtectedRoute>
  )
}

export default function EnquiriesPage() {
  return <EnquiriesPageContent />
}


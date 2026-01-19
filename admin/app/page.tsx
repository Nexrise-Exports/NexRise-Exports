"use client"

import { useState, useEffect, useCallback } from "react"
import { Building2, MessageSquare, Package, Box, Boxes } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import KPICard from "@/components/kpi-card"
import PageHeader from "@/components/page-header"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

function DashboardHome() {
  const { token } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalProperties, setTotalProperties] = useState(0)
  const [productEnquiries, setProductEnquiries] = useState(0)
  const [normalEnquiries, setNormalEnquiries] = useState(0)
  const [wholeCategoryCount, setWholeCategoryCount] = useState(0)
  const [powderCategoryCount, setPowderCategoryCount] = useState(0)
  const [enquiryData, setEnquiryData] = useState<any[]>([])
  const [productData, setProductData] = useState<any[]>([])
  const [enquiryStatusData, setEnquiryStatusData] = useState<any[]>([])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Fetch real data from backend
  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch categories for reference
      const catsResponse = await api.getAllCategories()
      const allCategories = catsResponse.success ? catsResponse.data : []

      // Fetch all products to get category counts
      const productsResponse = await api.getAllProducts(token, { limit: 1000 })
      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data.products || []
        setTotalProperties(productsResponse.data.pagination?.totalItems || products.length)

        // Count specific subcategories for KPI cards (Whole/Powder)
        const wholeCount = products.filter((p: any) =>
          p.subcategory?.toLowerCase() === "whole" ||
          p.category?.toLowerCase() === "whole"
        ).length

        const powderCount = products.filter((p: any) =>
          p.subcategory?.toLowerCase() === "powder" ||
          p.category?.toLowerCase() === "powder"
        ).length

        setWholeCategoryCount(wholeCount)
        setPowderCategoryCount(powderCount)

        // Prepare dynamic product category distribution data
        const catCounts: Record<string, number> = {}
        products.forEach((p: any) => {
          const catName = p.category || "Uncategorized"
          catCounts[catName] = (catCounts[catName] || 0) + 1
        })

        const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#ec4899"]
        const pieData = Object.entries(catCounts).map(([name, value], index) => ({
          name,
          value,
          fill: COLORS[index % COLORS.length]
        }))

        setProductData(pieData)
      }

      // Fetch all enquiries
      const enquiriesResponse = await api.getAllEnquiries(token)
      if (enquiriesResponse.success && enquiriesResponse.data) {
        const enquiries = enquiriesResponse.data.enquiries || []

        // Counts for KPI
        const productCount = enquiries.filter((e: any) => e.type === "product").length
        const generalCount = enquiries.filter((e: any) => e.type === "general").length
        setProductEnquiries(productCount)
        setNormalEnquiries(generalCount)

        // Count all types for distribution chart
        const typeCounts: Record<string, number> = {}
        enquiries.forEach((e: any) => {
          const type = e.type || "general"
          typeCounts[type] = (typeCounts[type] || 0) + 1
        })

        const TYPE_COLORS: Record<string, string> = {
          product: "#10b981",
          general: "#8b5cf6",
          buyer: "#3b82f6",
          supplier: "#f59e0b"
        }

        const enquiryPieData = Object.entries(typeCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          fill: TYPE_COLORS[name] || "#6b7280"
        }))

        setEnquiryData(enquiryPieData)

        // Prepare enquiry status bar chart data
        const statusCounts = enquiries.reduce((acc: any, enquiry: any) => {
          const status = enquiry.status || "pending"
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})

        setEnquiryStatusData([
          { name: "Pending", count: statusCounts.pending || 0 },
          { name: "Read", count: statusCounts.read || 0 },
          { name: "Replied", count: statusCounts.replied || 0 },
          { name: "Closed", count: statusCounts.closed || 0 },
        ])
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data", {
        description: error.message || "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])



  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Dashboard" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* KPI Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <KPICard
                  title="Total Products"
                  value={totalProperties.toLocaleString()}
                  icon={Package}
                  trend={totalProperties > 0 ? "Active products" : "No products yet"}
                />
                <KPICard
                  title="Product Enquiry"
                  value={productEnquiries.toLocaleString()}
                  icon={MessageSquare}
                  trend={productEnquiries > 0 ? "Product-related enquiries" : "No product enquiries yet"}
                />
                <KPICard
                  title="Normal Enquiry"
                  value={normalEnquiries.toLocaleString()}
                  icon={MessageSquare}
                  trend={normalEnquiries > 0 ? "General enquiries" : "No normal enquiries yet"}
                />
                <KPICard
                  title="Whole Category"
                  value={wholeCategoryCount.toLocaleString()}
                  icon={Box}
                  trend={wholeCategoryCount > 0 ? "Whole category products" : "No whole products yet"}
                />
                <KPICard
                  title="Powder Category"
                  value={powderCategoryCount.toLocaleString()}
                  icon={Boxes}
                  trend={powderCategoryCount > 0 ? "Powder category products" : "No powder products yet"}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Enquiry Types Pie Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Enquiry Types Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {enquiryData.some(item => item.value > 0) ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={enquiryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {enquiryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No enquiry data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Product Categories Pie Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Product Categories Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {productData.some(item => item.value > 0) ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {productData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No product data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Enquiry Status Bar Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Enquiry Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {enquiryStatusData.some(item => item.count > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={enquiryStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No enquiry status data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
      <FloatingDockNavigation />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  )
}

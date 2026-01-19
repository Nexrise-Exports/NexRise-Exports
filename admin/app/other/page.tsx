"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Loader2, Trash2, Plus, Star, Image as ImageIcon, Upload } from "lucide-react"
import PageHeader from "@/components/page-header"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { uploadToCloudinaryWithFolder } from "@/lib/cloudinary"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

function OtherSettingContent() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }
  // Testimonial states
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    location: "",
    rating: 5,
    content: ""
  })

  // Flag states
  const [flags, setFlags] = useState<any[]>([])
  const [newFlag, setNewFlag] = useState({
    name: "",
    imageUrl: ""
  })
  const [flagFile, setFlagFile] = useState<File | null>(null)
  const [flagPreview, setFlagPreview] = useState<string | null>(null)

  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteData, setDeleteData] = useState<{ id: string, type: 'testimonial' | 'flag' } | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [testRes, flagRes] = await Promise.all([
        api.getAllTestimonials(),
        api.getAllFlags()
      ])
      setTestimonials(testRes.data || [])
      setFlags(flagRes.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      setLoading(true)
      await api.createTestimonial(token, newTestimonial)
      toast.success("Testimonial added successfully")
      setNewTestimonial({ name: "", location: "", rating: 5, content: "" })
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to add testimonial")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!token || !deleteData) return

    try {
      setLoading(true)
      if (deleteData.type === 'testimonial') {
        await api.deleteTestimonial(token, deleteData.id)
        toast.success("Testimonial deleted successfully")
      } else {
        await api.deleteFlag(token, deleteData.id)
        toast.success("Flag deleted successfully")
      }
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Deletion failed")
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setDeleteData(null)
    }
  }

  const handleDeleteClick = (id: string, type: 'testimonial' | 'flag') => {
    setDeleteData({ id, type })
    setIsDeleteDialogOpen(true)
  }

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (!flagFile && !newFlag.imageUrl) {
      toast.error("Please upload a flag image")
      return
    }

    try {
      setLoading(true)
      let finalImageUrl = newFlag.imageUrl

      if (flagFile) {
        const uploadRes = await uploadToCloudinaryWithFolder(flagFile, 'nexrise/flags')
        finalImageUrl = uploadRes.secure_url
      }

      await api.createFlag(token, { ...newFlag, imageUrl: finalImageUrl })
      toast.success("Flag added successfully")
      setNewFlag({ name: "", imageUrl: "" })
      setFlagFile(null)
      setFlagPreview(null)
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to add flag")
    } finally {
      setLoading(false)
    }
  }

  const handleFlagFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'image/png') {
        toast.error("Please upload a PNG image")
        return
      }
      setFlagFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFlagPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Other Settings" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Other Settings</h1>
            {loading && <Loader2 className="animate-spin h-6 w-6" />}
          </div>

          <Tabs defaultValue="testimonials" className="w-full">
            <TabsList className="flex flex-col sm:grid sm:grid-cols-2 w-full h-auto mb-8 bg-muted p-1">
              <TabsTrigger value="testimonials" className="py-2.5 px-4 w-full">Testimonials</TabsTrigger>
              <TabsTrigger value="flags" className="py-2.5 px-4 w-full">Flags</TabsTrigger>
            </TabsList>

            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Testimonial Form */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Add Testimonial</CardTitle>
                    <CardDescription>Create a new customer testimonial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="t-name">Name</Label>
                        <Input
                          id="t-name"
                          value={newTestimonial.name}
                          onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-location">Location</Label>
                        <Input
                          id="t-location"
                          value={newTestimonial.location}
                          onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-rating">Rating (1-5)</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                            >
                              <Star className={`h-6 w-6 ${newTestimonial.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="t-content">Content</Label>
                        <Textarea
                          id="t-content"
                          value={newTestimonial.content}
                          onChange={e => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                          required
                          rows={5}
                          className="resize-none"
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
                        <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Testimonials List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Saved Testimonials</h2>
                  {testimonials.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-10 border rounded-lg bg-stone-50/50">No testimonials found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((t) => (
                        <Card key={t._id} className="relative group hover:shadow-md transition-all border-primary/10">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-white">
                                    {getInitials(t.name)}
                                  </span>
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-bold">{t.name}</CardTitle>
                                  <CardDescription className="text-xs">{t.location}</CardDescription>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteClick(t._id, 'testimonial')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-4">
                              "{t.content}"
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="flags">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Flag Form */}
                <Card className="lg:col-span-1 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Export Country</CardTitle>
                    <CardDescription>Upload a flag for a new export destination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleFlagSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="f-name">Country Name</Label>
                        <Input
                          id="f-name"
                          placeholder="e.g. United Arab Emirates"
                          value={newFlag.name}
                          onChange={e => setNewFlag({ ...newFlag, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Flag Image (Rules Applied) - <Link href="https://www.flaticon.com/" target="_blank" className="text-primary hover:underline">Flaticon</Link></Label>
                        <div className="bg-stone-50 border border-dashed border-primary/20 rounded-lg p-6 flex flex-col items-center gap-4">
                          {flagPreview ? (
                            <div className="relative group w-24 h-24">
                              <img
                                src={flagPreview}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-full border-2 border-primary/20"
                              />
                              <button
                                type="button"
                                onClick={() => { setFlagFile(null); setFlagPreview(null); }}
                                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                <Upload className="h-6 w-6 text-primary/40" />
                              </div>
                              <div className="space-y-1">
                                <Label
                                  htmlFor="flag-upload"
                                  className="text-primary hover:text-primary/80 cursor-pointer underline text-sm"
                                >
                                  Click to upload flag
                                </Label>
                                <p className="text-[10px] text-muted-foreground max-w-[180px]">
                                  Must be a <strong>Circle Shape</strong> PNG image for consistent UI.
                                </p>
                              </div>
                            </div>
                          )}
                          <input
                            id="flag-upload"
                            type="file"
                            accept="image/png"
                            onChange={handleFlagFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Country
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Flags List */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Saved Flags</h2>
                  {flags.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-10 border rounded-lg bg-stone-50/50">No flags found.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {flags.map((f) => (
                        <Card key={f._id} className="relative group overflow-hidden border-primary/10 hover:shadow-md transition-all">
                          <CardContent className="flex flex-col items-center gap-3">
                            <div className="relative h-20 w-20 flex items-center justify-center bg-stone-50 rounded-full border border-primary/5 p-1 overflow-hidden">
                              <img
                                src={f.imageUrl}
                                alt={f.name}
                                className="h-full w-full object-contain transition-transform group-hover:scale-110 duration-300"
                              />
                            </div>
                            <span className="text-[18px] font-bold uppercase tracking-wider text-black text-center truncate w-full">
                              {f.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                              onClick={() => handleDeleteClick(f._id, 'flag')}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Reusable Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete the {deleteData?.type} from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border hover:bg-accent">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
      <FloatingDockNavigation />
    </div>
  )
}

export default function OtherPage() {
  return (
    <ProtectedRoute>
      <OtherSettingContent />
    </ProtectedRoute>
  )
}

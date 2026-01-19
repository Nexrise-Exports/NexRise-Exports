"use client"

import { useState } from "react"
import FloatingDockNavigation from "@/components/floating-dock-navigation"
import PageHeader from "@/components/page-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { cn } from "@/lib/utils"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

// Define interface for FAQ
interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

function FAQPageContent() {
  const [isDark, setIsDark] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const { toast } = useToast()

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs`)
      const data = await response.json()
      if (data.success) {
        setFaqs(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch FAQs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const handleAddFaq = async () => {
    if (!newQuestion || !newAnswer) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer,
        }),
      })
      const data = await response.json()

      if (data.success) {
        setFaqs([data.data, ...faqs])
        setNewQuestion("")
        setNewAnswer("")
        toast({
          title: "Success",
          description: "FAQ added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add FAQ",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFaq = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/faqs/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        setFaqs(faqs.filter((faq) => faq._id !== id))
        toast({
          title: "Success",
          description: "FAQ deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background`}>
      <div className="flex flex-col">
        <PageHeader isDark={isDark} toggleTheme={toggleTheme} title="Frequently Asked Questions" />

        <main className="flex-1 overflow-auto p-4 sm:p-6 page-transition pb-24">
          <div className="w-full space-y-6">
            {/* Add FAQ Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Add New FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="bg-background text-foreground"
                  />
                  <Textarea
                    placeholder="Answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="bg-background text-foreground min-h-[100px] resize-none"
                  />
                  <Button onClick={handleAddFaq} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List FAQs */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Existing FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq._id} value={faq._id}>
                        <div className="flex items-center justify-between w-full pr-2">
                          <AccordionTrigger className="text-foreground hover:text-foreground/80 flex-1 text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFaq(faq._id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
                {!loading && faqs.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No FAQs found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <FloatingDockNavigation />
    </div>
  )
}

export default function FAQPage() {
  return (
    <ProtectedRoute>
      <FAQPageContent />
    </ProtectedRoute>
  )
}

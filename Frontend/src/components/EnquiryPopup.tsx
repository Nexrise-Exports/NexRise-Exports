"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateInquiry } from "@/hooks/use-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface EnquiryPopupProps {
  delay?: number; // Delay in seconds before showing popup
}

export function EnquiryPopup({ delay = 3 }: EnquiryPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { mutate, isPending } = useCreateInquiry();

  const form = useForm<z.infer<typeof insertInquirySchema>>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      type: "general",
    },
  });

  useEffect(() => {
    // Check if user has already dismissed the popup (with 3-minute expiration)
    const popupShown = localStorage.getItem("enquiry-popup-shown");
    
    if (popupShown) {
      const expiryTime = parseInt(popupShown, 10);
      const now = Date.now();
      
      // If expiry time hasn't passed, don't show popup
      if (now < expiryTime) {
        return;
      } else {
        // Expired, remove the old entry
        localStorage.removeItem("enquiry-popup-shown");
      }
    }

    // Show popup after delay only if not dismissed or expired
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const onSubmit = (data: z.infer<typeof insertInquirySchema>) => {
    mutate(
      {
        ...data,
        type: "general",
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "We will respond to your request shortly.",
          });
          form.reset();
          setIsOpen(false);
          // Store dismissal in localStorage with timestamp (expires after 3 minutes)
          const expiryTime = Date.now() + 3 * 60 * 1000; // 3 minutes
          localStorage.setItem("enquiry-popup-shown", expiryTime.toString());
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Popup - Centered using flexbox */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-primary/10 shadow-2xl pointer-events-auto rounded-lg max-h-[80vh] md:max-h-[75vh] overflow-y-auto"
            >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                // Store dismissal in localStorage with timestamp (expires after 3 minutes)
                const expiryTime = Date.now() + 3 * 60 * 1000; // 3 minutes
                localStorage.setItem("enquiry-popup-shown", expiryTime.toString());
              }}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-primary/5 hover:bg-primary/10 rounded-full z-10"
            >
              <X className="w-4 h-4 text-accent" />
            </button>

            {/* Content */}
            <div className="p-4 md:p-5">
              <div className="mb-3">
                <h2 className="font-serif text-xl md:text-2xl text-accent mb-1">
                  Let's Connect
                </h2>
                <p className="font-sans text-xs text-muted-foreground">
                  Have questions? We'd love to hear from you.
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <input
                    {...form.register("name")}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black/60 font-sans text-black text-sm rounded-md"
                  />
                  {form.formState.errors.name && (
                    <span className="text-destructive text-xs">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black/60 font-sans text-black text-sm rounded-md"
                  />
                  {form.formState.errors.email && (
                    <span className="text-destructive text-xs">
                      {form.formState.errors.email.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <input
                    {...form.register("phone")}
                    type="tel"
                    placeholder="Phone (Optional)"
                    className="w-full px-3 py-2 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black/60 font-sans text-black text-sm rounded-md"
                  />
                  {form.formState.errors.phone && (
                    <span className="text-destructive text-xs">
                      {form.formState.errors.phone.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <textarea
                    {...form.register("message")}
                    placeholder="Message..."
                    rows={2}
                    className="w-full px-3 py-2 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black/60 font-sans resize-none text-black text-sm rounded-md"
                  />
                  {form.formState.errors.message && (
                    <span className="text-destructive text-xs">
                      {form.formState.errors.message.message}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <motion.button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-accent text-accent-foreground font-sans text-xs uppercase tracking-wider px-4 py-2 hover:bg-accent/90 transition-colors disabled:opacity-50 rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPending ? "Sending..." : "Send"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      // Store dismissal in localStorage with timestamp (expires after 3 minutes)
                      const expiryTime = Date.now() + 3 * 60 * 1000; // 3 minutes
                      localStorage.setItem("enquiry-popup-shown", expiryTime.toString());
                    }}
                    className="px-4 py-2 border border-primary/20 bg-gray-400 hover:bg-accent transition-colors font-sans text-xs uppercase tracking-wider text-black rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Later
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


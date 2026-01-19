"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateInquiry } from "@/hooks/use-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ProductEnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
}

export function ProductEnquiryPopup({
  isOpen,
  onClose,
  productId,
  productName,
}: ProductEnquiryPopupProps) {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateInquiry();

  const form = useForm<z.infer<typeof insertInquirySchema>>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      type: "product",
      productId: productId || "",
      productName: productName || "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertInquirySchema>) => {
    mutate(
      {
        ...data,
        type: "product",
        productId: productId || "",
        productName: productName || "",
      },
      {
        onSuccess: () => {
          toast({
            title: "Enquiry Sent",
            description: "We will respond to your request shortly.",
          });
          form.reset();
          onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Popup */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white border border-primary/10 shadow-2xl pointer-events-auto rounded-lg max-h-[75vh] md:max-h-[70vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-primary/5 hover:bg-primary/10 rounded-full z-10"
              >
                <X className="w-4 h-4 text-accent" />
              </button>

              {/* Content */}
              <div className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <h2 className="font-serif text-xl md:text-2xl text-accent mb-1">
                    Product Enquiry
                  </h2>
                  {productName && (
                    <p className="font-sans text-xs text-muted-foreground">
                      About: <span className="font-semibold">{productName}</span>
                    </p>
                  )}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
                      Name
                    </label>
                    <input
                      {...form.register("name")}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-primary/70 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans text-black text-sm"
                    />
                    {form.formState.errors.name && (
                      <span className="text-destructive text-xs">
                        {form.formState.errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
                      Email
                    </label>
                    <input
                      {...form.register("email")}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans text-black text-sm"
                    />
                    {form.formState.errors.email && (
                      <span className="text-destructive text-xs">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
                      Phone (Optional)
                    </label>
                    <input
                      {...form.register("phone")}
                      type="tel"
                      placeholder="+91 XXXX XXXXXX"
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans text-black text-sm"
                    />
                    {form.formState.errors.phone && (
                      <span className="text-destructive text-xs">
                        {form.formState.errors.phone.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
                      Message
                    </label>
                    <textarea
                      {...form.register("message")}
                      placeholder="Tell us about your needs..."
                      rows={2}
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-primary/20 bg-gray-400 focus:outline-none focus:border-accent transition-colors placeholder:text-black font-sans resize-none text-black text-sm"
                    />
                    {form.formState.errors.message && (
                      <span className="text-destructive text-xs">
                        {form.formState.errors.message.message}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <motion.button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 bg-accent text-accent-foreground font-sans text-xs uppercase tracking-widest px-4 py-2 hover:bg-accent/90 transition-colors disabled:opacity-50 rounded-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isPending ? "Sending..." : "Send Enquiry"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-primary/20 bg-gray-400 hover:bg-accent transition-colors font-sans text-xs uppercase tracking-widest text-black rounded-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
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


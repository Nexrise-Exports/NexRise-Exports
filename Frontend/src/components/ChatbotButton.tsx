"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Chatbot } from "./Chatbot";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center md:w-16 md:h-16 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      </motion.button>

      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}


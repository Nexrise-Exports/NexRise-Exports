"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingActionButton() {
  const whatsappNumber = "+919565851852"; // Replace with actual WhatsApp number
  const phoneNumber = "+919565851852"; // Replace with actual phone number

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <motion.button
        onClick={handleWhatsApp}
        className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-4 shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap rounded-full"
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </motion.button>

      {/* Call Button */}
      <motion.button
        onClick={handleCall}
        className="flex items-center gap-3 bg-accent text-accent-foreground px-4 py-4 shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap rounded-full"
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </motion.button>
    </div>
  );
}


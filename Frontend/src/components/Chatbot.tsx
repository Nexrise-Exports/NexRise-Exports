"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw, Send, ChevronDown, Bot, CircleDot } from "lucide-react";
import { useRouter } from "next/navigation";

// Chatbot configuration
const chatbotConfig = {
  botName: "NexRise Assistant",
  language: "en",
  flowType: "option-based",
  start: {
    message: "Welcome to NexRise Exports. How can I assist you today?",
    options: [
      {
        id: "products",
        label: "Our Products",
        next: "products_menu"
      },
      {
        id: "export",
        label: "Export & Bulk Supply",
        next: "export_menu"
      },
      {
        id: "company",
        label: "About NexRise",
        next: "company_info"
      },
      {
        id: "contact",
        label: "Contact & Enquiry",
        next: "contact_info"
      }
    ]
  },
  products_menu: {
    message: "Please select a product category:",
    options: [
      {
        id: "whole_spices",
        label: "Whole Spices",
        next: "whole_spices_info"
      },
      {
        id: "powder_spices",
        label: "Powder Spices",
        next: "powder_spices_info"
      },
      {
        id: "popular_spices",
        label: "Popular Spices",
        next: "popular_spices_info"
      }
    ]
  },
  whole_spices_info: {
    message: "Our Whole Spices collection:",
    answer: {
      description: "Premium whole spices sourced directly from Indian farms, maintaining their natural oils and authentic flavor profiles.",
      products: [
        "Turmeric (Whole)",
        "Red Chilli (Whole)",
        "Cumin Seeds",
        "Coriander Seeds",
        "Black Pepper",
        "Cardamom",
        "Cinnamon",
        "Cloves"
      ],
      features: [
        "Single origin sourcing",
        "High oil content",
        "Authentic flavor profile",
        "Export-grade quality"
      ],
      cta: "Contact us for pricing and MOQ details"
    }
  },
  powder_spices_info: {
    message: "Our Powder Spices collection:",
    answer: {
      description: "Finely ground spices processed to retain natural aroma, color, and flavor without additives.",
      products: [
        "Turmeric Powder",
        "Red Chilli Powder",
        "Cumin Powder",
        "Coriander Powder",
        "Black Pepper Powder",
        "Garam Masala",
        "Curry Powder"
      ],
      features: [
        "No additives or artificial colors",
        "Uniform grind",
        "Hygienically packed",
        "Suitable for bulk supply"
      ],
      cta: "Ideal for food manufacturers and bulk traders"
    }
  },
  popular_spices_info: {
    message: "Our Most Popular Spices:",
    answer: {
      description: "Our best-selling spices trusted by global buyers for consistency and authenticity.",
      highlights: [
        {
          name: "Turmeric",
          origin: "Alleppey, Kerala",
          forms: "Whole & Powder",
          uses: "Food processing, health products"
        },
        {
          name: "Red Chilli",
          origin: "Guntur, Andhra Pradesh",
          forms: "Whole & Powder",
          uses: "Spice blends, marinades"
        },
        {
          name: "Black Pepper",
          origin: "Malabar Coast",
          forms: "Whole & Powder",
          uses: "Seasoning, spice blends"
        },
        {
          name: "Cumin Seeds",
          origin: "Unjha, Gujarat",
          forms: "Whole & Powder",
          uses: "Food seasoning, masala blends"
        }
      ],
      cta: "Request samples or bulk pricing"
    }
  },
  export_menu: {
    message: "Export & Bulk Supply Information:",
    options: [
      {
        id: "countries",
        label: "Export Countries",
        next: "export_countries"
      },
      {
        id: "import_guide",
        label: "Import Guide",
        next: "import_guide_info"
      }
    ]
  },
  export_countries: {
    message: "Countries We Export To:",
    answer: {
      description: "Our products are supplied to international markets worldwide.",
      countries: [
        "United States (USA)",
        "China",
        "United Arab Emirates (UAE)",
        "Germany",
        "Saudi Arabia"
      ],
      note: "We support export documentation and bulk logistics"
    }
  },
  import_guide_info: {
    message: "Import Guide Information:",
    answer: {
      description: "We assist buyers throughout the import process.",
      steps: [
        "Documentation & compliance support",
        "Product specifications and labeling",
        "Food-grade packaging",
        "Customs and clearance assistance"
      ],
      support: "End-to-end import assistance available",
      cta: "Contact our export team for guidance"
    }
  },
  company_info: {
    message: "About NexRise Exports:",
    answer: {
      description: "NexRise Exports is a B2B exporter of Indian spices, supplying authentic products to global buyers.",
      founded: "2026",
      location: "D 47/210 A Ramapura, Varanasi, Uttar Pradesh 221001, India",
      values: [
        "Authenticity",
        "Reliability",
        "Sustainable sourcing",
        "Long-term partnerships"
      ],
      strengths: [
        "Farmer-direct sourcing",
        "Bulk supply capability",
        "Export-ready operations",
        "Global client base"
      ],
      stats: {
        spices: "20+",
        countries: "5+",
        customers: "100+"
      }
    }
  },
  contact_info: {
    message: "Contact & Enquiry:",
    answer: {
      description: "Reach out for pricing, samples, or bulk orders.",
      email: "contact@nexriseexports.com",
      phone: "+91 95658 51852",
      location: "D 47/210 A Ramapura, Varanasi, Uttar Pradesh 221001, India",
      response: "Replies within 24 business hours",
      services: [
        "Product enquiries",
        "Bulk quotations",
        "Sample requests",
        "Export assistance",
        "Custom packaging support"
      ]
    }
  }
};

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [history, setHistory] = useState<string[]>(["start"]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with start message
      const startConfig = chatbotConfig.start as any;
      addBotMessage(startConfig.message);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStep]);

  // Check if user needs to scroll
  useEffect(() => {
    const checkScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => {
        chatContainerRef.current?.removeEventListener("scroll", checkScroll);
      };
    }
  }, [messages, currentStep]);

  // No need to prevent body scroll - user can scroll the page while chatbot is open

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }, 100);
  };

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (option: any) => {
    addUserMessage(option.label);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nextStep = option.next;
      setCurrentStep(nextStep);
      setHistory((prev) => [...prev, nextStep]);

      const stepConfig = (chatbotConfig as any)[nextStep];
      if (stepConfig) {
        if (stepConfig.message) {
          addBotMessage(stepConfig.message);
        }
      }
    }, 500);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentStep(previousStep);

      setMessages((prev) => {
        const filtered = [...prev];
        for (let i = filtered.length - 1; i >= 0; i--) {
          if (filtered[i].type === "bot") {
            filtered.splice(i, 1);
            break;
          }
        }
        for (let i = filtered.length - 1; i >= 0; i--) {
          if (filtered[i].type === "user") {
            filtered.splice(i, 1);
            break;
          }
        }
        return filtered;
      });
    }
  };

  const handleRestart = () => {
    setCurrentStep("start");
    setHistory(["start"]);
    setMessages([]);
    const startConfig = chatbotConfig.start as any;
    addBotMessage(startConfig.message);
  };

  const handleContactRedirect = () => {
    router.push("/contact");
    onClose();
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      setInputValue("");
      // You can add logic here to handle custom user messages
    }
  };

  const renderCurrentStep = () => {
    const stepConfig = (chatbotConfig as any)[currentStep];
    if (!stepConfig) return null;

    // If it has options, render them as suggested replies
    if (stepConfig.options && stepConfig.options.length > 0) {
      return (
        <div className="space-y-2 mt-2">
          {stepConfig.options.map((option: any) => (
            <motion.button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className="w-full text-left px-4 py-2.5 border-2 border-accent/20 bg-accent/10 hover:bg-accent/20 hover:border-accent/40 transition-all duration-200 text-gray-700 text-sm rounded-lg"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      );
    }

    // If it has an answer, render it
    if (stepConfig.answer) {
      const answer = stepConfig.answer;
      return (
        <div className="space-y-3 text-sm">
          {answer.description && (
            <p className="text-gray-600">{answer.description}</p>
          )}

          {answer.products && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Products</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.products.map((product: string, idx: number) => (
                  <li key={idx}>{product}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.features && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Features</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.features.map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.highlights && (
            <div className="space-y-2">
              {answer.highlights.map((highlight: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-gray-200 bg-gray-50 p-3 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {highlight.name}
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><span className="font-medium">Origin:</span> {highlight.origin}</p>
                    <p><span className="font-medium">Forms:</span> {highlight.forms}</p>
                    <p><span className="font-medium">Uses:</span> {highlight.uses}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {answer.countries && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Countries</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.countries.map((country: string, idx: number) => (
                  <li key={idx}>{country}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.steps && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Process Steps</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.steps.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.values && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Our Values</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.values.map((value: string, idx: number) => (
                  <li key={idx}>{value}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.strengths && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Our Strengths</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.strengths.map((strength: string, idx: number) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.stats && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center border border-gray-200 bg-gray-50 p-2 rounded">
                <p className="font-semibold text-lg text-gray-800">{answer.stats.spices}</p>
                <p className="text-xs text-gray-600 mt-1">Spices</p>
              </div>
              <div className="text-center border border-gray-200 bg-gray-50 p-2 rounded">
                <p className="font-semibold text-lg text-gray-800">{answer.stats.countries}</p>
                <p className="text-xs text-gray-600 mt-1">Countries</p>
              </div>
              <div className="text-center border border-gray-200 bg-gray-50 p-2 rounded">
                <p className="font-semibold text-lg text-gray-800">{answer.stats.customers}</p>
                <p className="text-xs text-gray-600 mt-1">Customers</p>
              </div>
            </div>
          )}

          {answer.email && (
            <div className="space-y-1">
              <p className="text-gray-600"><span className="font-medium">Email:</span> {answer.email}</p>
              <p className="text-gray-600"><span className="font-medium">Phone:</span> {answer.phone}</p>
              <p className="text-gray-600"><span className="font-medium">Location:</span> {answer.location}</p>
              {answer.response && (
                <p className="text-gray-600"><span className="font-medium">Response Time:</span> {answer.response}</p>
              )}
            </div>
          )}

          {answer.services && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Services</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {answer.services.map((service: string, idx: number) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.note && (
            <p className="text-xs text-gray-500 italic">{answer.note}</p>
          )}

          {answer.support && (
            <p className="text-sm text-gray-600">{answer.support}</p>
          )}

          {answer.cta && (
            <motion.button
              onClick={handleContactRedirect}
              className="w-full bg-accent text-accent-foreground py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors mt-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Contact Us
            </motion.button>
          )}

          {currentStep === "contact_info" && !answer.cta && (
            <motion.button
              onClick={handleContactRedirect}
              className="w-full bg-accent text-accent-foreground py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors mt-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Contact Us
            </motion.button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent overlay for closing on click outside (no blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-transparent"
          />

          {/* Chatbot Card - Positioned above the button */}
          <div className="fixed bottom-24 left-6 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90vw] max-w-md h-[500px] md:h-[550px] bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-accent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {chatbotConfig.botName}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      
                      <p className="text-xs text-gray-100">Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-100" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-hide"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "bot" && (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        message.type === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-white text-accent"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="bg-gray-200 px-4 py-2.5 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Step Content - Suggested Replies */}
                {!isTyping && renderCurrentStep() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="max-w-[85%] bg-white px-4 py-2.5 rounded-2xl text-accent">
                      {renderCurrentStep()}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Scroll Button */}
              {/* {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-20 right-4 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/80 transition-colors z-10"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              )} */}

              {/* Input Field */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {/* <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div> */}
                {/* Footer Actions */}
                <div className="flex gap-2 mt-2">
                  {history.length > 1 && (
                    <motion.button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Main Menu
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  RefreshCcw,
  Loader2,
  User,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import robotAnimation from "@/assets/lottie/robot.json";

/* =========================================
   CONSTANTS & CONFIG
   ========================================= */
const BRAND_COLOR = "bg-orange-600";
const BRAND_COLOR_TEXT = "text-orange-600";
const BOT_NAME = "TripLinkers AI";

const CHAT_MODES = {
  AI: "ai",
  COLLECTING_METHOD: "collecting_method",
  COLLECTING_CONTACT: "collecting_contact",
  COLLECTING_NAME: "collecting_name",
  CONVERTED: "converted"
};

const TRIGGER_KEYWORDS = [
  "price", "cost", "package", "book", "plan my trip", "send quote", "quote", "how much"
];

/* =========================================
   COMPONENT: TRIP LEAD ASSISTANT (AI)
   ========================================= */
export default function TripLeadAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  // State Machine
  const [chatMode, setChatMode] = useState(CHAT_MODES.AI);
  const [messages, setMessages] = useState([]);
  const [leadContext, setLeadContext] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pathname = usePathname();

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isTyping, isOpen]);

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "init-1",
          role: "model",
          content: "Hi there! 👋 I'm your personal AI travel assistant from TripLinkers.",
        },
        {
          id: "init-2",
          role: "model",
          content: "I can help you plan a perfect trip or find great packages. How can I help you today?",
          options: [
            { label: "Plan a Trip ✈️", value: "plan_trip" },
            { label: "Check Prices 💰", value: "check_prices" },
            { label: "Talk to Expert 📞", value: "talk_expert" },
          ]
        }
      ]);
      setHasUnread(true);
    }
  }, []);

  /* =========================================
     HANDLERS
     ========================================= */
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  const handleReset = () => {
    if (window.confirm("Start a new conversation?")) {
      setMessages([]);
      setLeadContext({});
      setChatMode(CHAT_MODES.AI);
      setTimeout(() => {
          setMessages([
            {
              id: "init-1",
              role: "model",
              content: "Hi! How can I help you today?",
              options: [
                { label: "Plan a Trip ✈️", value: "plan_trip" },
                { label: "Check Prices 💰", value: "check_prices" },
              ]
            }
          ]);
      }, 100);
    }
  };

  const handleOptionClick = (value, label) => {
    handleSendMessage(label, value);
  };

  const handleSendClick = () => {
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendClick();
  };

  /* =========================================
     CORE LOGIC: SEND MESSAGE
     ========================================= */
  const handleSendMessage = async (text, payloadValue = null) => {
    // 1. Add User Message
    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Check for Conversion Triggers (only if in AI mode)
    if (chatMode === CHAT_MODES.AI) {
      const lowerText = text.toLowerCase();
      const isTrigger = TRIGGER_KEYWORDS.some(kw => lowerText.includes(kw)) || payloadValue === "talk_expert" || payloadValue === "check_prices";

      if (isTrigger) {
        setIsTyping(false);
        setChatMode(CHAT_MODES.COLLECTING_METHOD);
        addBotMessage("I can prepare a personalized quote for you. Would you like me to connect you with a travel expert or send the plan here?", [
          { label: "Get Quote 📩", value: "get_quote" },
          { label: "Talk to an Expert 📞", value: "talk_expert" }
        ]);
        return;
      }
    }

    // 3. Handle Lead Capture State Machine
    if (chatMode === CHAT_MODES.COLLECTING_METHOD) {
      setIsTyping(false);
      setChatMode(CHAT_MODES.COLLECTING_CONTACT); // Correct transition: now wait for their choice
      addBotMessage("Where should I send your travel plan? WhatsApp or Email?", [
        { label: "WhatsApp 🟢", value: "whatsapp" },
        { label: "Email ✉️", value: "email" }
      ]);
      return;
    }

    if (chatMode === CHAT_MODES.COLLECTING_CONTACT) {
      setIsTyping(false);
      // If it was a platform selection (button click)
      if (payloadValue === "whatsapp" || payloadValue === "email") {
        addBotMessage("Please share your number or email.");
        return; // Stay in COLLECTING_CONTACT mode to get the actual input
      }

      // If it's the actual contact info
      const newCtx = { ...leadContext, contact: text };
      setLeadContext(newCtx);
      setChatMode(CHAT_MODES.COLLECTING_NAME);
      addBotMessage("May I have your name?");
      return;
    }

    if (chatMode === CHAT_MODES.COLLECTING_NAME) {
        setIsTyping(false);
        const finalCtx = { ...leadContext, name: text };
        setLeadContext(finalCtx);
        setChatMode(CHAT_MODES.CONVERTED);
        addBotMessage(`Thanks ${text}! I am preparing your personalized plan now.`);
        saveLead(finalCtx, text);
        return;
    }

    // 4. Default AI Mode
    const context = {
        ...leadContext,
        currentPage: pathname,
        payloadValue
    };

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, context })
        });

        const data = await response.json();
        
        if (data.reply) {
            addBotMessage(data.reply, data.options);
        }

        if (data.extracted) {
            setLeadContext(prev => ({ ...prev, ...data.extracted }));
        }
    } catch (error) {
        addBotMessage("I'm having a bit of trouble connecting. Please try again or call us directly.");
    } finally {
        setIsTyping(false);
    }
  };

  const addBotMessage = (content, options = null) => {
    const botMsg = { id: Date.now() + 1, role: "model", content, options };
    setMessages(prev => [...prev, botMsg]);
  };

  /* =========================================
     LEAD SAVING
     ========================================= */
  const saveLead = async (ctx, lastMsg) => {
    try {
        await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source: "trip_bot_optimized",
                name: ctx.name || "Chat User",
                email: ctx.contact?.includes("@") ? ctx.contact : null,
                phone: !ctx.contact?.includes("@") ? ctx.contact : null,
                destination: ctx.destination,
                message: `Lead captured via optimized flow. Context: ${JSON.stringify(ctx)}`,
                answers: ctx
            })
        });
    } catch (e) {
        console.error("Failed to save lead", e);
    }
  };

  /* =========================================
     RENDER
     ========================================= */
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] w-[calc(100vw-32px)] md:w-[400px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col"
            style={{ 
              height: "min(600px, calc(100dvh - 100px))",
              maxHeight: "800px" 
            }}
          >
            {/* MODERN HEADER */}
            <div className={`px-6 py-5 ${BRAND_COLOR} flex justify-between items-center text-white shrink-0 shadow-lg relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight tracking-tight">{BOT_NAME}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <p className="text-[11px] font-medium opacity-90 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                 <button onClick={handleReset} className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95" title="Restart">
                    <RefreshCcw className="w-4 h-4 text-white" />
                 </button>
                 <button onClick={toggleOpen} className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95">
                    <X className="w-5 h-5 text-white" />
                 </button>
              </div>
            </div>

            {/* MESSAGES AREA - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#F8FAFC] custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {msg.role !== "user" && (
                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mb-1">
                        <Sparkles className="w-3 h-3 text-orange-600" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? `${BRAND_COLOR} text-white rounded-br-none font-medium` 
                        : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Options/Chips */}
                    {msg.options && (
                      <div className="mt-4 flex flex-col gap-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => handleOptionClick(opt.value, opt.label)}
                            className={`w-full text-left font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                              msg.role === "user"
                                ? "bg-white/10 border-white/20 hover:bg-white/20" 
                                : "bg-white text-orange-600 border-orange-100 hover:bg-orange-50 hover:border-orange-200 shadow-sm"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mb-1">
                        <User className="w-3 h-3 text-slate-500" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start items-end gap-2 text-slate-400">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mb-1">
                        <Sparkles className="w-3 h-3 text-orange-600" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1 group">
                    <input
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask anything..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 transition-all placeholder:text-slate-400 pr-12"
                    />
                    <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  
                  <button 
                    onClick={handleSendClick}
                    disabled={!inputText.trim() || isTyping}
                    className={`p-3.5 rounded-2xl transition-all shadow-lg active:scale-90 ${
                      inputText.trim() && !isTyping
                        ? `${BRAND_COLOR} text-white hover:shadow-orange-500/20` 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isTyping ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}
                  </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON (LOTTIE) */}
      {!isOpen && (
        <motion.button
          onClick={toggleOpen}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9990] drop-shadow-2xl"
        >
          <div className="relative group">
             <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all"></div>
             <Lottie
              animationData={robotAnimation}
              loop
              autoplay
              className="cursor-pointer w-20 h-20 md:w-28 md:h-28 relative z-10"
            />
            {hasUnread && (
              <span className="absolute top-4 right-4 flex h-5 w-5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </div>
        </motion.button>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </>
  );
}

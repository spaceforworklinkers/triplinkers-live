"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Mail,
  Phone,
  User,
  Send,
  Sparkles,
  CircleCheck,
} from "lucide-react";

export default function UniversalLeadModal({
  open = false,
  onClose = () => {},
  onSuccess = () => {},
}) {
  const modalRef = useRef(null);

  const [visible, setVisible] = useState(Boolean(open));
  useEffect(() => setVisible(Boolean(open)), [open]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const closeAll = () => {
    setVisible(false);
    setLoading(false);
    setErrorMsg("");
    onClose && onClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBackdropMouseDown = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAll();
    }
  };

  /* =========================
     SUBMIT HANDLER (FIXED)
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      from: formData.get("from"),
      destination: formData.get("destination"),
      days: formData.get("days"),
      travelers: formData.get("travelers"),
      budget: formData.get("budget"),
      message: formData.get("message"),
    };

    try {
      /* 1️⃣ EMAIL (Web3Forms) */
      const emailRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "New Trip Inquiry - TripLinkers",
          from_name: "TripLinkers Website",
          ...payload,
        }),
      });

      const emailJson = await emailRes.json();
      if (!emailJson.success) {
        throw new Error("Email delivery failed");
      }

      /* 2️⃣ BACKEND SAVE (Dashboard) */
      const apiRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...payload,
          source: "Universal Lead Modal",
        }),
      });

      const apiJson = await apiRes.json();
      if (!apiRes.ok || !apiJson.success) {
        throw new Error(apiJson.message || "Lead save failed");
      }

      /* SUCCESS */
      setShowSuccess(true);
      onSuccess && onSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        setLoading(false);
        closeAll();
        form.reset();
      }, 1800);
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorMsg(err.message || "Submission failed. Please try again.");
      setLoading(false);
    }
  };

  const initialY = isMobile ? 30 : 8;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleBackdropMouseDown}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ y: initialY, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: initialY, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-6">
              <div className="absolute inset-0 bg-black/10"></div>

              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  closeAll();
                }}
                className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <CircleCheck className="w-6 h-6 text-white" />
                </div>

                {showSuccess ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Request Received
                    </h3>
                    <p className="text-orange-100 text-sm">
                      Our team will contact you shortly.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Plan Your Perfect Trip
                    </h3>
                    <p className="text-orange-100 text-sm">
                      Share details and get a personalized itinerary
                    </p>
                  </>
                )}
              </div>
            </div>

            {!showSuccess && (
              <form onSubmit={handleSubmit} className="px-6 py-5">
                {errorMsg && (
                  <div className="mb-3 p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input icon={User} name="name" placeholder="Full Name" />
                    <Input icon={Mail} name="email" placeholder="Email" />
                  </div>

                  <Input icon={Phone} name="phone" placeholder="Phone Number" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input icon={MapPin} name="from" placeholder="From" />
                    <Input icon={MapPin} name="destination" placeholder="Destination" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input icon={Calendar} name="days" placeholder="Days" />
                    <Input icon={Users} name="travelers" type="number" placeholder="People" />
                    <select
                      name="budget"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">Budget</option>
                      <option>Economical</option>
                      <option>Mid-Range</option>
                      <option>Luxury</option>
                    </select>
                  </div>

                  <textarea
                    name="message"
                    placeholder="Additional details (optional)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm h-20 resize-none"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Get Personalized Quote
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-500 text-center">
                    🔒 Your information is safe and confidential
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        {...props}
        required
        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

/**
 * UniversalLeadModal.jsx
 *
 * Design: Airbnb-style minimal centered card
 * Functionality preserved:
 * - Auto-open after 9s (once per session)
 * - Submit to Web3Forms (client-side) using access_key "XXX"
 * - Success animation + auto-close
 * - Close on ESC and backdrop click
 * - Responsive small card (centered desktop, comfortable size on mobile)
 * - Keeps onClose and onSuccess callbacks
 *
 * Replace WEB3FORMS_ACCESS_KEY with your real key.
 */

export default function UniversalLeadModal({
  open = false,
  onClose = () => {},
  onSuccess = () => {},
}) {
  const modalRef = useRef(null);

  // Visible state (synced with parent open prop)
  const [visible, setVisible] = useState(Boolean(open));
  useEffect(() => setVisible(Boolean(open)), [open]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // detect mobile for small motion tweaks
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-open once per session after 9 seconds (if not already opened)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "triplinkers_lead_modal_shown_v1";

    if (visible) {
      sessionStorage.setItem(KEY, "1");
      return;
    }

    if (sessionStorage.getItem(KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(KEY, "1");
    }, 9000);

    return () => clearTimeout(timer);
  }, [visible]);

  // close helper
  const closeAll = () => {
    setVisible(false);
    setLoading(false);
    setErrorMsg("");
    onClose && onClose();
  };

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, []);

  // backdrop click - close when clicking outside modal
  const handleBackdropMouseDown = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAll();
    }
  };

  // Web3Forms config - replace "XXX" with real key
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  const WEB3FORMS_ACCESS_KEY = "XXX";

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const formElement = e.target;
      const formData = new FormData(formElement);

      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", "TripLinkers Lead - Modal");
      if (typeof window !== "undefined") {
        formData.append("url", window.location.href);
        formData.append("referrer", document.referrer || "");
      }

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = json?.message || `Submission failed, status ${res.status}`;
        throw new Error(msg);
      }

      // success
      setShowSuccess(true);
      onSuccess && onSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        setLoading(false);
        closeAll();
      }, 2000);
    } catch (err) {
      console.error("Web3Forms submit error:", err);
      setErrorMsg(err?.message || "Submission failed, please try again");
      setLoading(false);
    }
  };

  // motion offsets
  const initialY = isMobile ? 40 : 8;
  const exitY = isMobile ? 40 : 8;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleBackdropMouseDown}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            key="modal"
            ref={modalRef}
            initial={{ y: initialY, opacity: 0, scale: 0.995 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: exitY, opacity: 0, scale: 0.995 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, duration: 0.28 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-7 relative border border-gray-100"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {/* Close */}
            <button
              onClick={closeAll}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              type="button"
            >
              ✕
            </button>

            {/* Success state */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold font-karla text-gray-900">Request Received</h3>
                  <p className="text-sm text-gray-600 mt-1">Our team will contact you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {!showSuccess && (
              <>
                <h3 className="text-2xl font-semibold font-karla text-gray-900 mb-1">Plan Your Perfect Trip</h3>
                <p className="text-sm text-gray-600 mb-4">Share quick details, we'll prepare a tailored quote.</p>

                {errorMsg && (
                  <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      name="name"
                      required
                      placeholder="Name"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                  </div>

                  <input
                    name="phone"
                    required
                    placeholder="Phone"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      name="from"
                      required
                      placeholder="Travelling From (city/country)"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                    <input
                      name="destination"
                      required
                      placeholder="Destination (city/country)"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      name="days"
                      type="number"
                      min="1"
                      placeholder="Days"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                    <input
                      name="travelers"
                      type="number"
                      min="1"
                      placeholder="Travelers"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                    <select
                      name="budget"
                      defaultValue=""
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                    >
                      <option value="" disabled>Budget</option>
                      <option>Economical</option>
                      <option>Mid-Range</option>
                      <option>Luxury</option>
                    </select>
                  </div>

                  <textarea
                    name="message"
                    placeholder="Any additional details (optional)"
                    className="w-full px-3 py-2 border rounded-lg text-sm h-20 focus:ring-2 focus:ring-orange-100 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow ${
                      loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {loading ? "Sending..." : "Request Quote"}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-3">
                  We respect your privacy. We'll only use this information to prepare your quote.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

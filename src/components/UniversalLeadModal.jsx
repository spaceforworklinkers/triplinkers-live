"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

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

  // 🔥 FINAL SUBMIT HANDLER (EMAIL + ADMIN)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
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

      // 1️⃣ WEB3FORMS → EMAIL
      const web3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "New Trip Inquiry - TripLinkers",
          from_name: "TripLinkers Website",
          ...payload,
        }),
      });

      const web3Json = await web3Res.json();
      if (!web3Json.success) {
        throw new Error("Email sending failed");
      }

      // 2️⃣ BACKEND → ADMIN DASHBOARD
      const apiRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          source: "Universal Modal",
        }),
      });

      const apiJson = await apiRes.json();
      if (!apiJson.success) {
        throw new Error("Lead save failed");
      }

      setShowSuccess(true);
      onSuccess && onSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        setLoading(false);
        closeAll();
        form.reset();
      }, 2000);
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorMsg(err.message || "Submission failed");
      setLoading(false);
    }
  };

  const initialY = isMobile ? 40 : 8;
  const exitY = isMobile ? 40 : 8;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleBackdropMouseDown}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ y: initialY, opacity: 0, scale: 0.995 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: exitY, opacity: 0, scale: 0.995 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, duration: 0.28 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-7 relative border border-gray-100"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <button
              onClick={closeAll}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              type="button"
            >
              ✕
            </button>

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
                  <h3 className="text-lg font-semibold font-karla text-gray-900">
                    Request Received
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Our team will contact you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!showSuccess && (
              <>
                <h3 className="text-2xl font-semibold font-karla text-gray-900 mb-1">
                  Plan Your Perfect Trip
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Share quick details, we'll prepare a tailored quote.
                </p>

                {errorMsg && (
                  <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input name="name" required placeholder="Name" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input name="email" type="email" required placeholder="Email" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>

                  <input name="phone" required placeholder="Phone" className="w-full px-3 py-2 border rounded-lg text-sm" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input name="from" required placeholder="Travelling From (city/country)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input name="destination" required placeholder="Destination (city/country)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input name="days" type="number" min="1" placeholder="Days" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input name="travelers" type="number" min="1" placeholder="Travelers" className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <select name="budget" defaultValue="" className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="" disabled>Budget</option>
                      <option>Economical</option>
                      <option>Mid-Range</option>
                      <option>Luxury</option>
                    </select>
                  </div>

                  <textarea name="message" placeholder="Any additional details (optional)" className="w-full px-3 py-2 border rounded-lg text-sm h-20" />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white ${
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

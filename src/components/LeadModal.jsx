"use client";

import { useState } from "react";
import { X, Lock, Unlock, Mail, Phone, User, CheckCircle } from "lucide-react";

export default function LeadModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };

      /* 1️⃣ EMAIL */
      const emailRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "New Itinerary Unlock Request",
          from_name: "TripLinkers Website",
          ...payload,
        }),
      });

      const emailJson = await emailRes.json();
      if (!emailJson.success) {
        throw new Error("Email failed");
      }

      /* 2️⃣ BACKEND SAVE */
      const apiRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...payload,
          source: "Itinerary Unlock Modal",
        }),
      });

      const apiJson = await apiRes.json();
      if (!apiRes.ok || !apiJson.success) {
        throw new Error(apiJson.message || "Lead save failed");
      }

      /* SUCCESS */
      setLoading(false);
      onSuccess && onSuccess();
      onClose && onClose();

      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorMsg("Submission failed. Please try again.");
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-slideUp">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-6">
          <div className="absolute inset-0 bg-black/10"></div>

          {/* INSTANT CLOSE */}
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Lock className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              Unlock Your Complete Itinerary
            </h2>

            <p className="text-orange-100 text-sm leading-snug">
              Access full plans, maps, and expert recommendations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-100">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
              <span>
                <b>Includes:</b> day-wise itinerary, local tips, insider insights
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="+1 555 000 0000"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Unlock Itinerary
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-3">
              🔒 We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
      `}</style>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function LeadModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // TODO: integrate your API or CRM here…
    setTimeout(() => {
      setLoading(false);
      onSuccess(); // unlock itinerary
      onClose(); // close modal
    }, 1000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Get Full Itinerary
        </h2>

        <p className="text-gray-600 text-sm mb-4 text-center">
          Fill the form to unlock the complete high quality itinerary.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-600 outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-600 outline-none"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-600 outline-none"
              placeholder="Your phone number"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg mt-2"
          >
            {loading ? "Processing..." : "Unlock Itinerary"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function PackageLeadAction({ pkg }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitLead(e) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    body.source = "package";
    body.package_slug = pkg.slug;
    body.package_title = pkg.title;

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSubmitting(false);

    if (res.ok) {
      alert("Thank you! Our team will contact you shortly.");
      setOpen(false);
      e.target.reset();
    } else {
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
        >
          Book Now ₹{pkg.price}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            <h3 className="text-2xl font-bold mb-2">Book Your Trip</h3>
            <p className="text-gray-500 mb-6 text-sm">Fill in your details and our experts will call you to finalize the booking for <b>{pkg.title}</b>.</p>

            <form onSubmit={submitLead} className="space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              <input name="email" type="email" required placeholder="Email Address" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              <input name="phone" required placeholder="Phone Number" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              <textarea name="message" placeholder="Any special requests?" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none" />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 disabled:opacity-50 transition-all"
              >
                {submitting ? "Sending Request..." : "Confirm Interest"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

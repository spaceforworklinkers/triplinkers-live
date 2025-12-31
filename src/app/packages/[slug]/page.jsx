"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { Check, X } from "lucide-react";

export default function PackageDetailPage() {
  const { slug } = useParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch package
  useEffect(() => {
    if (!slug) return;

    async function fetchPackage() {
      const res = await fetch(`/api/packages/slug/${slug}`);
      const json = await res.json();

      if (!json.package) {
        notFound();
        return;
      }

      setPkg(json.package);
      setLoading(false);
    }

    fetchPackage();
  }, [slug]);

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

  // Helper to render inclusions/exclusions safely
  const renderList = (data, isExclusion = false) => {
    if (!data) return null;

    // IF ARRAY (New Format)
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return (
        <ul className="space-y-2 mt-2">
          {data.map((item, i) => (
             <li key={i} className="flex items-center gap-2 text-slate-700">
               {isExclusion ? <X className="text-red-500 w-4 h-4" /> : <Check className="text-green-500 w-4 h-4" />}
               <span>{item}</span>
             </li>
          ))}
        </ul>
      );
    }

    // IF STRING (Might be JSON string or HTML)
    if (typeof data === "string") {
      // Try parsing JSON first
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
           return (
            <ul className="space-y-2 mt-2">
              {parsed.map((item, i) => (
                 <li key={i} className="flex items-center gap-2 text-slate-700">
                   {isExclusion ? <X className="text-red-500 w-4 h-4" /> : <Check className="text-green-500 w-4 h-4" />}
                   <span>{item}</span>
                 </li>
              ))}
            </ul>
          );
        }
      } catch (e) {
        // Not JSON, assume HTML string (Classic)
        return <div className="prose max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: data }} />;
      }
    }

    return null;
  };

  if (loading) {
    return <p className="p-6">Loading package...</p>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative h-[420px] w-full">
        {pkg.banner_url ? (
           <Image
             src={pkg.banner_url}
             alt={pkg.title}
             fill
             className="object-cover"
             priority
           />
        ) : (
           <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold">{pkg.title}</h1>
          <p className="text-sm mt-2">
            {pkg.destination} • {pkg.days} Days
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <span className="text-2xl font-bold text-orange-600">
            ₹{pkg.price}
          </span>
        </div>

        {pkg.short_desc && (
          <div
            className="prose max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: pkg.short_desc }}
          />
        )}

        {pkg.itinerary && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Itinerary</h2>
            <div
              className="prose max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: pkg.itinerary }}
            />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
               <span className="bg-green-100 text-green-600 p-1 rounded"><Check size={20} /></span> Inclusions
             </h3>
             {renderList(pkg.inclusions)}
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
               <span className="bg-red-100 text-red-600 p-1 rounded"><X size={20} /></span> Exclusions
             </h3>
             {renderList(pkg.exclusions, true)}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
        >
          Interested
        </button>
      </div>

      {/* Lead Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">
              Enquire for {pkg.title}
            </h3>

            <form onSubmit={submitLead} className="space-y-3">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
              <input
                name="phone"
                required
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />
              <textarea
                name="message"
                placeholder="Message"
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-600 text-white rounded"
                >
                  {submitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

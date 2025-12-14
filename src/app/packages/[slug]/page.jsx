"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";

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

  if (loading) {
    return <p className="p-6">Loading package...</p>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="relative h-[420px] w-full">
        <Image
          src={pkg.banner_url}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
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
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: pkg.short_desc }}
          />
        )}

        {pkg.itinerary && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Itinerary</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pkg.itinerary }}
            />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {pkg.inclusions && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Inclusions</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: pkg.inclusions }}
              />
            </div>
          )}

          {pkg.exclusions && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Exclusions</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: pkg.exclusions }}
              />
            </div>
          )}
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
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

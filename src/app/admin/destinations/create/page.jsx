"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------
   Basic client-side slug generator
   (UX only, server ensures uniqueness)
---------------------------------- */
function basicSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CreateDestinationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    seo_title: "",
    seo_description: "",
    short_description: "",
    long_description: "",
    hero_images: "",
    highlights: "",
    best_time: "",
    ideal_duration: "",
    budget_range: "mid",
    status: "draft",
    show_in_footer: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleNameChange(e) {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: basicSlug(name),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      hero_images: form.hero_images
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      highlights: form.highlights
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    };

    const res = await fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setLoading(false);

    if (json.success) {
      router.push("/admin/destinations");
    } else {
      alert(json.message || "Failed to create destination");
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Add Destination</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Destination name"
          value={form.name}
          onChange={handleNameChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="seo_title"
          placeholder="SEO title"
          value={form.seo_title}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <textarea
          name="seo_description"
          placeholder="SEO description"
          value={form.seo_description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          rows={2}
        />

        <textarea
          name="short_description"
          placeholder="Short description"
          value={form.short_description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          rows={2}
        />

        <textarea
          name="long_description"
          placeholder="Long description"
          value={form.long_description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          rows={6}
        />

        <input
          name="hero_images"
          placeholder="Hero image URLs (comma separated)"
          value={form.hero_images}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="highlights"
          placeholder="Highlights (comma separated)"
          value={form.highlights}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="best_time"
          placeholder="Best time to visit"
          value={form.best_time}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <input
          name="ideal_duration"
          placeholder="Ideal duration"
          value={form.ideal_duration}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <select
          name="budget_range"
          value={form.budget_range}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="cheap">Cheap</option>
          <option value="mid">Mid</option>
          <option value="luxury">Luxury</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="show_in_footer"
            checked={form.show_in_footer}
            onChange={handleChange}
          />
          Show in footer
        </label>

        <button
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-orange-500 text-white"
        >
          {loading ? "Saving..." : "Create Destination"}
        </button>
      </form>
    </div>
  );
}

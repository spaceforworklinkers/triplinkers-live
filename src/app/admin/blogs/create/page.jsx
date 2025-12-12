"use client";

import { useEffect, useState } from "react";

export default function CreateBlogPage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Auto slug generator
  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [title]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    }
    loadCategories();
  }, []);

  // Create blog
  async function submitBlog(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        category_id: categoryId,
        banner_url: bannerUrl,
        description,
        content,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Slug already exists or server error.");
      return;
    }

    alert("Blog created successfully");
    window.location.href = "/admin/blogs";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">Create Blog</h1>

      <form
        onSubmit={submitBlog}
        className="bg-white p-8 rounded-xl shadow-md border space-y-6"
      >
        <div>
          <label className="font-medium">Title</label>
          <input
            className="w-full border px-4 py-3 rounded-lg mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Slug (auto)</label>
          <input
            className="w-full border px-4 py-3 rounded-lg mt-1"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Category</label>
          <select
            className="w-full border px-4 py-3 rounded-lg mt-1"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">Banner Image URL</label>
          <input
            className="w-full border px-4 py-3 rounded-lg mt-1"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="Paste image URL"
          />
        </div>

        <div>
          <label className="font-medium">Short Description</label>
          <textarea
            className="w-full border px-4 py-3 rounded-lg mt-1"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Full Content</label>
          <textarea
            className="w-full border px-4 py-3 rounded-lg mt-1"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {saving ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}

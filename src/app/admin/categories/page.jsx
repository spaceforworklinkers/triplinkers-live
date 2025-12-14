"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-generate slug
  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [title]);

  // Fetch categories
  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Create category
  async function submitCategory(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Unable to create category");
      return;
    }

    setTitle("");
    setSlug("");
    loadCategories();
  }

  // Delete category
  async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;

    await fetch(`/api/categories?id=${id}`, {
      method: "DELETE",
    });

    loadCategories();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl mb-6 font-semibold">Categories</h1>

      <form
        onSubmit={submitCategory}
        className="bg-white p-6 rounded-xl shadow-md border mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>

        <input
          type="text"
          placeholder="Category Title"
          className="w-full border rounded-lg px-4 py-3 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Slug (auto-generated)"
          className="w-full border rounded-lg px-4 py-3 mb-4 bg-gray-100"
          value={slug}
          readOnly
        />

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Create Category"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Slug</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                {/* ✅ FIX HERE */}
                <td className="border p-3">{cat.name}</td>
                <td className="border p-3">{cat.slug}</td>
                <td className="border p-3">
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

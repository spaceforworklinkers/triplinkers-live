"use client";

import { useEffect, useState, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Undo, Redo, Eye } from "lucide-react";

/* ---------------- Rich Text Editor ---------------- */
function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    ref.current?.focus();
  };

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button type="button" onClick={() => exec("bold")}><Bold size={16} /></button>
        <button type="button" onClick={() => exec("italic")}><Italic size={16} /></button>
        <button type="button" onClick={() => exec("insertUnorderedList")}><List size={16} /></button>
        <button type="button" onClick={() => exec("insertOrderedList")}><ListOrdered size={16} /></button>
        <button type="button" onClick={() => exec("undo")}><Undo size={16} /></button>
        <button type="button" onClick={() => exec("redo")}><Redo size={16} /></button>
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={() => onChange(ref.current.innerHTML)}
        className="min-h-[320px] p-4 outline-none prose max-w-none"
      />
    </div>
  );
}

/* ---------------- Create Blog Page ---------------- */
export default function CreateBlogPage() {
  const [categories, setCategories] = useState([]);

  // Core fields (ALL FROM SCHEMA)
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Status
  const [status, setStatus] = useState("draft");

  // SEO (NEW – DB backed)
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [saving, setSaving] = useState(false);

  // Auto slug
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
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  // Save blog
  async function saveBlog() {
    setSaving(true);

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage,
        status,
        category_ids: categoryId ? [categoryId] : [],
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Error saving blog");
      return;
    }

    window.location.href = "/admin/blogs";
  }

  // Preview (client-side)
  function previewBlog() {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${seoTitle || title}</title>
          <meta name="description" content="${seoDescription || excerpt}" />
        </head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h1>${title}</h1>
          <p>${excerpt}</p>
          <hr/>
          ${content}
        </body>
      </html>
    `);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Blog</h1>

          <div className="flex gap-3">
            <button
              onClick={previewBlog}
              className="border px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Eye size={16} /> Preview
            </button>

            <button
              onClick={saveBlog}
              disabled={saving}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Main Editor */}
        <div className="bg-white p-8 rounded-xl border space-y-6">
          <input
            className="w-full text-3xl font-bold outline-none"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="text-sm text-gray-500">
            Slug: <span className="font-medium">{slug}</span>
          </div>

          <textarea
            rows="3"
            className="w-full border rounded-lg p-3"
            placeholder="Short description (excerpt)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-3">Status</h3>
            <label className="block mb-1">
              <input type="radio" checked={status==="draft"} onChange={()=>setStatus("draft")} /> Draft
            </label>
            <label className="block mb-1">
              <input type="radio" checked={status==="published"} onChange={()=>setStatus("published")} /> Published
            </label>
            <label className="block">
              <input type="radio" checked={status==="disabled"} onChange={()=>setStatus("disabled")} /> Disabled
            </label>
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-2">Category</h3>
            <select
              className="w-full border p-2 rounded-lg"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-2">Featured Image</h3>
            <input
              className="w-full border p-2 rounded-lg"
              placeholder="Image URL"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-xl border space-y-3">
            <h3 className="font-semibold">SEO</h3>

            <input
              className="w-full border p-2 rounded-lg"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <textarea
              rows="2"
              className="w-full border p-2 rounded-lg"
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded-lg"
              placeholder="SEO Keywords (comma separated)"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

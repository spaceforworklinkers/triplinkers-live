"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, List, ListOrdered, Undo, Redo, Eye } from "lucide-react";

/* ---------- Rich Text Editor ---------- */
function BlogEditor({ value, onChange }) {
  const ref = useRef(null);

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    ref.current?.focus();
  };

  const handleInput = () => {
    onChange(ref.current.innerHTML);
  };

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="border rounded-lg bg-white">
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
        onInput={handleInput}
        className="min-h-[320px] p-4 outline-none prose max-w-none"
      />
    </div>
  );
}

export default function EditBlogPage({ params }) {
  const { id: blogId } = use(params); // Next.js 15 safe
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [status, setStatus] = useState("draft");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Load categories */
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  /* Load blog */
  useEffect(() => {
    async function loadBlog() {
      const res = await fetch(`/api/blogs/${blogId}`);
      const { blog } = await res.json();

      setTitle(blog.title);
      setSlug(blog.slug);
      setExcerpt(blog.excerpt || "");
      setContent(blog.content || "");
      setFeaturedImage(blog.featured_image || "");
      setSeoTitle(blog.seo_title || "");
      setSeoDescription(blog.seo_description || "");
      setSeoKeywords(blog.seo_keywords || "");
      setStatus(blog.status || "draft");

      if (blog.blog_categories?.length) {
        setCategoryId(blog.blog_categories[0].category_id);
      }

      setLoading(false);
    }

    if (blogId) loadBlog();
  }, [blogId]);

  async function updateBlog(finalStatus) {
    setSaving(true);

    const res = await fetch(`/api/blogs/${blogId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage,
        status: finalStatus,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        category_ids: categoryId ? [categoryId] : [],
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to update blog");
      return;
    }

    alert("Blog updated successfully");
    router.push("/admin/blogs");
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Blog</h1>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="border px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Eye size={16} /> {preview ? "Editor" : "Preview"}
            </button>

            <button
              onClick={() => updateBlog("draft")}
              className="border px-4 py-2 rounded-lg"
              disabled={saving}
            >
              Save Draft
            </button>

            <button
              onClick={() => updateBlog("published")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
              disabled={saving}
            >
              Update & Publish
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* Main */}
        <div className="bg-white rounded-xl border p-8 space-y-6">
          <input
            className="text-3xl font-bold w-full outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
          />

          <p className="text-sm text-gray-500">Slug: {slug}</p>

          <textarea
            rows="3"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Short description"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          {!preview ? (
            <BlogEditor value={content} onChange={setContent} />
          ) : (
            <div className="prose max-w-none border rounded-lg p-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Status */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-2">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-2">Category</h3>
            <select
              className="w-full border rounded-lg px-3 py-2"
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
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-2">Featured Image</h3>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="Image URL"
            />
          </div>

          {/* SEO */}
          <div className="bg-white border rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">SEO Settings</h3>

            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <textarea
              rows="3"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />

            <input
              className="w-full border rounded-lg px-3 py-2"
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

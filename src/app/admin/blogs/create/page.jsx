"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Bold, Italic, List, ListOrdered, Undo, Redo, Eye, 
  Save, Image as ImageIcon, Globe, Tag, Clock, AlignLeft, Info
} from "lucide-react";

/* ---------------- Rich Text Editor ---------------- */
function RichTextEditor({ value, onChange, placeholder }) {
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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm group focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-200 transition-all">
      <div className="flex gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
        <button type="button" onClick={() => exec("bold")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><Bold size={16} /></button>
        <button type="button" onClick={() => exec("italic")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><Italic size={16} /></button>
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
        <button type="button" onClick={() => exec("insertUnorderedList")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><List size={16} /></button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><ListOrdered size={16} /></button>
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
        <button type="button" onClick={() => exec("undo")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><Undo size={16} /></button>
        <button type="button" onClick={() => exec("redo")} className="p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all"><Redo size={16} /></button>
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={() => onChange(ref.current.innerHTML)}
        className="min-h-[400px] p-6 outline-none prose prose-lg max-w-none text-slate-700 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

/* ---------------- Create Blog Page ---------------- */
export default function CreateBlogPage() {
  const [categories, setCategories] = useState([]);

  // Core fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Status
  const [status, setStatus] = useState("draft");

  // SEO
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

  // Stats
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  // Save blog
  async function saveBlog() {
    setSaving(true);
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, slug, excerpt, content, featured_image: featuredImage, status,
        category_ids: categoryId ? [categoryId] : [],
        seo_title: seoTitle, seo_description: seoDescription, seo_keywords: seoKeywords,
      }),
    });
    setSaving(false);
    if (!res.ok) { alert("Error saving blog"); return; }
    window.location.href = "/admin/blogs";
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Writing Header */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm/50 backdrop-blur-md bg-white/90 support-[backdrop-filter]:bg-white/50">
         <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">New Article</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {status}
            </span>
         </div>
         <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-4 mr-4 text-xs font-medium text-slate-500">
               <span className="flex items-center gap-1"><AlignLeft size={14} /> {wordCount} words</span>
               <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min read</span>
             </div>
             <button onClick={saveBlog} disabled={saving} className="bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? "Saving..." : <><Save size={18} /> Publish</>}
             </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        
        {/* Main Editor */}
        <div className="space-y-6">
           {/* Title & Slug */}
           <div className="space-y-2">
              <input
                className="w-full text-4xl font-extrabold outline-none bg-transparent placeholder:text-slate-300 text-slate-900 leading-tight"
                placeholder="Article Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/50 inline-block px-2 py-1 rounded">
                <Globe size={14} />
                <span>/blogs/{slug || "..."}</span>
              </div>
           </div>

           {/* Excerpt */}
           <textarea
             rows="2"
             className="w-full text-lg text-slate-600 outline-none bg-transparent resize-none placeholder:text-slate-300 italic"
             placeholder="Write a catchy subtitle or excerpt..."
             value={excerpt}
             onChange={(e) => setExcerpt(e.target.value)}
           />

           {/* Content */}
           <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your story..." />
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          
          {/* Status & Category */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
               Publishing
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">STATUS</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['draft', 'published'].map(s => (
                       <button
                         key={s}
                         onClick={() => setStatus(s)}
                         className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                           status === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                         }`}
                       >
                         {s}
                       </button>
                    ))}
                  </div>
               </div>

               <div>
                 <label className="block text-xs font-semibold text-slate-500 mb-2">CATEGORY</label>
                 <div className="relative">
                   <Tag size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   <select
                     className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500 appearance-none bg-white"
                     value={categoryId}
                     onChange={(e) => setCategoryId(e.target.value)}
                   >
                     <option value="">Select Category</option>
                     {categories.map((c) => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Featured Image</h3>
            <div className="space-y-3">
               <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                  {featuredImage ? (
                    <img src={featuredImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                      <span className="text-xs text-slate-400">Preview</span>
                    </div>
                  )}
               </div>
               <input
                 className="w-full text-xs border border-slate-200 rounded-lg p-2 outline-none focus:border-orange-500"
                 placeholder="Paste Image URL"
                 value={featuredImage}
                 onChange={(e) => setFeaturedImage(e.target.value)}
               />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Info size={14} /> SEO Meta
            </h3>
            <div className="space-y-3">
               <input
                 className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-orange-500"
                 placeholder="Meta Title"
                 value={seoTitle}
                 onChange={(e) => setSeoTitle(e.target.value)}
               />
               <textarea
                 rows="3"
                 className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-orange-500 resize-none"
                 placeholder="Meta Description"
                 value={seoDescription}
                 onChange={(e) => setSeoDescription(e.target.value)}
               />
               <input
                 className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-orange-500"
                 placeholder="Keywords (comma separated)"
                 value={seoKeywords}
                 onChange={(e) => setSeoKeywords(e.target.value)}
               />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";

/* ===============================
   CUSTOM RICH TEXT EDITOR
   =============================== */
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const execCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, html);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <button type="button" onClick={() => execCommand("bold")}><Bold size={16} /></button>
        <button type="button" onClick={() => execCommand("italic")}><Italic size={16} /></button>
        <button type="button" onClick={() => execCommand("insertUnorderedList")}><List size={16} /></button>
        <button type="button" onClick={() => execCommand("insertOrderedList")}><ListOrdered size={16} /></button>
        <button type="button" onClick={() => execCommand("undo")}><Undo size={16} /></button>
        <button type="button" onClick={() => execCommand("redo")}><Redo size={16} /></button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[160px] p-3 focus:outline-none"
      />
    </div>
  );
};

/* ===============================
   EDIT PACKAGE PAGE
   =============================== */
export default function EditPackagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pkg, setPkg] = useState(null);

  const [shortDescription, setShortDescription] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [inclusions, setInclusions] = useState("[]");
  const [exclusions, setExclusions] = useState("[]");

  // Fetch package
  useEffect(() => {
    if (!id) return;

    async function fetchPackage() {
      const res = await fetch(`/api/packages/${id}`);
      const json = await res.json();

      if (!json.package) {
        alert("Package not found");
        router.push("/admin/packages");
        return;
      }

      setPkg(json.package);
      setShortDescription(json.package.short_description || "");
      setItinerary(json.package.itinerary || "");
      setInclusions(JSON.stringify(json.package.inclusions || []));
      setExclusions(JSON.stringify(json.package.exclusions || []));
      setLoading(false);
    }

    fetchPackage();
  }, [id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    body.short_description = shortDescription;
    body.itinerary = itinerary;
    body.inclusions = JSON.parse(inclusions || "[]");
    body.exclusions = JSON.parse(exclusions || "[]");
    body.updated_at = new Date().toISOString();

    const res = await fetch(`/api/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.success) {
      alert("Package updated successfully");
      router.push("/admin/packages");
    } else {
      alert(json.error || "Update failed");
    }

    setSaving(false);
  }

  if (loading) {
    return <p className="p-6">Loading package...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Edit Package</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" defaultValue={pkg.title} className="w-full border p-2 rounded" />
        <input name="slug" defaultValue={pkg.slug} className="w-full border p-2 rounded" />
        <input name="banner_url" defaultValue={pkg.banner_url} className="w-full border p-2 rounded" />

        <div className="grid grid-cols-3 gap-3">
          <input name="price" type="number" defaultValue={pkg.price} className="border p-2 rounded" />
          <input name="duration" defaultValue={pkg.duration} className="border p-2 rounded" />
          <input name="location" defaultValue={pkg.location} className="border p-2 rounded" />
        </div>

        <div>
          <label className="font-medium">Short Description</label>
          <RichTextEditor value={shortDescription} onChange={setShortDescription} />
        </div>

        <div>
          <label className="font-medium">Itinerary</label>
          <RichTextEditor value={itinerary} onChange={setItinerary} />
        </div>

        <div>
          <label className="font-medium">Inclusions (JSON)</label>
          <textarea
            value={inclusions}
            onChange={(e) => setInclusions(e.target.value)}
            className="w-full border p-2 rounded min-h-[100px]"
          />
        </div>

        <div>
          <label className="font-medium">Exclusions (JSON)</label>
          <textarea
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
            className="w-full border p-2 rounded min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
}

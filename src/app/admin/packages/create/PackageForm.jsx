"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";

/* ---------- Rich Text Editor ---------- */
const RichTextEditor = ({ value, onChange }) => {
  const ref = useRef(null);

  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    ref.current?.focus();
  };

  const onInput = () => onChange(ref.current.innerHTML);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="border rounded bg-white">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
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
        onInput={onInput}
        className="min-h-[160px] p-3 outline-none"
      />
    </div>
  );
};

export default function PackageForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [shortDesc, setShortDesc] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    body.short_desc = shortDesc;
    body.itinerary = itinerary;
    body.inclusions = inclusions;
    body.exclusions = exclusions;

    const res = await fetch("/api/packages", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.success) {
      router.push("/admin/packages");
    } else {
      alert(json.error);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" required placeholder="Title" className="w-full border p-2 rounded" />
      <input name="slug" required placeholder="Slug" className="w-full border p-2 rounded" />
      <input name="banner_url" placeholder="Banner Image URL" className="w-full border p-2 rounded" />

      <div className="grid grid-cols-3 gap-3">
        <input name="price" type="number" placeholder="Price" className="border p-2 rounded" />
        <input name="days" type="number" placeholder="Days" className="border p-2 rounded" />
        <input name="destination" placeholder="Destination" className="border p-2 rounded" />
      </div>

      <RichTextEditor value={shortDesc} onChange={setShortDesc} />
      <RichTextEditor value={itinerary} onChange={setItinerary} />
      <RichTextEditor value={inclusions} onChange={setInclusions} />
      <RichTextEditor value={exclusions} onChange={setExclusions} />

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Create Package"}
      </button>
    </form>
  );
}

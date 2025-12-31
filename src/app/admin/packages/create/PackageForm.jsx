"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bold, Italic, List, ListOrdered, Undo, Redo, 
  Wifi, Car, Utensils, Plane, Hotel, MapPin, 
  Ticket, Bus, Anchor, Star, Info, Check, Image as ImageIcon,
  Loader2, Eye
} from "lucide-react";

/* ---------- AMENITY PRESETS ---------- */
const PRESET_AMENITIES = [
  { icon: Wifi, label: "Wifi" },
  { icon: Car, label: "Parking" },
  { icon: Utensils, label: "Meals" },
  { icon: Bus, label: "Transport" },
  { icon: Plane, label: "Flights" },
  { icon: Hotel, label: "Hotel Stay" },
  { icon: Ticket, label: "Tickets" },
  { icon: MapPin, label: "Guide" },
  { icon: Anchor, label: "Cruise" },
  { icon: Star, label: "Sightseeing" },
];

/* ---------- Rich Text Editor ---------- */
const RichTextEditor = ({ value, onChange, label, className }) => {
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
    <div className={`border border-slate-200 rounded-lg bg-white overflow-hidden ${className}`}>
      {label && <div className="p-3 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-700">{label}</div>}
      <div className="flex gap-1 p-2 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button type="button" onClick={() => exec("bold")} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Bold size={16} /></button>
        <button type="button" onClick={() => exec("italic")} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Italic size={16} /></button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><List size={16} /></button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ListOrdered size={16} /></button>
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={() => onChange(ref.current.innerHTML)}
        className="min-h-[160px] p-4 outline-none prose prose-sm max-w-none focus:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

/* ---------- Package Form ---------- */
export default function PackageForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [shortDesc, setShortDesc] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  
  // Live Preview State (for numeric/text fields)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    days: "",
    destination: "",
    banner_url: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Amenity
  const toggleInclusion = (label) => {
    setInclusions(prev => 
      prev.includes(label) 
        ? prev.filter(i => i !== label)
        : [...prev, label]
    );
  };

  // Numeric Inclusion Input
  const [customInc, setCustomInc] = useState("");
  const addCustomInclusion = (e) => {
    if (e.key === "Enter" && customInc.trim()) {
      e.preventDefault();
      if (!inclusions.includes(customInc.trim())) {
        setInclusions([...inclusions, customInc.trim()]);
      }
      setCustomInc("");
    }
  };

  // Exclusions Input
  const [customExc, setCustomExc] = useState("");
  const addExclusion = (e) => {
    if (e.key === "Enter" && customExc.trim()) {
      e.preventDefault();
      if (!exclusions.includes(customExc.trim())) {
        setExclusions([...exclusions, customExc.trim()]);
      }
      setCustomExc("");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...formData,
      short_desc: shortDesc,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
    };

    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.success) {
      router.push("/admin/packages");
    } else {
      alert(json.error || "Failed to create package");
    }

    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 pb-20">
      {/* Form Area */}
      <form id="pkg-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Info size={18} className="text-orange-500" /> Basic Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Title</label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Magical Maldives Honeymoon"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="magical-maldives"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                <input
                  name="destination"
                  required
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Maldives"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Banner Image URL</label>
              <div className="flex gap-2">
                 <div className="bg-slate-100 p-2.5 rounded-l-lg border border-r-0 border-slate-300 text-slate-500">
                    <ImageIcon size={20} />
                 </div>
                 <input
                  name="banner_url"
                  value={formData.banner_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-r-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Duration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <Ticket size={18} className="text-orange-500" /> Pricing & Duration
          </h2>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-mono"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days)</label>
                <input
                  name="days"
                  type="number"
                  required
                  value={formData.days}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
             </div>
          </div>
        </div>

        {/* Section 3: Inclusions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <Check size={18} className="text-green-500" /> Inclusions
          </h2>
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-2">Popular Amenities</label>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
               {PRESET_AMENITIES.map((item) => {
                 const isSelected = inclusions.includes(item.label);
                 const Icon = item.icon;
                 return (
                   <button
                     key={item.label}
                     type="button"
                     onClick={() => toggleInclusion(item.label)}
                     className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                       isSelected 
                         ? "bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200" 
                         : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                     }`}
                   >
                     <Icon size={16} className={isSelected ? "text-orange-500" : "text-slate-400"} />
                     {item.label}
                   </button>
                 )
               })}
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Custom Inclusions (Press Enter)</label>
             <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[50px]">
                {inclusions.filter(i => !PRESET_AMENITIES.find(p => p.label === i)).map((inc, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm">
                    {inc}
                    <button type="button" onClick={() => setInclusions(inclusions.filter(i => i !== inc))} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
                <input 
                  value={customInc}
                  onChange={(e) => setCustomInc(e.target.value)}
                  onKeyDown={addCustomInclusion}
                  placeholder="+ Add custom (e.g. 3 Nights)"
                  className="bg-transparent outline-none text-sm min-w-[150px] flex-1"
                />
             </div>
          </div>
        </div>

        {/* Section 4: Exclusions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 text-red-600 flex items-center gap-2">
             Exclusions
          </h2>
          <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[50px]">
              {exclusions.map((exc, idx) => (
                <span key={idx} className="bg-red-50 border border-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {exc}
                  <button type="button" onClick={() => setExclusions(exclusions.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 font-bold">×</button>
                </span>
              ))}
              <input 
                value={customExc}
                onChange={(e) => setCustomExc(e.target.value)}
                onKeyDown={addExclusion}
                placeholder="+ Add exclusion (e.g. Flight Tickets)"
                className="bg-transparent outline-none text-sm min-w-[150px] flex-1"
              />
           </div>
        </div>

        {/* Section 5: Content */}
        <div className="space-y-6">
           <RichTextEditor label="Short Description (Overview)" value={shortDesc} onChange={setShortDesc} className="shadow-sm" />
           <RichTextEditor label="Detailed Itinerary" value={itinerary} onChange={setItinerary} className="shadow-sm" />
        </div>

      </form>

      {/* Preview Area (Sticky) */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Preview</h3>
           
           {/* Card Preview */}
           <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden group">
              <div className="relative h-48 w-full bg-slate-100">
                 {formData.banner_url ? (
                   <img src={formData.banner_url} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex items-center justify-center h-full text-slate-300">
                     <ImageIcon size={48} />
                   </div>
                 )}
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                    {formData.days || "N/A"} Days
                 </div>
              </div>
              <div className="p-4">
                 <div className="text-xs font-medium text-orange-500 mb-1">{formData.destination || "Destination"}</div>
                 <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">
                   {formData.title || "Package Title"}
                 </h3>
                 <div className="flex flex-wrap gap-2 mb-4">
                   {inclusions.slice(0, 4).map((inc, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                        {inc}
                      </span>
                   ))}
                   {inclusions.length > 4 && <span className="text-[10px] text-slate-400">+{inclusions.length - 4} more</span>}
                 </div>
                 <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="text-slate-500 text-xs">Starting from</div>
                    <div className="text-xl font-bold text-slate-900">₹{formData.price || "0"}</div>
                 </div>
              </div>
           </div>

           {/* Actions */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <button
                type="submit"
                form="pkg-form"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Published Package"}
              </button>
              <button
                 type="button"
                 onClick={() => router.back()}
                 className="w-full bg-white border border-slate-200 text-slate-600 font-medium py-3 rounded-lg hover:bg-slate-50"
              >
                 Cancel
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

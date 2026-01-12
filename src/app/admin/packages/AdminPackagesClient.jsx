"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  MapPin, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search,
  Edit,
  Trash2
} from "lucide-react";

export default function AdminPackagesClient() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetch("/api/packages");
        const json = await res.json();
        setPackages(json.packages || []);
      } catch (err) {
        console.error("Failed to load packages", err);
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  const deletePackage = async (id) => {
    const ok = confirm("Delete this package permanently?");
    if (!ok) return;

    const res = await fetch(`/api/packages/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (json.success) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(json.error || "Failed to delete package");
    }
  };

  const filtered = packages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trip Packages</h1>
          <p className="text-slate-500 text-sm">Manage your travel itineraries and offerings</p>
        </div>
        <Link 
          href="/admin/packages/create" 
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm shadow-orange-200"
        >
          <Plus className="w-4 h-4" /> Add Package
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search packages by name or location..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Loading State */}
        {loading && [1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
             <div className="h-40 bg-slate-100 rounded-lg mb-4"></div>
             <div className="h-4 bg-slate-100 w-3/4 rounded mb-2"></div>
             <div className="h-3 bg-slate-100 w-1/2 rounded"></div>
          </div>
        ))}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
             <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 font-medium">No packages found</p>
          </div>
        )}

        {/* Package Cards */}
        {!loading && filtered.map((pkg) => (
          <div key={pkg.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300">
            {/* Image Placeholder */}
            <div className="aspect-video bg-slate-100 relative group-hover:opacity-90 transition">
               {pkg.images && pkg.images[0] ? (
                 <img src={pkg.images[0]} alt={pkg.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="flex items-center justify-center w-full h-full text-slate-300">
                    <Package className="w-10 h-10 opacity-50" />
                 </div>
               )}
               <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold text-slate-900 shadow-sm">
                  ₹{parseInt(pkg.price).toLocaleString()}
               </div>
            </div>

            <div className="p-4">
               <div className="mb-3">
                 <h3 className="font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-orange-600 transition">{pkg.title}</h3>
                 <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pkg.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.duration}</span>
                 </div>
               </div>
               
               <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Created {new Date(pkg.created_at).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                     <Link href={`/admin/packages/edit/${pkg.id}`} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition">
                        <Edit className="w-4 h-4" />
                     </Link>
                     <button onClick={() => deletePackage(pkg.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

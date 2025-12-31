"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Eye 
} from "lucide-react";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadDestinations() {
    setLoading(true);
    try {
      const res = await fetch("/api/destinations");
      const json = await res.json();
      if (json.success) {
        setDestinations(json.destinations || []);
      }
    } catch (err) {
      console.error("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  async function deleteDestination(id) {
    const ok = confirm("Delete this destination permanently?");
    if (!ok) return;

    const res = await fetch(`/api/destinations/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (json.success) {
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert("Failed to delete destination");
    }
  }

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
          <p className="text-slate-500 text-sm">Manage SEO landing pages and locations</p>
        </div>
        <Link
          href="/admin/destinations/create"
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm shadow-orange-200"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200">
           <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search destinations..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
             />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                 <tr><td colSpan="5" className="p-12 text-center text-slate-500">Loading destinations...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                 <tr><td colSpan="5" className="p-12 text-center text-slate-500">No destinations found.</td></tr>
              )}
              {!loading && filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{d.name}</div>
                        <div className="text-xs text-slate-500">/{d.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${d.status === 'active' || d.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {d.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                       <span className={d.show_in_footer ? "text-emerald-600 font-medium" : "text-slate-400"}>
                          {d.show_in_footer ? "Footer Visible" : "Hidden"}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                     {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                          href={`/destination/${d.slug}`} 
                          target="_blank"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                       >
                          <Globe className="w-4 h-4" />
                       </Link>
                       <Link 
                          href={`/admin/destinations/edit/${d.id}`} 
                          className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition"
                       >
                          <Edit className="w-4 h-4" />
                       </Link>
                       <button 
                          onClick={() => deleteDestination(d.id)} 
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

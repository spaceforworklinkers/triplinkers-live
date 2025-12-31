"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Trash2,
  Pencil,
  X,
  Phone,
  Mail,
  Copy,
  MessageCircle,
  Search,
  Filter,
  MoreVertical,
  ChevronDown
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);
  const [copied, setCopied] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  async function loadLeads() {
    setLoading(true);
    const res = await fetch(`/api/leads`, {
      cache: "no-store",
      credentials: "include",
    });
    const json = await res.json();
    setLeads(json.leads || []);
    setLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function updateStatus(id, status) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status } : l
      )
    );
  }

  async function deleteLead(id) {
    if (!confirm("Delete this lead permanently?")) return;

    await fetch(`/api/leads/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setLeads((prev) => prev.filter((l) => l.id !== id));

    if (activeLead?.id === id) {
      setActiveLead(null);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1200);
  }

  const filteredLeads = filterStatus === "all" 
    ? leads 
    : leads.filter(l => l.status === filterStatus);

  const statusCount = (status) => leads.filter((l) => l.status === status).length;

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-orange-100 text-orange-700",
    converted: "bg-emerald-100 text-emerald-700",
    not_interested: "bg-slate-100 text-slate-600",
  };

  return (
    <>
      {/* Header & Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
            <p className="text-slate-500 text-sm">Track and manage customer inquiries</p>
          </div>
          <button onClick={loadLeads} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Leads" value={leads.length} icon={Filter} active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
          <StatCard title="New" value={statusCount("new")} color="bg-blue-50 text-blue-700" active={filterStatus === 'new'} onClick={() => setFilterStatus('new')} />
          <StatCard title="Contacted" value={statusCount("contacted")} color="bg-orange-50 text-orange-700" active={filterStatus === 'contacted'} onClick={() => setFilterStatus('contacted')} />
          <StatCard title="Converted" value={statusCount("converted")} color="bg-emerald-50 text-emerald-700" active={filterStatus === 'converted'} onClick={() => setFilterStatus('converted')} />
          <StatCard title="Archived" value={statusCount("not_interested")} color="bg-slate-50 text-slate-600" active={filterStatus === 'not_interested'} onClick={() => setFilterStatus('not_interested')} />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Trip Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">Loading leads...</td>
                </tr>
              )}
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">No leads found matching your criteria.</td>
                </tr>
              )}
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500">ID: #{lead.id.slice(0, 6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer" onClick={() => handleCopy(lead.email)}>
                        <Mail className="w-3.5 h-3.5 opacity-70" /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer" onClick={() => handleCopy(lead.phone)}>
                        <Phone className="w-3.5 h-3.5 opacity-70" /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{lead.destination}</div>
                    <div className="text-xs text-slate-500">{lead.budget || "No budget"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border-none focus:ring-0 ${statusColors[lead.status] || "bg-gray-100"}`}
                    >
                      <option value="new">New Inquiry</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => setActiveLead(lead)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                          <Eye className="w-4 h-4" />
                       </button>
                       <Link href={`/admin/leads/edit/${lead.id}`} className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition">
                          <Pencil className="w-4 h-4" />
                       </Link>
                       <button onClick={() => deleteLead(lead.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
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

      {/* Detail Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end" onClick={() => setActiveLead(null)}>
          <div className="h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl p-0 animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">{activeLead.name}</h2>
                   <p className="text-sm text-slate-500">Status: {activeLead.status}</p>
                </div>
                <button onClick={() => setActiveLead(null)} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Section title="Contact Information">
                   <Row icon={Mail} label="Email" value={activeLead.email} onCopy={() => handleCopy(activeLead.email)} copied={copied === activeLead.email} />
                   <Row icon={Phone} label="Phone" value={activeLead.phone} onCopy={() => handleCopy(activeLead.phone)} copied={copied === activeLead.phone} />
                   <a href={`https://wa.me/91${activeLead.phone}`} target="_blank" className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition">
                      <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                   </a>
                </Section>
                <Section title="Trip Requirements">
                   <Row label="Destination" value={activeLead.destination} />
                   <Row label="Budget" value={activeLead.budget} />
                </Section>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                 <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
                    Send Follow-up Email
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({ title, value, color, active, onClick }) {
  return (
    <div onClick={onClick} className={`p-4 rounded-xl border transition cursor-pointer ${active ? 'bg-white border-orange-500 ring-1 ring-orange-500' : 'bg-white border-slate-200 hover:border-orange-300'}`}>
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <div className="flex items-center justify-between">
         <span className="text-2xl font-bold text-slate-900">{value}</span>
         {color && <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-').split(' ')[0]}`}></div>}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
       <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">{title}</h3>
       <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        {Icon && <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400"><Icon className="w-4 h-4" /></div>}
        <div>
           <p className="text-xs text-slate-400">{label}</p>
           <p className="text-sm font-medium text-slate-900">{value || "N/A"}</p>
        </div>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-xs text-slate-400 hover:text-orange-600 transition opacity-0 group-hover:opacity-100">{copied ? "Copied!" : "Copy"}</button>
      )}
    </div>
  );
}

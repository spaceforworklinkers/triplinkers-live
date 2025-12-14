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
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);
  const [copied, setCopied] = useState("");

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

  // ✅ FIXED: no table reload
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

  // ✅ FIXED: no table reload
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

  const statusCount = (status) =>
    leads.filter((l) => l.status === status).length;

  const statusBadge = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    converted: "bg-green-100 text-green-700",
    not_interested: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-semibold mb-6">Leads Dashboard</h1>

      {/* COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Leads" value={leads.length} />
        <StatCard title="New" value={statusCount("new")} color="blue" />
        <StatCard title="Contacted" value={statusCount("contacted")} color="yellow" />
        <StatCard title="Converted" value={statusCount("converted")} color="green" />
        <StatCard title="Not Interested" value={statusCount("not_interested")} color="red" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Phone", "Destination", "Budget", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="p-4 border text-left font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center">Loading...</td>
              </tr>
            )}

            {!loading &&
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-4 border font-medium">{lead.name}</td>
                  <td className="p-4 border">{lead.email}</td>
                  <td className="p-4 border">{lead.phone}</td>
                  <td className="p-4 border">{lead.destination}</td>
                  <td className="p-4 border">{lead.budget}</td>

                  <td className="p-4 border">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${statusBadge[lead.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </td>

                  <td className="p-4 border">
                    <div className="flex gap-3 items-center">
                      <Eye
                        size={18}
                        className="text-blue-600 cursor-pointer"
                        onClick={() => setActiveLead(lead)}
                      />
                      <Link href={`/admin/leads/edit/${lead.id}`}>
                        <Pencil size={18} className="text-indigo-600 cursor-pointer" />
                      </Link>
                      <Trash2
                        size={18}
                        className="text-red-600 cursor-pointer"
                        onClick={() => deleteLead(lead.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {activeLead && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          onClick={() => setActiveLead(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <X
              size={20}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setActiveLead(null)}
            />

            <h2 className="text-2xl font-semibold mb-4">{activeLead.name}</h2>

            <Row icon={<Mail size={16} />} value={activeLead.email} onCopy={() => handleCopy(activeLead.email)} copied={copied === activeLead.email} />
            <Row icon={<Phone size={16} />} value={activeLead.phone} onCopy={() => handleCopy(activeLead.phone)} copied={copied === activeLead.phone} />

            <a
              href={`https://wa.me/91${activeLead.phone}`}
              target="_blank"
              className="flex items-center gap-2 text-green-600 text-sm mt-3 cursor-pointer"
            >
              <MessageCircle size={16} /> WhatsApp Chat
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    green: "text-green-700",
    red: "text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-semibold ${colors[color] || ""}`}>
        {value}
      </p>
    </div>
  );
}

function Row({ icon, value, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-gray-800 text-sm">
        {icon}
        {value}
      </div>
      <div
        onClick={onCopy}
        className="flex items-center gap-1 text-xs cursor-pointer text-gray-500 hover:text-gray-800"
      >
        <Copy size={14} />
        {copied && "Copied"}
      </div>
    </div>
  );
}

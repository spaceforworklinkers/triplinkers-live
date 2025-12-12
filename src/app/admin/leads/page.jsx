"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function StatusBadge({ status }) {
  const colors = {
    new: "bg-gray-200 text-gray-700",
    contacted: "bg-blue-200 text-blue-700",
    converted: "bg-green-200 text-green-700",
    not_interested: "bg-red-200 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.new}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    destination: "",
    budget: "",
  });

  // Fetch leads from API
  async function loadLeads() {
    setLoading(true);

    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/leads?${params}`, { cache: "no-store" });

    const json = await res.json();
    setLeads(json.leads || []);

    setLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  // Handle status update
  async function updateStatus(leadId, newStatus) {
    await fetch(`/api/leads/status`, {
      method: "POST",
      body: JSON.stringify({ id: leadId, status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });

    loadLeads(); // reload table
  }

  // Handle delete
  async function deleteLead(id) {
    if (!confirm("Delete this lead permanently?")) return;

    await fetch(`/api/leads/delete?id=${id}`, {
      method: "POST",
    });

    loadLeads();
  }

  // Handle search + filters
  async function applyFilters(e) {
    e.preventDefault();
    loadLeads();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">Leads Dashboard</h1>

      {/* Filters */}
      <form onSubmit={applyFilters} className="flex gap-3 mb-6 bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Search name, email, phone"
          className="px-3 py-2 border rounded-md"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="px-3 py-2 border rounded-md"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="not_interested">Not Interested</option>
        </select>

        <input
          placeholder="Destination"
          className="px-3 py-2 border rounded-md"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
        />

        <input
          placeholder="Budget"
          className="px-3 py-2 border rounded-md"
          value={filters.budget}
          onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
        />

        <button className="px-4 py-2 bg-orange-600 text-white rounded-md">Filter</button>
      </form>

      {/* Leads Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl p-4 border">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Days</th>
              <th className="p-2 border">Travelers</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="10" className="text-center p-4">Loading...</td>
              </tr>
            )}

            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">No leads found</td>
              </tr>
            )}

            {!loading &&
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{lead.name}</td>
                  <td className="p-2 border">{lead.email}</td>
                  <td className="p-2 border">{lead.phone}</td>
                  <td className="p-2 border">{lead.from_city}</td>
                  <td className="p-2 border">{lead.destination}</td>
                  <td className="p-2 border">{lead.budget}</td>
                  <td className="p-2 border">{lead.days}</td>
                  <td className="p-2 border">{lead.travelers}</td>

                  <td className="p-2 border">
                    <select
                      className="border p-1 rounded"
                      value={lead.status || "new"}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </td>

                  <td className="p-2 border">
                    <div className="flex gap-2 text-xs">
                      <Link href={`/admin/leads/edit/${lead.id}`} className="text-blue-600">
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

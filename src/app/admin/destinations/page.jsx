"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDestinations() {
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

  if (loading) {
    return <p className="p-6">Loading destinations...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Destinations</h1>
        <Link
          href="/admin/destinations/create"
          className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm"
        >
          Add Destination
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Footer</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3 text-gray-500">{d.slug}</td>
                <td className="p-3 capitalize">{d.status}</td>
                <td className="p-3">
                  {d.show_in_footer ? "Yes" : "No"}
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(d.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right space-x-3">
                  <Link
                    href={`/admin/destinations/edit/${d.id}`}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDestination(d.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {destinations.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No destinations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

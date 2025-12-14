"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages
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

  // Delete package
  const deletePackage = async (id) => {
    const ok = confirm("Delete this package permanently?");
    if (!ok) return;

    const res = await fetch(`/api/packages/delete?id=${id}`, {
      method: "POST",
    });

    const json = await res.json();

    if (json.success) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(json.error || "Failed to delete package");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Packages</h1>

        <Link
          href="/admin/packages/create"
          className="px-4 py-2 bg-orange-600 text-white rounded-md"
        >
          + Add Package
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4 border">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Loading packages...
                </td>
              </tr>
            )}

            {!loading && packages.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No packages found
                </td>
              </tr>
            )}

            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="p-2 border">{pkg.title}</td>
                <td className="p-2 border">{pkg.location}</td>
                <td className="p-2 border">{pkg.duration}</td>
                <td className="p-2 border">₹{pkg.price}</td>
                <td className="p-2 border">
                  {new Date(pkg.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/packages/edit/${pkg.id}`}
                      className="text-yellow-600 text-xs"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deletePackage(pkg.id)}
                      className="text-red-600 text-xs"
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

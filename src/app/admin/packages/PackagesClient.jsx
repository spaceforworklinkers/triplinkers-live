"use client";

import Link from "next/link";

export default function PackagesClient({ packages }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border text-left">Location</th>
            <th className="p-3 border text-left">Duration</th>
            <th className="p-3 border text-left">Price</th>
            <th className="p-3 border text-left">Status</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {packages.length === 0 && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-500">
                No packages found
              </td>
            </tr>
          )}

          {packages.map((pkg) => (
            <tr key={pkg.id} className="hover:bg-gray-50">
              <td className="p-3 border">{pkg.title}</td>
              <td className="p-3 border">{pkg.location}</td>
              <td className="p-3 border">{pkg.duration} days</td>
              <td className="p-3 border">₹{pkg.price}</td>
              <td className="p-3 border">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  {pkg.status}
                </span>
              </td>
              <td className="p-3 border">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/packages/edit/${pkg.id}`}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

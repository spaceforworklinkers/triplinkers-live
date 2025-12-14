"use client";

import { useRouter } from "next/navigation";
import { useState, use } from "react";

export default function DeleteBlogPage({ params }) {
  const { id: blogId } = use(params); // ✅ Next.js 15 safe
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const res = await fetch(`/api/blogs/${blogId}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to delete blog");
      return;
    }

    alert("Blog deleted successfully");
    router.push("/admin/blogs");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md border w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Delete Blog</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this blog?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

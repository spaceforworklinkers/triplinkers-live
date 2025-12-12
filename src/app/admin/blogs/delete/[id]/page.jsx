"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBlogPage({ params }) {
  const router = useRouter();
  const blogId = params.id;
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    await fetch(`/api/admin/blogs/${blogId}`, {
      method: "DELETE",
    });

    setLoading(false);

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
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

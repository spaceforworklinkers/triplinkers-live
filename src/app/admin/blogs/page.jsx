import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export default async function BlogsPage() {
  const session = verifyAdminSession();

  if (!session.authenticated) {
    return null; // middleware handle redirect
  }

  // Fetch blogs + categories data
  const { data: blogs } = await supabaseAdmin
    .from("blogs")
    .select("id, title, slug, created_at, categories(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Blogs</h1>

        <Link
          href="/admin/blogs/create"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          + Create New Blog
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">Title</th>
              <th className="p-3 border text-left">Slug</th>
              <th className="p-3 border text-left">Category</th>
              <th className="p-3 border text-left">Created At</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs?.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}

            {blogs?.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="p-3 border">{blog.title}</td>
                <td className="p-3 border">{blog.slug}</td>
                <td className="p-3 border">
                  {blog.categories?.title || "Uncategorized"}
                </td>
                <td className="p-3 border">
                  {new Date(blog.created_at).toLocaleString()}
                </td>
                <td className="p-3 border">
                  <Link
                    href={`/admin/blogs/edit/${blog.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/admin/blogs/delete/${blog.id}`}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

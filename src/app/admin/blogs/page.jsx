import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const metadata = {
  title: "Blogs Management | Admin Dashboard",
  description: "Secure admin access for managing blog posts.",
};

export default async function BlogsPage() {
  const session = await verifyAdminSession();
  if (!session.authenticated) return null;

  const { data: blogs, error } = await supabaseAdmin
    .from("blogs")
    .select(`
      id,
      title,
      slug,
      status,
      created_at,
      blog_categories (
        categories (
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blogs:", error);
  }

  const totalBlogs = blogs?.length || 0;
  const activeBlogs =
    blogs?.filter((b) => b.status === "published").length || 0;
  const inactiveBlogs = totalBlogs - activeBlogs;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Blogs Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage published and draft blog content
          </p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition"
        >
          + Create Blog
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Blogs</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
            {totalBlogs}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <h3 className="text-3xl font-bold text-green-600 mt-1">
            {activeBlogs}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Inactive</p>
          <h3 className="text-3xl font-bold text-gray-600 mt-1">
            {inactiveBlogs}
          </h3>
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs?.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border">
            No blogs found
          </div>
        )}

        {blogs?.map((blog) => {
          const category =
            blog.blog_categories?.[0]?.categories?.name;
          const isPublished = blog.status === "published";

          return (
            <div
              key={blog.id}
              className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Content */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {blog.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {category && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                        {category}
                      </span>
                    )}

                    <span
                      className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium ${
                        isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isPublished
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      ></span>
                      {isPublished ? "Active" : "Inactive"}
                    </span>

                    <span className="text-gray-500">
                      {new Date(
                        blog.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  <Link
                    href={`/admin/blogs/edit/${blog.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border text-orange-600 hover:bg-orange-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <Link
                    href={`/admin/blogs/delete/${blog.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

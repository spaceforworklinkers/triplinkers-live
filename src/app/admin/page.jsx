import { verifyAdminSession } from "@/lib/adminAuth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = verifyAdminSession();

  if (!session.authenticated) {
    return null; // middleware will redirect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">
          Welcome, Admin
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/admin/leads"
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">Leads</h2>
            <p className="text-gray-500 text-sm">
              View all user submissions
            </p>
          </Link>

          <Link
            href="/admin/blogs"
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">Blogs</h2>
            <p className="text-gray-500 text-sm">
              Manage blog posts
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">Categories</h2>
            <p className="text-gray-500 text-sm">
              Manage blog categories
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

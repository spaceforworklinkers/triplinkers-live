"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your platform content and operations
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Leads */}
          <Link
            href="/admin/leads"
            className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                L
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
              Leads
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              View, update and convert customer leads
            </p>
          </Link>

          {/* Packages */}
          <Link
            href="/admin/packages"
            className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                P
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition">
              Packages
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create and manage travel packages
            </p>
          </Link>

          {/* Destinations */}
          <Link
            href="/admin/destinations"
            className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl font-bold">
                D
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-teal-600 transition">
              Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage SEO destinations and landing pages
            </p>
          </Link>

          {/* Blogs */}
          <Link
            href="/admin/blogs"
            className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
                B
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-purple-600 transition">
              Blogs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Publish and edit blog content
            </p>
          </Link>

          {/* Categories */}
          <Link
            href="/admin/categories"
            className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                C
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-orange-600 transition">
              Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Organize blog categories
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}

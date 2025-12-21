"use client";

import Link from "next/link";
import { Users, Package, MapPin, FileText, FolderOpen, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const menuItems = [
    {
      href: "/admin/leads",
      icon: Users,
      title: "Leads",
      description: "View, update and convert customer leads",
      stats: "248",
      label: "Active leads"
    },
    {
      href: "/admin/packages",
      icon: Package,
      title: "Packages",
      description: "Create and manage travel packages",
      stats: "42",
      label: "Live packages"
    },
    {
      href: "/admin/destinations",
      icon: MapPin,
      title: "Destinations",
      description: "Manage SEO destinations and landing pages",
      stats: "18",
      label: "Destinations"
    },
    {
      href: "/admin/blogs",
      icon: FileText,
      title: "Blogs",
      description: "Publish and edit blog content",
      stats: "156",
      label: "Published"
    },
    {
      href: "/admin/categories",
      icon: FolderOpen,
      title: "Categories",
      description: "Organize blog categories",
      stats: "12",
      label: "Categories"
    }
  ];

  return (
    <>
      <title>Admin Dashboard</title>
      <meta name="description" content="Manage your platform content and operations" />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          
          {/* Header */}
          <header className="mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-slate-600">Admin</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Dashboard
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl">
              Manage your platform content and operations
            </p>
          </header>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-slate-900 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200"
                >
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-slate-900 text-white group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-900 transition-colors duration-300">
                      <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{item.stats}</span>
                    <span className="text-sm text-slate-500">{item.label}</span>
                  </div>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl"></div>
                </Link>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">476</div>
                <div className="text-sm text-slate-600">Total items</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">94%</div>
                <div className="text-sm text-slate-600">Completion rate</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">2.4k</div>
                <div className="text-sm text-slate-600">Total views</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">18</div>
                <div className="text-sm text-slate-600">Active modules</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
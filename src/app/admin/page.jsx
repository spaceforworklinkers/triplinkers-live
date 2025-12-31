import Link from "next/link";
import { 
  Users, 
  Package, 
  MapPin, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  TrendingUp,
  FolderOpen
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';

async function getStats() {
  const [
    { count: leadsCount },
    { count: packagesCount },
    { count: destinationsCount },
    { count: blogsCount },
    { count: categoriesCount }
  ] = await Promise.all([
    supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('packages').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('destinations').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('blogs').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
  ]);

  return {
    leads: leadsCount || 0,
    packages: packagesCount || 0,
    destinations: destinationsCount || 0,
    blogs: blogsCount || 0,
    categories: categoriesCount || 0
  };
}

export default async function AdminDashboard() {
  const statsData = await getStats();

  const stats = [
    { label: "Total Leads", value: statsData.leads, change: "Live", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Packages", value: statsData.packages, change: "Live", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Destinations", value: statsData.destinations, change: "Live", icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Published Blogs", value: statsData.blogs, change: "Live", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/blogs/create" 
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            <Plus className="w-4 h-4" />
            Write Blog
          </Link>
          <Link 
            href="/admin/packages/create" 
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm shadow-orange-200"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder Chart/Activity Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Navigation</h3>
           <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/leads" className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
                <div>
                  <div className="font-semibold text-slate-900">Manage Leads</div>
                  <div className="text-xs text-slate-500">View and update status</div>
                </div>
              </Link>
              <Link href="/admin/packages" className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Package size={20} /></div>
                <div>
                  <div className="font-semibold text-slate-900">Manage Packages</div>
                  <div className="text-xs text-slate-500">Create & edit trips</div>
                </div>
              </Link>
              <Link href="/admin/destinations" className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <div className="font-semibold text-slate-900">Destinations</div>
                  <div className="text-xs text-slate-500">SEO Landing pages</div>
                </div>
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-100">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><FolderOpen size={20} /></div>
                <div>
                  <div className="font-semibold text-slate-900">Categories</div>
                  <div className="text-xs text-slate-500">Organize content</div>
                </div>
              </Link>
           </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
               <span className="text-sm font-medium text-slate-700">Database</span>
               <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Connected</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
               <span className="text-sm font-medium text-slate-700">API Latency</span>
               <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">24ms</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
               <span className="text-sm font-medium text-slate-700">Version</span>
               <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
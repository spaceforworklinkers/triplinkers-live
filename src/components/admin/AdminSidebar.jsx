"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Package, 
  MapPin, 
  FileText, 
  FolderOpen, 
  Settings,
  LogOut,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Leads", href: "/admin/leads", icon: Users },
    { title: "Packages", href: "/admin/packages", icon: Package },
    { title: "Destinations", href: "/admin/destinations", icon: MapPin },
    { title: "Blogs", href: "/admin/blogs", icon: FileText },
    { title: "Categories", href: "/admin/categories", icon: FolderOpen },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-gray-100 text-lg tracking-tight">
            <span>TripLinkers</span>
            <span className="text-orange-500">Admin</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 border-l-[3px]",
                  isActive 
                    ? "border-orange-500 bg-orange-500/10 text-gray-100" 
                    : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-gray-200"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-slate-400 group-hover:text-gray-200")} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Settings & User Profile */}
        <div className="border-t border-slate-800">
           {/* Settings Link */}
           <div className="p-2">
             <Link
               href="/admin/settings"
               className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-gray-200 hover:bg-slate-800 rounded-lg transition-colors"
             >
               <Settings className="w-5 h-5" />
               Settings
             </Link>
           </div>

           {/* User Profile */}
           <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                 <UserCircle className="w-6 h-6" />
               </div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-semibold text-gray-200 truncate">Admin User</div>
                 <div className="text-xs text-slate-500 truncate">Super Admin</div>
               </div>
               <button 
                 onClick={() => {
                   if(confirm("Logout?")) window.location.href = "/api/auth/logout"; 
                   // Note: Actual logout logic might differ, this is a placeholder action
                 }}
                 className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                 title="Logout"
               >
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
           </div>
        </div>
      </aside>
    </>
  );
}

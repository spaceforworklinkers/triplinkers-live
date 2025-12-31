"use client";

import { Menu, LogOut, User } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-slate-500 lg:hidden">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
             <User className="w-4 h-4 text-orange-600" />
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

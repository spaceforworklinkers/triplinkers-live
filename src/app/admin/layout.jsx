import AdminNavbar from "@/components/AdminNavbar";
import { Suspense } from "react";

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-slate-100">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </Suspense>
  );
}

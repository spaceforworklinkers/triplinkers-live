import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />
      <main className="p-6">{children}</main>
    </div>
  );
}

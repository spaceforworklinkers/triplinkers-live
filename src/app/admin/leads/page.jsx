import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

function StatusBadge({ status }) {
  const colors = {
    new: "bg-gray-200 text-gray-700",
    contacted: "bg-blue-200 text-blue-700",
    converted: "bg-green-200 text-green-700",
    not_interested: "bg-red-200 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.new}`}>
      {status ? status.replace("_", " ") : "new"}
    </span>
  );
}

export default async function LeadsPage({ searchParams }) {
  const session = verifyAdminSession();
  if (!session.authenticated) return null;

  // Read filters from query
  const page = Number(searchParams.page || 1);
  const q = (searchParams.search || "").trim();
  const status = searchParams.status || "";
  const destination = searchParams.destination || "";
  const budget = searchParams.budget || "";
  const limit = 12;
  const from = (page - 1) * limit;

  // Build supabase query
  let query = supabaseAdmin
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    // search by name, email, phone
    // Using ilike for simple fuzzy search
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (destination) {
    query = query.ilike("destination", `%${destination}%`);
  }

  if (budget) {
    query = query.ilike("budget", `%${budget}%`);
  }

  const { data: leads = [], count } = await query.range(from, from + limit - 1);

  const totalPages = Math.max(1, Math.ceil((count || 0) / limit));

  // Build query string for export link and pagination links
  const qs = (overrides = {}) => {
    const params = new URLSearchParams({
      ...(q ? { search: q } : {}),
      ...(status ? { status } : {}),
      ...(destination ? { destination } : {}),
      ...(budget ? { budget } : {}),
      ...(overrides.page ? { page: String(overrides.page) } : {}),
    });
    return `?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Leads Dashboard</h1>

        <div className="flex items-center gap-3">
          <form action="/admin/leads" method="GET" className="flex gap-2 items-center">
            <input
              name="search"
              defaultValue={q}
              placeholder="Search name, email, phone"
              className="px-3 py-2 border rounded-md text-sm"
            />
            <select name="status" defaultValue={status} className="px-3 py-2 border rounded-md text-sm">
              <option value="">All status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
            </select>

            <input name="destination" defaultValue={destination} placeholder="Destination" className="px-3 py-2 border rounded-md text-sm" />
            <input name="budget" defaultValue={budget} placeholder="Budget" className="px-3 py-2 border rounded-md text-sm" />

            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm">Filter</button>
          </form>

          <a
            href={`/api/admin/leads/export${qs({})}`}
            className="px-4 py-2 bg-white border rounded-md text-sm shadow hover:bg-gray-50"
            title="Export filtered leads as CSV"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4 border">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Days</th>
              <th className="p-2 border">Travellers</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-500">No leads found</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{lead.name}</td>
                  <td className="p-2 border">{lead.email}</td>
                  <td className="p-2 border">{lead.phone}</td>
                  <td className="p-2 border">{lead.from_city}</td>
                  <td className="p-2 border">{lead.destination}</td>
                  <td className="p-2 border">{lead.budget}</td>
                  <td className="p-2 border">{lead.days}</td>
                  <td className="p-2 border">{lead.travelers}</td>
                  <td className="p-2 border">
                    <StatusBadge status={lead.status || "new"} />
                  </td>
                  <td className="p-2 border">{new Date(lead.created_at).toLocaleString()}</td>

                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                     <form action={`/api/admin/leads/delete?id=${lead.id}`} method="POST">
  <button
    type="submit"
    className="text-red-600 text-xs"
    onClick={() => confirm("Delete this lead permanently?")}
  >
    Delete
  </button>
</form>


                      <Link href={`/admin/leads/edit/${lead.id}`} className="text-yellow-600 text-xs">Edit</Link>

                      <form
                        action={`/api/admin/leads/delete?id=${lead.id}`}
                        method="POST"
                        onSubmit={(e) => {
                          if (!confirm("Delete this lead permanently?")) e.preventDefault();
                        }}
                      >
                        <button type="submit" className="text-red-600 text-xs">Delete</button>
                      </form>

                      <Link href={`/admin/leads/notes?lead_id=${lead.id}`} className="text-gray-700 text-xs">Notes</Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/admin/leads${qs({ page: p })}`}
            className={`px-3 py-1 rounded-md border ${p === page ? "bg-orange-600 text-white" : "bg-white"}`}
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}

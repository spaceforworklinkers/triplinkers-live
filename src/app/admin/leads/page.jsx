import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export default async function LeadsPage() {
  const session = verifyAdminSession();

  if (!session.authenticated) {
    return null; // middleware redirect karega
  }

  // Fetch all leads
  const { data: leads } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-6">Leads</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-6 border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Email</th>
              <th className="p-3 border text-left">Destination</th>
              <th className="p-3 border text-left">Budget</th>
              <th className="p-3 border text-left">Trip Type</th>
              <th className="p-3 border text-left">Message</th>
              <th className="p-3 border text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {leads?.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6 text-gray-500"
                >
                  No leads found
                </td>
              </tr>
            )}

            {leads?.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="p-3 border">{lead.name}</td>
                <td className="p-3 border">{lead.email}</td>
                <td className="p-3 border">{lead.destination}</td>
                <td className="p-3 border">{lead.budget}</td>
                <td className="p-3 border">{lead.trip_type}</td>
                <td className="p-3 border">{lead.message}</td>
                <td className="p-3 border">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

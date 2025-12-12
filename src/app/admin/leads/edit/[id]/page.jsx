"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch lead by ID
  useEffect(() => {
    if (!id) return;

    async function loadLead() {
      const res = await fetch(`/api/leads/edit/${id}`);
      const json = await res.json();

      if (json.success && json.lead) {
        setLead(json.lead);
      }

      setLoading(false);
    }

    loadLead();
  }, [id]);

  if (loading) return <p className="p-6">Loading lead...</p>;
  if (!lead) return <p className="p-6 text-red-600">Lead not found</p>;

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = e.target;

    const body = {
      id: lead.id,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      from_city: form.from_city.value,
      destination: form.destination.value,
      budget: form.budget.value,
      days: form.days.value,
      travelers: form.travelers.value,
      status: form.status.value,
      message: form.message.value,
    };

    const res = await fetch("/api/leads/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      alert("Lead updated successfully");
      router.push("/admin/leads");
    } else {
      alert("Error updating lead: " + json.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Lead</h1>

      <form onSubmit={handleSave} className="space-y-4">

        <input className="w-full border p-2 rounded"
          name="name"
          defaultValue={lead.name}
          placeholder="Name"
          required
        />

        <input className="w-full border p-2 rounded"
          name="email"
          defaultValue={lead.email}
          placeholder="Email"
          required
        />

        <input className="w-full border p-2 rounded"
          name="phone"
          defaultValue={lead.phone}
          placeholder="Phone"
          required
        />

        <input className="w-full border p-2 rounded"
          name="from_city"
          defaultValue={lead.from_city}
          placeholder="From City"
        />

        <input className="w-full border p-2 rounded"
          name="destination"
          defaultValue={lead.destination}
          placeholder="Destination"
        />

        <input className="w-full border p-2 rounded"
          name="budget"
          defaultValue={lead.budget}
          placeholder="Budget"
        />

        <input className="w-full border p-2 rounded"
          name="days"
          defaultValue={lead.days}
          placeholder="Days"
          type="number"
        />

        <input className="w-full border p-2 rounded"
          name="travelers"
          defaultValue={lead.travelers}
          placeholder="Travelers"
          type="number"
        />

        <select
          name="status"
          defaultValue={lead.status || "new"}
          className="w-full border p-2 rounded"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="not_interested">Not Interested</option>
        </select>

        <textarea
          className="w-full border p-2 rounded"
          name="message"
          defaultValue={lead.message}
          placeholder="Message"
          rows="3"
        />

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 text-white rounded ${
            saving ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

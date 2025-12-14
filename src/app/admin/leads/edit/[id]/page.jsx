"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plane,
  IndianRupee,
  Users,
  Calendar,
  MessageSquare,
  Save,
  ArrowLeft,
} from "lucide-react";

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadLead() {
      const res = await fetch(`/api/leads/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) setLead(json.lead);
      setLoading(false);
    }

    loadLead();
  }, [id]);

  if (loading) return <p className="p-8 text-lg">Loading lead…</p>;
  if (!lead) return <p className="p-8 text-red-600">Lead not found</p>;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = e.target;

    const body = {
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

    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      alert("Lead updated successfully");
      router.push("/admin/leads");
    } else {
      alert(json.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Edit Lead</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update customer details and lead status
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* BASIC INFO */}
          <Section title="Basic Information">
            <Field icon={<User size={16} />} label="Name">
              <input name="name" defaultValue={lead.name} className="input" />
            </Field>

            <Field icon={<Mail size={16} />} label="Email">
              <input name="email" defaultValue={lead.email} className="input" />
            </Field>

            <Field icon={<Phone size={16} />} label="Phone">
              <input name="phone" defaultValue={lead.phone} className="input" />
            </Field>
          </Section>

          {/* TRAVEL DETAILS */}
          <Section title="Travel Details">
            <Field icon={<MapPin size={16} />} label="From City">
              <input
                name="from_city"
                defaultValue={lead.from_city}
                className="input"
              />
            </Field>

            <Field icon={<Plane size={16} />} label="Destination">
              <input
                name="destination"
                defaultValue={lead.destination}
                className="input"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field icon={<IndianRupee size={16} />} label="Budget">
                <input
                  name="budget"
                  defaultValue={lead.budget}
                  className="input"
                />
              </Field>

              <Field icon={<Calendar size={16} />} label="Days">
                <input
                  name="days"
                  type="number"
                  defaultValue={lead.days}
                  className="input"
                />
              </Field>

              <Field icon={<Users size={16} />} label="Travelers">
                <input
                  name="travelers"
                  type="number"
                  defaultValue={lead.travelers}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* STATUS */}
          <Section title="Lead Status">
            <select
              name="status"
              defaultValue={lead.status || "new"}
              className="input cursor-pointer"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </Section>

          {/* MESSAGE */}
          <Section title="Customer Message">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
              <MessageSquare size={16} />
              Message
            </label>
            <textarea
              name="message"
              defaultValue={lead.message}
              placeholder="Customer requirements, notes, preferences…"
              className="textarea"
            />
          </Section>

          {/* ACTION */}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded text-white font-medium cursor-pointer ${
                saving
                  ? "bg-orange-300"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* LOCAL STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.95rem;
        }
        .input:focus {
          outline: none;
          border-color: #fb923c;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.2);
        }
        .textarea {
          width: 100%;
          min-height: 140px;
          border: 1.5px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.95rem;
          resize: vertical;
        }
        .textarea:focus {
          outline: none;
          border-color: #fb923c;
          box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.25);
        }
      `}</style>
    </div>
  );
}

/* UI HELPERS */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

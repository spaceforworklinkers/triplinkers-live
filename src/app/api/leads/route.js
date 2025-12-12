import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — Fetch all leads
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const destination = url.searchParams.get("destination") || "";
    const budget = url.searchParams.get("budget") || "";

    let query = supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    // Search filter
    if (search) {
      const like = `%${search}%`;
      query = query.or(
        `name.ilike.${like},email.ilike.${like},phone.ilike.${like}`
      );
    }

    // Status filter
    if (status) query = query.eq("status", status);

    // Destination filter
    if (destination) query = query.ilike("destination", `%${destination}%`);

    // Budget filter
    if (budget) query = query.ilike("budget", `%${budget}%`);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, leads: data });
  } catch (err) {
    console.error("GET LEADS ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST — Create new lead
export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, phone, from, destination, days, travelers, budget, message } = body;

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          from_city: from,
          destination,
          days,
          travelers,
          budget,
          message,
        },
      ])
      .select();

    if (error) {
      console.error("LEAD INSERT ERROR:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, lead: data[0] });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

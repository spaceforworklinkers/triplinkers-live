import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — Fetch all leads (Admin)
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

    if (search) {
      const like = `%${search}%`;
      query = query.or(
        `name.ilike.${like},email.ilike.${like},phone.ilike.${like}`
      );
    }

    if (status) query = query.eq("status", status);
    if (destination) query = query.ilike("destination", `%${destination}%`);
    if (budget) query = query.ilike("budget", `%${budget}%`);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, leads: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST — Save lead only (ALL FORMS)
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      from,
      destination,
      days,
      travelers,
      budget,
      message,
      source = "Website",
    } = body;

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
          source,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

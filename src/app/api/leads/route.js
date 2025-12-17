import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

/* =========================
   GET — Fetch all leads (Admin)
========================= */
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
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, leads: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================
   POST — Save lead (Forms + TripBot)
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    /* ---------- Normal form fields ---------- */
    const {
      name = null,
      email = null,
      phone = null,
      from = null,
      destination = null,
      days = null,
      travelers = null,
      budget = null,
      message = null,

      /* ---------- Chatbot specific ---------- */
      answers = null,
      lead_action = null,

      source = "Website",
    } = body;

    const insertPayload = {
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
    };

    /* If this is TripBot lead, attach chatbot data */
    if (source === "trip_bot") {
      insertPayload.answers = answers;
      insertPayload.lead_action = lead_action;
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

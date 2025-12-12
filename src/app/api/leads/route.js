import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

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

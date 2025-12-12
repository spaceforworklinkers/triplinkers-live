import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      email,
      phone,
      from_city,
      destination,
      days,
      travelers,
      budget,
      status,
      message,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({
        name,
        email,
        phone,
        from_city,
        destination,
        days,
        travelers,
        budget,
        status,
        message,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("LEAD UPDATE ERROR:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, lead: data[0] });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET single lead by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    console.error("Lead fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

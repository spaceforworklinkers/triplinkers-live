import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("*")
      .limit(1);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return NextResponse.json({ ok: false, error: error.message });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.log("SERVER ERROR:", err);
    return NextResponse.json({ ok: false, error: "Server crash" });
  }
}

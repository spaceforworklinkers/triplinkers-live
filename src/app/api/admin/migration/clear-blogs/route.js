import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // 1. Delete all existing blogs
    const { error: deleteError } = await supabaseAdmin
      .from("blogs")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: "All existing blogs have been deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

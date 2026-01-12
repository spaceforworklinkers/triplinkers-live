import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || 50;

    const { data: subcategories, error } = await supabaseAdmin
      .from("subcategories")
      .select("*")
      .limit(parseInt(limit));

    if (error) throw error;

    return NextResponse.json({ success: true, subcategories });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("subcategories")
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, subcategory: data[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

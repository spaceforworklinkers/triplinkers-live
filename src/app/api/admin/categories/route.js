import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — Fetch all categories
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

// POST — Create category
export async function POST(req) {
  try {
    const { title, slug } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ title, slug }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, category: data[0] });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

// DELETE — Delete a category
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Category ID missing" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

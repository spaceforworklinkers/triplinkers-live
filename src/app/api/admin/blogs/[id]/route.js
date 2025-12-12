import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — Get single blog by ID
export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ blog: data });
}

// PUT — Update blog
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const { title, slug, category_id, banner_url, description, content } = body;

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .update({
      title,
      slug,
      category_id,
      banner_url,
      description,
      content,
    })
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, blog: data[0] });
}

// DELETE — Delete blog
export async function DELETE(req, { params }) {
  const { id } = params;

  const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

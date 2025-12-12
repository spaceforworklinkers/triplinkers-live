import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — Fetch all blogs
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*, categories(title)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogs: data });
}

// POST — Create a blog
export async function POST(req) {
  try {
    const {
      title,
      slug,
      category_id,
      banner_url,
      description,
      content,
    } = await req.json();

    // Insert blog
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .insert([
        {
          title,
          slug,
          category_id,
          banner_url,
          description,
          content,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, blog: data[0] });
  } catch {
    return NextResponse.json(
      { error: "Invalid blog data" },
      { status: 400 }
    );
  }
}

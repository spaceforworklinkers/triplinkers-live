import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateUniqueSlug } from "@/lib/slugify";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("destinations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, destinations: data });
}

export async function POST(req) {
  try {
    const body = await req.json();

    /* ---------------------------------
       Ensure unique slug (SERVER SIDE)
    ---------------------------------- */
    const finalSlug = await generateUniqueSlug({
      supabase: supabaseAdmin,
      table: "destinations",
      slug: body.slug,
    });

    const payload = {
      ...body,
      slug: finalSlug,
    };

    const { data, error } = await supabaseAdmin
      .from("destinations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, destination: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Invalid request body" },
      { status: 400 }
    );
  }
}

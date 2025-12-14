import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — fetch all packages
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ packages: data });
}

// POST — create a package
export async function POST(req) {
  try {
    const body = await req.json();

    // 🔥 map frontend → database correctly
    const {
      title,
      slug,
      banner_url,
      price,
      days,              // from form
      destination,       // from form
      short_desc,        // from form
      itinerary,
      inclusions,
      exclusions,
      status,
    } = body;

    // basic validation
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("packages")
      .insert([
        {
          title,
          slug,
          banner_url: banner_url || null,
          price: price ? Number(price) : null,
          duration: days ? Number(days) : null,          // ✅ FIXED
          location: destination || null,                 // ✅ FIXED
          short_description: short_desc || null,         // ✅ FIXED
          itinerary: itinerary || null,
          inclusions: inclusions || null,
          exclusions: exclusions || null,
          status: status || "active",
        },
      ])
      .select()
      .single();

    if (error) {
      // handle duplicate slug clearly
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Slug already exists. Use a different slug." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      package: data,
    });
  } catch (err) {
    console.error("PACKAGE CREATE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Invalid package data" },
      { status: 400 }
    );
  }
}

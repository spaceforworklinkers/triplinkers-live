import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

/* ===============================
   GET — fetch packages with filters
================================ */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minDays = searchParams.get("minDays");
    const maxDays = searchParams.get("maxDays");
    const location = searchParams.get("location"); // ✅ ADDED

    let query = supabaseAdmin
      .from("packages")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // PRICE FILTERS (INR)
    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    // DURATION FILTERS (days)
    if (minDays) {
      query = query.gte("duration", Number(minDays));
    }
    if (maxDays) {
      query = query.lte("duration", Number(maxDays));
    }

    // LOCATION FILTER ✅
    if (location) {
      query = query.eq("location", location);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ packages: data });
  } catch (err) {
    console.error("PACKAGE FILTER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

/* ===============================
   POST — create a package
================================ */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      banner_url,
      price,
      days,
      destination,
      short_desc,
      itinerary,
      inclusions,
      exclusions,
      status,
    } = body;

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
          duration: days ? Number(days) : null,
          location: destination || null,
          short_description: short_desc || null,
          itinerary: itinerary || null,
          inclusions: inclusions || null,
          exclusions: exclusions || null,
          status: status || "active",
        },
      ])
      .select()
      .single();

    if (error) {
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

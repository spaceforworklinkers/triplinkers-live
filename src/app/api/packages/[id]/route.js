import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET — fetch packages with optional filters
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const destination = searchParams.get("destination");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minDays = searchParams.get("minDays");
    const maxDays = searchParams.get("maxDays");
    const status = searchParams.get("status");

    let query = supabaseAdmin
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters safely
    if (destination) {
      query = query.ilike("location", `%${destination}%`);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    if (minDays) {
      query = query.gte("duration", Number(minDays));
    }

    if (maxDays) {
      query = query.lte("duration", Number(maxDays));
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
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST — create a package
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
          inclusions: inclusions || [],
          exclusions: exclusions || [],
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
    return NextResponse.json(
      { error: err.message || "Invalid package data" },
      { status: 400 }
    );
  }
}

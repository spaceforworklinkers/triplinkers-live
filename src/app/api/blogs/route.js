import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

/* ---------------- GET ALL BLOGS ---------------- */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .select(`
        *,
        blog_categories (
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ blogs: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE BLOG ---------------- */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      status = "draft",
      seo_title,
      seo_description,
      seo_keywords,
      category_ids = [],
    } = body;

    const { data: blog, error } = await supabaseAdmin
      .from("blogs")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          featured_image,
          status,
          seo_title,
          seo_description,
          seo_keywords,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (category_ids.length > 0) {
      const mappings = category_ids.map((catId) => ({
        blog_id: blog.id,
        category_id: catId,
      }));

      const { error: mapError } = await supabaseAdmin
        .from("blog_categories")
        .insert(mappings);

      if (mapError) {
        return NextResponse.json(
          { error: mapError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, blog });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

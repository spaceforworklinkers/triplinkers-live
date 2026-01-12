import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const dummy = {
    title: "Debug Blog",
    slug: "debug-blog-" + Date.now(),
    content: "Content",
    image_url: "url",
    published_at: new Date().toISOString(),
    // Test potentially missing columns
    short_description: "Short desc",
    seo_title: "SEO Title",
    seo_description: "SEO Desc",
    category_id: null // Assuming nullable
  };

  const { data, error } = await supabaseAdmin
    .from("blogs")
    .insert([dummy])
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message, details: error.details, hint: error.hint });
  }

  // Clean up
  await supabaseAdmin.from("blogs").delete().eq("id", data[0].id);

  return NextResponse.json({ success: true, message: "All columns exist!" });
}

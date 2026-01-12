import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const columns = ["short_description", "seo_title", "seo_description", "category_id"];
  const results = {};

  for (const col of columns) {
    const dummy = {
      title: "Debug " + col,
      slug: "debug-" + col + "-" + Date.now(),
      content: "Content",
      image_url: "url",
      published_at: new Date().toISOString()
    };
    dummy[col] = null; // Just passing it as key is enough to trigger error if column missing, usually.
    // Actually, setting to null might work if column exists. 
    // If I set a value, it definitely checks.
    dummy[col] = (col === 'category_id') ? null : "Test";

    const { error } = await supabaseAdmin.from("blogs").insert([dummy]);
    if (error) {
      results[col] = "MISSING: " + error.message;
    } else {
      results[col] = "EXISTS";
      // Cleanup
      await supabaseAdmin.from("blogs").delete().eq("slug", dummy.slug);
    }
  }

  return NextResponse.json(results);
}

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const form = await req.formData();
  const updates = {};

  form.forEach((value, key) => {
    updates[key] = value;
  });

  const { error } = await supabaseAdmin
    .from("leads")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect("/admin/leads");
}
  
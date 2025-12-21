import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

/* ===============================
   GET — fetch single package
================================ */
export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    );
  }

  return NextResponse.json({ package: data });
}

/* ===============================
   PUT — update package
================================ */
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("packages")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
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
      { error: "Failed to update package" },
      { status: 400 }
    );
  }
}

/* ===============================
   DELETE — delete package
================================ */
export async function DELETE(req, { params }) {
  const { id } = params;

  const { error } = await supabaseAdmin
    .from("packages")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

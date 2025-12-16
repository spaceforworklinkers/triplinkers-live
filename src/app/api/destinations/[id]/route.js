import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, destination: data });
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("destinations")
      .update(body)
      .eq("id", id)
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
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  const { error } = await supabaseAdmin
    .from("destinations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

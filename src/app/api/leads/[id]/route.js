import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

/* ---------------------------------------------------
   GET — Fetch single lead (edit page)
--------------------------------------------------- */
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    console.error("GET LEAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ---------------------------------------------------
   PATCH — Update lead OR status
--------------------------------------------------- */
export async function PATCH(req, { params }) {
  const session = await verifyAdminSession(); // ✅ await ADDED
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();

    const allowedStatus = [
      "new",
      "contacted",
      "converted",
      "not_interested",
    ];

    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // ✅ SAFE UPDATE (no extra fields)
    const allowedFields = [
      "name",
      "email",
      "phone",
      "from_city",
      "destination",
      "days",
      "travelers",
      "budget",
      "status",
      "message",
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    console.error("PATCH LEAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ---------------------------------------------------
   DELETE — Remove lead
--------------------------------------------------- */
export async function DELETE(req, { params }) {
  const session = await verifyAdminSession(); // ✅ await ADDED
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE LEAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

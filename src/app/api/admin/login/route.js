import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/* =========================
   ADMIN LOGIN
========================= */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Find admin by email
    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Create JWT token
    const token = jwt.sign(
      {
        admin_id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================
   ADMIN LOGOUT
========================= */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logout successful",
  });

  // Destroy cookie
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return response;
}

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { setCookie } from "cookies-next";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Find admin by email
    const { data: admin, error } = await supabaseAdmin
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
    const payload = {
      admin_id: admin.id,
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

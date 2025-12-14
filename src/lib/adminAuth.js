import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Validate admin session from cookie
export async function verifyAdminSession() {
  try {
    const cookieStore = cookies(); // ❌ await hata diya
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return { authenticated: false };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      authenticated: true,
      admin: decoded,
    };
  } catch (err) {
    return { authenticated: false };
  }
}

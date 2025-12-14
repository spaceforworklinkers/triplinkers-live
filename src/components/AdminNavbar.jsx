"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const linkClass = (href) =>
    `font-karla font-medium transition-colors ${
      pathname.startsWith(href)
        ? "text-teal-600"
        : "text-gray-600 hover:text-teal-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/admin">
              <Image
                src="/images/logo/triplinkers-svg.svg"
                alt="TripLinkers Admin"
                width={150}
                height={60}
                className="h-12 md:h-14 w-auto"
              />
            </Link>
          </motion.div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/admin" className="font-semibold">
              Dashboard
            </Link>
            <Link href="/admin/leads" className={linkClass("/admin/leads")}>
              Leads
            </Link>

            <Link href="/admin/packages" className={linkClass("/admin/packages")}>
              Packages
            </Link>

            <Link href="/admin/blogs" className={linkClass("/admin/blogs")}>
              Blogs
            </Link>

            <Link href="/admin/categories" className={linkClass("/admin/categories")}>
              Categories
            </Link>
          </div>

          {/* Dashboard Button */}
         
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleLogout}
            className="bg-red-500 font-karla cursor-pointer hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </motion.button>
        </div>
      </nav>
    </header>
  );
}

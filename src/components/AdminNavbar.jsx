"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      // ✅ CLOSE MODAL FIRST
      setShowLogoutConfirm(false);

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
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/">
                <Image
                  src="/images/logo/triplinkers-svg.svg"
                  alt="TripLinkers Admin"
                  width={150}
                  height={60}
                  className="h-12 md:h-18 w-auto"
                />
              </Link>
            </motion.div>

            {/* NAV LINKS */}
            {!isLoginPage && (
              <div className="hidden md:flex items-center gap-8">
                <Link href="/admin" className="font-semibold">
                  Dashboard
                </Link>
                <Link
                  href="/admin/leads"
                  className={linkClass("/admin/leads")}
                >
                  Leads
                </Link>
                <Link
                  href="/admin/packages"
                  className={linkClass("/admin/packages")}
                >
                  Packages
                </Link>
                <Link
                  href="/admin/destinations"
                  className={linkClass("/admin/destinations")}
                >
                  Global
                </Link>
                <Link
                  href="/admin/indian-destinations"
                  className={linkClass("/admin/indian-destinations")}
                >
                  India
                </Link>
                <Link
                  href="/admin/blogs"
                  className={linkClass("/admin/blogs")}
                >
                  Blogs
                </Link>
                <Link
                  href="/admin/categories"
                  className={linkClass("/admin/categories")}
                >
                  Categories
                </Link>
              </div>
            )}

            {/* LOGIN / LOGOUT BUTTON */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                if (isLoginPage) {
                  router.push("/admin/login");
                } else {
                  setShowLogoutConfirm(true);
                }
              }}
              className="bg-orange-500 font-karla hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {isLoginPage ? "Login" : "Logout"}
            </motion.button>
          </div>
        </nav>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to logout from the admin panel?
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full font-medium bg-orange-500 text-white hover:bg-orange-600 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

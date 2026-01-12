"use client";

import "./globals.css";
import RootShell from "@/components/RootShell";
import TripLeadAssistant from "@/components/TripLeadAssistant";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

/* ===============================
   SERVICE WORKER REGISTER
================================ */
function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="antialiased">
        <RegisterServiceWorker />
        <Suspense fallback={null}>
          <RootShell>{children}</RootShell>

          {/* Floating widgets */}
                {!isAdminRoute && <TripLeadAssistant />}
        </Suspense>
      </body>
    </html>
  );
}

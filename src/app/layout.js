"use client";

import "./globals.css";
import RootShell from "@/components/RootShell";
import TripBotFloating from "@/components/TripBotFloating";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <RootShell>{children}</RootShell>
          {!isAdminRoute && <TripBotFloating />}
        </Suspense>
      </body>
    </html>
  );
}

"use client";

import "./globals.css";
import RootShell from "@/components/RootShell";
import TripLeadAssistant from "@/components/TripLeadAssistant";
import Script from "next/script";

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
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-NL7H63EJ3Y"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NL7H63EJ3Y');
          `,
        }}
      />
      
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

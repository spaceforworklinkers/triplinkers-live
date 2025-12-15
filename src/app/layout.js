import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootShell from "@/components/RootShell";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TripLinkers by Spacelinkers",
  description: "Plan and share your trips effortlessly with TripLinkers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <RootShell>{children}</RootShell>
        </Suspense>
      </body>
    </html>
  );
}

import "./globals.css";
import RootShell from "@/components/RootShell";
import { Suspense } from "react";

export const metadata = {
  title: "TripLinkers by Spacelinkers",
  description: "Plan and share your trips effortlessly with TripLinkers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={null}>
          <RootShell>{children}</RootShell>
        </Suspense>
      </body>
    </html>
  );
}

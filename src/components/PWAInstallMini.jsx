"use client";

import { Download } from "lucide-react";
import usePWAInstall from "@/lib/usePWAInstall";

export default function PWAInstallMini() {
  const { isInstallable, installApp } = usePWAInstall();

  const handleClick = () => {
    if (isInstallable) {
      installApp();
    } else {
      alert("Install option will appear when browser allows it.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-full"
    >
      <Download className="w-4 h-4" />
      
    </button>
  );
}

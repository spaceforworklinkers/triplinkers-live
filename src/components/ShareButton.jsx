"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Check out this travel guide",
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center transition-all"
      aria-label="Share destination"
    >
      <Share2 className="w-5 h-5 text-gray-600" />
    </button>
  );
}

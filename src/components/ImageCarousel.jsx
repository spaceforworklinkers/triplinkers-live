"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function ImageCarousel({ images = [], name }) {
  const [index, setIndex] = useState(0);

  const hasImages = images && images.length > 0;

  useEffect(() => {
    if (!hasImages || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images, hasImages]);

  if (!hasImages) {
    return (
      <div className="h-[260px] md:h-[340px] bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
        <MapPin className="w-14 h-14 text-white" />
      </div>
    );
  }

  return (
    <div className="relative h-[260px] md:h-[340px] w-full overflow-hidden rounded-2xl shadow-xl">

      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name} image ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Destination name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-xl">
          {name}
        </h1>
      </div>

    </div>
  );
}

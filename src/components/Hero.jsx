"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1498496294664-d9372eb521f3?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1580740150373-fb74d45e42c9?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1504870712357-65ea720d6078?auto=format&fit=crop&w=2000&q=80",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[480px] lg:min-h-[520px] bg-black">

      {/* Background images stack (NO BLACK FLASH) */}
      <div className="absolute inset-0 z-0">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: current === idx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={img}
              alt="Dubai Background"
              fill
              className="object-cover"
              priority={idx === current}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">

        <h1 className="text-white text-3xl md:text-5xl font-bold text-center drop-shadow-xl mb-3">
          Plan Your Perfect Dubai Trip
        </h1>

        <p className="text-white/90 text-center mb-8 max-w-xl text-sm md:text-lg">
          Personalized Dubai itineraries, cost estimations, and intelligent trip planning.
        </p>

        {/* Filter Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-4xl border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Destination */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                placeholder="Dubai"
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white/60 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            {/* Budget Dropdown */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">Budget</label>
              <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white/60 text-gray-700 focus:border-teal-600 focus:ring-1 focus:ring-teal-600">
                <option>Economical</option>
                <option>Mid-range</option>
                <option>Luxury</option>
              </select>
            </div>

            {/* Trip Type Dropdown */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1">Travel Type</label>
              <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white/60 text-gray-700 focus:border-teal-600 focus:ring-1 focus:ring-teal-600">
                <option>Family</option>
                <option>Adventure</option>
                <option>Honeymoon</option>
                <option>Friends</option>
                <option>Business</option>
                <option>Solo</option>
              </select>
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg">
                <Search className="w-4 h-4" />
                Generate Plan
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plane, Users, Heart, Palmtree } from "lucide-react";

const featuredPackages = [
  {
    id: "family",
    title: "Family Fun Bonanza",
    description: "Action-packed itinerary keeping both kids and adults entertained.",
    duration: "5-9 Days",
    price: 2499,
    icon: Palmtree,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    id: "honeymoon",
    title: "Romantic Honeymoon",
    description: "Create unforgettable memories with a luxurious, romantic getaway.",
    duration: "6-10 Days",
    price: 2999,
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    id: "duo",
    title: "Dynamic Duo Escape",
    description: "Perfect for best friends or siblings. Experience thrills together.",
    duration: "5-8 Days",
    price: 1499,
    icon: Users,
    color: "text-teal-500",
    bg: "bg-teal-50"
  }
];

const FeaturedPackages = () => {
  const router = useRouter();

  const handleGetQuote = () => {
    document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular <span className="text-orange-500">Tour Packages</span>
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked experiences designed for every type of traveler. 
              Explore our most requested itineraries.
            </p>
          </div>

          {/* Replaced React Router Link with Next.js Link */}
          <Link
            href="/packages"
            className="hidden md:flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors group"
          >
            View All Packages
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className={`p-8 ${pkg.bg} flex-grow`}>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <pkg.icon className={`w-6 h-6 ${pkg.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <span className="px-3 py-1 rounded-full bg-white/60 border border-gray-200">
                    {pkg.duration}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/60 border border-gray-200">
                    From ${pkg.price}
                  </span>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleGetQuote}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plane className="w-4 h-4" />
                  Get quote for Dubai Trip
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="text-center md:hidden">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors group"
          >
            View All Packages
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;

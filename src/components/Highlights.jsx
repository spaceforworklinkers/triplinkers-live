"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Palmtree,
  ShoppingBag,
  Camera,
  Waves,
  Mountain,
  Star,
  Sun,
  Trophy
} from "lucide-react";

// Universal travel highlights (not location-specific)
const highlights = [
  {
    icon: Palmtree,
    title: "Beautiful Landscapes",
    description: "Explore scenic views, coastlines, forests, or mountains across the world",
    colorClass: "bg-teal-100 text-teal-600"
  },
  {
    icon: Star,
    title: "Top Attractions",
    description: "Discover iconic landmarks and must-visit places unique to every destination",
    colorClass: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: ShoppingBag,
    title: "Local Markets",
    description: "Experience vibrant shopping streets, cultural bazaars, and artisan shops",
    colorClass: "bg-orange-100 text-orange-600"
  },
  {
    icon: Mountain,
    title: "Adventure Activities",
    description: "Enjoy trekking, desert rides, water sports, theme parks, and thrill-filled experiences",
    colorClass: "bg-red-100 text-red-600"
  },
  {
    icon: Waves,
    title: "Water Experiences",
    description: "Relax on beaches or try cruises, snorkeling, diving, and boat tours",
    colorClass: "bg-blue-100 text-blue-600"
  },
  {
    icon: Camera,
    title: "Photo-worthy Spots",
    description: "Capture memorable moments at picturesque views and iconic environments",
    colorClass: "bg-amber-100 text-amber-600"
  },
  {
    icon: Trophy,
    title: "Theme Parks & Fun",
    description: "Perfect for families, friends, or adventure seekers looking for excitement",
    colorClass: "bg-rose-100 text-rose-600"
  },
  {
    icon: Building2,
    title: "Cultural Highlights",
    description: "Museums, historical sites, and heritage-rich attractions",
    colorClass: "bg-purple-100 text-purple-600"
  },
  {
    icon: Sun,
    title: "Relaxation & Wellness",
    description: "Enjoy spas, retreats, calm beaches, and peaceful scenic locations",
    colorClass: "bg-orange-100 text-orange-500"
  }
];

const Highlights = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-karla">
            Top Travel <span className="text-teal-600">Highlights</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Explore experiences loved by travelers worldwide, suitable for every destination
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div
                className={`w-16 h-16 rounded-xl ${highlight.colorClass} flex items-center justify-center mb-4`}
              >
                <highlight.icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 font-karla">
                {highlight.title}
              </h3>

              <p className="text-gray-600 font-inter">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

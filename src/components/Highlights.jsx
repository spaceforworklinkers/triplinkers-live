"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Palmtree, ShoppingBag, Camera, Waves, Mountain, Star, Sun, Trophy } from "lucide-react";

const highlights = [
  {
    icon: Building2,
    title: "Burj Khalifa",
    description: "Touch the sky at the world's tallest building",
    colorClass: "bg-orange-100 text-orange-600"
  },
  {
    icon: Palmtree,
    title: "Palm Jumeirah",
    description: "Explore the iconic man-made island paradise",
    colorClass: "bg-teal-100 text-teal-600"
  },
  {
    icon: ShoppingBag,
    title: "Dubai Mall",
    description: "Shop till you drop at the world's largest mall",
    colorClass: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: Mountain,
    title: "Desert Safari",
    description: "Experience thrilling dune bashing adventures",
    colorClass: "bg-red-100 text-red-600"
  },
  {
    icon: Waves,
    title: "Dubai Marina",
    description: "Cruise along the stunning waterfront",
    colorClass: "bg-blue-100 text-blue-600"
  },
  {
    icon: Camera,
    title: "Dubai Frame",
    description: "Capture panoramic views of old and new Dubai",
    colorClass: "bg-amber-100 text-amber-600"
  },
  {
    icon: Trophy,
    title: "Ferrari World",
    description: "Feel the adrenaline at the ultimate theme park",
    colorClass: "bg-rose-100 text-rose-600"
  },
  {
    icon: Star,
    title: "Atlantis Aquarium",
    description: "Dive into an underwater wonderland",
    colorClass: "bg-cyan-100 text-cyan-600"
  },
  {
    icon: Sun,
    title: "Jumeirah Beach",
    description: "Relax on pristine white sandy beaches",
    colorClass: "bg-orange-100 text-orange-500"
  }
];

const Highlights = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dubai's Must-Visit <span className="text-teal-600">Attractions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most iconic experiences that make Dubai a world-class destination
          </p>
        </motion.div>

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
              <div className={`w-16 h-16 rounded-xl ${highlight.colorClass} flex items-center justify-center mb-4`}>
                <highlight.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Palmtree,
  ShoppingBag,
  Heart,
  Globe,
  Star,
  Compass,
  Zap,
  Shield,
  ArrowRight
} from "lucide-react";

const Highlights = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories);
        }
        setCategories(prev => {
           // Ensure it doesn't return empty if API fails for some reason or is empty initially
           // but we know we seeded it.
           return data.categories || [];
        });
        setLoading(false);
      })
      .catch(err => {
         console.error("Failed to fetch categories:", err);
         setLoading(false);
      });
  }, []);

  const getIcon = (slug) => {
    const icons = {
      honeymoon: Heart,
      family: Compass,
      adventure: Zap,
      luxury: Shield,
      budget: ShoppingBag,
      international: Globe
    };
    return icons[slug] || Building2;
  };

  const getColor = (index) => {
    const colors = [
      "bg-teal-100 text-teal-600",
      "bg-rose-100 text-rose-600",
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-purple-100 text-purple-600",
      "bg-amber-100 text-amber-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-karla">
            Choose Your <span className="text-orange-600">Travel Style</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            From romantic escapes to adrenaline-pumping adventures, find the perfect category for your next journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-3xl" />)
          ) : (
            categories.map((cat, index) => {
              const Icon = getIcon(cat.slug);
              const colorClass = getColor(index);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden"
                >
                  <div className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-karla group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-gray-600 font-inter mb-6 leading-relaxed">
                    Explore our curated collection of {cat.name.toLowerCase()} experiences designed just for you.
                  </p>

                  <Link 
                    href={`/packages?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-orange-600 transition-colors"
                  >
                    View Packages
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plane, Palmtree, Heart, Users } from "lucide-react";

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/packages?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (data.packages) {
          setPackages(data.packages);
        }
        setLoading(false);
      });
  }, []);

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("family")) return Users;
    if (t.includes("honeymoon") || t.includes("romantic")) return Heart;
    return Palmtree;
  };

  const getColors = (index) => {
    const colors = [
      { text: "text-orange-500", bg: "bg-orange-50" },
      { text: "text-rose-500", bg: "bg-rose-50" },
      { text: "text-teal-500", bg: "bg-teal-50" },
    ];
    return colors[index % colors.length];
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
              Featured <span className="text-orange-500">Tour Packages</span>
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked experiences designed for every type of traveler. 
              Explore our most requested itineraries.
            </p>
          </div>

          <Link
            href="/packages"
            className="hidden md:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
          >
            View All Packages
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            packages.map((pkg, index) => {
              const Icon = getIcon(pkg.title);
              const { text, bg } = getColors(index);
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link href={`/packages/${pkg.slug}`} className={`p-8 ${bg} flex-grow block`}>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                      <Icon className={`w-6 h-6 ${text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{pkg.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">{pkg.short_description || pkg.short_desc}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <span className="px-3 py-1 rounded-full bg-white/60 border border-gray-200">
                        {pkg.duration || pkg.days} Days
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/60 border border-gray-200">
                        From ₹{pkg.price}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 border-t border-gray-100">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="w-full bg-gray-900 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Plane className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;

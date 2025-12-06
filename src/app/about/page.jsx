"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building, Users, Globe, Target } from "lucide-react";

const About = () => {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-6">
            About TripLinkers
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We are passionate about creating unforgettable Dubai experiences. As
            a dedicated team of travel experts, we connect travelers with the
            magic of the Emirates, ensuring seamless journeys and lifelong
            memories.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Story</h3>
                <p className="text-gray-600 leading-relaxed">
                  Founded with a vision to simplify Dubai travel, TripLinkers
                  started as a small team of enthusiasts. Today, we are a
                  leading travel partner, helping thousands of tourists navigate
                  the wonders of the UAE with confidence and ease.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Team</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team consists of local experts and travel professionals
                  who know Dubai inside out. From hidden gems in Old Dubai to
                  the latest luxury attractions, we have the knowledge to curate
                  the perfect itinerary for you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide personalized, high-quality, and affordable travel
                  experiences that showcase the best of Dubai, all while
                  maintaining the highest standards of customer service and
                  satisfaction.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-600 leading-relaxed">
                  While we focus on Dubai, our travelers come from all corners
                  of the globe. We understand diverse cultural needs and
                  preferences, making every guest feel at home in this
                  magnificent city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

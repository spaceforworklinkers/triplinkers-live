"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Heart, Headphones, Award, DollarSign, Clock } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "100% Secure Bookings",
    description: "Your privacy and security are our top priorities with encrypted transactions",
    colorClass: "bg-teal-600"
  },
  {
    icon: Heart,
    title: "Personalized Experiences",
    description: "Every trip is tailored to your preferences and travel style",
    colorClass: "bg-orange-500"
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Our Dubai specialists are always available to assist you",
    colorClass: "bg-blue-600"
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description: "Recognized for excellence in travel planning and customer satisfaction",
    colorClass: "bg-purple-600"
  },
  {
    icon: DollarSign,
    title: "Best Price Guarantee",
    description: "We ensure you get the most value for your money with competitive pricing",
    colorClass: "bg-green-600"
  },
  {
    icon: Clock,
    title: "Quick Response Time",
    description: "Get your personalized quote within 15-30 minutes of inquiry",
    colorClass: "bg-red-600"
  }
];

const WhyBookWithUs = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Book with <span className="text-orange-500">TripLinkers?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We're committed to making your Dubai experience unforgettable
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-xl ${reason.colorClass} flex items-center justify-center mb-6 shadow-lg`}
              >
                <reason.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-gray-400">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const reasons = [
  {
    lottie: "https://lottie.host/embed/4c3d3f3a-8f5e-4c4e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "100% Secure Bookings",
    description: "Your privacy and security are our top priorities with encrypted transactions",
    gradient: "from-emerald-400 to-teal-600",
    iconColor: "text-emerald-500"
  },
  {
    lottie: "https://lottie.host/embed/8f3d3f3a-8f5e-4c4e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "Personalized Experiences",
    description: "Every trip is tailored to your preferences and travel style",
    gradient: "from-pink-400 to-rose-600",
    iconColor: "text-pink-500"
  },
  {
    lottie: "https://lottie.host/embed/1a3d3f3a-8f5e-4c4e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "24/7 Expert Support",
    description: "Our Dubai specialists are always available to assist you",
    gradient: "from-blue-400 to-indigo-600",
    iconColor: "text-blue-500"
  },
  {
    lottie: "https://lottie.host/embed/2b3d3f3a-8f5e-4c4e-9c3e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "Award-Winning Service",
    description: "Recognized for excellence in travel planning and customer satisfaction",
    gradient: "from-amber-400 to-orange-600",
    iconColor: "text-amber-500"
  },
  {
    lottie: "https://lottie.host/embed/3c3d3f3a-8f5e-4c4e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "Best Price Guarantee",
    description: "We ensure you get the most value for your money with competitive pricing",
    gradient: "from-green-400 to-emerald-600",
    iconColor: "text-green-500"
  },
  {
    lottie: "https://lottie.host/embed/5d3d3f3a-8f5e-4c4e-9c3e-2f5e8c3d3f3a/vCx0rqQqzT.json",
    title: "Quick Response Time",
    description: "Get your personalized quote within 15-30 minutes of inquiry",
    gradient: "from-violet-400 to-purple-600",
    iconColor: "text-violet-500"
  }
];

const icons = [
  // Shield/Security
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>`,
  // Heart
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,
  // Headphones
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>`,
  // Award/Trophy
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>`,
  // Dollar/Money
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>`,
  // Clock
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`
];

const WhyBookWithUs = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4 sm:mb-6"
          >
            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold tracking-wide uppercase">
              Why Choose Us
            </span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-slate-900">
            Why Book with{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              TripLinkers?
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
            Experience world-class service with benefits designed for your perfect journey
          </p>
        </motion.div>

        {/* Reasons List */}
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-slate-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Icon Container */}
                  <motion.div
                    animate={hoveredIndex === index ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative flex-shrink-0"
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      animate={hoveredIndex === index ? {
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} rounded-2xl blur-xl opacity-30`}
                    />
                    
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center shadow-xl ${reason.iconColor}`}>
                      <motion.div
                        animate={hoveredIndex === index ? {
                          scale: [1, 1.2, 1],
                        } : {}}
                        transition={{ duration: 0.4 }}
                        dangerouslySetInnerHTML={{ __html: icons[index] }}
                        className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300">
                      {reason.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    animate={hoveredIndex === index ? { x: 5 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`hidden sm:block flex-shrink-0 transition-opacity duration-300 ${
                      hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${reason.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Decorative gradient line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={hoveredIndex === index ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.gradient} rounded-b-3xl origin-left`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-base sm:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Start Your Journey
              <motion.svg
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;
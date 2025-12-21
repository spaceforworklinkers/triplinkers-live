"use client";

import React from "react";
import {
  Building,
  Users,
  Globe,
  Target,
  Award,
  Heart,
  Sparkles,
  TrendingUp,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react";

const About = () => {
  return (
    <div className=" bg-gradient-to-b from-orange-50/30 to-white">
      {/* Hero Section */}
     <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/10"></div>

  {/* Viewport-centered content */}
  <div className="relative min-h-[calc(100vh-80px)] flex items-center">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <MapPin className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">
            Global Travel Experts Since 2024
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl  md:text-6xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Crafting Travel
           
          Experiences That
          
          Inspire Wonder
        </h1>

        {/* Text */}
        <p className="text-lg sm:text-xl md:text-2xl text-orange-100 leading-relaxed max-w-2xl">
          We do not just plan trips. We design journeys that connect you with
          places, cultures, and experiences that stay with you long after you
          return.
        </p>

      </div>
    </div>
  </div>

  {/* Wave */}
  <div className="absolute bottom-0 left-0 right-0">
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      <path
        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
        fill="white"
      />
    </svg>
  </div>
</div>


      {/* Our Story Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <div>
            <div className="inline-block px-4 py-2 bg-orange-100 rounded-full mb-6">
              <span className="text-sm font-bold text-orange-700">
                OUR JOURNEY
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The TripLinkers Story
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              What began as a shared passion for travel and discovery evolved
              into a platform built to simplify how people explore the world.
              Every journey we create is rooted in real experiences, thoughtful
              planning, and attention to detail.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, TripLinkers supports travelers globally, combining smart
              planning with human expertise to deliver seamless, meaningful
              travel experiences across destinations.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl">
              <img src="https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg" className="object-cover w-full h-full rounded-3xl" alt="" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl"></div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Destination Expertise
            </h3>
            <p className="text-gray-600">
              Deep knowledge of destinations, travel logistics, and on-ground
              experiences across the globe.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Expert Team
            </h3>
            <p className="text-gray-600">
              Experienced planners focused on clarity, comfort, and confidence
              throughout your journey.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Personalized Planning
            </h3>
            <p className="text-gray-600">
              Every trip is designed around your goals, travel style, pace, and
              preferences.{" "}
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Global Reach
            </h3>
            <p className="text-gray-600">
              Serving travelers from different cultures with care,
              understanding, and local insight.{" "}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-16 md:py-20 mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl"></div>
          <div className="relative max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                By the Numbers
              </h2>
              <p className="text-xl text-gray-600">
                Our impact speaks for itself
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group cursor-default text-center">
                <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="text-gray-600 text-lg font-semibold">
                  Journeys Created
                </div>
              </div>
              <div className="group cursor-default text-center">
                <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  98%
                </div>
                <div className="text-gray-600 text-lg font-semibold">
                  Happy Travelers
                </div>
              </div>
              <div className="group cursor-default text-center">
                <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-gray-600 text-lg font-semibold">
                  Expert Guides
                </div>
              </div>
              <div className="group cursor-default text-center">
                <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-gray-600 text-lg font-semibold">
                  Support Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <div className="bg-white p-10 rounded-3xl border-2 border-orange-200 shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To remove complexity from travel planning and replace uncertainty
              with confidence by creating journeys that feel personal, reliable,
              and well thought out.{" "}
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border-2 border-orange-200 shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To become a globally trusted travel planning platform that
              empowers people to explore the world with clarity, excitement, and
              peace of mind.{" "}
            </p>
          </div>
        </div>

        {/* What Drives Us */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Obsessed with Your Experience
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Every detail matters. From the moment you reach out to the day
                  you fly home, we're designing moments that exceed
                  expectations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Excellence is Non-Negotiable
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We partner with the best. We train relentlessly. We never
                  compromise on quality, safety, or authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Innovation in Every Journey
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Dubai evolves fast, and so do we. New experiences, smarter
                  tech, better service—we're always one step ahead.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Growing Together
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Your success is our success. When you have an incredible trip,
                  we've done our job—and that fuels everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your next journey starts here
            </h2>
            <p className="text-xl text-orange-100 mb-10 leading-relaxed">
              Share your travel goals and preferences. We will take care of the
              planning, details, and execution.{" "}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group cursor-pointer inline-flex items-center justify-center gap-3 bg-white text-orange-600 font-semibold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                Let's Plan Your Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="inline-flex cursor-pointer items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300">
                View Our Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

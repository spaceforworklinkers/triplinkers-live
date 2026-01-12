"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Star, ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';

const TravelPackagesClient = () => {
const [currentPage, setCurrentPage] = useState(1);
const [favorites, setFavorites] = useState([]);

// FILTER STATE
const [selectedPrice, setSelectedPrice] = useState(null);
const [selectedDuration, setSelectedDuration] = useState(null);

// PACKAGES STATE
const [allPackages, setAllPackages] = useState([]);

// LOCATION FILTER
const [selectedLocation, setSelectedLocation] = useState(null);
const [availableLocations, setAvailableLocations] = useState([]);


useEffect(() => {
  fetchFilteredPackages();
}, [selectedPrice, selectedDuration, selectedLocation]);

useEffect(() => {
  async function loadAllPackages() {
    try {
      const res = await fetch("/api/packages");
      const json = await res.json();
      setAllPackages(json.packages || []);
      
      const locations = [...new Set((json.packages || [])
        .map(p => p.location)
        .filter(Boolean))];
      setAvailableLocations(locations);
    } catch (err) {
      console.error("Failed to load packages");
    }
  }

  loadAllPackages();
}, []);


  const fetchFilteredPackages = async () => {
  try {
    const params = new URLSearchParams();

    // PRICE FILTER
    if (selectedPrice === "low") {
      params.append("maxPrice", 50000);
    }
    if (selectedPrice === "mid") {
      params.append("minPrice", 50000);
      params.append("maxPrice", 100000);
    }
    if (selectedPrice === "high") {
      params.append("minPrice", 100000);
    }
// LOCATION FILTER
if (selectedLocation) {
  params.append("location", selectedLocation);
}

    // DURATION FILTER
    if (selectedDuration === "short") {
      params.append("maxDays", 5);
    }
    if (selectedDuration === "medium") {
      params.append("minDays", 6);
      params.append("maxDays", 8);
    }
    if (selectedDuration === "long") {
      params.append("minDays", 9);
    }

    const res = await fetch(`/api/packages?${params.toString()}`);
    const json = await res.json();

    setAllPackages(json.packages || []);
    setCurrentPage(1);
  } catch (err) {
    console.error("Failed to fetch filtered packages");
  }
};

    const packagesPerPage = 6;

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = allPackages.slice(indexOfFirstPackage, indexOfLastPackage);

  const totalPages = Math.ceil(allPackages.length / packagesPerPage);


    const toggleFavorite = (id) => {
      setFavorites(prev => 
        prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Curated Travel Experiences</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Your Dream Vacation<br />Awaits
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed max-w-3xl mx-auto">
                Handpicked packages designed to create unforgettable memories across the world's most stunning destinations
              </p>
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">10+</div>
              <div className="text-sm text-gray-600">Destinations</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">5K+</div>
              <div className="text-sm text-gray-600">Happy Travelers</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
{/* Filters */}
<div className="mb-10">
  <div className="flex flex-col gap-6">

    {/* Price Filters */}
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Filter by Price
      </h3>
      <div className="flex flex-wrap gap-3">
        {[
          { label: "All", value: null },
          { label: "Under ₹50k", value: "low" },
          { label: "₹50k – ₹1L", value: "mid" },
          { label: "₹1L+", value: "high" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSelectedPrice(item.value)}
            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
              selectedPrice === item.value
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>

    {/* Duration Filters */}
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Filter by Duration
      </h3>
      <div className="flex flex-wrap gap-3">
        {[
          { label: "All", value: null },
          { label: "Up to 5 Days", value: "short" },
          { label: "6–8 Days", value: "medium" },
          { label: "9+ Days", value: "long" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSelectedDuration(item.value)}
            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
              selectedDuration === item.value
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
{/* Location Filter */}
<div>
  <h3 className="text-sm font-semibold text-gray-700 mb-3">
    Filter by Location
  </h3>

  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => setSelectedLocation(null)}
      className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
        selectedLocation === null
          ? "bg-orange-600 text-white border-orange-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
      }`}
    >
      All
    </button>

    {availableLocations.map((loc) => (
      <button
        key={loc}
        onClick={() => setSelectedLocation(loc)}
        className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
          selectedLocation === loc
            ? "bg-orange-600 text-white border-orange-600"
            : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
        }`}
      >
        {loc}
      </button>
    ))}
  </div>
</div>

  </div>
</div>

          {/* Package Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Packages
              </h2>
              <p className="text-gray-600">
Showing {indexOfFirstPackage + 1}-{Math.min(indexOfLastPackage, allPackages.length)} of {allPackages.length} packages

              </p>
            </div>
          </div>

          {/* Packages Grid */}
          {allPackages.length === 0 && (
  <div className="text-center py-20 text-gray-500 text-lg">
    No packages match your filters. Try adjusting them.
  </div>
)}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                   src={pkg.banner_url || "https://via.placeholder.com/800x600?text=TripLinkers"}

                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                  
                  {/* Featured Badge */}
              {pkg.featured === true && (

                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(pkg.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorites.includes(pkg.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Country Tag */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-900">{pkg.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {pkg.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {pkg.short_description || "A thoughtfully crafted travel experience."}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="font-bold text-gray-900">{pkg.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({pkg.reviews} reviews)</span>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span>{pkg.groupSize}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Starting from</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-orange-600">₹{pkg.price}</span>
                        <span className="text-gray-500">/person</span>
                      </div>
                    </div>
                    <button className="group/btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 hover:gap-3 shadow-lg hover:shadow-xl">
                      Book Now
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Previous Button */}
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all"
                >
                  ← Previous
                </button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all min-w-[44px] ${
                    page === currentPage
                      ? 'bg-orange-600 text-white shadow-lg scale-110'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 mt-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Let us create a custom package tailored specifically to your dreams and preferences.
              </p>
              <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2">
                Create Custom Package
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default TravelPackagesClient;

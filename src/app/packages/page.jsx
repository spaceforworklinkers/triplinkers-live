  "use client";

  import React, { useState } from 'react';
  import { MapPin, Calendar, Users, Star, ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';
  

  const packages = [
    {
      id: 1,
      title: "Magical Santorini Escape",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
      price: 1299,
      duration: "7 Days",
      groupSize: "2-8 People",
      rating: 4.9,
      reviews: 342,
      featured: true,
      description: "Experience the breathtaking sunsets and white-washed villages of Santorini"
    },
    {
      id: 2,
      title: "Tokyo Urban Adventure",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      price: 2199,
      duration: "10 Days",
      groupSize: "2-6 People",
      rating: 4.8,
      reviews: 567,
      featured: true,
      description: "Immerse yourself in the perfect blend of tradition and modernity"
    },
    {
      id: 3,
      title: "Bali Paradise Retreat",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      price: 899,
      duration: "8 Days",
      groupSize: "2-10 People",
      rating: 4.7,
      reviews: 421,
      featured: false,
      description: "Discover tropical beaches, ancient temples, and lush rice terraces"
    },
    {
      id: 4,
      title: "Swiss Alps Explorer",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
      price: 2499,
      duration: "9 Days",
      groupSize: "2-6 People",
      rating: 4.9,
      reviews: 289,
      featured: true,
      description: "Journey through majestic mountains and charming alpine villages"
    },
    {
      id: 5,
      title: "Marrakech Mystique",
      country: "Morocco",
      image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
      price: 1099,
      duration: "6 Days",
      groupSize: "2-8 People",
      rating: 4.6,
      reviews: 198,
      featured: false,
      description: "Explore vibrant souks, stunning palaces, and the Sahara Desert"
    },
    {
      id: 6,
      title: "New Zealand Wonders",
      country: "New Zealand",
      image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
      price: 2799,
      duration: "12 Days",
      groupSize: "2-8 People",
      rating: 4.9,
      reviews: 456,
      featured: false,
      description: "Experience dramatic landscapes from fjords to glaciers"
    },
    {
      id: 7,
      title: "Iceland Northern Lights",
      country: "Iceland",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
      price: 1899,
      duration: "7 Days",
      groupSize: "2-6 People",
      rating: 4.8,
      reviews: 334,
      featured: true,
      description: "Chase the aurora borealis and explore volcanic landscapes"
    },
    {
      id: 8,
      title: "Parisian Romance",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      price: 1599,
      duration: "6 Days",
      groupSize: "2-4 People",
      rating: 4.7,
      reviews: 512,
      featured: false,
      description: "Fall in love with the City of Lights and its timeless charm"
    },
    {
      id: 9,
      title: "Dubai Luxury Experience",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      price: 1799,
      duration: "5 Days",
      groupSize: "2-8 People",
      rating: 4.8,
      reviews: 623,
      featured: true,
      description: "Indulge in world-class luxury and modern Arabian hospitality"
    },
    {
      id: 10,
      title: "Maldives Beach Bliss",
      country: "Maldives",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
      price: 3299,
      duration: "7 Days",
      groupSize: "2-4 People",
      rating: 5.0,
      reviews: 789,
      featured: true,
      description: "Escape to pristine beaches and overwater luxury bungalows"
    }
  ];

  const TravelPackages = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const packagesPerPage = 6;

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);
    const totalPages = Math.ceil(packages.length / packagesPerPage);

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

          {/* Package Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Popular Packages
              </h2>
              <p className="text-gray-600">
                Showing {indexOfFirstPackage + 1}-{Math.min(indexOfLastPackage, packages.length)} of {packages.length} packages
              </p>
            </div>
          </div>

          {/* Packages Grid */}
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
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                  
                  {/* Featured Badge */}
                  {pkg.featured && (
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
                      <span className="text-sm font-semibold text-gray-900">{pkg.country}</span>
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
                    {pkg.description}
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
                      <span>{pkg.duration}</span>
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
                        <span className="text-3xl font-bold text-orange-600">${pkg.price}</span>
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

  export default TravelPackages;
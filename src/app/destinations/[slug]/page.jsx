import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UniversalLeadModal from "@/components/UniversalLeadModal";
import ShareButton from "@/components/ShareButton";

import ImageCarousel from "@/components/ImageCarousel";

import { MapPin, Calendar, Clock, Star, Check, Phone, Mail } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabaseAdmin
    .from("destinations")
    .select("seo_title, seo_description, name")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return {};

  return {
    title: data.seo_title || `${data.name} Travel Guide | TripLinkers`,
    description:
      data.seo_description ||
      `Plan your ${data.name} trip with custom itineraries.`,
  };
}

export default async function DestinationPage({ params }) {
  const { slug } = params;

  const { data: destination } = await supabaseAdmin
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!destination) {
    notFound();
  }

  // Share functionality
  

  return (
    <>
      

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-orange-600 transition-colors">Home</a>
              <span>/</span>
              <a href="/destinations" className="hover:text-orange-600 transition-colors">Destinations</a>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{destination.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Hero Section with Carousel - Reduced Height */}
          <section className="mb-10">
            <div className="h-[300px] md:h-[400px]">
              <ImageCarousel 
                images={destination.hero_images || []} 
                name={destination.name}
              />
            </div>
          </section>

          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {destination.name} Travel Guide
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span>{destination.country || destination.name}</span>
                  </div>
                  {destination.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  )}
                </div>
              </div>
      <ShareButton title={`${destination.name} Travel Guide | TripLinkers`} />

            </div>
          </div>

          {/* Main Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.best_time && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">Best Time</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{destination.best_time}</p>
                  </div>
                )}

                {destination.ideal_duration && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">Duration</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{destination.ideal_duration}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {destination.name}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {destination.long_description}
                </p>
              </div>

              {/* Highlights */}
              {destination.highlights?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-orange-600" />
                    Top Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {destination.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What to Expect
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {destination.name} offers an unforgettable experience for travelers seeking adventure, culture, and relaxation. Whether you're a first-time visitor or a returning traveler, this destination has something special for everyone.
                </p>
              </div>

            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              
              {/* Contact Form */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Plan Your {destination.name} Trip
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Get a personalized itinerary crafted by our travel experts.
                </p>

                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tell us about your travel plans..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Get Custom Itinerary
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Free consultation • No obligation
                  </p>
                </form>
              </div>

              {/* Contact Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Need Help?
                </h3>
                
                <div className="space-y-4">
                  <a 
                    href="tel:+915551234567"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Call Us</div>
                      <div className="font-semibold text-sm">+91 555-123-4567</div>
                    </div>
                  </a>

                  <a 
                    href="mailto:info@triplinkers.com"
                    className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email Us</div>
                      <div className="font-semibold text-sm">info@triplinkers.com</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Trusted by 10,000+ Travelers</h4>
                <p className="text-sm text-gray-600">
                  Join thousands who planned their perfect trip with us
                </p>
              </div>

            </aside>

          </section>

        </div>
      </main>

      

    </>
  );
}
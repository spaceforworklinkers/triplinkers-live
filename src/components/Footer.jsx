"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Globe, ArrowRight, ShieldCheck, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [tourPackages, setTourPackages] = useState([]);
  
  // Rotating SEO Chips State
  const [rotatingChips, setRotatingChips] = useState([]);

  useEffect(() => {
    // 1. Fetch Top Destinations (Main list) - LIMIT TO 6
    fetch("/api/destinations?limit=6")
      .then(res => res.json())
      .then(data => {
        if (data.destinations) {
          setPopularDestinations(data.destinations.map(d => ({
            name: `${d.name} Tour Packages`,
            href: `/destinations/${d.slug}`
          })));
        }
      });

    // 2. Fetch Packages
    fetch("/api/packages?limit=6")
      .then(res => res.json())
      .then(data => {
        if (data.packages) {
          setTourPackages(data.packages.map(p => ({
            name: p.title,
            href: `/packages/${p.slug}`
          })));
        }
      });

    // 3. Fetch Data for Rotating SEO Chips
    const fetchRotatingData = async () => {
      try {
        const [destRes, catRes] = await Promise.all([
          fetch("/api/destinations?limit=100"),
          fetch("/api/categories")
        ]);

        const destData = await destRes.json();
        const catData = await catRes.json();

        const styles = ["hill-stations", "snow-destinations", "temple-tours", "pilgrimage-circuits", "island-trips", "backwater-tours", "desert-safaris"];
        
        const allChips = [
          ...(destData.destinations || []).map(d => ({ label: d.name, href: `/destinations/${d.slug}`, type: 'City' })),
          ...(catData.categories || []).map(c => ({ 
            label: c.name, 
            href: `/packages?category=${c.slug}`, 
            type: styles.includes(c.slug) ? 'Style' : 'Category' 
          }))
        ];

        const shuffled = allChips.sort(() => 0.5 - Math.random());
        setRotatingChips(shuffled.slice(0, 24));
      } catch (err) {
        console.error("Footer data fetch error:", err);
      }
    };

    fetchRotatingData();
  }, []);

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Travel Blog", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
    { name: "Customer Reviews", href: "/reviews" },
    { name: "Careers", href: "/careers" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const servingCities = [
    "Paris", "Dubai", "London", "New York", "Bangkok", "Singapore", "Tokyo", "Rome", 
    "Barcelona", "Istanbul", "Bali", "Amsterdam", "Prague", "Vienna", "Zurich", 
    "Hong Kong", "Kuala Lumpur", "Maldives", "Sydney", "Cape Town"
  ];

  // Helper to get random vibrant colors for chips
  const getChipStyle = (index) => {
    const colors = [
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white",
      "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500 hover:text-white",
      "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white",
      "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-white",
      "bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500 hover:text-white",
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-white",
      "bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500 hover:text-white",
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500 hover:text-white",
    ];
    return colors[index % colors.length];
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info */}
          <div>
            <Link href="/">
              <Image
                src="/images/logo/triplinkers-svg.svg"
                alt="TripLinkers"
                width={180}
                height={54}
                className="h-16 w-auto mb-6 brightness-0 invert"
              />
            </Link>
            <h4 className="text-lg font-bold mb-2">TripLinkers - Best Travel Agency in India</h4>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              India's leading travel agency for international tour packages, honeymoon trips, and customized travel experiences.
            </p>
            <div className="space-y-3 mb-6">
              <a href="mailto:info@triplinkers.com" className="flex items-center gap-3 text-gray-400 hover:text-orange-500 text-sm transition-colors">
                <Mail size={16} className="text-orange-500" /> info@triplinkers.com
              </a>
              <a href="tel:+919286468530" className="flex items-center gap-3 text-gray-400 hover:text-orange-500 text-sm transition-colors">
                <Phone size={16} className="text-orange-500" /> +91 92864 68530
              </a>
              <p className="flex items-start gap-3 text-gray-400 text-sm leading-tight">
                <MapPin size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                <span>Spacelinkers Infotech Pvt Ltd Corporate Office,<br />Noida, Uttar Pradesh India - 201307</span>
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-9 h-9 rounded bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-9 h-9 rounded bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-9 h-9 rounded bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Popular Destinations</h3>
            <ul className="space-y-3">
              {popularDestinations.length > 0 ? popularDestinations.map((destination) => (
                <li key={destination.name}>
                  <Link href={destination.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <ArrowRight size={12} className="text-orange-500" />
                    <span>{destination.name}</span>
                  </Link>
                </li>
              )) : <li className="text-gray-600 text-sm">Loading...</li>}
              <li>
                <Link href="/destinations" className="text-orange-500 hover:underline text-sm font-semibold mt-2 block">
                  View All Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Packages */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Tour Packages</h3>
            <ul className="space-y-3">
              {tourPackages.length > 0 ? tourPackages.map((pkg) => (
                <li key={pkg.name}>
                  <Link href={pkg.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <ArrowRight size={12} className="text-orange-500" />
                    <span className="line-clamp-1">{pkg.name}</span>
                  </Link>
                </li>
              )) : (
                <>
                   <li className="text-gray-400 text-sm">International Tours</li>
                   <li className="text-gray-400 text-sm">Honeymoon Packages</li>
                   <li className="text-gray-400 text-sm">Family Tours</li>
                </>
              )}
              <li>
                <Link href="/packages" className="text-orange-500 hover:underline text-sm font-semibold mt-2 block">
                  View All Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <ArrowRight size={12} className="text-orange-500" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Rotating SEO Chips */}
        <div className="border-t border-gray-800 pt-10 mb-10">
          <div className="flex flex-col items-center mb-6">
             <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 via-orange-100 to-teal-400 bg-clip-text text-transparent mb-2">Explore Your Next Adventure</h3>
             <p className="text-gray-500 text-sm">Dynamic suggestions for your perfect getaway</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {rotatingChips.map((chip, idx) => (
              <Link 
                key={`${chip.label}-${idx}`} 
                href={chip.href} 
                className={`px-4 py-2 border rounded-full text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${getChipStyle(idx)}`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Serving Travelers Section */}
        <div className="border-t border-gray-800 pt-10 mb-12">
          <h3 className="text-sm font-bold mb-6 text-gray-300 text-center uppercase tracking-[0.2em]">Serving Travelers To All Major Tourist Spots all over Globe</h3>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {servingCities.map((city) => (
              <Link key={city} href={`/destinations/${city.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors">
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Long SEO Content */}
        <div className="border-t border-gray-800 pt-10 mb-12">
          <h3 className="text-lg font-bold mb-4 text-white">Best International Tour Packages from India</h3>
          <div className="text-gray-500 text-xs leading-relaxed space-y-4">
            <p>
              TripLinkers is India's premier travel agency specializing in international tour packages, honeymoon packages, family vacations, and customized travel experiences. We offer the best deals on Dubai tour packages, Maldives honeymoon packages, Singapore family tours, Thailand beach holidays, Europe tours, and more.
            </p>
            <p>
              With over 10,000 satisfied customers, TripLinkers provides affordable tour packages, luxury travel experiences, adventure trips, and group tours to destinations worldwide with complete visa assistance, flight bookings, and 24/7 customer support.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-gray-500">
             <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Safe</div>
             <div className="flex items-center gap-2"><Lock size={16} className="text-emerald-500" /> Secure</div>
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Trusted</div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>© {new Date().getFullYear()} TripLinkers. All rights reserved.</p>
              <p className="text-[10px] opacity-70 uppercase tracking-widest">A product of Spacelinkers Infotech Private Limited</p>
            </div>
            
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
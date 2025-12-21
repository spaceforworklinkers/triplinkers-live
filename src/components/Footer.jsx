"use client";

import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Globe, Award, Shield, Headphones, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PWAInstallMini from "@/components/PWAInstallMini";


const Footer = () => {
  const popularDestinations = [
    { name: "Dubai Tour Packages", href: "/destinations/dubai" },
    { name: "Maldives Honeymoon", href: "/destinations/maldives" },
    { name: "Singapore Tours", href: "/destinations/singapore" },
    { name: "Thailand Holidays", href: "/destinations/thailand" },
    { name: "Europe Packages", href: "/destinations/europe" },
    { name: "Bali Holidays", href: "/destinations/bali" },
  ];

  const tourPackages = [
    { name: "International Tours", href: "/packages/international" },
    { name: "Honeymoon Packages", href: "/packages/honeymoon" },
    { name: "Family Tours", href: "/packages/family" },
    { name: "Adventure Travel", href: "/packages/adventure" },
    { name: "Luxury Packages", href: "/packages/luxury" },
    { name: "Budget Tours", href: "/packages/budget" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Travel Blog", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
    { name: "Customer Reviews", href: "/reviews" },
    { name: "Careers", href: "/careers" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const indianCities = [  "Paris",
  "Dubai",
  "London",
  "New York",
  "Bangkok",
  "Singapore",
  "Tokyo",
  "Rome",
  "Barcelona",
  "Istanbul",
  "Bali",
  "Amsterdam",
  "Prague",
  "Vienna",
  "Zurich",
  "Hong Kong",
  "Kuala Lumpur",
  "Maldives",
  "Sydney",
  "Cape Town"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges Section */}
      {/* <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white text-2xl mb-1">10,000+</h4>
              <p className="text-orange-100 text-sm font-medium">Happy Travelers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white text-2xl mb-1">100% Safe</h4>
              <p className="text-orange-100 text-sm font-medium">Secure Booking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white text-2xl mb-1">24/7</h4>
              <p className="text-orange-100 text-sm font-medium">Customer Support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white text-2xl mb-1">50+</h4>
              <p className="text-orange-100 text-sm font-medium">Countries Covered</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div>
            <Image
              src="/images/logo/triplinkers-svg.svg"
              alt="TripLinkers - Best Travel Agency in India"
              width={180}
              height={54}
              className="h-20 w-auto mb-6 brightness-0 invert"
            />

            <p className="text-gray-400 mb-6 leading-relaxed">
              India's leading travel agency for international tour packages, honeymoon trips, and customized travel experiences.
            </p>

            <div className="flex gap-3 mb-8">
              <a 
                href="https://facebook.com/triplinkers" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/triplinkers" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/triplinkers" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/triplinkers" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="space-y-4">
              <a 
                href="mailto:info@triplinkers.com" 
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>info@triplinkers.com</span>
              </a>
              <a 
                href="tel:+915551234567" 
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+91 92864 68530</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Spacelinkers Infotech Pvt Ltd Corporate Office,<br/>Noida, Uttar Pradesh   India - 201307</span>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Popular Destinations</h3>
            <ul className="space-y-3">
              {popularDestinations.map((destination) => (
                <li key={destination.name}>
                  <Link 
                    href={destination.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                    <span>{destination.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link 
              href="/destinations" 
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold mt-6 transition-colors"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tour Packages */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Tour Packages</h3>
            <ul className="space-y-3">
              {tourPackages.map((pkg) => (
                <li key={pkg.name}>
                  <Link 
                    href={pkg.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                    <span>{pkg.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link 
              href="/packages" 
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold mt-6 transition-colors"
            >
              View All Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-6 bg-gray-800 rounded-2xl border border-gray-700 select-none">
              <h4 className="font-bold text-white mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm mb-4">Our travel experts are ready to assist you</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-3 rounded-xl transition-all"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* City Tags */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <h3 className="text-lg font-bold mb-6 text-white text-center">
            Serving Travelers To All Major Tourist Spots all over Globe
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {indianCities.map((city) => (
              <Link
                key={city}
                href={`/tours-from-${city.toLowerCase()}`}
                className="px-5 py-2.5 bg-gray-800 hover:bg-orange-600 rounded-xl text-sm text-gray-300 hover:text-white transition-all font-medium"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-gray-800 rounded-3xl p-8 md:p-10 mb-12">
          <h3 className="text-2xl font-bold mb-4 text-white text-center">
            Best International Tour Packages from India
          </h3>
          <p className="text-gray-400 leading-relaxed mb-4 text-center max-w-4xl mx-auto">
            TripLinkers is India's premier travel agency specializing in international tour packages, honeymoon packages, family vacations, and customized travel experiences. We offer the best deals on Dubai tour packages, Maldives honeymoon packages, Singapore family tours, Thailand beach holidays, Europe tours, and more.
          </p>
          <p className="text-gray-400 leading-relaxed text-center max-w-4xl mx-auto">
            With over 10,000 satisfied customers, TripLinkers provides affordable tour packages, luxury travel experiences, adventure trips, and group tours to destinations worldwide with complete visa assistance, flight bookings, and 24/7 customer support.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 mb-2">
                © {new Date().getFullYear()} TripLinkers. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                A product of <span className="text-gray-300 font-semibold"><Link href="https://spacelinkers.com"> Spacelinkers Infotech Private Limited</Link></span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="mt-6 flex justify-center">
  <PWAInstallMini />
</div>

              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Safe
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Secure
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Trusted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "TripLinkers",
            "description": "India's leading travel agency for international tour packages",
            "url": "https://triplinkers.com",
            "logo": "https://triplinkers.com/images/logo/triplinkers-svg.svg",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Travel Street",
              "addressLocality": "New Delhi",
              "addressCountry": "IN",
              "postalCode": "110001"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-555-123-4567",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://facebook.com/triplinkers",
              "https://instagram.com/triplinkers",
              "https://twitter.com/triplinkers",
              "https://linkedin.com/company/triplinkers"
            ]
          })
        }}
      />
    </footer>
  );
};

export default Footer;
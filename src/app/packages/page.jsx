"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Users, Heart, Briefcase, Accessibility, Palmtree, Plane } from "lucide-react";

const packages = [
  {
    id: "single",
    title: "Solo Traveler Adventure",
    description:
      "Discover Dubai at your own pace specifically curated for the independent explorer. Meet new people and see the city your way.",
    idealFor: "Solo Travelers, Backpackers",
    duration: "4-7 Days",
    inclusions: ["Airport Transfers", "City Tour", "Desert Safari", "4★ Hotel Stay", "Sim Card"],
    exclusions: ["Flights", "Personal Expenses", "Visa Fees"],
    price: 899,
    icon: User,
    color: "text-blue-500"
  },
  {
    id: "duo",
    title: "Dynamic Duo Escape",
    description:
      "Perfect for best friends or siblings. Experience the thrill of Dubai's theme parks and shopping together.",
    idealFor: "Friends, Siblings, Partners",
    duration: "5-8 Days",
    inclusions: ["Theme Park Tickets", "Shopping Tour", "Dhow Cruise Dinner", "Hotel Breakfasts", "Metro Pass"],
    exclusions: ["Flights", "Lunch & Dinner", "Travel Insurance"],
    price: 1499,
    icon: Users,
    color: "text-teal-500"
  },
  {
    id: "honeymoon",
    title: "Romantic Honeymoon",
    description:
      "Create unforgettable memories with a luxurious, romantic getaway. Candlelit dinners, sunset cruises, and private tours.",
    idealFor: "Newlyweds, Couples",
    duration: "6-10 Days",
    inclusions: [
      "Limousine Transfer",
      "Romantic Dinner on Yacht",
      "Couple Spa Session",
      "5★ Luxury Resort",
      "Private Desert Dinner"
    ],
    exclusions: ["Flights", "Souvenirs", "Optional Activities"],
    price: 2999,
    icon: Heart,
    color: "text-rose-500"
  },
  {
    id: "family",
    title: "Family Fun Bonanza",
    description:
      "A stress-free, action-packed itinerary that keeps both kids and adults entertained. Safe, comfortable, and full of wonder.",
    idealFor: "Families with Kids",
    duration: "5-9 Days",
    inclusions: [
      "Kid-Friendly Hotel",
      "Aquarium & Zoo Tickets",
      "Global Village",
      "Private Van Transfer",
      "Miracle Garden"
    ],
    exclusions: ["Flights", "Stroller Rental", "Baby Sitting Services"],
    price: 2499,
    icon: Palmtree,
    color: "text-orange-500"
  },
  {
    id: "group",
    title: "Friends Reunion",
    description:
      "The ultimate trip for your squad. Beach clubs, nightlife, adventure sports, and group dining experiences.",
    idealFor: "Small Groups (3-6 people)",
    duration: "4-8 Days",
    inclusions: [
      "Group Apart-Hotel",
      "Yacht Party Access",
      "Dune Buggy Adventure",
      "Beach Club Entry",
      "Airport Shuttle"
    ],
    exclusions: ["Flights", "Alcoholic Beverages", "Club Entry Fees"],
    price: 1899,
    icon: Users,
    color: "text-indigo-500"
  },
  {
    id: "large-group",
    title: "Grand Group Tour",
    description:
      "Logistics handled perfectly for large parties. Enjoy group discounts and exclusive private guided tours.",
    idealFor: "Large Parties (10+), Extended Families",
    duration: "5-10 Days",
    inclusions: [
      "Private Bus Rental",
      "Dedicated Guide",
      "Group Buffet Dinners",
      "Bulk Attraction Tickets",
      "Coordinator Support"
    ],
    exclusions: ["Flights", "Individual Tipping", "Private Expenses"],
    price: 3999,
    icon: Users,
    color: "text-purple-500"
  },
  {
    id: "corporate",
    title: "Corporate Retreat",
    description:
      "Balance business with pleasure. Conference facilities combined with team-building desert activities and gala dinners.",
    idealFor: "Companies, Teams, Executives",
    duration: "3-5 Days",
    inclusions: [
      "Conference Room Booking",
      "Team Building Safari",
      "Gala Dinner Venue",
      "Executive Transport",
      "Business Hotel"
    ],
    exclusions: ["Flights", "Equipment Rental", "Branding Materials"],
    price: 4500,
    icon: Briefcase,
    color: "text-slate-600"
  },
  {
    id: "senior",
    title: "Golden Age Discovery",
    description:
      "Relaxed pace, accessible attractions, and comfortable transport. Enjoy the culture and sights without the rush.",
    idealFor: "Senior Citizens, Retirees",
    duration: "6-12 Days",
    inclusions: [
      "Accessible Transport",
      "Cultural Heritage Tours",
      "Wheelchair Assistance",
      "Premium 4★ Hotel",
      "Guided Museum Tours"
    ],
    exclusions: ["Flights", "Medical Insurance", "Specialized Care"],
    price: 1799,
    icon: Accessibility,
    color: "text-emerald-600"
  }
];

export default function Packages() {
  const router = useRouter();

  const handleGetQuote = () => {
    router.push("/?scrollTo=inquiry-form");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Curated <span className="text-teal-600">Dubai Packages</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package tailored to your travel style. From solo adventures to corporate retreats, we have it all covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gray-50 ${pkg.color}`}>
                    <pkg.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {pkg.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-900 shrink-0">
                      Ideal For:
                    </span>
                    <span className="text-gray-600">{pkg.idealFor}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900 shrink-0">
                      Duration:
                    </span>
                    <span className="text-gray-600">{pkg.duration}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                      Includes
                    </span>
                    <ul className="mt-1 space-y-1">
                      {pkg.inclusions.slice(0, 3).map((inc, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-teal-400"></span>
                          {inc}
                        </li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className="text-xs text-gray-400 italic">
                          + {pkg.inclusions.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-gray-900">${pkg.price}</p>
                  </div>
                  <span className="text-xs text-gray-400">per person</span>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plane className="w-4 h-4" />
                  Get quote for Dubai Trip
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

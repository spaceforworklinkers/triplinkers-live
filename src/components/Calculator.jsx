"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Calculator as CalcIcon, Users, Calendar, CheckCircle2 } from "lucide-react";

const hotelCategories = [
  { id: "3star", name: "3 Star", pricePerNight: 4000, activeClass: "bg-amber-500 text-white" },
  { id: "4star", name: "4 Star", pricePerNight: 7000, activeClass: "bg-orange-500 text-white" },
  { id: "5star", name: "5 Star", pricePerNight: 12000, activeClass: "bg-teal-600 text-white" }
];

const addOns = [
  { id: "desert", name: "Desert Safari", price: 6500 },
  { id: "burj", name: "Burj Khalifa", price: 9000 },
  { id: "frame", name: "Dubai Frame", price: 3000 },
  { id: "ferrari", name: "Ferrari World", price: 11000 },
  { id: "atlantis", name: "Atlantis Aquarium", price: 8500 },
  { id: "dhow", name: "Dhow Cruise", price: 5000 }
];

const Calculator = () => {
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(5);
  const [selectedHotel, setSelectedHotel] = useState("4star");
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // COST CALCULATIONS IN INR
  const calculateTotal = () => {
    const hotelCategory = hotelCategories.find((h) => h.id === selectedHotel);

    const hotelCost = hotelCategory.pricePerNight * days * travelers;

    const addOnsCost = selectedAddOns.reduce((total, addonId) => {
      const addon = addOns.find((a) => a.id === addonId);
      return total + addon.price * travelers;
    }, 0);

    const flightEstimate = 25000 * travelers; // average India → Dubai return flight

    return hotelCost + addOnsCost + flightEstimate;
  };

  const total = calculateTotal();
  const perPerson = total / travelers;

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full text-teal-700 mb-4">
            <CalcIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Trip Cost Estimator (INR)</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Perfect <span className="text-teal-600">Dubai Trip</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All pricing shown in Indian Rupees (₹)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-slate-50 rounded-3xl shadow-lg p-8 md:p-12 border border-slate-100"
        >
          <div className="grid md:grid-cols-2 gap-12">

            {/* LEFT */}
            <div className="space-y-8">

              {/* Travelers */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-900 text-lg">Number of Travelers</span>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-teal-600 mb-4">
                    {travelers} {travelers === 1 ? "Person" : "People"}
                  </div>

                  <Slider
                    value={[travelers]}
                    onValueChange={(val) => setTravelers(val[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                  />

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Days */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-900 text-lg">Trip Duration</span>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    {days} {days === 1 ? "Day" : "Days"}
                  </div>

                  <Slider
                    value={[days]}
                    onValueChange={(val) => setDays(val[0])}
                    min={3}
                    max={14}
                    step={1}
                    className="mb-2"
                  />

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>3 days</span>
                    <span>14 days</span>
                  </div>
                </div>
              </div>

              {/* Hotels */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Hotel Category</h3>

                <div className="grid grid-cols-3 gap-3">
                  {hotelCategories.map((hotel) => (
                    <button
                      key={hotel.id}
                      onClick={() => setSelectedHotel(hotel.id)}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 border ${
                        selectedHotel === hotel.id
                          ? `${hotel.activeClass} border-transparent shadow-lg scale-105`
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      {hotel.name}
                      <div className="text-xs opacity-80 mt-1">
                        ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-8">

              {/* Add-ons */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Add-On Experiences</h3>

                <div className="grid grid-cols-2 gap-3">
                  {addOns.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 relative border ${
                        selectedAddOns.includes(addon.id)
                          ? "bg-teal-600 text-white border-teal-600 shadow-lg scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      {selectedAddOns.includes(addon.id) && (
                        <CheckCircle2 className="w-5 h-5 absolute top-2 right-2" />
                      )}

                      <div className="font-semibold mb-1">{addon.name}</div>
                      <div className="text-sm opacity-90">
                        ₹{addon.price.toLocaleString("en-IN")} / person
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Estimated Cost</h3>

                <div className="space-y-4 mb-6">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Total Trip Cost</span>
                    <span className="text-3xl font-bold">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-px bg-gray-700"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Per Person</span>
                    <span className="text-2xl font-bold">
                      ₹{perPerson.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
                  <p className="leading-relaxed text-gray-300">
                    💡 This is an approximate estimate. Final pricing may vary based on travel dates and availability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              onClick={() =>
                document.getElementById("inquiry-form").scrollIntoView({ behavior: "smooth" })
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get quote for Dubai Trip
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;

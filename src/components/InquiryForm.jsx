"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    month: "",
    travelers: "",
    budget: "",
    from: "",
    to: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to localStorage (still kept as your original logic)
    const existingData = JSON.parse(localStorage.getItem("tripInquiries") || "[]");
    const newInquiry = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    existingData.push(newInquiry);
    localStorage.setItem("tripInquiries", JSON.stringify(existingData));

    setSubmitted(true);

    toast({
      title: "Inquiry Submitted Successfully! 🎉",
      description: "Our travel expert will contact you shortly"
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        month: "",
        travelers: "",
        budget: "",
        from: "",
        to: ""
      });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ------------------------------------------
     SUCCESS MESSAGE UI
  ------------------------------------------- */
  if (submitted) {
    return (
      <section id="inquiry-form" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-slate-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-teal-600" />
            </motion.div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>

            <p className="text-xl text-gray-700 font-semibold mb-2">
              Our travel expert will contact you shortly
            </p>

            <p className="text-gray-600">
              We are excited to help you plan your perfect trip!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------
     MAIN FORM UI
  ------------------------------------------- */
  return (
    <section id="inquiry-form" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to Plan Your <span className="text-orange-500">Next Journey?</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the details below and our travel experts will create a personalized quote for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200"
          >

            {/* ROW 1 - NAME + PHONE */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* ROW 2 - EMAIL */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* ROW 3 - SOURCE + DESTINATION */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Where are you traveling from? *</label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Delhi, Mumbai, Bangalore..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Where do you want to go? *</label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Dubai, Bali, Maldives..."
                />
              </div>
            </div>

            {/* ROW 4 - MONTH + TRAVELERS */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Travel Month *</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  <option value="">Select month</option>
                  {[
                    "January","February","March","April","May","June",
                    "July","August","September","October","November","December"
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Number of Travelers *</label>
                <input
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="2"
                />
              </div>
            </div>

            {/* ROW 5 - BUDGET */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">Budget Preference *</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              >
                <option value="">Select your budget</option>
                <option value="Economical">Economical</option>
                <option value="Budget Friendly">Budget Friendly</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Inquiry
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default InquiryForm;

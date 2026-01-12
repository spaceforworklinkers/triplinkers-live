"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitted(false);

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    // 1️⃣ EMAIL (Web3Forms)
    const emailRes = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
        subject: `Contact Form: ${formData.subject}`,
        from_name: "TripLinkers Website",
        ...payload,
      }),
    });

    const emailJson = await emailRes.json();
    if (!emailJson.success) throw new Error("Email failed");

    // 2️⃣ SAVE TO DASHBOARD
    const apiRes = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        source: "Contact Page",
      }),
    });

    const apiJson = await apiRes.json();
    if (!apiRes.ok || !apiJson.success) {
      throw new Error(apiJson.message || "Lead save failed");
    }

    // ✅ SUCCESS UI (unchanged)
    setIsSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);

  } catch (err) {
    console.error("Contact submit error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">We're Here to Help</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Let's Start Planning Your Journey
            </h1>
            <p className="text-xl text-orange-100 leading-relaxed">
              Have questions? Need help planning your perfect Dubai experience? Our team is ready to assist you every step of the way.
            </p>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Call Us</h3>
                <p className="text-orange-600 font-semibold text-lg mb-1">+1 (555) 123-4567</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Fri, 9am-6pm GST</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Email Us</h3>
                <p className="text-orange-600 font-semibold text-lg mb-1">info@triplinkers.com</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>We reply within 24 hours</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-1">123 Travel Street</p>
                <p className="text-gray-600">Dubai, UAE</p>
              </div>

              {/* Quick Info Box */}
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-2xl border border-orange-200">
                <h4 className="font-bold text-gray-900 mb-3">Quick Response</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our team typically responds within 2-4 hours during business hours. For urgent inquiries, please call us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Send Us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us about your travel plans, questions, or how we can assist you..."
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isSubmitted
                        ? "bg-green-600 text-white"
                        : "bg-orange-600 hover:bg-orange-700 text-white hover:shadow-xl"
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Message Sent Successfully!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 md:p-10 rounded-3xl border border-orange-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">How quickly will you respond?</h3>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 2-4 hours during business hours and within 24 hours on weekends.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Can I customize my tour?</h3>
                <p className="text-gray-600">
                  Absolutely! All our tours are fully customizable to match your interests, schedule, and budget preferences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Do you offer group discounts?</h3>
                <p className="text-gray-600">
                  Yes, we offer special rates for groups of 6 or more people. Contact us for a personalized quote.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">What's your cancellation policy?</h3>
                <p className="text-gray-600">
                  Free cancellation up to 48 hours before your tour. Full details provided during booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Dubai?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of satisfied travelers who've experienced Dubai with TripLinkers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all shadow-xl">
                View Our Packages
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Browse Tours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Contact;
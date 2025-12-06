"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What's included in a typical Dubai package?",
    answer:
      "Our Dubai packages typically include round-trip flights, hotel accommodations, airport transfers, daily breakfast, and select tours/activities. You can customize any package to fit your preferences and budget."
  },
  {
    question: "When is the best time to visit Dubai?",
    answer:
      "The best time to visit Dubai is during the cooler months from November to March, when temperatures are pleasant (20-30°C). However, Dubai is a year-round destination with indoor attractions and activities available during summer months."
  },
  {
    question: "Do I need a visa to visit Dubai?",
    answer:
      "Visa requirements vary by nationality. Many countries are eligible for visa-on-arrival or visa-free entry. We'll help you understand the requirements and assist with the visa process if needed."
  },
  {
    question: "How quickly can I get my trip quote?",
    answer:
      "Our Dubai travel experts will contact you within 15-30 minutes of submitting your inquiry. We pride ourselves on quick response times and personalized service."
  },
  {
    question: "Can I customize my Dubai itinerary?",
    answer:
      "Absolutely! We specialize in creating personalized experiences. Whether you want more adventure activities, luxury experiences, family-friendly attractions, or cultural tours, we'll tailor everything to your preferences."
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank transfers, and digital payment methods. A deposit is typically required to confirm your booking, with the balance due before your departure date."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full text-teal-700 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Got Questions?</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about planning your Dubai trip
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-teal-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 pr-8">{faq.question}</h3>

                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-teal-600" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Still have questions?</p>

          <button
            onClick={() =>
              document.getElementById("inquiry-form").scrollIntoView({ behavior: "smooth" })
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Get quote for Dubai Trip
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

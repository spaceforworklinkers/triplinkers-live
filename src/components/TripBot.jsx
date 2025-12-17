"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    id: "intro",
    message:
      "Hi 👋 I will help you plan a personalized trip. I will ask just a few quick questions so our expert can design something truly for you.",
    options: [{ label: "Sure, let's start 😊", value: "start" }],
  },
  {
    id: "destination",
    message: "First, where are you planning to travel?",
    options: [
      { label: "🇮🇳 India", value: "india" },
      { label: "🌍 International", value: "international" },
    ],
  },
  {
    id: "timeline",
    message:
      "Got it. When are you thinking of traveling? This helps us personalize availability and pricing.",
    options: [
      { label: "Next 1–2 months", value: "1-2" },
      { label: "3–6 months", value: "3-6" },
      { label: "Just exploring options", value: "explore" },
    ],
  },
  {
    id: "intent",
    message:
      "What would you like help with? You can change this later.",
    options: [
      { label: "Destination & itinerary ideas", value: "itinerary" },
      { label: "Packages & pricing", value: "packages" },
      { label: "Complete trip planning", value: "full_planning" },
    ],
  },
  {
    id: "contact_method",
    message:
      "Perfect. How should our travel expert contact you?",
    options: [
      { label: "📧 Email", value: "email" },
      { label: "📱 WhatsApp", value: "phone" },
    ],
  },
];

export default function TripBot() {
  const [stepIndex, setStepIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStep = STEPS[stepIndex];

  const goNext = (value) => {
    setHistory((h) => [...h, stepIndex]);
    setAnswers((a) => ({
      ...a,
      [currentStep.id]: value,
    }));
    setTimeout(() => setStepIndex((i) => i + 1), 250);
  };

  const goBack = () => {
    setHistory((h) => {
      const newHistory = [...h];
      const prev = newHistory.pop();
      if (prev !== undefined) {
        setStepIndex(prev);
      }
      return newHistory;
    });
  };

  const restartBot = () => {
    setStepIndex(0);
    setHistory([]);
    setAnswers({});
    setEmail("");
    setPhone("");
    setCompleted(false);
  };

  const submitLead = async () => {
    try {
      setSubmitting(true);
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "trip_bot",
          destination: answers.destination,
          travel_time: answers.timeline,
          intent: answers.intent,
          email: answers.contact_method === "email" ? email : null,
          phone: answers.contact_method === "phone" ? phone : null,
        }),
      });
      localStorage.setItem("tripbot_lead_done", "true");
      setCompleted(true);
    } catch (e) {
      console.error("TripBot lead submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {!completed && currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
              {currentStep.message}
            </p>

            <div className="space-y-3">
              {currentStep.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => goNext(opt.value)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-black transition text-sm font-medium"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {!completed && stepIndex === STEPS.length && (
          <motion.div
            key="contact-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium mb-3">
              {answers.contact_method === "email"
                ? "Please enter your email ID"
                : "Please enter your WhatsApp number"}
            </p>

            <input
              type={answers.contact_method === "email" ? "email" : "tel"}
              value={answers.contact_method === "email" ? email : phone}
              onChange={(e) =>
                answers.contact_method === "email"
                  ? setEmail(e.target.value)
                  : setPhone(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border text-sm mb-3"
            />

            <button
              onClick={submitLead}
              disabled={
                submitting ||
                (answers.contact_method === "email" ? !email : !phone)
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-sm"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </motion.div>
        )}

        {completed && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium mb-4">
              ✅ Thanks! Our travel expert will contact you shortly with a personalized plan.
            </p>

            <button
              onClick={restartBot}
              className="text-sm underline text-gray-600"
            >
              Start over
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!completed && history.length > 0 && (
        <button
          onClick={goBack}
          className="mt-6 text-xs text-gray-500 underline self-start"
        >
          ← Go back
        </button>
      )}
    </div>
  );
}
  
// src/lib/tripBotFlow.js

export const tripBotFlow = [
  {
    step: "travel_type",
    question: "Where are you planning to travel?",
    options: [
      { label: "India", value: "india" },
      { label: "International", value: "international" },
      { label: "Not decided yet", value: "undecided" }
    ]
  },
  {
    step: "trip_style",
    question: "Who are you traveling with?",
    options: [
      { label: "Family", value: "family" },
      { label: "Couple", value: "couple" },
      { label: "Friends", value: "friends" },
      { label: "Solo", value: "solo" }
    ]
  },
  {
    step: "timeline",
    question: "When are you planning the trip?",
    options: [
      { label: "Within 1 month", value: "1_month" },
      { label: "1 to 3 months", value: "1_3_months" },
      { label: "Just exploring", value: "exploring" }
    ]
  },
  {
    step: "budget",
    question: "What is your approximate budget?",
    options: [
      { label: "Budget friendly", value: "low" },
      { label: "Mid range", value: "medium" },
      { label: "Luxury", value: "high" }
    ]
  },
  {
    step: "lead_action",
    question: "How would you like to continue?",
    options: [
      { label: "Get itinerary on WhatsApp", value: "whatsapp" },
      { label: "Get itinerary on Email", value: "email" }
    ]
  }
];

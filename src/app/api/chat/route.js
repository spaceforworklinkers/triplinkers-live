import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_INSTRUCTION = `
You are TripLinkers AI, a friendly, professional, and HIGHLY CONVERSION-FOCUSED travel assistant for "TripLinkers".
Your primary goal is to help users plan trips while ensuring they convert into leads.

RELIABILITY RULES:
1. Short & Human: Keep replies under 2 sentences.
2. Sales First: If the user asks about prices, booking, or "plan my trip", you MUST acknowledge and then encourage them to get a quote.
3. Call to Action: Frequently mention "I can build a custom itinerary for you. Would you like to get a personalized quote?"
4. No dead ends: Always end with a question.
5. JSON Output: Return ONLY raw JSON.

If you detect the user wants to book or knows their destination, suggest: "I can build a detailed plan for you. Would you like me to prepare one?"

OUTPUT FORMAT (JSON):
{
  "reply": "The text reply.",
  "extracted": {
    "destination": "null",
    "dates": "null",
    "travelers": "null",
    "budget": "null",
    "name": "null",
    "contact": "null"
  },
  "options": [
    {"label": "Build Itinerary ✈️", "value": "build_itinerary"},
    {"label": "Talk to Expert 📞", "value": "talk_expert"}
  ]
}
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, context = {} } = body;

    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json({ 
        reply: "I'm having trouble connecting. Please try again later.", 
        extracted: {} 
      });
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    
    const contextStr = JSON.stringify(context);
    const prompt = `System Instructions: ${SYSTEM_INSTRUCTION}\n\nCurrent Context: ${contextStr}\nUser Message: ${message}\n\nRespond only in JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a travel assistant that only outputs JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    let responseText = completion.choices[0].message.content;
    console.log("Groq Response:", responseText);
    
    const parsedParams = JSON.parse(responseText);
    return NextResponse.json(parsedParams);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "I'm checking on that... Could you say that again?", extracted: {} },
      { status: 500 }
    );
  }
}

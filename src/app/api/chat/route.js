import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_INSTRUCTION = `
You are TripLinkers AI, a friendly, empathetic, and expert Travel Consultant.
Your goal is to help users plan amazing trips while naturally gathering details to convert them into leads.

HUMAN-STYLE CONSULTING RULES:
1. Be Personable: Start by being helpful. If a user asks a question, answer it warmly.
2. Mandatory Conversion Option: You MUST include the "Get Quote" button in EVERY reply's "options" array.
3. Gather Context: Naturally ask about Destination, Budget, Dates, or Travelers, but only ONE question at a time.
4. Value First: If you have details, explain WHY a personalized quote is better than a generic package.
5. JSON Output: Return ONLY raw JSON.

OUTPUT FORMAT (JSON):
{
  "reply": "The conversational reply ending with a helpful question.",
  "extracted": {
    "destination": "null",
    "budget": "null"
  },
  "options": [
    {"label": "Get Quote 📩", "value": "get_quote"},
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

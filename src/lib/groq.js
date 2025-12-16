import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateWithGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content:
          "You are TripLinkers AI, a factual and practical travel planner. Use real locations, real distances, and realistic costs. Output plain text only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
    max_tokens: 2000,
  });

  return response?.choices?.[0]?.message?.content || null;
}

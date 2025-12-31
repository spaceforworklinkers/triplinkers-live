import { NextResponse } from "next/server";
import { generateWithGroq } from "@/lib/groq";

/* ---------------- RATE LIMIT ---------------- */

const rateLimitMap = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.start > 15 * 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

function rateLimit(ip, limit = 3, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return true;
}

/* ---------------- HELPERS ---------------- */

function formatCoord(raw) {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  if (Number.isNaN(n)) return null;
  return Number(n.toFixed(6));
}

/* ---------------- API ---------------- */

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    req.headers.get("user-agent") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { destination, budget, tripType, days } = body || {};

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY?.trim();
    if (!GEMINI_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const destLabel =
      destination?.label ||
      destination?.value?.display_name ||
      destination?.value?.formatted_address ||
      "Unknown destination";

    const lat =
      formatCoord(
        destination?.value?.lat ?? destination?.value?.latitude
      ) ?? "Unknown";

    const lon =
      formatCoord(
        destination?.value?.lon ??
          destination?.value?.lng ??
          destination?.value?.longitude
      ) ?? "Unknown";

    const finalDays = days || 5;

    const geminiPrompt = `
You are TripLinkers AI, a factual travel planner.

Destination: ${destLabel}
Latitude: ${lat}
Longitude: ${lon}

Days: ${finalDays}
Budget: ${budget || "Moderate"}
Trip Type: ${tripType || "General"}

Return a realistic day-wise itinerary in plain text only.
`;

    const groqPrompt = `
Generate a concise travel itinerary.

Destination: ${destLabel}
Days: ${finalDays}
Budget: ${budget || "Moderate"}
Trip Type: ${tripType || "General"}
`;

    /* ---------------- GEMINI PRIORITY ENFORCEMENT ---------------- */
    
    // STRICT USER REQUIREMENT: Use gemini-2.5-flash ONLY.
    // Other models (1.5, 2.0-flash, etc.) are confirmed to fail for this project key.
    const GEMINI_MODELS = ["gemini-2.5-flash"];
    
    let output = null;
    let provider = "gemini";
    let geminiSuccess = false;

    // 1. Attempt Gemini 2.5 Flash
    for (const model of GEMINI_MODELS) {
      if (geminiSuccess) break;

      try {
        console.log(`[AI] Attempting Gemini model: ${model}`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
            }),
          }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Status ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text)
            ?.join("\n")
            ?.trim();

        if (typeof text === "string" && text.length > 0) {
          output = text;
          geminiSuccess = true;
          console.log(`[AI] Gemini SUCCESS with ${model}`);
        } else {
          throw new Error("Empty response");
        }
      } catch (err) {
        console.warn(`[AI] ${model} failed: ${err.message}`);
        // Log to console only
      }
    }

    // 2. Final Fallback to Groq
    if (!output) {
      console.warn("[AI] Gemini 2.5 Flash failed. Switching to Groq.");
      
      try {
        provider = "groq";
        output = await generateWithGroq(groqPrompt);
      } catch (err) {
        console.error("[AI] Groq fallback failed:", err.message);
      }
    }

    if (!output || output.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to generate itinerary." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      output,
      provider,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

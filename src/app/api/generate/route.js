import { NextResponse } from "next/server";
import { generateWithGroq } from "@/lib/groq";

const rateLimitMap = new Map();

function rateLimit(ip, limit = 3, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return true;
}

// Helper: Format coordinate precision
function formatCoord(raw) {
  if (raw === null || raw === undefined) return null;
  const n = Number(raw);
  if (Number.isNaN(n)) return null;
  return Number(n.toFixed(6));
}

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    req.headers.get("user-agent") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      {
        error:
          "Too many itinerary requests. Please wait a few minutes before trying again.",
      },
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

    const key = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-flash";

    if (!key) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY on server" },
        { status: 500 }
      );
    }

    /* -----------------------------------------
       BUILD COORDINATE-AWARE DYNAMIC PROMPT
    ----------------------------------------- */

    const destLabel =
      destination?.label ||
      destination?.value?.name ||
      destination?.value?.display_name ||
      destination?.value?.formatted_address ||
      "Unknown destination";

    const placeId = destination?.value?.place_id || "Unknown";

    const latRaw =
      destination?.value?.lat ?? destination?.value?.latitude ?? null;

    const lonRaw =
      destination?.value?.lon ??
      destination?.value?.lng ??
      destination?.value?.longitude ??
      null;

    const lat = formatCoord(latRaw) ?? "Unknown";
    const lon = formatCoord(lonRaw) ?? "Unknown";

    const displayName =
      destination?.value?.display_name ||
      destination?.value?.formatted_address ||
      destLabel;

    const finalDays = days || 5;

    const prompt = `
You are TripLinkers AI, a highly factual, coordinate-driven travel planner.

USER DESTINATION DATA:
- Human Label: ${destLabel}
- Display Name: ${displayName}
- Place ID: ${placeId}
- Latitude: ${lat}
- Longitude: ${lon}

CRITICAL RULES:
1. Identify the correct city or region using ONLY the coordinates.
2. Do NOT assume Dubai unless the coordinates actually belong to Dubai.
3. If coordinates are unknown, state that clearly and avoid guessing.
4. Use real places, real distances, real neighbourhoods.
5. Output must be plain text only. No markdown. Avoid excessive emojis.


TRIP INPUTS:
- Days: ${finalDays}
- Budget: ${budget || "Moderate"}
- Trip Type: ${tripType || "General"}

REQUIRED OUTPUT FORMAT (PLAIN TEXT ONLY):

1) Introduction  
   Mention the correct location based on coordinates but dont show coordinates.

2) Best Time To Visit  
   Region-specific climate guidance.

3) Top 6 Attractions  
   Use only real attractions in the region.

4) Day-by-Day Itinerary (${finalDays} Days)
   For each day include:
   - Morning plan
   - Afternoon plan
   - Evening plan
   - Travel time or distance between places
   - One food recommendation
   - Approx cost in local currency + INR

5) Hotels (3 real hotels based on budget and coordinates)

6) Optional Add-Ons (5 items)

7) Travel Tips  
   Real, region-specific cultural and practical guidance.

8) 2-Line Conclusion
`;
    const compactPrompt = `
You are TripLinkers AI.

Generate a concise, factual travel itinerary using real locations.

Destination: ${displayName}
Location coordinates provided internally for accuracy.
Days: ${finalDays}
Budget: ${budget || "Moderate"}
Trip Type: ${tripType || "General"}

Output plain text only.

Include:
- Short introduction
- Day-wise itinerary
- 3 hotels
- Travel tips
`;

    /* -----------------------------------------
       GEMINI PRIMARY + GROQ FALLBACK (WITH TIMEOUT)
    ----------------------------------------- */

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let rawText = null;
    let usedFallback = false;

    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      rawText = await upstream.text();
      clearTimeout(timeout);

      if (!upstream.ok) {
        throw new Error(rawText);
      }
    } catch (err) {
      clearTimeout(timeout);

      const fallbackLog = {
        event: "GROQ_FALLBACK_USED",
        reason: err.name === "AbortError" ? "TIMEOUT" : "GEMINI_ERROR",
        destination: displayName,
        timestamp: new Date().toISOString(),
      };

      console.warn("AI FALLBACK LOG:", fallbackLog);

      usedFallback = true;
    }

    let output;

    if (!usedFallback) {
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error("Gemini returned invalid JSON");
      }

      output =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0] ||
        data?.text ||
        null;
    } else {
      output = await generateWithGroq(compactPrompt);
    }

    if (!output || output.trim() === "") {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ output });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

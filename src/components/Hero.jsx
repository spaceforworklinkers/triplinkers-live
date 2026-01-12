"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, MapPin, Plane, Globe, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------
   FreePlacesAutocomplete
------------------------------------------------------------------- */
function FreePlacesAutocomplete({
  value = null,
  onChange = () => {},
  placeholder = "Search your destination…",
}) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const lastSelectedRef = useRef(null);

  useEffect(() => {
    if (value?.label) setQuery(value.label);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (lastSelectedRef.current && query === lastSelectedRef.current) {
      setResults([]);
      setOpen(false);
      lastSelectedRef.current = null;
      return;
    }

    if (!query || query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${q}&limit=10`;

        const res = await fetch(url, { signal: controllerRef.current.signal });
        const data = await res.json();

        const seen = new Set();
        const list = [];

        data.forEach((p) => {
          const label = p.display_name.split(",").slice(0, 2).join(", ");

          if (seen.has(label)) return;
          seen.add(label);

          list.push({
            label,
            value: {
              place_id: p.place_id,
              display_name: p.display_name,
              lat: Number(p.lat),
              lon: Number(p.lon),
              lng: Number(p.lon),
            },
          });
        });

        setResults(list);
        setOpen(list.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  function select(item) {
    lastSelectedRef.current = item.label;
    setQuery(item.label);
    setOpen(false);
    onChange(item);
    inputRef.current?.blur();
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-md border border-gray-200 hover:border-orange-400 hover:shadow-lg focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300">
        <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none font-medium"
          style={{ minWidth: 0 }}
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white rounded-xl shadow-2xl border border-gray-200 mt-2 max-h-60 overflow-auto animate-fade-in-up">
          {results.map((r, idx) => (
            <li
              key={r.value.place_id}
              className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 text-sm text-gray-700 transition-all duration-200 border-b border-gray-100 last:border-b-0 font-medium"
              onClick={() => select(r)}
            >
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   3D Loader Animation (CSS Only)
------------------------------------------------------------------- */
function ThreeDLoader() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8 perspective-1000">
      <div className="relative w-full h-full animate-spin-slow preserve-3d">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin-reverse" />
        <div className="absolute inset-2 rounded-full border-4 border-blue-500 border-r-transparent animate-spin-normal" />
        <div className="absolute inset-4 rounded-full border-4 border-teal-500 border-b-transparent animate-spin-reverse" />

        <div className="absolute inset-0 flex items-center justify-center animate-pulse-scale">
          <Plane className="w-8 h-8 text-orange-500" />
        </div>
      </div>
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-xl animate-pulse-slow" />
    </div>
  );
}

/* ------------------------------------------------------------------
   LoadingModal
------------------------------------------------------------------- */
const travelFacts = [
  "The world's longest flight is over 18 hours from Singapore to New York",
  "Dubai has the world's tallest building - the Burj Khalifa at 828 meters",
  "Bali is known as the Island of the Gods with over 20,000 temples",
  "Thailand receives over 40 million tourists annually",
  "The Philippines consists of 7,641 beautiful islands",
  "Tokyo is the world's most populous metropolitan area",
  "Paris is the most visited city in the world",
  "Iceland has no mosquitoes due to its unique climate",
  "Finland has more saunas than cars",
  "New Zealand was one of the last places on Earth to be inhabited by humans",
  "Venice is built on over 100 small islands connected by bridges",
  "The Great Barrier Reef can be seen from outer space",
  "Morocco's blue city Chefchaouen is painted in shades of blue",
  "Norway has the world's longest road tunnel at 15 miles",
];

function LoadingModal({ isOpen, onClose }) {
  const [factIndex, setFactIndex] = useState(0);
  const [randomFacts, setRandomFacts] = useState([]);
  
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...travelFacts]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      setRandomFacts(shuffled);
      setFactIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || randomFacts.length === 0) return;

    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % randomFacts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, randomFacts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white via-white to-orange-50 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden border border-orange-100 animate-scale-up">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/40 to-blue-200/40 rounded-full blur-3xl animate-float" />

        <ThreeDLoader />

        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-3 animate-slide-up">
          Planning Your Adventure
        </h3>

        <p className="text-gray-500 text-sm mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Crafting your perfect itinerary with AI
        </p>

        <div className="min-h-[80px] flex items-center justify-center px-4">
            <div key={factIndex} className="relative animate-fade-in">
              <Sparkles className="w-5 h-5 text-orange-400 absolute -top-6 left-1/2 -translate-x-1/2" />
              <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed">
                {randomFacts[factIndex]}
              </p>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-bounce-custom"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Popular Searches (CSS Only)
------------------------------------------------------------------- */
const popularSearches = [
  { name: "Dubai", emoji: "🏙️", lat: 25.276987, lon: 55.296249 },
  { name: "Bali", emoji: "🏝️", lat: -8.409518, lon: 115.188919 },
  { name: "Thailand", emoji: "🏖️", lat: 15.870032, lon: 100.992538 },
  { name: "Paris", emoji: "🗼", lat: 48.856613, lon: 2.352222 },
  { name: "Singapore", emoji: "🌆", lat: 1.352083, lon: 103.819839 },
  { name: "Tokyo", emoji: "🗾", lat: 35.689487, lon: 139.691711 },
  { name: "Maldives", emoji: "🏝️", lat: 3.202778, lon: 73.22068 },
  { name: "Iceland", emoji: "🏔️", lat: 64.963051, lon: -19.020835 },
];

function PopularSearches({ onSelect }) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <p className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Popular Destinations
      </p>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((search, idx) => (
          <button
            key={search.name}
            onClick={() => onSelect(search)}
            className="px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm font-medium shadow-sm hover:bg-orange-100 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 animate-fade-in"
            style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
          >
            <span>{search.emoji}</span>
            {search.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------
   HERO SECTION
--------------------------------------------------- */

const images = [
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=80",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [destination, setDestination] = useState(null);
  const [budget, setBudget] = useState("Economical");
  const [tripType, setTripType] = useState("Family");
  const [showModal, setShowModal] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrent((prev) => (prev + 1) % images.length);
    }
    if (isRightSwipe) {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  async function handleGenerate() {
    if (!destination) {
      alert("Please select a destination");
      return;
    }

     const payload = {
      destination,
      budget,
      tripType,
    };

    let attempts = 0;
    let maxAttempts = 3;
    let success = false;
    let data = null;

    setShowModal(true);

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (res.ok && data.output) {
          success = true;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }

    if (!success) {
      setShowModal(false);
      alert("TripLinkers is experiencing heavy traffic right now. Please try again.");
      return;
    }

    localStorage.setItem("trip_data", data.output);
    localStorage.setItem("trip_provider", data.provider || "gemini");

    setTimeout(() => {
      setShowModal(false);
      setTimeout(() => {
        window.location.href = `/itinerary`;
      }, 300);
    }, 1800);
  }

  function handlePopularSearch(item) {
    setDestination({
      label: item.name,
      value: {
        place_id: null,
        display_name: item.name,
        lat: item.lat,
        lon: item.lon,
        lng: item.lon,
      },
    });
  }

  return (
    <>
      <section
        className="relative w-full overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[550px] bg-black flex flex-col justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 z-0 h-full w-full">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                current === idx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={img}
                alt="Travel Destination"
                fill
                className={`object-cover transition-transform duration-[10000ms] ease-out ${
                  current === idx ? "scale-110" : "scale-100"
                }`}
                priority={idx === current}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>
          ))}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? "w-8 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 pb-12 pt-24 md:pt-28 lg:pt-20 w-full">
          <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-2xl mb-4 md:mb-5">
              Plan Your{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Perfect Trip
              </span>{" "}
              with AI.
            </h1>

            <p className="text-white/95 text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-light tracking-wide drop-shadow-lg leading-relaxed">
              AI-powered personalized itineraries with cost estimations and
              intelligent trip planning for every traveler
            </p>
          </div>

          <div className="w-full max-w-6xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-white/60 hover:shadow-orange-500/20 hover:shadow-3xl transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Destination
                  </label>
                  <FreePlacesAutocomplete
                    value={destination}
                    onChange={(item) => setDestination(item)}
                    placeholder="Where to?"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide">
                    Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="px-4 font-karla py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-medium text-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-300 shadow-md hover:border-orange-300 hover:shadow-lg cursor-pointer appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundSize: "1.25rem",
                      backgroundPosition: "right 0.75rem center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option>Economical</option>
                    <option>Mid-range</option>
                    <option>Luxury</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide">
                    Travel Type
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="px-4 font-karla py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-medium text-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-300 shadow-md hover:border-orange-300 hover:shadow-lg cursor-pointer appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundSize: "1.25rem",
                      backgroundPosition: "right 0.75rem center",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option>Family</option>
                    <option>Adventure</option>
                    <option>Honeymoon</option>
                    <option>Friends</option>
                    <option>Business</option>
                    <option>Solo</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r font-karla cursor-pointer from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  >
                    <Search className="w-5 h-5" />
                    Generate Plan
                  </button>
                </div>
              </div>

              <PopularSearches onSelect={handlePopularSearch} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg">
                  AI
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center shadow-lg">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center shadow-lg">
                  <Globe className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-semibold font-karla">
                Powered by Advanced AI
              </span>
            </div>
            <span className="text-white/70">•</span>
            <span className="font-medium font-karla">
              Trusted by 50,000+ travelers
            </span>
          </div>
        </div>
      </section>

      <LoadingModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

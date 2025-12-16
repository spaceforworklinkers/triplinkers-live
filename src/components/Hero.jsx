"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full bg-white rounded-xl shadow-2xl border border-gray-200 mt-2 max-h-60 overflow-auto"
        >
          {results.map((r, idx) => (
            <motion.li
              key={r.value.place_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 text-sm text-gray-700 transition-all duration-200 border-b border-gray-100 last:border-b-0 font-medium"
              onClick={() => select(r)}
            >
              {r.label}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   3D Loader Animation
------------------------------------------------------------------- */
function ThreeDLoader() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <motion.div
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-blue-500 border-r-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-teal-500 border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Plane className="w-8 h-8 text-orange-500" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...travelFacts]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      setRandomFacts(shuffled);
      setFactIndex(0);
      setIsExiting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || randomFacts.length === 0) return;

    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % randomFacts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, randomFacts]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{
              scale: isExiting ? 0.9 : 1,
              opacity: isExiting ? 0 : 1,
              rotateX: 0,
              y: isExiting ? -50 : 0,
            }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.5,
            }}
            className="bg-gradient-to-br from-white via-white to-orange-50 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden border border-orange-100"
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/40 to-blue-200/40 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <ThreeDLoader />

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-3"
            >
              Planning Your Adventure
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-sm mb-8"
            >
              Crafting your perfect itinerary with AI
            </motion.p>

            <div className="min-h-[80px] flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={factIndex}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative"
                >
                  <Sparkles className="w-5 h-5 text-orange-400 absolute -top-6 left-1/2 -translate-x-1/2" />
                  <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed">
                    {randomFacts[factIndex]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="flex items-center justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------
   Popular Searches
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <p className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Popular Destinations
      </p>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((search, idx) => (
          <motion.button
            key={search.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
           onClick={() => onSelect(search)}

            className="px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm font-medium shadow-sm hover:bg-orange-100 transition-all duration-300 flex items-center gap-2"
          >
            <span>{search.emoji}</span>
            {search.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
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

    // Show the loading modal immediately
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

        // Delay before retry (to reduce API spam)
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (err) {
        // Retry again
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }

    if (!success) {
      setShowModal(false);

      alert(
        "TripLinkers is experiencing heavy traffic right now. Many travelers are generating itineraries at the same time. Please try again in a moment."
      );

      return;
    }

    // SUCCESS path
    localStorage.setItem("trip_data", data.output);

    // keep showing the modal briefly for premium feel
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
        className="relative w-full overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[550px] bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 z-0">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: current === idx ? 1 : 0,
                scale: current === idx ? 1 : 1.1,
              }}
              transition={{
                duration: 1.5,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="absolute inset-0"
            >
              <Image
                src={img}
                alt="Travel Destination"
                fill
                className="object-cover"
                priority={idx === current}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </motion.div>
          ))}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? "w-8 bg-white" : "w-1.5 bg-white/50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-center mb-8 md:mb-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block mb-4"
            ></motion.div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-2xl mb-4 md:mb-5">
              Plan Your{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Perfect Trip
              </span>{" "}
              with AI.
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/95 text-base md:text-lgx lg:text-xl max-w-3xl mx-auto font-light tracking-wide drop-shadow-lg leading-relaxed"
            >
              AI-powered personalized itineraries with cost estimations and
              intelligent trip planning for every traveler
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-6xl"
          >
            <div className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-white/60 hover:shadow-orange-500/20 hover:shadow-3xl transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-2.5 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Destination
                  </label>
                  <FreePlacesAutocomplete
                    value={destination}
               onChange={(item) => {
    setDestination(item);
  }}
                    placeholder="Where to?"
                    className="font-karla"
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
                  <motion.button
                    onClick={handleGenerate}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r font-karla cursor-pointer from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  >
                    <Search className="w-5 h-5" />
                    Generate Plan
                  </motion.button>
                </div>
              </div>

              <PopularSearches onSelect={handlePopularSearch} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm"
          >
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
          </motion.div>
        </div>
      </section>

      <LoadingModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

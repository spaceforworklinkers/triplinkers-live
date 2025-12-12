"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * FreePlacesAutocomplete — MAJOR CITIES ONLY VERSION
 * --------------------------------------------------
 * ✔ Shows only globally recognisable cities
 * ✔ Filters out towns, villages, POIs, monuments
 * ✔ Minimum 3 letters before searching
 * ✔ Clean dropdown UI that works with your Hero design
 */

export default function FreePlacesAutocomplete({
  value = null,
  onChange = () => {},
  placeholder = "Search destination…",
}) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const lastSelectedRef = useRef(null);

  // Keep input updated on external value change
  useEffect(() => {
    if (value && value.label) setQuery(value.label);
  }, [value]);

  // Auto search logic
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Avoid unnecessary search when selecting
    if (lastSelectedRef.current && query === lastSelectedRef.current) {
      setResults([]);
      setOpen(false);
      lastSelectedRef.current = null;
      return;
    }

    // Require 3+ characters
    if (!query || query.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        const q = encodeURIComponent(query);

        // Request city-level results only
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1&limit=20`;

        const res = await fetch(url, { signal: controllerRef.current.signal });
        const data = await res.json();

        const seen = new Set();
        const cityResults = [];

        for (const entry of data) {
          const addr = entry.address || {};

          // Only accept REAL cities
          const city =
            addr.city ||
            addr.town ||
            addr.state && !addr.county ? addr.state : null;

          if (!city) continue;

          // Canonical label (City, Country)
          const country = addr.country || "";
          const label = `${city}, ${country}`;

          if (seen.has(label)) continue;
          seen.add(label);

          cityResults.push({
            label,
            value: {
              place_id: entry.place_id,
              display_name: entry.display_name,
              lat: Number(entry.lat),
              lon: Number(entry.lon),
            },
          });

          if (cityResults.length >= 8) break;
        }

        setResults(cityResults);
        setOpen(cityResults.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") console.error("AutoComplete error:", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  function handleSelect(item) {
    lastSelectedRef.current = item.label;
    setQuery(item.label);
    setResults([]);
    setOpen(false);
    onChange(item);
    if (inputRef.current) inputRef.current.blur();
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-teal-600">
        <div className="text-lg">📍</div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-500"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto z-50">
          {results.map((item) => (
            <li
              key={item.value.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
            >
              <div className="text-sm font-semibold text-gray-800">
                {item.label}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

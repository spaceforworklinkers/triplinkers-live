"use client";

import { useEffect, useRef, useState } from "react";
import { X, Shield, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";

import TripBot from "./TripBot";
import robotAnimation from "@/assets/lottie/robot.json";

const STORAGE_KEY = "tripbot_closed_at";
const HI_KEY = "tripbot_hi_shown_at";
const LEAD_DONE_KEY = "tripbot_lead_done";

const SUPPRESS_DURATION = 24 * 60 * 60 * 1000;
const AUTO_OPEN_DELAY = 5000;
const REOPEN_DELAY = 10000;


const DEFAULT_MESSAGES = [
  "Hi 👋 How may I help you?",
  "Need help planning your trip?",
  "Still exploring travel ideas?",
  "Want a personalized travel plan?",
];

export default function TripBotFloating() {
  const [open, setOpen] = useState(false);
  const [showHi, setShowHi] = useState(false);
  const [hiText, setHiText] = useState("");

  const pathname = usePathname();

  /* ---------------- REFS (CRITICAL FIX) ---------------- */
  const autoOpenTimerRef = useRef(null);
  const reopenTimerRef = useRef(null);
  const audioRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const reopenedOnceRef = useRef(false);

  /* ---------------- AUDIO UNLOCK (RUNS ONCE) ---------------- */
  useEffect(() => {
    const unlock = () => {
      if (audioUnlockedRef.current) return;

      audioRef.current = new Audio("/sound/pop.mp3");
      audioRef.current.volume = 0.4;

      audioRef.current.play().catch(() => {});
      audioUnlockedRef.current = true;

      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("scroll", unlock);
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("scroll", unlock, { once: true });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("scroll", unlock);
    };
  }, []);

  /* ---------------- HI MESSAGE ---------------- */
  useEffect(() => {
    if (open) return;

    const lastShown = localStorage.getItem(HI_KEY);
    if (lastShown && Date.now() - Number(lastShown) < SUPPRESS_DURATION) return;

    const message =
      DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];

    setHiText(message);

    const showTimer = setTimeout(() => {
      setShowHi(true);
      localStorage.setItem(HI_KEY, Date.now().toString());
    }, 1500);

    const hideTimer = setTimeout(() => setShowHi(false), 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [open, pathname]);

  /* ---------------- AUTO OPEN (SINGLE TIMER) ---------------- */
  useEffect(() => {
    const leadDone = localStorage.getItem(LEAD_DONE_KEY);
    if (leadDone) return;

    autoOpenTimerRef.current = setTimeout(() => {
      if (audioUnlockedRef.current && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setOpen(true);
    }, AUTO_OPEN_DELAY);

    return () => {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    };
  }, []);

  /* ---------------- OPEN / CLOSE ---------------- */
  const handleOpen = () => {
    setOpen(true);
    setShowHi(false);
    localStorage.setItem("tripbot_interacted", "true");
    clearTimeout(reopenTimerRef.current);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

    const leadDone = localStorage.getItem(LEAD_DONE_KEY);
    const interacted = localStorage.getItem("tripbot_interacted");

    if (!leadDone && !interacted && !reopenedOnceRef.current) {
      reopenedOnceRef.current = true;

      reopenTimerRef.current = setTimeout(() => {
        if (audioUnlockedRef.current && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        setHiText("Just checking 😊 want help planning your trip?");
        setShowHi(true);
        setOpen(true);
      }, REOPEN_DELAY);
    }
  };

  /* ---------------- CLEANUP ON UNMOUNT ---------------- */
  useEffect(() => {
    return () => {
      clearTimeout(autoOpenTimerRef.current);
      clearTimeout(reopenTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* FLOATING BUTTON */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {showHi && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-[115%] bottom-10 max-w-[320px]"
              >
                <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl text-nowrap shadow-xl border border-slate-700">
                  <p className="text-sm leading-relaxed">{hiText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleOpen} className="relative">
            <Lottie
              animationData={robotAnimation}
              loop
              autoplay
              className="cursor-pointer"
              style={{ width: "72px", height: "72px" }}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
              <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* CHAT PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[92vw]"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-semibold">TripLinkers AI</h3>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-slate-400 cursor-pointer" />
                </button>
              </div>

              <div className="p-5 bg-slate-50 min-h-[360px]">
                <TripBot />
              </div>

              <div className="px-6 py-3 border-t bg-white flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-3 h-3" />
                  Secure & encrypted. No Spam
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Award className="w-3 h-3" />
                  Powered by TripLinkers AI
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

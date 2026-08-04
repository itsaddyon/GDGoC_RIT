"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GDGMark } from "@/components/ui/gdg-mark";
import { SITE } from "@/data/nav";

export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore");
    
    if (hasLoadedBefore) {
      setDone(true);
      return;
    }

    const t = setTimeout(() => {
      sessionStorage.setItem("hasLoadedBefore", "true");
      setDone(true);
    }, 2000); // Increased time slightly to let animation play
    
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background/85 backdrop-blur-xl"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-80"
            animate={{ opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute left-[14%] top-[22%] h-56 w-56 rounded-full bg-[color:var(--accent-blue)]/18 blur-3xl animate-float-orbit" />
            <div className="absolute right-[12%] top-[16%] h-44 w-44 rounded-full bg-[color:var(--accent-red)]/18 blur-3xl animate-float-orbit [animation-delay:0.6s]" />
            <div className="absolute bottom-[16%] left-[24%] h-48 w-48 rounded-full bg-[color:var(--accent-green)]/18 blur-3xl animate-float-orbit [animation-delay:1.2s]" />
            <div className="absolute bottom-[14%] right-[20%] h-40 w-40 rounded-full bg-[color:var(--accent-yellow)]/18 blur-3xl animate-float-orbit [animation-delay:1.8s]" />
          </motion.div>
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent animate-drift-line"
          />
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 blur-xl scale-150 rounded-full bg-white/20 animate-pulse" />
            <GDGMark size={72} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 text-center"
          >
            <div className="flex items-center gap-3 rounded-full border border-border bg-background/70 px-5 py-3 shadow-lg shadow-black/10 backdrop-blur-md">
              <GDGMark size={34} />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-sm font-medium tracking-tight text-foreground">{SITE.name}</span>
                <span className="text-[11px] text-muted">{SITE.chapter}</span>
              </span>
            </div>
            <span className="text-xs uppercase tracking-[0.22em] text-muted">Loading the chapter experience</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GDGMark } from "@/components/ui/gdg-mark";
import { NAV_LINKS, SITE } from "@/data/nav";
import { motion, AnimatePresence } from "framer-motion";

export function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [techTeamClickCount, setTechTeamClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    let keyBuffer = "";
    const targetAdarsh = "adarsh";
    const targetAdmin = "admin";
    const targetCore = "core";
    const maxLength = Math.max(targetAdarsh.length, targetAdmin.length, targetCore.length);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      
      // Ignore if user is typing in an input field or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > maxLength) {
        keyBuffer = keyBuffer.slice(-maxLength);
      }
      
      if (keyBuffer.endsWith(targetAdarsh)) {
        setShowSecret(true);
        keyBuffer = "";
      } else if (keyBuffer.endsWith(targetAdmin)) {
        router.push("/admin");
        keyBuffer = "";
      } else if (keyBuffer.endsWith(targetCore)) {
        router.push("/core");
        keyBuffer = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (showSecret) {
      const timer = setTimeout(() => {
        window.open("https://itsaddyon.dev", "_blank");
        setShowSecret(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSecret]);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setClickCount(0);
      setShowPortal(true);
    }
  };

  const handleTechTeamClick = () => {
    const newCount = techTeamClickCount + 1;
    setTechTeamClickCount(newCount);
    if (newCount === 3) {
      setShowSecret(true);
      setTechTeamClickCount(0);
    }
  };

  const HIDDEN_IMG = "/fonts/inter-var-latin.woff2";

  return (
    <footer className="border-t border-border/70 bg-background/40">
      {/* Hidden image to preload the easter egg so it shows up instantly */}
      <img src={HIDDEN_IMG} alt="" aria-hidden="true" style={{ display: 'none' }} />

      <div className="container-shell flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none" 
            onClick={handleLogoClick}
            title="Click me 5 times..."
          >
            <GDGMark size={24} />
            <span className="text-sm font-medium">{SITE.name}</span>
          </div>
          <p className="max-w-xs text-sm text-muted">{SITE.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container-shell border-t border-border/70 py-6 text-xs text-muted">
        <div className="text-center">  
          © {new Date().getFullYear()} {SITE.name}. Made by <span onClick={handleTechTeamClick} className="cursor-pointer select-none hover:text-foreground transition-colors" title="GDG">GDG</span>, for students.
        </div>
      </div>

      <AnimatePresence>
        {showPortal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setShowPortal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative p-10 rounded-3xl bg-surface border border-border shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-blue via-accent-red to-accent-yellow bg-clip-text text-transparent">
                Select Portal
              </h2>
              <div className="grid grid-cols-1 w-full gap-4">
                <button 
                  onClick={() => { setShowPortal(false); router.push("/admin"); }}
                  className="w-full py-4 rounded-xl border border-border bg-background hover:border-accent-red hover:bg-accent-red/10 transition-all font-semibold"
                >
                  Admin Panel
                </button>
                <button 
                  onClick={() => { setShowPortal(false); router.push("/core"); }}
                  className="w-full py-4 rounded-xl border border-border bg-background hover:border-accent-blue hover:bg-accent-blue/10 transition-all font-semibold"
                >
                  Core Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSecret && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecret(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative p-10 rounded-3xl bg-[#0a0a0a] border border-[#d4af37]/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] flex flex-col items-center gap-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HIDDEN_IMG} alt="The Architect" className="w-48 h-48 object-cover rounded-2xl drop-shadow-2xl border border-[#d4af37]/20" />
              <div className="text-center space-y-1">
                <h3 className="text-3xl font-black bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-transparent bg-clip-text tracking-tight uppercase">Adarsh Arya</h3>
                <p className="text-xs font-bold text-[#d4af37]/70 tracking-[0.3em] uppercase">The Architect</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

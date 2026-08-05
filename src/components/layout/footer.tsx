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

  useEffect(() => {
    let keyBuffer = "";
    const target = "adarsh";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > target.length) {
        keyBuffer = keyBuffer.slice(-target.length);
      }
      if (keyBuffer === target) {
        setShowSecret(true);
        keyBuffer = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSecret) {
      const timer = setTimeout(() => {
        window.open("https://itsaddyon.dev", "_blank");
        setShowSecret(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSecret]);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setClickCount(0);
      router.push("/admin");
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
          © {new Date().getFullYear()} {SITE.name}. Built by <span onClick={handleTechTeamClick} className="cursor-pointer select-none hover:text-foreground transition-colors" title="Tech Team">GDG Tech Team</span>, for students.
        </div>
      </div>

      <AnimatePresence>
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

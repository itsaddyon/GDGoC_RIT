"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GDGMark } from "@/components/ui/gdg-mark";
import { useAuth } from "@/contexts/auth-context";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/65 backdrop-blur-md"
    >
      <div className="container-shell flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-3 font-medium shrink-0">
            <GDGMark size={24} className="sm:w-[30px] sm:h-[30px]" />
            <span className="flex flex-col leading-[1.1]">
              <span className="text-[12px] sm:text-[14px] tracking-tight">{SITE.shortName}</span>
              <span className="text-[10px] sm:text-[11px] text-muted hidden sm:block">{SITE.chapter}</span>
            </span>
          </Link>
          
          <div className="h-5 sm:h-8 w-px bg-border/70 shrink-0" aria-hidden="true" />
          
          <Link href="https://ritroorkee.com" target="_blank" rel="noopener noreferrer" className="flex items-center shrink min-w-0">
            <Image src="/rit-logo.png" alt="RIT Roorkee Logo" width={300} height={100} className="h-5 w-auto sm:h-8 object-contain" priority />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-bold hover:scale-105 transition-transform"
                title="View Profile"
              >
                {(userProfile?.name || user.displayName || "U")[0].toUpperCase()}
              </Link>
              <button onClick={logout} className="text-xs text-muted hover:text-accent-red transition-colors">Sign out</button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Log in
            </Link>
          )}
          <Link
            href="https://gdg.community.dev/gdg-on-campus-roorkee-institute-of-technology-roorkee-india/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Join us
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden shrink-0">
          {user ? (
            <Link 
              href="/profile" 
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold text-xs"
            >
              {(userProfile?.name || user.displayName || "U")[0].toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium text-muted transition-colors hover:text-foreground whitespace-nowrap"
            >
              Log in
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/70 bg-background md:hidden"
        >
          <nav className="container-shell flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 px-3">
              <ThemeToggle />
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)} className="text-sm font-medium hover:text-accent-blue">Profile</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-muted text-left hover:text-accent-red">Sign out</button>
                </>
              ) : (
                <Link href="/login" className="text-sm text-muted">Log in</Link>
              )}
              <Link
              href="https://gdg.community.dev/gdg-on-campus-roorkee-institute-of-technology-roorkee-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Join us
            </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

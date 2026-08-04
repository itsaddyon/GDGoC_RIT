"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GDGMark } from "@/components/ui/gdg-mark";

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/65 backdrop-blur-md"
    >
      <div className="container-shell flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 font-medium">
            <GDGMark size={30} />
            <span className="flex flex-col leading-[1.1]">
              <span className="text-[14px] tracking-tight">{SITE.shortName}</span>
              <span className="text-[11px] text-muted">{SITE.chapter}</span>
            </span>
          </Link>
          
          <div className="h-8 w-px bg-border/70 hidden sm:block" aria-hidden="true" />
          
          <Link href="https://ritroorkee.com" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <img 
              src="/rit-logo.png" 
              alt="RIT Roorkee Logo" 
              className="h-8 w-auto object-contain"
            />
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
          <Link
            href="/login"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Join us
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
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
              <Link href="/login" className="text-sm text-muted">Log in</Link>
              <Link
                href="/register"
                className="ml-auto rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
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

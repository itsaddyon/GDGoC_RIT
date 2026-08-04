"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PHRASES = ["connect minds", "build future", "ship code", "grow together"];

export function RotatingIntro() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[index];
    let delay = deleting ? 42 : 65;

    if (!deleting && text.length === current.length) {
      delay = 1500; // Pause before deleting
    } else if (deleting && text.length === 0) {
      delay = 500; // Pause before next word
    }

    const timeout = window.setTimeout(
      () => {
        if (!deleting) {
          if (text.length < current.length) {
            setText(current.slice(0, text.length + 1));
          } else {
            setDeleting(true);
          }
        } else {
          if (text.length > 0) {
            setText(current.slice(0, text.length - 1));
          } else {
            setDeleting(false);
            setIndex((value) => (value + 1) % PHRASES.length);
          }
        }
      },
      delay
    );

    return () => window.clearTimeout(timeout);
  }, [deleting, index, text]);

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-balance text-xl font-medium tracking-tight sm:text-2xl">
      <span className="text-foreground/80">We</span>
      <span className="relative inline-flex min-w-[10ch] justify-start text-accent-blue sm:min-w-[12ch]">
        <span className="inline-block">{text}</span>
        <motion.span
          aria-hidden
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent-blue"
        />
      </span>
    </div>
  );
}
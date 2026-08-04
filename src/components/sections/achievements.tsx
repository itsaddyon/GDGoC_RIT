"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/data/content";

const colors = [
  "var(--accent-blue)",
  "var(--accent-red)",
  "var(--accent-yellow)",
  "var(--accent-green)",
];

export function Achievements() {
  return (
    <section className="relative border-t border-border/70 bg-transparent py-20">
      <div className="container-shell grid grid-cols-2 gap-8 sm:grid-cols-4">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="text-center sm:text-left"
          >
            <div
              className="text-3xl font-medium tracking-tight sm:text-4xl"
              style={{ color: colors[i % colors.length] }}
            >
              {a.value}
            </div>
            <div className="mt-1 text-xs text-muted sm:text-sm">{a.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

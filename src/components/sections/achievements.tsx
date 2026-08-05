"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const colors = [
  "var(--accent-blue)",
  "var(--accent-red)",
  "var(--accent-yellow)",
  "var(--accent-green)",
];

export function Achievements() {
  const [achievements, setAchievements] = useState<{label: string, number: string, prefix?: string, suffix: string}[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "main"));
        if (snap.exists() && snap.data().achievements) {
          setAchievements(snap.data().achievements);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <section className="relative border-t border-border/70 bg-transparent py-20">
      <div className="container-shell grid grid-cols-2 gap-8 sm:grid-cols-4">
        {achievements.map((a, i) => (
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
              {a.prefix}{a.number}{a.suffix}
            </div>
            <div className="mt-1 text-xs text-muted sm:text-sm">{a.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

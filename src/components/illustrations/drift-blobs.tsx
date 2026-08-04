"use client";

import { motion } from "framer-motion";

const blobs = [
  { color: "var(--accent-blue)", size: 500, x: "8%", y: "-12%", delay: 0 },
  { color: "var(--accent-yellow)", size: 360, x: "70%", y: "2%", delay: 1.2 },
  { color: "var(--accent-red)", size: 300, x: "38%", y: "54%", delay: 2.4 },
  { color: "var(--accent-green)", size: 220, x: "80%", y: "58%", delay: 3.2 },
];

export function DriftBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: b.color,
            opacity: 0.14,
          }}
          animate={{
            x: [0, 24, -16, 0],
            y: [0, -20, 18, 0],
            scale: [1, 1.06, 0.98, 1],
          }}
          transition={{
            duration: 22 + i * 4,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

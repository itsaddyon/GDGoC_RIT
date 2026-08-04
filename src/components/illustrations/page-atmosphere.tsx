"use client";

import { motion } from "framer-motion";

const threads = [
  {
    d: "M-40 180C120 90 220 300 390 220S650 120 860 210S1190 290 1380 160",
    color: "var(--accent-blue)",
    delay: 0,
    speed: 34,
  },
  {
    d: "M-60 340C120 250 250 440 440 360S760 220 940 320S1210 470 1440 300",
    color: "var(--accent-red)",
    delay: 1.2,
    speed: 40,
  },
  {
    d: "M-80 520C130 430 260 610 470 520S780 400 990 500S1230 610 1460 460",
    color: "var(--accent-green)",
    delay: 2.4,
    speed: 46,
  },
  {
    d: "M-50 660C130 590 280 740 450 670S760 560 960 640S1250 760 1470 620",
    color: "var(--accent-yellow)",
    delay: 3.2,
    speed: 52,
  },
];

export function PageAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-[-20%] bg-[radial-gradient(circle_at_20%_18%,rgba(66,133,244,0.34),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(219,68,55,0.28),transparent_24%),radial-gradient(circle_at_52%_82%,rgba(15,157,88,0.30),transparent_28%),radial-gradient(circle_at_12%_74%,rgba(244,180,0,0.26),transparent_22%)] blur-[28px] bg-blend-screen"
        animate={{
          x: [0, 38, -26, 0],
          y: [0, 24, -18, 0],
          scale: [1, 1.08, 0.98, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-[-10%] bg-[linear-gradient(115deg,transparent_0%,rgba(66,133,244,0.16)_18%,rgba(15,157,88,0.14)_36%,rgba(244,180,0,0.14)_58%,rgba(219,68,55,0.15)_76%,transparent_100%)] opacity-70 blur-[44px]"
        animate={{ x: [0, 180, -120, 0], y: [0, -30, 24, 0], rotate: [0, 4, -3, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[-16%] top-[6%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(66,133,244,0.52),rgba(66,133,244,0.10)_40%,transparent_72%)] blur-[90px]"
        animate={{ x: [0, 160, -60, 0], y: [0, 42, -26, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-14%] top-[10%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(219,68,55,0.42),rgba(219,68,55,0.10)_42%,transparent_74%)] blur-[100px]"
        animate={{ x: [0, -220, 90, 0], y: [0, 50, -34, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[4%] bottom-[-18%] h-[54rem] w-[54rem] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(15,157,88,0.38),rgba(15,157,88,0.10)_40%,transparent_74%)] blur-[104px]"
        animate={{ x: [0, 120, -80, 0], y: [0, -72, 34, 0], scale: [1, 1.18, 0.93, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[10%] bottom-[-12%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(244,180,0,0.42),rgba(244,180,0,0.10)_40%,transparent_70%)] blur-[96px]"
        animate={{ x: [0, -120, 60, 0], y: [0, -54, 28, 0], scale: [1, 1.14, 0.96, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[8%] top-[20%] h-2 w-[24rem] rounded-full bg-gradient-to-r from-transparent via-[color:var(--accent-blue)]/75 to-transparent blur-sm"
        animate={{ x: [0, 180, 40, 0], y: [0, -10, 12, 0], opacity: [0.28, 0.78, 0.32] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[10%] top-[38%] h-2 w-[20rem] rounded-full bg-gradient-to-r from-transparent via-[color:var(--accent-red)]/70 to-transparent blur-sm"
        animate={{ x: [0, -180, -40, 0], y: [0, 12, -8, 0], opacity: [0.22, 0.68, 0.24] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[18%] bottom-[20%] h-2 w-[26rem] rounded-full bg-gradient-to-r from-transparent via-[color:var(--accent-green)]/70 to-transparent blur-sm"
        animate={{ x: [0, 200, -20, 0], y: [0, -14, 10, 0], opacity: [0.18, 0.62, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[10%] top-[8%] h-[22rem] w-[22rem] rounded-full border border-[color:var(--accent-blue)]/22"
        animate={{ rotate: 360, scale: [1, 1.08, 0.98, 1], x: [0, 48, -12, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[12%] top-[14%] h-[18rem] w-[18rem] rounded-full border border-[color:var(--accent-red)]/22"
        animate={{ rotate: -360, scale: [1, 1.05, 0.98, 1], x: [0, -52, 18, 0], y: [0, 16, -12, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[22%] bottom-[10%] h-[24rem] w-[24rem] rounded-full border border-[color:var(--accent-green)]/18"
        animate={{ rotate: 360, scale: [1, 1.04, 0.97, 1], x: [0, 58, -22, 0], y: [0, -30, 16, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[18%] bottom-[14%] h-[20rem] w-[20rem] rounded-full border border-[color:var(--accent-yellow)]/18"
        animate={{ rotate: -360, scale: [1, 1.08, 0.99, 1], x: [0, -60, 24, 0], y: [0, -24, 10, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 noise-overlay opacity-[0.18] mix-blend-soft-light" />
    </div>
  );
}
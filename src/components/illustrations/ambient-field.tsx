import { motion } from "framer-motion";

export function AmbientField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.4] dark:opacity-[0.25]"
        aria-hidden
      >
        <defs>
          <pattern
            id="dot-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.2" className="fill-border" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
      <motion.div
        className="absolute left-[8%] top-[16%] h-80 w-80 rounded-full border border-[color:var(--accent-blue)]/25"
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[10%] top-[18%] h-[28rem] w-[28rem] rounded-full border border-[color:var(--accent-red)]/25"
        animate={{ rotate: -360, scale: [1, 0.98, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[24%] bottom-[8%] h-[22rem] w-[22rem] rounded-full border border-[color:var(--accent-green)]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-[-10%] top-1/4 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-blue)]/40 to-transparent"
        animate={{ x: [0, 60, -30, 0], opacity: [0.22, 0.6, 0.22] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-[-12%] top-1/2 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-red)]/28 to-transparent"
        animate={{ x: [0, -72, 36, 0], opacity: [0.16, 0.42, 0.16] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-[-14%] bottom-1/4 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-yellow)]/30 to-transparent"
        animate={{ x: [0, 42, -18, 0], opacity: [0.14, 0.38, 0.14] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

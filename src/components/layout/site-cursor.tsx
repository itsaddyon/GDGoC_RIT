"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { GDGMark } from "@/components/ui/gdg-mark";

export function SiteCursor() {
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 400, damping: 28, mass: 0.2 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [x, y]);

  return (
    <>
      {/* SVG Google Logo or Open Text */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <AnimatePresence mode="wait">
          {isHovering ? (
            <motion.div
              key="hover-text"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: isClicking ? 0.9 : 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute flex items-center justify-center bg-foreground text-background px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap"
              style={{ x: "-50%", y: "-50%", filter: 'drop-shadow(rgba(0,0,0,0.2) 0px 4px 8px)' }}
            >
              Open
            </motion.div>
          ) : (
            <motion.div
              key="gdg-logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: isClicking ? 0.45 : 0.72 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ x: "-50%", y: "-50%", width: '28px', height: '28px', filter: 'drop-shadow(rgba(66, 133, 244, 0.333) 0px 0px 4px)' }}
              className="absolute flex items-center justify-center"
            >
              <GDGMark size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Green Ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden md:block"
        style={{ x: springX, y: springY }}
        animate={{ scale: isClicking ? 0.6 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="absolute" style={{ transform: 'translate(-50%, -50%)', width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid rgba(52, 168, 83, 0.4)' }} />
      </motion.div>

      {/* Blue Glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9996] hidden md:block"
        style={{ x: springX, y: springY }}
        animate={{ scale: isClicking ? 1.5 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="absolute" style={{ transform: 'translate(-50%, -50%)', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(66, 133, 244, 0.08), transparent 70%)' }} />
      </motion.div>
    </>
  );
}
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RotatingIntro } from "@/components/sections/rotating-intro";
import { GDGMark } from "@/components/ui/gdg-mark";
import { SITE } from "@/data/nav";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen">
      
      {/* Right Hero Ring */}
      <div className="hidden md:block absolute right-[-5%] top-[12%] opacity-40 z-[1]">
        <div className="relative w-[420px] h-[420px] shrink-0">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-solid" style={{ borderColor: 'rgb(66, 133, 244) rgb(234, 67, 53) rgb(251, 188, 5) rgb(52, 168, 83)', animation: '8s linear 0s infinite normal none running spin' }} />
          <div className="absolute inset-[22px] rounded-full border border-solid" style={{ borderColor: 'rgb(52, 168, 83) rgb(66, 133, 244) rgb(234, 67, 53) rgb(251, 188, 5)', animation: '6s linear 0s infinite normal none running spinR' }} />
          <div className="absolute top-1/2 left-1/2 w-[14px] h-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_rgba(66,133,244,0.6)]" style={{ background: 'conic-gradient(rgb(66, 133, 244), rgb(234, 67, 53), rgb(251, 188, 5), rgb(52, 168, 83), rgb(66, 133, 244))', animation: '3s linear 0s infinite normal none running spin' }} />
        </div>
      </div>

      {/* Left Hero Ring */}
      <div className="hidden md:block absolute left-[-4%] bottom-[8%] opacity-25 z-[1]">
        <div className="relative w-[280px] h-[280px] shrink-0">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-solid" style={{ borderColor: 'rgb(66, 133, 244) rgb(234, 67, 53) rgb(251, 188, 5) rgb(52, 168, 83)', animation: '8s linear 0s infinite normal none running spin' }} />
          <div className="absolute inset-[22px] rounded-full border border-solid" style={{ borderColor: 'rgb(52, 168, 83) rgb(66, 133, 244) rgb(234, 67, 53) rgb(251, 188, 5)', animation: '6s linear 0s infinite normal none running spinR' }} />
          <div className="absolute top-1/2 left-1/2 w-[14px] h-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_rgba(66,133,244,0.6)]" style={{ background: 'conic-gradient(rgb(66, 133, 244), rgb(234, 67, 53), rgb(251, 188, 5), rgb(52, 168, 83), rgb(66, 133, 244))', animation: '3s linear 0s infinite normal none running spin' }} />
        </div>
      </div>

      <div className="container-shell relative z-[2] flex min-h-[88vh] flex-col items-center justify-center py-28 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-foreground/[0.04] px-5 py-2 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-foreground/[0.08]"
        >
          <GDGMark size={16} />
          GDG on Campus RIT Roorkee
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="max-w-5xl text-balance text-[3.25rem] font-medium leading-[0.9] tracking-tight sm:text-7xl lg:text-[6.8rem]"
        >
          Where developers
          <br />
          <span className="text-accent-blue">come alive</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg"
        >
          Google Developer Groups on Campus at RIT Roorkee is a student community powered by Google technologies, built for people who want to learn fast, ship real work, and grow together.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={2.4}
          variants={fadeUp}
        >
          <RotatingIntro />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore events
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-accent-blue/60 hover:text-accent-blue"
          >
            Learn more
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

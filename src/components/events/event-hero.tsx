"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

type EventHeroProps = {
  title: string;
  type: string;
  date: string;
  color: string;
  venue?: string;
  participants?: number;
  duration?: string;
  status?: string;
};

export function EventHero({
  title,
  type,
  date,
  color,
  venue,
  participants,
  duration,
  status,
}: EventHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br from-surface via-background to-surface px-8 py-16 md:px-14 md:py-24">

      {/* Background Glow */}
      <div
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
      />

      <div
        className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-accent-blue/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7 }}
        className="relative z-10"
      >

        <span
          className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color,
          }}
        >
          {type}
        </span>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          {title}
        </h1>

        <div className="mt-10 flex flex-wrap gap-6 text-muted">

          <div className="flex items-center gap-2">
            <Calendar size={18} />
            {date}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={18} />
            {venue || "TBA"}
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} />
            {participants ? `${participants}+` : "TBA"} Participants
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} />
            {duration || "TBA"}
          </div>

        </div>

        {status === "closed" && (
          <div className="mt-10 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400">
            ✓ Event Completed
          </div>
        )}

      </motion.div>
    </section>
  );
}
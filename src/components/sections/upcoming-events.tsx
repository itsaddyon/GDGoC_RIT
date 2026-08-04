"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { UPCOMING_EVENTS } from "@/data/content";

export function UpcomingEvents() {
  return (
    <section id="events" className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-lg">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-red">
              Events
            </span>
            <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
              Where the magic happens.
            </h2>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            View all events
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {UPCOMING_EVENTS.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group flex flex-col rounded-[1.75rem] border border-border bg-surface/95 p-6 transition-all hover:-translate-y-1 hover:border-border/40 hover:shadow-lg hover:shadow-black/5"
            >
              <span
                className="mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: `color-mix(in srgb, ${e.color} 14%, transparent)`, color: e.color }}
              >
                {e.tag}
              </span>
              <h3 className="text-base font-medium tracking-tight">{e.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{e.desc}</p>
              <span className="mt-5 text-xs font-medium text-muted">{e.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

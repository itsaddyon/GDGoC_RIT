"use client";

import { motion } from "framer-motion";
import { DOMAINS } from "@/data/content";

export function Domains() {
  return (
    <section id="domains" className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 max-w-lg"
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-green">
            What we do
          </span>
          <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            What we learn and build together.
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {DOMAINS.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-surface/95 p-7 transition-colors hover:border-border/40"
            >
              <div
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.14] blur-2xl transition-opacity group-hover:opacity-[0.24]"
                style={{ background: d.color }}
              />
              <div
                className="mb-5 h-2 w-8 rounded-full"
                style={{ background: d.color }}
              />
              <h3 className="text-lg font-medium tracking-tight">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

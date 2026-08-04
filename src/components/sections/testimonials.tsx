"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";

export function Testimonials() {
  return (
    <section className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 max-w-lg"
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-yellow">
            Voices
          </span>
          <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            What members say.
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="rounded-[1.75rem] border border-border bg-surface/95 p-6"
            >
              <Quote size={18} className="text-accent-blue" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 text-xs text-muted">
                <span className="font-medium text-foreground">{t.name}</span>
                {" — "}{t.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

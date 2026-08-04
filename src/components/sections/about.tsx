"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-blue">
            About GDG
          </span>
          <h2 className="mt-4 max-w-xl text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            A community for students who would rather build than watch.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="space-y-5 text-base leading-relaxed text-muted sm:text-lg"
        >
          <p>
            GDG on Campus RIT Roorkee is the student chapter of Google Developer Groups at Roorkee Institute of Technology. We create a space where students can learn by building, ask better questions, and ship with confidence.
          </p>
          <p>
            Workshops, study jams, talks, and collaborative projects keep the chapter active throughout the year — with Android, Web, Cloud, and AI as our core tracks.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

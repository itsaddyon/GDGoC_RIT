"use client";

import { motion } from "framer-motion";
import { PEOPLE } from "@/data/content";

export function People() {
  return (
    <section id="team" className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 max-w-lg"
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-blue">
            Our people
          </span>
          <h2 className="mt-4 text-balance text-3xl font-medium leading-[0.98] tracking-tight sm:text-5xl">
            The leaders behind it all.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            The chapter runs on students who build, plan, speak, and ship together.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PEOPLE.map((person, index) => (
            <motion.article
              key={person.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[1.65rem] border border-border bg-surface/95 p-5 transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-grid opacity-[0.12]" />
              <div
                className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full"
                style={{ background: person.accent }}
              />
              <div className="relative flex h-[20rem] flex-col justify-end rounded-[1.2rem] bg-gradient-to-b from-white/5 via-transparent to-black/35 p-4">
                <div
                  className="absolute inset-x-6 top-6 h-28 rounded-full blur-3xl transition-opacity group-hover:opacity-100"
                  style={{ background: person.accent, opacity: 0.16 }}
                />
                <div className="relative">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    Core team
                  </div>
                  <h3 className="text-2xl font-medium leading-tight tracking-tight text-foreground">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{person.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
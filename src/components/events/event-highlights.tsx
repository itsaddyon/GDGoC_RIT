"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type EventHighlightsProps = {
  highlights: string[];
};

export function EventHighlights({
  highlights,
}: EventHighlightsProps) {
  return (
    <section className="mt-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted">
          Highlights
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          What made this event special?
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.08,
              duration: 0.45,
            }}
            whileHover={{
              y: -5,
            }}
            className="rounded-3xl border border-border/70 bg-surface/60 p-6 backdrop-blur-xl transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-accent-blue/10 p-3 text-accent-blue">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {item}
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Learn through practical experience with guidance from the GDG on Campus RIT team.
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
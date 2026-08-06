"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type EventOverviewProps = {
  description: string;
};

export function EventOverview({
  description,
}: EventOverviewProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .6 }}
      className="mt-16"
    >
      <div className="rounded-[30px] border border-border/60 bg-surface/50 p-8 md:p-12 backdrop-blur-md">

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted">
              Overview
            </p>

            <h2 className="text-3xl font-bold">
              About this Event
            </h2>
          </div>

        </div>

        <p className="max-w-4xl text-lg leading-8 text-muted">
          {description}
        </p>

      </div>
    </motion.section>
  );
}
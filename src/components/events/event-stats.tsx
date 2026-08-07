"use client";

import { motion } from "framer-motion";
import { Users, Clock3, Award, CalendarDays } from "lucide-react";

type EventStatsProps = {
  type: string;
  participants?: number;
  duration?: string;
};

const stats = (type: string, participants?: number, duration?: string) => [
  {
    icon: Users,
    title: "Participants",
    value: participants ? `${participants}+` : "TBA",
    color: "text-blue-500",
  },
  {
    icon: Clock3,
    title: "Duration",
    value: duration || "TBA",
    color: "text-green-500",
  },
  {
    icon: Award,
    title: "Certificates",
    value: "Provided",
    color: "text-yellow-500",
  },
  {
    icon: CalendarDays,
    title: "Category",
    value: type,
    color: "text-red-500",
  },
];

export function EventStats({ type, participants, duration }: EventStatsProps) {
  return (
    <section className="mt-20">

      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Event Statistics
        </h2>

        <p className="mt-2 text-muted">
          A quick snapshot of this event.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {stats(type, participants, duration).map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: .5,
                delay: index * .08,
              }}
              whileHover={{
                y: -6,
              }}
              className="group rounded-[26px] border border-border/60 bg-surface/60 p-6 backdrop-blur-xl transition-all"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-background ${item.color}`}
              >
                <Icon size={26} />
              </div>

              <h3 className="mt-6 text-3xl font-bold">
                {item.value}
              </h3>

              <p className="mt-2 text-muted">
                {item.title}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
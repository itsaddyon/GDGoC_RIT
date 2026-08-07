"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { EVENTS } from "@/data/content";

type EventType = {
  id: string;
  title: string;
  date: string;
  type: string;
  desc: string;
  color: string;
};

export function UpcomingEvents({
  showViewAll = true,
}: {
  showViewAll?: boolean;
}) {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("status", "==", "published")
        );

        const snap = await getDocs(q);

        const firebaseEvents: EventType[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<EventType, "id">),
        }));

        setEvents(firebaseEvents);
      } catch (err) {
        console.error(err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section
      id="events"
      className="relative border-t border-border/70 py-24 sm:py-32"
    >
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-lg">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-red">
              Events
            </span>

            <h2 className="mt-4 text-3xl font-medium sm:text-5xl">
              Where the magic happens.
            </h2>
          </div>

          {showViewAll && (
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              View all events
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted">
              No events found.
            </div>
          ) : (
            events.map((event, index) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-surface/50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full opacity-20 blur-3xl"
                    style={{
                      background: event.color,
                    }}
                  />

                  <div className="relative">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        color: event.color,
                        backgroundColor: `${event.color}15`,
                      }}
                    >
                      {event.type}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted">
                      {event.date}
                    </p>

                    <p className="mt-4 line-clamp-2 text-sm text-muted">
                      {event.desc}
                    </p>

                    <div
                      className="mt-6 font-medium"
                      style={{
                        color: event.color,
                      }}
                    >
                      Learn More →
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
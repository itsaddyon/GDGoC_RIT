"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function UpcomingEvents({ showViewAll = true }: { showViewAll?: boolean }) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), where("status", "==", "published"));
        const snap = await getDocs(q);
        const evs: any[] = [];
        snap.forEach((d) => evs.push({ id: d.id, ...d.data() }));
        setEvents(evs);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

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
          {showViewAll && (
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              View all events
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full py-10 text-center text-muted">
              No upcoming events at the moment. Stay tuned!
            </div>
          ) : (
            events.slice(0, 3).map((event, index) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/50 p-6 sm:p-8 hover:-translate-y-1 hover:border-border hover:shadow-lg transition-all"
                >
                  <div
                    className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full blur-3xl transition-transform duration-700 ease-out group-hover:scale-150 opacity-20"
                    style={{ background: event.color }}
                  />
                  
                  <div className="relative">
                    <span 
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ color: event.color, backgroundColor: `${event.color}15` }}
                    >
                      {event.type}
                    </span>
                    
                    <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                      {event.title}
                    </h3>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>{event.date}</span>
                    </div>
                    
                    <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2">
                      {event.desc}
                    </p>
                    
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: event.color }}>
                      Learn more
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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

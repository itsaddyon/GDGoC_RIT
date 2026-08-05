"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
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
        evs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                    
                    <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2 whitespace-pre-wrap">
                      {event.desc}
                    </p>
                    
                    <time className="flex items-center gap-2 text-sm font-medium text-muted">
                      <CalendarIcon size={16} className="text-accent-blue" />
                      {event.isDateTBA ? "Date & Time TBA" : `${event.date}${event.time ? ` • ${event.time}` : ""}`}
                    </time>
                    {(event.location || event.isLocationTBA) && (
                      <div className="flex items-center gap-2 text-sm font-medium text-muted mt-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-red"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {event.isLocationTBA ? "Location TBA" : event.location}
                      </div>
                    )}
                    
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

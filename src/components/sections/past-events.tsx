"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, ImageIcon, Calendar as CalendarIcon } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function PastEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), where("status", "==", "closed"));
        const snap = await getDocs(q);
        const evs: any[] = [];
        snap.forEach((d) => evs.push({ id: d.id, ...d.data() }));
        evs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(evs);
      } catch (error) {
        console.error("Failed to fetch past events:", error);
      }
    };
    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="relative border-t border-border/70 py-24 sm:py-32 bg-surface/30">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 max-w-lg"
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-yellow">
            Past Events
          </span>
          <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Our Hall of Fame.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Take a look at some of our legendary past events, the winners who conquered them, and the memories we made.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors h-full"
              >
              <div
                className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full blur-3xl transition-transform duration-700 ease-out opacity-10"
                style={{ background: event.color }}
              />
              
              <div className="relative">
                <span 
                  className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ color: event.color, backgroundColor: `${event.color}15` }}
                >
                  {event.type}
                </span>
                
                <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground sm:text-2xl opacity-80">
                  {event.title}
                </h3>
                
                <time className="mt-2 flex items-center gap-2 text-sm font-medium text-muted">
                  <CalendarIcon size={16} className="text-accent-blue" />
                  {event.isDateTBA ? "Date & Time TBA" : `${event.date}${event.time ? ` • ${event.time}` : ""}`}
                </time>
                {(event.location || event.isLocationTBA) && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted mt-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-red"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {event.isLocationTBA ? "Location TBA" : event.location}
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2 whitespace-pre-wrap">
                  {event.desc}
                </p>
                
                {/* Winners Podium */}
                {(event.winner1 || event.winner2 || event.winner3) && (
                  <div className="mt-6 space-y-2 rounded-xl bg-surface/50 p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-3 mt-4">
                      <Trophy size={16} className="text-accent-yellow" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">Winners</span>
                    </div>
                    {event.winner1 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{event.winner1}</span>
                        <span className="text-xs font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded-full">1st</span>
                      </div>
                    )}
                    {event.winner2 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted">{event.winner2}</span>
                        <span className="text-xs font-bold text-muted bg-surface-raised px-2 py-0.5 rounded-full">2nd</span>
                      </div>
                    )}
                    {event.winner3 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted">{event.winner3}</span>
                        <span className="text-xs font-bold text-accent-red/80 bg-accent-red/10 px-2 py-0.5 rounded-full">3rd</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Gallery Link */}
              {event.galleryLink && (
                <div className="mt-6 pt-6 border-t border-border/50 relative">
                  <div 
                    role="button"
                    tabIndex={0}
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-blue text-muted cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(event.galleryLink, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ImageIcon size={16} />
                    View Event Photos
                  </div>
                </div>
              )}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

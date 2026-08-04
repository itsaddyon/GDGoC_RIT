"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PEOPLE } from "@/data/content";
import { Github, Linkedin, Twitter } from "lucide-react";

// SVG Icons
const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
);
const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

export function People() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
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
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              className="relative aspect-[3/4] w-full perspective-1000"
            >
              <div 
                className={`relative h-full w-full cursor-pointer transition-all duration-700 transform-style-preserve-3d ${
                  flippedCardId === person.name ? "rotate-y-180" : "hover:-translate-y-1"
                }`}
                onClick={() => setFlippedCardId(flippedCardId === person.name ? null : person.name)}
              >
                {/* Front of Card */}
                <article className="absolute inset-0 backface-hidden overflow-hidden rounded-[1.65rem] border border-border bg-surface/95 p-5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Flip Hint on Front */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="rounded-full bg-black/40 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-sm border border-white/10">
                      Click to flip 🔄
                    </span>
                  </div>

                  <div
                    className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full"
                    style={{ background: person.accent }}
                  />
                  <div className="relative flex h-full flex-col justify-end rounded-[1.2rem] bg-gradient-to-b from-white/5 via-transparent to-black/35 p-4">
                    <div
                      className="absolute inset-x-6 top-6 h-28 rounded-full blur-3xl transition-opacity opacity-20"
                      style={{ background: person.accent }}
                    />
                    <div className="relative">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        Core team
                      </div>
                      <h3 className="text-xl font-medium leading-tight tracking-tight text-foreground">
                        {person.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted">{person.role}</p>
                    </div>
                  </div>
                </article>

                {/* Back of Card */}
                <article className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-[1.65rem] border border-accent-blue/30 bg-surface flex flex-col items-center justify-center p-4 text-center shadow-[0_0_20px_rgba(66,133,244,0.1)]">
                  <div 
                    className="mb-4 h-16 w-16 rounded-full blur-md opacity-20 absolute top-4"
                    style={{ background: person.accent }}
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-1">{person.name}</h3>
                  <p className="text-xs text-muted mb-4">{person.role}</p>
                  
                  <div className="flex gap-3">
                    <button className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                      <GithubIcon size={18} />
                    </button>
                    <button className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                      <LinkedinIcon size={18} />
                    </button>
                    <button className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                      <TwitterIcon size={18} />
                    </button>
                  </div>
                  
                  <button className="mt-6 text-[10px] uppercase tracking-wider text-muted underline" onClick={(e) => { e.stopPropagation(); setFlippedCardId(null); }}>
                    Flip Back
                  </button>
                </article>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
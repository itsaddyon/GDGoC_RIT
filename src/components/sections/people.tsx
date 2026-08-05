"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const CURRENT_TEAM = [
  {
    id: "1", name: "Akshita Jain", role: "GDG Lead & Event Manager",
    course: "B.Tech", year: "3rd Year", accent: "var(--accent-blue)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/akshita-jain.jpg"
  },
  {
    id: "2", name: "Arpit Pandey", role: "Event Manager",
    course: "B.Tech", year: "3rd Year", accent: "var(--accent-red)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/arpit-pandey.jpg"
  },
  {
    id: "3", name: "Ansh Dixit", role: "Social Media Lead",
    course: "B.Tech", year: "3rd Year", accent: "var(--accent-yellow)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/ansh-dixit.jpg"
  },
  {
    id: "4", name: "Aditi Jaiswal", role: "Social Media Lead",
    course: "B.Tech", year: "3rd Year", accent: "var(--accent-blue)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/aditi-jaiswal.jpg"
  },
  {
    id: "5", name: "Aditya Raj", role: "Tech Lead",
    course: "B.Tech", year: "3rd Year", accent: "var(--accent-green)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/aditya-raj.jpg"
  },
  {
    id: "6", name: "Adarsh Arya", role: "Tech Lead",
    course: "B.Tech", year: "2nd Year", accent: "var(--accent-red)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/adarsh-arya.jpg"
  },
  {
    id: "7", name: "Vaishnavi Pandey", role: "Social Media Lead",
    course: "B.Tech", year: "2nd Year", accent: "var(--accent-yellow)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/vaishnavi-pandey.jpg"
  },
  {
    id: "8", name: "Arpit Panwar", role: "Tech Lead",
    course: "B.Tech", year: "2nd Year", accent: "var(--accent-green)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/arpit-panwar.jpg"
  },
  {
    id: "9", name: "Shaurya Hindocha", role: "PR & Outreach",
    course: "B.Tech", year: "2nd Year", accent: "var(--accent-blue)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/shaurya-hindocha.jpg"
  }
];

const FOUNDING_TEAM = [
  {
    id: "f1", name: "Aditya Raj", role: "GDG Lead",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-blue)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/aditya-raj.jpg"
  },
  {
    id: "f2", name: "Ashwani Raj", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-red)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/ashwani-raj.jpg"
  },
  {
    id: "f3", name: "Harsh Raj Shukla", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-yellow)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/harsh-raj-shukla.jpg"
  },
  {
    id: "f4", name: "Priyanshu Raushan", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-green)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/priyanshu-raushan.jpg"
  },
  {
    id: "f5", name: "Akshita Jain", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-blue)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/akshita-jain.jpg"
  },
  {
    id: "f6", name: "Ansh Dixit", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-red)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/ansh-dixit.jpg"
  },
  {
    id: "f7", name: "Adarsh Arya", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-yellow)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/adarsh-arya.jpg"
  },
  {
    id: "f8", name: "Arpit Panwar", role: "Core Team",
    course: "B.Tech", year: "Alumni", accent: "var(--accent-green)",
    github: "https://github.com", linkedin: "https://linkedin.com", image: "/team/arpit-panwar.jpg"
  }
];

export function People() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "in", ["admin", "core"]));
        const snap = await getDocs(q);
        const links: Record<string, any> = {};
        snap.forEach(doc => {
          const data = doc.data();
          if (data.name) {
            links[data.name.toLowerCase()] = {
              github: data.github,
              linkedin: data.linkedin,
              twitter: data.twitter,
              instagram: data.instagram
            };
          }
        });
        setSocialLinks(links);
      } catch (error) {
        console.error("Failed to fetch social links", error);
      }
    };
    fetchSocials();
  }, []);

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

        <h3 className="text-2xl font-bold mb-8 text-foreground mt-4">Current Team</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-24">
          {CURRENT_TEAM.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.06, ease: "easeOut" }}
              className="relative aspect-[3/4] w-full perspective-1000"
            >
              <div 
                className={`relative h-full w-full cursor-pointer transition-all duration-700 transform-style-preserve-3d ${
                  flippedCardId === person.id ? "rotate-y-180" : "hover:-translate-y-1"
                }`}
                onClick={() => setFlippedCardId(flippedCardId === person.id ? null : person.id)}
              >
                {/* Front of Card */}
                <article className="absolute inset-0 backface-hidden overflow-hidden rounded-[1.65rem] border border-border bg-surface/95 group">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />
                  
                  {/* Flip Hint on Front */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                      Click to flip 🔄
                    </span>
                  </div>

                  <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                    <div
                      className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full z-10"
                      style={{ background: person.accent }}
                    />
                    <div className="relative">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-white/70">
                        Core team
                      </div>
                      <h3 className="text-xl font-medium leading-tight tracking-tight text-white">
                        {person.name.split(" ")[0]}
                      </h3>
                      <p className="mt-1 text-xs text-white/90 font-medium">{person.role}</p>
                    </div>
                  </div>
                </article>

                {/* Back of Card */}
                <article className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-[1.65rem] border border-accent-blue/30 bg-surface flex flex-col items-center justify-center p-4 text-center shadow-[0_0_20px_rgba(66,133,244,0.1)]">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="mb-4 h-16 w-16 rounded-full object-cover border-2 absolute top-4 z-10"
                    style={{ borderColor: person.accent }}
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-1 mt-14">{person.name}</h3>
                  <p className="text-xs text-muted mb-4 font-bold text-accent-blue uppercase tracking-wider">{person.role}</p>
                  <p className="text-xs text-muted mb-4">{person.course} • {person.year}</p>
                  
                  <div className="flex gap-3">
                    <a href={socialLinks[person.name.toLowerCase()]?.github || person.github} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                      <GithubIcon size={18} />
                    </a>
                    <a href={socialLinks[person.name.toLowerCase()]?.linkedin || person.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                      <LinkedinIcon size={18} />
                    </a>
                    {socialLinks[person.name.toLowerCase()]?.twitter && (
                      <a href={socialLinks[person.name.toLowerCase()].twitter} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                        <TwitterIcon size={18} />
                      </a>
                    )}
                    {socialLinks[person.name.toLowerCase()]?.instagram && (
                      <a href={socialLinks[person.name.toLowerCase()].instagram} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-red transition-colors" onClick={(e) => e.stopPropagation()}>
                        <InstagramIcon size={18} />
                      </a>
                    )}
                  </div>
                  
                  <button className="mt-6 text-[10px] uppercase tracking-wider text-muted underline" onClick={(e) => { e.stopPropagation(); setFlippedCardId(null); }}>
                    Flip Back
                  </button>
                </article>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="text-2xl font-bold mb-8 text-foreground">Founding Team</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FOUNDING_TEAM.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.06, ease: "easeOut" }}
              className="relative aspect-[3/4] w-full perspective-1000"
            >
              <div 
                className={`relative h-full w-full cursor-pointer transition-all duration-700 transform-style-preserve-3d ${
                  flippedCardId === person.id ? "rotate-y-180" : "hover:-translate-y-1"
                }`}
                onClick={() => setFlippedCardId(flippedCardId === person.id ? null : person.id)}
              >
                {/* Front of Card */}
                <article className="absolute inset-0 backface-hidden overflow-hidden rounded-[1.65rem] border border-border bg-surface/95 group">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />
                  
                  {/* Flip Hint on Front */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                      Click to flip 🔄
                    </span>
                  </div>

                  <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                    <div
                      className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full z-10"
                      style={{ background: person.accent }}
                    />
                    <div className="relative">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-white/70">
                        Founding Team
                      </div>
                      <h3 className="text-xl font-medium leading-tight tracking-tight text-white">
                        {person.name.split(" ")[0]}
                      </h3>
                      <p className="mt-1 text-xs text-white/90 font-medium">{person.role}</p>
                    </div>
                  </div>
                </article>

                {/* Back of Card */}
                <article className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-[1.65rem] border border-accent-blue/30 bg-surface flex flex-col items-center justify-center p-4 text-center shadow-[0_0_20px_rgba(66,133,244,0.1)]">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="mb-4 h-16 w-16 rounded-full object-cover border-2 absolute top-4 z-10"
                    style={{ borderColor: person.accent }}
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-1 mt-14">{person.name}</h3>
                  <p className="text-xs text-muted mb-4 font-bold text-accent-blue uppercase tracking-wider">{person.role}</p>
                  <p className="text-xs text-muted mb-4">{person.course} • {person.year}</p>
                  
                  <div className="flex gap-3">
                    <a href={socialLinks[person.name.toLowerCase()]?.github || person.github} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                      <GithubIcon size={18} />
                    </a>
                    <a href={socialLinks[person.name.toLowerCase()]?.linkedin || person.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                      <LinkedinIcon size={18} />
                    </a>
                    {socialLinks[person.name.toLowerCase()]?.twitter && (
                      <a href={socialLinks[person.name.toLowerCase()].twitter} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                        <TwitterIcon size={18} />
                      </a>
                    )}
                    {socialLinks[person.name.toLowerCase()]?.instagram && (
                      <a href={socialLinks[person.name.toLowerCase()].instagram} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-red transition-colors" onClick={(e) => e.stopPropagation()}>
                        <InstagramIcon size={18} />
                      </a>
                    )}
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
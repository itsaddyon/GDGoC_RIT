"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type TeamMember = {
  id: string;
  name: string;
  role: string;
  category: "current" | "founding";
  domain: "Core" | "Tech" | "Design" | "Management" | "PR";
  img: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

const TEAM_DATA: TeamMember[] = [
  // Current Team
  {
    id: "1", name: "Akshita Jain", role: "GDG Lead & Event Manager", category: "current", domain: "Core",
    img: "/team/akshita-jain.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "2", name: "Arpit Pandey", role: "Event Manager", category: "current", domain: "Management",
    img: "/team/arpit-pandey.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "3", name: "Ansh Dixit", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/ansh-dixit.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "4", name: "Aditi Jaiswal", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/aditi-jaiswal.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "5", name: "Aditya Raj", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/aditya-raj.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "6", name: "Adarsh Arya", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/adarsh-arya.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "7", name: "Vaishnavi Pandey", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/vaishnavi-pandey.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "8", name: "Arpit Panwar", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/arpit-panwar.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "9", name: "Shaurya Hindocha", role: "PR & Outreach", category: "current", domain: "PR",
    img: "/team/shaurya-hindocha.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  // Founding Team
  {
    id: "f1", name: "Aditya Raj", role: "GDG Lead", category: "founding", domain: "Core",
    img: "/team/aditya-raj.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f2", name: "Ashwani Raj", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/ashwani-raj.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f3", name: "Harsh Raj Shukla", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/harsh-raj-shukla.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f4", name: "Priyanshu Raushan", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/priyanshu-raushan.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f5", name: "Akshita Jain", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/akshita-jain.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f6", name: "Ansh Dixit", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/ansh-dixit.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f7", name: "Adarsh Arya", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/adarsh-arya.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f8", name: "Arpit Panwar", role: "Core Team", category: "founding", domain: "Core",
    img: "/team/arpit-panwar.jpg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  }
];

export function TeamGrid() {
  const [activeCategory, setActiveCategory] = useState<"current" | "founding">("current");
  const [activeDomain, setActiveDomain] = useState<string>("All");
  
  // State to track which card is currently flipped
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

  const domains = ["All", "Core", "Tech", "Design", "Management", "PR"];

  const filteredTeam = TEAM_DATA.filter((member) => {
    if (member.category !== activeCategory) return false;
    if (activeDomain !== "All" && member.domain !== activeDomain) return false;
    return true;
  });

  return (
    <div className="container-shell py-12 md:py-24">
      {/* Category Toggle (Current vs Founding) */}
      <div className="mb-12 flex justify-center">
        <div className="inline-flex rounded-full border border-border/50 bg-surface/30 p-1 backdrop-blur-md">
          <button
            onClick={() => setActiveCategory("current")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeCategory === "current" 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Current Team
          </button>
          <button
            onClick={() => setActiveCategory("founding")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              activeCategory === "founding" 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Founding Team
          </button>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              activeDomain === domain
                ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                : "border-border/50 bg-transparent text-muted hover:border-border hover:text-foreground"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredTeam.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] w-full perspective-1000"
            >
              <div 
                className={`relative h-full w-full cursor-pointer transition-all duration-700 transform-style-preserve-3d ${
                  flippedCardId === member.id ? "rotate-y-180" : ""
                }`}
                onClick={() => setFlippedCardId(flippedCardId === member.id ? null : member.id)}
              >
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden overflow-hidden rounded-2xl border border-border/50 bg-surface/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Flip Hint on Front */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="rounded-full bg-black/40 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-sm border border-white/10">
                      Click to flip 🔄
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-5">
                    <div className="mb-1 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                      {member.domain}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-xs text-white/80">{member.role}</p>
                  </div>
                </div>

                {/* Back of Card (Flipped) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-2xl border border-accent-blue/30 bg-surface flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(66,133,244,0.15)]">
                  <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-border p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.img} alt={member.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-muted">{member.role}</p>
                  
                  <div className="flex gap-4 mt-6">
                    <a href={socialLinks[member.name.toLowerCase()]?.github || member.socials.github} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                      <GithubIcon size={20} />
                    </a>
                    <a href={socialLinks[member.name.toLowerCase()]?.linkedin || member.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                      <LinkedinIcon size={20} />
                    </a>
                    {socialLinks[member.name.toLowerCase()]?.twitter && (
                      <a href={socialLinks[member.name.toLowerCase()].twitter} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                        <TwitterIcon size={20} />
                      </a>
                    )}
                    {socialLinks[member.name.toLowerCase()]?.instagram && (
                      <a href={socialLinks[member.name.toLowerCase()].instagram} target="_blank" rel="noreferrer" className="text-muted hover:text-accent-red transition-colors" onClick={(e) => e.stopPropagation()}>
                        <InstagramIcon size={20} />
                      </a>
                    )}
                  </div>
                  
                  <button className="mt-8 text-xs text-muted underline" onClick={(e) => { e.stopPropagation(); setFlippedCardId(null); }}>
                    Flip Back
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredTeam.length === 0 && (
        <div className="py-20 text-center text-muted">
          No team members found for this filter.
        </div>
      )}
    </div>
  );
}

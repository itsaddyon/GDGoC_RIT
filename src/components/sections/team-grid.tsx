"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DynamicImage } from "@/components/ui/dynamic-image";
import { FlipButton, FlipButtonFront, FlipButtonBack } from "@/components/ui/flip-button";

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
const FlipIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const GlobeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);

type TeamMember = {
  id: string;
  name: string;
  role: string;
  category: "current" | "founding";
  domain: "Tech" | "Design" | "Management" | "PR";
  img: string;
  socials: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

const TEAM_DATA: TeamMember[] = [
  // Current Team - 3rd Years
  {
    id: "1", name: "Akshita Jain", role: "GDG Lead & Event Manager", category: "current", domain: "Management",
    img: "/team/akshita-jain.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "2", name: "Arpit Pandey", role: "Event Manager", category: "current", domain: "Management",
    img: "/team/arpit-pandey.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "7", name: "Ansh Dixit", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/ansh-dixit.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "4", name: "Aditya Raj", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/aditya-raj-current.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "8", name: "Aditi Jaiswal", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/aditi-jaiswal.jpeg", socials: { github: "https://github.com/aditi-j28", linkedin: "https://www.linkedin.com/in/aditi-jaiswal-b19a9932a" }
  },
  {
    id: "9", name: "Amit Raj", role: "Graphic Lead", category: "current", domain: "Design",
    img: "/team/amit-raj.jpeg", socials: { github: "https://github.com/raajamit10", linkedin: "https://www.linkedin.com/in/amit-raj-078b37324/" }
  },
  // Current Team - 2nd Years
  {
    id: "3", name: "Adarsh Arya", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/adarsh-arya.jpeg", socials: { portfolio: "https://itsaddyon.dev", github: "https://github.com/itsaddyon", linkedin: "https://linkedin.com/in/itsaddyon" }
  },
  {
    id: "6", name: "Aditya Kumar", role: "Social Media Lead", category: "current", domain: "PR",
    img: "/team/aditya-kumar.jpeg", socials: { github: "https://github.com/akm44287238-cpu", linkedin: "https://www.linkedin.com/in/aditya-krr" }
  },
  {
    id: "5", name: "Arpit Panwar", role: "Tech Lead", category: "current", domain: "Tech",
    img: "/team/arpit-panwar.jpeg", socials: { github: "https://github.com/arpitpanwar19", linkedin: "https://linkedin.com/in/arpitpanwar19" }
  },
  {
    id: "10", name: "Vaishnavi Pandey", role: "Graphic Lead", category: "current", domain: "Design",
    img: "/team/vaishnavi-pandey.jpeg", socials: { github: "https://github.com/vaishnavipandeyuniversity-ship-it", linkedin: "https://www.linkedin.com/in/vaishnavi-pandey-8868672bb" }
  },
  {
    id: "11", name: "Shaurya Hindocha", role: "PR & Outreach", category: "current", domain: "PR",
    img: "/team/shaurya-hindocha.jpeg", socials: { github: "https://github.com/shaurya07-cell", linkedin: "https://www.linkedin.com/in/shaurya-hindocha-47961b380" }
  },
  // Founding Team
  {
    id: "f1", name: "Aditya Raj", role: "GDG Lead", category: "founding", domain: "Management",
    img: "/team/aditya-raj.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f2", name: "Ashwani Raj", role: "Core Team", category: "founding", domain: "Tech",
    img: "/team/ashwani-raj.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f3", name: "Harsh Raj Shukla", role: "Core Team", category: "founding", domain: "Management",
    img: "/team/harsh-raj-shukla.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f4", name: "Priyanshu Raushan", role: "Core Team", category: "founding", domain: "PR",
    img: "/team/priyanshu-raushan.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f5", name: "Akshita Jain", role: "Core Team", category: "founding", domain: "Management",
    img: "/team/akshita-jain.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f6", name: "Ansh Dixit", role: "Core Team", category: "founding", domain: "PR",
    img: "/team/ansh-dixit.jpeg", socials: { github: "https://github.com", linkedin: "https://linkedin.com" }
  },
  {
    id: "f7", name: "Adarsh Arya", role: "Junior Team", category: "founding", domain: "Tech",
    img: "/team/adarsh-arya.jpeg", socials: { portfolio: "https://itsaddyon.dev", github: "https://github.com/itsaddyon", linkedin: "https://linkedin.com/in/itsaddyon" }
  },
  {
    id: "f8", name: "Arpit Panwar", role: "Junior Team", category: "founding", domain: "Tech",
    img: "/team/arpit-panwar.jpeg", socials: { github: "https://github.com/arpitpanwar19", linkedin: "https://linkedin.com/in/arpitpanwar19" }
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
              github: (data.github && data.github !== "https://github.com" && data.github !== "https://github.com/") ? data.github : undefined,
              linkedin: (data.linkedin && data.linkedin !== "https://linkedin.com" && data.linkedin !== "https://www.linkedin.com" && data.linkedin !== "https://linkedin.com/") ? data.linkedin : undefined,
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

  const domains = ["All", "Tech", "Design", "Management", "PR"];

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
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${activeCategory === "current"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted hover:text-foreground"
              }`}
          >
            Current Team
          </button>
          <button
            onClick={() => setActiveCategory("founding")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${activeCategory === "founding"
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
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${activeDomain === domain
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
                className={`relative h-full w-full cursor-pointer transition-all duration-700 transform-style-preserve-3d ${flippedCardId === member.id ? "rotate-y-180" : ""
                  }`}
                onClick={() => setFlippedCardId(flippedCardId === member.id ? null : member.id)}
              >
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden overflow-hidden rounded-2xl border border-border/50 bg-surface/30">
                  <DynamicImage
                    basePath={member.img.replace(/\.[^/.]+$/, "")}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Flip Hint on Front */}
                  <div className="absolute top-4 right-4 z-10">
                    <FlipButton className="h-8 w-8 rounded-full shadow-lg">
                      <FlipButtonFront className="rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20">
                        <FlipIcon size={14} />
                      </FlipButtonFront>
                      <FlipButtonBack className="rounded-full bg-accent-blue/80 text-white backdrop-blur-md border border-accent-blue">
                        <span className="text-[8px] font-bold uppercase tracking-widest">Flip</span>
                      </FlipButtonBack>
                    </FlipButton>
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
                <div className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-2xl border border-accent-blue/30 bg-surface flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(66,133,244,0.15)]" style={{ WebkitTransform: "rotateY(180deg) translateZ(1px)", transform: "rotateY(180deg) translateZ(1px)" }}>
                  <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-border p-1">
                    <DynamicImage basePath={member.img.replace(/\.[^/.]+$/, "")} alt={member.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-muted">{member.role}</p>

                  <div className="flex gap-2 relative z-50 p-2" style={{ transform: "translateZ(30px)" }}>
                    {member.socials.portfolio && (
                      <div className="p-2 text-muted hover:text-accent-blue transition-colors cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(member.socials.portfolio, "_blank"); }}>
                        <GlobeIcon size={18} />
                      </div>
                    )}
                    <div className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = socialLinks[member.name.toLowerCase()]?.github || member.socials.github; if (url) window.open(url, "_blank"); }}>
                      <GithubIcon size={18} />
                    </div>
                    <div className="p-2 text-muted hover:text-accent-blue transition-colors cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = socialLinks[member.name.toLowerCase()]?.linkedin || member.socials.linkedin; if (url) window.open(url, "_blank"); }}>
                      <LinkedinIcon size={18} />
                    </div>
                    {socialLinks[member.name.toLowerCase()]?.twitter && (
                      <div className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = socialLinks[member.name.toLowerCase()].twitter; if (url) window.open(url, "_blank"); }}>
                        <TwitterIcon size={18} />
                      </div>
                    )}
                    {socialLinks[member.name.toLowerCase()]?.instagram && (
                      <div className="p-2 text-muted hover:text-accent-red transition-colors cursor-pointer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = socialLinks[member.name.toLowerCase()].instagram; if (url) window.open(url, "_blank"); }}>
                        <InstagramIcon size={18} />
                      </div>
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

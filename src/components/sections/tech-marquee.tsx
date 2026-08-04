"use client";

import { TECHNOLOGIES } from "@/data/content";

export function TechMarquee() {
  const items = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section aria-label="Technologies" className="relative overflow-hidden border-y border-border/60 bg-background/30 py-4">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-sm font-medium text-muted will-change-transform">
        {items.map((tech, index) => {
          const accent = index % 4 === 0 ? "var(--accent-blue)" : index % 4 === 1 ? "var(--accent-red)" : index % 4 === 2 ? "var(--accent-yellow)" : "var(--accent-green)";
          return (
            <span key={`${tech}-${index}`} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
              {tech}
            </span>
          );
        })}
      </div>
    </section>
  );
}
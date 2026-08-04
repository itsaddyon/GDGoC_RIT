import Link from "next/link";
import { GDGMark } from "@/components/ui/gdg-mark";
import { NAV_LINKS, SITE } from "@/data/nav";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/40">
      <div className="container-shell flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <GDGMark size={24} />
            <span className="text-sm font-medium">{SITE.name}</span>
          </div>
          <p className="max-w-xs text-sm text-muted">{SITE.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container-shell border-t border-border/70 py-6 text-xs text-muted">
        <div className="text-center">  © {new Date().getFullYear()} {SITE.name}. Built by GDG Tech Team, for students.
        </div></div>
    </footer>
  );
}

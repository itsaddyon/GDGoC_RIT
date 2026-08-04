"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground transition-colors hover:border-accent-blue/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue",
        className
      )}
    >
      {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
    </button>
  );
}

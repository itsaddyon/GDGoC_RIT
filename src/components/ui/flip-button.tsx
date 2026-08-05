import * as React from "react"
import { cn } from "@/lib/cn"

export interface FlipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function FlipButton({ children, className, ...props }: FlipButtonProps) {
  return (
    <button
      className={cn("group relative perspective-1000", className)}
      {...props}
    >
      <div className="relative h-full w-full transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-x-180">
        {children}
      </div>
    </button>
  )
}

export function FlipButtonFront({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex h-full w-full items-center justify-center backface-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}

export function FlipButtonBack({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex h-full w-full items-center justify-center backface-hidden rotate-x-180",
        className
      )}
    >
      {children}
    </div>
  )
}

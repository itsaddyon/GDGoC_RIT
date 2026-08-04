import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SiteCursor } from "@/components/layout/site-cursor";
import { NetworkCanvas } from "@/components/illustrations/network-canvas";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GDG on Campus RIT Roorkee",
    template: "%s · GDG on Campus RIT Roorkee",
  },
  description:
    "GDG on Campus RIT Roorkee — a student developer community at Roorkee Institute of Technology building with Google technologies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfitFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none">
        <ThemeProvider>
          <NetworkCanvas />
          <SiteCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

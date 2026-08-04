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
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "GDG on Campus RIT Roorkee",
    description: "A student developer community at Roorkee Institute of Technology building with Google technologies. Learn, build, and grow together.",
    siteName: "GDG on Campus RIT Roorkee",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GDG on Campus RIT Roorkee Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG on Campus RIT Roorkee",
    description: "A student developer community at Roorkee Institute of Technology building with Google technologies.",
    images: ["/og-image.jpg"],
  },
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

import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SiteCursor } from "@/components/layout/site-cursor";
import { NetworkCanvas } from "@/components/illustrations/network-canvas";
import { ConditionalNav } from "@/components/layout/conditional-nav";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://gdgrit.vercel.app"),
  title: {
    default: "GDG on Campus RIT Roorkee",
    template: "%s · GDG on Campus RIT Roorkee",
  },
  description:
    "GDG on Campus RIT Roorkee — a student developer community at Roorkee Institute of Technology building with Google technologies.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "GDG on Campus RIT Roorkee",
    description: "A student developer community at Roorkee Institute of Technology building with Google technologies. Learn, build, and grow together.",
    siteName: "GDG on Campus RIT Roorkee",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG on Campus RIT Roorkee",
    description: "A student developer community at Roorkee Institute of Technology building with Google technologies.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${outfitFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground md:cursor-none">
        <AuthProvider>
          <ThemeProvider>
            <NetworkCanvas />
            <SiteCursor />
            <ConditionalNav />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/layout/preloader";
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Domains } from "@/components/sections/domains";
import { Achievements } from "@/components/sections/achievements";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { Gallery } from "@/components/sections/gallery";
import { People } from "@/components/sections/people";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="flex-1">
        <Hero />
        <TechMarquee />
        <About />
        <Domains />
        <Achievements />
        <UpcomingEvents />
        <Gallery />
        <People />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

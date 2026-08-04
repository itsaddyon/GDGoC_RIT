import { NavBar } from "@/components/layout/nav-bar";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/layout/preloader";
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Domains } from "@/components/sections/domains";
import { Achievements } from "@/components/sections/achievements";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { People } from "@/components/sections/people";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Preloader />
      <NavBar />
      <main className="flex-1">
        <Hero />
        <TechMarquee />
        <About />
        <Domains />
        <Achievements />
        <UpcomingEvents />
        <People />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

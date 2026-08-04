import { PageHeader } from "@/components/ui/page-header";
import { About as AboutSection } from "@/components/sections/about";
import { Domains } from "@/components/sections/domains";
import { Achievements } from "@/components/sections/achievements";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="About Us" 
        description="Learn about our mission, domains, and the impact we've made in the developer community." 
      />
      
      <div className="flex-1">
        <AboutSection />
        <Domains />
        <Achievements />
        <Cta />
      </div>
      
      <Footer />
    </main>
  );
}

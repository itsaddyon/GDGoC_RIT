import { PageHeader } from "@/components/ui/page-header";
import { TeamGrid } from "@/components/sections/team-grid";
import { Footer } from "@/components/layout/footer";

export default function TeamPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Meet the Team" 
        description="The passionate students working behind the scenes to bring GDG on Campus RIT Roorkee to life." 
      />
      
      <div className="flex-1">
        <TeamGrid />
      </div>
      
      <Footer />
    </main>
  );
}

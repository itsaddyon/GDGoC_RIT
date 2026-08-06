import { PageHeader } from "@/components/ui/page-header";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { PastEvents } from "@/components/sections/past-events";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/layout/footer";

export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Events & Workshops" 
        description="Join us for hands-on sessions, expert talks, and collaborative building." 
      />
      
      <div className="flex-1">
        <UpcomingEvents showViewAll={false} />
        <PastEvents />
        <Cta />
      </div>
      
      <Footer />
    </main>
  );
}

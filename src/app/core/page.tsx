"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type EventType = {
  id: string;
  title: string;
  status: string;
  date: string;
  gallery?: string[];
};

type UpcomingEventWithCount = EventType & {
  registrationCount: number;
};

export default function CoreDashboard() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventWithCount[]>([]);
  const [closedEvents, setClosedEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (user && userProfile && (userProfile.role === "core" || userProfile.role === "admin")) {
      const fetchData = async () => {
        try {
          const eventsSnap = await getDocs(collection(db, "events"));
          const evs = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() } as EventType));
          
          const published = evs.filter(e => e.status === "published");
          const closed = evs.filter(e => e.status === "closed");
          setClosedEvents(closed);

          // Then fetch counts for each event
          const regCounts: Record<string, number> = {};
          await Promise.all(published.map(async (event) => {
            const snap = await getDocs(collection(db, "events", event.id, "registrations"));
            regCounts[event.id] = snap.size;
          }));

          setUpcomingEvents(published.map(e => ({
            ...e,
            registrationCount: regCounts[e.id] || 0
          })));

        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, userProfile, loading]);

  const handleUpdateGallery = async (event: EventType) => {
    const linksStr = window.prompt(`Enter 2 to 4 comma-separated Drive links for "${event.title}":`, event.gallery?.join(", ") || "");
    if (!linksStr) return;
    
    const links = linksStr.split(",").map(l => l.trim()).filter(l => l.length > 0);
    if (links.length >= 2 && links.length <= 4) {
      try {
        await setDoc(doc(db, "events", event.id), { gallery: links }, { merge: true });
        setClosedEvents(closedEvents.map(e => e.id === event.id ? { ...e, gallery: links } : e));
        alert("Gallery updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to update gallery.");
      }
    } else {
      alert("You must provide exactly between 2 and 4 valid links.");
    }
  };

  if (loading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-blue border-t-transparent" />
      </main>
    );
  }

  // Strict Protection UI
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Core Access Required</h1>
        <p className="text-muted mb-8 max-w-md">
          Please log in using your core team email to access the core dashboard.
        </p>
        <button onClick={() => router.push("/login?redirect=/core")} className="rounded-full bg-accent-blue px-6 py-2 text-white font-medium hover:scale-[1.02] transition-transform">
          Log In
        </button>
      </main>
    );
  }

  if (!userProfile || (userProfile.role !== "core" && userProfile.role !== "admin")) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-20 text-center">
        <h1 className="text-2xl font-bold text-accent-red mb-2">Access Denied</h1>
        <p className="text-muted mb-6">
          You are not authorised for the core dashboard. If you think you are, please contact the tech team.
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push("/")} className="rounded-full bg-foreground px-6 py-2 text-background font-medium">
            Go Home
          </button>
          <button onClick={logout} className="rounded-full border border-border px-6 py-2 font-medium hover:bg-surface">
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHeader 
        title="Core Dashboard" 
        description="View event registrations and manage gallery uploads."
      />

      <section className="container-shell py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Upcoming Events Registrations Cards */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Upcoming Event Registrations</h2>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted">
                  No upcoming events currently.
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-border/70 bg-surface overflow-hidden flex items-center justify-between p-5 hover:border-accent-blue/50 transition-colors">
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted">{event.date}</p>
                      <div className="mt-2 inline-flex items-center rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-semibold text-accent-blue">
                        {event.registrationCount} Registered
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/core/events/${event.id}`)}
                      className="p-3 rounded-full bg-foreground text-background hover:scale-105 transition-transform"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gallery Uploads for Closed Events */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Event Galleries</h2>
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
              <p className="text-sm text-muted mb-4">You can upload/update gallery images for closed events here.</p>
              {closedEvents.length === 0 ? (
                <p className="text-muted">No closed events found.</p>
              ) : (
                closedEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                    <div>
                      <p className="font-bold">{event.title}</p>
                      <p className="text-xs text-muted">{event.gallery?.length || 0} images uploaded</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateGallery(event)}
                      className="rounded-full bg-accent-blue/10 px-4 py-2 text-sm font-bold text-accent-blue hover:bg-accent-blue/20 transition-colors"
                    >
                      Update Gallery
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useParams, useRouter } from "next/navigation";
import { EVENTS } from "@/data/content";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  // Later we will fetch this from Firestore, for now we find it in our static data
  const [eventData, setEventData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      const found = EVENTS.find(e => e.id === id);
      if (found) setEventData(found);
    }
  }, [id]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (user && eventData) {
        const regRef = doc(db, "event_registrations", `${eventData.id}_${user.uid}`);
        const regSnap = await getDoc(regRef);
        if (regSnap.exists()) {
          setIsRegistered(true);
        }
      }
    };
    checkRegistration();
  }, [user, eventData]);

  const handleRegister = async () => {
    if (!user) {
      alert("You must log in to register for an event!");
      router.push("/login");
      return;
    }
    
    setIsRegistering(true);
    try {
      const regId = `${eventData.id}_${user.uid}`;
      await setDoc(doc(db, "event_registrations", regId), {
        eventId: eventData.id,
        eventTitle: eventData.title,
        userId: user.uid,
        registeredAt: new Date().toISOString(),
      });
      setIsRegistered(true);
      alert(`Successfully registered for ${eventData.title}!`);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!eventData) return <div className="p-20 text-center">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title={eventData.title} 
        description={`${eventData.date} • ${eventData.type}`} 
      />
      <div className="flex-1 container-shell py-20">
        <div className="max-w-3xl mx-auto rounded-3xl border border-border/70 bg-surface/50 p-8 md:p-12">
          <span
            className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{ background: `color-mix(in srgb, ${eventData.color} 14%, transparent)`, color: eventData.color }}
          >
            {eventData.type}
          </span>
          <h2 className="text-3xl font-bold mt-4 mb-6">About this event</h2>
          <p className="text-muted leading-relaxed text-lg mb-10">
            {eventData.desc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border/70 pt-8">
            <div className="text-sm text-muted">
              Registration opens for all students at RIT Roorkee.
            </div>
            {isRegistered ? (
              <button 
                disabled
                className="rounded-full bg-accent-green/20 text-accent-green px-8 py-3 text-sm font-bold opacity-80 cursor-not-allowed"
              >
                ✓ Registered
              </button>
            ) : (
              <button 
                onClick={handleRegister}
                disabled={isRegistering}
                className="rounded-full bg-foreground px-8 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
              >
                {isRegistering ? "Registering..." : (user ? "Register Now" : "Log in to Register")}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

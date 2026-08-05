"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useParams, useRouter } from "next/navigation";
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
      const fetchEvent = async () => {
        try {
          const snap = await getDoc(doc(db, "events", id as string));
          if (snap.exists()) {
            setEventData({ id: snap.id, ...snap.data() });
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (user && eventData) {
        const regRef = doc(db, `registrations_${eventData.id}`, user.uid);
        const regSnap = await getDoc(regRef);
        if (regSnap.exists()) {
          setIsRegistered(true);
        }
      }
    };
    checkRegistration();
  }, [user, eventData]);

  const handleRegister = () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventData.id}/register`);
      return;
    }
    router.push(`/events/${eventData.id}/register`);
  };

  if (!eventData) return <div className="p-20 text-center">Loading...</div>;

  const dateString = eventData.isDateTBA ? "Date & Time TBA" : `${eventData.date}${eventData.time ? ` at ${eventData.time}` : ""}`;
  const locString = eventData.location ? eventData.location : (eventData.isLocationTBA ? "Location TBA" : "");
  const subtitle = `${dateString}${locString ? ` • ${locString}` : ""} • ${eventData.type}`;

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title={eventData.title} 
        description={subtitle} 
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
          <p className="text-muted leading-relaxed text-lg mb-10 whitespace-pre-wrap">
            {eventData.desc}
          </p>
          
          {eventData.status === "closed" ? (
            <div className="border-t border-border/70 pt-8 mt-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-yellow"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                    Event Concluded
                  </h3>
                  {(eventData.winner1 || eventData.winner2 || eventData.winner3) && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-muted uppercase tracking-wider">Winners</span>
                      {eventData.winner1 && <div className="text-sm"><span className="text-accent-yellow font-bold mr-2">1st:</span> {eventData.winner1}</div>}
                      {eventData.winner2 && <div className="text-sm"><span className="text-muted font-bold mr-2">2nd:</span> {eventData.winner2}</div>}
                      {eventData.winner3 && <div className="text-sm"><span className="text-accent-red font-bold mr-2">3rd:</span> {eventData.winner3}</div>}
                    </div>
                  )}
                </div>
                {eventData.galleryLink && (
                  <button onClick={() => window.open(eventData.galleryLink, "_blank")} className="shrink-0 rounded-full bg-surface-raised border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-surface transition-colors flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                    View Gallery
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border/70 pt-8 mt-8">
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
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

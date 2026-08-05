"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useParams, useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function EventRegistrationPage() {
  const { id } = useParams();
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  
  const [eventData, setEventData] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

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
    if (!loading && !user) {
      router.push(`/login?redirect=/events/${id}/register`);
    }
  }, [user, loading, router, id]);

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

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile || !eventData) return;
    
    setIsRegistering(true);
    try {
      // Save entire profile embedded in the event registration
      const regRef = doc(db, `registrations_${eventData.id}`, user.uid);
      await setDoc(regRef, {
        eventId: eventData.id,
        eventTitle: eventData.title,
        userId: user.uid,
        registeredAt: new Date().toISOString(),
        userProfile: {
          uid: userProfile.uid,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          collegeEmail: userProfile.collegeEmail || "",
          course: userProfile.course,
          branch: userProfile.branch,
          year: userProfile.year,
        }
      });
      setIsRegistered(true);
      alert(`Successfully registered for ${eventData.title}!`);
      router.push(`/events/${eventData.id}`);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading || !eventData || (!user && !loading)) {
    return <div className="p-20 text-center flex-1 min-h-screen">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title={`Register for ${eventData.title}`} 
        description="Please confirm your details to secure your spot." 
      />
      <div className="flex-1 container-shell py-20">
        <div className="max-w-2xl mx-auto rounded-3xl border border-border/70 bg-surface/50 p-8 md:p-12 backdrop-blur-sm">
          
          {isRegistered ? (
            <div className="text-center py-10">
              <div className="h-20 w-20 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
              <h2 className="text-2xl font-bold mb-4">You are registered!</h2>
              <p className="text-muted mb-8">Your spot for {eventData.title} is confirmed.</p>
              <button onClick={() => router.push(`/events/${eventData.id}`)} className="rounded-full bg-foreground px-8 py-3 text-background font-medium">
                Back to Event
              </button>
            </div>
          ) : !userProfile ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Profile Incomplete</h2>
              <p className="text-muted mb-8">You need to complete your profile before you can register for events.</p>
              <button onClick={() => router.push("/complete-profile")} className="rounded-full bg-foreground px-8 py-3 text-background font-medium">
                Complete Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmRegistration}>
              <h3 className="text-xl font-bold mb-6">Participant Details</h3>
              <p className="text-sm text-muted mb-8">The following details will be sent to the event organizers. If anything is incorrect, please request an edit on your profile page.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Full Name</label>
                  <div className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm cursor-not-allowed text-foreground/70">
                    {userProfile.name}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Phone Number</label>
                  <div className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm cursor-not-allowed text-foreground/70">
                    {userProfile.phone}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted font-medium mb-1 block">College Email</label>
                  <div className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm cursor-not-allowed text-foreground/70">
                    {userProfile.collegeEmail || "Missing"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Course & Branch</label>
                  <div className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm cursor-not-allowed text-foreground/70">
                    {userProfile.course} - {userProfile.branch}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Year of Study</label>
                  <div className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm cursor-not-allowed text-foreground/70">
                    {userProfile.year}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border/70 pt-8">
                <Link href={`/events/${eventData.id}`} className="text-sm text-muted hover:text-foreground">
                  Cancel
                </Link>
                <button 
                  type="submit"
                  disabled={isRegistering}
                  className="rounded-full bg-foreground px-8 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
                >
                  {isRegistering ? "Confirming..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

import { EVENTS } from "@/data/content";

import { Footer } from "@/components/layout/footer";

import {
  EventHero,
  EventOverview,
  EventStats,
  EventHighlights,
  EventGallery,
  EventRegistration,
} from "@/components/events";

type EventData = {
  id: string;
  title: string;
  desc: string;
  date: string;
  type: string;
  color: string;

  venue?: string;
  participants?: number;
  duration?: string;
  location?: string;
  isLocationTBA?: boolean;
  isDateTBA?: boolean;
  status?: string;
  highlights?: string[];

  gallery?: string[];

  banner?: string;
  registrationOpen?: boolean;
};

export default function EventDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const { user, userProfile } = useAuth();

  const [eventData, setEventData] =
    useState<EventData | null>(null);

  const [loading, setLoading] = useState(true);

  const [isRegistered, setIsRegistered] =
    useState(false);

  const [isRegistering, setIsRegistering] =
    useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEventData({
            id: docSnap.id,
            title: data.title || "Untitled Event",
            desc: data.desc || "",
            date: data.date || "",
            type: data.type || "Event",
            color: data.color || "var(--accent-blue)",
            
            venue: data.location || data.venue || "Seminar Hall, RIT Roorkee",
            duration: data.duration || data.time || "4 Hours",
            participants: data.participants || 180,
            registrationOpen: data.status === "published" || data.registrationOpen || false,
            isDateTBA: data.isDateTBA || false,
            isLocationTBA: data.isLocationTBA || false,
            
            highlights: data.highlights || [
              "Hands-on Workshop",
              "Interactive Q&A Session",
              "Networking Opportunity",
              "Participation Certificate",
            ],
            
            gallery: data.gallery || [
              "/events/default/1.jpg",
              "/events/default/2.jpg",
              "/events/default/3.jpg",
              "/events/default/4.jpg",
              "/events/default/5.jpg",
              "/events/default/6.jpg",
            ],
            
            banner: data.banner || "/events/default/banner.jpg",
          });
        } else {
          setEventData(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!user || !eventData) return;

    const checkRegistration =
      async () => {
        const registrationRef = doc(
          db,
          "events",
          eventData.id,
          "registrations",
          user.uid
        );

        const snapshot =
          await getDoc(registrationRef);

        setIsRegistered(snapshot.exists());
      };

    checkRegistration();
  }, [user, eventData]);

  const handleRegister = () => {
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }
    router.push(`/events/${id}/register`);
  };

  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!eventData) return;
    const fetchRelated = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("status", "==", "published")
        );
        const snap = await getDocs(q);
        const evs = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((e) => e.id !== eventData.id)
          .slice(0, 3);
        setRelatedEvents(evs);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRelated();
  }, [eventData]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accent-blue border-t-transparent" />

          <p className="mt-6 text-muted">
            Loading Event...
          </p>

        </div>
      </main>
    );
  }

  if (!eventData) {
    return (
      <main className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <h1 className="text-3xl font-bold">
            Event Not Found
          </h1>

          <button
            onClick={() =>
              router.push("/events")
            }
            className="mt-6 rounded-full bg-foreground px-6 py-3 text-background"
          >
            Back to Events
          </button>

        </div>

      </main>
    );
  }
    return (
    <main className="min-h-screen bg-background">

      {/* Back Button */}
      <section className="container-shell pt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm transition hover:bg-surface"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </section>

      {/* Hero */}
      <section className="container-shell pt-10">
        <EventHero
          title={eventData.title}
          type={eventData.type}
          date={eventData.isDateTBA ? "Date & Time TBA" : eventData.date ? new Date(eventData.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }) : "Date & Time TBA"}
          color={eventData.color}
          venue={eventData.isLocationTBA ? "TBA" : eventData.venue}
          participants={eventData.participants}
          duration={eventData.duration}
          status={eventData.status}
        />
      </section>

      {/* Action Buttons */}
      <section className="container-shell mt-8 flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap gap-3">

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Calendar size={15} className="mr-2 inline" />
            {eventData.isDateTBA ? "TBA" : eventData.date ? new Date(eventData.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Clock size={15} className="mr-2 inline" />
            {eventData.duration}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <MapPin size={15} className="mr-2 inline" />
            {eventData.isLocationTBA ? "TBA" : eventData.venue}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Users size={15} className="mr-2 inline" />
            {eventData.participants}+ Participants
          </div>

        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Event link copied!");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 transition hover:bg-surface"
          >
            <Share2 size={16} />
            Share
          </button>
          
          {eventData.registrationOpen && (
            <button
              onClick={handleRegister}
              disabled={isRegistered}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition ${
                isRegistered 
                  ? "bg-green-500/10 text-green-500 border border-green-500/30 cursor-not-allowed"
                  : "bg-foreground text-background hover:scale-105"
              }`}
            >
              {isRegistered ? "✓ Registered" : !user ? "Login to Register" : "Register Now"}
            </button>
          )}
        </div>

      </section>

      {/* Overview */}
      <section className="container-shell mt-20">
        <EventOverview
          description={eventData.desc}
        />
      </section>

      {/* Stats */}
      <section className="container-shell mt-20">
        <EventStats
          type={eventData.type}
          participants={eventData.participants}
          duration={eventData.duration}
        />
      </section>

      {/* Highlights */}
      <section className="container-shell mt-20">
        <EventHighlights
          highlights={eventData.highlights ?? []}
        />
      </section>

      {/* Gallery */}
      <section className="container-shell mt-20">
        <EventGallery
          images={eventData.gallery ?? []}
        />
      </section>
            {/* Registration */}
      <section className="container-shell mt-20">
        <EventRegistration
  isRegistered={isRegistered}
  isRegistering={isRegistering}
  isLoggedIn={!!user}
  registrationOpen={eventData.registrationOpen ?? false}
  userProfile={userProfile}
  onRegister={handleRegister}
/>
      </section>

      {/* Related Events */}
      <section className="container-shell mt-24">

        <div className="mb-10 flex items-end justify-between">

          <div>

            <span className="text-sm uppercase tracking-widest text-accent-blue">
              More Events
            </span>

            <h2 className="mt-3 text-4xl font-bold">
              You may also like
            </h2>

          </div>

          <button
            onClick={() => router.push("/events")}
            className="rounded-full border border-border px-5 py-2 transition hover:bg-surface"
          >
            View All
          </button>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {relatedEvents.map((event) => (

            <div
              key={event.id}
              onClick={() =>
                router.push(`/events/${event.id}`)
              }
              className="group cursor-pointer rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:border-accent-blue/40 hover:shadow-xl"
            >

              <div
                className="mb-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: `color-mix(in srgb, ${event.color} 14%, transparent)`,
                  color: event.color,
                }}
              >
                {event.type}
              </div>

              <h3 className="text-xl font-semibold transition group-hover:text-accent-blue">
                {event.title}
              </h3>

              <p className="mt-4 line-clamp-3 text-sm text-muted">
                {event.desc}
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="text-xs text-muted">
                  {event.date}
                </span>

                <span className="font-medium text-accent-blue">
                  Explore →
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Bottom CTA */}

      <section className="container-shell mt-28">

        <div className="rounded-[40px] border border-border bg-gradient-to-br from-surface via-background to-surface px-10 py-20 text-center">

          <h2 className="text-4xl font-bold">
            Don't miss our upcoming events
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Learn. Build. Network. Join the growing developer community
            at GDG on Campus RIT Roorkee and experience hands-on
            workshops, hackathons, AI sessions and much more.
          </p>

          <button
            onClick={() => router.push("/events")}
            className="mt-10 rounded-full bg-foreground px-8 py-4 font-semibold text-background transition hover:scale-105"
          >
            Browse All Events
          </button>

        </div>

      </section>

      <Footer />

    </main>
  );
}
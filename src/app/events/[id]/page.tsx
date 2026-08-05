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
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

import { EVENTS } from "@/data/content";

import { Footer } from "@/components/layout/footer";
import { useParams, useRouter } from "next/navigation";
import { EVENTS } from "@/data/content";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EventDetailsPage() {
  const { id } = useParams();

  const router = useRouter();

  const { user } = useAuth();

  const [eventData, setEventData] =
    useState<EventData | null>(null);

  const [loading, setLoading] = useState(true);

  const [isRegistered, setIsRegistered] =
    useState(false);

  const [isRegistering, setIsRegistering] =
    useState(false);

  useEffect(() => {
    if (id) {
      const found = EVENTS.find(e => e.id === id);
      if (found) setEventData(found);
    }

    setLoading(false);
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

  const relatedEvents = useMemo(() => {
    if (!eventData) return [];

    return EVENTS.filter(
      (event) =>
        event.id !== eventData.id
    ).slice(0, 3);
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
      <section className="container-shell pt-8">
        <EventHero
          title={eventData.title}
          type={eventData.type}
          date={eventData.date}
          color={eventData.color}
        />
      </section>

      {/* Action Buttons */}
      <section className="container-shell mt-8 flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap gap-3">

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Calendar size={15} className="mr-2 inline" />
            {eventData.date}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Clock size={15} className="mr-2 inline" />
            {eventData.duration}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <MapPin size={15} className="mr-2 inline" />
            {eventData.venue}
          </div>

          <div className="rounded-full border border-border px-4 py-2 text-sm">
            <Users size={15} className="mr-2 inline" />
            {eventData.participants}+ Participants
          </div>

        </div>

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
          stats={[
            {
              label: "Participants",
              value: `${eventData.participants}+`,
            },
            {
              label: "Venue",
              value: "RIT",
            },
            {
              label: "Duration",
              value: eventData.duration ?? "4 Hours",
            },
            {
              label: "Category",
              value: eventData.type,
            },
          ]}
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
          registrationOpen={eventData.registrationOpen ?? false}
          onRegister={handleRegister}
          user={user}
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
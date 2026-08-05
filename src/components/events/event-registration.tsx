"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, LogIn } from "lucide-react";

type EventRegistrationProps = {
  isRegistered: boolean;
  isRegistering: boolean;
  isLoggedIn: boolean;
  registrationOpen: boolean;
  onRegister: () => void;
};

export function EventRegistration({
  isRegistered,
  isRegistering,
  isLoggedIn,
  registrationOpen,
  onRegister,
}: EventRegistrationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 overflow-hidden rounded-[32px] border border-border bg-surface"
    >
      <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-accent-blue">
            Registration
          </span>

          <h2 className="mt-3 text-3xl font-bold">
            Join this Event
          </h2>

          <p className="mt-3 max-w-xl text-muted">
            Register now to secure your seat. You'll receive event updates,
            reminders, and participation details before the event begins.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          {isRegistered ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 font-semibold text-green-400">
                <CheckCircle2 size={18} />
                You're Registered
              </div>

              <p className="text-sm text-muted">
                See you at the event 🚀
              </p>
            </>
          ) : !registrationOpen ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400">
                <CalendarDays size={18} />
                Registration Closed
              </div>

              <p className="text-sm text-muted">
                This event is no longer accepting registrations.
              </p>
            </>
          ) : (
            <button
              onClick={onRegister}
              disabled={isRegistering}
              className="rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? (
                "Registering..."
              ) : isLoggedIn ? (
                "Register Now"
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login to Register
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
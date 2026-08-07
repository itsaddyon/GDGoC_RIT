"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, CheckCircle2, LogIn, User, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

type EventRegistrationProps = {
  isRegistered: boolean;
  isRegistering: boolean;
  isLoggedIn: boolean;
  registrationOpen: boolean;
  userProfile?: any;
  onRegister: () => void;
};

export function EventRegistration({
  isRegistered,
  isRegistering,
  isLoggedIn,
  registrationOpen,
  userProfile,
  onRegister,
}: EventRegistrationProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInitialClick = () => {
    if (!isLoggedIn) {
      onRegister(); // Will redirect to login
    } else {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    onRegister();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 overflow-hidden rounded-[32px] border border-border bg-surface"
    >
      <div className="flex flex-col gap-8 p-8 md:flex-row md:items-start md:justify-between md:p-12">
        <div className="flex-1">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent-blue">
            Registration
          </span>
          <h2 className="mt-3 text-3xl font-bold">Join this Event</h2>
          <p className="mt-3 max-w-xl text-muted">
            Register now to secure your seat. You'll receive event updates,
            reminders, and participation details before the event begins.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end w-full md:w-auto">
          {isRegistered ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 font-semibold text-green-400">
                <CheckCircle2 size={18} />
                You're Registered
              </div>
              <p className="text-sm text-muted">See you at the event 🚀</p>
            </div>
          ) : !registrationOpen ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400">
                <CalendarDays size={18} />
                Registration Closed
              </div>
              <p className="text-sm text-muted">This event is no longer accepting registrations.</p>
            </div>
          ) : !showConfirm ? (
            <button
              onClick={handleInitialClick}
              disabled={isRegistering}
              className="rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggedIn ? "Register Now" : (
                <span className="flex items-center gap-2"><LogIn size={18} />Login to Register</span>
              )}
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && !isRegistered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-background/50"
          >
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="text-accent-blue" /> Verify Your Details
              </h3>
              
              {userProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-2xl border border-border">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-medium">{userProfile.name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium">{userProfile.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-medium">{userProfile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Course & Branch</p>
                    <p className="font-medium">{userProfile.course || "N/A"} {userProfile.branch ? `- ${userProfile.branch}` : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Year of Study</p>
                    <p className="font-medium">{userProfile.year || "Not provided"}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-3 text-muted">
                  <AlertCircle className="text-accent-yellow" />
                  <p>Could not load profile details. Please try refreshing.</p>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted">
                  Incorrect details? <Link href="/profile" className="text-accent-blue hover:underline">Update your profile first</Link>.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-6 py-3 rounded-full text-sm font-medium border border-border hover:bg-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isRegistering}
                    className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {isRegistering ? "Registering..." : "Confirm & Register"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
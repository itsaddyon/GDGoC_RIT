"use client";

import { useAuth, UserProfile } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type EventRegistration = {
  eventId: string;
  eventTitle: string;
  userId: string;
  registeredAt: string;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Group registrations by Event ID
  const [registrationsByEvent, setRegistrationsByEvent] = useState<Record<string, { eventTitle: string, regs: (EventRegistration & { userProfile?: UserProfile })[] }>>({});
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch all users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = new Map<string, UserProfile>();
        usersSnap.forEach((doc) => {
          usersMap.set(doc.id, doc.data() as UserProfile);
        });

        // Fetch all registrations
        const regsSnap = await getDocs(collection(db, "event_registrations"));
        const regs: (EventRegistration & { userProfile?: UserProfile })[] = [];
        
        regsSnap.forEach((doc) => {
          const regData = doc.data() as EventRegistration;
          regs.push({
            ...regData,
            userProfile: usersMap.get(regData.userId)
          });
        });

        // Group by Event
        const grouped: Record<string, { eventTitle: string, regs: (EventRegistration & { userProfile?: UserProfile })[] }> = {};
        
        regs.forEach(r => {
          if (!grouped[r.eventId]) {
            grouped[r.eventId] = { eventTitle: r.eventTitle, regs: [] };
          }
          grouped[r.eventId].regs.push(r);
        });

        // Sort each event's registrations by date
        Object.values(grouped).forEach(group => {
          group.regs.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        });

        setRegistrationsByEvent(grouped);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user]);

  // Simple protection for now
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-20">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted">Please log in to access the admin panel.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage events, track registrations, and update team members." 
      />
      <div className="flex-1 container-shell py-20">
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-surface p-6">
            <h3 className="text-xl font-bold mb-2">Events Management</h3>
            <p className="text-sm text-muted mb-6">Create or edit upcoming events and workshops.</p>
            <button className="w-full rounded-lg bg-accent-blue/10 text-accent-blue px-4 py-2 text-sm font-medium">Coming Soon</button>
          </div>

          <div className="rounded-2xl border border-accent-green/30 bg-accent-green/5 p-6 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2 text-accent-green">Active Events</h3>
            <p className="text-sm text-muted mb-6">With student registrations.</p>
            <div className="text-4xl font-bold">{loading ? "..." : Object.keys(registrationsByEvent).length}</div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface p-6">
            <h3 className="text-xl font-bold mb-2">Team Directory</h3>
            <p className="text-sm text-muted mb-6">Update team profiles, roles, and auto-link photos.</p>
            <button className="w-full rounded-lg bg-accent-red/10 text-accent-red px-4 py-2 text-sm font-medium">Coming Soon</button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Registrations by Event</h2>
        
        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted backdrop-blur-sm">
            Loading registrations...
          </div>
        ) : Object.keys(registrationsByEvent).length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted backdrop-blur-sm">
            No registrations found yet.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(registrationsByEvent).map(([eventId, group]) => (
              <div key={eventId} className="rounded-2xl border border-border/70 bg-surface/50 overflow-hidden backdrop-blur-sm">
                <div className="bg-surface border-b border-border/70 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold">{group.eventTitle}</h3>
                  <span className="bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full text-xs font-bold">
                    {group.regs.length} Students
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface/50 text-muted">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium">Phone</th>
                        <th className="px-6 py-4 font-medium">Branch & Year</th>
                        <th className="px-6 py-4 font-medium">Registered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {group.regs.map((reg, i) => (
                        <tr key={i} className="hover:bg-surface/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{reg.userProfile?.name || "Unknown"}</div>
                            <div className="text-xs text-muted">{reg.userProfile?.email}</div>
                          </td>
                          <td className="px-6 py-4">{reg.userProfile?.phone || "N/A"}</td>
                          <td className="px-6 py-4">
                            <div className="text-foreground">{reg.userProfile?.course} {reg.userProfile?.branch}</div>
                            <div className="text-xs text-muted">{reg.userProfile?.year}</div>
                          </td>
                          <td className="px-6 py-4 text-muted">
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

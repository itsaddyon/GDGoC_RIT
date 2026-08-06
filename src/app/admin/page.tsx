"use client";

import { useAuth, UserProfile } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { EVENTS, FAQS, ACHIEVEMENTS, TESTIMONIALS } from "@/data/content";
import { EventManager } from "@/components/admin/event-manager";
import { ContentManager } from "@/components/admin/content-manager";
import { GalleryManager } from "@/components/admin/gallery-manager";

type ProfileRequest = {
  userId: string;
  name: string;
  email: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
};

// Placeholder for Phase 3 registrations
type EventRegistration = {
  eventId: string;
  eventTitle: string;
  userId: string;
  registeredAt: string;
  userProfile?: UserProfile;
  teamName?: string;
  teamMembers?: Array<{
    name: string;
    email: string;
    phone: string;
    collegeEmail: string;
    course: string;
    branch: string;
    year: string;
  }>;
};

export default function AdminDashboard() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"requests" | "events" | "cms_events" | "cms_content" | "cms_gallery" | "setup">("requests");
  
  const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
  const [registrationsByEvent, setRegistrationsByEvent] = useState<Record<string, { eventTitle: string, regs: EventRegistration[] }>>({});
  
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile Edit Requests
      const reqSnap = await getDocs(collection(db, "profile_edit_requests"));
      const reqs: ProfileRequest[] = [];
      reqSnap.forEach((doc) => {
        if (doc.data().status === "pending") {
          reqs.push(doc.data() as ProfileRequest);
        }
      });
      setProfileRequests(reqs.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));

      // 2. Fetch all new flat registrations dynamically
      const grouped: Record<string, { eventTitle: string, regs: EventRegistration[] }> = {};
      
      // Fetch all events from Firestore to ensure we include dynamically created ones
      const eventsSnap = await getDocs(collection(db, "events"));
      const dbEvents: any[] = [];
      eventsSnap.forEach((d) => dbEvents.push({ id: d.id, ...d.data() }));

      await Promise.all(dbEvents.map(async (event) => {
        const regsSnap = await getDocs(collection(db, `registrations_${event.id}`));
        if (!regsSnap.empty) {
          grouped[event.id] = { eventTitle: event.title, regs: [] };
          regsSnap.forEach((doc) => {
            grouped[event.id].regs.push(doc.data() as EventRegistration);
          });
        }
      }));

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

  useEffect(() => {
    if (userProfile && (userProfile.role === "admin" || userProfile.role === "core")) {
      fetchAdminData();
    }
  }, [userProfile]);

  const handleRequestAction = async (request: ProfileRequest, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
    try {
      const reqRef = doc(db, "profile_edit_requests", request.userId);
      
      if (action === "approve") {
        // Automatically update the user's profile with the new value
        await updateDoc(doc(db, "users", request.userId), {
          [request.field]: request.newValue
        });
        await deleteDoc(reqRef);
        alert(`Request approved. User's ${request.field} was updated to ${request.newValue}.`);
      } else {
        await deleteDoc(reqRef);
        alert("Request rejected.");
      }
      
      // Refresh list
      setProfileRequests(prev => prev.filter(r => r.userId !== request.userId));
    } catch (error) {
      console.error("Error handling request:", error);
      alert("Failed to process request.");
    }
  };

  const handleMigration = async () => {
    if (!confirm("This will overwrite database contents with local static data. Are you sure?")) return;
    setLoading(true);
    try {
      // Migrate Events
      for (const ev of EVENTS) {
        await setDoc(doc(db, "events", ev.id), { ...ev, status: "published" });
      }
      
      // Migrate Site Content
      await setDoc(doc(db, "site_content", "main"), {
        faqs: FAQS,
        achievements: ACHIEVEMENTS,
        testimonials: TESTIMONIALS
      });

      alert("Migration complete! You can now remove this button and start building the CMS.");
    } catch (e) {
      console.error(e);
      alert("Migration failed!");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Strict Protection
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted mb-8 max-w-md">
          Please log in using the official admin email assigned to you by the tech team to access the admin panel.
        </p>
        <button onClick={() => router.push("/login?redirect=/admin")} className="rounded-full bg-accent-blue px-6 py-2 text-white font-medium hover:scale-[1.02] transition-transform">
          Log In
        </button>
      </main>
    );
  }

  if (!userProfile || (userProfile.role !== "admin" && userProfile.role !== "core")) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-20 text-center">
        <h1 className="text-2xl font-bold text-accent-red mb-2">Access Denied</h1>
        <p className="text-muted mb-6">
          You are not authorised for the core dashboard. If you think you are, please contact the tech team of GDG RIT.
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
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Core Dashboard" 
        description="Manage GDGoC RIT operations, profile requests, and event data." 
      />
      <div className="flex-1 container-shell py-12">
        
        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/70 pb-4 mb-8">
          <button 
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "requests" ? "bg-foreground text-background" : "hover:bg-surface text-muted"}`}
          >
            Profile Edit Requests {profileRequests.length > 0 && <span className="ml-2 bg-accent-red text-white text-[10px] px-2 py-0.5 rounded-full">{profileRequests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "events" ? "bg-foreground text-background" : "hover:bg-surface text-muted"}`}
          >
            Event Registrations
          </button>
          <div className="w-px h-6 bg-border/70 self-center mx-2"></div>
          <button 
            onClick={() => setActiveTab("cms_events")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "cms_events" ? "bg-accent-blue text-white" : "hover:bg-surface text-muted"}`}
          >
            Events Manager
          </button>
          <button 
            onClick={() => setActiveTab("cms_content")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "cms_content" ? "bg-accent-blue text-white" : "hover:bg-surface text-muted"}`}
          >
            Site Content
          </button>
          <button 
            onClick={() => setActiveTab("cms_gallery")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "cms_gallery" ? "bg-accent-blue text-white" : "hover:bg-surface text-muted"}`}
          >
            Gallery
          </button>
          <div className="w-px h-6 bg-border/70 self-center mx-2"></div>
          <button 
            onClick={() => setActiveTab("setup")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "setup" ? "bg-foreground text-background" : "hover:bg-surface text-muted"}`}
          >
            System Setup
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted">
            Loading data...
          </div>
        ) : (
          <>
            {/* REQUESTS TAB */}
            {activeTab === "requests" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Pending Edit Requests</h2>
                  <button onClick={fetchAdminData} className="text-sm text-accent-blue hover:underline">Refresh</button>
                </div>
                
                {profileRequests.length === 0 ? (
                  <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted">
                    No pending profile edit requests.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {profileRequests.map(req => (
                      <div key={req.userId} className="flex flex-col md:flex-row justify-between gap-6 rounded-xl border border-border/50 bg-background/50 p-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{req.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-medium">Pending</span>
                        </div>
                        <p className="text-sm text-muted mb-3">{req.email} • Requested on {new Date(req.requestedAt).toLocaleDateString()}</p>
                        
                        <div className="bg-surface rounded-lg p-3 border border-border/50">
                          <div className="flex gap-2 items-center mb-2">
                            <span className="text-xs text-muted font-bold uppercase tracking-wider">Field to Change:</span>
                            <span className="text-sm font-medium bg-foreground/10 px-2 py-0.5 rounded text-foreground">{req.field}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-background rounded border border-border/30">
                            <div>
                              <p className="text-[10px] text-muted font-bold uppercase mb-1">Old Value</p>
                              <p className="text-sm line-through text-muted/70">{req.oldValue || "Not Set"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-accent-green font-bold uppercase mb-1">New Value</p>
                              <p className="text-sm font-medium text-accent-green">{req.newValue}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Reason for change:</p>
                            <p className="text-sm text-foreground/90 italic border-l-2 border-accent-blue/50 pl-3 py-1">{req.reason}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                          <button 
                            onClick={() => handleRequestAction(req, "approve")}
                            className="rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20 px-4 py-2 text-sm font-bold hover:bg-accent-green/20 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRequestAction(req, "reject")}
                            className="rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 text-sm font-bold hover:bg-accent-red/20 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Event Registrations</h2>
                  <button onClick={fetchAdminData} className="text-sm text-accent-blue hover:underline">Refresh</button>
                </div>
                
                {Object.keys(registrationsByEvent).length === 0 ? (
                  <div className="rounded-2xl border border-border/70 bg-surface/50 p-8 text-center text-muted">
                    No registrations found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {Object.entries(registrationsByEvent).map(([eventId, group]) => (
                      <div key={eventId} className="rounded-2xl border border-border/70 bg-surface/50 overflow-hidden">
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
                              {group.regs.map((reg, i) => {
                                if (reg.teamName && reg.teamMembers) {
                                  return (
                                    <tr key={i} className="hover:bg-surface/80 transition-colors">
                                      <td className="px-6 py-6" colSpan={4}>
                                        <div className="mb-4 inline-block rounded-md bg-accent-blue/10 px-3 py-1.5 text-xs font-bold text-accent-blue uppercase tracking-wider">
                                          Team: {reg.teamName}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
                                          {reg.teamMembers.map((member, idx) => (
                                            <div key={idx} className="rounded-xl border border-border/50 bg-background/50 p-4 text-sm">
                                              <div className="font-bold flex items-center gap-2 mb-2">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[10px]">{idx + 1}</span>
                                                <span className="truncate">{member.name}</span> {idx === 0 && <span className="shrink-0 text-[10px] uppercase font-bold text-accent-yellow ml-1">(Leader)</span>}
                                              </div>
                                              <div className="mt-1 text-xs text-muted truncate">{member.email || member.collegeEmail}</div>
                                              <div className="mt-1 text-xs">{member.phone}</div>
                                              <div className="mt-2 text-xs text-muted font-medium bg-surface py-1 px-2 rounded">{member.course} {member.branch} • {member.year}</div>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="mt-4 text-xs font-medium text-muted">
                                          Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                }

                                return (
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
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CMS TABS */}
            {activeTab === "cms_events" && <EventManager />}
            {activeTab === "cms_content" && <ContentManager />}
            {activeTab === "cms_gallery" && <GalleryManager />}

            {/* SETUP TAB */}
            {activeTab === "setup" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">System Setup & Migration</h2>
                <div className="rounded-2xl border border-border/70 bg-surface/50 p-8">
                  <h3 className="font-bold mb-2">Phase 1: Data Migration</h3>
                  <p className="text-sm text-muted mb-6">
                    Clicking this button will take all the hardcoded events, FAQs, and achievements from <code>content.ts</code> and push them into Firestore collections. This is required before building the CMS.
                  </p>
                  <button 
                    onClick={handleMigration}
                    className="rounded-full bg-accent-blue text-white px-6 py-2 text-sm font-bold hover:scale-[1.02] transition-transform"
                  >
                    Run Database Migration
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

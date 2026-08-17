"use client";

import { useAuth, UserProfile } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

type UpcomingEventWithCount = any & {
  registrationCount: number;
};

export default function AdminDashboard() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"requests" | "events" | "cms_events" | "cms_content" | "cms_gallery" | "setup">("events");
  
  const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventWithCount[]>([]);
  
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

      // 2. Fetch published events and their registration counts
      const eventsSnap = await getDocs(collection(db, "events"));
      const dbEvents: any[] = [];
      eventsSnap.forEach((d) => dbEvents.push({ id: d.id, ...d.data() }));

      const published = dbEvents.filter(e => e.status === "published");

      const regCounts: Record<string, number> = {};
      
      await Promise.all(published.map(async (event) => {
        const snap = await getDocs(collection(db, "events", event.id, "registrations"));
        regCounts[event.id] = snap.size;
      }));

      setUpcomingEvents(published.map(e => ({
        ...e,
        registrationCount: regCounts[e.id] || 0
      })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile && userProfile.role === "admin") {
      fetchAdminData();
    }
  }, [userProfile]);

  const handleRequestAction = async (request: ProfileRequest, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
    try {
      const reqRef = doc(db, "profile_edit_requests", request.userId);
      
      if (action === "approve") {
        const allowedFields = ["phone", "collegeEmail", "course", "branch", "year"];
        if (!allowedFields.includes(request.field)) {
          alert("Security Error: Attempted to update an unauthorized field (e.g. role). Request blocked.");
          return;
        }

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

  if (!userProfile || userProfile.role !== "admin") {
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
        title="Admin Panel" 
        description="Manage GDGoC RIT operations, profile requests, and event data." 
      />
      <div className="flex-1 container-shell py-12">
        
        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/70 pb-4 mb-8">
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
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === "requests" ? "bg-foreground text-background" : "hover:bg-surface text-muted"}`}
          >
            Profile Edit Requests {profileRequests.length > 0 && <span className="ml-2 bg-accent-red text-white text-[10px] px-2 py-0.5 rounded-full">{profileRequests.length}</span>}
          </button>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Upcoming Event Registrations</h2>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="rounded-2xl border border-border/70 bg-surface/50 p-12 text-center">
                    <p className="text-muted">No upcoming events currently.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="rounded-2xl border border-border/70 bg-surface overflow-hidden p-6 hover:border-accent-blue/50 transition-colors flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="mt-3 inline-flex items-center rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-semibold text-accent-blue">
                            {event.registrationCount} Registered
                          </div>
                        </div>
                        <button 
                          onClick={() => router.push(`/admin/events/${event.id}`)}
                          className="mt-6 w-full py-2 rounded-xl bg-foreground text-background text-sm font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                          View Registrations <ArrowRight size={16} />
                        </button>
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
                <div className="rounded-2xl border border-accent-red/50 bg-accent-red/5 p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-red"></div>
                  <h3 className="font-bold text-accent-red mb-2">⚠️ CAUTION: Phase 1 Data Migration</h3>
                  <p className="text-sm text-foreground/80 mb-6">
                    Clicking this button will take all the hardcoded events, FAQs, and achievements from <code>content.ts</code> and push them into Firestore collections. <strong>Do NOT use this unless you are setting up the database for the very first time. It will overwrite existing static data!</strong>
                  </p>
                  <button 
                    onClick={handleMigration}
                    className="rounded-full bg-accent-red text-white px-6 py-2 text-sm font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-accent-red/20"
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

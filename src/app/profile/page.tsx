"use client";

import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [requestSent, setRequestSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [requestedChanges, setRequestedChanges] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setGithub(userProfile.github || "");
      setLinkedin(userProfile.linkedin || "");
      setTwitter(userProfile.twitter || "");
      setInstagram(userProfile.instagram || "");
    }
  }, [userProfile]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Check if they already have a pending request
    const checkPendingRequest = async () => {
      if (user) {
        const reqRef = doc(db, "profile_edit_requests", user.uid);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists() && reqSnap.data().status === "pending") {
          setRequestSent(true);
        }
      }
    };
    checkPendingRequest();
  }, [user]);

  const handleEditRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestedChanges.trim()) {
      alert("Please specify what you want to change.");
      return;
    }
    
    setIsRequesting(true);
    try {
      await setDoc(doc(db, "profile_edit_requests", user.uid), {
        userId: user.uid,
        name: userProfile?.name,
        email: userProfile?.email,
        requestedChanges: requestedChanges.trim(),
        requestedAt: new Date().toISOString(),
        status: "pending"
      });
      setRequestSent(true);
      setShowForm(false);
      alert("Edit request sent! The core team will review it shortly.");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send edit request. Please try again later.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!user) return;
    setIsSavingRole(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        coreTeamRole: e.target.value
      }, { merge: true });
      await refreshProfile();
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to update Core Team Role.");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    
    const isAdmin = userProfile.role === "admin" || userProfile.role === "core";
    if (isAdmin && (!github.trim() || !linkedin.trim())) {
      alert("GitHub and LinkedIn links are mandatory for core team members.");
      return;
    }

    setIsSavingSocial(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        github: github.trim(),
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim()
      }, { merge: true });
      await refreshProfile();
      alert("Social links updated!");
    } catch (error) {
      console.error("Error saving social links:", error);
      alert("Failed to update social links.");
    } finally {
      setIsSavingSocial(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!userProfile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Profile Incomplete</h2>
        <button 
          onClick={() => router.push("/complete-profile")}
          className="rounded-full bg-foreground px-6 py-2 text-background font-medium"
        >
          Complete Profile Now
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader title="Your Profile" description="View your GDGoC RIT membership details." />
      
      <div className="flex-1 container-shell py-20 flex justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-border/70 bg-surface/50 p-8 md:p-12 backdrop-blur-sm">
          
          <div className="flex items-center gap-6 border-b border-border/70 pb-8 mb-8">
            <div className="h-20 w-20 rounded-full bg-accent-blue/10 flex items-center justify-center text-3xl font-bold text-accent-blue uppercase">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-muted">{userProfile.email}</p>
              <span className="inline-block mt-2 rounded-full bg-accent-green/20 px-3 py-1 text-xs font-bold text-accent-green uppercase tracking-wider">
                {userProfile.role || "Member"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-sm font-medium text-muted mb-1">Phone Number</p>
              <p className="text-lg font-medium">{userProfile.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted mb-1">College Email</p>
              <p className="text-lg font-medium">{userProfile.collegeEmail || "Not Provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted mb-1">Course & Branch</p>
              <p className="text-lg font-medium">{userProfile.course} in {userProfile.branch}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted mb-1">Year of Study</p>
              <p className="text-lg font-medium">{userProfile.year}</p>
            </div>
          </div>

          {(userProfile.role === "admin" || userProfile.role === "core") && (
            <div className="rounded-2xl bg-accent-blue/10 p-6 border border-accent-blue/20 mb-10">
              <h3 className="font-bold text-accent-blue mb-1">Core Team Settings</h3>
              <p className="text-sm text-accent-blue/80 mb-4">Since you are an admin/core member, select your public role for the Core Team page.</p>
              
              <div className="flex items-center gap-4">
                <select 
                  value={userProfile.coreTeamRole || ""}
                  onChange={handleRoleChange}
                  disabled={isSavingRole}
                  className="rounded-lg border border-accent-blue/30 bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent-blue text-foreground"
                >
                  <option value="" disabled>Select your role...</option>
                  <option value="GDG Lead">GDG Lead</option>
                  <option value="Event Manager">Event Manager</option>
                  <option value="Tech Lead">Tech Lead</option>
                  <option value="Social Media Lead">Social Media Lead</option>
                  <option value="PR & Outreach">PR & Outreach</option>
                </select>
                {isSavingRole && <span className="text-xs font-bold text-accent-blue">Saving...</span>}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-surface p-6 border border-border/70 mb-10">
            <h3 className="font-bold mb-1">Social Links</h3>
            <p className="text-sm text-muted mb-4">
              Add your GitHub and LinkedIn profiles. {(userProfile.role === "admin" || userProfile.role === "core") ? <span className="text-accent-red font-medium">Mandatory for core team members.</span> : "Optional for students."}
            </p>
            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">GitHub URL</label>
                  <input 
                    type="url"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    required={userProfile.role === "admin" || userProfile.role === "core"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">LinkedIn URL</label>
                  <input 
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                    required={userProfile.role === "admin" || userProfile.role === "core"}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Twitter (X) URL</label>
                  <input 
                    type="url"
                    value={twitter}
                    onChange={e => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Instagram URL</label>
                  <input 
                    type="url"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSavingSocial}
                  className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isSavingSocial ? "Saving..." : "Save Links"}
                </button>
              </div>
            </form>
          </div>

          {userProfile.role !== "admin" && userProfile.role !== "core" && (
            <div className="rounded-2xl bg-surface p-6 border border-border/70">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold mb-1">Need to change your details?</h3>
                <p className="text-sm text-muted">To maintain data integrity, profile changes must be approved by the core team.</p>
              </div>
              {requestSent ? (
                <button disabled className="shrink-0 rounded-full bg-accent-yellow/20 px-6 py-2 text-sm font-bold text-accent-yellow cursor-not-allowed">
                  Request Pending Review...
                </button>
              ) : !showForm ? (
                <button 
                  onClick={() => setShowForm(true)}
                  className="shrink-0 rounded-full border border-border px-6 py-2 text-sm font-medium hover:bg-surface-raised transition-colors"
                >
                  Request Edit Access
                </button>
              ) : null}
            </div>

            {showForm && !requestSent && (
              <form onSubmit={handleEditRequest} className="mt-6 pt-6 border-t border-border/70">
                <label className="block text-sm font-medium mb-2">What would you like to change?</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g., I need to update my phone number to 9876543210..."
                  value={requestedChanges}
                  onChange={(e) => setRequestedChanges(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-accent-blue focus:outline-none mb-4 resize-none"
                />
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isRequesting}
                    className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background hover:scale-[1.02] transition-transform disabled:opacity-50"
                  >
                    {isRequesting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";

export default function CompleteProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [phone, setPhone] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [course, setCourse] = useState("BTech");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("1st Year");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If they aren't logged in, send them to login.
  // If they already have a profile, send them to home.
  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (userProfile) router.push("/");
    }
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Strict Validations
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter exactly 10 digits for your mobile number.");
      return;
    }

    if (!collegeEmail.trim().toLowerCase().endsWith("@ritroorkee.com")) {
      alert("College Email must end with @ritroorkee.com");
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email, // personal email from Google auth
        name: user.displayName,
        phone,
        collegeEmail: collegeEmail.trim().toLowerCase(),
        course,
        branch,
        year,
        role: "student", // default role
        createdAt: new Date().toISOString()
      });
      await refreshProfile();
      // Router will naturally push to "/" because of the useEffect above.
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (!user) || userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Complete Your Profile" 
        description="Just a few more details so we can speed up your event registrations!" 
      />
      <div className="flex-1 flex justify-center py-20 px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-border/70 bg-surface/50 p-8 backdrop-blur-sm">
          
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">Phone Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={e => {
                // Only allow numbers
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 10) setPhone(val);
              }}
              placeholder="e.g. 9876543210" 
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent-blue focus:outline-none"
            />
            <p className="text-xs text-muted mt-1">Exactly 10 digits required.</p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">College Email</label>
            <input 
              type="email" 
              required
              value={collegeEmail}
              onChange={e => setCollegeEmail(e.target.value)}
              placeholder="e.g. student@ritroorkee.com" 
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent-blue focus:outline-none"
            />
            <p className="text-xs text-muted mt-1">Must end with @ritroorkee.com</p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">Course</label>
            <select 
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent-blue focus:outline-none"
            >
              <option value="BTech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium">Branch / Specialization</label>
            <select 
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent-blue focus:outline-none"
            >
              <option value="CSE">Computer Science (CSE)</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium">Year of Study</label>
            <select 
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-accent-blue focus:outline-none"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Passed Out">Passed Out</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Download } from "lucide-react";

export default function AdminEventRegistrations() {
  const { id } = useParams();
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  
  const [eventData, setEventData] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!userProfile || userProfile.role !== "admin") {
      router.replace("/");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const eventSnap = await getDoc(doc(db, "events", id as string));
        if (eventSnap.exists()) {
          setEventData(eventSnap.data());
        }

        const q = query(collection(db, "event_registrations"), where("eventId", "==", id));
        const regsSnap = await getDocs(q);
        
        const regs: any[] = [];
        regsSnap.forEach(d => regs.push(d.data()));
        
        regs.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        setRegistrations(regs);
      } catch (err) {
        console.error("Error fetching registrations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [id, userProfile, loading, router]);

  const exportToCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ["Name", "Email", "Phone", "Course", "Branch", "Year", "Registered At"];
    const csvRows = [headers.join(",")];
    
    registrations.forEach(reg => {
      const p = reg.userProfile || {};
      const row = [
        `"${p.name || ""}"`,
        `"${p.email || ""}"`,
        `"${p.phone || ""}"`,
        `"${p.course || ""}"`,
        `"${p.branch || ""}"`,
        `"${p.year || ""}"`,
        `"${new Date(reg.registeredAt).toLocaleString()}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-blue border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHeader 
        title={eventData?.title || "Event Registrations"} 
        description={`${registrations.length} total participants`}
      />

      <section className="container-shell py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-sm font-medium hover:text-accent-blue transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <button 
            onClick={exportToCSV}
            disabled={registrations.length === 0}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} /> Export to CSV
          </button>
        </div>

        <div className="rounded-2xl border border-border/70 bg-surface overflow-hidden">
          {registrations.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No one has registered for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-raised/50 text-xs uppercase text-muted">
                  <tr>
                    <th className="px-6 py-4 font-medium">Student Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Education</th>
                    <th className="px-6 py-4 font-medium">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {registrations.map((reg, i) => (
                    <tr key={i} className="hover:bg-surface/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{reg.userProfile?.name || "Unknown"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-muted mb-1">{reg.userProfile?.email || "No Email"}</div>
                        <div className="text-xs">{reg.userProfile?.phone || "No Phone"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-foreground text-xs">{reg.userProfile?.course} {reg.userProfile?.branch} • {reg.userProfile?.year}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {new Date(reg.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

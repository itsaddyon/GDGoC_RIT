"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type EventType = {
  id: string;
  title: string;
  date: string;
  type: string;
  desc: string;
  color: string;
  status: "published" | "draft" | "closed";
};

export function EventManager() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EventType | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "events"));
      const evs: EventType[] = [];
      snap.forEach(d => evs.push(d.data() as EventType));
      setEvents(evs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.id) return;
    
    // Auto-generate ID if it's new and doesn't have one
    const idToSave = formData.id.trim().toLowerCase().replace(/\s+/g, '-');
    const finalData = { ...formData, id: idToSave };

    try {
      await setDoc(doc(db, "events", idToSave), finalData);
      setIsEditing(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to save event.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will not delete the associated registrations, but will hide it from the site.")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete event.");
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Event Manager</h2>
        <button 
          onClick={() => {
            setFormData({ id: "", title: "", date: "", type: "Main Event", desc: "", color: "var(--accent-blue)", status: "published" });
            setIsEditing(true);
          }}
          className="rounded-full bg-accent-blue text-white px-4 py-2 text-sm font-bold hover:scale-[1.02] transition-transform"
        >
          + Create New Event
        </button>
      </div>

      {isEditing && formData ? (
        <form onSubmit={handleSave} className="rounded-2xl border border-border/70 bg-surface/50 p-6 space-y-4">
          <h3 className="font-bold">{formData.id ? "Edit Event" : "New Event"}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event ID (URL Slug)</label>
              <input 
                required
                disabled={!!events.find(e => e.id === formData.id) && formData.id !== ""}
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. vibecon26"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. March 14, 2026"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <input 
                required
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g. Workshop"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                required
                rows={3}
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as "published" | "draft" | "closed" })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              >
                <option value="published">Published (Accepting Reg)</option>
                <option value="closed">Closed (No Reg)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color Theme</label>
              <select 
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              >
                <option value="var(--accent-blue)">Blue</option>
                <option value="var(--accent-red)">Red</option>
                <option value="var(--accent-green)">Green</option>
                <option value="var(--accent-yellow)">Yellow</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/70">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium">Save Event</button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-border/70 bg-surface/30 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{ev.title}</h3>
                <p className="text-sm text-muted">{ev.date} • {ev.type}</p>
                <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${ev.status === "published" ? "bg-accent-green/20 text-accent-green" : ev.status === "closed" ? "bg-accent-red/20 text-accent-red" : "bg-muted/20 text-muted"}`}>
                  {ev.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setFormData(ev); setIsEditing(true); }}
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-raised text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ev.id)}
                  className="px-3 py-1.5 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-muted text-center py-10">No events found.</p>}
        </div>
      )}
    </div>
  );
}

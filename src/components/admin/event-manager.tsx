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
  winner1?: string;
  winner2?: string;
  winner3?: string;
  galleryLink?: string;
  location?: string;
  venue?: string;
  time?: string;
  duration?: string;
  participants?: number;
  registrationOpen?: boolean;
  banner?: string;
  gallery?: string[];
  highlights?: string[];
  speakers?: { name: string; role: string; image: string }[];
  isDateTBA?: boolean;
  isLocationTBA?: boolean;
  registrationType?: "individual" | "team";
  minTeamSize?: number;
  maxTeamSize?: number;
  communityLink?: string;
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
      evs.sort((a, b) => {
        if (a.isDateTBA && !b.isDateTBA) return -1;
        if (!a.isDateTBA && b.isDateTBA) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
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

    if (!finalData.isDateTBA && !finalData.date) {
      alert("Please provide a Date, or check 'Date & Time To Be Announced'.");
      return;
    }

    if (!finalData.isLocationTBA && !finalData.location) {
      alert("Please provide a Venue/Location, or check 'Location To Be Announced'.");
      return;
    }

    if (finalData.status === "closed") {
      if (!finalData.galleryLink || finalData.galleryLink.trim() === "") {
        alert("To close this event, please provide a Google Drive Link (Gallery) in the form below.");
        return;
      }
    }

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
            setFormData({ 
              id: "", title: "", date: "", time: "", location: "", type: "Main Event", 
              desc: "", color: "var(--accent-blue)", status: "published", 
              winner1: "", winner2: "", winner3: "", galleryLink: "",
              isDateTBA: false, isLocationTBA: false, registrationType: "individual", minTeamSize: 2, maxTeamSize: 4,
              venue: "", duration: "4 Hours", participants: 100, registrationOpen: true, banner: "", gallery: [], highlights: [], speakers: [], communityLink: ""
            });
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
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="dateTBA" checked={formData.isDateTBA || false} onChange={e => setFormData({...formData, isDateTBA: e.target.checked})} className="rounded bg-background border-border" />
                  <label htmlFor="dateTBA" className="text-xs cursor-pointer">Date & Time To Be Announced</label>
                </div>
                {!formData.isDateTBA && (
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date"
                      required={!formData.isDateTBA}
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={formData.time?.split(':')[0] || "12"}
                        onChange={e => {
                          const min = formData.time?.split(':')[1] || "00";
                          setFormData({...formData, time: `${e.target.value}:${min}`})
                        }}
                        className="w-1/2 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                      >
                        {Array.from({ length: 24 }).map((_, i) => {
                          const hr = i.toString().padStart(2, '0');
                          return <option key={hr} value={hr}>{hr}:00</option>
                        })}
                      </select>
                      <select 
                        value={formData.time?.split(':')[1] || "00"}
                        onChange={e => {
                          const hr = formData.time?.split(':')[0] || "12";
                          setFormData({...formData, time: `${hr}:${e.target.value}`})
                        }}
                        className="w-1/2 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                      >
                        <option value="00">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Venue</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="locTBA" checked={formData.isLocationTBA || false} onChange={e => setFormData({...formData, isLocationTBA: e.target.checked})} className="rounded bg-background border-border" />
                  <label htmlFor="locTBA" className="text-xs cursor-pointer">Location To Be Announced</label>
                </div>
                {!formData.isLocationTBA && (
                  <input 
                    required={!formData.isLocationTBA}
                    value={formData.location || ""}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Auditorium, RIT"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select 
                required
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              >
                <option value="Main Event">Main Event</option>
                <option value="Study Jam">Study Jam</option>
                <option value="Competition">Competition</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Online Session">Online Session</option>
                <option value="Workshop">Workshop</option>
                <option value="Info Session">Info Session</option>
                <option value="Other">Other</option>
              </select>
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
            
            <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-border/50 pt-4 mt-2">

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input 
                  type="text"
                  value={formData.duration || ""}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 4 Hours"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Participants</label>
                <input 
                  type="number"
                  value={formData.participants || 100}
                  onChange={e => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Banner Image URL</label>
                <input 
                  type="text"
                  value={formData.banner || ""}
                  onChange={e => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="/events/default/banner.jpg"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Community RSVP Link (Optional)</label>
                <input 
                  type="url"
                  value={formData.communityLink || ""}
                  onChange={e => setFormData({ ...formData, communityLink: e.target.value })}
                  placeholder="https://gdg.community.dev/..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2 mt-2">
                <input 
                  type="checkbox"
                  id="regOpen"
                  checked={formData.registrationOpen !== false}
                  onChange={e => setFormData({ ...formData, registrationOpen: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="regOpen" className="text-sm font-medium cursor-pointer">Registration Open</label>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Highlights (comma separated)</label>
                <textarea 
                  rows={2}
                  value={formData.highlights?.join(", ") || ""}
                  onChange={e => setFormData({ ...formData, highlights: e.target.value.split(",").map(h => h.trim()).filter(h => h.length > 0) })}
                  placeholder="Hands-on Workshop, Q&A Session, Certificates"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="col-span-2 border-t border-border/50 pt-4 mt-2">
              <label className="block text-sm font-medium mb-2">Registration Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="regType" 
                    value="individual" 
                    checked={!formData.registrationType || formData.registrationType === "individual"} 
                    onChange={() => setFormData({...formData, registrationType: "individual"})} 
                    className="accent-foreground"
                  />
                  <span className="text-sm">Individual</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="regType" 
                    value="team" 
                    checked={formData.registrationType === "team"} 
                    onChange={() => setFormData({...formData, registrationType: "team"})} 
                    className="accent-foreground"
                  />
                  <span className="text-sm">Team</span>
                </label>
              </div>
              
              {formData.registrationType === "team" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs text-muted mb-1">Min Team Size (incl. leader)</label>
                    <input 
                      type="number" min="2" max="20"
                      value={formData.minTeamSize || 2}
                      onChange={e => setFormData({...formData, minTeamSize: parseInt(e.target.value)})}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Max Team Size (incl. leader)</label>
                    <input 
                      type="number" min="2" max="20"
                      value={formData.maxTeamSize || 4}
                      onChange={e => setFormData({...formData, maxTeamSize: parseInt(e.target.value)})}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {formData.status === "closed" && (
            <div className="space-y-4 border-t border-border/50 pt-4 mt-2">
              <h4 className="font-bold text-sm text-accent-blue uppercase tracking-wider">Post-Event Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">1st Place Winner</label>
                  <input 
                    value={formData.winner1 || ""}
                    onChange={e => setFormData({ ...formData, winner1: e.target.value })}
                    placeholder="Name or Team"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">2nd Place Winner</label>
                  <input 
                    value={formData.winner2 || ""}
                    onChange={e => setFormData({ ...formData, winner2: e.target.value })}
                    placeholder="Name or Team"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">3rd Place Winner</label>
                  <input 
                    value={formData.winner3 || ""}
                    onChange={e => setFormData({ ...formData, winner3: e.target.value })}
                    placeholder="Name or Team"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Google Drive Link (Gallery)</label>
                <input 
                  type="url"
                  value={formData.galleryLink || ""}
                  onChange={e => setFormData({ ...formData, galleryLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
                />
                <p className="text-xs text-muted mt-1">If provided, this link will be shown as a "View Gallery" button for students on the past events page.</p>
              </div>
            </div>
          )}
          
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

"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ContentData = {
  faqs: { question: string; answer: string }[];
  achievements: { number: string; label: string; suffix: string; prefix?: string }[];
  testimonials: { content: string; author: string; role: string; avatar: string }[];
};

export function ContentManager() {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "main"));
        if (snap.exists()) {
          setData(snap.data() as ContentData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "site_content", "main"), data);
      alert("Content saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading content...</div>;
  if (!data) return <div>No content found. Please run migration first.</div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Site Content Manager</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-foreground text-background px-6 py-2 text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* FAQS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">FAQs</h3>
          <button 
            onClick={() => setData({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] })}
            className="text-sm font-bold text-accent-blue hover:underline"
          >
            + Add FAQ
          </button>
        </div>
        {data.faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border/70 p-4 space-y-2 bg-surface/30">
            <div className="flex items-center justify-between">
              <input 
                value={faq.question}
                onChange={e => { const newFaqs = [...data.faqs]; newFaqs[i].question = e.target.value; setData({ ...data, faqs: newFaqs }); }}
                placeholder="Question"
                className="w-full bg-transparent font-bold focus:outline-none text-foreground"
              />
              <button 
                onClick={() => { const newFaqs = data.faqs.filter((_, idx) => idx !== i); setData({ ...data, faqs: newFaqs }); }}
                className="text-xs text-accent-red hover:underline ml-4"
              >
                Remove
              </button>
            </div>
            <textarea 
              value={faq.answer}
              onChange={e => { const newFaqs = [...data.faqs]; newFaqs[i].answer = e.target.value; setData({ ...data, faqs: newFaqs }); }}
              placeholder="Answer"
              rows={2}
              className="w-full bg-transparent text-sm text-muted focus:outline-none resize-none"
            />
          </div>
        ))}
      </div>

      {/* ACHIEVEMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Achievements</h3>
          <button 
            onClick={() => setData({ ...data, achievements: [...data.achievements, { number: "", label: "", suffix: "" }] })}
            className="text-sm font-bold text-accent-blue hover:underline"
          >
            + Add Achievement
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.achievements.map((ach, i) => (
            <div key={i} className="rounded-xl border border-border/70 p-4 space-y-3 bg-surface/30 relative group">
              <button 
                onClick={() => { const newA = data.achievements.filter((_, idx) => idx !== i); setData({ ...data, achievements: newA }); }}
                className="absolute top-2 right-2 text-xs text-accent-red hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
              <div className="grid grid-cols-3 gap-2">
                <input value={ach.prefix || ""} onChange={e => { const n = [...data.achievements]; n[i].prefix = e.target.value; setData({ ...data, achievements: n }); }} placeholder="Prefix (e.g. $)" className="bg-background border border-border/70 rounded px-2 py-1 text-sm w-full" />
                <input value={ach.number} onChange={e => { const n = [...data.achievements]; n[i].number = e.target.value; setData({ ...data, achievements: n }); }} placeholder="Number" className="bg-background border border-border/70 rounded px-2 py-1 text-sm w-full" />
                <input value={ach.suffix} onChange={e => { const n = [...data.achievements]; n[i].suffix = e.target.value; setData({ ...data, achievements: n }); }} placeholder="Suffix (e.g. +)" className="bg-background border border-border/70 rounded px-2 py-1 text-sm w-full" />
              </div>
              <input value={ach.label} onChange={e => { const n = [...data.achievements]; n[i].label = e.target.value; setData({ ...data, achievements: n }); }} placeholder="Label (e.g. Members)" className="bg-background border border-border/70 rounded px-2 py-1 text-sm w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

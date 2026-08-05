"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
};

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "gallery"));
      const imgs: GalleryImage[] = [];
      snap.forEach(d => imgs.push({ id: d.id, ...d.data() } as GalleryImage));
      // sort by date descending
      imgs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      setImages(imgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "gallery"), {
        url,
        caption,
        uploadedAt: new Date().toISOString()
      });
      setIsAdding(false);
      setUrl("");
      setCaption("");
      fetchImages();
    } catch (error) {
      console.error(error);
      alert("Failed to add image.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      fetchImages();
    } catch (error) {
      console.error(error);
      alert("Failed to delete image.");
    }
  };

  if (loading) return <div>Loading gallery...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Photo Gallery Manager</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="rounded-full bg-accent-blue text-white px-4 py-2 text-sm font-bold hover:scale-[1.02] transition-transform"
        >
          + Add Image via URL
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-border/70 bg-surface/50 p-6 space-y-4">
          <h3 className="font-bold">Add New Image</h3>
          <p className="text-sm text-muted mb-4">Paste a direct image link (e.g. from Discord, Imgur, or Google Drive) to add it to the site gallery without paying for storage.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input 
                required
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
              <input 
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="VibeCon 2026 Opening Ceremony"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/70">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-50">
              {saving ? "Adding..." : "Add to Gallery"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border/70 bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img.url} 
              alt={img.caption || "Gallery Image"} 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center gap-2">
              <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
              <button 
                onClick={() => handleDelete(img.id)}
                className="bg-accent-red text-white text-xs font-bold px-3 py-1 rounded-full hover:scale-105 transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !isAdding && (
          <p className="text-muted col-span-full py-10 text-center">No images in gallery yet.</p>
        )}
      </div>
    </div>
  );
}

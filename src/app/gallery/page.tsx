"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ExternalLink, Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [eventAlbums, setEventAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Individual Images
        const gallerySnap = await getDocs(collection(db, "gallery"));
        const imgs: any[] = [];
        gallerySnap.forEach(d => imgs.push(d.data()));
        imgs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setImages(imgs);

        // Fetch Closed Events with Gallery Links
        const q = query(collection(db, "events"), where("status", "==", "closed"));
        const eventsSnap = await getDocs(q);
        const albums: any[] = [];
        eventsSnap.forEach(d => {
          const data = d.data();
          if (data.galleryLink) {
            albums.push({ id: d.id, ...data });
          }
        });
        
        // Hardcoded fallback for Vibecon as requested
        if (!albums.find(a => (a.title || "").toLowerCase().includes("vibecon"))) {
          albums.push({
            id: "vibecon-hardcoded",
            title: "Vibecon",
            date: "Oct 20, 2023",
            type: "Main Event",
            color: "var(--accent-blue)",
            galleryLink: "https://drive.google.com/drive/folders/15aCwq0PkGlHssB0PzXdzd7udV6bPVOX_"
          });
        }

        albums.sort((a, b) => (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime()));
        setEventAlbums(albums);

      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Gallery" 
        description="Memories from our past events, workshops, and study jams." 
      />
      
      <div className="flex-1 container-shell py-12 md:py-24">
        
        {loading ? (
          <div className="flex justify-center py-20 text-muted">Loading gallery...</div>
        ) : (
          <div className="space-y-20">
            {/* Event Albums Section */}
            {eventAlbums.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-accent-red" />
                  Event Albums
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventAlbums.map((album, i) => (
                    <motion.a
                      href={album.galleryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={album.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/50 p-6 transition-all hover:bg-surface hover:shadow-xl hover:shadow-accent-blue/5"
                    >
                      <div className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ color: album.color, backgroundColor: `${album.color}15` }}>
                        {album.type}
                      </div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                        {album.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted mb-6">
                        <CalendarIcon size={14} />
                        {album.date}
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-border/70 pt-4 mt-auto">
                        <span className="text-sm font-medium text-foreground">View Album Drive</span>
                        <ExternalLink size={16} className="text-muted group-hover:text-accent-blue transition-colors" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Photos Grid */}
            {images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <ImageIcon size={20} className="text-accent-blue" />
                  Featured Photos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`relative group overflow-hidden rounded-2xl bg-surface/50 border border-border/70 ${
                        i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.url} 
                        alt={img.caption || "GDGoC RIT Event"} 
                        className="w-full h-full object-cover aspect-square transition-transform duration-700 group-hover:scale-105"
                      />
                      {img.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-medium">{img.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {images.length === 0 && eventAlbums.length === 0 && (
              <div className="text-center py-20 text-muted border border-border border-dashed rounded-3xl">
                No gallery items available yet. Add some from the Admin Panel!
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";

const GALLERY_ITEMS = [
  { id: 1, title: "Google Cloud Study Jam", category: "Workshop", img: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Web Dev Bootcamp", category: "Bootcamp", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Android Study Jams", category: "Study Jams", img: "https://images.unsplash.com/photo-1607252654015-f84f1b37f4cb?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Info Session 2024", category: "Event", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "AI/ML Workshop", category: "Workshop", img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Hackathon 2023", category: "Hackathon", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" },
];

export default function GalleryPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Gallery" 
        description="Memories from our past events, workshops, and study jams." 
      />
      
      <div className="flex-1 container-shell py-12 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-2xl bg-surface/50 aspect-video cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.img} 
                alt={item.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-1">{item.category}</p>
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

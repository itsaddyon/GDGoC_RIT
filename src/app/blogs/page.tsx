import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with Google Cloud Platform in 2024",
    excerpt: "Learn the basics of GCP, set up your first project, and deploy a simple web application using Cloud Run.",
    author: "Tech Team",
    date: "Aug 15, 2024",
    category: "Cloud",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Why Flutter is the Future of Mobile Development",
    excerpt: "An in-depth look at how Flutter's widget tree and Dart language make building cross-platform apps incredibly fast.",
    author: "Mobile Domain",
    date: "Jul 22, 2024",
    category: "App Dev",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Mastering Machine Learning with TensorFlow",
    excerpt: "A beginner-friendly guide to building your first neural network for image classification.",
    author: "AI/ML Team",
    date: "Jun 10, 2024",
    category: "AI/ML",
    img: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Insights & Blogs" 
        description="Read the latest articles, tutorials, and insights from our technical domains." 
      />
      
      <div className="flex-1 container-shell py-12 md:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link 
              key={post.id} 
              href="#"
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-sm transition-all hover:border-border hover:bg-surface/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.img} 
                  alt={post.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  {post.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                </div>
                <h3 className="mb-2 text-xl font-medium leading-tight group-hover:text-accent-blue transition-colors">{post.title}</h3>
                <p className="mb-6 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-foreground">
                  Read article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

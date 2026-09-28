import { MetadataRoute } from 'next'
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gdgrit.vercel.app";
  
  // Base routes
  const routes = [
    "",
    "/about",
    "/events",
    "/team",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic events
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("status", "in", ["published", "closed"]));
    const snap = await getDocs(q);
    const eventRoutes = snap.docs.map((doc) => ({
      url: `${baseUrl}/events/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
    return [...routes, ...eventRoutes];
  } catch (error) {
    console.error("Error generating sitemap for events", error);
    return routes;
  }
}

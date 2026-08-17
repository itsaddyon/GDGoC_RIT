import { NextResponse } from "next/server";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snap = await getDocs(collection(db, "events"));
    const events: any[] = [];
    
    let vibeconFound = false;
    for (const d of snap.docs) {
      const data = d.data();
      events.push({ id: d.id, title: data.title, status: data.status, galleryLink: data.galleryLink });
      
      if (data.title && data.title.toLowerCase().includes("vibecon")) {
        vibeconFound = true;
        await updateDoc(doc(db, "events", d.id), {
          status: "closed",
          galleryLink: "https://drive.google.com/drive/folders/15aCwq0PkGlHssB0PzXdzd7udV6bPVOX_"
        });
      }
    }
    
    return NextResponse.json({ success: true, vibeconFound, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

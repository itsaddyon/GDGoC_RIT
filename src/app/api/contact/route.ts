import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const text = `📬 New Contact Form Submission\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n💬 Message: ${message}`;
    
    // Server-side fetch to Telegram avoids CORS issues
    const response = await fetch(`https://api.telegram.org/bot8605400693:AAHxpTPUuaZ1gvQg1LihefgRxR7lhHl-DhA/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "1740858743",
        text: text,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      const err = await response.text();
      console.error("Telegram API Error:", err);
      return NextResponse.json({ error: "Failed to send message to Telegram" }, { status: 500 });
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

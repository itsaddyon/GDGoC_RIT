import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 1000;

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";
    const isValidOrigin = 
      origin.includes("gdgrit.vercel.app") || 
      referer.includes("gdgrit.vercel.app") ||
      origin.includes("localhost") || 
      referer.includes("localhost");

    if (!isValidOrigin) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (now - rateData.timestamp < RATE_LIMIT_WINDOW) {
      rateData.count++;
      if (rateData.count > RATE_LIMIT_MAX) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
    } else {
      rateData.count = 1;
      rateData.timestamp = now;
    }
    rateLimitMap.set(ip, rateData);

    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message is too long (max 1000 characters)" }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram env vars not configured.");
      return NextResponse.json({ error: "Server not configured." }, { status: 500 });
    }

    const text = `📬 New Contact Form Submission\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n💬 Message: ${message}`;
    
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
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

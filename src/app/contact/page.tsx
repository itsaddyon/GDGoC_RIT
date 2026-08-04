"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <PageHeader 
        title="Get in Touch" 
        description="Have a question or want to collaborate? We'd love to hear from you." 
      />
      
      <div className="flex-1 container-shell py-12 md:py-24">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-surface/50 p-8 backdrop-blur-sm sm:p-12">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input 
                type="text" 
                id="name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name" 
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Your email address" 
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium">Contact Number</label>
              <input 
                type="tel" 
                id="phone" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                pattern="^(\+91[\-\s]?)?[0-9]{10}$"
                title="Please enter a valid 10-digit phone number (e.g. 9876543210 or +91 9876543210)"
                placeholder="Your contact number" 
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message" 
                className="resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-sm">
                <p className="font-medium text-green-500 mb-1">Message sent successfully!</p>
                <p className="text-muted">Thanks for reaching out. The GDG team will get back to you within 24 hours.</p>
              </div>
            )}
            {status === "error" && (
              <p className="text-sm text-red-500 text-center mt-2">Failed to send message. Please try again later.</p>
            )}
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

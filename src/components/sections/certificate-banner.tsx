"use client";

import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";

export function CertificateBanner() {
  return (
    <section className="container-shell py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-accent-blue/10 via-surface to-accent-blue/5 border border-accent-blue/20 p-8 md:p-12"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue text-background shadow-lg shadow-accent-blue/25">
              <Award size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Verify Your Certificate</h3>
              <p className="text-muted max-w-xl">
                Did you attend one of our events? Verify your participation certificate authenticity through our official portal.
              </p>
            </div>
          </div>
          
          <motion.a
            href="https://gdgoc-web-app.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 rounded-full bg-accent-blue px-8 py-4 text-sm font-bold text-background shadow-lg shadow-accent-blue/25 transition-colors hover:bg-accent-blue/90 w-full md:w-auto justify-center"
          >
            Verify Now <ArrowRight size={16} />
          </motion.a>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-blue/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-blue/5 blur-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
}

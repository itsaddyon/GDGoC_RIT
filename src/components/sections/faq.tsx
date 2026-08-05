"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "main"));
        if (snap.exists() && snap.data().faqs) {
          setFaqs(snap.data().faqs);
        }
      } catch (error) {
        console.error("Failed to fetch faqs:", error);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="relative border-t border-border/70 py-24 sm:py-32">
      <div className="container-shell max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-red">
            FAQ
          </span>
          <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Good to know.
          </h2>
        </motion.div>

        <div className="divide-y divide-border/70 border-y border-border/70">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={f.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-sm font-medium sm:text-base">{f.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-muted"
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-muted">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

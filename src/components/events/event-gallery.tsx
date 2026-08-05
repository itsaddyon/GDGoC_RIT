"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

type EventGalleryProps = {
  images: string[];
};

export function EventGallery({ images }: EventGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <section className="mt-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Event Gallery</h2>
          <p className="mt-2 text-muted">
            Photos from the event will appear here.
          </p>
        </div>

        <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-border bg-surface/40">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted" />
            <p className="text-muted">No gallery available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent-blue">
          Memories
        </span>

        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Event Gallery
        </h2>

        <p className="mt-3 max-w-2xl text-muted">
          Moments captured during the event.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
            }}
            className="group overflow-hidden rounded-3xl border border-border bg-surface"
          >
            <img
              src={image}
              alt={`Event ${index + 1}`}
              className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="border-t border-border px-5 py-4">
              <p className="text-sm text-muted">
                Event Photo {index + 1}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
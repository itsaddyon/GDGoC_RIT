"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift
    this.size = Math.random() * 2.5 + 1.0;
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }
}

const GOOGLE_COLORS = [
  { r: 66, g: 133, b: 244 }, // Blue
  { r: 234, g: 67, b: 53 },  // Red
  { r: 251, g: 188, b: 4 },  // Yellow
  { r: 52, g: 168, b: 83 },  // Green
];

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let startTime = performance.now();
    
    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;
      
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      
      // Normalize coordinate system to use css pixels
      ctx.scale(dpr, dpr);
      
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(100, Math.floor((logicalWidth * logicalHeight) / 10000));
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(logicalWidth, logicalHeight));
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      const cycleTime = 5000; // 5 seconds per color
      const validTime = typeof time === "number" && !isNaN(time) ? time : performance.now();
      const elapsed = Math.max(0, validTime - startTime);
      const index = (Math.floor(elapsed / cycleTime) % GOOGLE_COLORS.length) || 0;
      const nextIndex = ((index + 1) % GOOGLE_COLORS.length) || 0;
      const progress = ((elapsed % cycleTime) / cycleTime) || 0;
      
      // Smooth easing (cosine)
      const ease = (1 - Math.cos(progress * Math.PI)) / 2;
      
      const c1 = GOOGLE_COLORS[index] || GOOGLE_COLORS[0];
      const c2 = GOOGLE_COLORS[nextIndex] || GOOGLE_COLORS[0];
      const r = Math.round(c1.r + (c2.r - c1.r) * ease);
      const g = Math.round(c1.g + (c2.g - c1.g) * ease);
      const b = Math.round(c1.b + (c2.b - c1.b) * ease);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
      
      // Update and draw particles
      particles.forEach(p => {
        p.update(logicalWidth, logicalHeight);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw threads (lines) between close particles
      ctx.lineWidth = 1.0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      className="pointer-events-none fixed inset-0 z-[0] opacity-100 transition-opacity duration-1000"
      aria-hidden
    />
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Real seamless marquee — doubles the items and uses transform3d for GPU compositing
function Marquee({ items }: { items: string[] }) {
  const x = useRef(0);
  const el = useRef<HTMLDivElement>(null);
  const trackWidth = useRef(0);

  useEffect(() => {
    if (el.current) {
      trackWidth.current = el.current.scrollWidth / 2;
    }
  }, []);

  useAnimationFrame((_, delta) => {
    x.current -= (delta / 1000) * 80; // 80px/s
    if (Math.abs(x.current) >= trackWidth.current) {
      x.current = 0;
    }
    if (el.current) {
      el.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
    }
  });

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden w-full select-none pointer-events-none" aria-hidden>
      <div ref={el} className="flex items-center gap-0 whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/50 px-8">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = [
  'CommerceCast',
  'Forecast · Optimize · Scale',
  'AI-Powered Analytics',
  'Built for E-commerce',
  'Real-time Intelligence',
];

// Inline SVG noise filter — renders actual film grain, not gradient
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export function PreFooterCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full overflow-hidden bg-background text-foreground border-t border-border/30"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Grain texture overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] dark:opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Mouse spotlight ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-700"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(59,130,246,0.08) 0%, transparent 70%)`,
        }}
      />

      {/* ── Ambient glow ── */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.07),transparent)]" />

      {/* ── Content ── */}
      <div className="relative z-20 container px-4 py-32 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-6"
        >
          Get started today
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter font-headline leading-[1.05] mb-6 max-w-3xl"
        >
          Stop guessing.
          <br />
          <span className="text-muted-foreground/60">Start knowing.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-muted-foreground max-w-xl mb-10 leading-relaxed"
        >
          Join forward-thinking e-commerce teams using CommerceCast to make every inventory and pricing decision with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="font-semibold hover:-translate-y-0.5 transition-all shadow-xl"
          >
            <Link href="/signup">
              Start free trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-semibold transition-all bg-background border-border/50 hover:bg-muted/50"
          >
            <Link href="/login">Talk to sales →</Link>
          </Button>
        </motion.div>
      </div>

      {/* ── Marquee strip ── */}
      <div className="relative z-20 border-t border-border/50 py-4 w-full bg-muted/10">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </section>
  );
}

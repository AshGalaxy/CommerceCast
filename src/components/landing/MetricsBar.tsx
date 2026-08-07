'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const metrics = [
  { value: 500, suffix: '+', label: 'Brands on CommerceCast' },
  { value: 94.8, suffix: '%', label: 'Avg forecast accuracy' },
  { value: 81, suffix: '%', label: 'Avg stockout reduction' },
  { value: 12, suffix: ' min', label: 'Time to first insight' },
];

function CountUp({
  target,
  suffix,
  active,
  decimals = 0,
}: {
  target: number;
  suffix: string;
  active: boolean;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * target);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, target]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toString();

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export function MetricsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative w-full py-16 bg-background" ref={ref}>
      {/* Top separator — very faint */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-5">
            By the numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter font-headline leading-[1.06]">
            Proven at scale
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-4 gap-2">
              <span className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
                <CountUp
                  target={m.value}
                  suffix={m.suffix}
                  active={inView}
                  decimals={m.value % 1 !== 0 ? 1 : 0}
                />
              </span>
              <span className="text-xs text-muted-foreground leading-snug max-w-[120px]">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </section>
  );
}

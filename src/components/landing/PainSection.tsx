'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useEffect as useFramerEffect } from 'framer-motion';
import { useEffect } from 'react';

const stats = [
  {
    value: 2.1,
    suffix: 'M',
    prefix: '$',
    label: 'Average annual revenue lost to stockouts per brand',
    color: 'from-red-500/20 to-red-600/5',
    textColor: 'text-red-400',
  },
  {
    value: 34,
    suffix: '%',
    prefix: '',
    label: 'Of promotions run at a net loss due to poor demand signals',
    color: 'from-amber-500/20 to-amber-600/5',
    textColor: 'text-amber-400',
  },
  {
    value: 47,
    suffix: 'hrs',
    prefix: '',
    label: 'Ops team hours wasted per week on manual demand planning',
    color: 'from-orange-500/20 to-orange-600/5',
    textColor: 'text-orange-400',
  },
];

function AnimatedNumber({
  value,
  prefix,
  suffix,
  color,
  inView,
}: {
  value: number;
  prefix: string;
  suffix: string;
  color: string;
  inView: boolean;
}) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (displayRef.current) {
        const formatted = value < 10 ? v.toFixed(1) : Math.floor(v).toString();
        displayRef.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [spring, prefix, suffix, value]);

  return (
    <span
      ref={displayRef}
      className={`text-5xl md:text-6xl font-extrabold tracking-tight font-headline bg-gradient-to-br ${color} bg-clip-text text-transparent`}
    >
      {prefix}0{suffix}
    </span>
  );
}

export function PainSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative w-full bg-[#080c14] text-white py-24 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(239,68,68,0.04),transparent)]" />

      <div className="container px-4" ref={ref}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-semibold mb-5">
            The cost of guessing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-headline tracking-tighter leading-[1.06] max-w-3xl mx-auto">
            What losing one Q4{' '}
            <span className="text-white/30">really costs you.</span>
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`relative rounded-2xl border border-white/[0.07] bg-gradient-to-br ${stat.color} p-8 flex flex-col gap-4 overflow-hidden`}
            >
              {/* Corner glow */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.02] blur-2xl" />

              <AnimatedNumber
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                color={`from-white to-white/60`}
                inView={inView}
              />

              <p className="text-sm text-white/45 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-white/30 mt-12 max-w-lg mx-auto leading-relaxed"
        >
          These are not edge cases.{' '}
          <span className="text-white/50 font-medium">They are your Monday morning.</span>
        </motion.p>
      </div>

      {/* Bottom fade into background */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }}
      />
    </section>
  );
}

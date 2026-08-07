'use client';

import { motion } from 'framer-motion';

const logosRow1 = [
  'Acme Corp', 'GlobalTech', 'Nexus', 'Vertex', 'Synergy', 'Apex', 'Zenith'
];

const logosRow2 = [
  'Quantum', 'Pinnacle', 'Horizon', 'Vanguard', 'Starlight', 'Nova', 'Echo'
];

function Logo({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-40 h-16 rounded-xl border border-border/40 bg-muted/20 text-muted-foreground/50 font-headline font-bold text-lg tracking-wide uppercase mx-4">
      {name}
    </div>
  );
}

export function LogoWall() {
  return (
    <section className="relative w-full py-16 bg-background overflow-hidden border-t border-border/20">
      <div className="container px-4 text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/50 font-semibold">
          Trusted by operators at brands you know
        </p>
      </div>

      <div className="relative flex flex-col gap-6">
        {/* Left/Right Fade Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Row 1 (Left to Right) */}
        <div className="flex overflow-hidden w-full" style={{ '--duration': '40s' } as React.CSSProperties}>
          <div className="flex animate-marquee w-max">
            {[...logosRow1, ...logosRow1].map((logo, i) => (
              <Logo key={`${logo}-${i}`} name={logo} />
            ))}
          </div>
        </div>

        {/* Row 2 (Right to Left) */}
        <div className="flex overflow-hidden w-full" style={{ '--duration': '45s' } as React.CSSProperties}>
          <div className="flex animate-marquee-reverse w-max">
            {[...logosRow2, ...logosRow2].map((logo, i) => (
              <Logo key={`${logo}-${i}`} name={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

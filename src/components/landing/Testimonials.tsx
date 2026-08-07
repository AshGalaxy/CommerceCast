'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'VP of E-commerce',
    company: 'StyleCo',
    content:
      'Q4 used to be pure chaos — constant stockouts, endless spreadsheets. With CommerceCast, our stockouts dropped 80%. The predictive engine is genuinely that good.',
    stars: 5,
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SarahJ&backgroundColor=dbeafe',
    highlight: 'Stockouts dropped 80%',
  },
  {
    name: 'David Chen',
    role: 'Founder',
    company: 'TechGear',
    content:
      'The Promotion Simulator saved us from a Black Friday deal that would have obliterated our margins. Seeing the outcome before running the promo is like having a superpower.',
    stars: 5,
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=DavidC&backgroundColor=ede9fe',
    highlight: 'Margin-safe promotions',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Director of Ops',
    company: 'NovaBrands',
    content:
      'I had it integrated with our Shopify store in an afternoon. The UI feels like a consumer product, not enterprise software. My team actually uses it every day.',
    stars: 5,
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=ElenaR&backgroundColor=fef3c7',
    highlight: 'Set up in one afternoon',
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Growth',
    company: 'Summit Labs',
    content:
      "It's the first analytics tool my team logs into without being asked. The data storytelling is exceptional — everything is visual, clear, and immediately actionable.",
    stars: 5,
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=MarcusT&backgroundColor=dcfce7',
    highlight: 'Team adoption overnight',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative w-full py-28 bg-muted/20 border-y border-border/40 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Customer stories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">
            Loved by operators who move fast
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="group flex flex-col gap-5 p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Stars + Highlight */}
              <div className="flex items-center justify-between">
                <Stars count={t.stars} />
                <span className="text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full border border-primary/15">
                  {t.highlight}
                </span>
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1 border-t border-border/30">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 bg-muted shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}

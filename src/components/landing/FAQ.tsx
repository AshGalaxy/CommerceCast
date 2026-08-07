'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'How long does setup actually take?',
    answer:
      'Most stores are fully connected and producing their first accurate forecasts within 10–15 minutes. We offer 1-click integrations for Shopify, Amazon, WooCommerce, and Magento. For custom stacks, our REST API and CSV import cover any edge case.',
  },
  {
    question: 'Do I need a data scientist or technical team?',
    answer:
      'No. CommerceCast is built for operators, founders, and growth leads — not data engineers. The interface surfaces complex ML outputs as clear, plain-language insights and one-click recommendations.',
  },
  {
    question: 'How accurate is the demand forecasting?',
    answer:
      'Our ensemble model (Prophet + XGBoost + ARIMA) achieves 90–95% accuracy across a benchmark of 500+ e-commerce brands. Accuracy improves continuously as the system learns your specific patterns, seasonality, and promotions.',
  },
  {
    question: 'What makes the Promotion Simulator different?',
    answer:
      'Unlike basic calculators, our simulator accounts for cross-category cannibalization, inventory drain velocity, and historical elasticity at the SKU level. It has a 92% accuracy rate at predicting actual Black Friday and Cyber Monday outcomes before they happen.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant and never use your data to train models for other customers.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. There are no lock-in contracts. You can downgrade or cancel from your billing dashboard at any time. If you cancel an annual plan, we prorate any unused months.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full py-28 bg-background overflow-hidden">
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
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">
            Questions we hear often
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="border-b border-border/40 last:border-0"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <span className={`text-[15px] font-semibold transition-colors ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary/80'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                      isOpen
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-transparent border-border/60 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

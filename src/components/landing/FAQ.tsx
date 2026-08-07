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
  {
    question: 'Does CommerceCast work for D2C brands and marketplace sellers?',
    answer:
      'Yes — CommerceCast is designed for both. D2C brands benefit from unified demand signals across their own store and social channels, while marketplace sellers get per-ASIN/SKU forecasting across Amazon, Flipkart, and more.',
  },
  {
    question: 'How does the AI handle new products with no sales history?',
    answer:
      'CommerceCast uses category-level transfer learning — it borrows demand patterns from similar products in your catalogue and from anonymised benchmark data, giving you a credible starting forecast from day one. Accuracy sharpens after 2–4 weeks of real sales.',
  },
  {
    question: 'Can I use CommerceCast alongside my existing ERP or 3PL?',
    answer:
      'Yes. CommerceCast integrates via REST API and webhooks with most major ERPs (SAP, Oracle NetSuite) and 3PLs (ShipBob, Fulfillment by Amazon, Delhivery). It reads and writes inventory events bidirectionally.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'You retain full ownership of your data. On cancellation, we provide a complete export in CSV and JSON within 48 hours. Your data is permanently deleted from our systems within 30 days per our data retention policy.',
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'The web dashboard is fully responsive and works great on mobile browsers. A dedicated iOS and Android app is on our Q3 roadmap — join the Pro waitlist to get early access.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full py-24 bg-background overflow-hidden">
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
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline leading-[1.06]">
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
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="border-b border-border/40 last:border-0"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <span
                    className={`text-[15px] font-semibold transition-colors ${
                      isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary/80'
                    }`}
                  >
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

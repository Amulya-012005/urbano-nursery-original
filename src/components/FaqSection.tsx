import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How are living plants safely packaged for delivery?',
      a: 'Each plant is hydrated before packing, root-stabilized in breathable coir coco peat, and locked inside heavy-duty ventilated shock-absorbent cardboard frames. We do not use single-use plastics.'
    },
    {
      q: 'What is the Urbano 7-Day Healthy Plant Guarantee?',
      a: 'If your plant arrives damaged or exhibits severe stress/decay within 7 days of delivery, simply submit a quick photo through your Customer Dashboard. We immediately dispatch a free healthy replacement or provide a 100% refund.'
    },
    {
      q: 'How are gardeners verified on Urbano Nursery?',
      a: 'All gardening professionals submit government ID proof, horticulture credentials or verified nursery apprentice history, and undergo background verification. Only approved specialists receive the Verified Gardener badge.'
    },
    {
      q: 'Can I book custom balcony garden design or recurring visits?',
      a: 'Yes! Select the Bespoke Balcony Garden Setup or Lawn Maintenance service, pick your preferred date and slot, and add notes about your space dimensions. Your gardener will coordinate and bring required potting tools and enrichments.'
    },
    {
      q: 'How can nurseries or horticulturists register to sell?',
      a: 'Click "Become a Partner" or select "Register as Partner" in the navigation. Fill out your nursery or gardening profile, attach your registration license or certificate, and our Admin team approves compliant partners within 24-48 hours.'
    }
  ];

  return (
    <section className="py-16 bg-stone-100/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Got Questions?
          </div>
          <h2 className="text-3xl font-bold text-emerald-950 font-serif-botanical">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-stone-200/80 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <span className="text-sm font-semibold text-stone-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

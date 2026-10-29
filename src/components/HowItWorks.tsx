import React from 'react';
import { Search, Truck, HeartHandshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Simplicity by Design
          </div>
          <h2 className="text-3xl font-bold text-emerald-950 font-serif-botanical">
            How Urbano Nursery Works
          </h2>
          <p className="text-xs text-stone-600 mt-2">
            From regional nursery greenhouses directly to your doorstep and ongoing botanical guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
              Step 01
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-botanical mb-2">
              Browse Plants or Diagnostic Services
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Filter healthy botanicals by light, room, and pet-friendliness — or book certified gardeners by service and preferred time slot.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
              Step 02
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-botanical mb-2">
              Eco-Safe Delivery or Home Visit
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Plants travel in ventilated corrugated shock-proof crates. For services, your verified gardener arrives on time with professional tools.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 shadow-xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
              Step 03
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-botanical mb-2">
              Lifetime Plant Parenting Support
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every purchase includes a personalized botanical care guide, 7-day health guarantee, and direct access to plant doctors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

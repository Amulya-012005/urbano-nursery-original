import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Calendar, Users, ArrowUpRight } from 'lucide-react';

export const ThreeMainCards: React.FC = () => {
  const { setActiveTab, setPartnerModalOpen } = useApp();

  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Three Pathways to Green Living
          </p>
          <h2 className="text-3xl font-bold text-emerald-950 font-serif-botanical mt-1">
            How Would You Like to Grow Today?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Buy Plants & Products */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-lg relative overflow-hidden card-3d-hover group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/60 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center mb-6 shadow-md">
                <ShoppingBag className="w-7 h-7 text-emerald-200" />
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                Botanical Marketplace
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif-botanical mb-3">
                Buy Plants & Products
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Explore handpicked indoor plants, balcony bloomers, heirloom seeds, handcrafted terracotta pots, planters, enriched organic soil, fertilizers, and precision gardening tools.
              </p>

              <div className="space-y-1.5 text-xs text-stone-500 font-medium pb-6 border-b border-stone-200/60">
                <p>· Acclimatized for Indian home climates</p>
                <p>· Direct from certified regional nurseries</p>
                <p>· Safe transit in eco-friendly protective crates</p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setActiveTab('shop')}
                className="w-full py-3.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <span>Explore Plant Catalog</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Card 2: Book a Gardener */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-lg relative overflow-hidden card-3d-hover group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl group-hover:bg-amber-200/60 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-800 to-emerald-900 text-white flex items-center justify-center mb-6 shadow-md">
                <Calendar className="w-7 h-7 text-emerald-200" />
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                Verified Expert Care
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif-botanical mb-3">
                Book a Gardener
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Schedule verified horticulturists for home balcony setup, precision lawn mowing, bonsai shaping, seasonal repotting, and non-toxic bio-fungus and pest eradication treatments.
              </p>

              <div className="space-y-1.5 text-xs text-stone-500 font-medium pb-6 border-b border-stone-200/60">
                <p>· Background-checked & certified horticulturists</p>
                <p>· Transparent hourly & per-visit rates in ₹</p>
                <p>· Diagnostic Plant Doctor consultations</p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setActiveTab('services')}
                className="w-full py-3.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <span>Find & Book Gardeners</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Card 3: Become a Partner */}
          <div className="glass-panel rounded-3xl p-8 border border-white/80 shadow-lg relative overflow-hidden card-3d-hover group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-200/40 rounded-full blur-2xl group-hover:bg-emerald-300/50 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-stone-900 text-white flex items-center justify-center mb-6 shadow-md">
                <Users className="w-7 h-7 text-emerald-300" />
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                Vendor & Pro Network
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-serif-botanical mb-3">
                Become a Partner
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Register as an accredited local nursery or certified gardening professional. Expand your reach, receive online bookings, manage inventory, and receive timely payouts.
              </p>

              <div className="space-y-1.5 text-xs text-stone-500 font-medium pb-6 border-b border-stone-200/60">
                <p>· Verified Partner Badge upon accreditation</p>
                <p>· Dedicated vendor & gardener portal dashboards</p>
                <p>· Direct customer connections in your city</p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setPartnerModalOpen(true)}
                className="w-full py-3.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <span>Apply as Nursery / Pro</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

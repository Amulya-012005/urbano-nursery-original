import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Sprout,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Calendar,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UrbanoLogo } from './UrbanoLogo';
import { ModuleAuthModal } from './ModuleAuthModal';

export const FirstPage: React.FC = () => {
  const { currentUser, setActiveTab } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<'customer' | 'gardener' | 'admin'>('customer');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const handleSelectModule = (module: 'customer' | 'gardener' | 'admin') => {
    setSelectedModule(module);

    // Check if user is already authenticated with the selected role
    if (currentUser.role === module) {
      setActiveTab(module as any);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthenticated = (role: string) => {
    if (role === 'admin') setActiveTab('admin');
    else if (role === 'gardener') setActiveTab('gardener');
    else setActiveTab('customer');
  };

  const faqs = [
    {
      q: 'How are living plants safely shipped without damage?',
      a: 'Each plant is hydrated before packing, root-stabilized in breathable coir coco peat, and secured inside ventilated corrugated shock-absorbent frames. Zero single-use plastics.'
    },
    {
      q: 'What is the Urbano 7-Day Healthy Plant Guarantee?',
      a: 'If your plant arrives damaged or exhibits decay within 7 days, submit a quick photo through your Customer Dashboard. We immediately dispatch a free replacement or issue a full refund.'
    },
    {
      q: 'How are gardeners verified on the platform?',
      a: 'All gardening professionals submit government ID proof, horticulture credentials from the National Horticulture Board or botanical institutes, and undergo background verification before displaying the Verified badge.'
    },
    {
      q: 'How do bookings and service slots work?',
      a: 'Customers select their required service (Lawn Mowing, Soil Tilling, Plant Doctor, Pruning), pick an available date and time slot, and enter their home address. The gardener accepts or reschedules in real time.'
    }
  ];

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between text-stone-100">
      {/* Top Bar with Dark Forest Glass, Golden Rim, and Logo */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#07130c]/85 border-b border-amber-400/25 shadow-lg shadow-black/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand with Exact User Logo */}
          <div className="flex items-center gap-3">
            <UrbanoLogo size={44} showText={true} textSize="lg" />
          </div>

          {/* Current Session Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-amber-400/30 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Current User:</span>
              <strong className="text-amber-200 font-semibold">{currentUser.name}</strong>
              <span className="text-[10px] uppercase font-mono bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-md font-bold border border-amber-500/40">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={() => handleSelectModule(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'gardener' ? 'gardener' : 'customer')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-black/50 border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Resume Active Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="pt-14 pb-8 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-black/60 border border-amber-400/40 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>India’s Digital Botanical & Horticultural Network</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white font-serif-botanical tracking-tight leading-tight drop-shadow-md">
          Bring Nature Home.
        </h1>

        <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          Select your dedicated workspace below to browse verified plants under ₹1000, manage gardening services, or oversee platform operations in real time.
        </p>
      </section>

      {/* The 3 Core Modules (Strictly 3 modules on first page with Slight Green & Golden Yellowish highlighted boxes) */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Module 1: Customer Module */}
          <div className="plant-card-gold rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 hover:border-amber-300 shadow-2xl transition-all duration-300 card-3d-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center mb-6 shadow-md border border-amber-400/35">
                <ShoppingBag className="w-7 h-7 text-amber-300" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-amber-950/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xs">
                Customer Marketplace
              </span>

              <h2 className="text-2xl font-bold text-white font-serif-botanical mt-3 mb-3">
                Explore Plants & Products
              </h2>

              <p className="text-xs text-stone-200 leading-relaxed mb-6">
                Browse healthy acclimatized botanicals (indoor air-purifiers, outdoor flowering, palms, vines, succulents, and fruit trees) and precision tools & organic composts (all plants under ₹1000). Book certified gardeners and track deliveries in real time.
              </p>

              <div className="space-y-2 text-xs text-stone-200 pb-6 border-b border-amber-400/20">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>80+ Verified living plants & trees (all strictly ≤ ₹1,000)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Dedicated Tools & Organic Composts page (never merged)</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Real-time cart, UPI QR & Card credentials checkout</span>
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleSelectModule('customer')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-black/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
              >
                <span>Enter as Customer</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Module 2: Gardener Module */}
          <div className="plant-card-gold rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 hover:border-amber-300 shadow-2xl transition-all duration-300 card-3d-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center mb-6 shadow-md border border-amber-400/35">
                <Sprout className="w-7 h-7 text-amber-300" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-amber-950/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xs">
                Horticulturist Hub
              </span>

              <h2 className="text-2xl font-bold text-white font-serif-botanical mt-3 mb-3">
                Gardener Hub
              </h2>

              <p className="text-xs text-stone-200 leading-relaxed mb-6">
                Dedicated workspace for verified master gardeners and nursery growers. Manage product listings, live stock, service pricing, accept or reject incoming appointment requests, and view earnings.
              </p>

              <div className="space-y-2 text-xs text-stone-200 pb-6 border-b border-amber-400/20">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Horticulture accreditation & verified badge</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Manage product pricing & stock availability</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Accept or reject customer visit bookings</span>
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleSelectModule('gardener')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-black/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
              >
                <span>Enter as Gardener</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Module 3: Admin Module */}
          <div className="plant-card-gold rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 hover:border-amber-300 shadow-2xl transition-all duration-300 card-3d-hover flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-6 shadow-md border border-amber-400/40">
                <ShieldAlert className="w-7 h-7 text-amber-300" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-amber-950/90 px-3 py-1 rounded-md border border-amber-400/50 shadow-xs">
                Governance Console
              </span>

              <h2 className="text-2xl font-bold text-white font-serif-botanical mt-3 mb-3">
                Admin Console
              </h2>

              <p className="text-xs text-stone-200 leading-relaxed mb-6">
                Administrative governance for platform compliance. Oversee which gardener uploaded which item, monitor which customer ordered what, verify delivery completion, and manage dispute resolution.
              </p>

              <div className="space-y-2 text-xs text-stone-200 pb-6 border-b border-amber-400/20">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Track which gardener uploaded which plant item</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Monitor customer orders with detailed item matrix</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Verify item delivery status & tracking confirmation</span>
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleSelectModule('admin')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-black/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
              >
                <Lock className="w-4 h-4 text-amber-200" />
                <span>Enter Admin Console (PIN: 1234)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Below the 3 modules: About the Website (and nothing else!) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              About Urbano Nursery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif-botanical">
              A Sustainable Botanical Marketplace Built for Modern Homes
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              We connect urban plant lovers with accredited local greenhouses and certified horticulturists to guarantee healthy foliage, ethical cultivation, and long-term plant parenting success.
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Acclimatized Flora</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Plants are raised in regional nurseries adapted to local ambient humidity, minimizing transplant shock.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Package className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Zero-Plastic Transport</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Breathable coir root pouches and shock-absorbent corrugated ventilated crates protect plants during transit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">7-Day Guarantee</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                If your plant shows stress or transit damage within 7 days, get an instant free replacement or refund.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Verified Specialists</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Background-checked horticulturists for doorstep pruning, balcony design, repotting, and pest management.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="pt-8 border-t border-white/10 space-y-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white font-serif-botanical text-center mb-6">
              Frequently Asked Questions
            </h3>

            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-black/35 overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-xs font-semibold text-stone-200 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-stone-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#07130c]/90 backdrop-blur-md border-t border-white/10 py-8 text-center text-xs text-stone-400">
        <p>© 2026 Urbano Nursery. All rights reserved. Grow Greener · Live Better.</p>
        <p className="text-[11px] text-stone-500 mt-1">
          Bengaluru · Mumbai · Delhi-NCR · Pune · Hyderabad · Kolkata
        </p>
      </footer>

      {/* Module Authentication Modal */}
      <ModuleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        targetModule={selectedModule}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};

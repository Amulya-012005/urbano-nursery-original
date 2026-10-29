import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShieldCheck, Heart, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { setActiveTab, setPartnerModalOpen } = useApp();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>Our Botanical Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-emerald-950 font-serif-botanical leading-tight">
          Reimagining Urban Green Living Across India
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Urbano Nursery was created to bridge the gap between regional greenhouse growers, certified horticulturists, and busy city dwellers seeking healthy, thriving spaces.
        </p>
      </div>

      {/* Visual Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <img
            src="/assets/heroes/gardener_service_hero.jpg"
            alt="Master gardener caring for balcony plants"
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-botanical">
            Rooted in Horticulture Science & Real Community
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Too many mass-market plants die within two weeks because they are grown under artificial greenhouse lights and shipped without acclimatization. At Urbano Nursery, every botanical specimen is raised by accredited regional growers adapted to local climate and water conditions.
          </p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            When you need hands-on help, our verified gardening partners step in with organic pruning tools, biological pest treatments, and customized balcony design.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-emerald-700 mb-2" />
              <h3 className="text-xs font-bold text-stone-900">NHB Verified Growers</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Strict quality and hygiene standards.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <Heart className="w-6 h-6 text-rose-600 mb-2" />
              <h3 className="text-xs font-bold text-stone-900">7-Day Plant Guarantee</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Hassle-free replacement if stressed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Nursery Network */}
      <div className="glass-panel rounded-3xl p-8 border border-stone-200 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 font-serif-botanical">
            Our Regional Nursery Hubs
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Fast, zero-stress localized dispatch across major metropolitan corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Bengaluru Botanical Hub
            </p>
            <p className="text-stone-600">Sarjapur Corridor & Lalbagh Horticulture Belt</p>
            <p className="text-stone-500 text-[11px]">Serving Bengaluru, Mysuru, Hosur</p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Western India Hub (Mumbai & Pune)
            </p>
            <p className="text-stone-600">Baner Green Belt & Thane Floral Nursery Park</p>
            <p className="text-stone-500 text-[11px]">Serving Mumbai, Navi Mumbai, Pune, Nashik</p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Northern NCR Green Corridor
            </p>
            <p className="text-stone-600">Mehrauli Botanical Farms & Gurgaon Sector 44</p>
            <p className="text-stone-500 text-[11px]">Serving Delhi, Gurgaon, Noida, Faridabad</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Register Your Nursery or Become a Certified Gardener</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

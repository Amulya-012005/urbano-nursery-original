import React from 'react';
import { useApp } from '../context/AppContext';
import { Play } from 'lucide-react';

interface HeroProps {
  onOpenVideoTour: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenVideoTour }) => {
  const { setActiveTab } = useApp();

  return (
    <section className="relative w-full overflow-hidden min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
      {/* Botanical Backdrop Image - matching user reference image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/heroes/botanical_hero.jpg"
          alt="Sage botanical interior with hanging plants and terracotta planters"
          className="w-full h-full object-cover object-right md:object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/aistudio/image_f9900427.png';
          }}
        />
        {/* Soft daylight gradient overlay for text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a9686]/80 via-[#7a9686]/40 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 w-full">
        <div className="max-w-xl lg:max-w-2xl space-y-5">
          {/* Kicker from reference image */}
          <p className="text-xs sm:text-sm font-medium tracking-wide text-stone-700 font-sans">
            Breathe life into your space
          </p>

          {/* Headline matching reference image */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold text-white font-serif-botanical leading-[1.12] tracking-tight drop-shadow-xs">
            Discover beautiful indoor plants for every corner of your home
          </h1>

          {/* Subtitle matching reference image */}
          <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-sans max-w-lg drop-shadow-xs">
            From indoor greens to outdoor blooms — shop plants, pots, and care tools delivered with love.
          </p>

          {/* Action Buttons Row matching reference image */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {/* Shop Now Button (Deep Forest Green) */}
            <button
              onClick={() => setActiveTab('shop')}
              className="px-7 py-3 bg-[#0e3b26] hover:bg-[#092b1b] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              Shop Now
            </button>

            {/* Watch how Urbano works Play Button */}
            <button
              onClick={onOpenVideoTour}
              className="group flex items-center gap-2.5 text-xs sm:text-sm font-medium text-white hover:text-emerald-100 transition-colors cursor-pointer py-2 px-3 rounded-xl hover:bg-black/10 backdrop-blur-xs"
            >
              <div className="w-8 h-8 rounded-full bg-white text-[#0e3b26] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Play className="w-3.5 h-3.5 fill-[#0e3b26] ml-0.5" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-white font-semibold">Watch how</span>
                <span className="text-[11px] text-stone-200">Urbano works</span>
              </div>
            </button>
          </div>

          {/* Proof Subtext matching reference image */}
          <p className="text-[11px] text-stone-300 font-medium pt-1">
            Join 8,000+ plant lovers growing their dream spaces.
          </p>
        </div>
      </div>

      {/* The Four Frosted Glass Cards Across the Bottom Ledge (Pixel-perfect match to reference image) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/90 shadow-lg text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
              Trusted by
            </p>
            <p className="text-xl sm:text-3xl font-extrabold text-stone-900 tabular-nums my-1 font-sans">
              1,900+
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              Happy Plant Lovers
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/90 shadow-lg text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
              Explore
            </p>
            <p className="text-xl sm:text-3xl font-extrabold text-stone-900 tabular-nums my-1 font-sans">
              8,000+
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              Unique Green Beauties
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/90 shadow-lg text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
              Backed by
            </p>
            <p className="text-xl sm:text-3xl font-extrabold text-stone-900 tabular-nums my-1 font-sans">
              520+
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              Local Greenhouses
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/90 shadow-lg text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
              Rated
            </p>
            <p className="text-xl sm:text-3xl font-extrabold text-stone-900 tabular-nums my-1 font-sans">
              4.9★
            </p>
            <p className="text-[10px] sm:text-xs text-stone-600 font-medium">
              by Our Customers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

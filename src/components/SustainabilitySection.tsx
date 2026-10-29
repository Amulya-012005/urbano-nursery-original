import React from 'react';
import { Leaf, Package, TreePine, Droplets } from 'lucide-react';

export const SustainabilitySection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-stone-100/70 to-emerald-950 text-white relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>The Urbano Greening Pledge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-botanical leading-tight">
            Every Plant Grown is a Living Investment in Our Cities
          </h2>
          <p className="text-sm text-emerald-100/80 mt-3 leading-relaxed">
            Rapid urbanization has cut green canopies across Indian metros. Urbano Nursery partners with urban afforestation NGOs to plant native saplings with every customer order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-emerald-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-700/50">
            <TreePine className="w-8 h-8 text-emerald-400 mb-4" />
            <p className="text-3xl font-extrabold tabular-nums font-serif-botanical text-white">
              28,410+
            </p>
            <p className="text-xs font-semibold text-emerald-300 mt-1">Urban Trees Planted</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">Planted in Bengaluru, Mumbai, and Delhi micro-forests.</p>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-700/50">
            <Package className="w-8 h-8 text-emerald-400 mb-4" />
            <p className="text-3xl font-extrabold tabular-nums font-serif-botanical text-white">
              100%
            </p>
            <p className="text-xs font-semibold text-emerald-300 mt-1">Plastic-Free Packaging</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">Coir husk pots, compostable tape, and recycled paper liners.</p>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-700/50">
            <Droplets className="w-8 h-8 text-emerald-400 mb-4" />
            <p className="text-3xl font-extrabold tabular-nums font-serif-botanical text-white">
              4.8M Liters
            </p>
            <p className="text-xs font-semibold text-emerald-300 mt-1">Rainwater Harvested</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">Collected by our partner nursery propagation facilities.</p>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-700/50">
            <Leaf className="w-8 h-8 text-emerald-400 mb-4" />
            <p className="text-3xl font-extrabold tabular-nums font-serif-botanical text-white">
              Zero
            </p>
            <p className="text-xs font-semibold text-emerald-300 mt-1">Chemical Runoff</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">Strict adherence to bio-enzymes, neem, and worm vermicompost.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

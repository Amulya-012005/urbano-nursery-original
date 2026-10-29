import React from 'react';
import { X, Play, CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface VideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTourModal: React.FC<VideoTourModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-2xl bg-white p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
            Botanical Video Story
          </span>
          <h2 className="text-2xl font-bold text-stone-900 font-serif-botanical mt-2">
            Watch How Urbano Nursery Works
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            See how healthy botanicals travel safely from certified local growers to your living room.
          </p>
        </div>

        {/* Video / Animated Showcase Container */}
        <div className="relative aspect-16/9 rounded-2xl overflow-hidden shadow-lg border border-stone-200 group bg-stone-900">
          <img
            src="/assets/heroes/gardener_service_hero.jpg"
            alt="Urbano Nursery Process"
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/90 text-emerald-950 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <Play className="w-6 h-6 fill-emerald-950 ml-0.5" />
              </div>
              <div>
                <p className="text-sm font-bold">The Journey of Your Plant</p>
                <p className="text-xs text-stone-300">From greenhouse propagation to your balcony sanctuary (1:45 min)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Process Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-700 mb-1" />
            <p className="font-bold text-stone-900">Local Acclimatization</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Zero shock from artificial high-intensity grow lights.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <Truck className="w-4 h-4 text-emerald-700 mb-1" />
            <p className="font-bold text-stone-900">Shock-Proof Corrugated Crates</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Sturdy breathing containers with coir root wrapping.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <Sparkles className="w-4 h-4 text-emerald-700 mb-1" />
            <p className="font-bold text-stone-900">Doorstep Plant Doctor</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Need setup or diagnosis? Verified specialists visit your home.</p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Explore Plants Now
          </button>
        </div>
      </div>
    </div>
  );
};

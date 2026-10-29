import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShieldCheck, Mail, MapPin, Phone, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setPartnerModalOpen, setAdminPinModalOpen } = useApp();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif-botanical text-white">
                Urbano Nursery
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              India’s premier digital botanical marketplace connecting urban plant parents with certified local greenhouse growers and verified professional gardeners.
            </p>

            <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>NHB Accredited Partner Network</span>
            </div>

            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                Bengaluru · Mumbai · Delhi-NCR · Pune · Hyderabad
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                Helpline: 1800 200 4455 (Mon–Sat 9AM–7PM)
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Indoor Plants
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Balcony & Outdoor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Ceramic & Terracotta Pots
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Organic Soil & Fertilizers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('services')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Gardener Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Partner & Dashboards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portals & Roles
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('customer_dash')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Customer Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPartnerModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Become a Partner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('nursery_dash')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Nursery Vendor Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('gardener_dash')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Gardener Specialist Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => setAdminPinModalOpen(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-stone-500 font-mono"
                >
                  Admin Console (Secured)
                </button>
              </li>
            </ul>
          </div>

          {/* Botanical Bulletin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Botanical Bulletin
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Get monthly urban gardening calendars, seasonal repotting alerts, and rare plant restocks.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Join 25,000+ Plant Parents'}
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Welcome! Check your inbox for your free urban care guide.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Urbano Nursery Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Return & Replacement Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { GardeningService, GardenerProfile } from '../types';
import { ShieldCheck, Star, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export const PopularServices: React.FC = () => {
  const {
    services,
    gardeners,
    setActiveTab,
    setSelectedServiceForBooking,
    setSelectedGardenerForBooking,
    setBookingModalOpen
  } = useApp();

  const handleBookService = (service: GardeningService, preferredGardener?: GardenerProfile) => {
    setSelectedServiceForBooking(service);
    if (preferredGardener) {
      setSelectedGardenerForBooking(preferredGardener);
    } else {
      setSelectedGardenerForBooking(gardeners[0] || null);
    }
    setBookingModalOpen(true);
  };

  return (
    <section className="py-16 bg-stone-100/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              On-Demand Horticulturists
            </div>
            <h2 className="text-3xl font-bold text-emerald-950 font-serif-botanical">
              Expert Gardening & Plant Care Services
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('services')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer group"
          >
            <span>Browse All Services & Specialists</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map(service => (
            <div
              key={service.id}
              className="glass-panel rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                  <span className="uppercase font-semibold tracking-wider text-emerald-800">
                    {service.category.replace('_', ' ')}
                  </span>
                  <span className="font-medium text-stone-600">{service.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 font-serif-botanical mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Included Checklist */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                    What's Included:
                  </p>
                  {service.included.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500">Starting at</span>
                  <p className="text-lg font-bold text-emerald-950 tabular-nums">
                    ₹{service.basePrice.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500">
                      {' '}{service.priceUnit === 'per_hour' ? '/ hr' : '/ visit'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleBookService(service)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Verified Gardeners Highlight */}
        <div className="mt-14 pt-12 border-t border-stone-200/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-emerald-950 font-serif-botanical">
              Meet Verified Master Gardeners in Your City
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Every professional undergoes identity verification, horticulture background checks, and periodic skill audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gardeners.slice(0, 2).map(gardener => (
              <div
                key={gardener.id}
                className="glass-panel rounded-2xl p-5 border border-stone-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-stone-200 bg-stone-100">
                  <img
                    src={gardener.avatar}
                    alt={gardener.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/heroes/gardener_service_hero.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <h4 className="text-base font-bold text-stone-900">{gardener.fullName}</h4>
                      {gardener.verifiedStatus === 'verified' && (
                        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md" title="Verified Professional">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-stone-900 tabular-nums">{gardener.rating}</span>
                      <span className="text-stone-400">({gardener.reviewCount} jobs)</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-2 leading-relaxed">
                    {gardener.bio}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3 justify-center sm:justify-start">
                    {gardener.specialties.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-emerald-950 tabular-nums">
                      ₹{gardener.hourlyRate}/hr
                    </span>
                    <button
                      onClick={() => handleBookService(services[0], gardener)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Check Availability & Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

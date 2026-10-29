import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GardeningService, GardenerProfile } from '../types';
import { Calendar, ShieldCheck, Star, CheckCircle2, Clock, MapPin, Award } from 'lucide-react';

export const GardeningServicesView: React.FC = () => {
  const {
    services,
    gardeners,
    setSelectedServiceForBooking,
    setSelectedGardenerForBooking,
    setBookingModalOpen
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredServices = services.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  });

  const filteredGardeners = gardeners.filter(gardener => {
    if (selectedCity === 'all') return true;
    return gardener.serviceAreas.some(area => area.toLowerCase().includes(selectedCity.toLowerCase())) ||
      gardener.fullName.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const handleBookService = (service: GardeningService, preferredGardener?: GardenerProfile) => {
    setSelectedServiceForBooking(service);
    if (preferredGardener) {
      setSelectedGardenerForBooking(preferredGardener);
    } else {
      setSelectedGardenerForBooking(gardeners[0] || null);
    }
    setBookingModalOpen(true);
  };

  const handleBookGardener = (gardener: GardenerProfile) => {
    setSelectedGardenerForBooking(gardener);
    setSelectedServiceForBooking(services[0] || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Services Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Accredited Horticultural Care</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-950 font-serif-botanical">
          Home Gardening & Plant Doctor Services
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Schedule doorstep visits from vetted gardening masters for terrace rejuvenation, seasonal pruning, organic pest removal, and soil vitality tuning.
        </p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {[
            { key: 'all', label: 'All Services' },
            { key: 'setup', label: 'Balcony & Garden Setup' },
            { key: 'doctor', label: 'Plant Doctor Diagnostics' },
            { key: 'pruning', label: 'Pruning & Bonsai Styling' },
            { key: 'pest_control', label: 'Organic Pest & Fungus' },
            { key: 'maintenance', label: 'Lawn & Turf Care' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === tab.key
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'bg-white/80 border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="glass-panel rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase font-semibold tracking-wider text-emerald-800 font-mono">
                  {service.category.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1 font-medium text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{service.duration}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 font-serif-botanical mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="space-y-2 mb-6">
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                  Service Protocol:
                </p>
                {service.included.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">Rate in INR</span>
                <p className="text-lg font-bold text-emerald-950 tabular-nums">
                  ₹{service.basePrice.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-500">
                    {' '}{service.priceUnit === 'per_hour' ? '/ hour' : '/ visit'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleBookService(service)}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Gardeners Directory Section */}
      <div className="pt-8 border-t border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 font-serif-botanical">
              Verified Horticulturists & Gardening Specialists
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Select your favorite gardener based on their horticulture background, completed jobs, and service areas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Filter by City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
            >
              <option value="all">All Service Cities</option>
              <option value="delhi">Delhi-NCR / Gurgaon</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="mumbai">Mumbai / Bandra</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGardeners.map(gardener => (
            <div
              key={gardener.id}
              className="glass-panel rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-stone-200 bg-stone-100">
                    <img
                      src={gardener.avatar}
                      alt={gardener.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/heroes/gardener_service_hero.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-base font-bold text-stone-900">{gardener.fullName}</h3>
                      {gardener.verifiedStatus === 'verified' && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md" title="Accredited & Background Verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-stone-900 tabular-nums">{gardener.rating}</span>
                      <span className="text-stone-400">({gardener.completedJobs} completed visits)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {gardener.experienceYears} Years Horticulture Experience
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                  {gardener.bio}
                </p>

                {/* Credentials */}
                <div className="text-[11px] text-stone-500 mb-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="font-semibold text-stone-700 block mb-0.5">Accreditation:</span>
                  <span>{gardener.certificateName}</span>
                </div>

                {/* Service Areas */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide block mb-1.5">
                    Service Areas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {gardener.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <MapPin className="w-2.5 h-2.5 text-stone-400" />
                        <span>{area}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">Base Hourly Rate</span>
                  <span className="text-base font-bold text-emerald-950 tabular-nums">
                    ₹{gardener.hourlyRate}/hr
                  </span>
                </div>

                <button
                  onClick={() => handleBookGardener(gardener)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Specialist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    setBookingModalOpen,
    selectedServiceForBooking,
    selectedGardenerForBooking,
    services,
    gardeners,
    bookGardener,
    currentUser,
    setActiveTab
  } = useApp();

  const [serviceId, setServiceId] = useState<string>(
    selectedServiceForBooking ? selectedServiceForBooking.id : services[0]?.id || ''
  );
  const [gardenerId, setGardenerId] = useState<string>(
    selectedGardenerForBooking ? selectedGardenerForBooking.id : gardeners[0]?.id || ''
  );
  const [date, setDate] = useState<string>('2026-10-27');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState<string>(currentUser.address || 'Flat 402, Sea Breeze Apts, Bandra West');
  const [city, setCity] = useState<string>(currentUser.city || 'Mumbai');
  const [phone, setPhone] = useState<string>(currentUser.phone || '+91 98201 44521');
  const [notes, setNotes] = useState<string>('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  if (!bookingModalOpen) return null;

  const currentService = services.find(s => s.id === serviceId) || services[0];
  const currentGardener = gardeners.find(g => g.id === gardenerId) || gardeners[0];

  const calculatedPrice = currentService ? currentService.basePrice : 349;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim() || !date) return;

    const newBooking = bookGardener({
      gardenerId: currentGardener.id,
      serviceId: currentService.id,
      date,
      timeSlot,
      address,
      city,
      phone,
      notes,
      price: calculatedPrice
    });

    setConfirmedBookingId(newBooking.id);
  };

  const handleClose = () => {
    setBookingModalOpen(false);
    setConfirmedBookingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl plant-card-gold border-2 border-amber-400/40 text-stone-100 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 my-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBookingId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h3 className="text-2xl font-bold text-white font-serif-botanical">
              Appointment Confirmed!
            </h3>

            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
              Booking <strong>#{confirmedBookingId}</strong> has been registered. {currentGardener.fullName} will arrive on <strong>{date}</strong> between <strong>{timeSlot}</strong>.
            </p>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 text-left text-xs space-y-2 my-4">
              <div className="flex justify-between">
                <span className="text-stone-400">Service:</span>
                <span className="font-semibold text-white">{currentService.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Specialist:</span>
                <span className="font-semibold text-white">{currentGardener.fullName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-stone-400">Total Fee:</span>
                <span className="font-bold text-emerald-400 text-sm tabular-nums">₹{calculatedPrice} (Pay after visit)</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('customer');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-950/60 cursor-pointer"
              >
                View in Customer Appointments
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-5 bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Service Scheduling</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-serif-botanical">
                Book a Verified Gardener
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                Select your service, certified horticulturist, and preferred home visit slot.
              </p>
            </div>

            {/* Service Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Choose Gardening Service
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-stone-900 text-white">
                    {s.title} — ₹{s.basePrice} ({s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Gardener Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Select Master Gardener
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gardeners.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGardenerId(g.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      gardenerId === g.id
                        ? 'border-emerald-400 bg-emerald-950/70 ring-1 ring-emerald-400/50'
                        : 'border-white/10 bg-black/30 hover:bg-black/50'
                    }`}
                  >
                    <img
                      src={g.avatar}
                      alt={g.fullName}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/heroes/gardener_service_hero.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{g.fullName}</p>
                      <p className="text-[11px] text-emerald-400">{g.experienceYears}y exp · ★{g.rating}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="08:00 AM - 10:00 AM" className="bg-stone-900 text-white">08:00 AM - 10:00 AM (Morning)</option>
                  <option value="10:00 AM - 12:00 PM" className="bg-stone-900 text-white">10:00 AM - 12:00 PM (Midday)</option>
                  <option value="01:00 PM - 03:00 PM" className="bg-stone-900 text-white">01:00 PM - 03:00 PM (Afternoon)</option>
                  <option value="03:00 PM - 05:00 PM" className="bg-stone-900 text-white">03:00 PM - 05:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Home Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No, Society Name"
                className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Price & Submit */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">Service Total</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  ₹{calculatedPrice}
                </span>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

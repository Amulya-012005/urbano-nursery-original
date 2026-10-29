import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  ShieldCheck,
  Star,
  Settings,
  Phone
} from 'lucide-react';

export const GardenerDashboard: React.FC = () => {
  const {
    currentUser,
    gardeners,
    bookings,
    updateBookingStatus,
    services
  } = useApp();

  const currentGardener = gardeners.find(g => g.userId === currentUser.id) || gardeners[0];
  const myBookings = bookings.filter(b => b.gardenerId === currentGardener.id);

  const pendingBookings = myBookings.filter(b => b.status === 'pending');
  const upcomingAppointments = myBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
  const completedJobs = myBookings.filter(b => b.status === 'completed');

  const totalEarnings = myBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  // Editable settings
  const [hourlyRate, setHourlyRate] = useState(currentGardener.hourlyRate);
  const [serviceAreas, setServiceAreas] = useState(currentGardener.serviceAreas.join(', '));
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    currentGardener.hourlyRate = Number(hourlyRate);
    currentGardener.serviceAreas = serviceAreas.split(',').map(s => s.trim());
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Gardener Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white bg-stone-100">
            <img
              src={currentGardener.avatar}
              alt={currentGardener.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/heroes/gardener_service_hero.jpg';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-stone-900 font-serif-botanical">
                {currentGardener.fullName}
              </h1>
              {currentGardener.verifiedStatus === 'verified' && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified Master Horticulturist</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {currentGardener.experienceYears} Years Field Experience · {currentGardener.certificateName}
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold tabular-nums">{currentGardener.rating}</span>
              <span className="text-stone-400">({currentGardener.completedJobs} verified home visits)</span>
              <span>·</span>
              <span className="font-bold text-emerald-950 tabular-nums">₹{currentGardener.hourlyRate}/hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Total Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-emerald-950 tabular-nums">
            ₹{(totalEarnings + 12500).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Platform service revenue</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900 tabular-nums">
            {completedJobs.length + currentGardener.completedJobs}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Horticulture visits</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 tabular-nums">
            {pendingBookings.length}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Requires confirmation</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Rating</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-emerald-950 tabular-nums">
            {currentGardener.rating}★
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Customer satisfaction</p>
        </div>
      </div>

      {/* Booking Requests (Accept / Decline actions) */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
          Incoming Service Requests ({pendingBookings.length})
        </h2>

        {pendingBookings.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center italic">
            No pending booking requests right now. New home visits will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map(b => (
              <div
                key={b.id}
                className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-stone-900 text-xs">#{b.id}</span>
                    <span className="font-bold text-stone-800 text-sm font-serif-botanical">
                      {b.serviceTitle}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      ₹{b.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Client: <strong>{b.customerName}</strong> · Phone: {b.customerPhone}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-stone-800">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.date} ({b.timeSlot})</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.address}, {b.city}</span>
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-stone-600 italic mt-1 bg-white/70 p-2 rounded-lg border border-stone-200">
                      Client Notes: "{b.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateBookingStatus(b.id, 'confirmed')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Visit</span>
                  </button>

                  <button
                    onClick={() => updateBookingStatus(b.id, 'rejected')}
                    className="px-3 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Schedule & Appointments */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
          Upcoming Confirmed Appointments ({upcomingAppointments.length})
        </h2>

        {upcomingAppointments.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center italic">
            No upcoming appointments scheduled.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map(app => (
              <div
                key={app.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-stone-400">#{app.id}</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {app.serviceTitle}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Client: <strong>{app.customerName}</strong> ({app.customerPhone})
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span className="font-medium text-emerald-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{app.date} · {app.timeSlot}</span>
                    </span>
                    <span>·</span>
                    <span>{app.address}, {app.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${app.customerPhone}`}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="Call Client"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => updateBookingStatus(app.id, 'completed')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Service Completed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings & Hourly Rate Form */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-800" />
          <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
            Horticulturist Service Area & Rates
          </h2>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Standard Hourly Rate (₹)
              </label>
              <input
                type="number"
                min="200"
                max="3000"
                step="50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Verification Credential
              </label>
              <input
                type="text"
                disabled
                value={currentGardener.certificateName}
                className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Service Areas (comma-separated neighborhoods)
            </label>
            <input
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Update Profile & Rates
          </button>

          {savedSettings && (
            <p className="text-xs text-emerald-700 font-medium">
              Profile settings and service areas successfully updated.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

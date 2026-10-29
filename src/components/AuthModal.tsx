import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Lock, Mail, Shield, Sprout, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    loginUser,
    registerUser,
    switchRole,
    setAdminPinModalOpen
  } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [role, setRole] = useState<UserRole>('customer');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegister) {
      registerUser({
        name: name || email.split('@')[0],
        email,
        role,
        city
      });
    } else {
      loginUser(email, role);
    }
    setAuthModalOpen(false);
  };

  const handleQuickLogin = (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      setAuthModalOpen(false);
      setAdminPinModalOpen(true);
      return;
    }
    switchRole(targetRole);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-2xl p-6 sm:p-8 bg-white my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif-botanical">
            {isRegister ? 'Join Urbano Nursery' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isRegister
              ? 'Create your botanical account to buy plants and book gardeners'
              : 'Sign in to access your orders, bookings, and dashboards'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="mb-6 p-3 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 text-center">
            Demo Persona Fast-Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="py-1.5 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-stone-800 text-left font-medium transition-colors cursor-pointer truncate"
            >
              🌱 Aarav (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('nursery')}
              className="py-1.5 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-stone-800 text-left font-medium transition-colors cursor-pointer truncate"
            >
              🌿 Vikram (Nursery)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('gardener')}
              className="py-1.5 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-stone-800 text-left font-medium transition-colors cursor-pointer truncate"
            >
              ✂️ Ramesh (Gardener)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-left font-medium transition-colors cursor-pointer truncate flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin (PIN: 1234)</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Sengupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Mumbai, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-stone-600">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

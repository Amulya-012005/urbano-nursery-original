import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Shield, Sprout, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { UrbanoLogo } from './UrbanoLogo';

interface ModuleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetModule: 'customer' | 'gardener' | 'admin';
  onAuthenticated: (role: UserRole) => void;
}

export const ModuleAuthModal: React.FC<ModuleAuthModalProps> = ({
  isOpen,
  onClose,
  targetModule,
  onAuthenticated
}) => {
  const { loginUser, registerUser, switchRole } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin.toLowerCase() === 'admin') {
      switchRole('admin');
      onAuthenticated('admin');
      onClose();
    } else {
      setError('Incorrect Administrator PIN. Master Demo Passkey is 1234');
    }
  };

  const handleUserAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!email.trim() || !name.trim()) {
        setError('Please enter name and email');
        return;
      }
      registerUser({
        name,
        email,
        phone: phone || '+91 98000 12345',
        role: targetModule === 'gardener' ? 'gardener' : 'customer'
      });
      onAuthenticated(targetModule === 'gardener' ? 'gardener' : 'customer');
      onClose();
    } else {
      if (!email.trim()) {
        setError('Please enter email address');
        return;
      }
      loginUser(email, targetModule === 'gardener' ? 'gardener' : 'customer');
      onAuthenticated(targetModule === 'gardener' ? 'gardener' : 'customer');
      onClose();
    }
  };

  const handleQuickDemoAuth = () => {
    if (targetModule === 'admin') {
      switchRole('admin');
      onAuthenticated('admin');
    } else if (targetModule === 'gardener') {
      switchRole('gardener');
      onAuthenticated('gardener');
    } else {
      switchRole('customer');
      onAuthenticated('customer');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md plant-card-gold rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl p-6 sm:p-8 text-stone-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with User Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <UrbanoLogo size={52} />
          </div>

          <h2 className="text-2xl font-bold font-serif-botanical text-white">
            {targetModule === 'admin'
              ? 'Administrator Authentication'
              : targetModule === 'gardener'
              ? (isRegister ? 'Gardener Registration' : 'Gardener Specialist Login')
              : (isRegister ? 'Customer Registration' : 'Customer Account Login')}
          </h2>

          <p className="text-xs text-stone-300 mt-1">
            {targetModule === 'admin'
              ? 'Protected console for platform governance and delivery supervision.'
              : targetModule === 'gardener'
              ? 'Access your product listings, booking requests, and earnings reports.'
              : 'Browse plants, manage shopping cart, and schedule home visits.'}
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-center">
          <button
            type="button"
            onClick={handleQuickDemoAuth}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/60"
          >
            <span>
              ⚡ Fast Demo Login (as{' '}
              {targetModule === 'admin'
                ? 'Chief Admin'
                : targetModule === 'gardener'
                ? 'Ramesh Kumar - Gardener'
                : 'Aarav Patel - Customer'}
              )
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Auth Forms */}
        {targetModule === 'admin' ? (
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Enter Security Passkey PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Master Demo PIN: 1234"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <p className="text-[11px] text-amber-300 font-mono mt-1">
                * Default Admin PIN is <strong>1234</strong>
              </p>
            </div>

            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Verify & Enter Admin Console
            </button>
          </form>
        ) : (
          <form onSubmit={handleUserAuth} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={targetModule === 'gardener' ? 'e.g. Anand Vernekar' : 'e.g. Sneha Roy'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={
                    targetModule === 'gardener'
                      ? 'ramesh.gardener@gmail.com'
                      : 'aarav.patel@example.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98000 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {isRegister ? 'Register & Continue' : 'Sign In & Enter'}
            </button>

            <div className="text-center pt-1 text-xs text-stone-400">
              {isRegister ? (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

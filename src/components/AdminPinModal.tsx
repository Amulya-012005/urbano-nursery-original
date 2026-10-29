import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';

export const AdminPinModal: React.FC = () => {
  const {
    adminPinModalOpen,
    setAdminPinModalOpen,
    switchRole,
    setActiveTab
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!adminPinModalOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234
    if (pin === '1234' || pin === 'admin') {
      switchRole('admin');
      setActiveTab('admin');
      setAdminPinModalOpen(false);
      setPin('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#091a10]/95 border border-amber-500/40 shadow-2xl p-6 rounded-3xl text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            setAdminPinModalOpen(false);
            setPin('');
            setError(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white font-serif-botanical">
            Secured Admin Console
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Restricted access for chief platform administrators and compliance officers.
          </p>
          <p className="text-[11px] text-amber-300 font-mono mt-2 bg-amber-950/70 border border-amber-500/30 px-2 py-1 rounded-md inline-block">
            Master Demo Passkey: <strong>1234</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              Administrator Security PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter 4-digit PIN (1234)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-black/40 border rounded-xl text-sm text-white tracking-widest focus:outline-none ${
                  error ? 'border-rose-500 bg-rose-950/40 text-rose-200' : 'border-white/15 focus:border-amber-400'
                }`}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">
                Incorrect PIN. Use demo passkey 1234.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authorize & Open Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

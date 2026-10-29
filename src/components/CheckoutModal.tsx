import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Truck,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Package,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Order } from '../types';
import { UrbanoLogo } from './UrbanoLogo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, discount }) => {
  const { cart, cartSubtotal, cartDeliveryFee, placeOrder, currentUser, setActiveTab } = useApp();

  const [address, setAddress] = useState(currentUser.address || 'Flat 402, Sea Breeze Apts, Bandra West');
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98201 44521');
  const [customerName, setCustomerName] = useState(currentUser.name || 'Aarav Patel');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // Card Credentials State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser.name || 'Aarav Patel');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardNetwork, setCardNetwork] = useState<'visa' | 'mastercard' | 'rupay'>('rupay');
  const [cardError, setCardError] = useState('');

  // UPI State
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Confirmed Order Screen
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const finalTotal = Math.max(0, cartSubtotal + cartDeliveryFee - discount);
  const upiId = 'urbanonursery@upi';

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);

    // Detect card network
    if (value.startsWith('4')) setCardNetwork('visa');
    else if (value.startsWith('5') || value.startsWith('2')) setCardNetwork('mastercard');
    else setCardNetwork('rupay');

    // Add space after every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
    setCardError('');
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
    setCardError('');
  };

  // Format CVV (3 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(value);
    setCardError('');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId).catch(() => {});
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Execute Order Placement & Show Confirmation
  const executeOrder = (selectedMethod: 'upi' | 'card' | 'cod') => {
    const finalAddress = address.trim() || 'Flat 402, Sea Breeze Apts, Bandra West';
    const finalCity = city.trim() || 'Mumbai';
    const finalPhone = phone.trim() || '+91 98201 44521';

    const order = placeOrder({
      address: finalAddress,
      city: finalCity,
      phone: finalPhone,
      paymentMethod: selectedMethod,
      discount
    });

    setConfirmedOrder(order);
  };

  // Card Submit Handler with Validation
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 15) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('Please enter 3-digit CVV / Security code.');
      return;
    }

    executeOrder('card');
  };

  // UPI Done Click Handler (Instant confirmation without scanning required!)
  const handleUpiDoneClick = () => {
    executeOrder('upi');
  };

  // COD Submit Handler
  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOrder('cod');
  };

  const handleClose = () => {
    onClose();
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl plant-card-gold border-2 border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-8 text-stone-100 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================== ORDER CONFIRMATION SCREEN ==================== */}
        {confirmedOrder ? (
          <div className="text-center py-4 sm:py-6 space-y-5 animate-in fade-in duration-300">
            {/* User Logo with Radiant Golden & Emerald Glow */}
            <div className="flex justify-center mb-1">
              <UrbanoLogo size={58} />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Verified Successfully</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif-botanical">
                Payment is Done! Order Confirmed
              </h3>
              <p className="text-amber-200 font-semibold text-sm sm:text-base">
                Your ordered items will be delivered soon to your address.
              </p>
              <p className="text-xs text-stone-300 max-w-lg mx-auto">
                Thank you, <strong className="text-white">{confirmedOrder.customerName}</strong>. Our partner nursery specialists are carefully selecting, packing, and preparing your healthy plants for delivery.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 sm:p-5 bg-black/40 rounded-2xl border border-emerald-500/20 text-left text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2">
                <div>
                  <span className="text-stone-400 block text-[11px]">Order Reference ID</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">#{confirmedOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[11px]">Payment Mode</span>
                  <span className="font-semibold text-white uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/40">
                    {confirmedOrder.paymentMethod} • Paid
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2 py-1">
                <span className="text-stone-400 text-[11px] block">Items in this Delivery:</span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {(confirmedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 bg-white/5 p-2 rounded-xl">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={it.image}
                          alt={it.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-white font-medium text-xs truncate">{it.productName}</p>
                          <p className="text-[11px] text-emerald-300">
                            Qty: {it.quantity} × ₹{it.price}
                          </p>
                        </div>
                      </div>
                      <span className="text-white font-semibold text-xs tabular-nums shrink-0">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div>
                  <span className="text-stone-400 block text-[11px]">Estimated Delivery:</span>
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    {confirmedOrder.estimatedDelivery || 'Tomorrow, by 2:00 PM'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Delivery Address:</span>
                  <span className="font-medium text-stone-200 block truncate mt-0.5">
                    {confirmedOrder.deliveryAddress}, {confirmedOrder.city}
                  </span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="flex justify-between items-center pt-3 border-t border-emerald-500/20 text-sm font-bold">
                <span className="text-stone-300">Total Amount Paid:</span>
                <span className="text-emerald-400 text-lg tabular-nums">
                  ₹{confirmedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('customer_dash');
                }}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Track in Customer Orders</span>
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-5 bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* ==================== CHECKOUT FORM ==================== */
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted 256-Bit Botanical Checkout</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-serif-botanical">
                Delivery Address & Payment
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                All plants carefully secured in eco-friendly protective crates.
              </p>
            </div>

            {/* Customer & Address Details */}
            <div className="p-4 bg-black/35 rounded-2xl border border-white/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    placeholder="Full Name"
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
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    placeholder="+91 Phone"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    placeholder="House/Flat No, Apartment, Street"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                  placeholder="City (e.g. Mumbai, Bengaluru, Delhi)"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-200 block mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* UPI Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-400 bg-emerald-950/70 text-white ring-2 ring-emerald-500/40 shadow-lg'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs font-bold block">UPI / QR Code</span>
                  <span className="text-[10px] text-emerald-200/70 block">Instant & Zero Fee</span>
                </button>

                {/* Card Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-emerald-400 bg-emerald-950/70 text-white ring-2 ring-emerald-500/40 shadow-lg'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs font-bold block">Card</span>
                  <span className="text-[10px] text-emerald-200/70 block">Debit / Credit</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-400 bg-emerald-950/70 text-white ring-2 ring-emerald-500/40 shadow-lg'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs font-bold block">Pay on Delivery</span>
                  <span className="text-[10px] text-emerald-200/70 block">Cash or Doorstep UPI</span>
                </button>
              </div>
            </div>

            {/* ==================== 1. UPI PAYMENT VIEW ==================== */}
            {paymentMethod === 'upi' && (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-950/60 to-black/60 rounded-2xl border border-emerald-500/30 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* High Quality Stylized QR Code */}
                  <div className="relative p-3 bg-white rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
                    <svg
                      className="w-36 h-36 sm:w-40 sm:h-40"
                      viewBox="0 0 160 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background */}
                      <rect width="160" height="160" fill="white" rx="8" />

                      {/* Top-left corner finder */}
                      <rect x="12" y="12" width="40" height="40" rx="6" fill="#042f1a" />
                      <rect x="18" y="18" width="28" height="28" rx="3" fill="white" />
                      <rect x="24" y="24" width="16" height="16" rx="2" fill="#042f1a" />

                      {/* Top-right corner finder */}
                      <rect x="108" y="12" width="40" height="40" rx="6" fill="#042f1a" />
                      <rect x="114" y="18" width="28" height="28" rx="3" fill="white" />
                      <rect x="120" y="24" width="16" height="16" rx="2" fill="#042f1a" />

                      {/* Bottom-left corner finder */}
                      <rect x="12" y="108" width="40" height="40" rx="6" fill="#042f1a" />
                      <rect x="18" y="114" width="28" height="28" rx="3" fill="white" />
                      <rect x="24" y="120" width="16" height="16" rx="2" fill="#042f1a" />

                      {/* QR Data Pattern Dots */}
                      <rect x="60" y="14" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="76" y="14" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="92" y="14" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="68" y="24" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="84" y="24" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="60" y="34" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="76" y="34" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="92" y="34" width="8" height="8" fill="#042f1a" rx="1.5" />

                      {/* Middle Data Dots */}
                      <rect x="14" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="28" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="42" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="60" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="92" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="110" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="124" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="138" y="60" width="8" height="8" fill="#042f1a" rx="1.5" />

                      <rect x="20" y="74" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="36" y="74" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="116" y="74" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="132" y="74" width="8" height="8" fill="#042f1a" rx="1.5" />

                      {/* Center Botanical Logo in QR */}
                      <rect x="64" y="64" width="32" height="32" rx="8" fill="#042f1a" />
                      <circle cx="80" cy="80" r="12" fill="#10b981" />
                      <path
                        d="M80 72 C80 72 75 76 75 80 C75 83 77 85 80 85 C83 85 85 83 85 80 C85 76 80 72 80 72 Z"
                        fill="white"
                      />

                      {/* Lower Data Dots */}
                      <rect x="60" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="76" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="92" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="110" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="124" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="138" y="104" width="8" height="8" fill="#042f1a" rx="1.5" />

                      <rect x="68" y="118" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="84" y="118" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="116" y="118" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="132" y="118" width="8" height="8" fill="#042f1a" rx="1.5" />

                      <rect x="60" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="76" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="92" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="110" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="124" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                      <rect x="138" y="132" width="8" height="8" fill="#042f1a" rx="1.5" />
                    </svg>
                    <span className="text-[10px] font-bold text-stone-800 mt-1 uppercase tracking-wider">
                      Scan with any UPI
                    </span>
                  </div>

                  {/* UPI Info & Copy */}
                  <div className="flex-1 space-y-3 text-left w-full">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Total Amount to Pay</span>
                      <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                        ₹{finalTotal.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-400 block mb-1">Official Urbano UPI VPA</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-black/50 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 font-semibold select-all">
                          {upiId}
                        </div>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-white" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-stone-300 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Supports <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, <strong>BHIM</strong>, and <strong>Cred</strong>. Even if not scanned, click the <strong>Done</strong> button below to confirm instantly.
                      </span>
                    </div>
                  </div>
                </div>

                {/* THE REQUIRED CRITICAL "DONE" BUTTON:
                    "WHILE PAY UPI IS SELECTED PROPER QR CODE SHOULD BE PROVIDED THEN WITHOUT SCANNING ALASO IF THE USER CLICKS DONE THEN IT SHOULD TAKE TO CONFIRMATION PAGE THAT THIS PAYMENT IS DONE ORDERED WILL BE DELOVERD SOON." */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleUpiDoneClick}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-[0.99]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Done (Payment Completed)</span>
                  </button>
                  <p className="text-center text-[11px] text-stone-400 mt-1.5">
                    Clicking Done immediately confirms your order and initiates rapid dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* ==================== 2. CARD PAYMENT VIEW ==================== */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleCardSubmit} className="space-y-4 animate-in fade-in duration-200">
                {/* Credit Card Visual Replica */}
                <div className="relative p-5 rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-950 to-stone-900 border border-emerald-500/40 shadow-xl space-y-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                        <div className="w-4 h-3 border border-amber-800/40 rounded-xs" />
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300">
                        Botanical Secure Card
                      </span>
                    </div>

                    {/* Network Badge */}
                    <div className="px-2.5 py-1 rounded bg-black/40 border border-white/20 text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {cardNetwork}
                    </div>
                  </div>

                  {/* Card Number display */}
                  <div className="pt-2">
                    <span className="font-mono text-lg sm:text-xl tracking-widest text-stone-100 block">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </span>
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block">Cardholder</span>
                      <span className="font-medium tracking-wide uppercase text-white truncate max-w-[180px] block">
                        {cardHolder || 'CARDHOLDER NAME'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block">Expires</span>
                      <span className="font-mono text-white tracking-wider">
                        {cardExpiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Credential Inputs */}
                <div className="p-4 bg-black/35 rounded-2xl border border-white/10 space-y-3">
                  {cardError && (
                    <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs">
                      {cardError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      16-Digit Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 8920 1029 4481"
                        maxLength={19}
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name printed on card"
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="08/28"
                        maxLength={5}
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1">
                        CVV / CVC Code
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Pay ₹{finalTotal.toLocaleString('en-IN')} & Complete Order</span>
                </button>
              </form>
            )}

            {/* ==================== 3. COD VIEW ==================== */}
            {paymentMethod === 'cod' && (
              <form onSubmit={handleCodSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl space-y-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Banknote className="w-5 h-5" />
                    <span>Pay ₹{finalTotal.toLocaleString('en-IN')} Upon Safe Delivery</span>
                  </div>
                  <p className="leading-relaxed">
                    You can inspect your live healthy plants upon doorstep arrival and pay the delivery executive using either <strong>Cash</strong> or <strong>UPI QR code</strong>.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Cash on Delivery Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                </button>
              </form>
            )}

            {/* Price Breakdown Footer */}
            <div className="p-3.5 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-stone-400 block text-[11px]">Payable Total ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[11px] text-emerald-300">
                <span>Free Safe Plant Packaging</span>
                <span className="block text-stone-400">7-Day Healthy Plant Guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

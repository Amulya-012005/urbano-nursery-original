import { ProductImage } from './ProductImage';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: (discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    clearCart,
    setActiveTab
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'URBANO10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscount(disc);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try URBANO10 for 10% off.');
    }
  };

  const handleProceed = () => {
    setIsCartOpen(false);
    onOpenCheckout(discount);
  };

  const freeDeliveryThreshold = 499;
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md plant-card-gold border-l-2 border-amber-400/40 text-stone-100 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 backdrop-blur-xl">
        {/* Header */}
        <div className="p-5 border-b border-amber-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold text-white font-serif-botanical">
              Your Botanical Cart
            </h2>
            <span className="text-xs bg-amber-950/80 border border-amber-400/50 text-amber-300 font-bold px-2 py-0.5 rounded-full tabular-nums">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-emerald-950/50 border-b border-white/10 text-xs">
          {amountToFreeDelivery > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add <strong>₹{amountToFreeDelivery}</strong> more for free courier</span>
                </span>
                <span className="font-bold text-emerald-400 tabular-nums">{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>You have unlocked Free Climate-Safe Delivery!</span>
            </p>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/10">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-stone-500" />
              </div>
              <h3 className="text-base font-bold text-white">Your basket is empty</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Discover plants for low-light rooms, flowering outdoor balconies, or organic gardening tools.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('customer');
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer shadow-md shadow-emerald-950/60"
              >
                Browse Plants (≤ ₹1000)
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="py-4 flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                  <ProductImage product={item.product} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 mb-2 truncate">
                    {item.product.nurseryName}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-white/15 rounded-lg overflow-hidden bg-black/40">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-300 hover:bg-white/10 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-bold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-stone-300 hover:bg-white/10 text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black/40 space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. URBANO10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponApplied && (
              <p className="text-[11px] text-emerald-400 font-semibold">
                ✓ Coupon URBANO10 applied: 10% discount!
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white tabular-nums">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Botanical Discount</span>
                  <span className="tabular-nums">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Eco Delivery Fee</span>
                <span className="font-semibold text-white tabular-nums">
                  {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-emerald-400 tabular-nums">
                  ₹{Math.max(0, cartTotal - discount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-black/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

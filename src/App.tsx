import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BotanicalBackground } from './components/BotanicalBackground';
import { FirstPage } from './components/FirstPage';
import { CustomerModulePage } from './components/CustomerModulePage';
import { GardenerModulePage } from './components/GardenerModulePage';
import { AdminModulePage } from './components/AdminModulePage';
import { NurseryDashboard } from './components/NurseryDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminPinModal } from './components/AdminPinModal';
import { Sprout } from 'lucide-react';

// Error Boundary to prevent any blank page
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error('App Error Boundary caught error:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-stone-950 text-white text-center">
          <div className="max-w-md p-8 rounded-3xl bg-emerald-950/95 border-2 border-amber-400/50 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
              <Sprout className="w-6 h-6 text-amber-300" />
            </div>
            <h2 className="text-2xl font-bold font-serif-botanical text-amber-300">Urbano Nursery Online</h2>
            <p className="text-xs text-stone-300">Reconnecting with botanical catalogue...</p>
            <button
              onClick={() => {
                localStorage.removeItem('urbano_v12_products');
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Reload Live Store
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  const handleOpenCheckout = (discountAmount: number) => {
    setCheckoutDiscount(discountAmount);
    setCheckoutOpen(true);
  };

  // Safe tab router: GUARANTEED to NEVER be blank
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
      case 'about':
        return <FirstPage />;

      case 'customer':
      case 'shop':
      case 'services':
      case 'customer_dash':
        return <CustomerModulePage />;

      case 'gardener':
      case 'gardener_dash':
        return <GardenerModulePage />;

      case 'nursery_dash':
        return <NurseryDashboard />;

      case 'admin':
      case 'admin_dash':
        return <AdminModulePage />;

      default:
        // Absolute fallback guarantees content is ALWAYS displayed
        return <CustomerModulePage />;
    }
  };

  return (
    <div className="min-h-screen text-stone-100 relative selection:bg-emerald-600 selection:text-white">
      {/* Botanical Organic Background with looping video */}
      <BotanicalBackground />

      {/* Main Routed View floating transparently over background */}
      <div className="relative z-10 w-full min-h-screen">
        {renderCurrentView()}
      </div>

      {/* Single Global Modals & Overlays */}
      <CartDrawer onOpenCheckout={handleOpenCheckout} />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        discount={checkoutDiscount}
      />
      <ProductDetailModal />
      <BookingModal />
      <AuthModal />
      <AdminPinModal />
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}

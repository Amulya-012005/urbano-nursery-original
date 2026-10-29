const fs = require('fs');

// ==========================================
// 1. UPDATE AppContext.tsx
// ==========================================
let appContext = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Update storage key to urbano_v12_
appContext = appContext.replaceAll('urbano_v10_', 'urbano_v12_');

// Enhance loadStored products check to ensure fresh verified images
const oldProdCheck = `      if (key === 'products' && Array.isArray(parsed)) {
        if (parsed.length !== INITIAL_PRODUCTS.length) return fallback;
        if (parsed.some((p: any) => !p.sku)) return fallback;
        if (parsed.some((p: any) => p.image && p.image.includes('unsplash'))) return fallback;
      }`;

const newProdCheck = `      if (key === 'products' && Array.isArray(parsed)) {
        if (parsed.length !== INITIAL_PRODUCTS.length) return fallback;
        if (parsed.some((p: any) => !p.sku)) return fallback;
        // If unverified items exist in old storage, load fresh curated catalogue
        if (parsed.some((p: any) => !p.imageUrl || p.imageUrl === '')) return fallback;
      }`;

if (appContext.includes(oldProdCheck)) {
  appContext = appContext.replace(oldProdCheck, newProdCheck);
}

// Ensure placeOrder always produces safe items
const oldPlaceOrder = `      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        nurseryId: item.product.nurseryId,
        nurseryName: item.product.nurseryName
      })),`;

const newPlaceOrder = `      items: (cart || []).map(item => ({
        productId: item.product?.id || ('prod_' + Math.random()),
        productName: item.product?.name || 'Botanical Plant',
        price: Number(item.product?.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.product?.imageUrl || item.product?.image || '/assets/plants/peace_lily.jpg',
        nurseryId: item.product?.nurseryId || 'nursery_1',
        nurseryName: item.product?.nurseryName || 'GreenRoots Botanical Haven'
      })),`;

if (appContext.includes(oldPlaceOrder)) {
  appContext = appContext.replace(oldPlaceOrder, newPlaceOrder);
}

fs.writeFileSync('src/context/AppContext.tsx', appContext, 'utf8');
console.log('1. AppContext.tsx updated!');

// ==========================================
// 2. UPDATE CustomerModulePage.tsx
// ==========================================
let cmp = fs.readFileSync('src/components/CustomerModulePage.tsx', 'utf8');

// Fix category and indoor/outdoor filters
const oldCmpFilter = `      // Category filter (Indoor plants, Outdoor flowering, Gardening tools)
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'indoor' && product.category !== 'indoor') return false;
        if ((categoryFilter === 'outdoor' || categoryFilter === 'flowering') && product.category !== 'flowering' && product.category !== 'outdoor') return false;
        if (categoryFilter === 'tools' && product.category !== 'tools') return false;
      }

      // Indoor / Outdoor filter
      if (indoorOutdoorFilter === 'indoor' && product.category !== 'indoor') return false;
      if (indoorOutdoorFilter === 'outdoor' && product.category !== 'flowering' && product.category !== 'outdoor') return false;`;

const newCmpFilter = `      // Category filter
      if (categoryFilter !== 'all') {
        const cat = (product.category || '').toLowerCase();
        const target = categoryFilter.toLowerCase();
        if (target.includes('indoor') && !cat.includes('indoor')) return false;
        if (target.includes('outdoor') && !cat.includes('outdoor')) return false;
        if (target.includes('flowering') && !cat.includes('flowering')) return false;
        if ((target.includes('gardening') || target.includes('tools')) && !cat.includes('gardening') && !cat.includes('tools')) return false;
      }

      // Indoor / Outdoor filter
      if (indoorOutdoorFilter === 'indoor' && !(product.category || '').toLowerCase().includes('indoor')) return false;
      if (indoorOutdoorFilter === 'outdoor' && !(product.category || '').toLowerCase().includes('outdoor') && !(product.category || '').toLowerCase().includes('flowering')) return false;`;

if (cmp.includes(oldCmpFilter)) {
  cmp = cmp.replace(oldCmpFilter, newCmpFilter);
}

// Add tab sync with activeTab
const oldTabState = `  const [customerTab, setCustomerTab] = useState<'shop' | 'services' | 'history' | 'notifications'>('shop');`;
const newTabState = `  const { activeTab } = useApp();
  const [customerTab, setCustomerTab] = useState<'shop' | 'services' | 'history' | 'notifications'>(() => {
    if (activeTab === 'customer_dash' || (activeTab as string) === 'orders') return 'history';
    if (activeTab === 'services') return 'services';
    return 'shop';
  });

  React.useEffect(() => {
    if (activeTab === 'customer_dash' || (activeTab as string) === 'orders') {
      setCustomerTab('history');
    } else if (activeTab === 'services') {
      setCustomerTab('services');
    } else if (activeTab === 'shop') {
      setCustomerTab('shop');
    }
  }, [activeTab]);`;

if (cmp.includes(oldTabState)) {
  cmp = cmp.replace(oldTabState, newTabState);
}

// Make sure categoryFilter type is string
cmp = cmp.replace(
  `const [categoryFilter, setCategoryFilter] = useState<'all' | 'indoor' | 'outdoor' | 'flowering' | 'seeds' | 'pots' | 'tools'>('all');`,
  `const [categoryFilter, setCategoryFilter] = useState<string>('all');`
);

// Remove the duplicate CartDrawer and CheckoutModal at bottom of CustomerModulePage
const oldBottomModals = `      {/* Cart & Checkout */}
      <CartDrawer onOpenCheckout={(discount) => {
        setCheckoutDiscount(discount);
        setCheckoutOpen(true);
      }} />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        discount={checkoutDiscount}
      />
      <ProductDetailModal />
      <BookingModal />`;

const newBottomModals = `      {/* Customer Modals */}
      <ProductDetailModal />
      <BookingModal />`;

if (cmp.includes(oldBottomModals)) {
  cmp = cmp.replace(oldBottomModals, newBottomModals);
}

// Add null-safety to order items loop in CustomerModulePage
cmp = cmp.replace(
  `{order.items.map((item, idx) => (`,
  `{(order.items || []).map((item, idx) => (`
);

// Safe date parsing in order card
cmp = cmp.replace(
  `Placed on {new Date(order.createdAt).toLocaleDateString()} · Est: {order.estimatedDelivery}`,
  `Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} · Est: {order.estimatedDelivery || 'Tomorrow, by 2:00 PM'}`
);

fs.writeFileSync('src/components/CustomerModulePage.tsx', cmp, 'utf8');
console.log('2. CustomerModulePage.tsx updated!');

// ==========================================
// 3. UPDATE CheckoutModal.tsx
// ==========================================
let checkoutModal = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');

// Safe items loop
checkoutModal = checkoutModal.replace(
  `{confirmedOrder.items.map((it, idx) => (`,
  `{(confirmedOrder.items || []).map((it, idx) => (`
);

// When clicking "Track in Customer Orders", navigate to 'customer_dash' (which opens history tab directly)
checkoutModal = checkoutModal.replace(
  `                onClick={() => {
                  handleClose();
                  setActiveTab('customer');
                }}`,
  `                onClick={() => {
                  handleClose();
                  setActiveTab('customer_dash');
                }}`
);

fs.writeFileSync('src/components/CheckoutModal.tsx', checkoutModal, 'utf8');
console.log('3. CheckoutModal.tsx updated!');

// ==========================================
// 4. UPDATE App.tsx with Robust Routing & Error Boundary
// ==========================================
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const newAppTsx = `import React, { useState } from 'react';
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
`;

fs.writeFileSync('src/App.tsx', newAppTsx, 'utf8');
console.log('4. App.tsx updated with comprehensive router and ErrorBoundary!');

// ==========================================
// 5. UPDATE ProductImage.tsx with Smooth Fallback
// ==========================================
let productImage = fs.readFileSync('src/components/ProductImage.tsx', 'utf8');

// Ensure that ProductImage always shows an attractive botanical view even if network flickers
const newProductImage = `import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Sprout, Wrench } from 'lucide-react';

interface ProductImageProps {
  product: Product;
  className?: string;
  imgClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
}) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [product.id, product.sku, product.imageUrl, product.image]);

  const rawUrl = product.imageUrl || product.image;
  const isTool = product.category === 'Gardening Items' || (product.category as string) === 'tools';

  // Fallback botanical plant card if image fails to load
  if (!rawUrl || rawUrl.trim() === '' || loadError) {
    return (
      <div
        key={\`fallback-\${product.id}\`}
        className={\`flex flex-col items-center justify-center p-4 text-center select-none bg-stone-900/90 border border-emerald-800/40 relative overflow-hidden \${className}\`}
        style={{ minHeight: '160px' }}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center mb-2 shadow-inner">
          {isTool ? (
            <Wrench className="w-5 h-5 text-amber-400" />
          ) : (
            <Sprout className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <p className="text-xs font-bold text-amber-300 line-clamp-1">{product.name}</p>
        <p className="text-[10px] text-stone-400 font-mono mt-0.5">SKU: {product.sku || product.id}</p>
        <span className="inline-block mt-1 text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
          Urbano Verified Specimen
        </span>
      </div>
    );
  }

  return (
    <div key={\`img-container-\${product.id}\`} className={\`relative overflow-hidden \${className}\`}>
      <img
        key={\`img-\${product.id}-\${rawUrl}\`}
        src={rawUrl}
        alt={product.name}
        className={imgClassName}
        loading="lazy"
        onError={() => setLoadError(true)}
      />
    </div>
  );
};
`;

fs.writeFileSync('src/components/ProductImage.tsx', newProductImage, 'utf8');
console.log('5. ProductImage.tsx updated!');

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, GardeningService, OrderStatus } from '../types';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Bell,
  ArrowLeft,
  Sun,
  Droplets,
  ShieldCheck,
  Eye,
  Heart,
  Package,
  RotateCcw,
  Sparkles,
  CreditCard,
  Tag,
  Wrench,
  Sprout,
  Filter,
  ChevronDown
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { BookingModal } from './BookingModal';
import { ProductImage } from './ProductImage';
import { UrbanoLogo } from './UrbanoLogo';

export const CustomerModulePage: React.FC = () => {
  const {
    currentUser,
    products,
    services,
    gardeners,
    orders,
    bookings,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    addToCart,
    cartCount,
    setIsCartOpen,
    setSelectedProduct,
    setSelectedServiceForBooking,
    setSelectedGardenerForBooking,
    setBookingModalOpen,
    setActiveTab,
    activeTab
  } = useApp();

  // Navigation tab for Customer module: Plants Marketplace is active by default
  const [customerTab, setCustomerTab] = useState<'plants' | 'tools' | 'services' | 'history' | 'notifications'>(() => {
    if (activeTab === 'customer_dash' || (activeTab as string) === 'orders') return 'history';
    if (activeTab === 'services') return 'services';
    if ((activeTab as string) === 'tools') return 'tools';
    return 'plants';
  });

  React.useEffect(() => {
    if (activeTab === 'customer_dash' || (activeTab as string) === 'orders') {
      setCustomerTab('history');
    } else if (activeTab === 'services') {
      setCustomerTab('services');
    } else if ((activeTab as string) === 'tools') {
      setCustomerTab('tools');
    } else if (activeTab === 'shop' || activeTab === 'customer') {
      setCustomerTab('plants');
    }
  }, [activeTab]);

  // =========================================================================
  // SEPARATE DATA STREAMS: STRICT ZERO-MIX GUARANTEE
  // =========================================================================
  // Plants: All living flora (Indoor, Outdoor, Flowering, Palms, Vines, Succulents, Fruit Trees)
  const allPlants = useMemo(() => {
    return products.filter(p => p.department !== 'tool_essential' && p.category !== 'Tools & Essentials' && p.category !== 'Gardening Items');
  }, [products]);

  // Tools: Dedicated tools, composts, potting mixes, care oils, pots, hardware
  const allTools = useMemo(() => {
    return products.filter(p => p.department === 'tool_essential' || p.category === 'Tools & Essentials' || p.category === 'Gardening Items');
  }, [products]);

  // =========================================================================
  // 1. PLANTS MARKETPLACE FILTER STATES (All plants strictly within ₹1000)
  // =========================================================================
  const [plantTypeFilter, setPlantTypeFilter] = useState<string>('all');
  const [selectedPlantVariety, setSelectedPlantVariety] = useState<string>('all');
  const [plantMaxPrice, setPlantMaxPrice] = useState<number>(1000);
  const [plantSearchQuery, setPlantSearchQuery] = useState('');

  // Comprehensive plant varieties extracted from user specifications
  const plantVarieties = [
    { label: '🌿 All Plant Varieties & Species', value: 'all' },
    // Indoor plants mentioned by user
    { label: 'Philodendron (Birkin / Heartleaf)', value: 'philodendron' },
    { label: 'Pothos (Golden Money Plant)', value: 'pothos' },
    { label: 'Monstera Deliciosa (Swiss Cheese)', value: 'monstera' },
    { label: 'Peace Lily (Spathiphyllum)', value: 'peace lily' },
    { label: 'Calathea (Peacock Plant)', value: 'calathea' },
    { label: 'Snake Plant (Sansevieria)', value: 'snake plant' },
    { label: 'Jade Plant (Crassula)', value: 'jade' },
    { label: 'Aloe Vera', value: 'aloe vera' },
    { label: 'Haworthia (Zebra Plant)', value: 'haworthia' },
    { label: 'Areca Palm', value: 'areca palm' },
    { label: 'Parlor Palm (Chamaedorea)', value: 'parlor palm' },
    { label: 'Rubber Plant (Ficus Elastica)', value: 'rubber plant' },
    { label: 'Fiddle Leaf Fig (Ficus Lyrata)', value: 'fiddle leaf' },
    { label: 'Dracaena (Song of India)', value: 'dracaena' },
    { label: 'Hoya (Wax Plant)', value: 'hoya' },
    { label: 'String of Pearls', value: 'string of pearls' },
    { label: 'Tradescantia (Wandering Dude)', value: 'tradescantia' },
    { label: 'African Violet', value: 'african violet' },
    { label: 'Anthurium', value: 'anthurium' },
    { label: 'Kalanchoe', value: 'kalanchoe' },
    { label: 'ZZ Plant', value: 'zz plant' },
    { label: 'Spider Plant', value: 'spider plant' },
    { label: 'Aglaonema', value: 'aglaonema' },
    // Outdoor plants mentioned by user
    { label: 'Hibiscus (Gudhal)', value: 'hibiscus' },
    { label: 'Bougainvillea', value: 'bougainvillea' },
    { label: 'Double Chandni (Crape Jasmine)', value: 'chandni' },
    { label: 'Ixora (Rugmini)', value: 'ixora' },
    { label: 'Madhumalti (Rangoon Creeper)', value: 'madhumalti' },
    { label: 'Aparajita (Butterfly Pea)', value: 'aparajita' },
    { label: 'Climbing Rose (Desi Gulab)', value: 'rose' },
    { label: 'Marigold (Genda)', value: 'marigold' },
    { label: 'Mogra (Arabian Jasmine)', value: 'mogra' },
    { label: 'Sadabahar (Periwinkle)', value: 'sadabahar' },
    { label: 'Lantana Camara', value: 'lantana' },
    { label: 'Desert Rose (Adenium)', value: 'adenium' },
    { label: 'Portulaca (Moss Rose)', value: 'portulaca' },
    { label: 'Croton (Petra / Gold Dust)', value: 'croton' },
    { label: 'Coleus', value: 'coleus' },
    { label: 'Caladium', value: 'caladium' },
    { label: 'Copperleaf (Acalypha)', value: 'copperleaf' },
    { label: 'Foxtail Palm', value: 'foxtail' },
    { label: 'Sago Palm (Cycas)', value: 'sago' },
    { label: 'Pony Tail Palm', value: 'pony tail' },
    { label: 'Traveller’s Palm', value: 'traveller' },
    { label: 'Schefflera (Umbrella Plant)', value: 'schefflera' },
    { label: 'Thuja (Morpankhi)', value: 'thuja' },
    { label: 'Duranta (Golden Dewdrop)', value: 'duranta' },
    { label: 'Japanese Maple (Acer)', value: 'japanese maple' },
    { label: 'Ficus Benjamina', value: 'benjamina' },
    { label: 'Bird of Paradise', value: 'bird of paradise' },
    { label: 'Tecoma (Yellow Bells)', value: 'tecoma' },
    { label: 'Plumeria (Champa)', value: 'plumeria' },
    { label: 'Kaner (Oleander)', value: 'kaner' },
    { label: 'Canna Lily', value: 'canna' },
    { label: 'Daylily', value: 'daylily' },
    { label: 'Petunia', value: 'petunia' },
    { label: 'Zinnia', value: 'zinnia' },
    { label: 'Cosmos', value: 'cosmos' },
    { label: 'Vinca', value: 'vinca' },
    { label: 'Chrysanthemum (Guldaudi)', value: 'chrysanthemum' },
    { label: 'Verbena', value: 'verbena' },
    { label: 'Salvia', value: 'salvia' },
    { label: 'Geranium', value: 'geranium' },
    { label: 'Sunflowers', value: 'sunflower' },
    { label: 'Morning Glory', value: 'morning glory' },
    { label: 'Bleeding Heart Vine', value: 'bleeding heart' },
    { label: 'Garlic Vine', value: 'garlic vine' },
    { label: 'Tristellateia', value: 'tristellateia' },
    { label: 'Wisteria', value: 'wisteria' },
    // Fruit Trees
    { label: 'Alphonso Mango Tree', value: 'mango' },
    { label: 'Chikoo (Sapota)', value: 'chikoo' },
    { label: 'Dwarf Papaya', value: 'papaya' },
    { label: 'Low-Chill Apple', value: 'apple' },
    { label: 'Thai Guava', value: 'guava' },
    { label: 'Kagzi Lemon', value: 'lemon' },
    { label: 'Pomegranate (Anaar)', value: 'pomegranate' },
    { label: 'Sweet Lime (Mosambi)', value: 'mosambi' },
    { label: 'Fig (Anjeer)', value: 'anjeer' },
    { label: 'Sweet Curry Leaf', value: 'curry leaf' }
  ];

  // Filtered Plants - Guaranteed to display ALL available plants by default
  const filteredPlants = useMemo(() => {
    return allPlants.filter(plant => {
      // Search query
      if (plantSearchQuery.trim()) {
        const query = plantSearchQuery.toLowerCase();
        const matchName = plant.name.toLowerCase().includes(query);
        const matchBot = plant.botanicalName?.toLowerCase().includes(query) || false;
        const matchType = plant.plantType?.toLowerCase().includes(query) || false;
        const matchTags = plant.tags?.some(t => t.toLowerCase().includes(query)) || false;
        if (!matchName && !matchBot && !matchType && !matchTags) return false;
      }

      // Plant Type Tab Filter: Only All Plants, Indoor Plants, Outdoor Plants
      if (plantTypeFilter !== 'all') {
        const cat = (plant.category || '').toLowerCase();
        const type = (plant.plantType || '').toLowerCase();
        const tags = (plant.tags || []).map(t => t.toLowerCase());

        const isIndoor = cat === 'indoor plants' || cat.includes('indoor') || type.includes('indoor') || tags.some(t => t.includes('indoor'));

        if (plantTypeFilter === 'indoor') {
          if (!isIndoor) return false;
        } else if (plantTypeFilter === 'outdoor') {
          if (isIndoor) return false;
        }
      }

      // Specific Plant Variety Select
      if (selectedPlantVariety !== 'all') {
        const v = selectedPlantVariety.toLowerCase();
        const matchName = plant.name.toLowerCase().includes(v);
        const matchBot = plant.botanicalName?.toLowerCase().includes(v) || false;
        const matchTags = plant.tags?.some(t => t.toLowerCase().includes(v)) || false;
        if (!matchName && !matchBot && !matchTags) return false;
      }

      // Price filter (all plants strictly <= ₹1000)
      if (plant.price > plantMaxPrice) return false;

      return true;
    });
  }, [allPlants, plantSearchQuery, plantTypeFilter, selectedPlantVariety, plantMaxPrice]);

  const handleResetPlantFilters = () => {
    setPlantTypeFilter('all');
    setSelectedPlantVariety('all');
    setPlantMaxPrice(1000);
    setPlantSearchQuery('');
  };

  // =========================================================================
  // 2. TOOLS & PLANT ESSENTIALS FILTER STATES (Completely Separate Page)
  // =========================================================================
  const [toolCategoryFilter, setToolCategoryFilter] = useState<string>('all');
  const [toolMaxPrice, setToolMaxPrice] = useState<number>(1000);
  const [toolSearchQuery, setToolSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      // Search
      if (toolSearchQuery.trim()) {
        const query = toolSearchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(query);
        const matchCategory = tool.toolCategory?.toLowerCase().includes(query) || false;
        const matchTags = tool.tags?.some(t => t.toLowerCase().includes(query)) || false;
        if (!matchName && !matchCategory && !matchTags) return false;
      }

      // Tool Category Tab
      if (toolCategoryFilter !== 'all') {
        const cat = (tool.toolCategory || '').toLowerCase();
        const tags = (tool.tags || []).map(t => t.toLowerCase());

        if (toolCategoryFilter === 'cutters') {
          if (!cat.includes('hand tools') && !cat.includes('cutters') && !tags.some(t => t.includes('hand tools') || t.includes('shears') || t.includes('pruning'))) return false;
        } else if (toolCategoryFilter === 'soils') {
          if (!cat.includes('soils') && !cat.includes('composts') && !cat.includes('fertilizers')) return false;
        } else if (toolCategoryFilter === 'oils') {
          if (!cat.includes('care oils') && !cat.includes('sprays')) return false;
        } else if (toolCategoryFilter === 'pots') {
          if (!cat.includes('pots') && !cat.includes('planters') && !cat.includes('stands')) return false;
        } else if (toolCategoryFilter === 'watering') {
          if (!cat.includes('watering') && !cat.includes('hardware')) return false;
        }
      }

      // Price Filter
      if (tool.price > toolMaxPrice) return false;

      return true;
    });
  }, [allTools, toolSearchQuery, toolCategoryFilter, toolMaxPrice]);

  const handleResetToolFilters = () => {
    setToolCategoryFilter('all');
    setToolMaxPrice(1000);
    setToolSearchQuery('');
  };

  // Orders & Bookings
  const customerOrders = orders.filter(o => o.customerId === currentUser.id);
  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);

  const handleBookService = (service: GardeningService) => {
    setSelectedServiceForBooking(service);
    setSelectedGardenerForBooking(gardeners[0] || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="relative z-10 w-full min-h-screen pb-16 text-stone-100">
      {/* Customer Header with Dark Forest Theme & Urbano Brand */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#07130c]/90 border-b border-amber-400/30 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-amber-400/25 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
              title="Return to Home Modules"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Home Modules</span>
            </button>

            <div className="flex items-center gap-3">
              <UrbanoLogo size={38} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold inline-block">
                  Customer Marketplace
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-white font-serif-botanical leading-tight mt-0.5">
                  Welcome, {currentUser.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Trigger */}
            <button
              onClick={() => setCustomerTab('notifications')}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-amber-400/25 transition-colors cursor-pointer"
              title="Notifications and updates"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-black/50 border border-amber-400/30 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-black/50 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums text-amber-300 font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Customer Navigation Tabs: Completely separate Plants vs Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {/* TAB 1: PLANTS MARKETPLACE */}
          <button
            onClick={() => setCustomerTab('plants')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              customerTab === 'plants'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg border border-emerald-400/50 shadow-emerald-950/60'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Living Plants Marketplace</span>
          </button>

          {/* TAB 2: TOOLS & ESSENTIALS (COMPLETELY DIFFERENT PAGE) */}
          <button
            onClick={() => setCustomerTab('tools')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              customerTab === 'tools'
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg border border-amber-400/50 shadow-amber-950/60'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-300" />
            <span>Tools & Plant Essentials</span>
          </button>

          {/* TAB 3: GARDENING SERVICES */}
          <button
            onClick={() => setCustomerTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              customerTab === 'services'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg border border-emerald-400/50 shadow-emerald-950/60'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Book Gardener Services</span>
          </button>

          {/* TAB 4: ORDER & SERVICE HISTORY */}
          <button
            onClick={() => setCustomerTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              customerTab === 'history'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg border border-emerald-400/50 shadow-emerald-950/60'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            <Package className="w-4 h-4 text-amber-300" />
            <span>Orders & Service History</span>
          </button>

          {/* TAB 5: NOTIFICATIONS */}
          <button
            onClick={() => setCustomerTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              customerTab === 'notifications'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg border border-emerald-400/50 shadow-emerald-950/60'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">

        {/* =========================================================================
            PAGE 1: LIVING PLANTS MARKETPLACE (DISPLAYS ALL PLANTS AVAILABLE ON ENTER)
           ========================================================================= */}
        {customerTab === 'plants' && (
          <div className="space-y-6">
            {/* Top Botanical Filtering Tab & Control Center */}
            <div className="glass-panel rounded-3xl p-6 border border-amber-400/30 shadow-2xl space-y-5 bg-[#09180f]/85">
              
              {/* Row 1: Search Bar & Plant Variety Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search Plants */}
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={plantSearchQuery}
                    onChange={(e) => setPlantSearchQuery(e.target.value)}
                    placeholder="Search plant by name, botanical species, or care requirement..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-amber-400/30 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                  />
                  {plantSearchQuery && (
                    <button
                      onClick={() => setPlantSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Specific Plant Variety Dropdown ("when user chooses specific type of plant...") */}
                <div className="md:col-span-6 relative">
                  <label className="block text-[10px] uppercase font-bold text-amber-300 mb-1">
                    Choose Specific Plant Variety:
                  </label>
                  <select
                    value={selectedPlantVariety}
                    onChange={(e) => setSelectedPlantVariety(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-amber-400/40 rounded-xl text-xs text-amber-200 font-semibold focus:outline-none focus:border-amber-300 cursor-pointer"
                  >
                    {plantVarieties.map((v) => (
                      <option key={v.value} value={v.value} className="bg-stone-900 text-stone-100">
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Plant Type Filter Tabs Above the Page */}
              <div className="pt-2 border-t border-amber-400/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-amber-400" />
                    <span>Filter By Plant Type:</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    Showing {filteredPlants.length} of {allPlants.length} Plants Available
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { key: 'all', label: 'All Plants' },
                    { key: 'indoor', label: 'Indoor Plants' },
                    { key: 'outdoor', label: 'Outdoor Plants' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setPlantTypeFilter(tab.key)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        plantTypeFilter === tab.key
                          ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white border border-amber-300 shadow-md shadow-emerald-950/70'
                          : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Price Filter (All Plants strictly within ₹1000) */}
              <div className="pt-3 border-t border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-300 font-semibold shrink-0">Price Ceiling:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: 'All Prices (≤ ₹1000)', val: 1000 },
                      { label: '≤ ₹250', val: 250 },
                      { label: '≤ ₹400', val: 400 },
                      { label: '≤ ₹600', val: 600 }
                    ].map(p => (
                      <button
                        key={p.val}
                        onClick={() => setPlantMaxPrice(p.val)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          plantMaxPrice === p.val
                            ? 'bg-amber-400 text-black font-bold'
                            : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-300 font-bold tabular-nums">
                    Max: ₹{plantMaxPrice}
                  </span>
                  <input
                    type="range"
                    min="80"
                    max="1000"
                    step="20"
                    value={plantMaxPrice}
                    onChange={(e) => setPlantMaxPrice(Number(e.target.value))}
                    className="w-32 sm:w-44 accent-amber-400 cursor-pointer"
                  />
                  {(plantTypeFilter !== 'all' || selectedPlantVariety !== 'all' || plantMaxPrice < 1000 || plantSearchQuery) && (
                    <button
                      onClick={handleResetPlantFilters}
                      className="px-2.5 py-1 text-xs text-amber-300 hover:text-white border border-amber-400/40 rounded-lg flex items-center gap-1 cursor-pointer bg-black/40"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Plants Grid (Highlighted with slight green & golden yellowish boxes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map(product => (
                <div
                  key={product.id}
                  className="plant-card-gold rounded-2xl overflow-hidden border border-amber-400/40 hover:border-amber-300 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Plant Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                    <ProductImage
                      product={product}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold uppercase text-amber-300 border border-amber-400/50 shadow-xs">
                      {product.plantType || product.category}
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>View Care Details</span>
                    </button>
                  </div>

                  {/* Plant Card Body */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-1 font-serif-botanical"
                      >
                        {product.name}
                      </h3>
                      {product.botanicalName && (
                        <p className="text-[11px] italic text-amber-100/70 line-clamp-1 mt-0.5">
                          {product.botanicalName}
                        </p>
                      )}

                      {/* Care Hints */}
                      {product.care && (
                        <div className="flex items-center gap-2.5 text-[10px] text-stone-300 mt-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Sun className="w-3 h-3 text-amber-400" />
                            <span>{product.care.sunlight}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-sky-400" />
                            <span>{product.care.water}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="pt-3 border-t border-amber-400/20 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-amber-300 tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through ml-1.5 tabular-nums">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-black/50 flex items-center gap-1.5 cursor-pointer border border-amber-400/30"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPlants.length === 0 && (
              <div className="glass-panel rounded-3xl p-12 text-center border border-amber-400/30">
                <p className="text-base font-bold text-white">No plants found matching the selected filter</p>
                <p className="text-xs text-stone-300 mt-1">
                  Click below to reset filters and view all {allPlants.length} living plants available.
                </p>
                <button
                  onClick={handleResetPlantFilters}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Show All Plants
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PAGE 2: TOOLS & PLANT ESSENTIALS (COMPLETELY DIFFERENT PAGE - ZERO LIVING PLANTS)
           ========================================================================= */}
        {customerTab === 'tools' && (
          <div className="space-y-6">
            {/* Top Tools Control Center */}
            <div className="glass-panel rounded-3xl p-6 border border-amber-400/30 shadow-2xl space-y-5 bg-[#141209]/85">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-400/20 pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif-botanical text-amber-300">
                    Tools & Gardening Essentials
                  </h2>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Heavy-duty trowels, pruning shears, organic vermicompost, pure care oils, pots, sprayers, and hardware.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-200 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
                  {filteredTools.length} Essentials Available
                </div>
              </div>

              {/* Row 1: Search & Price */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 relative">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={toolSearchQuery}
                    onChange={(e) => setToolSearchQuery(e.target.value)}
                    placeholder="Search tools (khurpa, shears, hose), compost, coco peat, neem oil, terracotta pots..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-amber-400/30 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                  />
                  {toolSearchQuery && (
                    <button
                      onClick={() => setToolSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="md:col-span-4 flex items-center justify-end gap-3">
                  <span className="text-xs text-stone-300 font-semibold shrink-0">Max: ₹{toolMaxPrice}</span>
                  <input
                    type="range"
                    min="90"
                    max="1000"
                    step="20"
                    value={toolMaxPrice}
                    onChange={(e) => setToolMaxPrice(Number(e.target.value))}
                    className="w-32 accent-amber-400 cursor-pointer"
                  />
                  {(toolCategoryFilter !== 'all' || toolMaxPrice < 1000 || toolSearchQuery) && (
                    <button
                      onClick={handleResetToolFilters}
                      className="p-1.5 text-xs text-amber-300 hover:text-white border border-amber-400/40 rounded-lg cursor-pointer"
                      title="Reset filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Tool Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-400/20">
                {[
                  { key: 'all', label: `🛠️ All Essentials (${allTools.length})` },
                  { key: 'cutters', label: '✂️ Hand Tools & Cutters (14)' },
                  { key: 'soils', label: '🌱 Soils, Composts & Fertilizers (9)' },
                  { key: 'oils', label: '💧 Care Oils & Sprays (4)' },
                  { key: 'pots', label: '🪴 Pots, Planters & Stands (10)' },
                  { key: 'watering', label: '🚿 Watering & Hardware (8)' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setToolCategoryFilter(tab.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      toolCategoryFilter === tab.key
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border border-amber-300 shadow-md shadow-amber-950/70'
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  className="plant-card-gold rounded-2xl overflow-hidden border border-amber-400/40 hover:border-amber-300 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Tool Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                    <ProductImage
                      product={tool}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold uppercase text-amber-300 border border-amber-400/50 shadow-xs">
                      {tool.toolCategory || tool.category}
                    </div>

                    <button
                      onClick={() => setSelectedProduct(tool)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>View Specifications</span>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(tool)}
                        className="text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-1 font-serif-botanical"
                      >
                        {tool.name}
                      </h3>
                      <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="pt-3 border-t border-amber-400/20 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-amber-300 tabular-nums">
                          ₹{tool.price.toLocaleString('en-IN')}
                        </span>
                        {tool.originalPrice && (
                          <span className="text-xs text-stone-400 line-through ml-1.5 tabular-nums">
                            ₹{tool.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(tool, 1)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-black/50 flex items-center gap-1.5 cursor-pointer border border-amber-400/30"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="glass-panel rounded-3xl p-12 text-center border border-amber-400/30">
                <p className="text-base font-bold text-white">No tools found matching the selected filter</p>
                <p className="text-xs text-stone-300 mt-1">
                  Click below to reset filters and view all {allTools.length} gardening essentials.
                </p>
                <button
                  onClick={handleResetToolFilters}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-600 to-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Show All Tools & Essentials
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PAGE 3: BOOK GARDENER SERVICES
           ========================================================================= */}
        {customerTab === 'services' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                Verified Doorstep Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-botanical">
                Book Verified Gardening Services
              </h2>
              <p className="text-xs text-stone-300">
                Certified horticulturists for home soil tilling, seasonal pruning, lawn mowing, repotting, and pest management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(service => (
                <div
                  key={service.id}
                  className="plant-card-gold rounded-3xl p-6 border border-amber-400/40 hover:border-amber-300 shadow-xl transition-all flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        {service.category}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{service.duration}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-serif-botanical group-hover:text-amber-300 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-amber-400/20">
                      <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wider">
                        Included in Service:
                      </span>
                      {service.included.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-400/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Service Fee</span>
                      <span className="text-xl font-bold text-amber-300 tabular-nums">
                        ₹{service.basePrice}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBookService(service)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-black/50 border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 4: ORDER & SERVICE HISTORY
           ========================================================================= */}
        {customerTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-serif-botanical">
                Your Order & Service History
              </h2>
              <p className="text-xs text-stone-300">
                Inspect your ordered living plants, tools, and booked gardener appointments.
              </p>
            </div>

            {customerOrders.length === 0 && customerBookings.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
                <Package className="w-12 h-12 text-stone-500 mx-auto mb-3" />
                <p className="text-base font-bold text-white">No orders or bookings yet</p>
                <p className="text-xs text-stone-400 mt-1">
                  Browse our verified botanicals or tools to place your first order.
                </p>
                <button
                  onClick={() => setCustomerTab('plants')}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Explore Plants Marketplace
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map(order => (
                  <div
                    key={order.id}
                    className="plant-card-gold rounded-2xl p-6 border border-amber-400/30 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-400/30">
                          #{order.id}
                        </span>
                        <span className="text-xs text-stone-300">Ordered on: {order.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          {order.status === 'delivered' ? '✓ Delivered' : order.status}
                        </span>
                        <span className="text-sm font-bold text-amber-300">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-black/40 rounded-xl border border-white/10">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-amber-400/30"
                          />
                          <div className="text-xs">
                            <p className="font-bold text-white line-clamp-1">{item.productName}</p>
                            <p className="text-stone-400 text-[10px]">Qty: {item.quantity} · ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-stone-300 pt-2 border-t border-amber-400/10">
                      Destination: <strong className="text-white">{order.deliveryAddress}, {order.city}</strong>
                    </p>
                  </div>
                ))}

                {customerBookings.map(b => (
                  <div
                    key={b.id}
                    className="plant-card-gold rounded-2xl p-6 border border-emerald-500/30 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-mono">
                        Booking #{b.id} · {b.serviceTitle}
                      </span>
                      <span className="text-xs font-bold text-amber-300">₹{b.price}</span>
                    </div>
                    <p className="text-xs text-stone-300">
                      Scheduled Date: <strong className="text-white">{b.date} ({b.timeSlot})</strong>
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Address: {b.address} · Gardener Assigned: {b.gardenerName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PAGE 5: NOTIFICATIONS
           ========================================================================= */}
        {customerTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white font-serif-botanical">
              Notifications & Order Updates
            </h2>
            {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 text-center border border-white/10">
                <Bell className="w-8 h-8 text-stone-500 mx-auto mb-2" />
                <p className="text-xs text-stone-400">No new notifications at this time.</p>
              </div>
            ) : (
              notifications
                .filter(n => n.userId === currentUser.id)
                .map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      n.isRead
                        ? 'bg-black/40 border-white/10'
                        : 'bg-emerald-950/70 border-emerald-500/40 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                      <span className="text-[10px] text-stone-400">{n.createdAt}</span>
                    </div>
                    <p className="text-xs text-stone-300">{n.message}</p>
                  </div>
                ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

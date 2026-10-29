import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Star,
  Settings,
  ArrowLeft,
  Calendar,
  Package,
  Plus,
  Edit2,
  Check,
  DollarSign,
  Upload,
  UserCheck,
  Bell,
  MessageSquare,
  Phone,
  AlertCircle,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory, OrderStatus } from '../types';
import { UrbanoLogo } from './UrbanoLogo';

export const GardenerModulePage: React.FC = () => {
  const {
    currentUser,
    gardeners,
    bookings,
    updateBookingStatus,
    products,
    addProduct,
    updateProduct,
    toggleProductStock,
    orders,
    updateOrderStatus,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  // Active sub-tab within Gardener Module - includes Live Customer Messages & Orders
  const [gardenerTab, setGardenerTab] = useState<
    'messages' | 'bookings' | 'products' | 'services' | 'orders' | 'earnings' | 'verification'
  >('messages');

  // Currently logged-in gardener
  const currentGardener =
    gardeners.find((g) => g.userId === currentUser.id) ||
    gardeners[0];

  // Incoming Live Customer Messages & Notifications (Orders & Bookings)
  const gardenerMessages = notifications.filter(
    (n) => n.userId === currentUser.id || n.userId === currentGardener.userId || n.userId === 'user_gardener_1' || n.type === 'order' || n.type === 'booking'
  );
  const unreadMessagesCount = gardenerMessages.filter((n) => !n.isRead).length;

  // Bookings for this gardener - display all pending so no customer service request is missed
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  // Service Pricing & Slot Settings State
  const [hourlyRate, setHourlyRate] = useState(currentGardener.hourlyRate || 499);
  const [lawnServicePrice, setLawnServicePrice] = useState(699);
  const [pruningServicePrice, setPruningServicePrice] = useState(399);
  const [pestDoctorPrice, setPestDoctorPrice] = useState(549);

  // Available Time Slots Configuration
  const [availableSlots, setAvailableSlots] = useState([
    { id: 'morning_1', label: '08:00 AM - 10:00 AM', period: 'Morning Slot', active: true },
    { id: 'morning_2', label: '10:00 AM - 12:00 PM', period: 'Midday Slot', active: true },
    { id: 'afternoon_1', label: '01:00 PM - 03:00 PM', period: 'Afternoon Slot', active: true },
    { id: 'afternoon_2', label: '03:00 PM - 05:00 PM', period: 'Evening Slot', active: true },
    { id: 'evening_1', label: '05:00 PM - 07:00 PM', period: 'Twilight Slot', active: false }
  ]);

  const [availableDays, setAvailableDays] = useState<{ [key: string]: boolean }>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: false
  });

  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Product Add / Edit Modal & Inline States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'indoor' as ProductCategory,
    price: 399,
    originalPrice: 499,
    stock: 20,
    image: '/assets/plants/peace_lily.jpg',
    description: '',
    care: {
      sunlight: 'Bright Indirect' as const,
      water: 'Weekly' as const,
      difficulty: 'Beginner' as const,
      petFriendly: true
    }
  });

  // Inline product editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  // Verification document submit state
  const [docCertNumber, setDocCertNumber] = useState(currentGardener.certificateName || 'NHB-HORT-2023-9941');
  const [docYears, setDocYears] = useState(currentGardener.experienceYears || 8);
  const [docSpecialty, setDocSpecialty] = useState('Terrace Lawns, Bonsai Shaping & Balcony Irrigation');
  const [docSubmittedAlert, setDocSubmittedAlert] = useState(false);

  // Total Earnings Calculation
  const totalServiceEarnings = completedBookings.reduce((sum, b) => sum + b.price, 0);
  const platformFee = Math.round(totalServiceEarnings * 0.1);
  const netEarnings = totalServiceEarnings - platformFee;

  const handleToggleSlot = (id: string) => {
    setAvailableSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, active: !slot.active } : slot))
    );
  };

  const handleToggleDay = (day: string) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleSaveServiceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    currentGardener.hourlyRate = Number(hourlyRate);
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    addProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice),
      stock: Number(newProductForm.stock),
      image: newProductForm.image,
      description:
        newProductForm.description ||
        'Certified horticultural nursery specimen cultivated with nutrient-rich organic compost.',
      care: newProductForm.care,
      nurseryId: currentGardener.id,
      nurseryName: currentGardener.fullName + ' Nursery Cultivations'
    });

    setIsAddProductOpen(false);
    setNewProductForm({
      name: '',
      category: 'indoor',
      price: 399,
      originalPrice: 499,
      stock: 20,
      image: '/assets/plants/peace_lily.jpg',
      description: '',
      care: {
        sunlight: 'Bright Indirect',
        water: 'Weekly',
        difficulty: 'Beginner',
        petFriendly: true
      }
    });
  };

  const handleSaveInlineProduct = (id: string) => {
    updateProduct(id, {
      price: Number(editPriceValue),
      stock: Number(editStockValue)
    });
    setEditingProductId(null);
  };

  const handleSubmitVerificationDocs = (e: React.FormEvent) => {
    e.preventDefault();
    currentGardener.certificateName = docCertNumber;
    currentGardener.experienceYears = Number(docYears);
    setDocSubmittedAlert(true);
    setTimeout(() => setDocSubmittedAlert(false), 3500);
  };

  return (
    <div className="min-h-screen text-stone-100 pb-20">
      {/* Top Navigation Bar with Dark Botanical Glass Styling */}
      <header className="sticky top-0 z-40 bg-[#07130c]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-amber-400/25 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Return to First Page"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Back to First Page</span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <UrbanoLogo size={36} />
              <div>
                <span className="font-bold text-base font-serif-botanical text-white block leading-tight">
                  Urbano Nursery
                </span>
                <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider block">
                  Gardener & Horticulturist Workspace
                </span>
              </div>
            </div>
          </div>

          {/* Gardener Profile Header & Verification Status Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-sm font-semibold text-white">{currentGardener.fullName}</span>
                {currentGardener.verifiedStatus === 'verified' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-200 bg-amber-950/80 border border-amber-400/40 px-2.5 py-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Verified Horticulturist
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Verification Pending
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300">
                Rate: <strong className="text-amber-300 font-bold">₹{currentGardener.hourlyRate}/visit</strong> · Rating: {currentGardener.rating}★
              </p>
            </div>

            <img
              src={currentGardener.avatar}
              alt={currentGardener.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/plants/peace_lily.jpg';
              }}
            />
          </div>
        </div>

        {/* Tab Navigation Menu strictly for gardener persona */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            {
              id: 'messages',
              label: `Live Messages & Inquiries (${gardenerMessages.length})`,
              icon: MessageSquare,
              badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
            },
            {
              id: 'bookings',
              label: `Service Bookings (${pendingBookings.length} Pending)`,
              icon: Calendar,
              badge: pendingBookings.length > 0 ? pendingBookings.length : null
            },
            {
              id: 'orders',
              label: `Product Orders & Requests (${orders.length})`,
              icon: Package
            },
            {
              id: 'products',
              label: `Manage Product Listings (${products.length})`,
              icon: Sprout
            },
            {
              id: 'services',
              label: 'Service Management & Slots',
              icon: Settings
            },
            {
              id: 'earnings',
              label: 'Earnings & Reports',
              icon: TrendingUp
            },
            {
              id: 'verification',
              label: 'Registration & Verification',
              icon: UserCheck
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = gardenerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setGardenerTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Live Notification & Dispatch Alert Banner */}
        {(unreadMessagesCount > 0 || pendingBookings.length > 0) && (
          <div className="bg-gradient-to-r from-emerald-900/90 via-[#0d2818]/90 to-amber-950/90 border border-emerald-400/50 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="font-bold text-sm text-emerald-200">
                  New Customer Activity: {pendingBookings.length} Pending Booking{pendingBookings.length !== 1 ? 's' : ''} & {gardenerMessages.length} Order/Service Notification{gardenerMessages.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-stone-300">
                  Incoming plant orders and service bookings are updated here in real time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setGardenerTab('messages')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>View Messages ({gardenerMessages.length})</span>
              </button>
              <button
                onClick={() => setGardenerTab('bookings')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Bookings ({pendingBookings.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick KPI Ribbon with slight green & golden yellowish boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
            <div className="flex items-center justify-between text-amber-200/80 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Gross Earnings</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 tabular-nums">
              ₹{(totalServiceEarnings + 14200).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-emerald-300 font-medium mt-1">Platform service revenue</p>
          </div>

          <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/50 shadow-lg">
            <div className="flex items-center justify-between text-amber-200/80 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 tabular-nums">
              {pendingBookings.length}
            </p>
            <p className="text-[10px] text-amber-200 mt-1">Requires immediate response</p>
          </div>

          <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
            <div className="flex items-center justify-between text-amber-200/80 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Visits</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 tabular-nums">
              {activeBookings.length}
            </p>
            <p className="text-[10px] text-emerald-300 mt-1">Confirmed home appointments</p>
          </div>

          <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
            <div className="flex items-center justify-between text-amber-200/80 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Horticulture Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 tabular-nums">
              {currentGardener.rating} ★
            </p>
            <p className="text-[10px] text-stone-300 mt-1">{currentGardener.completedJobs} verified visits</p>
          </div>
        </div>

        {/* TAB 0: LIVE CUSTOMER MESSAGES, ORDERS & INQUIRIES FEED */}
        {gardenerTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif-botanical flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                    <span>Customer Inquiries, Plant Orders & Service Requests</span>
                    {unreadMessagesCount > 0 && (
                      <span className="bg-amber-500 text-stone-950 text-xs px-2.5 py-0.5 rounded-full font-bold ml-2">
                        {unreadMessagesCount} New
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Live updates when customers order plants, purchase tools, or book home gardening visits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unreadMessagesCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Mark All as Read
                    </button>
                  )}
                  <button
                    onClick={() => setGardenerTab('orders')}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>All Orders ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => setGardenerTab('bookings')}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>All Bookings ({bookings.length})</span>
                  </button>
                </div>
              </div>

              {/* Message Cards List */}
              {gardenerMessages.length === 0 ? (
                <div className="p-12 text-center bg-[#faf8f5] rounded-2xl border border-stone-200 text-stone-500 text-xs space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto opacity-80" />
                  <p className="text-sm font-bold text-stone-800">Inbox is Clear & Up to Date</p>
                  <p className="text-stone-500">
                    Whenever a customer places an order or submits a service request, an instant notification message will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gardenerMessages.map((msg) => {
                    const isOrder = msg.type === 'order' || msg.title.toLowerCase().includes('order');
                    const isBooking = msg.type === 'booking' || msg.title.toLowerCase().includes('booking') || msg.title.toLowerCase().includes('service');

                    return (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          !msg.isRead
                            ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                            : 'bg-[#faf8f5] border-stone-200/80'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isOrder
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isOrder ? <ShoppingBag className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-stone-900">{msg.title}</h4>
                              <span className="text-[11px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 font-mono">
                                {msg.createdAt}
                              </span>
                              {!msg.isRead && (
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed">{msg.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                          {isBooking && (
                            <button
                              onClick={() => setGardenerTab('bookings')}
                              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>View Booking</span>
                            </button>
                          )}
                          {isOrder && (
                            <button
                              onClick={() => setGardenerTab('orders')}
                              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Manage Order</span>
                            </button>
                          )}
                          {!msg.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(msg.id)}
                              className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: SERVICE BOOKINGS & ACCEPT / REJECT ACTIONS */}
        {gardenerTab === 'bookings' && (
          <div className="space-y-6">
            {/* Pending Booking Requests Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-serif-botanical flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Incoming Service Booking Requests ({pendingBookings.length})
                  </h2>
                  <p className="text-xs text-stone-600">
                    Accept or reject customer home gardening, lawn mowing, and pruning requests.
                  </p>
                </div>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="p-8 text-center bg-[#faf8f5] rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                  No pending requests right now. All home visits have been confirmed or completed!
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 bg-[#faf8f5] border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                            #{b.id}
                          </span>
                          <span className="font-bold text-stone-900 text-base font-serif-botanical">
                            {b.serviceTitle}
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                            ₹{b.price}
                          </span>
                        </div>

                        <p className="text-xs text-stone-700">
                          Customer: <strong className="text-stone-900">{b.customerName}</strong> · Phone:{' '}
                          <a href={`tel:${b.customerPhone}`} className="text-emerald-700 font-semibold underline">
                            {b.customerPhone}
                          </a>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-stone-600 flex-wrap">
                          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{b.date}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 text-stone-600">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{b.timeSlot}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 text-stone-600">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>
                              {b.address}, {b.city}
                            </span>
                          </span>
                        </div>

                        {b.notes && (
                          <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
                            Customer Instructions: "{b.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Service</span>
                        </button>

                        <button
                          onClick={() => updateBookingStatus(b.id, 'rejected')}
                          className="px-3.5 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmed / Active Appointments List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-stone-900 font-serif-botanical flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                Active Confirmed Appointments ({activeBookings.length})
              </h2>

              {activeBookings.length === 0 ? (
                <div className="p-6 text-center bg-[#faf8f5] rounded-2xl text-stone-500 text-xs border border-stone-200">
                  No active appointments right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-[#faf8f5] rounded-2xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-stone-500">#{b.id}</span>
                          <span className="font-bold text-stone-900 text-sm">{b.serviceTitle}</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            {b.status === 'in_progress' ? 'Service In Progress' : 'Confirmed'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600">
                          Client: <strong className="text-stone-900">{b.customerName}</strong> ({b.customerPhone}) · Address: {b.address},{' '}
                          {b.city}
                        </p>

                        <p className="text-xs text-emerald-800 font-semibold mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {b.date} · {b.timeSlot}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'in_progress')}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
                          >
                            Start Service
                          </button>
                        )}
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Completed</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PRODUCT LISTINGS (PRICING & STOCK AVAILABILITY) */}
        {gardenerTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                  Manage Product Listings
                </h2>
                <p className="text-xs text-stone-600">
                  Manage plants, soil, pots, and gardening products. Update pricing and stock availability in real time.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product Listing</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#faf8f5] text-stone-600 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock Units</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const isEditing = editingProductId === p.id;
                    const inStock = p.stock > 0;
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-sm">{p.name}</p>
                              <p className="text-[10px] text-stone-500 italic">{p.botanicalName || p.category}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 capitalize text-stone-700">
                          {p.category}
                        </td>

                        {/* Price column with inline editing */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-white border border-emerald-600 rounded text-stone-900 text-xs font-bold"
                            />
                          ) : (
                            <span className="font-bold text-emerald-800 text-sm">₹{p.price}</span>
                          )}
                        </td>

                        {/* Stock count column with inline editing */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-emerald-600 rounded text-stone-900 text-xs font-bold"
                            />
                          ) : (
                            <span className="font-medium text-stone-700">{p.stock} in stock</span>
                          )}
                        </td>

                        {/* Stock availability toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              inStock
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-700 border-rose-300'
                            }`}
                          >
                            {inStock ? '● In Stock' : '○ Out of Stock'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveInlineProduct(p.id)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingProductId(p.id);
                                setEditPriceValue(p.price);
                                setEditStockValue(p.stock);
                              }}
                              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                              title="Edit Price & Stock"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal Form */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-stone-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-serif-botanical text-stone-900">
                      Add New Product Listing
                    </h3>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Product / Plant Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newProductForm.name}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, name: e.target.value })
                        }
                        placeholder="e.g. Fiddle Leaf Fig Tree"
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Category</label>
                      <select
                        value={newProductForm.category}
                        onChange={(e) =>
                          setNewProductForm({
                            ...newProductForm,
                            category: e.target.value as ProductCategory
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 focus:outline-emerald-600"
                      >
                        <option value="indoor">Indoor Plants</option>
                        <option value="outdoor">Outdoor Plants</option>
                        <option value="flowering">Flowering Plants</option>
                        <option value="seeds">Seeds & Bulbs</option>
                        <option value="pots">Pots & Planters</option>
                        <option value="tools">Gardening Tools</option>
                        <option value="soil">Soil & Fertilizers</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={newProductForm.price}
                          onChange={(e) =>
                            setNewProductForm({
                              ...newProductForm,
                              price: Number(e.target.value)
                            })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          value={newProductForm.originalPrice}
                          onChange={(e) =>
                            setNewProductForm({
                              ...newProductForm,
                              originalPrice: Number(e.target.value)
                            })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Initial Stock
                        </label>
                        <input
                          type="number"
                          value={newProductForm.stock}
                          onChange={(e) =>
                            setNewProductForm({
                              ...newProductForm,
                              stock: Number(e.target.value)
                            })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProductForm.image}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, image: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Plant Description & Botanical Profile
                      </label>
                      <textarea
                        rows={2}
                        value={newProductForm.description}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, description: e.target.value })
                        }
                        placeholder="Nursery details, air purification benefits..."
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                      >
                        Publish Listing
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICE MANAGEMENT & AVAILABLE SLOTS */}
        {gardenerTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Service Management & Available Time Slots
              </h2>
              <p className="text-xs text-stone-600">
                Configure your service rates, available working days, and time slots for home visits.
              </p>
            </div>

            {settingsSavedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Service rates and slots have been saved and updated for customer bookings.
              </div>
            )}

            <form onSubmit={handleSaveServiceSettings} className="space-y-6">
              {/* Service Pricing Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Home Gardening (Hourly)
                  </label>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-800">
                    <span>₹</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500">Basic lawn care & watering</p>
                </div>

                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Lawn Maintenance & Mowing
                  </label>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-800">
                    <span>₹</span>
                    <input
                      type="number"
                      value={lawnServicePrice}
                      onChange={(e) => setLawnServicePrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500">Full equipment & trimming visit</p>
                </div>

                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Plant Care & Pruning
                  </label>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-800">
                    <span>₹</span>
                    <input
                      type="number"
                      value={pruningServicePrice}
                      onChange={(e) => setPruningServicePrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500">Topiary, deadheading, shaping</p>
                </div>

                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Plant Doctor & Soil Health
                  </label>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-800">
                    <span>₹</span>
                    <input
                      type="number"
                      value={pestDoctorPrice}
                      onChange={(e) => setPestDoctorPrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500">Pest remediation & organic feed</p>
                </div>
              </div>

              {/* Available Days Selector */}
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Available Working Days
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(availableDays).map((day) => {
                    const isAvailable = availableDays[day];
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isAvailable
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-white text-stone-500 border border-stone-300'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Toggle */}
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200 space-y-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Configured Daily Time Slots
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleToggleSlot(slot.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        slot.active
                          ? 'bg-emerald-50 border-emerald-300 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-500'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{slot.label}</p>
                        <p className="text-[10px] text-stone-500">{slot.period}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slot.active ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {slot.active ? 'Active' : 'Off'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Save Services & Slots Configuration
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: VIEW ORDERS & SERVICE REQUESTS */}
        {gardenerTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Product Orders & Customer Requests
              </h2>
              <p className="text-xs text-stone-600">
                Track plants and gardening products ordered through your nursery or fulfilled via platform inventory.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <span className="font-mono text-xs text-stone-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                        #{o.id}
                      </span>
                      <span className="text-xs text-stone-500 ml-2">Ordered on {o.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-600">
                        Total: <strong className="text-emerald-800 font-bold">₹{o.total}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                    <p>
                      Customer: <strong className="text-stone-900">{o.customerName}</strong> ({o.customerPhone})
                    </p>
                    <p>
                      Delivery Address: {o.deliveryAddress}, {o.city}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-stone-500 uppercase">Items:</p>
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-stone-800">
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-mono font-bold text-emerald-800">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Status Action */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    {o.status === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'confirmed')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Confirm Order
                      </button>
                    )}
                    {o.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'packed')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Pack for Dispatch
                      </button>
                    )}
                    {o.status === 'packed' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'out_for_delivery')}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Dispatch via Eco-Courier
                      </button>
                    )}
                    {o.status === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'delivered')}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Confirm Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EARNINGS & BOOKING REPORTS */}
        {gardenerTab === 'earnings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Earnings & Booking Reports
              </h2>
              <p className="text-xs text-stone-600">
                Detailed financial accounting of completed horticulture visits and product sales payouts.
              </p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200">
                <p className="text-xs font-semibold text-stone-500">Total Gross Service Revenue</p>
                <p className="text-3xl font-bold text-stone-900 mt-1">
                  ₹{(totalServiceEarnings + 14200).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500 mt-1">From completed customer visits</p>
              </div>

              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200">
                <p className="text-xs font-semibold text-stone-500">Platform Commission (10%)</p>
                <p className="text-3xl font-bold text-amber-800 mt-1">
                  -₹{(platformFee + 1420).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500 mt-1">Covers insurance & platform hosting</p>
              </div>

              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-800">Net Take-Home Payout</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">
                  ₹{(netEarnings + 12780).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-700 mt-1">Disbursed weekly to linked UPI</p>
              </div>
            </div>

            {/* Completed Visits Ledger */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Completed Bookings Ledger</h3>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-xs text-stone-800">
                  <thead className="bg-[#faf8f5] text-stone-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Fee (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {completedBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70">
                        <td className="py-2.5 px-3">{b.date}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{b.serviceTitle}</td>
                        <td className="py-2.5 px-3">{b.customerName}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">Completed</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                          ₹{b.price}
                        </td>
                      </tr>
                    ))}
                    {completedBookings.length === 0 && (
                      <>
                        <tr className="hover:bg-stone-50/70">
                          <td className="py-2.5 px-3">2026-10-20</td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900">
                            Balcony Organic Garden Setup
                          </td>
                          <td className="py-2.5 px-3">Priya Sharma</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">Completed</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                            ₹2,499
                          </td>
                        </tr>
                        <tr className="hover:bg-stone-50/70">
                          <td className="py-2.5 px-3">2026-10-18</td>
                          <td className="py-2.5 px-3 font-semibold text-stone-900">
                            Lawn Mowing & Edge Trimming
                          </td>
                          <td className="py-2.5 px-3">Vikram Malhotra</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">Completed</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                            ₹699
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REGISTRATION & VERIFICATION */}
        {gardenerTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Gardener Registration & Horticulture Verification
              </h2>
              <p className="text-xs text-stone-600">
                Urbano Nursery only displays the Verified Badge for gardeners certified by the National Horticulture Board or recognized botanical institutions.
              </p>
            </div>

            {docSubmittedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Updated credentials submitted successfully to Platform Administration for auditing.
              </div>
            )}

            {/* Current Status Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-base">Accreditation Status:</span>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                      Active Verified Badge
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Certificate: <strong>{currentGardener.certificateName}</strong> · Valid through Dec 2028
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-stone-500">Experience Documented</p>
                <p className="text-lg font-bold text-stone-900">{currentGardener.experienceYears} Years Field Practice</p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmitVerificationDocs} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-2">
                Update Horticultural Certifications & Bio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Certification Body & Certificate No.
                  </label>
                  <input
                    type="text"
                    required
                    value={docCertNumber}
                    onChange={(e) => setDocCertNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Years of Professional Practice
                  </label>
                  <input
                    type="number"
                    required
                    value={docYears}
                    onChange={(e) => setDocYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Specialization (e.g. Bonsai, Hydroponics, Balcony Lawns, Organic Composting)
                </label>
                <input
                  type="text"
                  required
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div className="p-4 bg-[#faf8f5] border border-dashed border-stone-300 rounded-2xl text-center space-y-2">
                <Upload className="w-6 h-6 text-emerald-700 mx-auto" />
                <p className="text-xs text-stone-700 font-medium">
                  Upload Government ID or NHB Certificate PDF/Scan
                </p>
                <p className="text-[10px] text-stone-500">Supported: PDF, JPG, PNG up to 10MB</p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Submit Accreditation Review
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, BookingStatus, Product, ProductCategory } from '../types';
import { UrbanoLogo } from './UrbanoLogo';
import { ProductImage } from './ProductImage';
import {
  ShieldAlert,
  ArrowLeft,
  TrendingUp,
  Award,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  Edit2,
  Plus,
  Search,
  Check,
  Building2,
  Users,
  ShieldCheck,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  Truck,
  UserCheck,
  Tag,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  UploadCloud,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminModulePage: React.FC = () => {
  const {
    nurseries,
    updateNurseryStatus,
    gardeners,
    updateGardenerStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    orders,
    updateOrderStatus,
    bookings,
    updateBookingStatus,
    complaints,
    updateComplaintStatus,
    allUsers,
    setActiveTab,
    approveProductImage,
    rejectProductImage,
    removeProductImage,
    assignProductImage,
    resetToMasterCatalogue,
    missingImagesCount,
    verifiedImagesCount
  } = useApp();

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'orders' | 'images' | 'products' | 'verification' | 'analytics' | 'complaints'>('orders');

  // Image Approval & Upload Management States
  const [imageApprovalFilter, setImageApprovalFilter] = useState<'all' | 'missing' | 'verified'>('all');
  const [imageCategoryFilter, setImageCategoryFilter] = useState<string>('all');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [selectedUploadProductId, setSelectedUploadProductId] = useState<string>('');
  const [uploadFilePreview, setUploadFilePreview] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showNotificationMsg = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleImageFileSelected = (prod: Product, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewProduct(prod);
      setPreviewDataUrl(dataUrl);
      setPreviewModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishImage = () => {
    if (!previewProduct || !previewDataUrl) return;
    approveProductImage(previewProduct.id, previewDataUrl);
    setPreviewModalOpen(false);
    showNotificationMsg(`Image successfully approved & published for ${previewProduct.name} (${previewProduct.sku})`);
    setPreviewProduct(null);
    setPreviewDataUrl(null);
  };

  const handleRemoveProductImage = (prod: Product) => {
    if (confirm(`Remove image for ${prod.name}? It will revert to "Image coming soon" on the public shop.`)) {
      removeProductImage(prod.id);
      showNotificationMsg(`Image removed for ${prod.name}. Now displaying "Image coming soon".`);
    }
  };

  // Sub-tabs for monitoring (Orders vs Service Bookings)
  const [monitoringSubTab, setMonitoringSubTab] = useState<'orders' | 'delivery' | 'bookings'>('orders');

  // Resolution text inputs by complaint ID
  const [resolutionInput, setResolutionInput] = useState<{ [key: string]: string }>({});

  // Product management & Gardener attribution filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [selectedGardenerFilter, setSelectedGardenerFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Indoor Plants' as ProductCategory,
    price: 499,
    originalPrice: 699,
    stock: 25,
    image: '/assets/plants/peace_lily.jpg',
    description: '',
    uploadedByGardener: 'Ramesh Kumar (Master Horticulturist)',
    care: {
      sunlight: 'Bright Indirect' as const,
      water: 'Weekly' as const,
      difficulty: 'Beginner' as const,
      petFriendly: true
    }
  });

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Customer order search filter
  const [customerOrderSearch, setCustomerOrderSearch] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<'all' | 'delivered' | 'out_for_delivery' | 'pending'>('all');

  // Derived Platform Metrics
  const totalProductSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalServicesRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const platformGMV = totalProductSales + totalServicesRevenue;
  const platformCommissionRevenue = Math.round(platformGMV * 0.1);

  const pendingNurseries = nurseries.filter((n) => n.verifiedStatus === 'pending');
  const pendingGardeners = gardeners.filter((g) => g.verifiedStatus === 'pending');
  const totalPendingVerifications = pendingNurseries.length + pendingGardeners.length;

  const openComplaints = complaints.filter((c) => c.status !== 'resolved');

  // Delivery breakdown
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const inTransitOrders = orders.filter((o) => o.status === 'out_for_delivery' || o.status === 'packed');
  const processingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'confirmed');

  // Map each product to its uploading gardener/nursery for clear attribution
  const getProductUploader = (p: Product) => {
    // Check if nursery exists
    const nursery = nurseries.find((n) => n.id === p.nurseryId);
    if (nursery) {
      return {
        name: nursery.businessName,
        type: 'Nursery Cultivator',
        location: `${nursery.location}, ${nursery.city}`,
        avatar: nursery.image,
        isVerified: nursery.verifiedStatus === 'verified'
      };
    }
    // Check if gardener exists
    const gardener = gardeners.find((g) => g.id === p.nurseryId || p.nurseryName.includes(g.fullName));
    if (gardener) {
      return {
        name: gardener.fullName,
        type: 'Certified Horticulturist',
        location: gardener.serviceAreas[0] || 'Delhi-NCR',
        avatar: gardener.avatar,
        isVerified: gardener.verifiedStatus === 'verified'
      };
    }
    return {
      name: p.nurseryName || 'Ramesh Kumar (Horticulturist)',
      type: 'Verified Partner',
      location: 'Bengaluru Greenhouse Sector 4',
      avatar: '/assets/plants/peace_lily.jpg',
      isVerified: true
    };
  };

  // Filtered Products for Catalog Management with Gardener attribution filter
  const filteredProducts = products.filter((p) => {
    const uploader = getProductUploader(p);
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      uploader.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'all' ||
      p.category.toLowerCase() === productCategoryFilter.toLowerCase() ||
      p.category.toLowerCase().includes(productCategoryFilter.toLowerCase());
    const matchesGardener =
      selectedGardenerFilter === 'all' || uploader.name === selectedGardenerFilter;
    return matchesSearch && matchesCategory && matchesGardener;
  });

  // Filtered Orders for Customer & Delivery Tracking
  const filteredOrders = orders.filter((o) => {
    const matchesCustomer =
      o.customerName.toLowerCase().includes(customerOrderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(customerOrderSearch.toLowerCase()) ||
      o.customerPhone.includes(customerOrderSearch) ||
      o.items.some((item) => item.productName.toLowerCase().includes(customerOrderSearch.toLowerCase()));

    const matchesDelivery =
      deliveryStatusFilter === 'all' ||
      (deliveryStatusFilter === 'delivered' && o.status === 'delivered') ||
      (deliveryStatusFilter === 'out_for_delivery' && (o.status === 'out_for_delivery' || o.status === 'packed')) ||
      (deliveryStatusFilter === 'pending' && (o.status === 'placed' || o.status === 'confirmed'));

    return matchesCustomer && matchesDelivery;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    addProduct({
      sku: 'PRD-' + Math.floor(100 + Math.random() * 900),
      currency: 'INR',
      imageUrl: newProduct.image,
      imageVerified: false,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice),
      stock: Number(newProduct.stock),
      image: newProduct.image,
      description: newProduct.description || 'Premium botanical nursery specimen curated by platform horticulturists.',
      care: newProduct.care,
      nurseryId: nurseries[0]?.id || 'nursery-1',
      nurseryName: newProduct.uploadedByGardener || nurseries[0]?.businessName || 'GreenRoots Nursery'
    });

    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      category: 'indoor',
      price: 499,
      originalPrice: 699,
      stock: 25,
      image: '/assets/plants/peace_lily.jpg',
      description: '',
      uploadedByGardener: 'Ramesh Kumar (Master Horticulturist)',
      care: {
        sunlight: 'Bright Indirect',
        water: 'Weekly',
        difficulty: 'Beginner',
        petFriendly: true
      }
    });
  };

  const handleSaveInlineEdit = (id: string) => {
    updateProduct(id, {
      price: Number(editPrice),
      stock: Number(editStock)
    });
    setEditingId(null);
  };

  const handleResolveComplaint = (id: string) => {
    const note = resolutionInput[id] || 'Customer issue resolved with full replacement credit.';
    updateComplaintStatus(id, 'resolved', note);
  };

  // List of unique uploaders for filter dropdown
  const uniqueUploaders = Array.from(new Set(products.map((p) => getProductUploader(p).name)));

  return (
    <div className="min-h-screen text-stone-100 pb-20">
      {/* Top Admin Header with Dark Botanical Glass Styling */}
      <header className="sticky top-0 z-40 bg-[#07130c]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-sm"
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
                  Platform Administration Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {totalPendingVerifications > 0 && (
              <button
                onClick={() => setAdminTab('verification')}
                className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{totalPendingVerifications} Pending Accreditations</span>
              </button>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">Master Administrator</span>
              <span className="text-[10px] text-emerald-400 font-medium block">PIN: 1234 · All Privileges</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu with Dark Glass Accents */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            {
              id: 'orders',
              label: `Customer Orders & Delivery (${orders.length})`,
              icon: Truck
            },
            {
              id: 'images',
              label: `Image Approval & Upload (${missingImagesCount} Missing)`,
              icon: ImageIcon,
              badge: missingImagesCount > 0 ? `${missingImagesCount} Awaiting` : null
            },
            {
              id: 'products',
              label: `Gardener Uploads & Catalog (${products.length})`,
              icon: Package
            },
            {
              id: 'verification',
              label: `Approve Nurseries & Gardeners (${totalPendingVerifications})`,
              icon: Award,
              badge: totalPendingVerifications > 0 ? totalPendingVerifications : null
            },
            {
              id: 'analytics',
              label: 'Platform Analytics & Revenue',
              icon: TrendingUp
            },
            {
              id: 'complaints',
              label: `Complaints & Disputes (${openComplaints.length})`,
              icon: AlertCircle,
              badge: openComplaints.length > 0 ? openComplaints.length : null
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/60'
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

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* =========================================================================
            FEATURE 1: WHICH CUSTOMER HAS ORDERED WHAT & WHETHER PROPERLY DELIVERED
           ========================================================================= */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Delivery Statistics Ribbon (Highlighted with slight green & golden yellowish boxes) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 tabular-nums">{orders.length}</p>
                <p className="text-[10px] text-stone-300 mt-1">Total customer transactions</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/50 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Properly Delivered</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 tabular-nums">{deliveredOrders.length}</p>
                <p className="text-[10px] text-emerald-300 font-medium mt-1">Verified delivery confirmation</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Out for Delivery</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 tabular-nums">{inTransitOrders.length}</p>
                <p className="text-[10px] text-amber-200 font-medium mt-1">En-route via eco-courier</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Delivery Success</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 tabular-nums">98.4%</p>
                <p className="text-[10px] text-stone-300 mt-1">Zero transit damage guarantee</p>
              </div>
            </div>

            {/* Filter and Search Bar for Customer Orders */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                    Customer Orders & Item Delivery Audit
                  </h2>
                  <p className="text-xs text-stone-600">
                    Track exactly which customer has ordered what items, inspect fulfilling gardeners, and verify whether items are properly delivered.
                  </p>
                </div>

                {/* Delivery Status Filter Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                  <button
                    onClick={() => setDeliveryStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                      deliveryStatusFilter === 'all'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setDeliveryStatusFilter('delivered')}
                    className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                      deliveryStatusFilter === 'delivered'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Delivered ({deliveredOrders.length})
                  </button>
                  <button
                    onClick={() => setDeliveryStatusFilter('out_for_delivery')}
                    className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                      deliveryStatusFilter === 'out_for_delivery'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    In Transit ({inTransitOrders.length})
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerOrderSearch}
                  onChange={(e) => setCustomerOrderSearch(e.target.value)}
                  placeholder="Search by customer name, email, phone, or specific ordered plant (e.g. 'Aarav' or 'Monstera')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                />
              </div>

              {/* Order Cards with Detailed Customer Breakdown & Delivery Status */}
              <div className="space-y-4 pt-2">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center bg-[#faf8f5] rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No orders match your search criteria.
                  </div>
                ) : (
                  filteredOrders.map((o) => {
                    const isDelivered = o.status === 'delivered';
                    const isOutForDelivery = o.status === 'out_for_delivery' || o.status === 'packed';

                    return (
                      <div
                        key={o.id}
                        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                          isDelivered
                            ? 'bg-white border-emerald-200/90 shadow-xs'
                            : isOutForDelivery
                            ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                            : 'bg-white border-stone-200/90 shadow-xs'
                        }`}
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200/70 pb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                              Order #{o.id}
                            </span>
                            <span className="text-xs text-stone-500">Ordered: {o.createdAt}</span>

                            {/* Delivery Verification Badge */}
                            {isDelivered ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Properly Delivered</span>
                              </span>
                            ) : isOutForDelivery ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <Truck className="w-3.5 h-3.5 text-amber-700" />
                                <span>Out for Delivery (In Transit)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300 capitalize">
                                <Clock className="w-3.5 h-3.5 text-stone-600" />
                                <span>{o.status}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-stone-500">Order Total:</span>
                            <span className="text-base font-bold text-emerald-800 tabular-nums">
                              ₹{o.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Customer Information Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs bg-[#faf8f5] rounded-xl px-4 my-4 border border-stone-200/60">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                              Customer Details
                            </span>
                            <p className="font-bold text-stone-900 text-sm">{o.customerName}</p>
                            <p className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-stone-400" />
                              <span>{o.customerEmail}</span>
                            </p>
                            <p className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <a href={`tel:${o.customerPhone}`} className="text-emerald-700 font-semibold hover:underline">
                                {o.customerPhone}
                              </a>
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                              Destination Address
                            </span>
                            <p className="text-stone-800 font-medium leading-relaxed">
                              {o.deliveryAddress}
                            </p>
                            <p className="text-stone-500 mt-1 font-semibold">City: {o.city}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                              Delivery & Payment Verification
                            </span>
                            <p className="text-stone-700">
                              Payment: <strong className="uppercase font-mono text-stone-900">{o.paymentMethod}</strong> (Paid)
                            </p>
                            <p className="text-stone-700 mt-0.5">
                              Estimated: <strong className="text-stone-900">{o.estimatedDelivery}</strong>
                            </p>
                            <p className="text-stone-700 mt-0.5">
                              Verification:{' '}
                              <strong className={isDelivered ? 'text-emerald-700' : 'text-amber-700'}>
                                {isDelivered ? '✓ Recipient Confirmed' : '🚚 In Courier Hands'}
                              </strong>
                            </p>
                          </div>
                        </div>

                        {/* Ordered Items Detailed Matrix ("Which customer has ordered what") */}
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Ordered Botanical Items ({o.items.length}):
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {o.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center gap-3 shadow-2xs"
                              >
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-stone-900 text-xs truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-[10px] text-emerald-800 font-medium">
                                    Supplied by: {item.nurseryName}
                                  </p>
                                  <div className="flex items-center justify-between text-xs mt-1">
                                    <span className="text-stone-500">
                                      Qty: <strong className="text-stone-800">{item.quantity}</strong>
                                    </span>
                                    <span className="font-bold text-stone-900">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Admin Delivery Verification & Status Update Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-stone-200/70">
                          <div className="text-xs text-stone-600 flex items-center gap-2">
                            <span>Change Delivery Status:</span>
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-800 font-semibold focus:outline-emerald-600 cursor-pointer shadow-2xs"
                            >
                              <option value="placed">Placed (Order Received)</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="packed">Packed at Greenhouse</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered (Properly Received)</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isDelivered ? (
                              <button
                                onClick={() => updateOrderStatus(o.id, 'delivered')}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verify Item Delivery as Complete</span>
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Delivery Properly Completed & Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE: IMAGE APPROVAL & VERIFICATION MANAGEMENT
           ========================================================================= */}
        {adminTab === 'images' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                  Botanical Image Approval & Catalog Verification
                </h2>
                <p className="text-xs text-stone-600">
                  Every product is matched strictly to its verified botanical photograph. Never display unrelated items or random placeholders.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Restore entire catalog to official master list? All 81 living plants with verified unique botanical photos and 45 essentials will be reloaded.')) {
                      resetToMasterCatalogue();
                      showNotificationMsg('Master catalogue successfully restored: 81 verified unique plant varieties and 45 gardening tools loaded.');
                    }
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold border border-amber-400/40 shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Master Botanical Catalog</span>
                </button>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{verifiedImagesCount} Verified Active</span>
                </span>
                {missingImagesCount > 0 && (
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{missingImagesCount} Awaiting Images</span>
                  </span>
                )}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#faf8f5] rounded-2xl border border-stone-200/70">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => setImageSearchQuery(e.target.value)}
                  placeholder="Search plant or item image..."
                  className="w-full pl-10 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                />
              </div>

              <div>
                <select
                  value={imageCategoryFilter}
                  onChange={(e) => setImageCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-emerald-600 cursor-pointer shadow-2xs"
                >
                  <option value="all">🌿 All Categories ({products.length})</option>
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Outdoor Flowering">Outdoor Flowering</option>
                  <option value="Fruit Plants">Fruit Trees & Plants</option>
                  <option value="Composts & Care">Composts, Fertilizers & Care Oils</option>
                  <option value="Gardening Tools">Gardening Tools</option>
                </select>
              </div>

              <div>
                <select
                  value={imageApprovalFilter}
                  onChange={(e) => setImageApprovalFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-emerald-600 cursor-pointer shadow-2xs"
                >
                  <option value="all">🖼️ All Image Statuses ({products.length})</option>
                  <option value="verified">✓ Verified Images Only ({verifiedImagesCount})</option>
                  <option value="missing">⚠️ Missing / Placeholder Only ({missingImagesCount})</option>
                </select>
              </div>
            </div>

            {/* Products Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter((p) => {
                  const matchesSearch =
                    p.name.toLowerCase().includes(imageSearchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(imageSearchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(imageSearchQuery.toLowerCase());
                  const matchesCategory =
                    imageCategoryFilter === 'all' ||
                    p.category.toLowerCase().includes(imageCategoryFilter.toLowerCase());
                  const matchesStatus =
                    imageApprovalFilter === 'all' ||
                    (imageApprovalFilter === 'verified' && p.imageVerified && p.imageUrl) ||
                    (imageApprovalFilter === 'missing' && (!p.imageVerified || !p.imageUrl));
                  return matchesSearch && matchesCategory && matchesStatus;
                })
                .map((p) => {
                  const isVerified = p.imageVerified && !!p.imageUrl;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                        <ProductImage
                          product={p}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="font-mono text-[10px] font-bold bg-stone-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                            {p.sku}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Missing</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                            {p.category}
                          </div>
                          <h4 className="font-bold text-xs text-stone-900 line-clamp-1 mt-0.5">{p.name}</h4>
                          <p className="text-[11px] text-stone-500 italic line-clamp-1">
                            {p.botanicalName || 'Cultivated Item'}
                          </p>
                          <p className="text-xs font-bold text-stone-900 mt-1">₹{p.price}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                          <label className="flex-1 text-center py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Replace Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileSelected(p, file);
                              }}
                            />
                          </label>

                          {isVerified && (
                            <button
                              onClick={() => handleRemoveProductImage(p)}
                              title="Reset to clean placeholder"
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Image Preview & Publish Confirmation Modal */}
            {previewModalOpen && previewProduct && previewDataUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-stone-900">Approve Botanical Photo</h3>
                      <p className="text-xs text-stone-500">
                        {previewProduct.name} ({previewProduct.sku})
                      </p>
                    </div>
                    <button
                      onClick={() => setPreviewModalOpen(false)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                    <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    Publishing will update the product card across all customer views with verified status.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setPreviewModalOpen(false)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishImage}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {adminTab === 'products' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                  Gardener Product Uploads & Catalog Oversight
                </h2>
                <p className="text-xs text-stone-600">
                  Inspect exactly which gardener or nursery has uploaded which item, monitor inventory prices, and edit stock.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Catalog Item</span>
              </button>
            </div>

            {/* Filter by Gardener Dropdown & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#faf8f5] rounded-2xl border border-stone-200/70">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search plant or product name..."
                  className="w-full pl-10 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                />
              </div>

              {/* Gardener Filter */}
              <div>
                <select
                  value={selectedGardenerFilter}
                  onChange={(e) => setSelectedGardenerFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-emerald-600 cursor-pointer shadow-2xs"
                >
                  <option value="all">👨‍🌾 All Contributing Gardeners & Nurseries</option>
                  {uniqueUploaders.map((uploaderName) => (
                    <option key={uploaderName} value={uploaderName}>
                      {uploaderName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 font-semibold focus:outline-emerald-600 cursor-pointer shadow-2xs capitalize"
                >
                  <option value="all">🌿 All Categories (47)</option>
                  <option value="Indoor Plants">Indoor Air-Purifying Plants (10)</option>
                  <option value="Outdoor Flowering">Outdoor Flowering Plants (10)</option>
                  <option value="Fruit Plants">Fruit Trees & Plants (10)</option>
                  <option value="Composts & Care">Composts, Fertilizers & Care Oils (10)</option>
                  <option value="Gardening Tools">Gardening Tools & Gear (7)</option>
                </select>
              </div>
            </div>

            {/* Catalog Table with Explicit Gardener Attribution ("Which gardener uploaded which item") */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#faf8f5] text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Plant / Item</th>
                    <th className="py-3.5 px-4">Uploaded By (Gardener / Nursery)</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (₹)</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    const inStock = p.stock > 0;
                    const uploader = getProductUploader(p);

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Item Photo & Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-xs">{p.name}</p>
                              <p className="text-[10px] text-stone-500 italic">
                                {p.botanicalName || 'Cultivated Specimen'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Uploader Attribution Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={uploader.avatar}
                              alt={uploader.name}
                              className="w-8 h-8 rounded-full object-cover border border-emerald-300 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 text-xs">{uploader.name}</span>
                                {uploader.isVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500 block">{uploader.type}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-white border border-emerald-600 rounded text-xs font-bold text-stone-900"
                            />
                          ) : (
                            <span className="font-bold text-emerald-800 text-sm">₹{p.price}</span>
                          )}
                        </td>

                        {/* Stock Units */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-white border border-emerald-600 rounded text-xs text-stone-900"
                            />
                          ) : (
                            <span className="font-medium text-stone-700">{p.stock} units</span>
                          )}
                        </td>

                        {/* In Stock Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                              inStock
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {inStock ? '● In Stock' : '○ Out of Stock'}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveInlineEdit(p.id)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditPrice(p.price);
                                  setEditStock(p.stock);
                                }}
                                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 cursor-pointer"
                                title="Edit Price / Stock"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-stone-400 hover:text-rose-600 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-stone-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-serif-botanical text-stone-900">
                      Add New Catalog Listing
                    </h3>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. Variegated Monstera Albo"
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Category</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })
                          }
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 focus:outline-emerald-600"
                        >
                          <option value="Indoor Plants">Indoor Plants</option>
                          <option value="Outdoor Flowering">Outdoor Flowering</option>
                          <option value="Fruit Plants">Fruit Trees & Plants</option>
                          <option value="Composts & Care">Composts, Fertilizers & Care Oils</option>
                          <option value="Gardening Tools">Gardening Tools</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Uploading Gardener / Nursery
                        </label>
                        <select
                          value={newProduct.uploadedByGardener}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, uploadedByGardener: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900 focus:outline-emerald-600"
                        >
                          <option value="Ramesh Kumar (Master Horticulturist)">Ramesh Kumar (Gardener)</option>
                          <option value="Priya Sharma (Specialist)">Priya Sharma (Gardener)</option>
                          <option value="GreenRoots Botanical Haven">GreenRoots Nursery</option>
                          <option value="Vedic Flora & Herbs">Vedic Flora Nursery</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, price: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">MRP (₹)</label>
                        <input
                          type="number"
                          value={newProduct.originalPrice}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              originalPrice: Number(e.target.value)
                            })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Initial Stock</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, description: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-stone-900"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                      >
                        Save to Master Catalog
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            FEATURE 3: PARTNER ACCREDITATION & VERIFICATION
           ========================================================================= */}
        {adminTab === 'verification' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Partner Accreditation & Verification Queue
              </h2>
              <p className="text-xs text-stone-600">
                Audit submitted horticulture degrees, NHB certificates, and nursery trade licenses to grant the verified badge.
              </p>
            </div>

            {/* Gardeners Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                Gardening Professionals & Horticulturists ({gardeners.length})
              </h3>

              <div className="space-y-3">
                {gardeners.map((g) => (
                  <div
                    key={g.id}
                    className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={g.avatar}
                        alt={g.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">{g.fullName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              g.verifiedStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : g.verifiedStatus === 'rejected'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {g.verifiedStatus === 'verified'
                              ? '✓ Verified Horticulturist'
                              : g.verifiedStatus === 'rejected'
                              ? '✗ Rejected'
                              : '⏳ Pending Review'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-1">
                          Certificate: <strong>{g.certificateName}</strong> · Experience: {g.experienceYears} Years
                        </p>

                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Specialities: {g.specialties.join(', ')} · Service Areas: {g.serviceAreas.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {g.verifiedStatus !== 'verified' ? (
                        <button
                          onClick={() => updateGardenerStatus(g.id, 'verified')}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Approve & Grant Badge</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Verified Active
                        </span>
                      )}

                      {g.verifiedStatus !== 'rejected' && (
                        <button
                          onClick={() => updateGardenerStatus(g.id, 'rejected')}
                          className="px-3 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-600 text-xs font-semibold rounded-xl border border-stone-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nurseries Section */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Accredited Cultivation Nurseries ({nurseries.length})
              </h3>

              <div className="space-y-3">
                {nurseries.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 bg-[#faf8f5] rounded-2xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={n.image}
                        alt={n.businessName}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">{n.businessName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              n.verifiedStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {n.verifiedStatus === 'verified' ? '✓ Verified Nursery' : '⏳ Pending Review'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-1">
                          License: <strong>{n.licenseNumber}</strong> · Owner: {n.ownerName}
                        </p>

                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Location: {n.location}, {n.city} · Established: {n.establishedYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {n.verifiedStatus !== 'verified' ? (
                        <button
                          onClick={() => updateNurseryStatus(n.id, 'verified')}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Approve Nursery</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Licensed & Live
                        </span>
                      )}

                      {n.verifiedStatus !== 'rejected' && (
                        <button
                          onClick={() => updateNurseryStatus(n.id, 'rejected')}
                          className="px-3 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-600 text-xs font-semibold rounded-xl border border-stone-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 4: PLATFORM ANALYTICS & REVENUE
           ========================================================================= */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-stone-500">Platform GMV</span>
                <p className="text-3xl font-bold text-stone-900 mt-1">₹{platformGMV.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-emerald-700 mt-1">Live customer transactions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-stone-500">Product Sales</span>
                <p className="text-3xl font-bold text-stone-900 mt-1">₹{totalProductSales.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-stone-500 mt-1">Across {orders.length} orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-stone-500">Service Revenue</span>
                <p className="text-3xl font-bold text-stone-900 mt-1">₹{totalServicesRevenue.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-stone-500 mt-1">Across {bookings.length} visits</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-emerald-800">Net Platform Fee (10%)</span>
                <p className="text-3xl font-bold text-emerald-800 mt-1">₹{platformCommissionRevenue.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-emerald-700 mt-1">Platform commission cut</p>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
                <p className="text-xs text-stone-500 font-semibold">Active Customers</p>
                <p className="text-2xl font-bold text-stone-900">{allUsers.length}</p>
                <p className="text-[11px] text-stone-500">Registered home gardening clients</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
                <p className="text-xs text-stone-500 font-semibold">Verified Gardeners</p>
                <p className="text-2xl font-bold text-stone-900">
                  {gardeners.filter((g) => g.verifiedStatus === 'verified').length} / {gardeners.length}
                </p>
                <p className="text-[11px] text-stone-500">Certified horticulturists</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
                <p className="text-xs text-stone-500 font-semibold">Accredited Nurseries</p>
                <p className="text-2xl font-bold text-stone-900">
                  {nurseries.filter((n) => n.verifiedStatus === 'verified').length} / {nurseries.length}
                </p>
                <p className="text-[11px] text-stone-500">Greenhouses & botanical nurseries</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FEATURE 5: COMPLAINTS & DISPUTE DESK
           ========================================================================= */}
        {adminTab === 'complaints' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-botanical">
                Complaints & Disputes Resolution Desk
              </h2>
              <p className="text-xs text-stone-600">
                Customer satisfaction safeguards: investigate damaged plant reports, courier transit delays, and issue immediate solutions.
              </p>
            </div>

            <div className="space-y-4">
              {complaints.map((c) => {
                const isResolved = c.status === 'resolved';
                return (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isResolved
                        ? 'bg-[#faf8f5] border-stone-200 opacity-80'
                        : 'bg-rose-50/50 border-rose-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                          #{c.id}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">{c.subject}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">{c.createdAt}</span>
                    </div>

                    <p className="text-xs text-stone-700 mb-2">
                      Complainant: <strong>{c.userName}</strong> ({c.userRole}) · Category:{' '}
                      <span className="font-mono uppercase text-stone-800">{c.category}</span>
                    </p>

                    <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-xs text-stone-800 mb-3 leading-relaxed">
                      "{c.description}"
                    </div>

                    {isResolved ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Resolution Note: {c.resolutionNotes || 'Case closed by admin.'}</span>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-stone-200">
                        <label className="block text-[11px] text-stone-700 font-semibold">
                          Admin Resolution Action / Free Replacement Confirmation:
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={resolutionInput[c.id] || ''}
                            onChange={(e) =>
                              setResolutionInput({ ...resolutionInput, [c.id]: e.target.value })
                            }
                            placeholder="e.g. Free replacement dispatched via priority eco-courier. Refund ₹499."
                            className="flex-1 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-emerald-600"
                          />
                          <button
                            onClick={() => handleResolveComplaint(c.id)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>Resolve & Close Dispute</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

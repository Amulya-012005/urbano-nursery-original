import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Product,
  ProductCategory,
  NurseryProfile,
  GardenerProfile,
  GardeningService,
  CartItem,
  Order,
  OrderStatus,
  Booking,
  BookingStatus,
  AppNotification,
  Review,
  Complaint
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_NURSERIES,
  INITIAL_GARDENERS,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS
} from '../data/initialData';

export type NavigationTab = 
  | 'home' 
  | 'customer' 
  | 'gardener' 
  | 'admin'
  | 'shop' 
  | 'services' 
  | 'about' 
  | 'customer_dash' 
  | 'nursery_dash' 
  | 'gardener_dash' 
  | 'admin_dash';

interface AppContextType {
  // Current user & authentication
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  allUsers: User[];
  loginUser: (email: string, role?: UserRole) => boolean;
  registerUser: (userData: Partial<User>) => User;

  // Catalog data
  products: Product[];
  addProduct: (product: Partial<Product> & { name: string; price: number; category: ProductCategory }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  approveProductImage: (productId: string, imageUrl: string) => void;
  rejectProductImage: (productId: string) => void;
  removeProductImage: (productId: string) => void;
  assignProductImage: (productId: string, imageUrl: string, markApproved?: boolean) => void;
  resetToMasterCatalogue: () => void;
  missingImagesCount: number;
  verifiedImagesCount: number;

  nurseries: NurseryProfile[];
  registerNursery: (data: Omit<NurseryProfile, 'id' | 'rating' | 'reviewCount' | 'verifiedStatus'>) => void;
  updateNurseryStatus: (id: string, status: 'verified' | 'rejected') => void;

  gardeners: GardenerProfile[];
  registerGardener: (data: Omit<GardenerProfile, 'id' | 'rating' | 'reviewCount' | 'verifiedStatus' | 'completedJobs'>) => void;
  updateGardenerStatus: (id: string, status: 'verified' | 'rejected') => void;

  services: GardeningService[];

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders & Bookings
  orders: Order[];
  placeOrder: (data: {
    address: string;
    city: string;
    paymentMethod: 'cod' | 'upi' | 'card';
    phone: string;
    discount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  bookings: Booking[];
  bookGardener: (data: {
    gardenerId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    address: string;
    city: string;
    phone: string;
    notes?: string;
    price: number;
  }) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  unreadNotificationsCount: number;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;

  // Complaints / Support
  complaints: Complaint[];
  fileComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => Complaint;
  updateComplaintStatus: (id: string, status: 'open' | 'investigating' | 'resolved', notes?: string) => void;

  // Navigation & Modals
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  selectedServiceForBooking: GardeningService | null;
  setSelectedServiceForBooking: (service: GardeningService | null) => void;
  selectedGardenerForBooking: GardenerProfile | null;
  setSelectedGardenerForBooking: (gardener: GardenerProfile | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  partnerModalOpen: boolean;
  setPartnerModalOpen: (open: boolean) => void;
  activePartnerType: 'nursery' | 'gardener';
  setActivePartnerType: (type: 'nursery' | 'gardener') => void;
  adminPinModalOpen: boolean;
  setAdminPinModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'urbano_v32_';

// Automatically purge legacy corrupted localStorage from earlier iterations
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('urbano_') && !k.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
} catch {
  // Ignore localStorage errors
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local storage helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      // For products, enforce the exact 126 user items, zero duplicate plant images, and local verified images
      if (key === 'products' && Array.isArray(parsed)) {
        if (parsed.length !== INITIAL_PRODUCTS.length) return fallback;
        if (parsed.some((p: any) => !p.sku || !p.imageUrl)) return fallback;
        // Purge if any item contains unsplash or external URLs or has empty imageUrl
        if (parsed.some((p: any) => !p.imageUrl || p.imageUrl.includes('unsplash') || p.imageUrl.startsWith('http'))) {
          return fallback;
        }
        // Enforce strict uniqueness: every living plant must have a distinct unique image
        const plantImgs = parsed.filter((p: any) => p.department === 'plant').map((p: any) => p.imageUrl);
        if (new Set(plantImgs).size !== plantImgs.length) {
          return fallback;
        }
      }
      return parsed;
    } catch {
      return fallback;
    }
  };

  const [allUsers, setAllUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStored<User | null>('currentUser', null);
    return saved || INITIAL_USERS[0];
  });

  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [nurseries, setNurseries] = useState<NurseryProfile[]>(() => loadStored('nurseries', INITIAL_NURSERIES));
  const [gardeners, setGardeners] = useState<GardenerProfile[]>(() => loadStored('gardeners', INITIAL_GARDENERS));
  const [services] = useState<GardeningService[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<Order[]>(() => loadStored('orders', INITIAL_ORDERS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStored('bookings', INITIAL_BOOKINGS));
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('wishlist', ['prod_ind_1']));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [reviews, setReviews] = useState<Review[]>(() => loadStored('reviews', INITIAL_REVIEWS));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadStored('complaints', INITIAL_COMPLAINTS));

  // Navigation & UI modals
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<GardeningService | null>(null);
  const [selectedGardenerForBooking, setSelectedGardenerForBooking] = useState<GardenerProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [activePartnerType, setActivePartnerType] = useState<'nursery' | 'gardener'>('nursery');
  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}nurseries`, JSON.stringify(nurseries));
  }, [nurseries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}gardeners`, JSON.stringify(gardeners));
  }, [gardeners]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}complaints`, JSON.stringify(complaints));
  }, [complaints]);

  // Auth Helpers
  const switchRole = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'nursery' || role === 'gardener') setActiveTab('gardener');
      else if (role === 'admin') setActiveTab('admin');
      else setActiveTab('customer');
    }
  };

  const loginUser = (email: string, role?: UserRole): boolean => {
    const match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentUser(match);
      return true;
    }
    // Auto-create customer if not existing
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'customer',
      city: 'Mumbai',
      isVerified: true
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'Plant Enthusiast',
      email: userData.email || 'user@example.com',
      role: userData.role || 'customer',
      phone: userData.phone || '+91 99999 00000',
      city: userData.city || 'Mumbai',
      address: userData.address || '',
      avatar: '/assets/plants/peace_lily.jpg',
      isVerified: true
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 79;
  const cartTotal = cartSubtotal + cartDeliveryFee;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Orders
  const placeOrder = (data: {
    address: string;
    city: string;
    paymentMethod: 'cod' | 'upi' | 'card';
    phone: string;
    discount?: number;
  }): Order => {
    const discount = data.discount || 0;
    const finalTotal = Math.max(0, cartTotal - discount);
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: data.phone,
      deliveryAddress: data.address,
      city: data.city,
      items: (cart || []).map(item => ({
        productId: item.product?.id || ('prod_' + Math.random()),
        productName: item.product?.name || 'Botanical Plant',
        price: Number(item.product?.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.product?.imageUrl || item.product?.image || '/assets/plants/peace_lily.jpg',
        nurseryId: item.product?.nurseryId || 'nursery_1',
        nurseryName: item.product?.nurseryName || 'GreenRoots Botanical Haven'
      })),
      subtotal: cartSubtotal,
      discount,
      deliveryFee: cartDeliveryFee,
      total: finalTotal,
      status: 'placed',
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3 - 5 Days'
    };

    // Deduct stock
    setProducts(prev =>
      prev.map(p => {
        const item = cart.find(ci => ci.product.id === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Customer notification
    addNotification({
      userId: currentUser.id,
      title: 'Order Placed Successfully',
      message: `Your order #${newOrder.id} of ₹${newOrder.total} has been confirmed. Plants are being carefully selected.`,
      type: 'order',
      isRead: false
    });

    // Notify ALL Gardeners so their Gardener Page and messages update immediately
    const itemNames = newOrder.items.map(i => `${i.productName} (×${i.quantity})`).join(', ');
    const allGardenerUserIds = Array.from(new Set([
      'user_gardener_1',
      'user_gardener_2',
      ...gardeners.map(g => g.userId)
    ]));

    allGardenerUserIds.forEach(gId => {
      addNotification({
        userId: gId,
        title: `🌱 New Customer Plant Order #${newOrder.id}`,
        message: `${currentUser.name} placed order #${newOrder.id} for: ${itemNames}. Total: ₹${newOrder.total}. Deliver to: ${newOrder.deliveryAddress}, ${newOrder.city}. Contact: ${newOrder.customerPhone}`,
        type: 'order',
        isRead: false
      });
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    const order = orders.find(o => o.id === orderId);
    if (order) {
      addNotification({
        userId: order.customerId,
        title: `Order Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        message: `Order #${order.id} status updated to ${status.replace(/_/g, ' ')}.`,
        type: 'order',
        isRead: false
      });
    }
  };

  // Bookings
  const bookGardener = (data: {
    gardenerId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    address: string;
    city: string;
    phone: string;
    notes?: string;
    price: number;
  }): Booking => {
    const gardener = gardeners.find(g => g.id === data.gardenerId);
    const service = services.find(s => s.id === data.serviceId);

    const newBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: data.phone,
      gardenerId: data.gardenerId,
      gardenerName: gardener ? gardener.fullName : 'Expert Gardener',
      serviceId: data.serviceId,
      serviceTitle: service ? service.title : 'Gardening Service',
      date: data.date,
      timeSlot: data.timeSlot,
      address: data.address,
      city: data.city,
      notes: data.notes,
      price: data.price,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Notify Customer
    addNotification({
      userId: currentUser.id,
      title: 'Appointment Request Submitted',
      message: `Your booking #${newBooking.id} with ${newBooking.gardenerName} for ${newBooking.date} is pending confirmation.`,
      type: 'booking',
      isRead: false
    });

    // Notify ALL Gardeners so the service request immediately appears in their notifications & dashboard
    const allGardenerUserIds = Array.from(new Set([
      gardener?.userId || 'user_gardener_1',
      'user_gardener_1',
      'user_gardener_2',
      ...gardeners.map(g => g.userId)
    ]));

    allGardenerUserIds.forEach(gId => {
      addNotification({
        userId: gId,
        title: `📅 New Service Booking #${newBooking.id}`,
        message: `${currentUser.name} requested "${newBooking.serviceTitle}" on ${newBooking.date} (${newBooking.timeSlot}) at ${newBooking.address}, ${newBooking.city}. Price: ₹${newBooking.price}${newBooking.notes ? ` | Notes: "${newBooking.notes}"` : ''}`,
        type: 'booking',
        isRead: false
      });
    });

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.customerId,
        title: `Appointment ${status.toUpperCase()}`,
        message: `Booking #${booking.id} with ${booking.gardenerName} is now ${status}.`,
        type: 'booking',
        isRead: false
      });
    }
  };

  // Products & Image Approval Management
  const addProduct = (prodData: Partial<Product> & { name: string; price: number; category: ProductCategory }): Product => {
    const rawImg = prodData.imageUrl || prodData.image || "";
    const newProduct: Product = {
      id: prodData.id || ("prod_" + Date.now()),
      sku: prodData.sku || ("PRD-" + Math.floor(100 + Math.random() * 900)),
      name: prodData.name,
      botanicalName: prodData.botanicalName,
      category: prodData.category,
      price: prodData.price,
      currency: "INR",
      originalPrice: prodData.originalPrice || Math.round(prodData.price * 1.3),
      imageUrl: rawImg,
      image: rawImg,
      imageVerified: Boolean(prodData.imageVerified),
      stock: typeof prodData.stock === "number" ? prodData.stock : 25,
      nurseryId: prodData.nurseryId || "nursery_1",
      nurseryName: prodData.nurseryName || "GreenRoots Botanical Haven",
      rating: 5.0,
      reviewCount: 0,
      description: prodData.description || "",
      care: prodData.care,
      isFeatured: Boolean(prodData.isFeatured),
      tags: prodData.tags || [String(prodData.category)],
      uploadedByGardener: prodData.uploadedByGardener
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const approveProductImage = (productId: string, imageUrl: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, imageUrl, image: imageUrl, imageVerified: true }
          : p
      )
    );
  };

  const rejectProductImage = (productId: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, imageVerified: false }
          : p
      )
    );
  };

  const removeProductImage = (productId: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, imageUrl: "", image: "", imageVerified: false }
          : p
      )
    );
  };

  const assignProductImage = (productId: string, imageUrl: string, markApproved = true) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, imageUrl, image: imageUrl, imageVerified: markApproved }
          : p
      )
    );
  };

  const resetToMasterCatalogue = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}products`);
    } catch {
      // ignore
    }
  };

  const missingImagesCount = products.filter(p => !p.imageVerified || !p.imageUrl).length;
  const verifiedImagesCount = products.filter(p => p.imageVerified && p.imageUrl).length;

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 20 } : p))
    );
  };

  // Partner Verification
  const registerNursery = (data: Omit<NurseryProfile, 'id' | 'rating' | 'reviewCount' | 'verifiedStatus'>) => {
    const newNursery: NurseryProfile = {
      ...data,
      id: `nursery_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      verifiedStatus: 'pending'
    };
    setNurseries(prev => [...prev, newNursery]);

    addNotification({
      userId: 'user_admin',
      title: 'New Nursery Application',
      message: `${data.businessName} submitted documents for accreditation.`,
      type: 'verification',
      isRead: false
    });
  };

  const updateNurseryStatus = (id: string, status: 'verified' | 'rejected') => {
    setNurseries(prev =>
      prev.map(n => (n.id === id ? { ...n, verifiedStatus: status } : n))
    );
  };

  const registerGardener = (data: Omit<GardenerProfile, 'id' | 'rating' | 'reviewCount' | 'verifiedStatus' | 'completedJobs'>) => {
    const newGardener: GardenerProfile = {
      ...data,
      id: `gardener_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      completedJobs: 0,
      verifiedStatus: 'pending'
    };
    setGardeners(prev => [...prev, newGardener]);

    addNotification({
      userId: 'user_admin',
      title: 'New Gardener Application',
      message: `${data.fullName} submitted credentials for horticulturist certification.`,
      type: 'verification',
      isRead: false
    });
  };

  const updateGardenerStatus = (id: string, status: 'verified' | 'rejected') => {
    setGardeners(prev =>
      prev.map(g => (g.id === id ? { ...g, verifiedStatus: status } : g))
    );
  };

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter(
    n => n.userId === currentUser.id && !n.isRead
  ).length;

  // Reviews
  const addReview = (rev: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...rev,
      id: `rev_${Date.now()}`,
      createdAt: 'Today'
    };
    setReviews(prev => [newReview, ...prev]);

    // Update target rating
    if (rev.targetType === 'product') {
      setProducts(prev =>
        prev.map(p => {
          if (p.id === rev.targetId) {
            const newCount = p.reviewCount + 1;
            const newRating = Number(((p.rating * p.reviewCount + rev.rating) / newCount).toFixed(1));
            return { ...p, rating: newRating, reviewCount: newCount };
          }
          return p;
        })
      );
    }
  };

  // Complaints
  const fileComplaint = (comp: Omit<Complaint, 'id' | 'createdAt' | 'status'>): Complaint => {
    const newComplaint: Complaint = {
      ...comp,
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setComplaints(prev => [newComplaint, ...prev]);

    addNotification({
      userId: 'user_admin',
      title: 'Dispute / Support Ticket Filed',
      message: `${comp.userName} filed ticket #${newComplaint.id}: ${comp.subject}`,
      type: 'system',
      isRead: false
    });

    return newComplaint;
  };

  const updateComplaintStatus = (
    id: string,
    status: 'open' | 'investigating' | 'resolved',
    notes?: string
  ) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status, resolutionNotes: notes || c.resolutionNotes } : c
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allUsers,
        loginUser,
        registerUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        approveProductImage,
        rejectProductImage,
        removeProductImage,
        assignProductImage,
        resetToMasterCatalogue,
        missingImagesCount,
        verifiedImagesCount,
        nurseries,
        registerNursery,
        updateNurseryStatus,
        gardeners,
        registerGardener,
        updateGardenerStatus,
        services,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        updateOrderStatus,
        bookings,
        bookGardener,
        updateBookingStatus,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        unreadNotificationsCount,
        reviews,
        addReview,
        complaints,
        fileComplaint,
        updateComplaintStatus,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        bookingModalOpen,
        setBookingModalOpen,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        selectedGardenerForBooking,
        setSelectedGardenerForBooking,
        authModalOpen,
        setAuthModalOpen,
        partnerModalOpen,
        setPartnerModalOpen,
        activePartnerType,
        setActivePartnerType,
        adminPinModalOpen,
        setAdminPinModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

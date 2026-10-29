export type UserRole = 'customer' | 'nursery' | 'gardener' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  isVerified?: boolean;
}

export interface NurseryProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  verifiedStatus: 'pending' | 'verified' | 'rejected';
  licenseNumber: string;
  establishedYear: number;
  description: string;
  image: string;
}

export interface GardenerProfile {
  id: string;
  userId: string;
  fullName: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number; // in INR ₹
  specialties: string[];
  serviceAreas: string[];
  bio: string;
  verifiedStatus: 'pending' | 'verified' | 'rejected';
  certificateName: string;
  completedJobs: number;
  avatar: string;
  availableDays: string[];
}

export type ProductCategory = 
  | 'Indoor Plants' 
  | 'Outdoor Plants' 
  | 'Flowering Plants' 
  | 'Fruit Plants'
  | 'Composts & Care'
  | 'Gardening Items'
  | 'Tools & Essentials'
  | 'indoor'
  | 'outdoor'
  | 'flowering'
  | 'seeds'
  | 'pots'
  | 'tools'
  | 'soil'
  | string;

export interface ProductCare {
  sunlight: 'Low' | 'Medium' | 'Bright Indirect' | 'Full Sun';
  water: 'Weekly' | 'Bi-weekly' | 'When soil dries' | 'Daily';
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  petFriendly: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  botanicalName?: string;
  category: ProductCategory;
  department?: 'plant' | 'tool_essential';
  plantType?: string;
  toolCategory?: string;
  price: number; // ₹ INR
  currency: 'INR';
  originalPrice?: number;
  imageUrl: string;
  image: string; // compatibility
  imageVerified: boolean;
  stock: number;
  nurseryId: string;
  nurseryName: string;
  rating: number;
  reviewCount: number;
  description: string;
  care?: ProductCare;
  isFeatured?: boolean;
  tags?: string[];
  uploadedByGardener?: string;
}

export interface GardeningService {
  id: string;
  title: string;
  category: 'maintenance' | 'setup' | 'pruning' | 'pest_control' | 'doctor';
  description: string;
  basePrice: number; // ₹
  priceUnit: 'per_hour' | 'per_visit' | 'fixed';
  duration: string;
  iconName: string;
  included: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  nurseryId: string;
  nurseryName: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'upi' | 'card';
  createdAt: string;
  estimatedDelivery: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'rejected';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  gardenerId: string;
  gardenerName: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  address: string;
  city: string;
  notes?: string;
  price: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'system' | 'verification';
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  targetType: 'product' | 'gardener';
  targetId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: 'order' | 'service' | 'partner' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
}

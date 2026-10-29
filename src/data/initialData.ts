import {
  User,
  NurseryProfile,
  GardenerProfile,
  Product,
  GardeningService,
  Order,
  Booking,
  AppNotification,
  Review,
  Complaint
} from '../types';
import { MASTER_PRODUCTS } from './productsData';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    role: 'customer',
    phone: '+91 98201 44521',
    city: 'Mumbai',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    avatar: '/assets/plants/peace_lily.jpg',
    isVerified: true
  },
  {
    id: 'user_nursery_1',
    name: 'Vikramaditya Rao',
    email: 'greenroots@urbanonursery.in',
    role: 'nursery',
    phone: '+91 94481 22390',
    city: 'Bengaluru',
    address: 'Survey 45, Sarjapur Botanical Corridor',
    avatar: '/assets/plants/areca_palm.jpg',
    isVerified: true
  },
  {
    id: 'user_nursery_2',
    name: 'Sunita Deshmukh',
    email: 'vedicflora@urbanonursery.in',
    role: 'nursery',
    phone: '+91 98230 11984',
    city: 'Pune',
    address: 'Plot 12, Baner Green Belt',
    avatar: '/assets/plants/anthurium.jpg',
    isVerified: true
  },
  {
    id: 'user_gardener_1',
    name: 'Ramesh Kumar',
    email: 'ramesh.gardener@gmail.com',
    role: 'gardener',
    phone: '+91 98112 30491',
    city: 'Delhi-NCR',
    address: 'Sector 44, Gurgaon',
    avatar: '/assets/plants/peace_lily.jpg',
    isVerified: true
  },
  {
    id: 'user_gardener_2',
    name: 'Priya Sharma',
    email: 'priya.plants@gmail.com',
    role: 'gardener',
    phone: '+91 97410 88219',
    city: 'Bengaluru',
    address: 'Indiranagar 12th Main',
    avatar: '/assets/plants/bougainvillea.jpg',
    isVerified: true
  },
  {
    id: 'user_admin',
    name: 'Chief Horticulturist (Admin)',
    email: 'admin@urbanonursery.in',
    role: 'admin',
    phone: '+91 1800 200 4455',
    city: 'Bengaluru',
    avatar: '/assets/plants/rubber_plant.jpg',
    isVerified: true
  }
];

export const INITIAL_NURSERIES: NurseryProfile[] = [
  {
    id: 'nursery_1',
    userId: 'user_nursery_1',
    businessName: 'GreenRoots Botanical Haven',
    ownerName: 'Vikramaditya Rao',
    location: 'Sarjapur Botanical Corridor',
    city: 'Bengaluru',
    rating: 4.9,
    reviewCount: 342,
    verifiedStatus: 'verified',
    licenseNumber: 'KA-BNG-HORT-2021-9982',
    establishedYear: 2014,
    description: 'Specialists in acclimatized indoor foliage, rare aroids, and sustainable organic potting mixtures.',
    image: '/assets/plants/peace_lily.jpg'
  },
  {
    id: 'nursery_2',
    userId: 'user_nursery_2',
    businessName: 'Vedic Flora & Herbs',
    ownerName: 'Sunita Deshmukh',
    location: 'Baner Hills Road',
    city: 'Pune',
    rating: 4.8,
    reviewCount: 289,
    verifiedStatus: 'verified',
    licenseNumber: 'MH-PUN-AGRI-2018-4412',
    establishedYear: 2017,
    description: 'Cultivators of indigenous Indian flowering perennials, balcony pollinators, and therapeutic indoor species.',
    image: '/assets/plants/anthurium.jpg'
  }
];

export const INITIAL_GARDENERS: GardenerProfile[] = [
  {
    id: 'gardener_1',
    userId: 'user_gardener_1',
    fullName: 'Ramesh Kumar',
    experienceYears: 12,
    serviceAreas: ['South Delhi', 'Gurgaon Sectors 1-65', 'Noida Express'],
    specialties: ['Balcony Garden Makeovers', 'Lawn Maintenance', 'Organic Pest Control', 'Fruiting Citrus Bonsai'],
    hourlyRate: 349,
    rating: 4.9,
    reviewCount: 178,
    completedJobs: 412,
    verifiedStatus: 'verified',
    certificateName: 'National Horticulture Board Certified Expert',
    bio: 'Certified master gardener with 12 years of hands-on experience in apartment terraces, soil regeneration, and seasonal pruning.',
    avatar: '/assets/plants/peace_lily.jpg',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  {
    id: 'gardener_2',
    userId: 'user_gardener_2',
    fullName: 'Priya Sharma',
    experienceYears: 8,
    serviceAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield'],
    specialties: ['Hydroponics & Aroids', 'Terrace Herb Kitchens', 'Soil Repotting', 'Tropical Orchid Care'],
    hourlyRate: 399,
    rating: 4.95,
    reviewCount: 145,
    completedJobs: 298,
    verifiedStatus: 'verified',
    certificateName: 'B.Sc. Horticulture & Urban Landscaping',
    bio: 'Horticulture graduate with deep passion for restoring distressed tropical houseplants and designing balcony green canopies.',
    avatar: '/assets/plants/bougainvillea.jpg',
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
];

export const INITIAL_SERVICES: GardeningService[] = [
  {
    id: 'srv_1',
    title: 'Soil Tilling, Aeration & Organic Enrichment',
    category: 'maintenance',
    description: 'Deep loosen of pot root zones, clearing soil compaction, and enriching with premium vermicompost & neem cake.',
    basePrice: 349,
    priceUnit: 'per_visit',
    duration: '1.5 - 2 Hours',
    iconName: 'LayoutGrid',
    included: [
      'De-compacting packed root zone soil',
      'Blending organic coco-peat & neem cake mix',
      'Checking and clearing bottom drainage holes',
      'Top-dressing with slow-release vermicompost'
    ]
  },
  {
    id: 'srv_2',
    title: 'Seasonal Pruning & Architectural Shaping',
    category: 'pruning',
    description: 'Trimming back overgrowth on Bougainvillea, boxwood hedges, and climbing roses to promote dense new flowering nodes.',
    basePrice: 399,
    priceUnit: 'per_visit',
    duration: '2 Hours',
    iconName: 'Scissors',
    included: [
      'Removal of spent blooms and deadwood canes',
      'Sanitized 45-degree angle shear pruning',
      'Aesthetic architectural canopy shaping',
      'Application of organic healing paste to cut ends'
    ]
  },
  {
    id: 'srv_3',
    title: 'Pest Management & Organic Treatments',
    category: 'pest_control',
    description: 'Cold-pressed emulsified neem oil spray, sticky insect traps, and systemic bio-fungicide treatment.',
    basePrice: 449,
    priceUnit: 'per_visit',
    duration: '1.5 Hours',
    iconName: 'ShieldAlert',
    included: [
      'Microscopic inspection of leaf undersides and nodes',
      'High-pressure cold-pressed organic neem wash',
      'Substrate drench for fungus gnats & root nematodes',
      '7-day preventive protection shield'
    ]
  },
  {
    id: 'srv_4',
    title: 'Lawn Mowing & Turf De-thatching',
    category: 'maintenance',
    description: 'Manual and motorized line-trimming to keep lawn grass neat, aerated, level, and weed-free.',
    basePrice: 499,
    priceUnit: 'per_visit',
    duration: '2 - 3 Hours',
    iconName: 'Sparkles',
    included: [
      'Even-height rotary mowing with clean border edging',
      'Mechanical thatch and dead stolon removal',
      'Hand extraction of deep taproot weeds',
      'Clippings swept and added to home compost bin'
    ]
  },
  {
    id: 'srv_5',
    title: 'Repotting & Root Division',
    category: 'setup',
    description: 'Transferring root-bound container plants into larger ceramic or terracotta planters with root revitalization.',
    basePrice: 299,
    priceUnit: 'per_visit',
    duration: '1 - 2 Hours',
    iconName: 'Sprout',
    included: [
      'Gentle extraction without damaging delicate root balls',
      'Loosening circling root girdles and root-bound roots',
      'Repotting into fresh nutrient-rich porous medium',
      'Initial anti-shock liquid bio-stimulant drench'
    ]
  },
  {
    id: 'srv_6',
    title: 'Holiday / Vacation Plant Care Coverage',
    category: 'maintenance',
    description: 'Managing watering cycles, misting, and shade repositioning while you are away from home to prevent dry-out.',
    basePrice: 399,
    priceUnit: 'per_visit',
    duration: '1 Hour / visit',
    iconName: 'Calendar',
    included: [
      'Checking each pot soil moisture with digital probe',
      'Deep sub-irrigation for thirst-prone tropicals',
      'Daily photo updates of your green corner',
      'Adjusting plants away from harsh balcony direct heat'
    ]
  }
];

// EXACT 27 APPROVED PRODUCTS (10 Indoor, 10 Outdoor Flowering, 7 Essential Tools)
// ALL STRICTLY PRICED WITHIN RS. 1000 AS PROVIDED BY USER
// EVERY SINGLE ITEM HAS ITS OWN VERIFIED LOCAL IMAGE. ZERO EXTERNAL URLS. ZERO DUPLICATES.
// MASTER BOTANICAL AND GARDENING ESSENTIALS CATALOG
// ALL PLANTS PRICED STRICTLY UNDER ₹1,000 WITH ACTUAL INDIAN NURSERY MARKET RATES
export const INITIAL_PRODUCTS: Product[] = MASTER_PRODUCTS;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-90241',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@example.com',
    customerPhone: '+91 98201 44521',
    deliveryAddress: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    items: [
      {
        productId: 'prod_ind_1',
        productName: 'Peace Lily (Spathiphyllum)',
        price: 299,
        quantity: 1,
        image: '/assets/plants/peace_lily.jpg',
        nurseryId: 'nursery_1',
        nurseryName: 'GreenRoots Botanical Haven'
      },
      {
        productId: 'prod_flw_3',
        productName: 'Mogra (Arabian Jasmine)',
        price: 219,
        quantity: 1,
        image: '/assets/plants/mogra_jasmine.jpg',
        nurseryId: 'nursery_1',
        nurseryName: 'GreenRoots Botanical Haven'
      }
    ],
    subtotal: 518,
    discount: 50,
    deliveryFee: 0,
    total: 468,
    status: 'out_for_delivery',
    paymentMethod: 'upi',
    createdAt: '2026-10-23T14:30:00Z',
    estimatedDelivery: 'Tomorrow, by 2:00 PM'
  },
  {
    id: 'ORD-89104',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@example.com',
    customerPhone: '+91 98201 44521',
    deliveryAddress: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    items: [
      {
        productId: 'prod_ind_5',
        productName: 'ZZ Plant (Zamioculcas zamiifolia)',
        price: 449,
        quantity: 1,
        image: '/assets/plants/zz_plant.jpg',
        nurseryId: 'nursery_1',
        nurseryName: 'GreenRoots Botanical Haven'
      },
      {
        productId: 'prod_tol_1',
        productName: 'Heavy-Duty Bypass Pruning Shears',
        price: 349,
        quantity: 1,
        image: '/assets/tools/pruning_shears.jpg',
        nurseryId: 'nursery_1',
        nurseryName: 'GreenRoots Botanical Haven'
      }
    ],
    subtotal: 798,
    discount: 0,
    deliveryFee: 0,
    total: 798,
    status: 'delivered',
    paymentMethod: 'card',
    createdAt: '2026-10-18T10:15:00Z',
    estimatedDelivery: 'Delivered on Oct 20'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BKG-4011',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98201 44521',
    gardenerId: 'gardener_1',
    gardenerName: 'Ramesh Kumar',
    serviceId: 'srv_1',
    serviceTitle: 'Soil Tilling, Aeration & Organic Enrichment',
    date: '2026-10-29',
    timeSlot: '10:30 AM - 12:30 PM',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    price: 349,
    status: 'confirmed',
    paymentStatus: 'paid',
    notes: 'Please bring extra neem cake for our 6 balcony bougainvillea pots.',
    createdAt: '2026-10-24T09:00:00Z'
  },
  {
    id: 'BKG-3890',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98201 44521',
    gardenerId: 'gardener_1',
    gardenerName: 'Ramesh Kumar',
    serviceId: 'srv_2',
    serviceTitle: 'Seasonal Pruning & Architectural Shaping',
    date: '2026-10-12',
    timeSlot: '08:00 AM - 10:00 AM',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    price: 399,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2026-10-10T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_cust_1',
    title: 'Order Out for Delivery',
    message: 'Your Peace Lily & Mogra Jasmine order #ORD-90241 is out for delivery with eco-courier.',
    type: 'order',
    isRead: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'notif_2',
    userId: 'user_cust_1',
    title: 'Booking Confirmed',
    message: 'Ramesh Kumar has confirmed your appointment for Soil Tilling & Aeration on Oct 29.',
    type: 'booking',
    isRead: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'notif_3',
    userId: 'user_nursery_1',
    title: 'New Incoming Order',
    message: 'Order #ORD-90241 received for 2 items. Ready to be packed.',
    type: 'order',
    isRead: false,
    createdAt: 'Yesterday'
  },
  {
    id: 'notif_4',
    userId: 'user_gardener_1',
    title: 'Service Appointment Reminder',
    message: 'Upcoming service at Bandra West scheduled for Oct 29 at 10:30 AM.',
    type: 'booking',
    isRead: true,
    createdAt: '2 days ago'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    targetType: 'product',
    targetId: 'prod_ind_1',
    authorName: 'Sneha Kulkarni',
    rating: 5,
    comment: 'Arrived in pristine condition in recyclable botanical box! Leaves were healthy, glistening and already sprouting two white spade blooms.',
    createdAt: '2026-10-21'
  },
  {
    id: 'rev_2',
    targetType: 'gardener',
    targetId: 'gardener_1',
    authorName: 'Kabir Singhania',
    rating: 5,
    comment: 'Ramesh is an absolute master of plant care. He rejuvenated our balcony garden soil and treated plant bugs with organic neem solutions. Super punctual.',
    createdAt: '2026-10-19'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-1082',
    userId: 'user_cust_1',
    userName: 'Aarav Patel',
    userRole: 'customer',
    category: 'order',
    subject: 'Minor ceramic saucer chip during transit',
    description: 'The planter set arrived on time, but one terracotta bottom saucer had a small hairline crack at the rim. Requesting replacement saucer.',
    status: 'investigating',
    resolutionNotes: 'Nursery partner contacted to dispatch replacement saucer free of cost.',
    createdAt: '2026-10-22T09:20:00Z'
  }
];

const fs = require('fs');

const products = JSON.parse(fs.readFileSync('scripts/products_generated.json', 'utf8'));

const fileHead = `import {
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

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    role: 'customer',
    phone: '+91 98201 44521',
    city: 'Mumbai',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    isVerified: true
  },
  {
    id: 'user_admin',
    name: 'Chief Horticulturist (Admin)',
    email: 'admin@urbanonursery.in',
    role: 'admin',
    phone: '+91 1800 200 4455',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
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
    location: 'Baner Green Belt',
    city: 'Pune',
    rating: 4.85,
    reviewCount: 218,
    verifiedStatus: 'verified',
    licenseNumber: 'MH-PUN-BOT-2018-4412',
    establishedYear: 2017,
    description: 'Ayurvedic wellness flora, indigenous flowering perennials, organic fertilizers and seed stock.',
    image: '/assets/plants/bougainvillea.jpg'
  },
  {
    id: 'nursery_3',
    userId: 'user_nursery_3',
    businessName: 'TerraCotta Living Gardens',
    ownerName: 'Debabrata Mukherjee',
    location: 'New Town Eco Park Zone',
    city: 'Kolkata',
    rating: 4.7,
    reviewCount: 95,
    verifiedStatus: 'pending',
    licenseNumber: 'WB-KOL-BOT-2024-1049',
    establishedYear: 2022,
    description: 'Handcrafted porous terracotta pottery, starter seed sets, and terrace gardening setups.',
    image: '/assets/tools/hand_trowel.jpg'
  }
];

export const INITIAL_GARDENERS: GardenerProfile[] = [
  {
    id: 'gardener_1',
    userId: 'user_gardener_1',
    fullName: 'Ramesh Kumar',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 184,
    hourlyRate: 349,
    specialties: ['Soil Tilling & Aeration', 'Seasonal Pruning', 'Organic Neem Pest Treatment', 'Lawn Mowing'],
    serviceAreas: ['South Delhi', 'Gurgaon DLF', 'Noida Sectors 15-62', 'Vasant Kunj'],
    bio: 'Government-certified master horticulturist with 12 years rejuvenating urban terrace gardens and balconies.',
    verifiedStatus: 'verified',
    certificateName: 'National Horticulture Board (NHB) Master Certification',
    completedJobs: 412,
    avatar: '/assets/plants/peace_lily.jpg',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: 'gardener_2',
    userId: 'user_gardener_2',
    fullName: 'Priya Sharma',
    experienceYears: 8,
    rating: 4.95,
    reviewCount: 147,
    hourlyRate: 399,
    specialties: ['Balcony Garden Optimization', 'Repotting & Root Division', 'Plant Health Diagnosis', 'Holiday Plant Care'],
    serviceAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Lavelle Road'],
    bio: 'Specialized in transforming compact city apartment balconies into thriving, low-maintenance bio-sanctuaries.',
    verifiedStatus: 'verified',
    certificateName: 'Lalbagh Botanical Gardens Professional Landscape Specialist',
    completedJobs: 298,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: 'gardener_3',
    userId: 'user_gardener_3',
    fullName: 'Mohd. Rafiq Ansari',
    experienceYears: 15,
    rating: 4.75,
    reviewCount: 88,
    hourlyRate: 299,
    specialties: ['Flowering Vines & Roses', 'Soil Mixing & Potting', 'Lawn De-thatching', 'Organic Pest Sprays'],
    serviceAreas: ['Bandra', 'Juhu', 'Andheri West', 'Powai'],
    bio: 'Multi-generational nurseryman with deep hands-on mastery of tropical blooms, flowering climbers, and potting physics.',
    verifiedStatus: 'pending',
    certificateName: 'Maharashtra State Floriculture Association Credential',
    completedJobs: 165,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
];

export const INITIAL_SERVICES: GardeningService[] = [
  {
    id: 'srv_1',
    title: 'Soil Tilling, Aeration & Potting',
    category: 'setup',
    description: 'Manually mixing red soil, coco-peat, vermicompost, and sand to ensure ideal root drainage and loose aeration.',
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
    title: 'Seasonal Pruning & Shaping',
    category: 'pruning',
    description: 'Trimming back overgrowth on Bougainvillea, boxwood hedges, and roses to promote dense new flowering nodes.',
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
    description: 'Running manual push mowers or line-trimmers to keep yard grass neat, level, aeration-ready, and weed-free.',
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
    description: 'Transferring root-bound container plants into larger ceramic or plastic pots with root pruning as they grow.',
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
      'Daily WhatsApp photo updates of your green corner',
      'Adjusting plants away from harsh balcony direct heat'
    ]
  }
];

// 175 STRICT APPROVED CATALOGUE ITEMS (50 Indoor, 50 Outdoor, 50 Flowering, 25 Gardening Items)
export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

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
        price: 229,
        quantity: 1,
        image: '/assets/plants/mogra_jasmine.jpg',
        nurseryId: 'nursery_2',
        nurseryName: 'Vedic Flora & Herbs'
      }
    ],
    subtotal: 528,
    discount: 50,
    deliveryFee: 0,
    total: 478,
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
        productId: 'prod_gar_3',
        productName: 'Bypass Pruning Shears / Cutter',
        price: 349,
        quantity: 1,
        image: '/assets/tools/pruning_shears.jpg',
        nurseryId: 'nursery_3',
        nurseryName: 'TerraCotta Living Gardens'
      }
    ],
    subtotal: 349,
    discount: 0,
    deliveryFee: 49,
    total: 398,
    status: 'delivered',
    paymentMethod: 'card',
    createdAt: '2026-10-18T10:15:00Z',
    estimatedDelivery: 'Delivered on Oct 20'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-55210',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98201 44521',
    gardenerId: 'gardener_1',
    gardenerName: 'Ramesh Kumar',
    serviceId: 'srv_1',
    serviceTitle: 'Soil Tilling, Aeration & Potting',
    date: '2026-10-26',
    timeSlot: '10:00 AM - 12:00 PM',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    notes: 'Please bring organic potting soil mix for 4 new rectangular balcony railing planters.',
    price: 349,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2026-10-23T16:00:00Z'
  },
  {
    id: 'BK-54911',
    customerId: 'user_cust_1',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98201 44521',
    gardenerId: 'gardener_2',
    gardenerName: 'Priya Sharma',
    serviceId: 'srv_3',
    serviceTitle: 'Pest Management & Organic Treatments',
    date: '2026-10-12',
    timeSlot: '03:00 PM - 05:00 PM',
    address: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    notes: 'Ficus leaf browning and scale insects diagnosis.',
    price: 449,
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
    message: 'Ramesh Kumar has confirmed your appointment for Soil Tilling & Aeration on Monday, Oct 26.',
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
    message: 'Upcoming service at Bandra West scheduled for Oct 26 at 10:00 AM.',
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
`;

fs.writeFileSync('src/data/initialData.ts', fileHead, 'utf8');
console.log('Successfully wrote src/data/initialData.ts with 175 products!');

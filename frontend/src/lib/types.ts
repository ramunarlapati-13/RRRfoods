// Shared TypeScript types for RK Foods platform

export interface Product {
  id: string;
  sku: string;            // e.g. RKF260605
  name: string;
  nameTeluguScript: string;
  slug: string;
  category: 'pickles' | 'sweets' | 'meals';
  dietType?: 'veg' | 'nonveg';
  description: string;
  ingredients: string[];
  imageUrl: string;
  images: string[];
  actualPrice: number;
  sellingPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  availableLocations: string[];
  heatLevel: number;      // 1-10 for pickles; sweetness 1-10 for sweets
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  sellingPrice: number;
  quantity: number;
  sku: string;
}

export interface HeritageBoxItem {
  productId: string;
  name: string;
  nameTeluguScript: string;
  imageUrl: string;
  sellingPrice: number;
  category: 'pickles' | 'sweets';
  weight: number; // grams
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
  trackingId?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  mediaUrls: {
    images: string[];
    videos: string[];
    audios: string[];
  };
  createdAt: Date;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  pincode: string;
  active: boolean;
}

export type Category = 'all' | 'pickles' | 'sweets' | 'meals';
export type DietFilter = 'all' | 'veg' | 'nonveg';

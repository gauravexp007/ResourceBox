export type ListingType = 'rent' | 'exchange' | 'both';

export type ItemCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';

export type StandardCategoryId = 
  | 'tools'
  | 'cameras'
  | 'mobility'
  | 'outdoors'
  | 'electronics'
  | 'home'
  | 'music'
  | 'sports';

export type CategoryId = StandardCategoryId | string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  itemCount: number;
  popularItems: string[];
  isCustom?: boolean;
}

export interface Owner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  memberSince: string;
  responseRate: string;
  responseTime: string;
  neighborhood: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  condition: ItemCondition;
  listingType: ListingType;
  
  // Rental Pricing
  priceDaily: number;
  priceHourly?: number;
  priceWeekly?: number;
  depositAmount: number;
  minRentalDays: number;
  
  // Single Flexible Pricing & Availability Clock
  priceRateText?: string;
  priceAmount?: number;
  priceDuration?: string;
  currencySymbol?: string;
  availableTimeWindow?: string;
  
  // Exchange details
  preferredExchangeItems?: string[];
  exchangeNotes?: string;
  
  // Media & specs
  images: string[];
  location: {
    city: string;
    neighborhood: string;
    distanceMiles: number;
    pickupOptions: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[];
  };
  
  owner: Owner;
  
  // Availability & state
  isAvailable: boolean;
  availableFrom: string;
  availableTo: string;
  rules: string[];
  featured?: boolean;
  createdAt: string;
  viewsCount: number;
  savedCount: number;
}

export interface ExchangeProposal {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemOwnerId: string;
  itemOwnerName: string;
  
  proposerId: string;
  proposerName: string;
  proposerAvatar: string;
  
  offeredItemTitle: string;
  offeredItemCategory: string;
  offeredItemImage: string;
  offeredItemCondition: ItemCondition;
  cashTopUp: number; // e.g. +$15 cash balance offered
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
}

export interface RentalBooking {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  serviceFee: number;
  grandTotal: number;
  pickupType: 'Self Pickup' | 'Public Meetup' | 'Local Delivery';
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isProposal?: boolean;
  proposalDetails?: {
    type: 'exchange' | 'rental';
    title: string;
    terms: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface ChatConversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemDailyPrice: number;
  listingType: ListingType;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerOnline: boolean;
  partnerRating: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say' | string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  postalCode?: string;
  currency?: string;
  currencyCode?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phoneNumber?: string;
  phoneVerified?: boolean;
  phoneVerifiedAt?: string;
  occupation?: string;
  location: string;
  neighborhood: string;
  memberSince: string;
  bio: string;
  savedItemIds: string[];
  preferredHandover?: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[];
  notificationsEmail?: boolean;
  notificationsSms?: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId | 'all';
  listingType: ListingType | 'all';
  location: string;
  maxDistance: number;
  minPrice: number;
  maxPrice: number;
  durationFilter: 'all' | 'hourly' | 'daily' | 'weekly';
  condition: ItemCondition | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'distance' | 'newest';
}

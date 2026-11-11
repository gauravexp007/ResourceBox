import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Item, 
  User, 
  ExchangeProposal, 
  RentalBooking, 
  ChatConversation, 
  Category,
  CategoryId, 
  ListingType,
  ItemCondition 
} from './types';
import { 
  CATEGORIES,
  INITIAL_ITEMS
} from './data/mockData';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';
import { 
  subscribeToItems, 
  createItemInFirestore, 
  updateItemInFirestore, 
  deleteItemFromFirestore,
  subscribeToBookings,
  createBookingInFirestore,
  subscribeToProposals,
  createProposalInFirestore,
  updateProposalStatusInFirestore,
  subscribeToConversations,
  sendChatMessageInFirestore,
  subscribeToUserProfile,
  saveUserProfile
} from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { TopSearchBar } from './components/TopSearchBar';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { ItemCard } from './components/ItemCard';
import { RentSection } from './components/RentSection';
import { ExchangeSection } from './components/ExchangeSection';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ProposeExchangeModal } from './components/ProposeExchangeModal';
import { RentalCheckoutModal } from './components/RentalCheckoutModal';
import { UploadResourceModal } from './components/UploadResourceModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UserDashboard } from './components/UserDashboard';
import { ChatModal } from './components/ChatModal';
import { AuthModal, AuthActionReason } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { FloatingActionMenu } from './components/FloatingActionMenu';
import { WebsiteSkeletonLoader } from './components/WebsiteSkeletonLoader';
import { 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Plus,
  Upload,
  Loader2,
  PackageOpen
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<'home' | 'rent' | 'exchange' | 'dashboard' | 'chat'>('home');
  // Starts as null or cached user profile from localStorage so profile building works seamlessly
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('resourcebox_local_user');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });

  // Core Marketplace State - connected live to database and Firestore
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isInitialAppLoading, setIsInitialAppLoading] = useState(true);
  const [proposals, setProposals] = useState<ExchangeProposal[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);

  // Smooth transition from website skeleton preview to live interactive app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialAppLoading(false);
    }, 480);
    return () => clearTimeout(timer);
  }, []);

  // Search & Filter State on Home / Global
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<ListingType | 'all'>('all');

  // Modal Dialogs State
  const [selectedItemForModal, setSelectedItemForModal] = useState<Item | null>(null);
  const [exchangeTargetItem, setExchangeTargetItem] = useState<Item | null>(null);
  const [rentTargetItem, setRentTargetItem] = useState<Item | null>(null);
  const [rentBookingConfig, setRentBookingConfig] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<AuthActionReason>('general');
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatConvId, setActiveChatConvId] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileHighlightPhone, setProfileHighlightPhone] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'info' | 'location' | 'verification' | 'settings'>('info');

  // Feedback Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Listen to Firebase Auth state & Real-time synchronization of user profile from Firestore
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const baseUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Community Member',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          rating: 5.0,
          reviewCount: 0,
          verified: true,
          phoneVerified: false,
          phoneNumber: '',
          location: 'Community Hub',
          neighborhood: 'Local District',
          memberSince: 'October 2026',
          bio: 'ResourceBox verified community member.',
          savedItemIds: []
        };

        // Real-time listener for Firestore user profile
        unsubProfile = subscribeToUserProfile(fbUser.uid, (firestoreUser) => {
          if (firestoreUser) {
            setCurrentUser({
              ...baseUser,
              ...firestoreUser,
              id: fbUser.uid,
              email: fbUser.email || firestoreUser.email || baseUser.email,
            });
          } else {
            setCurrentUser(baseUser);
            saveUserProfile(baseUser).catch((err) => console.warn('User profile sync notice:', err));
          }
        });
      } else {
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // Dismiss auth modal immediately once user is signed in
  useEffect(() => {
    if (currentUser && isAuthOpen) {
      setIsAuthOpen(false);
    }
  }, [currentUser, isAuthOpen]);

  // Listen for Google OAuth redirect results (used when popup is blocked or on mobile browsers)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          setIsAuthOpen(false);
        }
      })
      .catch((err) => {
        console.warn('OAuth redirect check notice:', err);
      });
  }, []);

  // Real-time synchronization of marketplace items from Firestore
  // Only items created by authorized users in Firestore will be shown
  useEffect(() => {
    setIsLoadingItems(true);
    const unsubscribe = subscribeToItems(
      (loadedItems) => {
        setItems(loadedItems);
        setIsLoadingItems(false);
      },
      (error) => {
        console.warn('Items sync notice:', error);
        setIsLoadingItems(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time synchronization for current user's bookings, proposals, and chats
  useEffect(() => {
    if (!currentUser?.id) {
      setBookings([]);
      setProposals([]);
      setConversations([]);
      return;
    }

    const unsubBookings = subscribeToBookings(currentUser.id, (b) => setBookings(b));
    const unsubProposals = subscribeToProposals(currentUser.id, (p) => setProposals(p));
    const unsubConversations = subscribeToConversations(currentUser.id, (c) => setConversations(c));

    return () => {
      unsubBookings();
      unsubProposals();
      unsubConversations();
    };
  }, [currentUser?.id]);

  // Unified Auth Trigger Helper
  const handleOpenAuth = (reason: AuthActionReason = 'general', mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalReason(reason);
    setAuthModalMode(mode);
    setIsAuthOpen(true);
  };

  // Open User Profile Modal Helper (allows building profile for guests and authenticated members)
  const handleOpenProfile = (
    highlightPhone: boolean = false,
    targetTab: 'info' | 'location' | 'verification' | 'settings' = highlightPhone ? 'verification' : 'info'
  ) => {
    setProfileHighlightPhone(highlightPhone);
    setProfileInitialTab(targetTab);
    setIsProfileOpen(true);
  };

  // Sign out user from Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Logout notice:', err);
    }
    setCurrentUser(null);
    setToast({
      id: `toast_${Date.now()}`,
      type: 'info',
      title: 'Signed Out',
      message: 'You are now browsing ResourceBox as a guest. Sign in to chat, swap, or list.',
    });
  };

  // Wishlist toggle
  const handleToggleSave = (itemId: string) => {
    if (!currentUser) {
      handleOpenAuth('general', 'signin');
      return;
    }
    setSavedItemIds((prev) => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      setToast({
        id: `toast_${Date.now()}`,
        type: 'info',
        title: exists ? 'Removed from Saved' : 'Saved to Wishlist',
        message: exists ? 'Item removed from your favorites' : 'Saved to your dashboard for quick access',
      });
      return next;
    });
  };

  // Open Rent Flow - Gated: Users cannot buy/rent before sign in / sign up AND phone verification
  const handleRentItem = (item: Item, bookingConfig?: any) => {
    if (!currentUser) {
      handleOpenAuth('buy', 'signup');
      return;
    }
    // Prevent owner from renting their own item
    if (item.owner.id === currentUser.id || (currentUser as any).uid === item.owner.id) {
      setToast({
        id: `toast_${Date.now()}`,
        type: 'warning',
        title: 'Your Own Product',
        message: 'You cannot rent your own item. Other members can rent it from you.',
      });
      return;
    }
    setRentTargetItem(item);
    setRentBookingConfig(bookingConfig || null);
    if (selectedItemForModal) setSelectedItemForModal(null);
  };

  // Open Exchange Flow - Gated: Users cannot propose swap before sign in / sign up
  const handleProposeExchange = (item: Item) => {
    if (!currentUser) {
      handleOpenAuth('exchange', 'signup');
      return;
    }
    // Prevent owner from proposing swap on their own item
    const isOwnerItem = Boolean(
      currentUser && (
        item.owner?.id === currentUser.id ||
        (currentUser as any).uid === item.owner?.id ||
        (item as any).ownerId === currentUser.id ||
        (item as any).ownerEmail === currentUser.email ||
        (item.owner?.name && currentUser.name && item.owner.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
      )
    );
    if (isOwnerItem) {
      setToast({
        id: `toast_${Date.now()}`,
        type: 'warning',
        title: 'Your Own Product',
        message: 'You cannot propose an exchange on your own product.',
      });
      return;
    }
    setExchangeTargetItem(item);
    if (selectedItemForModal) setSelectedItemForModal(null);
  };

  // Open Upload Flow - Gated: Users cannot upload item before sign up
  const handleOpenUpload = () => {
    if (!currentUser) {
      handleOpenAuth('upload', 'signup');
      return;
    }
    setIsUploadOpen(true);
  };

  // Open Global Chat - Gated: Users cannot chat before sign in / sign up
  const handleOpenChat = () => {
    if (!currentUser) {
      handleOpenAuth('message', 'signin');
      return;
    }
    setIsChatOpen(true);
  };

  // Confirm Rental Booking in Firestore
  const handleConfirmBooking = async (newBooking: RentalBooking) => {
    try {
      await createBookingInFirestore(newBooking);
      setRentTargetItem(null);
      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Reservation Confirmed!',
        message: `Your booking for "${newBooking.itemTitle}" has been placed and saved.`,
      });
    } catch (err) {
      console.error('Error confirming booking in Firestore:', err);
      setBookings((prev) => [newBooking, ...prev]);
      setRentTargetItem(null);
    }
  };

  // Submit Exchange Proposal in Firestore
  const handleSubmitProposal = async (data: {
    targetItem: Item;
    offeredItemTitle: string;
    offeredItemCategory: string;
    offeredItemImage: string;
    offeredItemCondition: ItemCondition;
    cashTopUp: number;
    message: string;
  }) => {
    if (!currentUser) {
      handleOpenAuth('exchange', 'signup');
      return;
    }

    const newProposal: ExchangeProposal = {
      id: `prop_${Date.now()}`,
      itemId: data.targetItem.id,
      itemTitle: data.targetItem.title,
      itemImage: data.targetItem.images[0] || '',
      itemOwnerId: data.targetItem.owner.id,
      itemOwnerName: data.targetItem.owner.name,
      proposerId: currentUser.id,
      proposerName: currentUser.name,
      proposerAvatar: currentUser.avatar,
      offeredItemTitle: data.offeredItemTitle,
      offeredItemCategory: data.offeredItemCategory,
      offeredItemImage: data.offeredItemImage,
      offeredItemCondition: data.offeredItemCondition,
      cashTopUp: data.cashTopUp,
      message: data.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await createProposalInFirestore(newProposal);
      setExchangeTargetItem(null);

      // Also initiate or update chat conversation
      handleStartChat(data.targetItem, `[Exchange Proposal] Offered: ${data.offeredItemTitle} ${data.cashTopUp > 0 ? `(+ $${data.cashTopUp} cash)` : ''}. Message: "${data.message}"`);

      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Exchange Proposal Sent!',
        message: `Your offer has been submitted to ${data.targetItem.owner.name}. You can track it in your Dashboard.`,
      });
    } catch (err) {
      console.error('Error creating proposal in Firestore:', err);
      setProposals((prev) => [newProposal, ...prev]);
      setExchangeTargetItem(null);
    }
  };

  // Accept Proposal
  const handleAcceptProposal = async (proposalId: string) => {
    try {
      await updateProposalStatusInFirestore(proposalId, 'accepted');
      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Exchange Accepted!',
        message: 'You have agreed to the barter terms. Please arrange handover in Messages.',
      });
    } catch (err) {
      console.error('Error accepting proposal:', err);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'accepted' as const } : p))
      );
    }
  };

  // Decline Proposal
  const handleDeclineProposal = async (proposalId: string) => {
    try {
      await updateProposalStatusInFirestore(proposalId, 'declined');
      setToast({
        id: `toast_${Date.now()}`,
        type: 'info',
        title: 'Proposal Declined',
        message: 'The proposal status has been updated.',
      });
    } catch (err) {
      console.error('Error declining proposal:', err);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'declined' as const } : p))
      );
    }
  };

  // Add New Listing to Database - Gated: Only after signed up
  const handleAddListing = async (newItem: Item) => {
    // Immediately reflect in items state so creator & all local views display it
    setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
    try {
      await createItemInFirestore(newItem);
      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Resource Published!',
        message: `"${newItem.title}" is saved to database and visible to all visitors.`,
      });
    } catch (err) {
      console.error('Error publishing item to database:', err);
    }
  };

  // Open modal in edit mode
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsUploadOpen(true);
    if (selectedItemForModal) setSelectedItemForModal(null);
  };

  // Update Existing Listing in Firestore permanently
  const handleUpdateListing = async (updatedItem: Item) => {
    try {
      await updateItemInFirestore(updatedItem.id, updatedItem);
      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Listing Updated!',
        message: `"${updatedItem.title}" has been saved permanently to database.`,
      });
      setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    } catch (err) {
      console.error('Error updating item in Firestore:', err);
      setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    }
    setEditingItem(null);
  };

  // Toggle item availability in Firestore
  const handleToggleItemAvailability = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await updateItemInFirestore(itemId, { isAvailable: !item.isAvailable });
    } catch (err) {
      console.error('Error updating availability:', err);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i))
      );
    }
  };

  // Delete item from database
  const handleDeleteItem = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await deleteItemFromFirestore(itemId);
      setToast({
        id: `toast_${Date.now()}`,
        type: 'info',
        title: 'Listing Removed',
        message: 'The item has been deleted from the marketplace.',
      });
    } catch (err) {
      console.error('Error deleting item from database:', err);
    }
  };

  // Update item price in Firestore
  const handleUpdateItemPrice = async (itemId: string, newPrice: number) => {
    try {
      await updateItemInFirestore(itemId, { priceDaily: newPrice });
      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        title: 'Price Updated',
        message: `Daily rental rate updated to $${newPrice}.`,
      });
    } catch (err) {
      console.error('Error updating price in Firestore:', err);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, priceDaily: newPrice } : i))
      );
    }
  };

  // Start Chat with owner or renter - Gated: Users cannot chat before sign in / sign up
  const handleStartChat = async (item: Item, initialMessage?: string) => {
    if (!currentUser) {
      handleOpenAuth('message', 'signin');
      return;
    }

    // Prevent owner from chatting with themselves on their own listing
    if (item.owner.id === currentUser.id || (currentUser as any).uid === item.owner.id) {
      setToast({
        id: `toast_${Date.now()}`,
        type: 'info',
        title: 'Your Own Listing',
        message: 'This is your product listing. Other members can message you about it.',
      });
      return;
    }

    // Check if conversation already exists for this item
    const existing = conversations.find((c) => c.itemId === item.id);
    if (existing) {
      if (initialMessage) {
        await handleSendMessage(existing.id, initialMessage);
      }
      setActiveChatConvId(existing.id);
      setIsChatOpen(true);
      if (selectedItemForModal) setSelectedItemForModal(null);
      return;
    }

    // Create new conversation in Firestore
    const newConv: ChatConversation = {
      id: `conv_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0] || '',
      itemDailyPrice: item.priceDaily,
      listingType: item.listingType,
      partnerId: item.owner.id,
      partnerName: item.owner.name,
      partnerAvatar: item.owner.avatar,
      partnerOnline: true,
      partnerRating: item.owner.rating,
      lastMessage: initialMessage || `Hi! I'm interested in your ${item.title}. Is it available?`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: initialMessage || `Hi! I'm interested in your ${item.title}. Is it available?`,
          timestamp: 'Just now',
        },
      ],
    };

    try {
      await sendChatMessageInFirestore(newConv, newConv.messages[0]);
    } catch (err) {
      console.error('Error saving new conversation to Firestore:', err);
    }

    setConversations((prev) => [newConv, ...prev]);
    setActiveChatConvId(newConv.id);
    setIsChatOpen(true);
    if (selectedItemForModal) setSelectedItemForModal(null);
  };

  // Open Chat directly with partner from dashboard
  const handleOpenChatByPartner = (partnerId?: string, itemId?: string) => {
    if (!currentUser) {
      handleOpenAuth('message', 'signin');
      return;
    }
    if (partnerId) {
      const conv = conversations.find((c) => c.partnerId === partnerId || c.itemId === itemId);
      if (conv) {
        setActiveChatConvId(conv.id);
      }
    }
    setIsChatOpen(true);
  };

  // Send message in existing conversation with Firestore sync
  const handleSendMessage = async (convId: string, text: string) => {
    if (!currentUser) {
      handleOpenAuth('message', 'signin');
      return;
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now',
    };

    const targetConv = conversations.find((c) => c.id === convId);
    if (targetConv) {
      try {
        await sendChatMessageInFirestore(targetConv, newMessage);
      } catch (err) {
        console.error('Error updating chat in Firestore:', err);
      }
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  // Items for Home Featured & Recently Listed (only real authorized items)
  const featuredItems = items.filter((i) => i.featured).length > 0 
    ? items.filter((i) => i.featured) 
    : items.slice(0, 8);
    
  const recentlyListed = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  // Dynamic categories combining standard catalog with any custom categories entered by community members
  const displayCategories: Category[] = React.useMemo(() => {
    const standardIds = new Set(CATEGORIES.map((c) => c.id.toLowerCase()));
    const customCategoriesMap = new Map<string, Category>();

    // Count items per category (case-insensitive)
    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      const rawCat = (item.category || '').trim();
      if (!rawCat) return;
      const lower = rawCat.toLowerCase();
      categoryCounts[lower] = (categoryCounts[lower] || 0) + 1;

      if (!standardIds.has(lower)) {
        if (!customCategoriesMap.has(lower)) {
          customCategoriesMap.set(lower, {
            id: rawCat,
            name: rawCat,
            description: `Community-created category: ${rawCat}`,
            iconName: 'Package',
            itemCount: 1,
            popularItems: [item.title],
            isCustom: true,
          });
        } else {
          const existing = customCategoriesMap.get(lower)!;
          existing.itemCount += 1;
        }
      }
    });

    const standardWithCounts = CATEGORIES.map((c) => {
      const directCount = categoryCounts[c.id.toLowerCase()] || 0;
      const nameCount = categoryCounts[c.name.toLowerCase()] || 0;
      return {
        ...c,
        itemCount: Math.max(directCount, nameCount),
      };
    });

    return [...standardWithCounts, ...Array.from(customCategoriesMap.values())];
  }, [items]);

  // Unread count
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingProposalsCount = proposals.filter((p) => p.itemOwnerId === currentUser?.id && p.status === 'pending').length;

  if (isInitialAppLoading) {
    return <WebsiteSkeletonLoader showHero={true} cardsCount={8} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEEE] text-[#3B1E54] relative">
      
      {/* Primary Sticky Header */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenUpload={handleOpenUpload}
        onOpenChat={handleOpenChat}
        onOpenProfile={handleOpenProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        proposalsCount={pendingProposalsCount}
        savedCount={savedItemIds.length}
      />

      {/* Spacer for Fixed Sliding Glass Navbar */}
      <div className="h-14 sm:h-18 shrink-0" aria-hidden="true" />

      {/* Persistent Top Search Bar Directly Below Navigation Bar */}
      <TopSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        listingType={listingTypeFilter}
        setListingType={setListingTypeFilter}
        categories={displayCategories}
        onSearchSubmit={() => {
          if (listingTypeFilter === 'exchange') {
            setActiveTab('exchange');
          } else {
            setActiveTab('rent');
          }
        }}
      />

      {/* Main Content Sections based on Active Tab */}
      <main className="flex-1 pb-16">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section with Interactive Square (Clean, no mock image data) */}
            <HeroSection
              onNavigateToRent={() => setActiveTab('rent')}
              onNavigateToExchange={() => setActiveTab('exchange')}
              onOpenUpload={handleOpenUpload}
              itemsCount={items.length}
            />

            {/* Category Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              categories={displayCategories}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setActiveTab('rent');
              }}
            />

            {/* Section: Featured Resources */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-xs font-semibold text-[#3B1E54] uppercase tracking-wider mb-1">
                    Community Resources
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B1E54] font-sans">
                    Featured Listings
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C4B6E] mt-1">
                    Equipment and tools added by authorized verified community members
                  </p>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={() => setActiveTab('rent')}
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#9B7EBD] hover:text-[#3B1E54] group cursor-pointer"
                  >
                    <span>Explore all listings ({items.length})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {isLoadingItems ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                      key={i}
                      className="rounded-3xl p-4 bg-white/90 border border-[var(--theme-accent-light)] shadow-xs space-y-4 relative overflow-hidden"
                    >
                      <div className="w-full aspect-[4/3] rounded-2xl bg-[var(--theme-accent-light)] relative overflow-hidden flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl border border-white/60 rotate-6" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 rounded-md bg-[var(--theme-deep)]/15 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                        </div>
                        <div className="h-3 w-1/2 rounded-md bg-[var(--theme-primary)]/15 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[var(--theme-accent-light)] flex items-center justify-between">
                        <div className="h-5 w-20 rounded-md bg-[var(--theme-deep)]/20 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                        </div>
                        <div className="h-8 w-24 rounded-xl bg-[var(--theme-deep)] relative overflow-hidden shadow-xs">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                /* Polished Empty State when zero items are present */
                <div className="bg-white rounded-3xl border border-[#D4BEE4] p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center mb-4">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3B1E54] font-sans">
                    No Resources Listed Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4B6E] mt-2 mb-6 max-w-md mx-auto leading-relaxed">
                    Items uploaded to the database appear automatically to all devices. Click below to publish the first listing!
                  </p>
                  <button
                    onClick={handleOpenUpload}
                    className="px-6 py-3 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3B1E54]/20 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload First Resource</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSaved={savedItemIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      onSelect={(i) => setSelectedItemForModal(i)}
                      onRentClick={(i) => handleRentItem(i)}
                      onExchangeClick={(i) => handleProposeExchange(i)}
                      currentUserId={currentUser?.id}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section: Recently Listed */}
            {items.length > 0 && (
              <section className="py-12 bg-white border-y border-[#D4BEE4]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <div className="text-xs font-semibold text-[#3B1E54] uppercase tracking-wider mb-1">
                        Fresh Arrivals
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B1E54] font-sans">
                        Recently Added Resources
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5C4B6E] mt-1">
                        Equipment shared by authorized neighbors
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('rent')}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#9B7EBD] hover:text-[#3B1E54] group cursor-pointer"
                    >
                      <span>View catalog</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentlyListed.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        isSaved={savedItemIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        onSelect={(i) => setSelectedItemForModal(i)}
                        onRentClick={(i) => handleRentItem(i)}
                        onExchangeClick={(i) => handleProposeExchange(i)}
                        currentUserId={currentUser?.id}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setActiveTab('rent')}
                      className="px-6 py-3 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                    >
                      Explore All Rental & Exchange Gear
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: RENT RESOURCES SECTION */}
        {activeTab === 'rent' && (
          <RentSection
            items={items}
            savedItemIds={savedItemIds}
            currentUser={currentUser}
            categories={displayCategories}
            onToggleSave={handleToggleSave}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onRentItem={(item) => handleRentItem(item)}
            onExchangeItem={(item) => handleProposeExchange(item)}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {/* TAB 3: EXCHANGE HUB (BARTER) */}
        {activeTab === 'exchange' && (
          <ExchangeSection
            items={items}
            savedItemIds={savedItemIds}
            currentUser={currentUser}
            categories={displayCategories}
            onToggleSave={handleToggleSave}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onProposeExchange={(item) => handleProposeExchange(item)}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {/* TAB 4: USER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            items={items}
            proposals={proposals}
            bookings={bookings}
            savedItemIds={savedItemIds}
            onOpenUpload={handleOpenUpload}
            onOpenChat={handleOpenChatByPartner}
            onOpenProfile={handleOpenProfile}
            onSelectItem={(item) => setSelectedItemForModal(item)}
            onToggleItemAvailability={handleToggleItemAvailability}
            onDeleteItem={handleDeleteItem}
            onUpdateItemPrice={handleUpdateItemPrice}
            onAcceptProposal={handleAcceptProposal}
            onDeclineProposal={handleDeclineProposal}
            onRemoveSaved={handleToggleSave}
            onOpenAuth={handleOpenAuth}
            onEditItem={handleEditItem}
          />
        )}

      </main>

      {/* JITTER-STYLE EXPANDABLE FLOATING ACTION MENU AT BOTTOM RIGHT */}
      <FloatingActionMenu
        onOpenUpload={handleOpenUpload}
        onNavigateToRent={() => setActiveTab('rent')}
        onNavigateToExchange={() => setActiveTab('exchange')}
      />

      {/* Global Interactive Modals with smooth AnimatePresence opening/closing animations */}
      <AnimatePresence>
        {/* 1. Item Details Modal - Guests can freely view items */}
        {selectedItemForModal && (
          <ItemDetailModal
            key="item-detail-modal"
            item={selectedItemForModal}
            onClose={() => setSelectedItemForModal(null)}
            currentUser={currentUser}
            isSaved={savedItemIds.includes(selectedItemForModal.id)}
            onToggleSave={handleToggleSave}
            onRentClick={handleRentItem}
            onProposeExchange={handleProposeExchange}
            onStartChat={handleStartChat}
            onOpenProfile={handleOpenProfile}
            onEditItem={handleEditItem}
          />
        )}

        {/* 2. Propose Exchange Modal */}
        {exchangeTargetItem && (
          <ProposeExchangeModal
            key="propose-exchange-modal"
            targetItem={exchangeTargetItem}
            currentUser={currentUser}
            userItems={currentUser ? items.filter((i) => i.owner.id === currentUser.id) : []}
            onClose={() => setExchangeTargetItem(null)}
            onSubmitProposal={handleSubmitProposal}
            onOpenAuth={() => handleOpenAuth('exchange', 'signup')}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {/* 3. Rental Checkout Modal */}
        {rentTargetItem && (
          <RentalCheckoutModal
            key="rental-checkout-modal"
            item={rentTargetItem}
            bookingConfig={rentBookingConfig}
            currentUser={currentUser}
            onClose={() => setRentTargetItem(null)}
            onConfirmBooking={handleConfirmBooking}
            onOpenAuth={() => handleOpenAuth('buy', 'signup')}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {/* 4. Upload Resource Wizard Modal - Supports both new listings and editing existing ones */}
        {isUploadOpen && (
          <UploadResourceModal
            key="upload-resource-modal"
            currentUser={currentUser}
            availableCategories={displayCategories}
            onClose={() => {
              setIsUploadOpen(false);
              setEditingItem(null);
            }}
            onAddListing={handleAddListing}
            onOpenAuth={(reason, mode) => handleOpenAuth(reason || 'upload', mode || 'signup')}
            itemToEdit={editingItem}
            onUpdateListing={handleUpdateListing}
          />
        )}

        {/* 5. Live Chat Modal - Requires Sign In / Sign Up */}
        {isChatOpen && (
          <ChatModal
            key="chat-modal"
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            currentUser={currentUser}
            conversations={conversations}
            activeConvId={activeChatConvId || (conversations[0]?.id || '')}
            setActiveConvId={setActiveChatConvId}
            onSendMessage={handleSendMessage}
            onSelectItem={(itemId) => {
              const found = items.find((i) => i.id === itemId);
              if (found) setSelectedItemForModal(found);
            }}
            onOpenAuth={(reason, mode) => handleOpenAuth(reason || 'message', mode || 'signin')}
          />
        )}

        {/* 6. Auth Modal with Firebase & Sign In / Sign Up */}
        {isAuthOpen && (
          <AuthModal
            key="auth-modal"
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            actionReason={authModalReason}
            initialMode={authModalMode}
            currentUser={currentUser}
            onSelectUser={(u) => {
              setCurrentUser(u);
              setIsAuthOpen(false);
              setToast({
                id: `toast_${Date.now()}`,
                type: 'success',
                title: `Welcome, ${u.name}!`,
                message: 'Signed in successfully with your Google / Firebase account.',
              });
            }}
          />
        )}

        {/* 7. Profile & Phone Verification Modal */}
        {isProfileOpen && (
          <UserProfileModal
            key="user-profile-modal"
            isOpen={isProfileOpen}
            currentUser={currentUser}
            initialTab={profileInitialTab}
            highlightPhoneRequired={profileHighlightPhone}
            onClose={() => {
              setIsProfileOpen(false);
              setProfileHighlightPhone(false);
            }}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              setToast({
                id: `toast_${Date.now()}`,
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile details and contact number have been saved to your account.',
              });
            }}
            onNavigateHome={() => {
              setActiveTab('home');
              setIsProfileOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Global Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Site Footer - Hidden when user is inside account window / profile modal */}
      {!isProfileOpen && activeTab !== 'dashboard' && <Footer />}

    </div>
  );
}

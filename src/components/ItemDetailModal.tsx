import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Heart,
  Share2,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Sparkles,
  Lock,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera
} from 'lucide-react';
import { Item, User } from '../types';
import { InteractiveDescriptionViewer } from './InteractiveDescriptionViewer';

interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
  currentUser: User | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onRentClick: (item: Item, bookingConfig?: any) => void;
  onProposeExchange: (item: Item) => void;
  onStartChat: (item: Item) => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
  onEditItem?: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  currentUser,
  isSaved,
  onToggleSave,
  onRentClick,
  onProposeExchange,
  onStartChat,
  onOpenProfile,
  onEditItem,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'owner'>('overview');
  
  // Interactive image preview lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Interactive rental calculator state
  const [rentalDays, setRentalDays] = useState(item?.minRentalDays || 2);
  const [selectedPickup, setSelectedPickup] = useState(item?.location?.pickupOptions?.[0] || 'Self Pickup');

  // Key listener for closing lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setLightboxZoom(1);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, onClose]);

  if (!item) return null;

  // Robust check to determine if current user owns this product
  const isOwner = Boolean(
    currentUser && (
      (item.owner?.id && item.owner.id === currentUser.id) ||
      ((currentUser as any).uid && item.owner?.id === (currentUser as any).uid) ||
      ((item as any).ownerId && (item as any).ownerId === currentUser.id) ||
      ((item as any).ownerId && (currentUser as any).uid && (item as any).ownerId === (currentUser as any).uid) ||
      ((item as any).ownerEmail && currentUser.email && (item as any).ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      ((item.owner as any)?.email && currentUser.email && (item.owner as any).email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (item.owner?.name && currentUser.name && item.owner.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
    )
  );

  const isRentable = item.listingType === 'rent' || item.listingType === 'both';
  const isExchangeable = item.listingType === 'exchange' || item.listingType === 'both';

  // Financial calculations
  const rentSubtotal = item.priceDaily * rentalDays;
  const serviceFee = Math.round(rentSubtotal * 0.1);
  const totalDue = rentSubtotal + item.depositAmount + serviceFee;

  const currentPhoto = item.images[selectedPhotoIdx] || item.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[var(--theme-accent-light)] max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10"
      >
        
        {/* Sticky top action bar */}
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-md px-6 py-3.5 border-b border-[var(--theme-accent-light)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)]">
            <span className="font-bold text-[var(--theme-deep)] capitalize">{item.category}</span>
            <span>·</span>
            <span className="text-[var(--theme-primary)] font-semibold">Community Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(item.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-[#E76F51] text-white border-[#E76F51]' 
                  : 'bg-white text-[#5C4B6E] border-[#D4BEE4] hover:text-[#E76F51]'
              }`}
              title="Save item"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#EEEEEE] text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/30 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Media Gallery & Full Description */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Media Gallery Header: Photo Indicator & Fullscreen Lightbox Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3B1E54]">
                  <Camera className="w-4 h-4 text-[#9B7EBD]" />
                  <span>Item Photos ({item.images.length})</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(true);
                    setLightboxZoom(1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#3B1E54] hover:bg-[#D4BEE4]/30 rounded-xl transition-colors cursor-pointer border border-[#D4BEE4]"
                  title="Open full image preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Preview Image</span>
                </button>
              </div>

              {/* Photo Gallery Container */}
              <div className="space-y-3">
                <div 
                  onClick={() => {
                    setIsLightboxOpen(true);
                    setLightboxZoom(1);
                  }}
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#EEEEEE] border border-[#D4BEE4] shadow-xs group cursor-zoom-in"
                >
                  <img
                    src={currentPhoto}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />

                  {/* Condition Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                    Condition: {item.condition}
                  </div>

                  {/* Click to Preview Overlay Hint */}
                  <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-[#D4BEE4]" />
                    <span>Preview Image</span>
                  </div>
                </div>

                {/* Thumbnails row if multiple images */}
                {item.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {item.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          selectedPhotoIdx === idx 
                            ? 'border-[#9B7EBD] ring-2 ring-[#9B7EBD]/30 shadow-xs' 
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs: Overview, Rules & Terms, Owner Profile */}
              <div>
                <div className="flex items-center gap-2 border-b border-[#D4BEE4]/40 pb-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4]'
                        : 'text-[#5C4B6E] hover:text-[#3B1E54]'
                    }`}
                  >
                    Overview & Details
                  </button>
                  <button
                    onClick={() => setActiveTab('terms')}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                      activeTab === 'terms'
                        ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4]'
                        : 'text-[#5C4B6E] hover:text-[#3B1E54]'
                    }`}
                  >
                    Deposit & Rules
                  </button>
                  <button
                    onClick={() => setActiveTab('owner')}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                      activeTab === 'owner'
                        ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4]'
                        : 'text-[#5C4B6E] hover:text-[#3B1E54]'
                    }`}
                  >
                    Owner Profile
                  </button>
                </div>

                <div className="pt-4">
                  {activeTab === 'overview' && (
                    <div className="space-y-5">
                      <div>
                        {/* Larger, Prominent Product Title */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B1E54] tracking-tight">
                          {item.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-[#5C4B6E] mt-1.5 font-medium">
                          <span className="font-bold text-[#9B7EBD] capitalize">{item.category}</span>
                          <span>·</span>
                          <span>Condition: {item.condition}</span>
                          <span>·</span>
                          <span>Min: {item.minRentalDays} day{item.minRentalDays > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Interactive Eye-Catching Description: Short Paragraph & Key Bullets on Next Line */}
                      <InteractiveDescriptionViewer description={item.description} />

                      {/* Preferred Exchange Wishlist Banner */}
                      {isExchangeable && item.preferredExchangeItems && item.preferredExchangeItems.length > 0 && (
                        <div className="p-4 rounded-2xl bg-[#D4BEE4]/30 border border-[#D4BEE4]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-[#3B1E54] uppercase tracking-wider flex items-center gap-1.5">
                              <RefreshCw className="w-4 h-4 text-[#9B7EBD]" />
                              Exchange Wishlist
                            </span>

                            {isOwner && (
                              <span className="text-xs font-bold text-[#3B1E54] bg-white px-2.5 py-0.5 rounded-full border border-[#D4BEE4]">
                                Your Listing
                              </span>
                            )}
                          </div>

                          <ul className="space-y-1.5">
                            {item.preferredExchangeItems.map((wish, idx) => (
                              <li key={idx} className="text-sm text-[#3B1E54] font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#9B7EBD]" />
                                <span>{wish}</span>
                              </li>
                            ))}
                          </ul>

                          {item.exchangeNotes && (
                            <p className="text-xs text-[#5C4B6E] mt-2.5 pt-2 border-t border-[#D4BEE4]/50 italic">
                              "{item.exchangeNotes}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Handover Methods */}
                      <div>
                        <h4 className="text-sm font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                          Handover Options
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {item.location.pickupOptions.map((opt, i) => (
                            <div key={i} className="p-3 rounded-xl border border-[#D4BEE4] bg-white text-sm">
                              <span className="font-bold text-[#3B1E54] block">{opt}</span>
                              <span className="text-xs text-[#715F85]">Local verified</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'terms' && (
                    <div className="space-y-4 text-sm text-[#5C4B6E]">
                      <div className="p-4 rounded-2xl bg-white border border-[#D4BEE4] space-y-2">
                        <h4 className="font-bold text-[#3B1E54] text-base">Security Deposit</h4>
                        <p className="leading-relaxed">
                          A refundable security deposit of <strong>{item.currencySymbol || '₹'}{item.depositAmount}</strong> is held securely and returned upon handover.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-[#D4BEE4] space-y-2">
                        <h4 className="font-bold text-[#3B1E54] text-base">Community Guidelines</h4>
                        <p className="leading-relaxed">
                          Handle borrowed gear with care and return items clean and on schedule.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'owner' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#D4BEE4]">
                        <img
                          src={item.owner.avatar}
                          alt={item.owner.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-[#9B7EBD]/30"
                        />
                        <div>
                          <h4 className="font-bold text-[#3B1E54] text-base">{item.owner.name}</h4>
                          <p className="text-xs text-[#5C4B6E]">Member since {item.owner.memberSince}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#3B1E54]">
                            <Star className="w-3.5 h-3.5 fill-current text-[#E76F51]" />
                            <span>{item.owner.rating} ({item.owner.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Price, Checkout & Actions */}
            <div className="lg:col-span-5">
              <div className="sticky top-20 glass-card bg-white/90 border border-[var(--theme-accent-light)] rounded-3xl p-6 space-y-5 shadow-sm">
                
                {/* Price Display */}
                <div>
                  <span className="text-xs text-[var(--theme-text-muted)] font-bold uppercase tracking-wider block mb-1">
                    {isRentable ? 'Rental Rate' : 'Exchange Listing'}
                  </span>
                  {isRentable ? (
                    <div>
                      <span className="text-3xl font-black text-[var(--theme-deep)] font-['Plus_Jakarta_Sans']">
                        {item.priceRateText || `${item.currencySymbol || '₹'}${item.priceDaily} / day`}
                      </span>
                      {item.availableTimeWindow && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--theme-primary)] font-semibold mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.availableTimeWindow}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-bold text-[var(--theme-deep)]">Community Barter</span>
                      <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">Offer an item from your collection to swap.</p>
                    </div>
                  )}
                </div>

                {/* Owner Mode vs Borrower Actions */}
                {isOwner ? (
                  <div className="space-y-3.5 pt-1">
                    <div className="p-4 bg-[var(--theme-accent-light)] border border-[var(--theme-accent)]/50 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[var(--theme-deep)] font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
                        <span>Your Listed Product</span>
                      </div>
                      <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                        You own this listing. Only other community members can rent or exchange it.
                      </p>
                    </div>

                    {onEditItem && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditItem(item);
                        }}
                        className="w-full py-3 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit This Listing</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 bg-white border border-[#D4BEE4] hover:border-[#9B7EBD] text-[#3B1E54] rounded-xl text-xs font-semibold transition-all text-center cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Rental Duration Selector */}
                    {isRentable && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-[#3B1E54] mb-2">
                            Rental Duration: <span className="text-[#9B7EBD] font-black">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 5, 7].map((days) => (
                              <button
                                key={days}
                                type="button"
                                onClick={() => setRentalDays(days)}
                                className={`flex-1 py-2 text-sm rounded-xl font-bold border transition-all cursor-pointer ${
                                  rentalDays === days
                                    ? 'bg-[#3B1E54] border-[#3B1E54] text-white shadow-xs'
                                    : 'bg-white border-[#D4BEE4] text-[#5C4B6E] hover:border-[#9B7EBD]'
                                }`}
                              >
                                {days}d
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Handover Option */}
                        <div>
                          <label className="block text-sm font-bold text-[#3B1E54] mb-1.5">
                            Handover Method
                          </label>
                          <select
                            value={selectedPickup}
                            onChange={(e) => setSelectedPickup(e.target.value as any)}
                            className="w-full px-3 py-2.5 text-sm bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#9B7EBD] cursor-pointer"
                          >
                            {item.location.pickupOptions.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-[#EEEEEE]/50 rounded-2xl border border-[#D4BEE4]/60 p-4 space-y-2.5 text-sm">
                          <div className="flex justify-between text-[#5C4B6E]">
                            <span>{item.currencySymbol || '₹'}{item.priceDaily} × {rentalDays} days</span>
                            <span className="font-bold text-[#3B1E54]">{item.currencySymbol || '₹'}{rentSubtotal}</span>
                          </div>
                          <div className="flex justify-between text-[#5C4B6E]">
                            <span>Protection Fee (10%)</span>
                            <span className="font-bold text-[#3B1E54]">{item.currencySymbol || '₹'}{serviceFee}</span>
                          </div>
                          <div className="flex justify-between text-[#5C4B6E] pt-2 border-t border-[#D4BEE4]/40">
                            <span>Refundable Deposit</span>
                            <span className="font-bold text-[#3B1E54]">{item.currencySymbol || '₹'}{item.depositAmount}</span>
                          </div>
                          <div className="flex justify-between text-base font-black text-[#3B1E54] pt-2.5 border-t border-[#D4BEE4]/40">
                            <span>Total Due</span>
                            <span className="text-xl text-[#3B1E54] font-['Plus_Jakarta_Sans']">{item.currencySymbol || '₹'}{totalDue}</span>
                          </div>
                        </div>

                        {/* Book Now Button */}
                        <button
                          type="button"
                          onClick={() => onRentClick(item, { rentalDays, selectedPickup, totalDue })}
                          className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer bg-[var(--theme-deep)] hover:opacity-95 text-white hover:shadow-[0_0_20px_var(--theme-glow)]`}
                        >
                          {!currentUser ? (
                            <>
                              <Lock className="w-4 h-4 text-[var(--theme-accent-light)]" />
                              <span>Sign In to Rent Item</span>
                            </>
                          ) : (
                            <>
                              <span>Proceed to Rent & Pay</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Secondary Actions: Chat or Propose Exchange (Only for non-owners) */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onStartChat(item)}
                        className="w-full py-2.5 px-4 bg-white/80 border border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_12px_var(--theme-glow)]"
                      >
                        {!currentUser ? <Lock className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" /> : <MessageSquare className="w-4 h-4 text-[var(--theme-text-muted)]" />}
                        <span>{!currentUser ? 'Sign In to Message Owner' : `Chat with Owner (${item.owner.name.split(' ')[0]})`}</span>
                      </button>

                      {isExchangeable && !isOwner && (
                        <button
                          type="button"
                          onClick={() => onProposeExchange(item)}
                          className="w-full py-2.5 px-4 bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent)]/30 text-[var(--theme-deep)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-[var(--theme-accent)]/50 hover:shadow-[0_0_15px_var(--theme-glow)]"
                        >
                          {!currentUser ? <Lock className="w-3.5 h-3.5 text-[var(--theme-deep)]" /> : <RefreshCw className="w-4 h-4 text-[var(--theme-deep)]" />}
                          <span>{!currentUser ? 'Sign In to Propose Exchange' : 'Propose Barter / Exchange'}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Safe community guarantee */}
                <div className="pt-2 border-t border-[#D4BEE4]/40 flex items-center gap-2 text-xs text-[#5C4B6E]">
                  <ShieldCheck className="w-4 h-4 text-[#9B7EBD] shrink-0" />
                  <span>Backed by ResourceBox Guarantee</span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </motion.div>

      {/* Interactive High-Res Image Preview Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => {
                setIsLightboxOpen(false);
                setLightboxZoom(1);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            >
              {/* Lightbox Controls Top Bar */}
              <div className="w-full flex items-center justify-between pb-3 px-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{item.title}</span>
                  {item.images.length > 1 && (
                    <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-md">
                      {selectedPhotoIdx + 1} of {item.images.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.25))}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxZoom((z) => Math.max(0.75, z - 0.25))}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxZoom(1)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLightboxOpen(false);
                      setLightboxZoom(1);
                    }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Lightbox Image Viewport */}
              <div className="relative w-full aspect-[16/10] max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/50 border border-white/10">
                <img
                  src={currentPhoto}
                  alt={item.title}
                  style={{ transform: `scale(${lightboxZoom})` }}
                  className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                />

                {/* Left/Right Photo Navigation if multiple */}
                {item.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIdx((prev) => (prev > 0 ? prev - 1 : item.images.length - 1));
                        setLightboxZoom(1);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIdx((prev) => (prev < item.images.length - 1 ? prev + 1 : 0));
                        setLightboxZoom(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      title="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

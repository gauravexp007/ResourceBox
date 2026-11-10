import React, { useState } from 'react';
import { 
  PlusCircle, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  Heart, 
  Trash2, 
  Edit3, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  Star,
  Package,
  Layers,
  ArrowRight,
  User as UserIcon,
  Phone,
  AlertCircle,
  MapPin,
  Globe,
  Coins
} from 'lucide-react';
import { User, Item, ExchangeProposal, RentalBooking } from '../types';
import { AuthActionReason } from './AuthModal';
import { getCurrencySymbol } from '../utils/currency';

interface UserDashboardProps {
  currentUser: User | null;
  items: Item[];
  proposals: ExchangeProposal[];
  bookings: RentalBooking[];
  savedItemIds: string[];
  onOpenUpload: () => void;
  onOpenChat: (convPartnerId?: string, itemId?: string) => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
  onSelectItem: (item: Item) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onRemoveSaved: (itemId: string) => void;
  onOpenAuth?: (reason?: AuthActionReason, mode?: 'signin' | 'signup') => void;
  onEditItem?: (item: Item) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  items,
  proposals,
  bookings,
  savedItemIds,
  onOpenUpload,
  onOpenChat,
  onOpenProfile,
  onSelectItem,
  onToggleItemAvailability,
  onDeleteItem,
  onUpdateItemPrice,
  onAcceptProposal,
  onDeclineProposal,
  onRemoveSaved,
  onOpenAuth,
  onEditItem,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'proposals' | 'rentals' | 'saved'>('listings');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(0);

  if (!currentUser) {
    return (
      <div className="py-16 bg-[#EEEEEE] min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#D4BEE4] p-8 text-center shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center shadow-xs">
            <Package className="w-8 h-8 text-[#9B7EBD]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#3B1E54] font-sans">
              Sign In to Your Dashboard
            </h2>
            <p className="text-xs text-[#715F85] mt-2 leading-relaxed">
              Track your listed equipment, view incoming rental requests, monitor exchange proposals, and chat securely with other community members.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onOpenAuth?.('general', 'signin')}
              className="flex-1 py-3 px-4 rounded-xl border border-[#D4BEE4] hover:border-[#3B1E54] text-xs font-bold text-[#3B1E54] hover:bg-[#FAF8FC] transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth?.('general', 'signup')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold shadow-md shadow-[#3B1E54]/20 transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter listings belonging to this user
  const myListings = items.filter((i) => i.owner.id === currentUser.id);

  // Filter proposals
  const receivedProposals = proposals.filter((p) => p.itemOwnerId === currentUser.id);
  const sentProposals = proposals.filter((p) => p.proposerId === currentUser.id);

  // Filter bookings
  const lentOutBookings = bookings.filter((b) => b.ownerId === currentUser.id);
  const borrowedBookings = bookings.filter((b) => b.renterId === currentUser.id);

  // Filter saved items
  const savedItems = items.filter((i) => savedItemIds.includes(i.id));

  // Cumulative earnings calculation from real fulfilled bookings
  const totalEarned = lentOutBookings.reduce((sum, b) => sum + b.rentalTotal, 0);
  const currency = getCurrencySymbol(currentUser);

  return (
    <div className="py-8 bg-[#EEEEEE] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Header Card */}
        <div className="bg-white rounded-3xl border border-[#D4BEE4] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#D4BEE4]"
              />
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#3B1E54] font-sans">
                    {currentUser.name}
                  </h1>
                  {currentUser.username && (
                    <span className="text-xs font-semibold text-[#715F85] bg-[#D4BEE4]/25 px-2 py-0.5 rounded-md">
                      {currentUser.username.startsWith('@') ? currentUser.username : `@${currentUser.username}`}
                    </span>
                  )}
                  {currentUser.verified && (
                    <span className="p-1 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54]" title="ID Verified Neighbor">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B1E54] bg-[#D4BEE4]/40 px-2.5 py-0.5 rounded-full border border-[#D4BEE4]" title="Permanently registered and authorized in database">
                    <CheckCircle2 className="w-3 h-3 text-[#9B7EBD]" />
                    Already Registered
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#715F85] font-medium">
                  {/* Phone Status */}
                  {currentUser.phoneNumber ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B1E54] bg-[#D4BEE4]/35 px-2.5 py-0.5 rounded-full border border-[#D4BEE4]">
                      <CheckCircle2 className="w-3 h-3 text-[#9B7EBD]" />
                      <span>{currentUser.phoneNumber}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenProfile?.(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#715F85] bg-[#D4BEE4]/20 hover:bg-[#D4BEE4]/40 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                      title="Add contact number for pickup coordination"
                    >
                      <span>+ Add Contact Number</span>
                    </button>
                  )}

                  {/* Location & Country */}
                  {(currentUser.country || currentUser.city || currentUser.location) && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--theme-deep)] bg-white border border-[var(--theme-accent-light)] px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-[var(--theme-primary)]" />
                      <span>
                        {currentUser.city ? `${currentUser.city}, ${currentUser.state ? `${currentUser.state} ` : ''}${currentUser.pincode ? `(${currentUser.pincode})` : ''}` : currentUser.location}
                        {currentUser.country ? `, ${currentUser.country}` : ''}
                      </span>
                    </span>
                  )}

                  {/* Currency */}
                  {currentUser.currency && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B1E54] bg-[#FAF8FC] border border-[#D4BEE4] px-2 py-0.5 rounded-md">
                      <Coins className="w-3 h-3 text-[#9B7EBD]" />
                      <span>{currentUser.currency} {currentUser.currencyCode ? `(${currentUser.currencyCode})` : ''}</span>
                    </span>
                  )}

                  {/* Gender */}
                  {currentUser.gender && currentUser.gender !== 'Prefer not to say' && (
                    <span className="text-[11px] text-[#715F85] bg-[#FAF8FC] border border-[#D4BEE4] px-2 py-0.5 rounded-md">
                      {currentUser.gender}
                    </span>
                  )}

                  <span>·</span>
                  <span>Member since {currentUser.memberSince}</span>
                </div>

                <p className="text-xs text-[#715F85] mt-1 max-w-xl leading-relaxed">
                  {currentUser.bio || 'ResourceBox verified community member.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenProfile?.(false)}
                className="py-2.5 px-3.5 bg-white border border-[#D4BEE4] hover:border-[#3B1E54] text-[#3B1E54] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#9B7EBD]" />
                <span>Edit Profile & Verification</span>
              </button>

              <button
                type="button"
                onClick={onOpenUpload}
                className="py-2.5 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#D4BEE4]" />
                <span>List New Resource</span>
              </button>
            </div>
          </div>

          {/* Stats Bar (Unboxed metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 mt-6 border-t border-[#D4BEE4]/40 text-center sm:text-left">
            <div>
              <div className="text-xs text-[#715F85]">Community Earnings</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#3B1E54] mt-0.5">{currency}{totalEarned}</div>
            </div>
            <div>
              <div className="text-xs text-[#715F85]">Active Listings</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#3B1E54] mt-0.5">{myListings.length}</div>
            </div>
            <div>
              <div className="text-xs text-[#715F85]">Pending Swaps</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#9B7EBD] mt-0.5">{receivedProposals.filter(p => p.status === 'pending').length}</div>
            </div>
            <div>
              <div className="text-xs text-[#715F85]">Active Bookings</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#3B1E54] mt-0.5">{lentOutBookings.length + borrowedBookings.length}</div>
            </div>
            <div>
              <div className="text-xs text-[#715F85]">CO₂ Avoided</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#9B7EBD] mt-0.5">
                {myListings.length * 8 + (lentOutBookings.length + borrowedBookings.length) * 15} kg
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Segmented Bar */}
        <div className="bg-white rounded-2xl border border-[#D4BEE4] p-1.5 flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'listings'
                ? 'bg-[#3B1E54] text-white shadow-xs'
                : 'text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            My Listings ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
              activeTab === 'proposals'
                ? 'bg-[#3B1E54] text-white shadow-xs'
                : 'text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            Exchange Proposals ({receivedProposals.length + sentProposals.length})
            {receivedProposals.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-[#9B7EBD] text-white rounded-full text-[10px]">
                {receivedProposals.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'rentals'
                ? 'bg-[#3B1E54] text-white shadow-xs'
                : 'text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            Active Rentals ({lentOutBookings.length + borrowedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'saved'
                ? 'bg-[#3B1E54] text-white shadow-xs'
                : 'text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            Saved Items ({savedItems.length})
          </button>
        </div>

        {/* TAB 1: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#3B1E54]">
                Resources Circulating Under Your Profile ({myListings.length})
              </h3>
              <button
                onClick={onOpenUpload}
                className="text-xs font-semibold text-[#3B1E54] hover:text-[#9B7EBD] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#9B7EBD]" />
                <span>Add another resource</span>
              </button>
            </div>

            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#D4BEE4] p-4 flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF8FC] mb-3">
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        <span
                          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.isAvailable ? 'bg-[#3B1E54] text-white' : 'bg-black/60 text-white'
                          }`}
                        >
                          {item.isAvailable ? 'Active' : 'Paused'}
                        </span>
                        <span className="absolute top-2 right-2 text-[10px] bg-white/90 text-[#3B1E54] font-semibold px-2 py-0.5 rounded">
                          {item.viewsCount} views
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#3B1E54] truncate">{item.title}</h4>
                      <p className="text-xs text-[#715F85] capitalize mt-0.5">
                        {item.category} · {item.condition} · {item.listingType}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-[#FAF8FC] border border-[#D4BEE4]/50 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#715F85]">Daily Price:</span>
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={newPriceValue}
                                onChange={(e) => setNewPriceValue(Number(e.target.value))}
                                className="w-16 px-1.5 py-0.5 text-xs border border-[#3B1E54] rounded bg-white text-[#3B1E54]"
                              />
                              <button
                                onClick={() => {
                                  onUpdateItemPrice(item.id, newPriceValue);
                                  setEditingPriceId(null);
                                }}
                                className="px-2 py-0.5 bg-[#3B1E54] text-white rounded text-[11px]"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#3B1E54]">
                                {item.priceRateText || `${item.currencySymbol || currency}${item.priceDaily}/day`}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setNewPriceValue(item.priceDaily);
                                }}
                                className="text-[11px] text-[#9B7EBD] hover:underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                        {item.availableTimeWindow && (
                          <div className="flex items-center justify-between mt-1 text-[#3B1E54] font-semibold text-[11px]">
                            <span>Available Hours:</span>
                            <span>{item.availableTimeWindow}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1 text-[#715F85]">
                          <span>Security deposit:</span>
                          <span>{item.currencySymbol || currency}{item.depositAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D4BEE4]/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleItemAvailability(item.id)}
                        className="py-1.5 px-2.5 rounded-lg border border-[#D4BEE4] text-xs text-[#715F85] hover:bg-[#FAF8FC] flex items-center gap-1"
                      >
                        {item.isAvailable ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5 text-[#9B7EBD]" />}
                        <span>{item.isAvailable ? 'Pause' : 'Activate'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="py-1.5 px-2.5 rounded-lg bg-[#FAF8FC] border border-[#D4BEE4] text-[#3B1E54] text-xs font-semibold hover:bg-white cursor-pointer transition-colors"
                        >
                          View
                        </button>
                        {onEditItem && (
                          <button
                            onClick={() => onEditItem(item)}
                            className="py-1.5 px-2.5 rounded-lg bg-[#D4BEE4]/40 text-[#3B1E54] text-xs font-bold hover:bg-[#D4BEE4]/60 border border-[#D4BEE4] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Edit listing details, price, condition & photos"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-[#C84A3B] hover:bg-[#FFF5F4] cursor-pointer transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D4BEE4] p-10 text-center">
                <Package className="w-10 h-10 text-[#715F85] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#3B1E54]">You have no active listings</h4>
                <p className="text-xs text-[#715F85] mt-1 mb-4">
                  Share a power tool, camera, bike, or tent from your home to start earning.
                </p>
                <button
                  onClick={onOpenUpload}
                  className="py-2 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  List Your First Resource
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROPOSALS */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {/* Received Proposals */}
            <div>
              <h3 className="text-base font-bold text-[#3B1E54] mb-3">
                Incoming Barter Proposals ({receivedProposals.length})
              </h3>
              
              {receivedProposals.length > 0 ? (
                <div className="space-y-3">
                  {receivedProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white rounded-2xl border border-[#D4BEE4] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={prop.offeredItemImage}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#D4BEE4]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#3B1E54]">
                              {prop.proposerName}
                            </span>
                            <span className="text-xs text-[#715F85]">wants to exchange for your</span>
                            <span className="text-xs font-bold text-[#3B1E54]">{prop.itemTitle}</span>
                          </div>

                          <div className="mt-1 text-xs">
                            <span className="text-[#715F85]">Offering: </span>
                            <strong className="text-[#3B1E54]">{prop.offeredItemTitle}</strong>
                            <span className="text-[#715F85]"> ({prop.offeredItemCondition})</span>
                            {prop.cashTopUp > 0 && (
                              <span className="ml-2 font-bold text-[#3B1E54] bg-[#D4BEE4]/40 px-1.5 py-0.5 rounded border border-[#D4BEE4]">
                                + ${prop.cashTopUp} Cash
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#3B1E54] bg-[#FAF8FC] p-2 rounded-lg mt-2 border border-[#D4BEE4]/40 italic">
                            "{prop.message}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                        {prop.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onAcceptProposal(prop.id)}
                              className="py-1.5 px-3 rounded-xl bg-[#3B1E54] text-white text-xs font-bold hover:bg-[#2A143D] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4BEE4]" />
                              <span>Accept Swap</span>
                            </button>
                            <button
                              onClick={() => onDeclineProposal(prop.id)}
                              className="py-1.5 px-3 rounded-xl border border-[#D4BEE4] text-[#C84A3B] text-xs font-semibold hover:bg-[#FFF5F4] cursor-pointer transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        ) : prop.status === 'accepted' ? (
                          <span className="text-xs font-bold text-[#3B1E54] bg-[#D4BEE4]/40 px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#D4BEE4]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#9B7EBD]" />
                            <span>Accepted</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[#C84A3B] bg-[#FFF5F4] px-2.5 py-1 rounded-full">
                            Declined
                          </span>
                        )}

                        <button
                          onClick={() => onOpenChat(prop.proposerId, prop.itemId)}
                          className="py-1.5 px-3 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#3B1E54] hover:bg-[#FAF8FC] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#715F85]" />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#D4BEE4] p-6 text-center text-xs text-[#715F85]">
                  No incoming exchange proposals currently pending.
                </div>
              )}
            </div>

            {/* Sent Proposals */}
            <div>
              <h3 className="text-base font-bold text-[#3B1E54] mb-3">
                Proposals Sent by You ({sentProposals.length})
              </h3>
              
              {sentProposals.length > 0 ? (
                <div className="space-y-3">
                  {sentProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white rounded-2xl border border-[#D4BEE4] p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img src={prop.itemImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[#3B1E54]">
                            You offered <span className="text-[#9B7EBD]">{prop.offeredItemTitle}</span> for {prop.itemTitle}
                          </div>
                          <span className="text-[11px] text-[#715F85]">
                            Sent to {prop.itemOwnerName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          prop.status === 'accepted'
                            ? 'bg-[#D4BEE4]/40 text-[#3B1E54] border border-[#D4BEE4]'
                            : prop.status === 'declined'
                            ? 'bg-[#FFF5F4] text-[#C84A3B]'
                            : 'bg-[#FAF8FC] text-[#715F85] border border-[#D4BEE4]'
                        }`}>
                          {prop.status.toUpperCase()}
                        </span>
                        <button
                          onClick={() => onOpenChat(prop.itemOwnerId, prop.itemId)}
                          className="p-1.5 rounded-lg border border-[#D4BEE4] hover:bg-[#FAF8FC] cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#715F85]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#D4BEE4] p-6 text-center text-xs text-[#715F85]">
                  You have not submitted any outgoing exchange proposals yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE RENTALS & BOOKINGS */}
        {activeTab === 'rentals' && (
          <div className="space-y-6">
            {/* Items I Am Renting Out */}
            <div>
              <h3 className="text-base font-bold text-[#3B1E54] mb-3">
                Items You Have Rented Out to Neighbors ({lentOutBookings.length})
              </h3>
              
              {lentOutBookings.length > 0 ? (
                <div className="space-y-3">
                  {lentOutBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#D4BEE4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img src={b.itemImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-[#3B1E54]">{b.itemTitle}</h4>
                          <div className="text-[11px] text-[#715F85] mt-0.5">
                            Renter: <strong className="text-[#3B1E54]">{b.renterName}</strong> · Dates: {b.startDate} to {b.endDate} ({b.durationDays} days)
                          </div>
                          <div className="text-xs font-extrabold text-[#3B1E54] mt-1">
                            Earned: ${b.rentalTotal} + ${b.depositAmount} security escrow
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] capitalize border border-[#D4BEE4]">
                          {b.status}
                        </span>
                        <button
                          onClick={() => onOpenChat(b.renterId, b.itemId)}
                          className="py-1.5 px-3 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#3B1E54] hover:bg-[#FAF8FC] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#715F85]" />
                          <span>Message Renter</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#D4BEE4] p-6 text-center text-xs text-[#715F85]">
                  No items currently reserved or checked out by neighbors.
                </div>
              )}
            </div>

            {/* Items I Am Borrowing */}
            <div>
              <h3 className="text-base font-bold text-[#3B1E54] mb-3">
                Items You Are Borrowing ({borrowedBookings.length})
              </h3>
              
              {borrowedBookings.length > 0 ? (
                <div className="space-y-3">
                  {borrowedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#D4BEE4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img src={b.itemImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-[#3B1E54]">{b.itemTitle}</h4>
                          <div className="text-[11px] text-[#715F85] mt-0.5">
                            Lender: <strong className="text-[#3B1E54]">{b.ownerName}</strong> · Return by: <strong className="text-[#3B1E54]">{b.endDate}</strong>
                          </div>
                          <div className="text-xs text-[#715F85] mt-1">
                            Total Paid: ${b.grandTotal} (${b.depositAmount} deposit returnable)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] capitalize border border-[#D4BEE4]">
                          {b.status}
                        </span>
                        <button
                          onClick={() => onOpenChat(b.ownerId, b.itemId)}
                          className="py-1.5 px-3 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#3B1E54] hover:bg-[#FAF8FC] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#715F85]" />
                          <span>Contact Lender</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#D4BEE4] p-6 text-center text-xs text-[#715F85]">
                  You have not reserved any active equipment rentals.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SAVED ITEMS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#3B1E54]">
              Saved Resources & Gear ({savedItems.length})
            </h3>
            
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#D4BEE4] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <img src={item.images[0]} alt="" className="w-full aspect-video rounded-xl object-cover mb-3" />
                      <h4 className="text-sm font-bold text-[#3B1E54] truncate">{item.title}</h4>
                      <p className="text-xs text-[#715F85] capitalize mt-0.5">{item.category} · {item.condition}</p>
                      <div className="text-xs font-extrabold text-[#3B1E54] mt-2">
                        ${item.priceDaily}/day · {item.condition}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D4BEE4]/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectItem(item)}
                        className="py-1.5 px-3 rounded-lg bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        View & Book
                      </button>
                      <button
                        onClick={() => onRemoveSaved(item.id)}
                        className="p-1.5 rounded-lg text-[#715F85] hover:text-[#C84A3B] cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D4BEE4] p-10 text-center">
                <Heart className="w-8 h-8 text-[#715F85] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#3B1E54]">No saved resources yet</h4>
                <p className="text-xs text-[#715F85] mt-1">
                  Click the heart icon on any tool or gear in the marketplace to bookmark it here.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

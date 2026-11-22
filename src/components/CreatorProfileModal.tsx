import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Grid3X3,
  Users,
  UserCheck,
  UserPlus,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Star,
  Copy,
  Check,
  RefreshCw,
  PackageOpen,
  AtSign,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Item, PublicUserProfile, User } from '../types';
import { getPublicCreatorProfile } from '../services/firebaseService';

interface CreatorProfileModalProps {
  isOpen: boolean;
  creatorId: string;
  initialCreator?: Partial<PublicUserProfile> | null;
  items: Item[];
  currentUser: User | null;
  followingIds: string[];
  onClose: () => void;
  onToggleFollow: (creator: { id: string; name?: string; username?: string; avatar?: string }) => Promise<void> | void;
  onSelectItem: (item: Item) => void;
  onStartChat: (item: Item) => void;
  onOpenSelfProfile: () => void;
  onSelectCreator: (creatorId: string) => void;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  creatorId,
  initialCreator,
  items,
  currentUser,
  followingIds,
  onClose,
  onToggleFollow,
  onSelectItem,
  onStartChat,
  onOpenSelfProfile,
  onSelectCreator,
}) => {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [followers, setFollowers] = useState<PublicUserProfile[]>([]);
  const [following, setFollowing] = useState<PublicUserProfile[]>([]);
  const [remoteItems, setRemoteItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts');
  const [postFilter, setPostFilter] = useState<'all' | 'rent' | 'exchange'>('all');
  const [isFollowBusy, setIsFollowBusy] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  const isOwnProfile = Boolean(currentUser && currentUser.id === creatorId);
  const isFollowing = followingIds.includes(creatorId);

  const creatorItems = useMemo(() => {
    const map = new Map<string, Item>();
    remoteItems.forEach((i) => {
      if (i?.id) map.set(i.id, i);
    });
    items
      .filter((i) => i.owner?.id === creatorId)
      .forEach((i) => {
        if (i?.id) map.set(i.id, i);
      });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [items, remoteItems, creatorId]);

  const filteredPosts = useMemo(() => {
    if (postFilter === 'rent') {
      return creatorItems.filter((i) => i.listingType === 'rent' || i.listingType === 'both');
    }
    if (postFilter === 'exchange') {
      return creatorItems.filter((i) => i.listingType === 'exchange' || i.listingType === 'both');
    }
    return creatorItems;
  }, [creatorItems, postFilter]);

  useEffect(() => {
    if (!isOpen || !creatorId) return;
    let active = true;
    setIsLoading(true);
    setActiveTab('posts');
    setPostFilter('all');
    setRemoteItems([]);

    getPublicCreatorProfile(creatorId, items)
      .then((res) => {
        if (!active) return;
        if (res.profile) {
          setProfile(res.profile);
        } else if (initialCreator) {
          setProfile({
            id: creatorId,
            name: initialCreator.name || 'Community Member',
            username: initialCreator.username,
            avatar: initialCreator.avatar || FALLBACK_AVATAR,
            bio: initialCreator.bio || '',
            city: initialCreator.city || '',
            neighborhood: initialCreator.neighborhood || '',
            verified: initialCreator.verified ?? true,
            rating: initialCreator.rating || 5,
            reviewCount: initialCreator.reviewCount || 0,
            memberSince: initialCreator.memberSince || 'October 2026',
            followersCount: initialCreator.followersCount || 0,
            followingCount: initialCreator.followingCount || 0,
            uploadsCount: creatorItems.length,
          });
        }
        setFollowers(res.followers || []);
        setFollowing(res.following || []);
        setRemoteItems(Array.isArray(res.items) ? res.items : []);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, creatorId, items.length, followingIds.length]);

  if (!isOpen) return null;

  const displayName = profile?.name || initialCreator?.name || creatorItems[0]?.owner?.name || 'Community Creator';
  const displayUsername =
    profile?.username || initialCreator?.username || creatorItems[0]?.owner?.username || '';
  const displayAvatar =
    profile?.avatar || initialCreator?.avatar || creatorItems[0]?.owner?.avatar || FALLBACK_AVATAR;
  const displayBio = profile?.bio || initialCreator?.bio || '';
  const displayLocation =
    [profile?.city || initialCreator?.city, profile?.state || initialCreator?.state]
      .filter(Boolean)
      .join(', ') ||
    profile?.neighborhood ||
    creatorItems[0]?.location?.city ||
    '';

  const handleFollowClick = async () => {
    if (isFollowBusy) return;
    setIsFollowBusy(true);
    try {
      await onToggleFollow({
        id: creatorId,
        name: displayName,
        username: displayUsername,
        avatar: displayAvatar,
      });
    } finally {
      setIsFollowBusy(false);
    }
  };

  const handleCopyHandle = () => {
    const text = displayUsername || displayName;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 1800);
  };

  const renderUserList = (list: PublicUserProfile[], emptyLabel: string) => {
    if (list.length === 0) {
      return (
        <div className="py-12 text-center space-y-2">
          <Users className="w-8 h-8 text-[var(--theme-primary)] mx-auto opacity-60" />
          <p className="text-xs font-semibold text-[var(--theme-text-muted)]">{emptyLabel}</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-[var(--theme-accent-light)] bg-white rounded-2xl border border-[var(--theme-accent-light)] overflow-hidden">
        {list.map((person) => {
          const isMe = currentUser?.id === person.id;
          const amFollowingPerson = followingIds.includes(person.id);
          return (
            <div
              key={person.id}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--theme-accent-light)]/25 transition-colors"
            >
              <button
                type="button"
                onClick={() => onSelectCreator(person.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
              >
                <img
                  src={person.avatar || FALLBACK_AVATAR}
                  alt={person.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--theme-accent-light)] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[var(--theme-deep)] truncate">
                      {person.username || person.name}
                    </span>
                    {person.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary)] shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--theme-text-muted)] truncate">
                    {person.name}
                    {person.uploadsCount > 0 ? ` · ${person.uploadsCount} uploads` : ''}
                  </div>
                </div>
              </button>

              {!isMe && (
                <button
                  type="button"
                  onClick={() =>
                    onToggleFollow({
                      id: person.id,
                      name: person.name,
                      username: person.username,
                      avatar: person.avatar,
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    amFollowingPerson
                      ? 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]'
                      : 'bg-[var(--theme-deep)] text-white hover:opacity-95'
                  }`}
                >
                  {amFollowingPerson ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full z-10 shadow-2xl border border-[var(--theme-accent-light)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.25), 0 0 28px var(--theme-glow)`,
        }}
      >
        {/* Instagram-Style Sticky Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-[var(--theme-accent-light)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm sm:text-base font-black text-[var(--theme-deep)] truncate">
                {displayUsername || displayName}
              </span>
              {(profile?.verified ?? true) && (
                <ShieldCheck className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {displayUsername && (
              <button
                type="button"
                onClick={handleCopyHandle}
                className="px-2.5 py-1.5 rounded-xl border border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] text-[11px] font-bold text-[var(--theme-deep)] flex items-center gap-1 cursor-pointer bg-white"
                title="Copy username"
              >
                {copiedHandle ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                    <span className="hidden sm:inline">{displayUsername}</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close creator profile"
              className="w-8 h-8 rounded-xl bg-[var(--theme-accent-light)]/50 hover:bg-red-50 text-[var(--theme-text-muted)] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 bg-[#FCFAFD]">
          {/* Instagram-Style Header Section */}
          <div className="bg-white px-4 sm:px-7 pt-5 pb-4 border-b border-[var(--theme-accent-light)] space-y-4">
            <div className="flex items-center gap-5 sm:gap-8">
              {/* Circular Avatar with Gradient Theme Ring */}
              <div
                className="p-[3px] rounded-full shrink-0 shadow-md"
                style={{
                  background: `linear-gradient(135deg, var(--theme-deep), var(--theme-primary), var(--theme-accent))`,
                }}
              >
                <div className="p-[2px] bg-white rounded-full">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Stats Row + Name */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* 3-Column Instagram Stats */}
                <div className="grid grid-cols-3 gap-2 text-center sm:text-left max-w-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab('posts')}
                    className="cursor-pointer group"
                  >
                    <div className="text-base sm:text-lg font-black text-[var(--theme-deep)] tabular-nums leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                      {creatorItems.length}
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--theme-text-muted)]">
                      Uploads
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('followers')}
                    className="cursor-pointer group"
                  >
                    <div className="text-base sm:text-lg font-black text-[var(--theme-deep)] tabular-nums leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                      {profile?.followersCount ?? followers.length}
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--theme-text-muted)]">
                      Followers
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('following')}
                    className="cursor-pointer group"
                  >
                    <div className="text-base sm:text-lg font-black text-[var(--theme-deep)] tabular-nums leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                      {profile?.followingCount ?? following.length}
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--theme-text-muted)]">
                      Following
                    </div>
                  </button>
                </div>

                {/* Rating & Member Badge */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)] px-2.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-[#E76F51] fill-current" />
                    <span>{profile?.rating ?? 5.0}</span>
                  </span>
                  {displayLocation && (
                    <span className="inline-flex items-center gap-1 text-[var(--theme-text-muted)] font-medium">
                      <MapPin className="w-3 h-3 text-[var(--theme-primary)]" />
                      <span className="truncate max-w-[180px]">{displayLocation}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio & Full Name Block (Instagram Style) */}
            <div className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-[var(--theme-deep)]">{displayName}</span>
                {displayUsername && (
                  <span className="text-xs font-bold text-[var(--theme-primary)] inline-flex items-center gap-0.5">
                    <AtSign className="w-3 h-3" />
                    {displayUsername.replace(/^@/, '')}
                  </span>
                )}
              </div>
              {displayBio ? (
                <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed whitespace-pre-line">
                  {displayBio}
                </p>
              ) : (
                <p className="text-xs text-[var(--theme-text-muted)]">
                  Sharing tools, cameras, and everyday gear on ResourceBox · Member since{' '}
                  {profile?.memberSince || 'October 2026'}
                </p>
              )}
            </div>

            {/* Action Buttons Row (Follow / Message / Edit Profile) */}
            <div className="flex items-center gap-2.5 pt-1">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSelfProfile();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Edit Your Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleFollowClick}
                    disabled={isFollowBusy}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      isFollowing
                        ? 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/30'
                        : 'bg-[var(--theme-deep)] text-white hover:opacity-95 hover:shadow-[0_0_16px_var(--theme-glow)]'
                    }`}
                  >
                    {isFollowBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isFollowing ? (
                      <UserCheck className="w-3.5 h-3.5" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    <span>{isFollowing ? 'Following · Receiving Upload Updates' : 'Follow for Upload Updates'}</span>
                  </button>

                  {creatorItems[0] && (
                    <button
                      type="button"
                      onClick={() => onStartChat(creatorItems[0])}
                      className="py-2.5 px-4 rounded-xl bg-white border border-[var(--theme-accent)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      <span>Message</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Instagram-Style Segmented Tabs */}
          <div className="bg-white border-b border-[var(--theme-accent-light)] grid grid-cols-3 sticky top-0 z-10">
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-[var(--theme-deep)] text-[var(--theme-deep)]'
                  : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Posts ({creatorItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('followers')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'followers'
                  ? 'border-[var(--theme-deep)] text-[var(--theme-deep)]'
                  : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Followers ({profile?.followersCount ?? followers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'following'
                  ? 'border-[var(--theme-deep)] text-[var(--theme-deep)]'
                  : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Following ({profile?.followingCount ?? following.length})</span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="p-3 sm:p-5">
            {isLoading && creatorItems.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[var(--theme-text-muted)]">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-primary)]" />
                <span>Loading creator profile...</span>
              </div>
            ) : activeTab === 'posts' ? (
              <div className="space-y-3">
                {/* Filter Strip */}
                {creatorItems.length > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {(['all', 'rent', 'exchange'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setPostFilter(f)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                            postFilter === f
                              ? 'bg-[var(--theme-deep)] text-white'
                              : 'bg-white text-[var(--theme-text-muted)] border border-[var(--theme-accent-light)] hover:text-[var(--theme-deep)]'
                          }`}
                        >
                          {f === 'all' ? 'All Uploads' : f === 'rent' ? 'For Rent' : 'Exchange'}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[var(--theme-text-muted)] font-medium">
                      Click any tile to inspect
                    </span>
                  </div>
                )}

                {/* Instagram 3-Column Square Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                    {filteredPosts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectItem(item);
                        }}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-[#EEEEEE] border border-[var(--theme-accent-light)] cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Listing Type Corner Indicator */}
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/65 text-white text-[10px] font-bold flex items-center gap-1">
                          {item.listingType === 'exchange' ? (
                            <RefreshCw className="w-2.5 h-2.5" />
                          ) : (
                            <span>{item.currencySymbol || '₹'}{item.priceDaily}</span>
                          )}
                        </div>

                        {/* Hover & Bottom Title Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white">
                          <div className="text-[11px] font-bold truncate leading-tight">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-white/80 truncate">
                            {item.listingType === 'exchange'
                              ? 'Barter Swap'
                              : item.priceRateText || `${item.currencySymbol || '₹'}${item.priceDaily}/day`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-white rounded-2xl border border-[var(--theme-accent-light)] space-y-2">
                    <PackageOpen className="w-9 h-9 text-[var(--theme-primary)] mx-auto opacity-65" />
                    <p className="text-xs font-bold text-[var(--theme-deep)]">No Products Uploaded Yet</p>
                    <p className="text-[11px] text-[var(--theme-text-muted)] max-w-xs mx-auto">
                      Follow {displayUsername || displayName} to get notified the moment they upload a new resource.
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'followers' ? (
              renderUserList(followers, 'No followers yet. Be the first to follow!')
            ) : (
              renderUserList(following, 'Not following anyone yet.')
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

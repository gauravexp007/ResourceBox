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
import { VerifiedBadge, isAdminAccount } from './VerifiedBadge';

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

const DEFAULT_ADMIN_BIO =
  'Official ResourceBox Admin & Community Hub.\nCurating trusted rentals, verified peer-to-peer swaps, and safe neighborhood sharing.\nDM anytime for verification help, featured listings, or community support.';

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
          const initialAdmin = isAdminAccount({
            id: creatorId,
            username: initialCreator.username,
            role: initialCreator.role,
            isAdmin: initialCreator.isAdmin,
          });
          setProfile({
            id: creatorId,
            name: initialCreator.name || (initialAdmin ? 'ResourceBox Official' : 'Community Member'),
            username: initialCreator.username,
            avatar: initialCreator.avatar || (initialAdmin ? '/admin-avatar.jpg' : FALLBACK_AVATAR),
            bio: initialCreator.bio || (initialAdmin ? DEFAULT_ADMIN_BIO : ''),
            city: initialCreator.city || '',
            neighborhood: initialCreator.neighborhood || '',
            verified: initialAdmin ? true : (initialCreator.verified ?? true),
            role: initialAdmin ? 'admin' : initialCreator.role,
            isAdmin: initialAdmin,
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

  const displayName =
    profile?.name || initialCreator?.name || creatorItems[0]?.owner?.name || 'Community Creator';
  const displayUsername =
    profile?.username || initialCreator?.username || creatorItems[0]?.owner?.username || '';
  const isAdmin = isAdminAccount({
    id: creatorId,
    username: displayUsername,
    role: profile?.role || initialCreator?.role || creatorItems[0]?.owner?.role,
    isAdmin: profile?.isAdmin || initialCreator?.isAdmin || creatorItems[0]?.owner?.isAdmin,
  });
  const displayAvatar =
    profile?.avatar ||
    initialCreator?.avatar ||
    creatorItems[0]?.owner?.avatar ||
    (isAdmin ? '/admin-avatar.jpg' : FALLBACK_AVATAR);
  const displayBio = profile?.bio || initialCreator?.bio || (isAdmin ? DEFAULT_ADMIN_BIO : '');
  const displayLocation = isAdmin
    ? ''
    : [profile?.city || initialCreator?.city, profile?.state || initialCreator?.state]
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
        <div
          className={`py-12 text-center space-y-2 rounded-2xl border ${
            isAdmin
              ? 'bg-[#111827] border-[#F59E0B]/25'
              : 'bg-white border-[var(--theme-accent-light)]'
          }`}
        >
          <Users
            className={`w-8 h-8 mx-auto opacity-70 ${
              isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
            }`}
          />
          <p
            className={`text-xs font-semibold ${
              isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
            }`}
          >
            {emptyLabel}
          </p>
        </div>
      );
    }

    return (
      <div
        className={`divide-y rounded-2xl border overflow-hidden ${
          isAdmin
            ? 'divide-[#F59E0B]/15 bg-[#111827] border-[#F59E0B]/25'
            : 'divide-[var(--theme-accent-light)] bg-white border-[var(--theme-accent-light)]'
        }`}
      >
        {list.map((person) => {
          const isMe = currentUser?.id === person.id;
          const amFollowingPerson = followingIds.includes(person.id);
          const personIsAdmin = isAdminAccount(person);
          return (
            <div
              key={person.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
                isAdmin
                  ? 'hover:bg-[#1B243B]'
                  : 'hover:bg-[var(--theme-accent-light)]/25'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCreator(person.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
              >
                <img
                  src={person.avatar || FALLBACK_AVATAR}
                  alt={person.name}
                  className={`w-11 h-11 rounded-full object-cover ring-2 shrink-0 ${
                    personIsAdmin
                      ? 'ring-[#F59E0B]'
                      : isAdmin
                        ? 'ring-[#F59E0B]/40'
                        : 'ring-[var(--theme-accent-light)]'
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-extrabold truncate ${
                        isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                      }`}
                    >
                      {person.username || person.name}
                    </span>
                    <VerifiedBadge
                      isAdmin={personIsAdmin}
                      verified={person.verified ?? true}
                      size="xs"
                    />
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isAdmin ? 'text-[#94A3B8]' : 'text-[var(--theme-text-muted)]'
                    }`}
                  >
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
                      ? isAdmin
                        ? 'bg-[#1E293B] text-[#FDE68A] border border-[#F59E0B]/40'
                        : 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]'
                      : isAdmin
                        ? 'bg-[#F59E0B] text-[#0B0F1A] hover:brightness-105'
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
        className="fixed inset-0 bg-black/65"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        data-admin-profile={isAdmin ? 'true' : 'false'}
        className={`relative rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full z-10 shadow-2xl border overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isAdmin
            ? 'bg-[#0B0F1A] border-[#F59E0B]/45 text-[#FFFBEB]'
            : 'bg-white border-[var(--theme-accent-light)]'
        }`}
        style={{
          boxShadow: isAdmin
            ? '0 28px 64px -12px rgba(0,0,0,0.72), 0 0 40px rgba(245,158,11,0.24)'
            : '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 28px var(--theme-glow)',
        }}
      >
        {/* Instagram-Style Sticky Top Bar */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-3 shrink-0 ${
            isAdmin
              ? 'bg-[#0F1629] border-[#F59E0B]/25'
              : 'bg-white border-[var(--theme-accent-light)]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isAdmin
                  ? 'hover:bg-[#1E293B] text-[#FDE68A]'
                  : 'hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)]'
              }`}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`text-sm sm:text-base font-black truncate ${
                  isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                }`}
              >
                {displayUsername || displayName}
              </span>
              <VerifiedBadge
                isAdmin={isAdmin}
                verified={profile?.verified ?? true}
                size="md"
                showAdminLabel={isAdmin}
                adminLabelTone="dark"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {displayUsername && (
              <button
                type="button"
                onClick={handleCopyHandle}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isAdmin
                    ? 'bg-[#161F36] border-[#F59E0B]/35 hover:border-[#FBBF24] text-[#FDE68A]'
                    : 'bg-white border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)]'
                }`}
                title="Copy username"
              >
                {copiedHandle ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy
                      className={`w-3.5 h-3.5 ${
                        isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                      }`}
                    />
                    <span className="hidden sm:inline">{displayUsername}</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close creator profile"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-[#161F36] hover:bg-red-950/60 text-[#CBD5E1] hover:text-red-300'
                  : 'bg-[var(--theme-accent-light)]/50 hover:bg-red-50 text-[var(--theme-text-muted)] hover:text-red-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          className={`overflow-y-auto overscroll-contain flex-1 ${
            isAdmin ? 'bg-[#090D16]' : 'bg-[#FCFAFD]'
          }`}
        >
          {/* Instagram-Style Header Section */}
          <div
            className={`relative px-4 sm:px-7 pt-5 pb-4 border-b space-y-4 overflow-hidden ${
              isAdmin
                ? 'border-[#F59E0B]/25'
                : 'bg-white border-[var(--theme-accent-light)]'
            }`}
            style={
              isAdmin
                ? {
                    background:
                      'linear-gradient(145deg, #111827 0%, #1E1633 55%, #161028 100%)',
                  }
                : undefined
            }
          >
            {isAdmin && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
                }}
              />
            )}

            <div className="relative flex items-center gap-5 sm:gap-8">
              {/* Circular Avatar with Gradient Theme Ring (Molten Gold for Admin) */}
              <div
                className="p-[3px] rounded-full shrink-0 shadow-md"
                style={{
                  background: isAdmin
                    ? 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 48%, #B45309 100%)'
                    : 'linear-gradient(135deg, var(--theme-deep), var(--theme-primary), var(--theme-accent))',
                }}
              >
                <div className={`p-[2px] rounded-full ${isAdmin ? 'bg-[#0F1629]' : 'bg-white'}`}>
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = isAdmin
                        ? '/admin-avatar.jpg'
                        : FALLBACK_AVATAR;
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
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {creatorItems.length}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isAdmin ? 'text-[#E2D9C5]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Uploads
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('followers')}
                    className="cursor-pointer group"
                  >
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {profile?.followersCount ?? followers.length}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isAdmin ? 'text-[#E2D9C5]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Followers
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('following')}
                    className="cursor-pointer group"
                  >
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {profile?.followingCount ?? following.length}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isAdmin ? 'text-[#E2D9C5]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Following
                    </div>
                  </button>
                </div>

                {/* Rating & Member Location */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-md ${
                      isAdmin
                        ? 'text-[#FDE68A] bg-[#F59E0B]/15 border border-[#F59E0B]/35'
                        : 'text-[var(--theme-deep)] bg-[var(--theme-accent-light)]'
                    }`}
                  >
                    <Star
                      className={`w-3 h-3 fill-current ${
                        isAdmin ? 'text-[#FBBF24]' : 'text-[#E76F51]'
                      }`}
                    />
                    <span>{profile?.rating ?? 5.0}</span>
                  </span>

                  {isAdmin && (
                    <span className="inline-flex items-center font-bold text-[#FDE68A] bg-[#161F36] border border-[#F59E0B]/30 px-2.5 py-0.5 rounded-md">
                      ResourceBox HQ
                    </span>
                  )}

                  {displayLocation && (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isAdmin ? 'text-[#E2E8F0]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      <MapPin
                        className={`w-3 h-3 ${
                          isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                        }`}
                      />
                      <span className="truncate max-w-[180px]">{displayLocation}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio & Full Name Block (Instagram Style) */}
            <div className="relative space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-sm font-extrabold ${
                    isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                  }`}
                >
                  {displayName}
                </span>
                <VerifiedBadge
                  isAdmin={isAdmin}
                  verified={profile?.verified ?? true}
                  size="sm"
                />
                {displayUsername && (
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                      isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                    }`}
                  >
                    <AtSign className="w-3 h-3" />
                    {displayUsername.replace(/^@/, '')}
                  </span>
                )}
              </div>
              {displayBio ? (
                <p
                  className={`text-xs leading-relaxed whitespace-pre-line ${
                    isAdmin ? 'text-[#E2E8F0]' : 'text-[var(--theme-text-muted)]'
                  }`}
                >
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
            <div className="relative flex items-center gap-2.5 pt-1">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSelfProfile();
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isAdmin
                      ? 'bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-[#0B0F1A] hover:brightness-105'
                      : 'bg-[var(--theme-deep)] hover:opacity-95 text-white'
                  }`}
                >
                  Edit Your Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleFollowClick}
                    disabled={isFollowBusy}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold !transition-none flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      isFollowing
                        ? isAdmin
                          ? 'bg-[#1E293B] !text-[#FDE68A] border border-[#F59E0B]/45 hover:bg-[#273449]'
                          : 'bg-[var(--theme-accent-light)] !text-[var(--theme-deep)] border border-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/30'
                        : isAdmin
                          ? 'bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] !text-[#0B0F1A] font-black shadow-[0_0_24px_rgba(245,158,11,0.3)] hover:brightness-105'
                          : 'bg-[var(--theme-deep)] !text-white hover:opacity-95 hover:shadow-[0_0_16px_var(--theme-glow)]'
                    }`}
                  >
                    {isFollowBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isFollowing ? (
                      <UserCheck className="w-3.5 h-3.5" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isFollowing
                        ? 'Following'
                        : 'Follow for Upload Updates'}
                    </span>
                  </button>

                  {creatorItems[0] && (
                    <button
                      type="button"
                      onClick={() => onStartChat(creatorItems[0])}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isAdmin
                          ? 'bg-[#151D31] border-[#F59E0B]/35 hover:border-[#FBBF24] text-[#FFFBEB]'
                          : 'bg-white border-[var(--theme-accent)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)]'
                      }`}
                    >
                      <MessageSquare
                        className={`w-3.5 h-3.5 ${
                          isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                        }`}
                      />
                      <span>Message</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Instagram-Style Segmented Tabs */}
          <div
            className={`border-b grid grid-cols-3 sticky top-0 z-10 ${
              isAdmin
                ? 'bg-[#0F1629] border-[#F59E0B]/25'
                : 'bg-white border-[var(--theme-accent-light)]'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer ${
                activeTab === 'posts'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Posts ({creatorItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('followers')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer ${
                activeTab === 'followers'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Followers ({profile?.followersCount ?? followers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer ${
                activeTab === 'following'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Following ({profile?.followingCount ?? following.length})</span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="p-3 sm:p-5">
            {isLoading && creatorItems.length === 0 ? (
              <div
                className={`py-12 flex flex-col items-center justify-center gap-2 text-xs ${
                  isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
                }`}
              >
                <Loader2
                  className={`w-6 h-6 animate-spin ${
                    isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                  }`}
                />
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
                              ? isAdmin
                                ? 'bg-[#F59E0B] text-[#0B0F1A] font-extrabold'
                                : 'bg-[var(--theme-deep)] text-white'
                              : isAdmin
                                ? 'bg-[#151D31] text-[#CBD5E1] border border-[#F59E0B]/20 hover:text-[#FFFBEB]'
                                : 'bg-white text-[var(--theme-text-muted)] border border-[var(--theme-accent-light)] hover:text-[var(--theme-deep)]'
                          }`}
                        >
                          {f === 'all' ? 'All Uploads' : f === 'rent' ? 'For Rent' : 'Exchange'}
                        </button>
                      ))}
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        isAdmin ? 'text-[#94A3B8]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
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
                        className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer text-left focus:outline-none ${
                          isAdmin
                            ? 'bg-[#151D31] border-[#F59E0B]/30 focus:ring-2 focus:ring-[#F59E0B]'
                            : 'bg-[#EEEEEE] border-[var(--theme-accent-light)] focus:ring-2 focus:ring-[var(--theme-primary)]'
                        }`}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Listing Type Corner Indicator */}
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold flex items-center gap-1">
                          {item.listingType === 'exchange' ? (
                            <RefreshCw className="w-2.5 h-2.5" />
                          ) : (
                            <span>
                              {item.currencySymbol || '₹'}
                              {item.priceDaily}
                            </span>
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
                              : item.priceRateText ||
                                `${item.currencySymbol || '₹'}${item.priceDaily}/day`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`py-12 text-center rounded-2xl border space-y-2 ${
                      isAdmin
                        ? 'bg-[#111827] border-[#F59E0B]/25'
                        : 'bg-white border-[var(--theme-accent-light)]'
                    }`}
                  >
                    <PackageOpen
                      className={`w-9 h-9 mx-auto opacity-75 ${
                        isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                      }`}
                    />
                    <p
                      className={`text-xs font-bold ${
                        isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                      }`}
                    >
                      {isAdmin
                        ? 'Curated Admin Listings Coming Soon'
                        : 'No Products Uploaded Yet'}
                    </p>
                    <p
                      className={`text-[11px] max-w-xs mx-auto ${
                        isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
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


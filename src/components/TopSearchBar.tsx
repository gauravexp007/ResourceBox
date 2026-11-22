import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  X,
  RefreshCw,
  AtSign,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Loader2,
  Users,
} from 'lucide-react';
import { Category, CategoryId, Item, ListingType, PublicUserProfile, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { searchCommunityUsers } from '../services/firebaseService';

interface TopSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  listingType: ListingType | 'all';
  setListingType: (type: ListingType | 'all') => void;
  onSearchSubmit: () => void;
  categories?: Category[];
  items?: Item[];
  currentUser?: User | null;
  followingIds?: string[];
  onSelectCreator?: (creatorId: string, preview?: PublicUserProfile) => void;
  onToggleFollow?: (creator: { id: string; name?: string; username?: string; avatar?: string }) => Promise<void> | void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  listingType,
  setListingType,
  onSearchSubmit,
  categories,
  items = [],
  currentUser,
  followingIds = [],
  onSelectCreator,
  onToggleFollow,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [creatorResults, setCreatorResults] = useState<PublicUserProfile[]>([]);
  const [isSearchingCreators, setIsSearchingCreators] = useState(false);
  const [followBusyId, setFollowBusyId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onSearchSubmit();
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const itemsRef = useRef<Item[]>(items);
  itemsRef.current = items;

  // Debounced creator search by @username / name whenever dropdown is open or searchQuery changes
  useEffect(() => {
    if (!isDropdownOpen) return;
    let active = true;
    const trimmed = searchQuery.trim();
    setIsSearchingCreators(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCommunityUsers(trimmed, itemsRef.current);
        if (active) {
          setCreatorResults(results.slice(0, 8));
        }
      } catch {
        if (active) setCreatorResults([]);
      } finally {
        if (active) setIsSearchingCreators(false);
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, isDropdownOpen]);

  const handleCreatorFollow = async (u: PublicUserProfile) => {
    if (!onToggleFollow) return;
    setFollowBusyId(u.id);
    try {
      await onToggleFollow({
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar,
      });
    } finally {
      setFollowBusyId(null);
    }
  };

  return (
    <div className="bg-white border-b border-[var(--theme-accent-light)] py-3 shadow-xs transition-colors relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-2.5">

          {/* Symmetrical Left: Segmented Mode Selector with Jitter Pill animation */}
          <div className="flex items-center p-1 bg-[var(--theme-accent-light)] rounded-xl text-xs font-semibold shrink-0 w-full lg:w-auto justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                listingType === 'all'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              All Items
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('rent')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                listingType === 'rent'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              For Rent
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('exchange')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                listingType === 'exchange'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-[var(--theme-primary)]" />
              <span>Exchange</span>
            </motion.button>
          </div>

          {/* Symmetrical Center: Search Input Field + Live @username Creators Dropdown */}
          <div ref={containerRef} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--theme-text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              placeholder="Search gear or @username..."
              aria-label="Search items or @username creators"
              className="w-full min-h-[48px] pl-11 pr-20 sm:pr-28 py-3 bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)]/80 focus:bg-white rounded-xl border border-[var(--theme-accent-light)] outline-none text-xs sm:text-sm font-semibold text-[var(--theme-deep)] placeholder-[var(--theme-text-muted)] focus:shadow-[0_0_0_2px_var(--theme-primary),0_0_22px_var(--theme-glow)] transition-all duration-200"
            />

            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)] cursor-pointer rounded-lg"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}

              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                  isDropdownOpen
                    ? 'bg-[var(--theme-deep)] text-white border-[var(--theme-deep)]'
                    : 'bg-white text-[var(--theme-deep)] border-[var(--theme-accent)] hover:border-[var(--theme-primary)]'
                }`}
                title="Browse or search creators by @username"
              >
                <AtSign className="w-3 h-3" />
                <span className="hidden sm:inline">Creators</span>
              </button>
            </div>

            {/* Live Creators (@username) Search Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-2xl border border-[var(--theme-accent)] shadow-2xl overflow-hidden z-40"
                >
                  <div className="px-4 py-2.5 bg-[var(--theme-accent-light)]/45 border-b border-[var(--theme-accent-light)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[var(--theme-deep)] uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      <span>
                        {searchQuery.trim()
                          ? `Creators matching "${searchQuery.trim()}"`
                          : 'Community Creators (@username)'}
                      </span>
                    </div>
                    {isSearchingCreators && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--theme-primary)]" />
                    )}
                  </div>

                  {creatorResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-[var(--theme-accent-light)]/60">
                      {creatorResults.map((u) => {
                        const isSelf = Boolean(currentUser && currentUser.id === u.id);
                        const isFollowing = followingIds.includes(u.id);
                        const handleLabel = u.username
                          ? u.username.startsWith('@')
                            ? u.username
                            : `@${u.username}`
                          : null;

                        return (
                          <div
                            key={u.id}
                            className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[var(--theme-accent-light)]/25 transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                onSelectCreator?.(u.id, u);
                              }}
                              className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                            >
                              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[var(--theme-primary)] to-[var(--theme-accent)] shrink-0">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-full object-cover bg-white ring-2 ring-white"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-extrabold text-[var(--theme-deep)] truncate">
                                    {handleLabel || u.name}
                                  </span>
                                  {u.verified && (
                                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary)] shrink-0" />
                                  )}
                                </div>
                                <div className="text-[11px] text-[var(--theme-text-muted)] truncate">
                                  {handleLabel ? `${u.name} · ` : ''}
                                  <span className="tabular-nums">{u.uploadsCount || 0}</span> posts ·{' '}
                                  <span className="tabular-nums">{u.followersCount || 0}</span> followers
                                </div>
                              </div>
                            </button>

                            {isSelf ? (
                              <span className="px-2.5 py-1 rounded-lg bg-[var(--theme-accent-light)] text-[var(--theme-deep)] text-[11px] font-bold shrink-0">
                                You
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={followBusyId === u.id}
                                onClick={() => handleCreatorFollow(u)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 disabled:opacity-60 ${
                                  isFollowing
                                    ? 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]'
                                    : 'bg-[var(--theme-deep)] text-white hover:opacity-95'
                                }`}
                              >
                                {isFollowing ? (
                                  <>
                                    <UserCheck className="w-3 h-3" />
                                    <span>Following</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="w-3 h-3" />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-center text-xs text-[var(--theme-text-muted)]">
                      {isSearchingCreators
                        ? 'Searching creators...'
                        : 'No creators found matching that @username yet.'}
                    </div>
                  )}

                  {searchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onSearchSubmit();
                      }}
                      className="w-full px-4 py-2.5 bg-[var(--theme-accent-light)]/35 hover:bg-[var(--theme-accent-light)]/60 border-t border-[var(--theme-accent-light)] text-xs font-bold text-[var(--theme-deep)] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>Search items & listings for "{searchQuery.trim()}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Symmetrical Right: Category Dropdown + Find Button with Jitter tap */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
            {/* Category Select */}
            <div className="flex-1 lg:w-52">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
                className="w-full min-h-[48px] px-4 py-3 bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)]/80 focus:bg-white rounded-xl border border-[var(--theme-accent-light)] outline-none text-xs sm:text-sm font-bold text-[var(--theme-deep)] focus:shadow-[0_0_0_2px_var(--theme-primary),0_0_22px_var(--theme-glow)] transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {(categories || CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.isCustom ? '(Community)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="py-2.5 px-5 bg-[var(--theme-deep)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_18px_var(--theme-glow)] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Find</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </form>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  ChevronDown, 
  X,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Palette,
  ShoppingCart
} from 'lucide-react';
import { User } from '../types';
import { AuthActionReason } from './AuthModal';
import { InteractiveCubeLogo } from './InteractiveCubeLogo';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (reason?: AuthActionReason, mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onSwitchUser?: (user: User) => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  onOpenSavedCart?: () => void;
  onOpenProfile?: (highlightPhone?: boolean, targetTab?: 'info' | 'verification' | 'location' | 'settings') => void;
  onOpenThemes?: () => void;
  activeTab: 'home' | 'rent' | 'exchange' | 'dashboard' | 'chat' | 'legal';
  setActiveTab: (tab: 'home' | 'rent' | 'exchange' | 'dashboard' | 'chat' | 'legal') => void;
  unreadCount: number;
  proposalsCount: number;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenUpload,
  onOpenChat,
  onOpenSavedCart,
  onOpenProfile,
  onOpenThemes,
  activeTab,
  setActiveTab,
  unreadCount,
  proposalsCount,
  savedCount,
}) => {
  const { currentTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  // Close profile menu on Escape key
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profileMenuOpen]);

  // Prevent background scroll when profile menu drawer is open
  useEffect(() => {
    if (profileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [profileMenuOpen]);

  // Smart hide when scrolling down, appear when scrolling up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollYRef.current;

          setIsScrolled(currentScrollY > 20);

          if (currentScrollY <= 60) {
            // Near top of page, always show
            setIsNavVisible(true);
          } else if (delta > 8 && currentScrollY > 90) {
            // Scrolling down by more than 8px -> hide navbar
            setIsNavVisible(false);
            setProfileMenuOpen(false);
          } else if (delta < -4) {
            // Scrolling up by even 4px -> immediately reveal navbar
            setIsNavVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldBeVisible = isNavVisible || profileMenuOpen;

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-transform duration-300 ease-in-out glass-nav ${
      shouldBeVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'shadow-[0_12px_36px_rgba(0,0,0,0.07)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-1.5 sm:gap-4">
          
          {/* Left Column: Brand Logo & Wordmark (Responsive scaling) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('home');
                setProfileMenuOpen(false);
              }}
              className="relative flex items-center gap-1.5 sm:gap-2.5 focus:outline-none group text-left cursor-pointer p-1.5 -ml-1.5 rounded-2xl transition-all duration-500"
              aria-label="ResourceBox Home"
            >
              {/* Subtle ambient fading halo background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--theme-primary)]/15 via-[var(--theme-accent)]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out blur-xs pointer-events-none" />

              <div className="shrink-0 scale-[0.72] xs:scale-85 sm:scale-100 origin-left transition-transform duration-600 ease-out group-hover:scale-[1.03]">
                <InteractiveCubeLogo size="sm" />
              </div>
              <div className="flex flex-col relative z-10 -ml-1 xs:ml-0">
                <span className="text-sm xs:text-base sm:text-xl md:text-2xl font-nokie whitespace-nowrap text-[var(--theme-deep)] leading-none transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_10px_var(--theme-glow)]">
                  Resource<span className="text-[var(--theme-primary)] group-hover:text-[var(--theme-deep)] transition-colors duration-500">Box</span>
                </span>
                <span className="hidden sm:inline text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] font-medium tracking-wide transition-colors duration-500 group-hover:text-[var(--theme-primary)]">
                  Rent & Exchange
                </span>
              </div>
            </button>
          </div>

          {/* Center Column: Navigation Tabs (Visible on Desktop lg+) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] shadow-xs'
                  : 'text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20'
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => setActiveTab('rent')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rent'
                  ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] shadow-xs'
                  : 'text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20'
              }`}
            >
              Rent Resources
            </button>

            <button
              onClick={() => setActiveTab('exchange')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'exchange'
                  ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] shadow-xs'
                  : 'text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20'
              }`}
            >
              Exchange Hub
            </button>

            {/* Dashboard & Profile Tabs — Only visible after authorization */}
            {currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] shadow-xs'
                      : 'text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20'
                  }`}
                >
                  <span>Dashboard</span>
                  {proposalsCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3B1E54] text-white">
                      {proposalsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onOpenProfile?.(false)}
                  className="relative px-3 py-2 rounded-xl text-xs font-bold transition-all text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20 flex items-center gap-1.5 cursor-pointer"
                  title="Open Profile Settings"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#9B7EBD]" />
                  <span>Profile</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Column: Actions Cluster (Sleek & responsive on phones without overflow) */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Saved & Liked Products Cart Button (left of Message button) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onOpenSavedCart?.()}
              aria-label="Open saved and liked products"
              title={`Saved & Liked Products (${savedCount})`}
              className="relative h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 flex items-center justify-center text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/25 border border-[#D4BEE4] rounded-lg sm:rounded-xl transition-colors cursor-pointer shrink-0 bg-white"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[9px] font-extrabold bg-[#3B1E54] text-white ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </motion.button>

            {/* Messages / Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (currentUser) {
                  onOpenChat();
                } else {
                  onOpenAuth('message', 'signin');
                }
              }}
              className="relative h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 flex items-center justify-center text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/25 border border-[#D4BEE4] rounded-lg sm:rounded-xl transition-colors cursor-pointer shrink-0 bg-white"
              title={currentUser ? 'Community Messages' : 'Sign in to message members'}
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              {currentUser && unreadCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#9B7EBD] rounded-full ring-2 ring-white" />
              )}
            </motion.button>

            {/* List Resource Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={onOpenUpload}
              title="List a Resource"
              className="h-7 w-7 xs:h-8 xs:w-auto sm:h-10 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 xs:px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold bg-[#3B1E54] hover:bg-[#2A143D] text-white shadow-xs transition-all hover:shadow cursor-pointer relative overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4BEE4] shrink-0" />
              <span className="hidden md:inline">List Resource</span>
              <span className="hidden min-[420px]:inline md:hidden">List</span>
            </motion.button>

            {/* Quick Guest Sign In trigger (only shown when signed out) */}
            {!currentUser && (
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenAuth('general', 'signin')}
                  className="h-7 xs:h-8 sm:h-9 px-2 xs:px-2.5 sm:px-3.5 rounded-lg sm:rounded-xl text-[10px] xs:text-[11px] sm:text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] border border-[var(--theme-accent-light)] transition-colors cursor-pointer whitespace-nowrap shadow-2xs bg-white/90"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Profile Icon Button (replaces 3-bars menu & opens all setting options across all screen sizes) */}
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-label="Open profile and settings menu"
              aria-expanded={profileMenuOpen}
              title="Profile & Settings Menu"
              className={`h-7 xs:h-8 sm:h-10 flex items-center gap-1 xs:gap-1.5 p-1 sm:px-2 rounded-lg sm:rounded-xl border transition-all focus:outline-none cursor-pointer shadow-xs shrink-0 ${
                profileMenuOpen
                  ? 'border-[var(--theme-primary)] bg-[var(--theme-accent-light)] shadow-[0_0_12px_var(--theme-glow)]'
                  : 'border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] bg-white/95 hover:bg-white hover:shadow-[0_0_12px_var(--theme-glow)]'
              }`}
            >
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name || 'Profile'}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg object-cover ring-1 ring-[var(--theme-primary)]"
                />
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[var(--theme-accent-light)] flex items-center justify-center text-[var(--theme-deep)] ring-1 ring-[var(--theme-accent)]">
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--theme-primary)]" />
                </div>
              )}

              {currentUser && (
                <span className="hidden xl:inline text-xs font-bold text-[var(--theme-deep)] max-w-[90px] truncate">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}
                </span>
              )}
              {profileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-[var(--theme-deep)] shrink-0" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[var(--theme-text-muted)] shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Unified Settings & Profile Drawer (Matches Image 2 bar-row preview style with all Image 1 options) */}
        <AnimatePresence>
          {profileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-14 sm:top-18 bg-black/40 backdrop-blur-xs z-30"
                onClick={() => setProfileMenuOpen(false)}
              />

              {/* Full-Width Slide-Down Options Sheet */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-[#EEEEEE] border-b border-[var(--theme-accent)] shadow-2xl z-40 max-h-[84vh] overflow-y-auto"
              >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-3">
                  {/* Top Account Card */}
                  {currentUser ? (
                    <div className="p-3.5 rounded-2xl bg-white border border-[var(--theme-accent)] flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-[var(--theme-primary)]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[var(--theme-deep)] truncate">
                            {currentUser.name || 'Community Member'}
                          </div>
                          <div className="text-xs text-[var(--theme-text-muted)] truncate">
                            {currentUser.email || 'Verified Member'}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)] px-2.5 py-0.5 rounded-full border border-[var(--theme-accent)]">
                              <ShieldCheck className="w-3 h-3 text-[var(--theme-primary)]" />
                              Already Registered
                            </span>
                            {(currentUser.city || currentUser.state) && (
                              <span className="text-[10px] font-medium text-[var(--theme-text-muted)] truncate">
                                {[currentUser.city, currentUser.state].filter(Boolean).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {currentUser.phoneNumber && (
                        <span className="hidden xs:inline-flex items-center gap-1 text-[10px] bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-bold px-2.5 py-1 rounded-full border border-[var(--theme-accent)] shrink-0">
                          <ShieldCheck className="w-3 h-3 text-[var(--theme-primary)]" />
                          <span>Phone Saved</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white border border-[var(--theme-accent)] flex items-center justify-between gap-2.5 shadow-2xs">
                      <div>
                        <div className="text-xs font-extrabold text-[var(--theme-deep)]">ResourceBox Guest</div>
                        <div className="text-[11px] text-[var(--theme-text-muted)]">
                          Sign in to create your profile and list items, or switch themes anytime
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAuth('general', 'signin');
                          setProfileMenuOpen(false);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--theme-deep)] text-white text-xs font-bold hover:opacity-95 shadow-xs cursor-pointer shrink-0"
                      >
                        Sign In
                      </button>
                    </div>
                  )}

                  {/* Menu Options in Bar-Row Preview Style */}
                  <div className="space-y-1.5">
                    {/* 1. My Profile & Photo — Only visible after authorization */}
                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenProfile?.(false, 'info');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)]/75 hover:bg-[var(--theme-accent-light)] border border-transparent hover:border-[var(--theme-accent)] transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <UserIcon className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                          <span>My Profile & Photo</span>
                        </span>
                        <span className="text-[10px] bg-white/80 text-[var(--theme-deep)] font-bold px-2.5 py-0.5 rounded-full">
                          Edit
                        </span>
                      </button>
                    )}

                    {/* 2. Theme & Colors */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenThemes) {
                          onOpenThemes();
                        } else {
                          onOpenProfile?.(false, 'settings');
                        }
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)]/75 hover:bg-[var(--theme-accent-light)] border border-transparent hover:border-[var(--theme-accent)] transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Theme & Colors</span>
                      </span>
                      <span className="text-[10px] bg-[var(--theme-accent)]/55 text-[var(--theme-deep)] font-extrabold px-2.5 py-0.5 rounded-full capitalize">
                        {currentTheme.name}
                      </span>
                    </button>

                    {/* 3. Dashboard & Listings — Only visible after authorization */}
                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('dashboard');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'dashboard'
                            ? 'text-[var(--theme-deep)] bg-[var(--theme-accent-light)] border border-[var(--theme-primary)] shadow-2xs'
                            : 'text-[var(--theme-deep)] bg-[var(--theme-accent-light)]/75 hover:bg-[var(--theme-accent-light)] border border-transparent hover:border-[var(--theme-accent)]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <LayoutDashboard className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                          <span>Dashboard & Listings</span>
                        </span>
                        {proposalsCount > 0 && (
                          <span className="text-[10px] bg-[var(--theme-deep)] text-white font-extrabold px-2 py-0.5 rounded-full">
                            {proposalsCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* 4. Community Messages */}
                    <button
                      type="button"
                      onClick={() => {
                        if (currentUser) {
                          onOpenChat();
                        } else {
                          onOpenAuth('message', 'signin');
                        }
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)]/75 hover:bg-[var(--theme-accent-light)] border border-transparent hover:border-[var(--theme-accent)] transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Community Messages</span>
                      </span>
                      {currentUser && unreadCount > 0 && (
                        <span className="text-[10px] bg-[var(--theme-primary)] text-white font-extrabold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Secondary Actions / Auth */}
                  <div className="pt-2.5 border-t border-[var(--theme-accent)]/40 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenUpload();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-opacity"
                    >
                      <PlusCircle className="w-4 h-4 text-[var(--theme-accent)]" />
                      <span>List a New Resource</span>
                    </button>

                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          onLogout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-[var(--theme-accent)] text-[#C84A3B] hover:bg-[#FFF5F4] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer bg-white transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

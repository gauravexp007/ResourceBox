import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  ChevronDown, 
  Menu, 
  X,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Compass,
  Key,
  RefreshCw,
  LayoutDashboard,
  Sparkles,
  Home,
  Palette
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
  onOpenProfile?: (highlightPhone?: boolean, targetTab?: 'info' | 'verification' | 'location' | 'settings') => void;
  activeTab: 'home' | 'rent' | 'exchange' | 'dashboard' | 'chat';
  setActiveTab: (tab: 'home' | 'rent' | 'exchange' | 'dashboard' | 'chat') => void;
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
  onOpenProfile,
  activeTab,
  setActiveTab,
  unreadCount,
  proposalsCount,
}) => {
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  // Close user dropdown cleanly when clicking outside
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handleOutsideClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [userDropdownOpen]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
            setUserDropdownOpen(false);
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

  const shouldBeVisible = isNavVisible || mobileMenuOpen || userDropdownOpen;

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
                setMobileMenuOpen(false);
              }}
              className="relative flex items-center gap-1.5 sm:gap-2.5 focus:outline-none group text-left cursor-pointer p-1.5 -ml-1.5 rounded-2xl transition-all duration-500"
              aria-label="ResourceBox Home"
            >
              {/* Subtle ambient fading halo background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9B7EBD]/15 via-[#D4BEE4]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out blur-xs pointer-events-none" />

              <div className="shrink-0 scale-75 xs:scale-85 sm:scale-100 origin-left transition-transform duration-600 ease-out group-hover:scale-[1.03]">
                <InteractiveCubeLogo size="sm" />
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#3B1E54] font-['Plus_Jakarta_Sans'] leading-none transition-all duration-500 ease-out group-hover:text-[#2A143D] group-hover:drop-shadow-[0_0_10px_rgba(155,126,189,0.35)]">
                  Resource<span className="text-[#9B7EBD] group-hover:text-[#3B1E54] transition-colors duration-500">Box</span>
                </span>
                <span className="hidden sm:inline text-[9px] sm:text-[10px] text-[#5C4B6E] font-medium tracking-wide transition-colors duration-500 group-hover:text-[#9B7EBD]">
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

            {/* User Dashboard Tab */}
            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('dashboard');
                } else {
                  onOpenAuth('general', 'signin');
                }
              }}
              className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] shadow-xs'
                  : 'text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20'
              }`}
            >
              <span>Dashboard</span>
              {currentUser && proposalsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3B1E54] text-white">
                  {proposalsCount}
                </span>
              )}
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => onOpenProfile?.(false)}
              className="relative px-3 py-2 rounded-xl text-xs font-bold transition-all text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/20 flex items-center gap-1.5 cursor-pointer"
              title={currentUser ? "Open Profile Settings" : "Build Your Profile & Customize Theme"}
            >
              <UserIcon className="w-3.5 h-3.5 text-[#9B7EBD]" />
              <span>{currentUser ? "Profile" : "Build Profile"}</span>
            </button>
          </nav>

          {/* Right Column: Actions Cluster (Sleek & responsive on phones without overflow) */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2.5 shrink-0">
            
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
              className="relative h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[#D4BEE4]/25 border border-[#D4BEE4] rounded-lg sm:rounded-xl transition-colors cursor-pointer shrink-0 bg-white"
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
              className="h-8 sm:h-10 flex items-center justify-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold bg-[#3B1E54] hover:bg-[#2A143D] text-white shadow-xs transition-all hover:shadow cursor-pointer relative overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4BEE4] shrink-0" />
              <span className="hidden sm:inline">List Resource</span>
              <span className="hidden min-[420px]:inline sm:hidden">List</span>
            </motion.button>

            {/* User Profile / Auth Options at Top Right Corner */}
            <div ref={userDropdownRef} className="relative shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Profile Trigger Button (Active for both authenticated members and guests) */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserDropdownOpen((prev) => !prev);
                  }}
                  className="h-8 sm:h-10 flex items-center gap-1.5 p-0.5 xs:p-1 pl-1 pr-1.5 sm:pr-2.5 rounded-lg sm:rounded-xl border border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] bg-white/95 hover:bg-white transition-all focus:outline-none cursor-pointer shadow-xs hover:shadow-[0_0_12px_var(--theme-glow)]"
                  title="Profile Menu & Theme Options"
                >
                  {currentUser ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg object-cover ring-1 ring-[var(--theme-primary)]"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[var(--theme-accent-light)] flex items-center justify-center text-[var(--theme-deep)] ring-1 ring-[var(--theme-accent)]">
                      <UserIcon className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                    </div>
                  )}

                  <span className="hidden xl:inline text-xs font-bold text-[var(--theme-deep)] max-w-[90px] truncate">
                    {currentUser ? currentUser.name.split(' ')[0] : 'Profile'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[var(--theme-text-muted)] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Quick Guest Sign In / Sign Up triggers (only shown when signed out) */}
                {!currentUser && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('general', 'signin')}
                      className="h-8 sm:h-9 px-2 xs:px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] border border-[var(--theme-accent-light)] transition-colors cursor-pointer whitespace-nowrap shadow-2xs bg-white/90"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('general', 'signup')}
                      className="inline-flex items-center justify-center h-8 sm:h-9 px-2 xs:px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold text-white bg-[var(--theme-deep)] hover:opacity-95 shadow-xs transition-all hover:shadow-[0_0_15px_var(--theme-glow)] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Universal Profile & Settings Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[var(--theme-accent-light)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  style={{
                    boxShadow: '0 20px 45px -12px rgba(0,0,0,0.22), 0 0 25px var(--theme-glow)',
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Dropdown Header Summary */}
                  <div className="px-4 py-3 border-b border-[var(--theme-accent-light)] bg-gradient-to-r from-white via-[var(--theme-accent-light)]/40 to-white">
                    {currentUser ? (
                      <>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-[var(--theme-primary)] shadow-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-[var(--theme-deep)] truncate">{currentUser.name}</p>
                            <p className="text-xs text-[var(--theme-text-muted)] truncate">{currentUser.email || 'Verified Member'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[var(--theme-accent-light)]/60 text-[11px]">
                          <span className="text-[var(--theme-text-muted)] truncate max-w-[170px]">
                            {currentUser.city ? `${currentUser.city}, ${currentUser.state || ''}` : 'Community Member'}
                          </span>
                          <span className="font-bold text-[var(--theme-deep)] flex items-center gap-1 shrink-0">
                            ★ {currentUser.rating}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider">
                            Community Member
                          </span>
                          <span className="text-[10px] bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-extrabold px-2 py-0.5 rounded-full border border-[var(--theme-accent)]">
                            Guest Mode
                          </span>
                        </div>
                        <p className="text-xs text-[var(--theme-text-muted)]">
                          Build your profile, customize theme colors, or sign in to save data.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Options List - 100% Clickable with explicit Pointer and Click handlers */}
                  <div className="py-1.5">
                    {/* Option 1: My Profile & Photo */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        onOpenProfile?.(false, 'info');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <UserIcon className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>{currentUser ? 'My Profile & Photo' : 'Build Profile & Photo'}</span>
                      </span>
                      <span className="text-[10px] text-[var(--theme-text-muted)] font-medium">Edit</span>
                    </button>

                    {/* Option 2: State, City & Pincode */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        onOpenProfile?.(false, 'location');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>State, City & Pincode</span>
                      </span>
                      <span className="text-[10px] text-[var(--theme-text-muted)] font-medium">Set</span>
                    </button>

                    {/* Option 3: Phone & Contact */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        onOpenProfile?.(false, 'verification');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Phone & Contact</span>
                      </span>
                      {currentUser?.phoneNumber ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Saved ✓
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-bold px-2 py-0.5 rounded-full">
                          Add Phone
                        </span>
                      )}
                    </button>

                    {/* Option 4: Theme & Colors */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        onOpenProfile?.(false, 'settings');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer border-t border-[var(--theme-accent-light)]/40 mt-1"
                    >
                      <span className="flex items-center gap-2.5">
                        <Palette className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Theme & Colors</span>
                      </span>
                      <span className="text-[10px] bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-extrabold px-2 py-0.5 rounded-full capitalize border border-[var(--theme-accent)]">
                        {currentTheme.name}
                      </span>
                    </button>

                    {/* Option 5: Dashboard & Listings */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        if (currentUser) {
                          setActiveTab('dashboard');
                        } else {
                          onOpenAuth('general', 'signin');
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Dashboard & Listings</span>
                      </span>
                      {proposalsCount > 0 && (
                        <span className="text-[10px] bg-[var(--theme-deep)] text-white font-bold px-1.5 py-0.2 rounded-full">
                          {proposalsCount}
                        </span>
                      )}
                    </button>

                    {/* Option 6: Community Messages */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        if (currentUser) {
                          onOpenChat();
                        } else {
                          onOpenAuth('message', 'signin');
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                        <span>Community Messages</span>
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-[var(--theme-primary)] text-white font-semibold px-1.5 py-0.2 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Option 7: Explore Marketplace */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        setActiveTab('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                      <span>Explore Marketplace</span>
                    </button>
                  </div>

                  {/* Auth Action Footer */}
                  <div className="border-t border-[var(--theme-accent-light)] pt-1.5 mt-1 px-2">
                    {currentUser ? (
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 cursor-pointer font-bold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out of Account</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setUserDropdownOpen(false);
                            onOpenAuth('general', 'signin');
                          }}
                          className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-[var(--theme-accent-light)] text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setUserDropdownOpen(false);
                            onOpenAuth('general', 'signup');
                          }}
                          className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-[var(--theme-deep)] text-white hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                        >
                          Sign Up Free
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Mobile Drawer with Smooth Animation & Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-16 sm:top-18 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer Sheet */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-[#EEEEEE] border-b border-[#D4BEE4] shadow-2xl z-40 lg:hidden max-h-[82vh] overflow-y-auto px-4 py-5 space-y-4"
              >
                {/* Unauthenticated guest card at top of mobile drawer */}
                {!currentUser && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#D4BEE4] flex items-center justify-between gap-2.5">
                    <div>
                      <div className="text-xs font-bold text-[#3B1E54]">ResourceBox Member</div>
                      <div className="text-[11px] text-[#715F85]">Sign in to rent, swap & chat</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onOpenAuth('general', 'signin');
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#EEEEEE] border border-[#D4BEE4] text-xs font-bold text-[#3B1E54] hover:bg-white cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('general', 'signup');
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#3B1E54] text-white text-xs font-bold hover:bg-[#2A143D] shadow-xs cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}

                {/* User profile card if logged in */}
                {currentUser && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#D4BEE4] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#9B7EBD]/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#3B1E54]">{currentUser.name}</div>
                        <div className="text-[11px] text-[#715F85] truncate max-w-[170px]">{currentUser.email}</div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#3B1E54] bg-[#D4BEE4]/40 px-2 py-0.5 rounded-full border border-[#D4BEE4] mt-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-[#9B7EBD]" />
                          Already Registered
                        </span>
                      </div>
                    </div>

                    {currentUser.phoneNumber && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-[#D4BEE4]/40 text-[#3B1E54] font-bold px-2 py-0.5 rounded-full border border-[#D4BEE4]">
                        <ShieldCheck className="w-3 h-3 text-[#9B7EBD]" />
                        <span>Phone Saved</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Primary Nav Links */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'home' ? 'text-[#3B1E54] bg-[#D4BEE4]/40 border border-[#D4BEE4]' : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-[#9B7EBD]" />
                    <span>Explore Community Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('rent');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'rent' ? 'text-[#3B1E54] bg-[#D4BEE4]/40 border border-[#D4BEE4]' : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                    }`}
                  >
                    <Key className="w-4 h-4 text-[#9B7EBD]" />
                    <span>Rent Resources</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('exchange');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'exchange' ? 'text-[#3B1E54] bg-[#D4BEE4]/40 border border-[#D4BEE4]' : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 text-[#9B7EBD]" />
                    <span>Exchange & Barter</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentUser) {
                        setActiveTab('dashboard');
                      } else {
                        onOpenAuth('general', 'signin');
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'dashboard' ? 'text-[#3B1E54] bg-[#D4BEE4]/40 border border-[#D4BEE4]' : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 text-[#9B7EBD]" />
                      <span>My Dashboard & Listings</span>
                    </span>
                    {currentUser && proposalsCount > 0 && (
                      <span className="text-[10px] bg-[#3B1E54] text-white font-extrabold px-2 py-0.5 rounded-full">
                        {proposalsCount}
                      </span>
                    )}
                  </button>

                  {/* Profile drawer button */}
                  <button
                    onClick={() => {
                      onOpenProfile?.(false);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5C4B6E] hover:bg-[#D4BEE4]/20 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <UserIcon className="w-4 h-4 text-[#9B7EBD]" />
                      <span>{currentUser ? 'My Profile & Details' : 'Build Profile & Details'}</span>
                    </span>
                  </button>

                  {/* Theme & Appearance Option */}
                  <button
                    onClick={() => {
                      onOpenProfile?.(false, 'settings');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5C4B6E] hover:bg-[#D4BEE4]/20 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-[#9B7EBD]" />
                      <span>Theme & Colors</span>
                    </span>
                    <span className="text-[10px] bg-[#D4BEE4]/45 text-[#3B1E54] font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {currentTheme.name}
                    </span>
                  </button>
                </div>

                {/* Secondary Actions / Auth */}
                <div className="pt-3 border-t border-[#D4BEE4]/40 space-y-2">
                  <button
                    onClick={() => {
                      onOpenUpload();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#D4BEE4]" />
                    <span>List a New Resource</span>
                  </button>

                  {currentUser ? (
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-[#D4BEE4] text-[#C84A3B] hover:bg-[#FFF5F4] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of Account</span>
                    </button>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          onOpenAuth('general', 'signin');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-[#D4BEE4] text-[#3B1E54] hover:bg-white bg-[#EEEEEE] cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('general', 'signup');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-[#3B1E54] text-white hover:bg-[#2A143D] cursor-pointer shadow-xs"
                      >
                        Sign Up Free
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

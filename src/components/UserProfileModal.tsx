import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User as UserIcon, 
  Camera, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Upload, 
  Save, 
  Check, 
  Mail, 
  Link as LinkIcon, 
  Building2, 
  Hash, 
  Compass, 
  Palette, 
  Smartphone, 
  CheckCheck, 
  ChevronDown, 
  Home, 
  Trash2, 
  Eye,
  RefreshCw,
  Clock,
  Star
} from 'lucide-react';
import { User } from '../types';
import { saveUserProfile, verifyUserPhoneInFirestore } from '../services/firebaseService';
import { COUNTRIES, CountryInfo, getCountryInfo, getStatesForCountry, isProfileLocationComplete } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface UserProfileModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  initialTab?: 'info' | 'location' | 'verification' | 'settings';
  highlightPhoneRequired?: boolean;
  onNavigateHome?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateUser,
  initialTab = 'info',
  highlightPhoneRequired = false,
  onNavigateHome,
}) => {
  const { currentTheme, setThemeId, themes } = useTheme();
  const [activeTab, setActiveTab] = useState<'info' | 'location' | 'verification' | 'settings'>(
    highlightPhoneRequired ? 'verification' : initialTab
  );

  // Sync tab when requested
  useEffect(() => {
    if (highlightPhoneRequired) {
      setActiveTab('verification');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [highlightPhoneRequired, initialTab]);

  // Form Fields State (never auto-filled with fake defaults; placeholders only)
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [gender, setGender] = useState<string>(currentUser?.gender || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Location fields: Country, State, City, Pincode, Neighborhood (all empty until user selects/enters)
  const [country, setCountry] = useState<string>(currentUser?.country || '');
  const [state, setState] = useState<string>(currentUser?.state || '');
  const [city, setCity] = useState<string>(currentUser?.city || '');
  const [pincode, setPincode] = useState<string>(currentUser?.pincode || currentUser?.postalCode || '');
  const [neighborhood, setNeighborhood] = useState<string>(currentUser?.neighborhood || '');

  // Photo / Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatar || DEFAULT_AVATAR);
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Handover preferences
  const [pickupSelf, setPickupSelf] = useState(
    currentUser?.preferredHandover?.includes('Self Pickup') ?? true
  );
  const [pickupMeetup, setPickupMeetup] = useState(
    currentUser?.preferredHandover?.includes('Public Meetup') ?? true
  );
  const [pickupDelivery, setPickupDelivery] = useState(
    currentUser?.preferredHandover?.includes('Local Delivery') ?? false
  );

  // Phone State (stored permanently in Firebase Firestore)
  const currentCountryInfo = getCountryInfo(country);
  const availableStates = getStatesForCountry(country);
  const [countryCode, setCountryCode] = useState(currentCountryInfo.dialCode || '+91');
  const [phoneInput, setPhoneInput] = useState(
    currentUser?.phoneNumber ? currentUser.phoneNumber.replace(/^\+\d+\s*/, '') : ''
  );
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize form states whenever currentUser changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormError('');
      if (currentUser) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setUsername(currentUser.username || '');
        setGender(currentUser.gender || '');
        setBio(currentUser.bio || '');
        const userCountry = currentUser.country || '';
        setCountry(userCountry);
        if (userCountry) {
          setCountryCode(getCountryInfo(userCountry).dialCode);
        }
        setState(currentUser.state || '');
        setCity(currentUser.city || '');
        setPincode(currentUser.pincode || currentUser.postalCode || '');
        setNeighborhood(currentUser.neighborhood || '');
        setAvatarUrl(currentUser.avatar || DEFAULT_AVATAR);
        if (currentUser.phoneNumber) {
          setPhoneInput(currentUser.phoneNumber.replace(/^\+\d+\s*/, ''));
        } else {
          setPhoneInput('');
        }
        if (currentUser.preferredHandover) {
          setPickupSelf(currentUser.preferredHandover.includes('Self Pickup'));
          setPickupMeetup(currentUser.preferredHandover.includes('Public Meetup'));
          setPickupDelivery(currentUser.preferredHandover.includes('Local Delivery'));
        }
      } else {
        setName('');
        setEmail('');
        setUsername('');
        setGender('');
        setBio('');
        setCountry('');
        setState('');
        setCity('');
        setPincode('');
        setNeighborhood('');
        setPhoneInput('');
      }
    }
  }, [currentUser, isOpen]);

  // Update country dialing code and reset state list when country changes
  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    if (newCountryName) {
      const info = getCountryInfo(newCountryName);
      setCountryCode(info.dialCode);
      if (!info.states.includes(state)) {
        setState('');
      }
    } else {
      setState('');
    }
  };

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size must be under 5MB.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply custom URL for avatar
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setIsCustomUrlOpen(false);
    setCustomUrlInput('');
  };

  // Directly save verified phone number
  const handleSavePhone = async () => {
    setPhoneError('');
    setPhoneSuccess('');

    if (!currentUser?.id) {
      setPhoneError('Please sign in first to save your contact number.');
      return;
    }

    const cleanNumber = phoneInput.trim().replace(/[^0-9]/g, '');
    if (!cleanNumber || cleanNumber.length < 6) {
      setPhoneError('Please enter a valid mobile phone number (6 to 15 digits).');
      return;
    }

    setIsSavingPhone(true);
    const fullPhone = `${countryCode} ${cleanNumber}`;

    try {
      await verifyUserPhoneInFirestore(currentUser.id, fullPhone);
      const updated: User = {
        ...currentUser,
        phoneNumber: fullPhone,
        phoneVerified: true,
        phoneVerifiedAt: new Date().toISOString(),
      };

      await saveUserProfile(updated);
      try {
        localStorage.setItem('resourcebox_local_user', JSON.stringify(updated));
      } catch (e) {}

      onUpdateUser(updated);
      setIsSavingPhone(false);
      setPhoneSuccess('✓ Phone number permanently saved and verified on your profile!');
    } catch (err: any) {
      console.error('Error saving phone number:', err);
      setIsSavingPhone(false);
      setPhoneError('Could not save phone number right now. Please try again.');
    }
  };

  // Save full profile changes permanently
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!currentUser?.id) {
      setFormError('Please sign in first to create and save your profile.');
      return;
    }

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      setActiveTab('info');
      return;
    }

    if (!country.trim() || !state.trim() || !city.trim() || !pincode.trim()) {
      setFormError('Please select your Country and State / Province, and enter your City and Pincode / Postal Code.');
      setActiveTab('location');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const preferredHandover: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[] = [];
    if (pickupSelf) preferredHandover.push('Self Pickup');
    if (pickupMeetup) preferredHandover.push('Public Meetup');
    if (pickupDelivery) preferredHandover.push('Local Delivery');
    if (preferredHandover.length === 0) preferredHandover.push('Self Pickup');

    const cleanUsername = username.trim()
      ? (username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`)
      : '';

    const formattedLocation = [city.trim(), state.trim(), pincode.trim(), country.trim()].filter(Boolean).join(', ');
    const targetUserId = currentUser?.id || `user_${Date.now()}`;

    const updatedUser: User = {
      ...(currentUser || {
        id: targetUserId,
        rating: 5.0,
        reviewCount: 0,
        verified: true,
        phoneVerified: false,
        memberSince: 'March 2026',
        savedItemIds: [],
      }),
      id: currentUser?.id || targetUserId,
      name: name.trim(),
      email: email.trim() || currentUser?.email || '',
      username: cleanUsername,
      gender,
      bio: bio.trim(),
      country: country.trim(),
      state: state.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      postalCode: pincode.trim(),
      location: formattedLocation,
      neighborhood: neighborhood.trim(),
      currency: currentCountryInfo.currencySymbol,
      currencyCode: currentCountryInfo.currencyCode,
      avatar: avatarUrl || currentUser?.avatar || DEFAULT_AVATAR,
      preferredHandover,
      phoneNumber: phoneInput.trim() ? `${countryCode} ${phoneInput.trim().replace(/[^0-9]/g, '')}` : currentUser?.phoneNumber,
    };

    try {
      // Save permanently to Firestore and persistent server database
      await saveUserProfile(updatedUser);
      try {
        localStorage.setItem('resourcebox_local_user', JSON.stringify(updatedUser));
      } catch (e) {}

      onUpdateUser(updatedUser);
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 950);
    } catch (err) {
      console.error('Failed to save profile permanently to database:', err);
      setIsSaving(false);
      setFormError('Could not save profile changes. Please try again.');
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full z-10 shadow-2xl border border-[var(--theme-accent-light)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 28px var(--theme-glow)`,
        }}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-[var(--theme-accent-light)] to-white border-b border-[var(--theme-accent-light)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Live Circular Avatar Preview */}
            <div className="relative shrink-0 group">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt={name || 'User Avatar'}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-[var(--theme-primary)] shadow-md transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--theme-deep)] text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[var(--theme-deep)] font-sans truncate">
                  {name || 'Build Your Profile'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-bold border border-[var(--theme-accent)]">
                  {currentUser ? 'Community Member' : 'Profile Builder'}
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] truncate mt-0.5">
                {[email, [city, state, country].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Complete your profile details & location'}
              </p>
            </div>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Prominent Save Option in Profile Header */}
            <button
              type="button"
              onClick={() => handleSaveProfile()}
              disabled={isSaving}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-[var(--theme-deep)] text-white hover:opacity-95 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_14px_var(--theme-glow)]"
              title="Save Profile & Settings"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Profile'}</span>
            </button>

            {onNavigateHome && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateHome();
                }}
                title="Explore Items"
                className="px-2.5 py-1.5 rounded-xl bg-white/80 border border-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close Profile"
              className="w-8 h-8 rounded-xl bg-white/80 border border-[var(--theme-accent-light)] hover:bg-red-50 hover:text-red-600 text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-[var(--theme-accent-light)] px-3 sm:px-6 bg-white/60 overflow-x-auto shrink-0 gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-[var(--theme-deep)] text-[var(--theme-deep)] shadow-[0_2px_0_var(--theme-primary)]'
                : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Profile & Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'location'
                ? 'border-[var(--theme-deep)] text-[var(--theme-deep)] shadow-[0_2px_0_var(--theme-primary)]'
                : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Country, State & City</span>
            {isProfileLocationComplete({ country, state, city, pincode }) ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'verification'
                ? 'border-[var(--theme-deep)] text-[var(--theme-deep)] shadow-[0_2px_0_var(--theme-primary)]'
                : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Phone & Contact</span>
            {currentUser?.phoneNumber ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[var(--theme-deep)] text-[var(--theme-deep)] shadow-[0_2px_0_var(--theme-primary)]'
                : 'border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Themes ({themes.length})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--theme-accent-light)] text-[var(--theme-deep)] font-black">
              {currentTheme.name.split(' ')[0]}
            </span>
          </button>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="mx-4 mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="flex-1 font-semibold">{formError}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 text-left bg-[#FCFAFD]">
          
          {/* TAB 1: Profile & Photo (Photo upload, Name, Mail, Username, Bio, Gender) */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Photo Management Section */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[var(--theme-accent-light)] space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[var(--theme-primary)]" />
                    <span className="text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider">
                      Profile Photo
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[var(--theme-deep)] hover:text-[var(--theme-primary)] flex items-center gap-1 cursor-pointer bg-[var(--theme-accent-light)] px-2.5 py-1 rounded-lg border border-[var(--theme-accent)]/50"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomUrlOpen(!isCustomUrlOpen)}
                      className="text-xs font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)] flex items-center gap-1 cursor-pointer px-2 py-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {/* Custom URL Input Toggle */}
                {isCustomUrlOpen && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] focus:outline-none focus:border-[var(--theme-primary)]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-2 bg-[var(--theme-deep)] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Avatar Presets Selection */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[var(--theme-text-muted)] block">
                    Or pick a preset avatar:
                  </span>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`relative rounded-xl overflow-hidden p-0.5 transition-all cursor-pointer ${
                          avatarUrl === preset
                            ? 'ring-2 ring-[var(--theme-primary)] scale-105 shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-102'
                        }`}
                        title={`Select Avatar ${idx + 1}`}
                      >
                        <img
                          src={preset}
                          alt={`Preset ${idx + 1}`}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        {avatarUrl === preset && (
                          <div className="absolute inset-0 bg-[var(--theme-deep)]/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                    {avatarUrl && avatarUrl !== DEFAULT_AVATAR && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(DEFAULT_AVATAR)}
                        className="p-2 text-xs font-semibold text-[var(--theme-text-muted)] hover:text-red-500 flex items-center gap-1 cursor-pointer"
                        title="Reset to default"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name & Mail (Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-[var(--theme-primary)]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[var(--theme-primary)]" />
                    <span>Email Address (Mail) *</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                  />
                </div>
              </div>

              {/* Username & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5">
                    Username / Handle
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-[var(--theme-text-muted)] text-xs font-bold">
                      @
                    </span>
                    <input
                      type="text"
                      value={username.replace(/^@/, '')}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="alex_creator"
                      className="w-full pl-7 pr-3 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)] cursor-pointer"
                  >
                    <option value="">Select gender (optional)...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Bio / About You */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider">
                    Bio (About You)
                  </label>
                  <span className="text-[10px] text-[var(--theme-text-muted)]">
                    {bio.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio with neighbors about what equipment you use, your hobbies, or care guidelines..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] leading-relaxed focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              {/* Next & Save Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--theme-accent-light)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('location')}
                  className="text-xs font-bold text-[var(--theme-deep)] hover:text-[var(--theme-primary)] flex items-center justify-center gap-1 cursor-pointer py-2"
                >
                  <span>Next: State, City & Pincode →</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_18px_var(--theme-glow)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving Profile...' : saveSuccess ? 'Saved Successfully ✓' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Location with State, City, Pincode & Handover */}
          {activeTab === 'location' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Location Banner */}
              <div className="p-3.5 rounded-2xl bg-[var(--theme-accent-light)] border border-[var(--theme-accent)]/60 flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--theme-deep)] space-y-1">
                  <div className="font-bold flex items-center gap-2 flex-wrap">
                    <span>Location & Handover Area</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[var(--theme-deep)] text-white rounded-full">
                      Required Before Listing
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--theme-text-muted)] leading-relaxed">
                    Select your Country and State / Province, then enter your City and Pincode. These location fields are required before you can list any resource.
                  </p>
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5">
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)] cursor-pointer"
                >
                  <option value="">Select your country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.currencySymbol} {c.currencyCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[var(--theme-primary)]" />
                    <span>State / Province *</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!country}
                    required
                    className={`w-full px-3.5 py-2.5 text-xs border border-[var(--theme-accent-light)] rounded-xl font-semibold focus:outline-none focus:border-[var(--theme-primary)] ${
                      !country
                        ? 'bg-gray-100 text-[var(--theme-text-muted)] cursor-not-allowed'
                        : 'bg-white text-[var(--theme-deep)] cursor-pointer'
                    }`}
                  >
                    {!country ? (
                      <option value="">Select a country first...</option>
                    ) : (
                      <>
                        <option value="">Select State / Province...</option>
                        {availableStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                        {state && !availableStates.includes(state) && (
                          <option value={state}>{state}</option>
                        )}
                      </>
                    )}
                  </select>
                  {!country && (
                    <p className="text-[10px] text-[var(--theme-text-muted)] mt-1">
                      Choose a country above to unlock the states dropdown.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[var(--theme-primary)]" />
                    <span>City *</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. Mumbai, New York, Toronto, London"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>
              </div>

              {/* Pincode & Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[var(--theme-primary)]" />
                    <span>Pincode / Postal Code *</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.trim())}
                    required
                    placeholder="e.g. 400050, 110001, 94103"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5">
                    Neighborhood / Area / District
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Bandra West, Connaught Place, Soho"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>
              </div>

              {/* Live Location Formatted Preview Badge */}
              <div className="p-3 rounded-xl bg-white border border-[var(--theme-accent-light)] flex items-center justify-between gap-2 text-xs">
                <span className="text-[var(--theme-text-muted)] font-medium shrink-0">Full Address Preview:</span>
                <span className="font-bold text-[var(--theme-deep)] truncate max-w-xs sm:max-w-md">
                  {[neighborhood.trim(), city.trim(), state.trim(), pincode.trim(), country.trim()]
                    .filter(Boolean)
                    .join(', ') || 'Enter your country, state, city, and pincode above'}
                </span>
              </div>

              {/* Handover Preferences */}
              <div className="p-3.5 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-2.5">
                <span className="text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider block">
                  Preferred Handover Options
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${pickupSelf ? 'bg-[var(--theme-accent-light)] border-[var(--theme-primary)]' : 'bg-white border-[var(--theme-accent-light)]'}`}>
                    <input
                      type="checkbox"
                      checked={pickupSelf}
                      onChange={(e) => setPickupSelf(e.target.checked)}
                      className="w-4 h-4 text-[var(--theme-deep)] rounded"
                    />
                    <span className="text-xs font-semibold text-[var(--theme-deep)]">Self Pickup</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${pickupMeetup ? 'bg-[var(--theme-accent-light)] border-[var(--theme-primary)]' : 'bg-white border-[var(--theme-accent-light)]'}`}>
                    <input
                      type="checkbox"
                      checked={pickupMeetup}
                      onChange={(e) => setPickupMeetup(e.target.checked)}
                      className="w-4 h-4 text-[var(--theme-deep)] rounded"
                    />
                    <span className="text-xs font-semibold text-[var(--theme-deep)]">Public Meetup</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${pickupDelivery ? 'bg-[var(--theme-accent-light)] border-[var(--theme-primary)]' : 'bg-white border-[var(--theme-accent-light)]'}`}>
                    <input
                      type="checkbox"
                      checked={pickupDelivery}
                      onChange={(e) => setPickupDelivery(e.target.checked)}
                      className="w-4 h-4 text-[var(--theme-deep)] rounded"
                    />
                    <span className="text-xs font-semibold text-[var(--theme-deep)]">Local Delivery</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--theme-accent-light)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className="text-xs font-bold text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)] py-2 text-center"
                >
                  ← Back to Details
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_18px_var(--theme-glow)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Location & Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Phone & Contact (Direct Verification & Firebase Sync) */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--theme-accent-light)] border border-[var(--theme-accent)] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--theme-deep)] space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <span>Contact Number & Verification</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[var(--theme-deep)] text-white rounded-full">
                      Firebase Connected
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-[var(--theme-text-muted)]">
                    Add your phone number to coordinate item handovers and receive rental requests. Stored permanently in your database profile.
                  </p>
                </div>
              </div>

              {/* Phone Status & Entry */}
              <div className="p-4 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--theme-accent-light)] text-[var(--theme-deep)] flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--theme-deep)]">
                        {phoneInput.trim() ? 'Phone Registered' : 'Enter Mobile Number'}
                      </div>
                      <div className="text-[11px] text-[var(--theme-text-muted)]">
                        {currentUser?.phoneNumber ? currentUser.phoneNumber : 'Required for verified peer handovers'}
                      </div>
                    </div>
                  </div>

                  {currentUser?.phoneNumber ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified ✓</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                      <span>Action Needed</span>
                    </span>
                  )}
                </div>

                {/* Entry Field */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[var(--theme-accent-light)]">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative w-28 sm:w-32 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full appearance-none pl-3 pr-7 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-bold focus:outline-none focus:border-[var(--theme-primary)]"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.dialCode}>
                            {c.flag} {c.dialCode}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-[var(--theme-text-muted)] pointer-events-none" />
                    </div>

                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-bold tracking-wider focus:outline-none focus:border-[var(--theme-primary)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePhone}
                    disabled={isSavingPhone || !phoneInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_18px_var(--theme-glow)]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingPhone ? 'Saving...' : 'Save Phone'}</span>
                  </button>
                </div>

                {phoneSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{phoneSuccess}</span>
                  </div>
                )}

                {phoneError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 font-semibold border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Themes & Colors (Multiple color combinations & instant switcher) */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[var(--theme-deep)] font-sans">
                      Theme & Multiple Color Combinations
                    </h3>
                    <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                      Select any theme below. All categories, cards, and glowing highlights update instantly across the entire app.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]">
                    Active: {currentTheme.name}
                  </span>
                </div>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((theme) => {
                  const isActive = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={`p-3.5 rounded-2xl border transition-[border-color,transform] duration-150 hover:scale-[1.01] active:scale-[0.99] text-left flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        isActive
                          ? 'bg-white border-2 border-[var(--theme-deep)] shadow-md'
                          : 'bg-white border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)]'
                      }`}
                      style={{
                        boxShadow: isActive ? `0 0 18px ${theme.glow}` : undefined,
                      }}
                    >
                      <div>
                        {/* Theme Header with Swatch Dots */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {theme.previewColors.map((hex, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.deep }}>
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-xs" style={{ color: theme.deep }}>
                          {theme.name}
                        </div>
                        <div className="text-[11px] text-[var(--theme-text-muted)] font-medium mt-0.5">
                          {theme.subtitle}
                        </div>
                        <p className="text-[10px] text-[var(--theme-text-muted)] line-clamp-2 mt-1 leading-relaxed">
                          {theme.description}
                        </p>
                      </div>

                      {/* Gradient Shining Swatch Strip */}
                      <div
                        className="h-2 w-full rounded-full mt-3 overflow-hidden border border-black/5"
                        style={{ background: theme.gradientShine }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-2">
                <span className="text-[11px] font-bold text-[var(--theme-deep)] uppercase tracking-wider block">
                  Live Preview in Current Theme ({currentTheme.name})
                </span>
                <div className="p-3 rounded-xl border border-[var(--theme-accent-light)] flex items-center justify-between" style={{ background: currentTheme.canvas }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs" style={{ backgroundColor: currentTheme.deep }}>
                      {currentCountryInfo.currencySymbol}
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: currentTheme.deep }}>
                        Cordless Rotary Tool Set
                      </div>
                      <div className="text-[11px]" style={{ color: currentTheme.textMuted }}>
                        {[city, state].filter(Boolean).join(', ') || 'Your City, State'} · Verified Member
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.deep, boxShadow: `0 0 14px ${currentTheme.glow}` }}
                  >
                    Rent Now
                  </button>
                </div>
              </div>

              {/* Direct Save Theme Option Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--theme-accent-light)]">
                <div className="text-xs text-[var(--theme-text-muted)] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                  <span>
                    Active Color Scheme: <strong className="text-[var(--theme-deep)]">{currentTheme.name}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_18px_var(--theme-glow)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving Theme...' : saveSuccess ? 'Saved Successfully ✓' : 'Save & Apply Theme'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

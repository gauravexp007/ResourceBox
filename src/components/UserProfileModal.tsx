import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  X,
  User as UserIcon,
  Camera,
  Phone,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  Check,
  Mail,
  Link as LinkIcon,
  Building2,
  Hash,
  Compass,
  Smartphone,
  ChevronDown,
  Home,
  Trash2,
  Grid3X3,
  Bell,
  Users,
  UserCheck,
  Edit3,
  Plus,
  Copy,
  RefreshCw,
  AtSign,
  Loader2,
  PackageOpen,
  Star,
} from 'lucide-react';
import { Item, PublicUserProfile, UploadNotification, User } from '../types';
import {
  saveUserProfile,
  verifyUserPhoneInFirestore,
  checkUsernameAvailability,
  getPublicCreatorProfile,
  normalizeUsernameHandle,
} from '../services/firebaseService';
import {
  COUNTRIES,
  getCountryInfo,
  getStatesForCountry,
  isProfileLocationComplete,
} from '../utils/currency';
import {
  VerifiedBadge,
  isAdminAccount,
  ADMIN_USERNAME,
  ADMIN_EMAIL,
} from './VerifiedBadge';

interface UserProfileModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  initialTab?: 'info' | 'location' | 'verification';
  highlightPhoneRequired?: boolean;
  onNavigateHome?: () => void;
  items?: Item[];
  followingIds?: string[];
  followerIds?: string[];
  uploadNotifications?: UploadNotification[];
  onSelectItem?: (item: Item) => void;
  onOpenUpload?: () => void;
  onSelectCreator?: (creatorId: string) => void;
  onToggleFollow?: (creator: { id: string; name?: string; username?: string; avatar?: string }) => Promise<void> | void;
  onMarkNotificationsRead?: (notificationId?: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';

type MainSection = 'posts' | 'updates' | 'followers' | 'following' | 'edit';
type EditSubSection = 'info' | 'location' | 'verification';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateUser,
  initialTab = 'info',
  highlightPhoneRequired = false,
  onNavigateHome,
  items = [],
  followingIds = [],
  followerIds = [],
  uploadNotifications = [],
  onSelectItem,
  onOpenUpload,
  onSelectCreator,
  onToggleFollow,
  onMarkNotificationsRead,
}) => {
  const resolveInitialMainSection = (): MainSection => {
    if (highlightPhoneRequired || initialTab === 'verification' || initialTab === 'location') {
      return 'edit';
    }
    return 'posts';
  };

  const resolveInitialEditSub = (): EditSubSection => {
    if (highlightPhoneRequired || initialTab === 'verification') return 'verification';
    if (initialTab === 'location') return 'location';
    return 'info';
  };

  const [mainSection, setMainSection] = useState<MainSection>(resolveInitialMainSection);
  const [editSubTab, setEditSubTab] = useState<EditSubSection>(resolveInitialEditSub);

  useEffect(() => {
    if (!isOpen) return;
    setMainSection(resolveInitialMainSection());
    setEditSubTab(resolveInitialEditSub());
  }, [isOpen, highlightPhoneRequired, initialTab]);

  // Form Fields State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [gender, setGender] = useState<string>(currentUser?.gender || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Live @username availability feedback
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });

  // Location fields
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

  // Phone State
  const currentCountryInfo = getCountryInfo(country);
  const availableStates = getStatesForCountry(country);
  const [countryCode, setCountryCode] = useState(currentCountryInfo.dialCode || '+91');
  const [phoneInput, setPhoneInput] = useState(
    currentUser?.phoneNumber ? currentUser.phoneNumber.replace(/^\+\d+\s*/, '') : ''
  );
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');

  // Saving & UI states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [followersList, setFollowersList] = useState<PublicUserProfile[]>([]);
  const [followingList, setFollowingList] = useState<PublicUserProfile[]>([]);
  const [loadingNetwork, setLoadingNetwork] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const myItems = useMemo(
    () =>
      items
        .filter((i) => currentUser && i.owner?.id === currentUser.id)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()),
    [items, currentUser]
  );

  const unreadUpdatesCount = useMemo(
    () => uploadNotifications.filter((n) => !n.read).length,
    [uploadNotifications]
  );

  // Sync form states on open
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormError('');
      setSaveSuccess(false);
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
      setPhoneInput(
        currentUser.phoneNumber ? currentUser.phoneNumber.replace(/^\+\d+\s*/, '') : ''
      );
      if (currentUser.preferredHandover) {
        setPickupSelf(currentUser.preferredHandover.includes('Self Pickup'));
        setPickupMeetup(currentUser.preferredHandover.includes('Public Meetup'));
        setPickupDelivery(currentUser.preferredHandover.includes('Local Delivery'));
      }
    }
  }, [currentUser, isOpen]);

  // Load followers / following network lists when viewing network tabs
  useEffect(() => {
    if (!isOpen || !currentUser?.id) return;
    if (mainSection !== 'followers' && mainSection !== 'following') return;

    let active = true;
    setLoadingNetwork(true);
    getPublicCreatorProfile(currentUser.id, items)
      .then((res) => {
        if (!active) return;
        setFollowersList(res.followers || []);
        setFollowingList(res.following || []);
      })
      .finally(() => {
        if (active) setLoadingNetwork(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, currentUser?.id, mainSection, followingIds.length, followerIds.length]);

  // Debounced live @username availability check while editing
  useEffect(() => {
    if (!isOpen || mainSection !== 'edit' || editSubTab !== 'info') return;
    if (isAdminAccount(currentUser)) {
      setUsernameStatus({
        checking: false,
        available: true,
        message: 'Verified Official Admin Handle',
      });
      return;
    }
    const bare = username.trim().replace(/^@+/, '').toLowerCase();
    if (!bare) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    let active = true;
    setUsernameStatus({ checking: true, available: null, message: 'Checking handle...' });

    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(bare, currentUser?.id);
        if (!active) return;
        if (res.available) {
          setUsernameStatus({
            checking: false,
            available: true,
            message: `${res.normalized} is available`,
          });
        } else {
          setUsernameStatus({
            checking: false,
            available: false,
            message: res.reason || 'Unavailable username',
          });
        }
      } catch {
        if (active) setUsernameStatus({ checking: false, available: null, message: '' });
      }
    }, 320);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [username, isOpen, mainSection, editSubTab, currentUser?.id]);

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

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setIsCustomUrlOpen(false);
    setCustomUrlInput('');
  };

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
      } catch {}
      onUpdateUser(updated);
      setIsSavingPhone(false);
      setPhoneSuccess('✓ Phone number permanently saved and verified on your profile!');
    } catch {
      setIsSavingPhone(false);
      setPhoneError('Could not save phone number right now. Please try again.');
    }
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!currentUser?.id) {
      setFormError('Please sign in first to create and save your profile.');
      return;
    }

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      setMainSection('edit');
      setEditSubTab('info');
      return;
    }

    const currentIsAdmin = isAdminAccount(currentUser);
    const bareUsername = currentIsAdmin
      ? 'resourcebox'
      : username.trim().replace(/^@+/, '').toLowerCase();
    if (bareUsername && !currentIsAdmin) {
      if (!/^[a-z0-9_]{3,24}$/.test(bareUsername)) {
        setFormError('Username must be 3–24 characters using lowercase letters, numbers, or underscores.');
        setMainSection('edit');
        setEditSubTab('info');
        return;
      }
      const availCheck = await checkUsernameAvailability(bareUsername, currentUser.id);
      if (!availCheck.available) {
        setFormError(availCheck.reason || `Username @${bareUsername} is already taken.`);
        setMainSection('edit');
        setEditSubTab('info');
        return;
      }
    }

    // If user is explicitly saving from location tab or has already started entering location, ensure required location fields
    if (!currentIsAdmin && editSubTab === 'location' && (!country.trim() || !state.trim() || !city.trim() || !pincode.trim())) {
      setFormError('Please select your Country and State / Province, and enter your City and Pincode / Postal Code.');
      setMainSection('edit');
      setEditSubTab('location');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const preferredHandover: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[] = [];
    if (pickupSelf) preferredHandover.push('Self Pickup');
    if (pickupMeetup) preferredHandover.push('Public Meetup');
    if (pickupDelivery) preferredHandover.push('Local Delivery');
    if (preferredHandover.length === 0) preferredHandover.push('Self Pickup');

    const cleanUsername = currentIsAdmin
      ? ADMIN_USERNAME
      : bareUsername
        ? `@${bareUsername}`
        : '';
    const formattedLocation = [city.trim(), state.trim(), pincode.trim(), country.trim()]
      .filter(Boolean)
      .join(', ');

    const updatedUser: User = {
      ...currentUser,
      id: currentUser.id,
      name: name.trim(),
      email: currentIsAdmin ? ADMIN_EMAIL : (email.trim() || currentUser.email || ''),
      username: cleanUsername,
      gender,
      bio: bio.trim(),
      country: currentIsAdmin ? '' : country.trim(),
      state: currentIsAdmin ? '' : state.trim(),
      city: currentIsAdmin ? '' : city.trim(),
      pincode: currentIsAdmin ? '' : pincode.trim(),
      postalCode: currentIsAdmin ? '' : pincode.trim(),
      location: currentIsAdmin ? '' : formattedLocation,
      neighborhood: currentIsAdmin ? 'ResourceBox HQ' : neighborhood.trim(),
      currency: currentIsAdmin ? '₹' : currentCountryInfo.currencySymbol,
      currencyCode: currentIsAdmin ? 'INR' : currentCountryInfo.currencyCode,
      avatar: avatarUrl || currentUser.avatar || DEFAULT_AVATAR,
      preferredHandover,
      phoneNumber: phoneInput.trim()
        ? `${countryCode} ${phoneInput.trim().replace(/[^0-9]/g, '')}`
        : currentUser.phoneNumber,
    };

    try {
      await saveUserProfile(updatedUser);
      try {
        localStorage.setItem('resourcebox_local_user', JSON.stringify(updatedUser));
      } catch {}

      onUpdateUser(updatedUser);
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        setMainSection('posts');
      }, 700);
    } catch (err: any) {
      setIsSaving(false);
      setFormError(err?.message || 'Could not save profile changes. Please try again.');
    }
  };

  if (!isOpen || !currentUser) return null;

  const isAdmin = isAdminAccount(currentUser);
  const displayHandle = isAdmin
    ? ADMIN_USERNAME
    : normalizeUsernameHandle(username || currentUser.username);
  const displayCityLine = isAdmin
    ? ''
    : [city || currentUser.city, state || currentUser.state, country || currentUser.country]
        .filter(Boolean)
        .join(', ');

  const jumpToUsernameField = () => {
    setMainSection('edit');
    setEditSubTab('info');
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 60);
  };

  const handleCopyHandle = () => {
    if (!displayHandle) return;
    navigator.clipboard?.writeText(displayHandle).catch(() => {});
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 1800);
  };

  const renderNetworkList = (list: PublicUserProfile[], emptyMsg: string) => {
    if (loadingNetwork) {
      return (
        <div
          className={`py-12 flex items-center justify-center gap-2 text-xs ${
            isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
          }`}
        >
          <Loader2
            className={`w-5 h-5 animate-spin ${
              isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
            }`}
          />
          <span>Loading community connections...</span>
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div
          className={`py-12 text-center rounded-2xl border space-y-2 ${
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
            className={`text-xs font-semibold max-w-xs mx-auto ${
              isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
            }`}
          >
            {emptyMsg}
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
          const isFollowingPerson = followingIds.includes(person.id);
          const personIsAdmin = isAdminAccount(person);
          return (
            <div
              key={person.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
                isAdmin ? 'hover:bg-[#1B243B]' : 'hover:bg-[var(--theme-accent-light)]/25'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCreator?.(person.id);
                }}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
              >
                <img
                  src={person.avatar || DEFAULT_AVATAR}
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
                    {person.name} · {person.uploadsCount} uploads
                  </div>
                </div>
              </button>

              {person.id !== currentUser.id && onToggleFollow && (
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
                    isFollowingPerson
                      ? isAdmin
                        ? 'bg-[#1E293B] text-[#FDE68A] border border-[#F59E0B]/40'
                        : 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]'
                      : isAdmin
                        ? 'bg-[#F59E0B] text-[#0B0F1A] hover:brightness-105'
                        : 'bg-[var(--theme-deep)] text-white hover:opacity-95'
                  }`}
                >
                  {isFollowingPerson ? 'Following' : 'Follow'}
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 bg-black/65"
        onClick={onClose}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Instagram-Style Profile Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18 }}
        data-admin-profile={isAdmin ? 'true' : 'false'}
        className={`relative rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full z-10 shadow-2xl border overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isAdmin
            ? 'bg-[#0B0F1A] border-[#F59E0B]/45'
            : 'bg-white border-[var(--theme-accent-light)]'
        }`}
        style={{
          boxShadow: isAdmin
            ? '0 28px 64px -12px rgba(0, 0, 0, 0.72), 0 0 38px rgba(245, 158, 11, 0.22)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 28px var(--theme-glow)',
        }}
      >
        {/* Instagram-Style Sticky Top Bar */}
        <div
          className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-2 shrink-0 ${
            isAdmin
              ? 'bg-[#0F1629] border-[#F59E0B]/25'
              : 'bg-white border-[var(--theme-accent-light)]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-sm sm:text-base font-black truncate ${
                isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
              }`}
            >
              {displayHandle || name || 'Your Profile'}
            </span>
            <VerifiedBadge
              isAdmin={isAdmin}
              verified={currentUser.verified ?? true}
              size="md"
              showAdminLabel={isAdmin}
              adminLabelTone="dark"
            />
            {displayHandle ? (
              <button
                type="button"
                onClick={handleCopyHandle}
                className={`hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer hover:opacity-90 ${
                  isAdmin
                    ? 'bg-[#161F36] border border-[#F59E0B]/35 text-[#FDE68A]'
                    : 'bg-[var(--theme-accent-light)] text-[var(--theme-deep)]'
                }`}
                title="Copy your @username"
              >
                {copiedHandle ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedHandle ? 'Copied' : 'Copy handle'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={jumpToUsernameField}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--theme-deep)] text-white text-[10px] font-bold cursor-pointer hover:opacity-95"
              >
                <AtSign className="w-3 h-3" />
                <span>Claim @username</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {mainSection === 'edit' && (
              <button
                type="button"
                onClick={() => handleSaveProfile()}
                disabled={isSaving}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-[#0B0F1A] hover:brightness-105'
                    : 'bg-[var(--theme-deep)] text-white hover:opacity-95'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save'}</span>
              </button>
            )}

            {onNavigateHome && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateHome();
                }}
                title="Explore Marketplace"
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                  isAdmin
                    ? 'bg-[#161F36] border-[#F59E0B]/30 hover:border-[#FBBF24] text-[#FFFBEB]'
                    : 'bg-white border-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)]'
                }`}
              >
                <Home
                  className={`w-3.5 h-3.5 ${
                    isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                  }`}
                />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-[#161F36] hover:bg-red-950/60 text-[#CBD5E1] hover:text-red-300'
                  : 'bg-[var(--theme-accent-light)]/50 hover:bg-red-50 hover:text-red-600 text-[var(--theme-text-muted)]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className={`overflow-y-auto overscroll-contain flex-1 ${
            isAdmin ? 'bg-[#090D16]' : 'bg-[#FCFAFD]'
          }`}
        >
          {/* Instagram-Style Header Card */}
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
              {/* Circular Avatar with Gradient Ring + Camera Edit Trigger */}
              <div className="relative shrink-0">
                <div
                  className="p-[3px] rounded-full shadow-md"
                  style={{
                    background: isAdmin
                      ? 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 48%, #B45309 100%)'
                      : 'linear-gradient(135deg, var(--theme-deep), var(--theme-primary), var(--theme-accent))',
                  }}
                >
                  <div className={`p-[2px] rounded-full ${isAdmin ? 'bg-[#0F1629]' : 'bg-white'}`}>
                    <img
                      src={avatarUrl || DEFAULT_AVATAR}
                      alt={name || 'Profile'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isAdmin
                          ? '/admin-avatar.jpg'
                          : DEFAULT_AVATAR;
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-md ring-2 hover:opacity-95 transition-opacity cursor-pointer ${
                    isAdmin
                      ? 'bg-[#F59E0B] text-[#0B0F1A] ring-[#0F1629]'
                      : 'bg-[var(--theme-deep)] text-white ring-white'
                  }`}
                  title="Update Profile Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Instagram 3-Column Stats + Handle & Rating */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center sm:text-left max-w-sm">
                  <button
                    type="button"
                    onClick={() => setMainSection('posts')}
                    className="cursor-pointer group"
                  >
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {myItems.length}
                    </div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isAdmin ? 'text-[#E2D9C5]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Posts
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainSection('followers')}
                    className="cursor-pointer group"
                  >
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {followerIds.length}
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
                    onClick={() => setMainSection('following')}
                    className="cursor-pointer group"
                  >
                    <div
                      className={`text-base sm:text-lg font-black tabular-nums leading-tight transition-colors ${
                        isAdmin
                          ? 'text-[#FFFBEB] group-hover:text-[#FBBF24]'
                          : 'text-[var(--theme-deep)] group-hover:text-[var(--theme-primary)]'
                      }`}
                    >
                      {followingIds.length}
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

                {/* Quick Status Badges */}
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
                    <span>{currentUser.rating ?? 5.0}</span>
                  </span>

                  {isAdmin && (
                    <span className="inline-flex items-center font-bold text-[#FDE68A] bg-[#161F36] border border-[#F59E0B]/30 px-2.5 py-0.5 rounded-md">
                      ResourceBox HQ
                    </span>
                  )}

                  {displayCityLine && (
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
                      <span className="truncate max-w-[180px]">{displayCityLine}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio & Name Block */}
            <div className="relative space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-sm font-extrabold ${
                    isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                  }`}
                >
                  {name || 'Community Member'}
                </span>
                <VerifiedBadge
                  isAdmin={isAdmin}
                  verified={currentUser.verified ?? true}
                  size="sm"
                />
                {displayHandle ? (
                  <button
                    type="button"
                    onClick={jumpToUsernameField}
                    className={`text-xs font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer ${
                      isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                    }`}
                    title={isAdmin ? 'Official Admin Handle' : 'Edit your @username'}
                  >
                    {displayHandle}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={jumpToUsernameField}
                    className="text-[11px] font-bold text-[var(--theme-primary)] hover:underline cursor-pointer"
                  >
                    + Add @username so others can find & follow you
                  </button>
                )}
              </div>
              <p
                className={`text-xs leading-relaxed whitespace-pre-line ${
                  isAdmin ? 'text-[#E2E8F0]' : 'text-[var(--theme-text-muted)]'
                }`}
              >
                {bio.trim() ||
                  'Add a short bio in Edit Profile to tell neighbors what gear you share on ResourceBox.'}
              </p>
            </div>

            {/* Instagram Action Buttons Row */}
            <div className="relative grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMainSection('edit');
                  setEditSubTab('info');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold !transition-none flex items-center justify-center gap-1.5 cursor-pointer border ${
                  mainSection === 'edit'
                    ? isAdmin
                      ? 'bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] !text-[#0B0F1A] border-[#F59E0B]'
                      : 'bg-[var(--theme-deep)] !text-white border-[var(--theme-deep)]'
                    : isAdmin
                      ? 'bg-[#151D31] hover:bg-[#1E293B] !text-[#FDE68A] border-[#F59E0B]/35'
                      : 'bg-[var(--theme-accent-light)]/70 hover:bg-[var(--theme-accent-light)] !text-[var(--theme-deep)] border-[var(--theme-accent)]/60'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              {onOpenUpload ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUpload();
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isAdmin
                      ? 'bg-[#151D31] border-[#F59E0B]/35 hover:border-[#FBBF24] text-[#FFFBEB]'
                      : 'bg-white border-[var(--theme-accent)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)]'
                  }`}
                >
                  <Plus
                    className={`w-3.5 h-3.5 ${
                      isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                    }`}
                  />
                  <span>Upload Item</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMainSection('edit');
                    setEditSubTab('location');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isAdmin
                      ? 'bg-[#151D31] border-[#F59E0B]/35 hover:border-[#FBBF24] text-[#FFFBEB]'
                      : 'bg-white border-[var(--theme-accent)] hover:border-[var(--theme-primary)] text-[var(--theme-deep)]'
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 ${
                      isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                    }`}
                  />
                  <span>Location</span>
                </button>
              )}
            </div>
          </div>

          {/* Instagram-Style Navigation Tabs */}
          <div
            className={`border-b grid grid-cols-3 sticky top-0 z-10 ${
              isAdmin
                ? 'bg-[#0F1629] border-[#F59E0B]/25'
                : 'bg-white border-[var(--theme-accent-light)]'
            }`}
          >
            <button
              type="button"
              onClick={() => setMainSection('posts')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer ${
                mainSection === 'posts'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Posts</span>
            </button>

            <button
              type="button"
              onClick={() => setMainSection('updates')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer relative ${
                mainSection === 'updates'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Updates</span>
              {unreadUpdatesCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isAdmin
                      ? 'bg-[#F59E0B] text-[#0B0F1A]'
                      : 'bg-[var(--theme-deep)] text-white'
                  }`}
                >
                  {unreadUpdatesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMainSection('edit')}
              className={`py-3 flex items-center justify-center gap-1.5 text-xs font-bold border-b-2 !transition-none cursor-pointer ${
                mainSection === 'edit'
                  ? isAdmin
                    ? 'border-[#F59E0B] !text-[#FDE68A]'
                    : 'border-[var(--theme-deep)] !text-[var(--theme-deep)]'
                  : isAdmin
                    ? 'border-transparent !text-[#94A3B8] hover:!text-[#FFFBEB]'
                    : 'border-transparent !text-[var(--theme-text-muted)] hover:!text-[var(--theme-deep)]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mx-4 mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="flex-1 font-semibold">{formError}</span>
            </div>
          )}

          {/* Tab Panel Content */}
          <div className="p-4 sm:p-6 space-y-5 text-left">
            {/* 1. INSTAGRAM 3-COLUMN POSTS GRID */}
            {mainSection === 'posts' && (
              <div className="space-y-4">
                {myItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                    {myItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectItem?.(item);
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
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/65 text-white text-[10px] font-bold flex items-center gap-1">
                          {item.listingType === 'exchange' ? (
                            <RefreshCw className="w-2.5 h-2.5" />
                          ) : (
                            <span>
                              {item.currencySymbol || '₹'}
                              {item.priceDaily}
                            </span>
                          )}
                        </div>
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
                    {onOpenUpload && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenUpload();
                        }}
                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                          isAdmin
                            ? 'border-[#F59E0B]/40 hover:border-[#F59E0B] bg-[#111827] hover:bg-[#161F36] text-[#FDE68A]'
                            : 'border-[var(--theme-accent)] hover:border-[var(--theme-primary)] bg-white/80 hover:bg-white text-[var(--theme-deep)]'
                        }`}
                      >
                        <Plus
                          className={`w-6 h-6 ${
                            isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                          }`}
                        />
                        <span className="text-[11px] font-bold">New Post</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`py-12 px-4 text-center rounded-2xl border space-y-3 ${
                      isAdmin
                        ? 'bg-[#111827] border-[#F59E0B]/25'
                        : 'bg-white border-[var(--theme-accent-light)]'
                    }`}
                  >
                    <PackageOpen
                      className={`w-10 h-10 mx-auto opacity-75 ${
                        isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                      }`}
                    />
                    <div className="space-y-1">
                      <h3
                        className={`text-sm font-extrabold ${
                          isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                        }`}
                      >
                        Share Your First Resource
                      </h3>
                      <p
                        className={`text-xs max-w-xs mx-auto ${
                          isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
                        }`}
                      >
                        When you upload items, they appear here in your Instagram-style grid and notify everyone following {displayHandle || 'you'}.
                      </p>
                    </div>
                    {onOpenUpload && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenUpload();
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                          isAdmin
                            ? 'bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-[#0B0F1A] hover:brightness-105'
                            : 'bg-[var(--theme-deep)] text-white hover:opacity-95'
                        }`}
                      >
                        Upload First Resource
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. FOLLOWING UPDATES FEED */}
            {mainSection === 'updates' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-xs font-extrabold uppercase tracking-wider ${
                        isAdmin ? 'text-[#FDE68A]' : 'text-[var(--theme-deep)]'
                      }`}
                    >
                      Updates From Creators You Follow
                    </h3>
                    <p
                      className={`text-[11px] ${
                        isAdmin ? 'text-[#94A3B8]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Following {followingIds.length} creator{followingIds.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  {unreadUpdatesCount > 0 && onMarkNotificationsRead && (
                    <button
                      type="button"
                      onClick={() => onMarkNotificationsRead()}
                      className={`text-[11px] font-bold hover:underline cursor-pointer ${
                        isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                      }`}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {uploadNotifications.length > 0 ? (
                  <div className="space-y-2.5">
                    {uploadNotifications.map((notif) => {
                      const matchedItem = items.find((i) => i.id === notif.itemId);
                      return (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                            notif.read
                              ? isAdmin
                                ? 'bg-[#111827] border-[#F59E0B]/20'
                                : 'bg-white border-[var(--theme-accent-light)]'
                              : isAdmin
                                ? 'bg-[#1B243B] border-[#F59E0B]/50'
                                : 'bg-[var(--theme-accent-light)]/35 border-[var(--theme-primary)]/50'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectCreator?.(notif.creatorId);
                            }}
                            className="shrink-0 cursor-pointer"
                          >
                            <img
                              src={notif.creatorAvatar || DEFAULT_AVATAR}
                              alt={notif.creatorName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--theme-accent)]"
                            />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-xs leading-snug ${
                                isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectCreator?.(notif.creatorId);
                                }}
                                className="font-extrabold hover:underline cursor-pointer"
                              >
                                {notif.creatorUsername || notif.creatorName}
                              </button>{' '}
                              <span
                                className={
                                  isAdmin ? 'text-[#94A3B8]' : 'text-[var(--theme-text-muted)]'
                                }
                              >
                                uploaded
                              </span>{' '}
                              <span className="font-bold">{notif.itemTitle}</span>
                            </div>
                            <div
                              className={`text-[10px] mt-0.5 flex items-center gap-2 ${
                                isAdmin ? 'text-[#94A3B8]' : 'text-[var(--theme-text-muted)]'
                              }`}
                            >
                              <span className="capitalize">{notif.itemCategory}</span>
                              {notif.priceRateText && <span>· {notif.priceRateText}</span>}
                              {!notif.read && (
                                <span
                                  className={`inline-block w-2 h-2 rounded-full ${
                                    isAdmin ? 'bg-[#F59E0B]' : 'bg-[var(--theme-primary)]'
                                  }`}
                                />
                              )}
                            </div>
                          </div>

                          {notif.itemImage && (
                            <button
                              type="button"
                              onClick={() => {
                                onMarkNotificationsRead?.(notif.id);
                                if (matchedItem) {
                                  onClose();
                                  onSelectItem?.(matchedItem);
                                }
                              }}
                              className="w-12 h-12 rounded-xl overflow-hidden bg-[#EEEEEE] border border-[var(--theme-accent-light)] shrink-0 cursor-pointer"
                              title="View uploaded product"
                            >
                              <img
                                src={notif.itemImage}
                                alt={notif.itemTitle}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`py-12 px-4 text-center rounded-2xl border space-y-2 ${
                      isAdmin
                        ? 'bg-[#111827] border-[#F59E0B]/25'
                        : 'bg-white border-[var(--theme-accent-light)]'
                    }`}
                  >
                    <Bell
                      className={`w-9 h-9 mx-auto opacity-75 ${
                        isAdmin ? 'text-[#F59E0B]' : 'text-[var(--theme-primary)]'
                      }`}
                    />
                    <p
                      className={`text-xs font-bold ${
                        isAdmin ? 'text-[#FFFBEB]' : 'text-[var(--theme-deep)]'
                      }`}
                    >
                      No Upload Updates Yet
                    </p>
                    <p
                      className={`text-[11px] max-w-xs mx-auto ${
                        isAdmin ? 'text-[#CBD5E1]' : 'text-[var(--theme-text-muted)]'
                      }`}
                    >
                      Search creators by @username in the top search bar and tap Follow to see their newest product uploads here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. FOLLOWERS / FOLLOWING NETWORK */}
            {mainSection === 'followers' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isAdmin ? 'text-[#FDE68A]' : 'text-[var(--theme-deep)]'
                    }`}
                  >
                    Followers ({followerIds.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMainSection('posts')}
                    className={`text-xs font-bold hover:underline cursor-pointer ${
                      isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                    }`}
                  >
                    Back to Grid
                  </button>
                </div>
                {renderNetworkList(followersList, 'Nobody is following your profile yet. Share your @username!')}
              </div>
            )}

            {mainSection === 'following' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isAdmin ? 'text-[#FDE68A]' : 'text-[var(--theme-deep)]'
                    }`}
                  >
                    Following ({followingIds.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMainSection('posts')}
                    className={`text-xs font-bold hover:underline cursor-pointer ${
                      isAdmin ? 'text-[#FBBF24]' : 'text-[var(--theme-primary)]'
                    }`}
                  >
                    Back to Grid
                  </button>
                </div>
                {renderNetworkList(
                  followingList,
                  'You are not following anyone yet. Search any @username to follow creators!'
                )}
              </div>
            )}

            {/* 4. EDIT PROFILE (with sub-tabs: Profile & @Username, Location, Phone & Contact) */}
            {mainSection === 'edit' && (
              <div
                className={`space-y-4 ${
                  isAdmin
                    ? 'bg-[#F8F6FB] rounded-2xl p-4 sm:p-5 border border-[#F59E0B]/35 shadow-sm'
                    : ''
                }`}
              >
                {/* Sub-tab Selector */}
                <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-[var(--theme-accent-light)]">
                  <button
                    type="button"
                    onClick={() => setEditSubTab('info')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      editSubTab === 'info'
                        ? 'bg-[var(--theme-deep)] text-white'
                        : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
                    }`}
                  >
                    <AtSign className="w-3.5 h-3.5" />
                    <span>Identity & @Username</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditSubTab('location')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      editSubTab === 'location'
                        ? 'bg-[var(--theme-deep)] text-white'
                        : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Country & City</span>
                    {isAdmin || isProfileLocationComplete({ country, state, city, pincode }) ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditSubTab('verification')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      editSubTab === 'verification'
                        ? 'bg-[var(--theme-deep)] text-white'
                        : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone & Contact</span>
                  </button>
                </div>

                {/* EDIT SUB-TAB A: Profile, Photo & Unique @Username */}
                {editSubTab === 'info' && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {/* Highlighted @Username Card for Authorized Users */}
                    <div className="p-4 rounded-2xl bg-white border-2 border-[var(--theme-accent)] space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="profile-username-input"
                          className="text-xs font-extrabold text-[var(--theme-deep)] uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <AtSign className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                          <span>Public @Username Handle</span>
                        </label>

                        {usernameStatus.checking ? (
                          <span className="text-[11px] font-semibold text-[var(--theme-text-muted)] flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Checking...
                          </span>
                        ) : usernameStatus.available === true ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{usernameStatus.message}</span>
                          </span>
                        ) : usernameStatus.available === false ? (
                          <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{usernameStatus.message}</span>
                          </span>
                        ) : null}
                      </div>

                      <div className="relative">
                        <span className="absolute inset-y-0 left-3.5 flex items-center text-[var(--theme-primary)] text-sm font-black">
                          @
                        </span>
                        <input
                          ref={usernameInputRef}
                          id="profile-username-input"
                          type="text"
                          value={isAdmin ? 'resourcebox' : username.replace(/^@+/, '')}
                          disabled={isAdmin}
                          onChange={(e) =>
                            setUsername(
                              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)
                            )
                          }
                          placeholder="your_unique_handle"
                          className={`w-full pl-8 pr-4 py-2.5 text-sm border rounded-xl font-bold focus:outline-none ${
                            isAdmin
                              ? 'bg-amber-50/70 border-amber-300 text-amber-950 cursor-not-allowed'
                              : 'bg-[var(--theme-accent-light)]/35 focus:bg-white border-[var(--theme-accent)] text-[var(--theme-deep)] focus:ring-2 focus:ring-[var(--theme-primary)]'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-[var(--theme-text-muted)]">
                        {isAdmin
                          ? 'Reserved Official ResourceBox Admin handle (@resourcebox) with verified badge.'
                          : 'Other community members can search for your @username and follow you for instant updates whenever you upload new products.'}
                      </p>
                    </div>

                    {/* Photo Management Section */}
                    <div className="p-4 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
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

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {PRESET_AVATARS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(preset)}
                            className={`relative rounded-full overflow-hidden p-0.5 transition-all cursor-pointer ${
                              avatarUrl === preset
                                ? 'ring-2 ring-[var(--theme-primary)] scale-105 shadow-md'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset}
                              alt={`Preset ${idx + 1}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {avatarUrl === preset && (
                              <div className="absolute inset-0 bg-[var(--theme-deep)]/30 flex items-center justify-center rounded-full">
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
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Full Name, Email, Gender */}
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
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[var(--theme-primary)]" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          value={isAdmin ? ADMIN_EMAIL : email}
                          disabled={isAdmin}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="e.g. alex@example.com"
                          className={`w-full px-3.5 py-2.5 text-xs border rounded-xl font-semibold focus:outline-none ${
                            isAdmin
                              ? 'bg-amber-50/70 border-amber-300 text-amber-950 cursor-not-allowed'
                              : 'bg-white border-[var(--theme-accent-light)] text-[var(--theme-deep)] focus:border-[var(--theme-primary)]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => setEditSubTab('location')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[var(--theme-accent-light)]/50 hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] text-xs font-bold cursor-pointer transition-colors"
                        >
                          Edit Country, State & City →
                        </button>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider">
                          Bio (Displayed on Instagram Profile)
                        </label>
                        <span className="text-[10px] text-[var(--theme-text-muted)]">
                          {bio.length} chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share a short bio about the tools, cameras, or gear you rent and swap..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] leading-relaxed focus:outline-none focus:border-[var(--theme-primary)]"
                      />
                    </div>

                    <div className="flex justify-end pt-2 border-t border-[var(--theme-accent-light)]">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving Profile...' : saveSuccess ? 'Saved Successfully ✓' : 'Save & Update Profile'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* EDIT SUB-TAB B: Location */}
                {editSubTab === 'location' && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
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
                          Select your Country and State / Province, then enter your City and Pincode.
                        </p>
                      </div>
                    </div>

                    {isAdmin ? (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                        <div className="font-extrabold">Admin Location Protected</div>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                          The official ResourceBox Admin city and state details are kept private and are never disclosed on public profiles or listings.
                        </p>
                      </div>
                    ) : (
                      <>
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
                              placeholder="e.g. Mumbai, New York, London"
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                            />
                          </div>
                        </div>

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
                              placeholder="e.g. 400050"
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider mb-1.5">
                              Neighborhood / Area
                            </label>
                            <input
                              type="text"
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              placeholder="e.g. Bandra West, Soho"
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[var(--theme-accent-light)] rounded-xl text-[var(--theme-deep)] font-semibold focus:outline-none focus:border-[var(--theme-primary)]"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="p-3.5 rounded-2xl bg-white border border-[var(--theme-accent-light)] space-y-2.5">
                      <span className="text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider block">
                        Preferred Handover Options
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { label: 'Self Pickup', val: pickupSelf, set: setPickupSelf },
                          { label: 'Public Meetup', val: pickupMeetup, set: setPickupMeetup },
                          { label: 'Local Delivery', val: pickupDelivery, set: setPickupDelivery },
                        ].map((opt) => (
                          <label
                            key={opt.label}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                              opt.val
                                ? 'bg-[var(--theme-accent-light)] border-[var(--theme-primary)]'
                                : 'bg-white border-[var(--theme-accent-light)]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={opt.val}
                              onChange={(e) => opt.set(e.target.checked)}
                              className="w-4 h-4 text-[var(--theme-deep)] rounded"
                            />
                            <span className="text-xs font-semibold text-[var(--theme-deep)]">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-[var(--theme-accent-light)]">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Location & Profile'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* EDIT SUB-TAB C: Phone & Contact */}
                {editSubTab === 'verification' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[var(--theme-accent-light)] border border-[var(--theme-accent)] flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div className="text-xs text-[var(--theme-deep)] space-y-1">
                        <div className="font-bold flex items-center gap-2">
                          <span>Contact Number & Verification</span>
                          <span className="text-[10px] px-2 py-0.5 bg-[var(--theme-deep)] text-white rounded-full">
                            Database Synced
                          </span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-[var(--theme-text-muted)]">
                          Add your phone number to coordinate item handovers and receive rental requests.
                        </p>
                      </div>
                    </div>

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
                              {currentUser.phoneNumber || 'Required for verified peer handovers'}
                            </div>
                          </div>
                        </div>

                        {currentUser.phoneNumber ? (
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
                          className="px-5 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Repeat, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  MessageSquare,
  PackagePlus,
  ShoppingBag,
  RefreshCw,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';
import { saveUserProfile, getUserProfile, checkUserRegistrationInDatabase } from '../services/firebaseService';
import { AuthModal3DScene } from './AuthModal3DScene';

export type AuthActionReason = 'message' | 'buy' | 'exchange' | 'upload' | 'general' | null;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
  actionReason?: AuthActionReason;
  initialMode?: 'signin' | 'signup';
  currentUser?: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  actionReason = 'general',
  initialMode = 'signin',
  currentUser = null,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Database registered user state
  const [alreadyRegisteredUser, setAlreadyRegisteredUser] = useState<Partial<User> | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Unauthorized domain notice for Google Sign-In
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Synchronize modal mode with trigger (e.g. upload triggers sign up, message triggers sign in)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setUnauthorizedDomain(null);
      setCopiedDomain(false);
      setAlreadyRegisteredUser(null);
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  // Real-time Database Check: As user enters their email in Sign Up mode,
  // query both the local database and Firestore to detect if they are already registered!
  useEffect(() => {
    if (mode !== 'signup') {
      setAlreadyRegisteredUser(null);
      setIsCheckingEmail(false);
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAlreadyRegisteredUser(null);
      setIsCheckingEmail(false);
      return;
    }

    let isCurrent = true;
    setIsCheckingEmail(true);

    const timer = setTimeout(async () => {
      try {
        const result = await checkUserRegistrationInDatabase({ email: cleanEmail });
        if (!isCurrent) return;
        setIsCheckingEmail(false);
        if (result.registered) {
          // At that exact moment, show "Already registered" and move to sign in option
          setAlreadyRegisteredUser(result.user || { email: cleanEmail });
          setMode('signin');
          setErrorMessage(`Already registered: Your Gmail ID (${cleanEmail}) is already registered. Only new users can sign up — we have moved you to Sign In.`);
        } else {
          setAlreadyRegisteredUser(null);
        }
      } catch {
        if (isCurrent) {
          setIsCheckingEmail(false);
          setAlreadyRegisteredUser(null);
        }
      }
    }, 400);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [email, mode]);

  // Immediate check on blur of email input in Sign Up mode
  const handleEmailBlur = async () => {
    if (mode !== 'signup') return;
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) return;

    setIsCheckingEmail(true);
    try {
      const result = await checkUserRegistrationInDatabase({ email: cleanEmail });
      setIsCheckingEmail(false);
      if (result.registered) {
        setAlreadyRegisteredUser(result.user || { email: cleanEmail });
        setMode('signin');
        setErrorMessage(`Already registered: Your Gmail ID (${cleanEmail}) is already registered. Only new users can sign up — we have moved you to Sign In.`);
      }
    } catch {
      setIsCheckingEmail(false);
    }
  };

  const getReasonBanner = () => {
    switch (actionReason) {
      case 'message':
        return {
          icon: <MessageSquare className="w-4 h-4 text-[#3B1E54]" />,
          title: 'Authentication Required to Message',
          description: 'You can freely view all items without an account. Direct messaging and lender inquiries require authentication.',
        };
      case 'buy':
        return {
          icon: <ShoppingBag className="w-4 h-4 text-[#3B1E54]" />,
          title: 'Authentication Required to Rent & Pay',
          description: 'You can freely view item specs and rates. Renting, booking, and making payments require authentication.',
        };
      case 'exchange':
        return {
          icon: <RefreshCw className="w-4 h-4 text-[#3B1E54]" />,
          title: 'Authentication Required to Propose Swaps',
          description: 'You can freely explore community items. Proposing barter exchanges requires authentication.',
        };
      case 'upload':
        return {
          icon: <PackagePlus className="w-4 h-4 text-[#3B1E54]" />,
          title: 'Authentication Required to Upload',
          description: 'Viewing community items is open to everyone. Uploading and publishing your own equipment requires authentication.',
        };
      default:
        return null;
    }
  };

  const reasonBanner = getReasonBanner();

  const handleCopyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleFirebaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUnauthorizedDomain(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        // 1. Check database first to see if user is already registered
        try {
          const dbResult = await checkUserRegistrationInDatabase({ email: email.trim() });
          if (dbResult.registered) {
            setAlreadyRegisteredUser(dbResult.user || { email: email.trim() });
            setMode('signin');
            setErrorMessage(`Already registered: Your Gmail ID (${email.trim()}) is already registered in our database. Only new users can sign up. Please enter your password to sign in.`);
            setLoading(false);
            return;
          }
        } catch (dbErr) {
          console.warn('Database pre-check notice:', dbErr);
        }

        // 2. Also check Firebase Auth provider methods
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email.trim());
          if (methods && methods.length > 0) {
            setMode('signin');
            setAlreadyRegisteredUser({ email: email.trim() });
            setErrorMessage(`Already registered: Your Gmail ID (${email.trim()}) is already registered in our database. Only new users can sign up. Please enter your password to sign in.`);
            setLoading(false);
            return;
          }
        } catch {
          // If project has email enumeration protection, continue to createUserWithEmailAndPassword
        }

        let credential;
        try {
          credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        } catch (signUpErr: any) {
          if (signUpErr.code === 'auth/email-already-in-use') {
            setMode('signin');
            setAlreadyRegisteredUser({ email: email.trim() });
            setErrorMessage(`Already registered: Your Gmail ID (${email.trim()}) is already registered in our database. Only new users can sign up. Please enter your password to sign in.`);
            setLoading(false);
            return;
          }
          throw signUpErr;
        }

        await updateProfile(credential.user, {
          displayName: name.trim(),
        });

        const newUser: User = {
          id: credential.user.uid,
          name: name.trim(),
          email: credential.user.email || email.trim(),
          avatar: credential.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          rating: 5.0,
          reviewCount: 0,
          verified: true,
          phoneVerified: false,
          phoneNumber: '',
          location: 'Community Hub',
          neighborhood: 'Local District',
          memberSince: 'October 2026',
          bio: 'ResourceBox verified community member sharing resources and reducing waste.',
          savedItemIds: []
        };
        await saveUserProfile(newUser);
        onSelectUser(newUser);
        onClose();
      } else {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        // Load permanently saved user profile from Firestore if it exists
        const existingProfile = await getUserProfile(credential.user.uid);
        const signedInUser: User = existingProfile ? {
          ...existingProfile,
          id: credential.user.uid,
          email: credential.user.email || existingProfile.email || email.trim(),
          name: existingProfile.name || credential.user.displayName || credential.user.email?.split('@')[0] || 'Community Member',
          avatar: existingProfile.avatar || credential.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        } : {
          id: credential.user.uid,
          name: credential.user.displayName || credential.user.email?.split('@')[0] || 'Community Member',
          email: credential.user.email || email.trim(),
          avatar: credential.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          rating: 5.0,
          reviewCount: 0,
          verified: true,
          phoneVerified: false,
          phoneNumber: '',
          location: 'Community Hub',
          neighborhood: 'Local District',
          memberSince: 'October 2026',
          bio: 'ResourceBox verified member.',
          savedItemIds: []
        };
        if (!existingProfile) {
          await saveUserProfile(signedInUser);
        }
        onSelectUser(signedInUser);
        onClose();
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err);
      let userFriendlyMsg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/email-already-in-use') {
        userFriendlyMsg = 'User already exists with this email address. We have forwarded you to Sign In — please enter your password.';
        setMode('signin');
      } else if (err.code === 'auth/invalid-email') {
        userFriendlyMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        userFriendlyMsg = 'Incorrect email or password. Please verify and try again.';
      } else if (err.code === 'auth/weak-password') {
        userFriendlyMsg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        userFriendlyMsg = 'Email/Password sign-in is not enabled in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.';
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      setErrorMessage(userFriendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setUnauthorizedDomain(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupErr: any) {
        // If popup is blocked by mobile Safari or browser settings, attempt redirect flow
        if (popupErr?.code === 'auth/popup-blocked') {
          console.warn('Popup blocked by browser, attempting redirect flow');
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }

      const googleEmail = result.user.email || '';
      
      // Load existing profile or create a complete new profile
      const existingProfile = await getUserProfile(result.user.uid);

      const gUser: User = existingProfile ? {
        ...existingProfile,
        id: result.user.uid,
        name: existingProfile.name || result.user.displayName || 'Google Member',
        email: existingProfile.email || googleEmail,
        avatar: existingProfile.avatar || result.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      } : {
        id: result.user.uid,
        name: result.user.displayName || 'Google Member',
        email: googleEmail,
        avatar: result.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: 5.0,
        reviewCount: 0,
        verified: true,
        phoneVerified: false,
        phoneNumber: '',
        location: 'Community Hub',
        neighborhood: 'Local District',
        memberSince: 'October 2026',
        bio: 'ResourceBox verified member via Google.',
        savedItemIds: []
      };
      
      await saveUserProfile(gUser);
      onSelectUser(gUser);
      onClose();
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      const isUnauthorizedDomain = 
        err?.code === 'auth/unauthorized-domain' || 
        err?.message?.toLowerCase().includes('unauthorized-domain') ||
        err?.code?.toLowerCase().includes('unauthorized');

      if (isUnauthorizedDomain) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'Current app domain';
        setUnauthorizedDomain(host);
        setErrorMessage(`Domain "${host}" is not yet added to Firebase Authorized Domains. To use Google Sign-In, add "${host}" in Firebase Console (Authentication -> Settings -> Authorized domains), or use Email/Password sign-in below.`);
      } else if (err?.code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMessage('Google Sign-In is not enabled in Firebase Console. Please enable Google in Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setErrorMessage(err?.message || 'Google sign-in was unsuccessful. Please check credentials or sign in with email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const demoUser: User = {
        id: 'demo-verified-user-2026',
        name: 'Gaurav (Community Member)',
        email: 'pro.gaurav00@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: 5.0,
        reviewCount: 18,
        verified: true,
        phoneVerified: true,
        phoneNumber: '+91 98765 43210',
        location: 'Community Hub, Delhi',
        neighborhood: 'Central District',
        memberSince: 'October 2026',
        bio: 'ResourceBox verified member sharing tools and equipment.',
        savedItemIds: []
      };
      await saveUserProfile(demoUser);
      onSelectUser(demoUser);
      onClose();
    } catch (err: any) {
      setErrorMessage('Could not sign in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Dark Ambient Backdrop with Blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#040C08]/75 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* Dribbble Style 3D Split Window Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-[#3B1E54]/25 max-w-4xl w-full z-10 overflow-hidden my-auto flex flex-col md:flex-row min-h-[560px]"
      >
        {/* LEFT PANEL: 3D Animation Showcase (Dribbble 14505015 style) */}
        <div className="w-full md:w-[46%] shrink-0">
          <AuthModal3DScene mode={mode} />
        </div>

        {/* RIGHT PANEL: Sleek Modern Form */}
        <div className="w-full md:w-[54%] p-6 sm:p-8 flex flex-col justify-between bg-white relative">
          
          {/* Top Bar: Close Button only (clean Dribbble style) */}
          <div className="flex items-center justify-end pb-1">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-[#FAF8FC] text-[#697E72] hover:text-[#142D21] hover:bg-[#EAEFEA] transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Reason Callout Banner if user attempted a gated action */}
          {reasonBanner && (
            <div className="my-2 p-3 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] flex items-start gap-2.5">
              <div className="p-1.5 bg-white rounded-lg shadow-2xs shrink-0 mt-0.5">
                {reasonBanner.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#3B1E54] leading-snug">{reasonBanner.title}</h4>
                <p className="text-[11px] text-[#715F85] mt-0.5 leading-relaxed">{reasonBanner.description}</p>
              </div>
            </div>
          )}

          {/* Mode Switch Tabs (Sign In vs Sign Up) with fluid animated pill */}
          <div className="flex p-1 bg-[#F1F5F2] rounded-2xl my-2.5 text-xs font-semibold relative border border-[#E2EAE4]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`relative z-10 flex-1 py-2 rounded-xl transition-colors cursor-pointer font-bold ${
                mode === 'signin' ? 'text-[#142D21]' : 'text-[#697E72] hover:text-[#142D21]'
              }`}
            >
              {mode === 'signin' && (
                <motion.div
                  layoutId="activeAuthTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs"
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`relative z-10 flex-1 py-2 rounded-xl transition-colors cursor-pointer font-bold ${
                mode === 'signup' ? 'text-[#142D21]' : 'text-[#697E72] hover:text-[#142D21]'
              }`}
            >
              {mode === 'signup' && (
                <motion.div
                  layoutId="activeAuthTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs"
                />
              )}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>

          {/* Section Title */}
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#142D21] tracking-tight">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
          </div>

          {/* Error or Already Registered message */}
          {errorMessage && errorMessage.toLowerCase().includes('already registered') ? (
            <div className="my-2 p-3 rounded-2xl bg-[#D4BEE4]/40 border border-[#3B1E54]/40 text-[#3B1E54] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-[#3B1E54]">
                <CheckCircle2 className="w-4 h-4 text-[#3B1E54]" />
                <span>Already Registered</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#3B1E54]">{errorMessage}</p>
            </div>
          ) : errorMessage ? (
            <div className="my-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {/* Google 1-Click Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 mb-2 bg-white hover:bg-[#FAF8FC] border border-[#D4BEE4] hover:border-[#D4BEE4] text-[#3B1E54] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer group"
          >
            <svg className="w-4 h-4 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          {/* Unauthorized Domain Helper Notice right below Google button */}
          {unauthorizedDomain && (
            <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
              <div className="flex items-start gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Google Sign-In Domain Authorization Required</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Firebase blocked Google OAuth because this deployment domain has not been added to your project's authorized domains list yet.
              </p>
              <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-amber-200">
                <code className="text-[10px] text-[#3B1E54] font-mono flex-1 truncate select-all">
                  {unauthorizedDomain}
                </code>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2 py-1 rounded-lg bg-[#3B1E54] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedDomain ? <Check className="w-3 h-3 text-[#D4BEE4]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href="https://console.firebase.google.com/project/resourcebox2005/authentication/settings"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#3B1E54] hover:underline"
                >
                  <span>Open Firebase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="hidden sm:inline text-amber-400">·</span>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="text-[11px] font-bold text-[#2D6A4F] hover:underline text-left cursor-pointer"
                >
                  Or sign in instantly with 1-Click Demo
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex py-1.5 items-center">
            <div className="flex-grow border-t border-[#EEF2EF]" />
            <span className="flex-shrink mx-3 text-[10px] text-[#715F85] uppercase tracking-wider font-semibold">
              or
            </span>
            <div className="flex-grow border-t border-[#EEF2EF]" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleFirebaseSubmit} className="space-y-3 mt-1">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#715F85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full min-h-[48px] pl-10 pr-4 py-3 text-sm font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#715F85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="e.g. you@example.com"
                  className="w-full min-h-[48px] pl-10 pr-4 py-3 text-sm font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                />
              </div>

              {/* Live Database Check Indicator */}
              {mode === 'signup' && isCheckingEmail && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#715F85] mt-1 pl-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#3B1E54]" />
                  <span>Checking database for registered account...</span>
                </div>
              )}

              {/* Live "Already Registered" Banner detected from Database */}
              {mode === 'signup' && alreadyRegisteredUser && (
                <div className="mt-2 p-3 rounded-2xl bg-[#D4BEE4]/40 border border-[#3B1E54]/40 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3B1E54]">
                      <CheckCircle2 className="w-4 h-4 text-[#3B1E54]" />
                      <span>Already Registered</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#3B1E54] text-white px-2 py-0.5 rounded-full">
                      Database Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3B1E54] font-medium leading-relaxed">
                    This user is already authorized and registered in the database.
                    {alreadyRegisteredUser.name && (
                      <span className="block font-semibold text-[#3B1E54] mt-0.5">
                        Account owner: {alreadyRegisteredUser.name}
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="mt-2 w-full py-2 px-3 bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Switch to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                  Password {mode === 'signup' && <span className="text-[#715F85] normal-case font-normal">(min 6 chars)</span>}
                </label>
                {mode === 'signin' && (
                  <span className="text-xs text-[#3B1E54] hover:underline cursor-pointer font-medium">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#715F85] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[48px] pl-10 pr-10 py-3 text-sm font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#715F85] hover:text-[#3B1E54] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember me & agreement checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#D4BEE4] text-[#3B1E54] focus:ring-[#3B1E54] cursor-pointer accent-[#3B1E54]"
                  />
                  <span className="text-[11px] text-[#715F85] font-medium">
                    {mode === 'signin' ? 'Remember this device' : 'Agree to Community Guidelines'}
                  </span>
                </label>
                {mode === 'signup' && (
                  <span className="text-[10px] text-[#3B1E54] font-semibold">100% Free</span>
                )}
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#3B1E54] via-[#4D296D] to-[#3B1E54] hover:from-[#4D296D] hover:to-[#2A143D] disabled:opacity-70 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(59,30,84,0.35)] mt-3 flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_6px_20px_rgba(155,126,189,0.45)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* User Card (if user is currently signed in) */}
          {currentUser && (
            <div className="mt-3 p-3 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-2">
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#D4BEE4]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#3B1E54]/20"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-[#3B1E54] truncate">{currentUser.name}</h3>
                  <p className="text-[10px] text-[#715F85] truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-2.5 bg-[#3B1E54] hover:bg-[#2A143D] text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                >
                  Continue as {currentUser.name.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await auth.signOut();
                    onSelectUser(null as any);
                    setErrorMessage(null);
                  }}
                  className="py-1.5 px-2.5 border border-[#D4BEE4] hover:bg-[#FAF8FC] text-[#715F85] hover:text-[#3B1E54] rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Footer Quick Demo & Guest Links */}
          <div className="mt-3 pt-2 flex flex-col items-center gap-2 text-center border-t border-[#EEF2EF]">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-bold text-[#3B1E54] hover:text-[#9B7EBD] hover:underline cursor-pointer transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#D4BEE4]/30 hover:bg-[#D4BEE4]/50 border border-[#D4BEE4]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD]" />
              <span>1-Click Verified Demo Sign-In (Instant Access)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-[#715F85] hover:text-[#3B1E54] hover:underline cursor-pointer transition-colors"
            >
              Continue browsing items as guest
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

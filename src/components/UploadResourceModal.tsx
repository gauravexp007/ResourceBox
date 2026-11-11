import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  RefreshCw, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Trash2,
  Camera,
  Video,
  SwitchCamera,
  Plus,
  Tag,
  Clock,
  MapPin,
  Coins,
  CheckCircle2,
  Info,
  Wand2,
  Bot,
  HelpCircle,
  Lightbulb,
  CheckSquare,
  Square,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Item, Category, CategoryId, ItemCondition, ListingType, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { AuthActionReason } from './AuthModal';
import { getCurrencySymbol } from '../utils/currency';
import { getAiDescriptionSuggestion, AiDescriptionResult } from '../services/aiSuggestionService';
import { InteractiveDescriptionViewer } from './InteractiveDescriptionViewer';
import { CatInBoxErrorState } from './CatInBoxErrorState';

interface UploadResourceModalProps {
  currentUser: User | null;
  onClose: () => void;
  onAddListing: (newItem: Item) => void;
  onOpenAuth: (reason?: AuthActionReason, mode?: 'signin' | 'signup') => void;
  availableCategories?: Category[];
  itemToEdit?: Item | null;
  onUpdateListing?: (updatedItem: Item) => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  currentUser,
  onClose,
  onAddListing,
  onOpenAuth,
  availableCategories,
  itemToEdit,
  onUpdateListing,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState('');
  const [activeModalTab, setActiveModalTab] = useState<'edit' | 'preview'>('edit');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1);

  // Currency from user country
  const userCurrency = currentUser ? getCurrencySymbol(currentUser) : '₹';

  // Step 1: Details & Category
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [category, setCategory] = useState<CategoryId>((itemToEdit?.category as CategoryId) || 'tools');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [condition, setCondition] = useState<ItemCondition>(itemToEdit?.condition || 'Excellent');
  const [description, setDescription] = useState(itemToEdit?.description || '');

  // Step 2: Listing Type & SINGLE Flexible Pricing Field (Defaults to 0 and cannot be empty)
  const [listingType, setListingType] = useState<ListingType>(itemToEdit?.listingType || 'both');
  const [priceAmount, setPriceAmount] = useState<number | ''>(
    itemToEdit ? (itemToEdit.priceAmount ?? itemToEdit.priceDaily ?? 0) : 0
  );
  const [durationPreset, setDurationPreset] = useState<string>(itemToEdit?.priceDuration || 'per day');
  const [customDuration, setCustomDuration] = useState<string>('');
  const [exchangeWishlist, setExchangeWishlist] = useState<string>(
    itemToEdit?.preferredExchangeItems ? itemToEdit.preferredExchangeItems.join(', ') : ''
  );
  const [exchangeNotes, setExchangeNotes] = useState<string>(itemToEdit?.exchangeNotes || '');

  // Computed rate text
  const finalDuration = durationPreset === 'custom' 
    ? (customDuration.trim() || 'custom duration') 
    : durationPreset;
  const rateTextPreview = `${userCurrency}${priceAmount === '' ? 0 : priceAmount} / ${finalDuration.replace(/^per\s+/i, '')}`;

  // Step 3: Availability Clock & Location & Photos
  const [availabilityPreset, setAvailabilityPreset] = useState<string>(itemToEdit?.availableTimeWindow || '09:00 AM - 08:00 PM');
  const [clockStartHour, setClockStartHour] = useState<string>('09:00 AM');
  const [clockEndHour, setClockEndHour] = useState<string>('08:00 PM');
  const [isCustomClock, setIsCustomClock] = useState<boolean>(false);

  // Location - Empty by default with placeholder examples
  const [city, setCity] = useState<string>(itemToEdit?.location?.city || '');
  const [neighborhood, setNeighborhood] = useState<string>(itemToEdit?.location?.neighborhood || '');
  const [pickupSelf, setPickupSelf] = useState(true);
  const [pickupMeetup, setPickupMeetup] = useState(true);
  const [pickupDelivery, setPickupDelivery] = useState(false);

  // Photos & Live Camera State
  const [photos, setPhotos] = useState<string[]>(itemToEdit?.images || []);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  // AI Short Description Generator State
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [aiDescResult, setAiDescResult] = useState<AiDescriptionResult | null>(null);
  const [aiDescError, setAiDescError] = useState('');

  // Sync state if itemToEdit changes
  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title || '');
      setCategory((itemToEdit.category as CategoryId) || 'tools');
      setCondition(itemToEdit.condition || 'Excellent');
      setDescription(itemToEdit.description || '');
      setListingType(itemToEdit.listingType || 'both');
      setPriceAmount(itemToEdit.priceAmount ?? itemToEdit.priceDaily ?? 0);
      setDurationPreset(itemToEdit.priceDuration || 'per day');
      setPhotos(itemToEdit.images || []);
      setExchangeWishlist(itemToEdit.preferredExchangeItems ? itemToEdit.preferredExchangeItems.join(', ') : '');
      setExchangeNotes(itemToEdit.exchangeNotes || '');
      setNeighborhood(itemToEdit.location?.neighborhood || '');
      setCity(itemToEdit.location?.city || '');
    } else {
      setTitle('');
      setCategory('tools');
      setIsCustomCategory(false);
      setCustomCategoryName('');
      setCondition('Excellent');
      setDescription('');
      setListingType('both');
      setPriceAmount(0);
      setDurationPreset('per day');
      setCustomDuration('');
      setExchangeWishlist('');
      setExchangeNotes('');
      setCity('');
      setNeighborhood('');
      setPhotos([]);
    }
  }, [itemToEdit]);

  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      setError('Please enter the Item Title / Name first before generating description.');
      return;
    }
    setError('');
    setIsGeneratingDesc(true);
    setAiDescError('');
    try {
      const catName = isCustomCategory && customCategoryName.trim() ? customCategoryName.trim() : category;
      const result = await getAiDescriptionSuggestion(title.trim(), catName, condition);
      setAiDescResult(result);
      if (!description.trim()) {
        setDescription(result.fullDraft);
      }
    } catch (err: any) {
      setAiDescError('Could not generate AI description. You can type it manually.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  // Active photo: first photo uploaded/captured or category placeholder
  const defaultCategorySvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%233B1E54"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%23ffffff">${encodeURIComponent(title || 'Community Resource')}</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23D4BEE4">ResourceBox Verified Item</text></svg>`;
  const activePhoto = photos[0] || defaultCategorySvg;

  // Live draft representation for interactive preview
  const draftPickupOptions: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[] = [];
  if (pickupSelf) draftPickupOptions.push('Self Pickup');
  if (pickupMeetup) draftPickupOptions.push('Public Meetup');
  if (pickupDelivery) draftPickupOptions.push('Local Delivery');
  if (draftPickupOptions.length === 0) draftPickupOptions.push('Self Pickup');

  const draftWishlistArray = exchangeWishlist
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const draftItem: Item = {
    id: itemToEdit?.id || 'live_preview_draft',
    title: title.trim() || 'Untitled Community Resource',
    description: description.trim() || 'No description provided yet. Add details about your item features and condition in the edit tab.',
    category: isCustomCategory && customCategoryName.trim() ? customCategoryName.trim() : category,
    condition,
    listingType,
    priceDaily: Number(priceAmount) || 500,
    priceRateText: rateTextPreview,
    priceAmount: Number(priceAmount) || 500,
    priceDuration: finalDuration,
    currencySymbol: userCurrency,
    availableTimeWindow: isCustomClock ? `${clockStartHour} - ${clockEndHour}` : availabilityPreset,
    depositAmount: Math.round(Number(priceAmount) * 1.5) || 100,
    minRentalDays: 1,
    preferredExchangeItems: draftWishlistArray.length > 0 ? draftWishlistArray : undefined,
    exchangeNotes: exchangeNotes.trim() || undefined,
    images: photos.length > 0 ? photos : [defaultCategorySvg],
    location: {
      city: city.trim() || currentUser?.city || 'Local Community',
      neighborhood: neighborhood.trim() || currentUser?.neighborhood || 'Central District',
      distanceMiles: 0.8,
      pickupOptions: draftPickupOptions,
    },
    owner: {
      id: currentUser?.id || 'current_user',
      name: currentUser?.name || 'Resource Owner',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: currentUser?.rating || 5.0,
      reviewCount: currentUser?.reviewCount || 1,
      verified: currentUser?.verified ?? true,
      memberSince: currentUser?.memberSince || '2026',
      responseRate: '100%',
      responseTime: '< 15 mins',
      neighborhood: neighborhood.trim() || 'Neighborhood',
    },
    isAvailable: true,
    availableFrom: 'Today',
    availableTo: 'Ongoing',
    rules: ['Handle with care', 'Return in clean condition', 'Report any issues promptly'],
    featured: true,
    createdAt: new Date().toISOString(),
    viewsCount: 1,
    savedCount: 0,
  };

  // Stop live camera stream cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsRequestingPermission(false);
    setCameraError('');
  };

  // Clean up camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start live camera with explicit permission request handling
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError('');
    setIsRequestingPermission(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support live video stream. You can capture photos directly with your device camera below.');
      }

      // Request user camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraPermissionGranted(true);
      setIsRequestingPermission(false);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Video play notice:', e));
        };
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setIsRequestingPermission(false);
      setIsCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or tap "Open Device Camera App" below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your device.');
      } else {
        setCameraError(err.message || 'Could not start live camera. You can capture photos with your device camera directly.');
      }
    }
  };

  // Toggle between front and back camera
  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from live video stream and compress
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsCapturing(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        // Scale to max 640px for optimal clarity & fast Firestore storage
        const maxDim = 640;
        let targetW = width;
        let targetH = height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            targetW = maxDim;
            targetH = Math.round((height * maxDim) / width);
          } else {
            targetH = maxDim;
            targetW = Math.round((width * maxDim) / height);
          }
        }

        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.60);
          setPhotos((prev) => (prev.length < 5 ? [...prev, compressedDataUrl] : prev));
        }
      } catch (err) {
        console.error('Error capturing photo:', err);
      } finally {
        setIsCapturing(false);
      }
    }, 150);
  };

  // File upload from device (or native mobile camera trigger)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 640;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.60);
              setPhotos((prev) => (prev.length < 5 ? [...prev, compressed] : prev));
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Validation
  const validateStep = (currentStep: number) => {
    setError('');
    if (currentStep === 1) {
      if (!title.trim()) {
        setError('Please enter a descriptive resource title');
        return false;
      }
      if (isCustomCategory && !customCategoryName.trim()) {
        setError('Please type your custom category name');
        return false;
      }
      if (!description.trim() || description.trim().length < 10) {
        setError('Please provide at least 10 characters describing the item condition & features');
        return false;
      }
    }
    if (currentStep === 2) {
      if (listingType === 'rent' || listingType === 'both') {
        if (priceAmount === '' || priceAmount === null || isNaN(Number(priceAmount)) || Number(priceAmount) < 0) {
          setError('Price cannot be empty. Please specify a price (enter 0 or any amount).');
          return false;
        }
        if (durationPreset === 'custom' && !customDuration.trim()) {
          setError('Please specify the duration timeframe (e.g. "for 3 days" or "per project")');
          return false;
        }
      }
      if (listingType === 'exchange' || listingType === 'both') {
        if (!exchangeWishlist.trim()) {
          setError('Please specify at least one item you would accept in exchange (e.g. drill, camera, tent)');
          return false;
        }
      }
    }
    if (currentStep === 3) {
      if (photos.length === 0) {
        setError('Please upload a photo from your device or capture a live photo with camera.');
        return false;
      }
      if (!city.trim()) {
        setError('Please enter your city (e.g. Mumbai, New Delhi, Bengaluru)');
        return false;
      }
      if (!neighborhood.trim()) {
        setError('Please enter your neighborhood or district (e.g. Bandra West, Downtown)');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (Math.min(prev + 1, 4) as any));
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => (Math.max(prev - 1, 1) as any));
  };

  const handlePublish = () => {
    if (!currentUser) return;
    const pickupOptions: ('Self Pickup' | 'Public Meetup' | 'Local Delivery')[] = [];
    if (pickupSelf) pickupOptions.push('Self Pickup');
    if (pickupMeetup) pickupOptions.push('Public Meetup');
    if (pickupDelivery) pickupOptions.push('Local Delivery');
    if (pickupOptions.length === 0) pickupOptions.push('Self Pickup');

    const wishlistArray = exchangeWishlist
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalCategory: CategoryId = isCustomCategory && customCategoryName.trim()
      ? customCategoryName.trim()
      : category;

    // Availability time duration string
    const finalAvailabilityWindow = isCustomClock
      ? `${clockStartHour} - ${clockEndHour}`
      : availabilityPreset;

    const numericPrice = priceAmount === '' ? 0 : Number(priceAmount);

    if (itemToEdit && onUpdateListing) {
      const updatedItem: Item = {
        ...itemToEdit,
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        condition,
        listingType,
        priceDaily: numericPrice,
        priceRateText: rateTextPreview,
        priceAmount: numericPrice,
        priceDuration: finalDuration,
        currencySymbol: userCurrency,
        availableTimeWindow: finalAvailabilityWindow,
        depositAmount: Math.round(numericPrice * 1.5),
        preferredExchangeItems: wishlistArray.length > 0 ? wishlistArray : undefined,
        exchangeNotes: exchangeNotes.trim() || undefined,
        images: photos.length > 0 ? photos : itemToEdit.images,
        location: {
          ...itemToEdit.location,
          city: city.trim() || itemToEdit.location.city,
          neighborhood: neighborhood.trim() || itemToEdit.location.neighborhood,
          pickupOptions,
        },
      };
      onUpdateListing(updatedItem);
      onClose();
      return;
    }

    const newItem: Item = {
      id: `item_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      condition,
      listingType,
      
      // Flexible single price configuration (0 is valid)
      priceDaily: numericPrice,
      priceRateText: rateTextPreview,
      priceAmount: numericPrice,
      priceDuration: finalDuration,
      currencySymbol: userCurrency,
      availableTimeWindow: finalAvailabilityWindow,

      depositAmount: Math.round(numericPrice * 1.5),
      minRentalDays: 1,
      preferredExchangeItems: wishlistArray.length > 0 ? wishlistArray : undefined,
      exchangeNotes: exchangeNotes.trim() || undefined,
      images: photos.length > 0 ? photos : [defaultCategorySvg],
      location: {
        city: city.trim() || currentUser.location || 'Local Community',
        neighborhood: neighborhood.trim() || 'Central District',
        distanceMiles: 0.8,
        pickupOptions,
      },
      owner: {
        id: currentUser.id,
        name: currentUser.name || 'Community Member',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: currentUser.rating || 5.0,
        reviewCount: currentUser.reviewCount || 1,
        verified: currentUser.verified ?? true,
        memberSince: currentUser.memberSince || '2026',
        responseRate: '100%',
        responseTime: '< 15 mins',
        neighborhood: neighborhood.trim() || 'Neighborhood',
      },
      isAvailable: true,
      availableFrom: 'Today',
      availableTo: 'Ongoing',
      rules: ['Handle with care', 'Return in clean condition', 'Report any issues promptly'],
      featured: true,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      savedCount: 0,
    };

    onAddListing(newItem);
    onClose();
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full z-10 text-center space-y-4 shadow-2xl border border-[#D4BEE4]">
          <div className="w-14 h-14 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center shadow-xs">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3B1E54]">Sign In to List Resources</h3>
            <p className="text-xs text-[#715F85] mt-1.5 leading-relaxed">
              Users cannot upload items before creating an account. Sign in with Google to start earning and sharing items with neighbors.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth('upload', 'signin');
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-[11px] text-[#715F85] hover:underline block mx-auto pt-1 cursor-pointer"
          >
            Cancel and continue browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
        onClick={onClose} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="relative bg-white rounded-3xl max-w-2xl w-full z-10 shadow-2xl border border-[#D4BEE4] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF8FC] via-white to-[#FAF8FC] border-b border-[#D4BEE4] flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD]" />
              <span>{itemToEdit ? 'Resource Listing Editor' : `Step ${step} of 4 · Publisher`}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#3B1E54] font-sans mt-0.5">
              {itemToEdit ? `Edit: ${itemToEdit.title}` : (
                <>
                  {step === 1 && 'Item Basics & Category'}
                  {step === 2 && 'Listing Type & Custom Pricing'}
                  {step === 3 && 'Availability Clock, Photos & Location'}
                  {step === 4 && 'Review & Publish to Community'}
                </>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive View Toggle between Edit Form and Live Preview */}
            <div className="flex p-1 bg-[#D4BEE4]/40 rounded-xl border border-[#D4BEE4] text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveModalTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModalTab === 'edit'
                    ? 'bg-white text-[#3B1E54] shadow-xs'
                    : 'text-[#715F85] hover:text-[#3B1E54]'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'preview'
                    ? 'bg-white text-[#3B1E54] shadow-xs'
                    : 'text-[#715F85] hover:text-[#3B1E54]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#3B1E54]" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#D4BEE4] hover:bg-[#FAF8FC] text-[#715F85] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Pills (Shown during edit mode) */}
        {activeModalTab === 'edit' && (
          <div className="grid grid-cols-4 px-6 pt-3 gap-2 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step >= i ? 'bg-[#3B1E54]' : 'bg-[#D4BEE4]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Form Body Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
          {error && (
            <CatInBoxErrorState
              type="upload"
              message={error}
              onClose={() => setError('')}
              actionText="Got It, Try Again"
              onRetry={() => setError('')}
              className="my-2 shadow-xs"
            />
          )}

          {/* Modal Tab Conditional: Edit Form vs Live Interactive Preview */}
          {activeModalTab === 'edit' ? (
            <>
              {/* STEP 1: Basics & Category */}
              {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                  Item Title / Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DeWalt 20V Cordless Hammer Drill Kit, Sony Alpha A7 III, or Coleman 4-Person Tent"
                  className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                />
              </div>

              {/* Category Selection with Custom Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[11px] font-bold text-[#3B1E54] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{isCustomCategory ? 'Use standard list' : '+ Type custom category'}</span>
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="e.g. Drone, VR Headset, Woodworking, Camping Gear..."
                        className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                      />
                      <span className="text-[10px] text-[#3B1E54] font-medium block pl-1">
                        Custom category will be created and displayed with item counts
                      </span>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 cursor-pointer"
                    >
                      {(availableCategories || CATEGORIES).map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                    Item Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 cursor-pointer"
                  >
                    <option value="Like New">Like New (Mint condition, flawless)</option>
                    <option value="Excellent">Excellent (Minor signs of use)</option>
                    <option value="Good">Good (Fully functional, normal wear)</option>
                    <option value="Fair">Fair (Working condition, noticeable cosmetic wear)</option>
                  </select>
                </div>
              </div>

              {/* Description Field with AI Auto-Suggestion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                    Detailed Description *
                  </label>

                  {/* AI Auto-Suggest Description Button */}
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingDesc || !title.trim()}
                    className="px-2.5 py-1 rounded-lg bg-[#D4BEE4]/40 hover:bg-[#D8EADB] text-[#3B1E54] text-[11px] font-bold border border-[#D4BEE4] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                    title={title.trim() ? "Suggest AI short description tailored to this item name and category" : "Enter item title first"}
                  >
                    {isGeneratingDesc ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD] animate-spin" />
                        <span>AI Drafting Description...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD]" />
                        <span>✨ AI Auto-Suggest Description</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Error Notification */}
                {aiDescError && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{aiDescError}</span>
                  </div>
                )}

                {/* AI Generated Description Suggestion Card */}
                {aiDescResult && (
                  <div className="p-3.5 bg-gradient-to-r from-[#FAF8FC] via-white to-[#FAF8FC] border border-[#D4BEE4] rounded-2xl space-y-2.5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#9B7EBD] animate-pulse" />
                        <span className="text-[10px] font-extrabold text-[#3B1E54] uppercase tracking-wider">
                          AI Suggested Short Description
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAiDescResult(null)}
                        className="text-[10px] text-[#715F85] hover:text-[#3B1E54] cursor-pointer"
                      >
                        ✕ Dismiss
                      </button>
                    </div>

                    <p className="text-xs text-[#3B1E54] leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-[#D4BEE4]">
                      {aiDescResult.shortDescription}
                    </p>

                    {aiDescResult.highlights && aiDescResult.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {aiDescResult.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#3B1E54] font-semibold border border-[#D4BEE4]"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDescription(aiDescResult.shortDescription)}
                        className="py-1 px-3 bg-[#3B1E54] hover:bg-[#2A143D] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Use Short Description
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescription(aiDescResult.fullDraft)}
                        className="py-1 px-3 bg-white border border-[#3B1E54] text-[#3B1E54] hover:bg-[#D4BEE4]/40 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Use with Highlights
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Professional-grade 20V drill with 2 lithium-ion batteries, fast charger, and heavy-duty case. High-speed transmission with 2-speed settings. Perfect for home renovations, cabinetry, and woodworking projects..."
                  className="w-full p-4 sm:p-5 text-sm sm:text-base font-medium bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 resize-y"
                />
                
                <div className="flex items-center justify-between text-[10px] text-[#715F85]">
                  <span>{description.length} characters (minimum 10 required)</span>
                  {title.trim() && !description.trim() && (
                    <span className="text-[#3B1E54] font-semibold cursor-pointer hover:underline" onClick={handleGenerateAiDescription}>
                      💡 Click "AI Auto-Suggest Description" above to generate with 1 click
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Listing Type & SINGLE CONSOLIDATED PRICING FIELD */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                  How would you like to share this resource?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'both', label: 'Rent & Exchange', desc: 'Accept both cash rental or equipment swap' },
                    { id: 'rent', label: 'Rental Only', desc: 'Set your price and duration' },
                    { id: 'exchange', label: 'Exchange (Swap) Only', desc: 'Barter for items on your wishlist' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setListingType(opt.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        listingType === opt.id
                          ? 'border-[#3B1E54] bg-[#D4BEE4]/40 ring-1 ring-[#3B1E54]'
                          : 'border-[#D4BEE4] bg-white hover:border-[#D4BEE4]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#3B1E54]">{opt.label}</div>
                      <div className="text-[11px] text-[#715F85] mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SINGLE CONSOLIDATED PRICING FIELD */}
              {(listingType === 'rent' || listingType === 'both') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#3B1E54] flex items-center gap-1.5 uppercase tracking-wider">
                      <Coins className="w-3.5 h-3.5 text-[#3B1E54]" />
                      <span>Custom Price & Duration</span>
                    </h4>
                    <span className="text-[11px] text-[#3B1E54] font-bold bg-[#D4BEE4]/40 px-2.5 py-0.5 rounded-full">
                      Currency: {userCurrency}
                    </span>
                  </div>

                  <p className="text-xs text-[#715F85] -mt-2">
                    Specify your price and for how long in this single flexible field (e.g. per day, per hour, per week, per month, or custom).
                  </p>

                  {/* Unified Price + Duration Field */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Price Amount with Currency Symbol */}
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-4 flex items-center text-base sm:text-lg font-black text-[#3B1E54] pointer-events-none">
                          {userCurrency}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={priceAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setPriceAmount('');
                            } else {
                              const num = Number(val);
                              if (!isNaN(num) && num >= 0) {
                                setPriceAmount(num);
                              }
                            }
                          }}
                          onBlur={() => {
                            if (priceAmount === '') {
                              setPriceAmount(0);
                            }
                          }}
                          placeholder="0"
                          className="w-full min-h-[52px] pl-11 pr-5 py-3.5 text-base sm:text-lg font-extrabold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                        />
                      </div>

                      {/* Duration Unit Selector */}
                      <div className="w-full sm:w-56">
                        <select
                          value={durationPreset}
                          onChange={(e) => setDurationPreset(e.target.value)}
                          className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-bold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 cursor-pointer"
                        >
                          <option value="per day">per day (default)</option>
                          <option value="per hour">per hour</option>
                          <option value="per week">per week</option>
                          <option value="per month">per month</option>
                          <option value="custom">custom timeframe...</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom Duration Text Box if custom selected */}
                    {durationPreset === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-1"
                      >
                        <input
                          type="text"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          placeholder="e.g. for 3 days, for whole weekend, per project, or per event"
                          className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                        />
                      </motion.div>
                    )}

                    {/* Live Preview Display */}
                    <div className="p-3.5 rounded-xl bg-[#D4BEE4]/40 border border-[#D4BEE4] flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#3B1E54] font-semibold">Your listing rate will appear as:</span>
                      <span className="font-extrabold text-base sm:text-lg text-[#3B1E54] font-sans">
                        {rateTextPreview}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Exchange Wishlist inputs */}
              {(listingType === 'exchange' || listingType === 'both') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#D4BEE4]/40 border border-[#D4BEE4] space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Exchange Wishlist (What do you want in return?)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                      Items You'd Love to Swap For *
                    </label>
                    <input
                      type="text"
                      value={exchangeWishlist}
                      onChange={(e) => setExchangeWishlist(e.target.value)}
                      placeholder="e.g. Rotary hammer drill, angle grinder, camping cookware, or road bike"
                      className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                      Exchange Preferences / Notes
                    </label>
                    <input
                      type="text"
                      value={exchangeNotes}
                      onChange={(e) => setExchangeNotes(e.target.value)}
                      placeholder="e.g. Open to weekend tool swaps, camping trials, or equivalent value exchanges"
                      className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Photos (Live Camera & File Upload), AVAILABILITY CLOCK & Location */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* 1. Item Photos (Live Camera + Device Upload) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                    Item Photos * <span className="text-[11px] font-normal text-[#715F85]">({photos.length}/5 uploaded)</span>
                  </label>
                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Close Camera
                    </button>
                  )}
                </div>

                {/* Requesting Permission Notice */}
                {isRequestingPermission && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2 animate-pulse">
                    <Camera className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Requesting camera permission... Please tap <strong>Allow</strong> on your browser or device prompt.</span>
                  </div>
                )}

                {/* Camera Error Alert */}
                {cameraError && (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p>{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => nativeCameraInputRef.current?.click()}
                        className="font-bold text-[#3B1E54] underline cursor-pointer"
                      >
                        Tap here to open your native device camera app directly
                      </button>
                    </div>
                  </div>
                )}

                {/* Hidden native camera capture input for 100% mobile compatibility */}
                <input
                  type="file"
                  ref={nativeCameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* LIVE CAMERA VIEWFINDER */}
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#3B1E54] shadow-lg mb-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder Target Framing Overlay */}
                    <div className="absolute inset-6 border border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-[#D4BEE4] absolute top-2 left-2" />
                      <div className="w-8 h-8 border-t-2 border-r-2 border-[#D4BEE4] absolute top-2 right-2" />
                      <div className="w-8 h-8 border-b-2 border-l-2 border-[#D4BEE4] absolute bottom-2 left-2" />
                      <div className="w-8 h-8 border-b-2 border-r-2 border-[#D4BEE4] absolute bottom-2 right-2" />
                    </div>

                    {/* Camera Control Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl">
                      <button
                        type="button"
                        onClick={switchCamera}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Switch Camera (Front/Rear)"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>

                      {/* Shutter Button */}
                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={isCapturing || photos.length >= 5}
                        className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center bg-[#3B1E54] hover:bg-[#2A143D] active:scale-90 transition-transform shadow-lg cursor-pointer"
                        title="Snap Photo"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <Camera className="w-5 h-5 text-[#3B1E54]" />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer text-xs font-semibold"
                      >
                        Done
                      </button>
                    </div>

                    {/* Flash effect on snap */}
                    {isCapturing && (
                      <div className="absolute inset-0 bg-white animate-ping pointer-events-none" />
                    )}
                  </div>
                ) : (
                  /* DUAL ACTION BUTTONS: Live Camera or Device Upload */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* Live Camera Button */}
                    <button
                      type="button"
                      onClick={() => startCamera('environment')}
                      disabled={photos.length >= 5}
                      className="p-4 rounded-2xl border-2 border-dashed border-[#3B1E54]/40 hover:border-[#3B1E54] bg-[#FAF8FC] hover:bg-[#D4BEE4]/40 text-left transition-all group cursor-pointer disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#3B1E54] text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#3B1E54] block">
                        Capture Live Photo
                      </span>
                      <span className="text-[11px] text-[#715F85] mt-0.5 block">
                        Tap to open live device camera & snap photos
                      </span>
                    </button>

                    {/* Device Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        id="resource-photo-input"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={photos.length >= 5}
                        className="hidden"
                      />
                      <label
                        htmlFor="resource-photo-input"
                        className={`p-4 rounded-2xl border-2 border-dashed border-[#D4BEE4] hover:border-[#3B1E54] bg-[#FAF8FC] hover:bg-white text-left transition-all group block cursor-pointer h-full ${
                          photos.length >= 5 ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#3B1E54] block">
                          Upload from Gallery
                        </span>
                        <span className="text-[11px] text-[#715F85] mt-0.5 block">
                          Choose photos from device files or album
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Uploaded Photos Thumbnails */}
                {photos.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#3B1E54] block uppercase tracking-wider">
                      Selected Photos ({photos.length}/5) · <span className="text-[#715F85] lowercase font-normal">tap image to preview</span>
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden aspect-square border border-[#D4BEE4] shadow-xs bg-[#FAF8FC] cursor-pointer"
                          onClick={() => {
                            setPreviewImage(photo);
                            setPreviewZoom(1);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                          </div>
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#3B1E54] text-white tracking-wider shadow-xs">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(idx);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-90 group-hover:opacity-100 hover:bg-red-700 transition-opacity cursor-pointer shadow-xs z-10"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {photos.length < 5 && !isCameraActive && (
                        <button
                          type="button"
                          onClick={() => startCamera('environment')}
                          className="rounded-xl border-2 border-dashed border-[#D4BEE4] hover:border-[#3B1E54] bg-[#FAF8FC] flex flex-col items-center justify-center aspect-square text-[#3B1E54] hover:bg-[#D4BEE4]/40 transition-all cursor-pointer p-2 text-center"
                        >
                          <Plus className="w-4 h-4 mb-0.5" />
                          <span className="text-[10px] font-bold leading-tight">Add More</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. AVAILABILITY CLOCK & TIME DURATION PICKER */}
              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3B1E54] flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#3B1E54]" />
                    <span>Availability Duration Clock</span>
                  </h4>
                  <span className="text-[11px] font-bold text-[#3B1E54] bg-white px-2.5 py-0.5 rounded-full border border-[#D4BEE4]">
                    {isCustomClock ? `${clockStartHour} - ${clockEndHour}` : availabilityPreset}
                  </span>
                </div>

                <p className="text-xs text-[#715F85]">
                  Select the daily hours when you are available for handing over or returning the equipment.
                </p>

                {/* Clock Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '24 Hours (All Day)', value: '24 Hours (All Day)' },
                    { label: '09:00 AM - 08:00 PM', value: '09:00 AM - 08:00 PM' },
                    { label: '06:00 AM - 01:00 PM', value: '06:00 AM - 01:00 PM (Morning)' },
                    { label: '04:00 PM - 10:00 PM', value: '04:00 PM - 10:00 PM (Evening)' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setAvailabilityPreset(p.value);
                        setIsCustomClock(false);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        !isCustomClock && availabilityPreset === p.value
                          ? 'border-[#3B1E54] bg-[#3B1E54] text-white font-bold shadow-xs'
                          : 'border-[#D4BEE4] bg-white text-[#3B1E54] hover:border-[#D4BEE4] text-xs font-medium'
                      }`}
                    >
                      <span className="text-xs block">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Interactive Custom Clock Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomClock(!isCustomClock)}
                    className="text-xs font-bold text-[#3B1E54] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="w-3 h-3" />
                    <span>{isCustomClock ? 'Use preset hours' : '+ Select custom clock hours'}</span>
                  </button>

                  {isCustomClock && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div>
                        <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                          Available From (Start Time)
                        </label>
                        <select
                          value={clockStartHour}
                          onChange={(e) => setClockStartHour(e.target.value)}
                          className="w-full min-h-[50px] px-4 py-3 text-sm font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 cursor-pointer"
                        >
                          {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                          Available Until (End Time)
                        </label>
                        <select
                          value={clockEndHour}
                          onChange={(e) => setClockEndHour(e.target.value)}
                          className="w-full min-h-[50px] px-4 py-3 text-sm font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200 cursor-pointer"
                        >
                          {['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '11:59 PM'].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* 3. Location & Handover */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-[#3B1E54] flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-[#3B1E54]" />
                  <span>Item Location & Handover</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, New Delhi, Bengaluru, or New York"
                      className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                      Neighborhood / District *
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="e.g. Bandra West, Indiranagar, Connaught Place, or Downtown"
                      className="w-full min-h-[52px] px-5 py-3.5 text-sm sm:text-base font-semibold bg-[#D4BEE4]/25 hover:bg-[#D4BEE4]/40 focus:bg-white rounded-xl border-0 outline-none ring-0 text-[#3B1E54] placeholder:text-[#715F85] placeholder:font-normal focus:shadow-[0_0_0_2px_#3B1E54,0_0_22px_rgba(155,126,189,0.45)] transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-[#715F85] mb-1.5">
                    Accepted Handover Methods
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#3B1E54]">
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-[#D4BEE4] bg-[#FAF8FC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pickupSelf}
                        onChange={(e) => setPickupSelf(e.target.checked)}
                        className="accent-[#3B1E54]"
                      />
                      <span>Self-Pickup</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl border border-[#D4BEE4] bg-[#FAF8FC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pickupMeetup}
                        onChange={(e) => setPickupMeetup(e.target.checked)}
                        className="accent-[#3B1E54]"
                      />
                      <span>Public Meetup</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl border border-[#D4BEE4] bg-[#FAF8FC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pickupDelivery}
                        onChange={(e) => setPickupDelivery(e.target.checked)}
                        className="accent-[#3B1E54]"
                      />
                      <span>Local Delivery</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4] space-y-3">
                <div className="flex gap-4 items-start">
                  <img
                    src={activePhoto}
                    alt="Review"
                    className="w-20 h-20 rounded-xl object-cover border border-[#D4BEE4] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#3B1E54] bg-[#D4BEE4]/40 px-2 py-0.5 rounded-md">
                      {isCustomCategory ? customCategoryName : category} · {condition}
                    </span>
                    <h3 className="text-sm font-bold text-[#3B1E54] mt-1">{title}</h3>
                    <p className="text-xs text-[#715F85] line-clamp-2 mt-0.5">{description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EEF2EF] text-xs">
                  <div>
                    <span className="text-[#715F85] block text-[10px]">Listing Type</span>
                    <span className="font-bold text-[#3B1E54] capitalize">{listingType}</span>
                  </div>
                  <div>
                    <span className="text-[#715F85] block text-[10px]">Specified Price</span>
                    <span className="font-bold text-[#3B1E54]">{rateTextPreview}</span>
                  </div>
                  <div>
                    <span className="text-[#715F85] block text-[10px]">Availability Clock</span>
                    <span className="font-bold text-[#3B1E54]">
                      {isCustomClock ? `${clockStartHour} - ${clockEndHour}` : availabilityPreset}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#715F85] block text-[10px]">Location</span>
                    <span className="font-bold text-[#3B1E54]">{neighborhood}, {city}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8FC] rounded-2xl border border-[#D4BEE4] text-xs text-[#3B1E54] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#3B1E54] shrink-0" />
                <span>
                  By publishing, you agree to respond to member inquiries, fulfill accepted reservations, and keep equipment safe.
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* LIVE INTERACTIVE PREVIEW MODE */
            <div className="space-y-5">
              {/* Interactive Preview Header Notice */}
              <div className="flex items-center justify-between p-3.5 bg-[#D4BEE4]/40 border border-[#D4BEE4] rounded-2xl text-xs">
                <div className="flex items-center gap-2 text-[#3B1E54]">
                  <Eye className="w-4 h-4 text-[#3B1E54] shrink-0" />
                  <span className="font-bold">Live Interactive Product Preview</span>
                  <span className="text-[#715F85] hidden sm:inline">— Inspect how neighbors will see this item in the catalog.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('edit')}
                  className="px-3 py-1 bg-white hover:bg-[#FAF8FC] border border-[#D4BEE4] rounded-lg text-xs font-bold text-[#3B1E54] transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              {/* Interactive Showcase Card */}
              <div className="bg-white border border-[#D4BEE4] rounded-3xl overflow-hidden shadow-sm">
                {/* Media Stage Header */}
                <div className="p-3.5 bg-[#FAF8FC] border-b border-[#D4BEE4] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3B1E54]">
                    <ImageIcon className="w-4 h-4 text-[#3B1E54]" />
                    <span>Resource Photos ({photos.length || 1})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(photos[0] || defaultCategorySvg);
                      setPreviewZoom(1);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#3B1E54] hover:text-[#2A143D] hover:bg-[#D4BEE4]/40 rounded-xl transition-colors cursor-pointer border border-[#D4BEE4]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Preview Full Image</span>
                  </button>
                </div>

                {/* Media Stage */}
                <div className="relative aspect-video sm:aspect-[16/10] bg-[#1F0E2F] overflow-hidden">
                  <div 
                    className="w-full h-full relative cursor-pointer group flex items-center justify-center bg-gradient-to-b from-[#3B1E54] to-[#1F0E2F]"
                    onClick={() => {
                      setPreviewImage(photos[0] || defaultCategorySvg);
                      setPreviewZoom(1);
                    }}
                  >
                    <img
                      src={photos[0] || defaultCategorySvg}
                      alt={title || 'Product'}
                      className="max-h-full max-w-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold pointer-events-none">
                      <Maximize2 className="w-5 h-5 drop-shadow-md" />
                      <span>Click to Open High-Res Preview</span>
                    </div>
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#3B1E54] font-extrabold text-xs rounded-full shadow-xs">
                      {condition}
                    </span>
                  </div>
                </div>

                {/* Thumbnail strip if multiple photos */}
                {photos.length > 1 && (
                  <div className="p-3 bg-[#FAF8FC] border-t border-[#D4BEE4] flex items-center gap-2 overflow-x-auto">
                    {photos.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPreviewImage(p);
                          setPreviewZoom(1);
                        }}
                        className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#D4BEE4] hover:border-[#3B1E54] shrink-0 transition-colors cursor-pointer group relative"
                      >
                        <img src={p} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Details Preview */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold text-[#3B1E54] tracking-wider">
                          {isCustomCategory && customCategoryName.trim() ? customCategoryName : category}
                        </span>
                        <span className="text-[#D4BEE4]">•</span>
                        <span className="text-xs text-[#715F85] capitalize">{listingType} listing</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-[#3B1E54] font-sans mt-1">
                        {title.trim() || 'Untitled Resource'}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#715F85] block">Price Rate</span>
                      <div className="text-2xl font-extrabold text-[#3B1E54]">
                        {rateTextPreview}
                      </div>
                    </div>
                  </div>

                  {/* Eye-Catching Description with Short Paragraph & Key Bullets on Next Line */}
                  <InteractiveDescriptionViewer description={description.trim() || 'No description provided yet.'} />

                  {/* Exchange Wishlist preview if enabled */}
                  {(listingType === 'exchange' || listingType === 'both') && draftWishlistArray.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#D4BEE4]/40 border border-[#D4BEE4] space-y-2">
                      <span className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-[#3B1E54]" />
                        <span>Exchange Wishlist</span>
                      </span>
                      <ul className="text-sm font-semibold text-[#3B1E54] list-disc list-inside space-y-1">
                        {draftWishlistArray.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Meta badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#EEF2EF] text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#D4BEE4]">
                      <span className="text-[#715F85] block text-[11px]">Location</span>
                      <span className="font-bold text-[#3B1E54] text-sm">{neighborhood}, {city}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#D4BEE4]">
                      <span className="text-[#715F85] block text-[11px]">Availability Clock</span>
                      <span className="font-bold text-[#3B1E54] text-sm">
                        {isCustomClock ? `${clockStartHour} - ${clockEndHour}` : availabilityPreset}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#D4BEE4]">
                      <span className="text-[#715F85] block text-[11px]">Handover</span>
                      <span className="font-bold text-[#3B1E54] text-sm">
                        {draftPickupOptions.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {activeModalTab === 'preview' ? (
          <div className="p-4 sm:p-5 bg-[#FAF8FC] border-t border-[#D4BEE4] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setActiveModalTab('edit')}
              className="px-4 py-2.5 rounded-xl border border-[#D4BEE4] text-xs font-bold text-[#3B1E54] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit Form</span>
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#1F0E2F] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4BEE4]" />
              <span>{itemToEdit ? 'Save Changes & Update Item' : 'Publish Resource'}</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 bg-[#FAF8FC] border-t border-[#D4BEE4] flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#3B1E54] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#1F0E2F] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4BEE4]" />
                <span>{itemToEdit ? 'Save Changes & Update Item' : 'Publish Resource'}</span>
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Fullscreen High-Res Image Lightbox Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          onClick={() => setPreviewImage(null)}
        >
          {/* Lightbox Controls Header */}
          <div 
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/15">
              <Eye className="w-4 h-4 text-[#D4BEE4]" />
              <span>High-Res Photo Preview</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/15 text-white">
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(z + 0.25, 3))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono font-bold">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(1)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Stage */}
          <div 
            className="max-w-4xl max-h-[82vh] overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview Lightbox"
              style={{ transform: `scale(${previewZoom})` }}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200 cursor-zoom-in"
              onClick={() => setPreviewZoom((z) => (z >= 2 ? 1 : z + 0.5))}
            />
          </div>

          <div className="absolute bottom-4 text-white/70 text-xs font-medium">
            Click photo to zoom • Click backdrop or top-right × to close
          </div>
        </div>
      )}
    </div>
  );
};

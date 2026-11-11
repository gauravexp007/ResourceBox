import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import lottie, { AnimationItem } from 'lottie-web';
import { RefreshCw, WifiOff, AlertTriangle, HelpCircle, Upload, X, ArrowLeft } from 'lucide-react';

export type CatErrorType = 'network' | '404' | 'request' | 'upload';

interface CatInBoxAnimationProps {
  size?: number | string;
  className?: string;
}

/**
 * Renders the official cat-in-box Lottie animation from LottieFiles
 */
export const CatInBoxAnimation: React.FC<CatInBoxAnimationProps> = ({ size = 180, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/cat-in-box.json',
      });
    } catch (e) {
      console.warn('Lottie animation failed to load:', e);
    }

    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ width: size, height: size }} 
      className={`mx-auto flex items-center justify-center select-none overflow-hidden ${className}`}
    />
  );
};

interface CatInBoxErrorStateProps {
  type: CatErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
  actionText?: string;
  isModal?: boolean;
  className?: string;
}

const ERROR_CONFIGS: Record<CatErrorType, {
  badge: string;
  defaultTitle: string;
  defaultMessage: string;
  defaultAction: string;
  icon: React.ReactNode;
}> = {
  network: {
    badge: 'Network Offline',
    defaultTitle: 'Connection Interrupted',
    defaultMessage: "Mochi went hiding in the box because the internet dropped. Check your connection or Wi-Fi to continue.",
    defaultAction: 'Try Reconnecting',
    icon: <WifiOff className="w-4 h-4 text-amber-600" />,
  },
  '404': {
    badge: '404 Not Found',
    defaultTitle: 'Resource Not Found',
    defaultMessage: "We looked everywhere in the boxes, but this item or page isn't here. It might have been rented out, swapped, or moved.",
    defaultAction: 'Explore All Items',
    icon: <HelpCircle className="w-4 h-4 text-purple-600" />,
  },
  request: {
    badge: 'Request Failed',
    defaultTitle: 'Could Not Complete Request',
    defaultMessage: 'Something paused while contacting the server or database. Please give it another moment and try again.',
    defaultAction: 'Retry Request',
    icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
  },
  upload: {
    badge: 'Upload Issue',
    defaultTitle: 'Could Not Upload Item',
    defaultMessage: 'There was a hiccup processing your item photos or specifications. Please double check the fields and try again.',
    defaultAction: 'Retry Upload',
    icon: <Upload className="w-4 h-4 text-emerald-600" />,
  },
};

export const CatInBoxErrorState: React.FC<CatInBoxErrorStateProps> = ({
  type,
  title,
  message,
  onRetry,
  onClose,
  actionText,
  isModal = false,
  className = '',
}) => {
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.request;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;
  const displayAction = actionText || config.defaultAction;

  const content = (
    <div className={`flex flex-col items-center text-center p-6 sm:p-8 bg-white rounded-3xl border border-[#EBE6DD] shadow-sm max-w-md w-full mx-auto relative overflow-hidden ${className}`}>
      {/* Optional dismiss button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#715F85] flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Top Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-semibold text-[#54300E] mb-2">
        {config.icon}
        <span className="font-['Lexend'] tracking-wide">{config.badge}</span>
      </div>

      {/* The Lottie Cat In Box Animation */}
      <div className="my-1 relative">
        <CatInBoxAnimation size={175} />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg sm:text-xl font-extrabold text-[#3B1E54] font-['Lexend'] mt-1">
        {displayTitle}
      </h3>
      <p className="text-xs sm:text-sm text-[#715F85] mt-2 max-w-xs leading-relaxed font-medium">
        {displayMessage}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 w-full">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-2.5 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{displayAction}</span>
          </button>
        )}
        {onClose && !onRetry && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Dismiss</span>
          </button>
        )}
        {onClose && onRetry && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#715F85] hover:text-[#3B1E54] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#040C08]/65 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="relative z-10 w-full max-w-md"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};

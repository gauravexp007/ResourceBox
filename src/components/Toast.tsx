import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -45, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 28,
              mass: 0.8,
            }}
            className="pointer-events-auto max-w-md w-full select-none"
          >
            <div
              className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-3 relative overflow-hidden transition-all ${
                toast.type === 'success'
                  ? 'bg-[#3B1E54]/95 text-white border-[#9B7EBD]/40 shadow-emerald-950/30'
                  : toast.type === 'error'
                  ? 'bg-[#8F2D24]/95 text-white border-[#F28B82]/40 shadow-red-950/30'
                  : toast.type === 'warning'
                  ? 'bg-[#7B341E]/95 text-white border-[#F6AD55]/40 shadow-amber-950/30'
                  : 'bg-white/95 text-[#3B1E54] border-[#D4BEE4] shadow-gray-900/15'
              }`}
            >
              {/* Jitter Shimmer light sweep on notification entrance */}
              <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />

              {/* Animated Icon with spring pop */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.08 }}
                className="shrink-0 mt-0.5"
              >
                {toast.type === 'success' && (
                  <div className="w-7 h-7 rounded-full bg-[#D4BEE4]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#D4BEE4]" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-7 h-7 rounded-full bg-red-400/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-[#FAD2CF]" />
                  </div>
                )}
                {toast.type === 'warning' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-[#FBD38D]" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-7 h-7 rounded-full bg-[#3B1E54]/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-[#3B1E54]" />
                  </div>
                )}
              </motion.div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 pr-1">
                <h5 className="text-xs font-bold tracking-tight">{toast.title}</h5>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>

              {/* Dismiss Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDismiss}
                className="shrink-0 opacity-70 hover:opacity-100 p-1 rounded-lg transition-opacity cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Upload, RefreshCw, ShoppingBag, X, Sparkles } from 'lucide-react';

interface FloatingActionMenuProps {
  onOpenUpload: () => void;
  onNavigateToRent: () => void;
  onNavigateToExchange: () => void;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  onOpenUpload,
  onNavigateToRent,
  onNavigateToExchange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto select-none">
      
      {/* Click outside backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Jitter Animated Action Menu Stack */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.05,
                },
              },
              closed: {
                transition: {
                  staggerChildren: 0.04,
                  staggerDirection: -1,
                },
              },
            }}
            className="flex flex-col items-end gap-2.5 mb-3.5 z-40 relative"
          >
            {/* Action Item 1: Browse Rentals */}
            <motion.button
              type="button"
              variants={{
                open: { opacity: 1, y: 0, scale: 1 },
                closed: { opacity: 0, y: 15, scale: 0.8 },
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onNavigateToRent();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white text-[#3B1E54] border border-[#D4BEE4] shadow-lg hover:shadow-xl hover:border-[#3B1E54] text-xs font-bold transition-colors cursor-pointer group"
            >
              <span className="text-[11px] text-[#715F85] group-hover:text-[#3B1E54]">Explore</span>
              <span className="text-[#3B1E54]">Browse Rentals</span>
              <div className="w-7 h-7 rounded-full bg-[#FAF8FC] text-[#3B1E54] flex items-center justify-center group-hover:bg-[#D4BEE4]/40 transition-colors">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
            </motion.button>

            {/* Action Item 2: Exchange Hub */}
            <motion.button
              type="button"
              variants={{
                open: { opacity: 1, y: 0, scale: 1 },
                closed: { opacity: 0, y: 15, scale: 0.8 },
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onNavigateToExchange();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] border border-[#D4BEE4] shadow-lg hover:shadow-xl text-xs font-bold transition-all cursor-pointer group"
            >
              <span className="text-[11px] text-[#3B1E54]">Barter</span>
              <span className="text-[#3B1E54]">Exchange an Item</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#3B1E54] flex items-center justify-center group-hover:rotate-180 transition-transform duration-500 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            </motion.button>

            {/* Action Item 3: Upload Resource */}
            <motion.button
              type="button"
              variants={{
                open: { opacity: 1, y: 0, scale: 1 },
                closed: { opacity: 0, y: 15, scale: 0.8 },
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onOpenUpload();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#3B1E54] text-white border border-[#9B7EBD]/40 shadow-xl hover:bg-[#2A143D] text-xs font-bold transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
              
              <Sparkles className="w-3.5 h-3.5 text-[#D4BEE4]" />
              <span>Upload New Resource</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Upload className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Jitter FAB Trigger Button */}
      <div className="relative z-40">
        {/* Pulsing radar ring effect */}
        {!isOpen && (
          <div className="absolute -inset-1.5 rounded-full bg-[#9B7EBD]/30 animate-pulse-ring pointer-events-none" />
        )}

        <motion.button
          type="button"
          onClick={toggleOpen}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 border-2 border-white/30 cursor-pointer ${
            isOpen
              ? 'bg-[#3B1E54] text-white shadow-emerald-950/40'
              : 'bg-[#3B1E54] hover:bg-[#2A143D] text-white shadow-emerald-900/40'
          }`}
          aria-label="Toggle Quick Actions Menu"
        >
          {/* Animated Icon Rotation */}
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <Plus className="w-3.5 h-3.5" />
          </motion.div>

          <span className="font-bold text-xs sm:text-sm tracking-wide">
            {isOpen ? 'Close Menu' : 'Upload Resource'}
          </span>
        </motion.button>
      </div>

    </div>
  );
};

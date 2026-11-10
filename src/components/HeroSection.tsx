import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  RefreshCw, 
  Upload
} from 'lucide-react';
import { FloatingItemOutlines } from './FloatingItemOutlines';
import { CommunityFloatingBox } from './CommunityFloatingBox';

interface HeroSectionProps {
  onNavigateToRent: () => void;
  onNavigateToExchange: () => void;
  onOpenUpload: () => void;
  itemsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToRent,
  onNavigateToExchange,
  onOpenUpload,
  itemsCount = 0,
}) => {

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEEEEE] via-[#EEEEEE] to-[#EEEEEE] pt-8 pb-14 border-b border-[#D4BEE4]">
      {/* Seamless architectural background grid with purple tint */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(155, 126, 189, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(155, 126, 189, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
        }}
      />
      {/* Subtle coordinate intersection accent nodes */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 30, 84, 0.35) 1.5px, transparent 0)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
        }}
      />

      {/* Dynamic line-art moving outlines of rentable & exchangeable community items */}
      <FloatingItemOutlines />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subtitle Kicker with subtle float */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B1E54] tracking-wide uppercase">
            <span>ResourceBox Platform</span>
            <span aria-hidden="true" className="text-[#9B7EBD] font-bold">·</span>
            <span>Zero Waste Circular Economy</span>
            <span aria-hidden="true" className="text-[#9B7EBD] font-bold">·</span>
            <span>Real Authorized Community Items</span>
          </div>
        </motion.div>

        {/* 2-Column Responsive Hero: Headline & CTAs on Left, Interactive Circular Hub on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Subtext, CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--theme-deep)] tracking-tight leading-[1.14] font-luxury"
            >
              Your Unused Things, <br />
              <span className="text-[var(--theme-primary)] relative inline-block mt-1">
                Someone Else’s Treasure.
                <span 
                  className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-[3px] sm:h-1 bg-[var(--theme-primary)] rounded-full shadow-xs" 
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-[#5C4B6E] max-w-xl leading-relaxed"
            >
              Rent out tools, cameras, and equipment to earn extra income, or swap items directly with verified neighbors. Only real items added by authorized members are listed on our shared community hub.
            </motion.p>

            {/* Quick Action Navigation CTAs with Jitter Spring Hover & Tap */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={onNavigateToRent}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#D4BEE4] hover:border-[#9B7EBD] text-xs sm:text-sm font-semibold text-[#3B1E54] hover:text-[#9B7EBD] shadow-xs hover:shadow-md transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <span>Browse Rentals</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9B7EBD] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={onNavigateToExchange}
                className="px-5 py-2.5 rounded-xl bg-[#D4BEE4]/40 hover:bg-[#D4BEE4]/60 border border-[#D4BEE4] text-xs sm:text-sm font-semibold text-[#3B1E54] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#9B7EBD] group-hover:rotate-180 transition-transform duration-500" />
                <span>Exchange Hub (Swap)</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={onOpenUpload}
                className="px-5 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:shadow-xl flex items-center gap-2 cursor-pointer relative overflow-hidden"
              >
                {/* Jitter Shimmer light sweep effect */}
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
                
                <Upload className="w-3.5 h-3.5 text-[#D4BEE4]" />
                <span>List Your Resource</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Cardboard Box with Community Items Floating Above and 360° Click-to-Rotate */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <CommunityFloatingBox 
              itemsCount={itemsCount}
              onOpenUpload={onOpenUpload}
              onNavigateToRent={onNavigateToRent}
            />
          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden pt-8 pb-14 border-b border-[#D4BEE4]"
      style={{ backgroundColor: 'var(--theme-canvas)' }}
    >
      {/* Dynamic theme-reactive corner gradient shading with smooth continuous movement */}
      <div
        aria-hidden="true"
        data-testid="hero-corner-shading"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Top-Left Corner Gradient Wash */}
        <motion.div
          data-corner="top-left"
          className="absolute -top-24 -left-24 w-[320px] h-[270px] sm:w-[460px] sm:h-[370px] rounded-full blur-2xl will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 32% 32%, color-mix(in srgb, var(--theme-primary) 34%, transparent) 0%, color-mix(in srgb, var(--theme-accent) 44%, transparent) 40%, transparent 75%)',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 38, -14, 0],
                  y: [0, 26, -12, 0],
                  scale: [1, 1.12, 0.96, 1],
                  rotate: [0, 12, -8, 0],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Top-Right Corner Gradient Wash */}
        <motion.div
          data-corner="top-right"
          className="absolute -top-28 -right-24 w-[340px] h-[290px] sm:w-[500px] sm:h-[390px] rounded-full blur-2xl will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 68% 28%, color-mix(in srgb, var(--theme-accent) 56%, transparent) 0%, color-mix(in srgb, var(--theme-primary) 32%, transparent) 44%, transparent 76%)',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, -44, 18, 0],
                  y: [0, 32, -10, 0],
                  scale: [1.04, 0.94, 1.12, 1.04],
                  rotate: [0, -14, 10, 0],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bottom-Left Corner Gradient Wash */}
        <motion.div
          data-corner="bottom-left"
          className="absolute -bottom-28 -left-24 w-[320px] h-[270px] sm:w-[480px] sm:h-[360px] rounded-full blur-2xl will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--theme-deep) 20%, transparent) 0%, color-mix(in srgb, var(--theme-primary) 30%, transparent) 38%, color-mix(in srgb, var(--theme-accent) 34%, transparent) 58%, transparent 78%)',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 36, -12, 0],
                  y: [0, -28, 12, 0],
                  scale: [1, 1.1, 0.95, 1],
                }
          }
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bottom-Right Corner Gradient Wash */}
        <motion.div
          data-corner="bottom-right"
          className="absolute -bottom-28 -right-24 w-[340px] h-[290px] sm:w-[520px] sm:h-[400px] rounded-full blur-2xl will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 70% 72%, color-mix(in srgb, var(--theme-primary) 38%, transparent) 0%, color-mix(in srgb, var(--theme-accent) 50%, transparent) 42%, transparent 76%)',
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, -42, 16, 0],
                  y: [0, -34, 14, 0],
                  scale: [1.02, 1.14, 0.96, 1.02],
                }
          }
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle perimeter theme corner vignette framing clean center readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 84% 80% at 50% 50%, transparent 50%, color-mix(in srgb, var(--theme-accent) 18%, transparent) 84%, color-mix(in srgb, var(--theme-primary) 15%, transparent) 100%)',
          }}
        />
      </div>

      {/* Seamless architectural background grid synced with active theme */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--theme-primary) 14%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--theme-primary) 14%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0.7) 12%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.01) 88%, transparent 100%)',
        }}
      />
      {/* Subtle coordinate intersection accent nodes synced with active theme */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--theme-deep) 35%, transparent) 1.5px, transparent 0)',
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

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import lottie, { AnimationItem } from 'lottie-web';
import { Heart, Sparkles } from 'lucide-react';

interface PeepingOrangeCatProps {
  className?: string;
}

export const PeepingOrangeCat: React.FC<PeepingOrangeCatProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  // Trigger arrival animation when user scroll reaches the footer area
  const isInView = useInView(containerRef, { once: false, amount: 0.15 });
  const [isHovered, setIsHovered] = useState(false);
  const [patted, setPatted] = useState(false);

  // Initialize Lottie animation from official LottieFiles orange cat peeping asset
  useEffect(() => {
    if (!lottieContainerRef.current) return;

    try {
      animRef.current = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '/animations/orange-cat-peeping.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMax slice',
        },
      });
    } catch (e) {
      console.warn('Failed to load orange cat Lottie animation:', e);
    }

    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  // When scroll reaches footer, play peeping animation; pause when scrolled away
  useEffect(() => {
    if (!animRef.current) return;
    if (isInView) {
      animRef.current.goToAndPlay(0, true);
    } else {
      animRef.current.pause();
    }
  }, [isInView]);

  const handlePat = () => {
    setPatted(true);
    setTimeout(() => setPatted(false), 2000);
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full flex flex-col items-center select-none ${className}`}
    >
      {/* Dynamic Pop-up Speech Bubble */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.35 }}
            className="mb-1 px-3 py-1 rounded-full bg-white text-[#3B1E54] text-[11px] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-[#E8E2D8] flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
            onClick={handlePat}
            title="Click to pet the peeping cat!"
          >
            <span>{isHovered ? 'Join our circle! 🐾' : 'Psst... stay in the loop! ✉️'}</span>
            {patted && (
              <span className="text-rose-500 font-extrabold flex items-center gap-0.5 animate-pulse">
                <Heart className="w-3 h-3 fill-rose-500" />
                Purr~
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrival Animation: Cat emerges upward when scroll reaches the footer */}
      <motion.div
        initial={{ y: 48, opacity: 0, scale: 0.9 }}
        animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 48, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePat}
        className="relative w-28 h-20 sm:w-32 sm:h-22 cursor-pointer overflow-hidden flex items-end justify-center group"
        title="Orange Cat Peeping"
      >
        {/* Lottie Animation Canvas */}
        <div
          ref={lottieContainerRef}
          className="w-full h-[155px] sm:h-[175px] -mb-1 transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
        />

        {/* Floating Heart reaction on click */}
        <AnimatePresence>
          {patted && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.7 }}
              animate={{ opacity: 0, y: -25, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-0 right-4 pointer-events-none text-rose-500"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import lottie, { AnimationItem } from 'lottie-web';
import { Heart } from 'lucide-react';

interface PeepingOrangeCatProps {
  className?: string;
}

const CUTE_QUOTES = [
  'Psst... stay in loop! ✉️',
  'Borrow more, buy less! 🌿',
  'Peek-a-boo! 🐾',
  'Join our circle! 💌',
  'Found cool gear yet? ✨',
  'Share with neighbors! 🤝',
];

export const PeepingOrangeCat: React.FC<PeepingOrangeCatProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  // Trigger arrival animation when user scroll reaches the footer area
  const isInView = useInView(containerRef, { once: false, amount: 0.15 });
  const [isPeeping, setIsPeeping] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
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

  // When scroll enters footer, immediately start peeping up; when scrolled away, smoothly hide
  useEffect(() => {
    if (!isInView) {
      setIsPeeping(false);
      return;
    }

    // Entering view starts the visible cycle
    setIsPeeping(true);
  }, [isInView]);

  // Timed cyclical appearance: 7 seconds visible, then smooth hiding animation, 2 seconds hidden, then pops back up
  useEffect(() => {
    if (!isInView) return;

    let timer: NodeJS.Timeout;

    if (isPeeping) {
      // Cat plays Lottie and stays visible for 7 seconds
      animRef.current?.goToAndPlay(0, true);

      timer = setTimeout(() => {
        // Smoothly hide down after 7 seconds
        setIsPeeping(false);
      }, 7000);
    } else {
      // Cat stays hidden underground for 2 seconds, then pops back up
      timer = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % CUTE_QUOTES.length);
        setIsPeeping(true);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [isPeeping, isInView]);

  const handlePat = () => {
    setPatted(true);
    setTimeout(() => setPatted(false), 2000);
  };

  const isVisible = isInView && isPeeping;

  return (
    <div 
      ref={containerRef} 
      className={`relative flex flex-col items-end select-none ${className}`}
    >
      {/* Dynamic Pop-up Speech Bubble with fixed container height to avoid any layout jitter */}
      <div className="h-6 flex items-end justify-end mb-1 pointer-events-auto">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={`quote-${quoteIndex}`}
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                y: 8, 
                scale: 0.88, 
                transition: { duration: 0.45, ease: 'easeInOut' } 
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.2 }}
              className="px-2.5 py-0.5 rounded-full bg-white text-[#3B1E54] text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.18)] border border-[#E8E2D8] flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform shrink-0 whitespace-nowrap"
              onClick={handlePat}
              title="Click to pet the peeping cat!"
            >
              <span>{isHovered ? 'Join our circle! 🐾' : CUTE_QUOTES[quoteIndex]}</span>
              {patted && (
                <span className="text-rose-500 font-extrabold flex items-center gap-0.5 animate-pulse">
                  <Heart className="w-2.5 h-2.5 fill-rose-500" />
                  Purr~
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Arrival & Hiding Animation: Cat emerges upward for 7s, smoothly ducks down for 2s, and pops back up */}
      <motion.div
        initial={{ y: 52, opacity: 0, scale: 0.94 }}
        animate={
          isVisible
            ? { y: 0, opacity: 1, scale: 1 }
            : { y: 52, opacity: 0, scale: 0.94 }
        }
        transition={
          isVisible
            ? { 
                type: 'spring', 
                stiffness: 240, 
                damping: 20, 
                mass: 0.85,
                delay: 0.05
              }
            : { 
                duration: 0.65, 
                ease: [0.4, 0.0, 0.2, 1] // Silky-smooth gradual downward slide, never sudden
              }
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePat}
        className="relative w-16 h-12 sm:w-18 sm:h-13 cursor-pointer overflow-hidden flex items-end justify-center group"
        title="Orange Cat Peeping"
      >
        {/* Lottie Animation Canvas */}
        <div
          ref={lottieContainerRef}
          className="w-full h-[95px] sm:h-[105px] transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
        />

        {/* Floating Heart reaction on click */}
        <AnimatePresence>
          {patted && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.7 }}
              animate={{ opacity: 0, y: -20, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute top-0 right-2 pointer-events-none text-rose-500"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

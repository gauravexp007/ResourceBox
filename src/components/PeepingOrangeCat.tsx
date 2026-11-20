import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import lottie, { AnimationItem } from 'lottie-web';
import { Heart } from 'lucide-react';

interface PeepingOrangeCatProps {
  className?: string;
}

const CUTE_QUOTES = [
  'Rate & review us! ⭐',
  'Borrow more, buy less! 🌿',
  'Peek-a-boo! 🐾',
  'Share your feedback! 💬',
  'Found cool gear yet? ✨',
  'Help us improve! 🤝',
];

export const PeepingOrangeCat: React.FC<PeepingOrangeCatProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  // Trigger arrival animation when user scroll reaches the footer area
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const [isPeeping, setIsPeeping] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [patted, setPatted] = useState(false);

  // Initialize Lottie animation from orange cat peeping asset
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

  // Enter view -> peep up; leave view -> slide down into hiding
  useEffect(() => {
    if (!isInView) {
      setIsPeeping(false);
      return;
    }
    setIsPeeping(true);
  }, [isInView]);

  // Timed cyclical appearance: 7 seconds visible, then smooth downward hiding slide, 2.2s tucked down, then pops back up
  useEffect(() => {
    if (!isInView) return;

    let timer: ReturnType<typeof setTimeout>;

    if (isPeeping) {
      animRef.current?.goToAndPlay(0, true);
      timer = setTimeout(() => {
        setIsPeeping(false);
      }, 7000);
    } else {
      timer = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % CUTE_QUOTES.length);
        setIsPeeping(true);
      }, 2200);
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
      {/* Dynamic Pop-up Speech Bubble */}
      <div className="h-6 flex items-end justify-end mb-0.5 pointer-events-auto">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={`quote-${quoteIndex}`}
              initial={{ opacity: 0, y: 12, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 14,
                scale: 0.9,
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.16 }}
              className="px-2.5 py-0.5 rounded-full bg-white text-[#3B1E54] text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.18)] border border-[#E8E2D8] flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform shrink-0 whitespace-nowrap"
              onClick={handlePat}
              title="Click to pet the peeping cat!"
            >
              <span>{isHovered ? 'Tap below to rate! 🐾' : CUTE_QUOTES[quoteIndex]}</span>
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

      {/* Clipped Stage Window: Cat pops UP from behind the button edge and slides DOWN behind it without fading out */}
      <div className="relative w-20 h-[52px] overflow-hidden flex items-end justify-center">
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: isVisible ? 0 : 60 }}
          transition={
            isVisible
              ? {
                  type: 'spring',
                  stiffness: 230,
                  damping: 20,
                  mass: 0.85,
                }
              : {
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }
          }
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handlePat}
          className="relative w-18 h-[52px] cursor-pointer flex items-end justify-center group will-change-transform"
          title="Orange Cat Peeping"
        >
          {/* Lottie Animation Canvas */}
          <div
            ref={lottieContainerRef}
            className="w-full h-[100px] transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
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
    </div>
  );
};

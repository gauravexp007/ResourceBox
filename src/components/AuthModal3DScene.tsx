import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

export type AuthFieldFocus = 'name' | 'email' | 'password' | 'google' | null;

interface AuthModal3DSceneProps {
  mode: 'signin' | 'signup';
  focusedField?: AuthFieldFocus;
  isSubmitting?: boolean;
  isAwesome?: boolean;
}

const CUTE_RANDOM_MESSAGES = [
  "Rent what you need, share what you don't! 📦",
  "Zero waste, happy neighbors! 🌿",
  "Got unused tools or cameras? Put 'em to work! 🛠️",
  "Purrrrr... sharing makes the world warmer! 💖",
  "Psst... 100% free community sharing! 🎈",
  "You're awesome for being here today! ✨",
  "Meow! Better for your wallet & the planet 🌎",
];

export const AuthModal3DScene: React.FC<AuthModal3DSceneProps> = ({
  mode,
  focusedField = null,
  isSubmitting = false,
  isAwesome = false,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [randomMessageIndex, setRandomMessageIndex] = useState<number | null>(null);

  const handleKittyClick = () => {
    setClickCount((c) => c + 1);
    const nextIdx = Math.floor(Math.random() * CUTE_RANDOM_MESSAGES.length);
    setRandomMessageIndex(nextIdx);
  };

  // Determine the active message displayed in the cat's speech bubble
  const getCatMessage = () => {
    if (randomMessageIndex !== null && !focusedField && !isSubmitting && !isAwesome) {
      return CUTE_RANDOM_MESSAGES[randomMessageIndex];
    }

    if (isAwesome || isSubmitting) {
      return "Awesome! Here we go! 🚀✨";
    }

    if (focusedField === 'name') {
      return "What should we call you? 🐾";
    }
    if (focusedField === 'email') {
      return "Enter your mail! ✉️";
    }
    if (focusedField === 'password') {
      return "Go for your password! (I won't peek! 🙈)";
    }
    if (focusedField === 'google') {
      return "Google login! Quick & safe ⚡";
    }

    if (mode === 'signin') {
      return "Log in here! 🐱";
    }
    return "Sign up here! 📦";
  };

  const activeMessage = getCatMessage();

  useEffect(() => {
    if (focusedField) {
      setRandomMessageIndex(null);
    }
  }, [focusedField]);

  const isPasswordFocused = focusedField === 'password';
  const isEmailFocused = focusedField === 'email';
  const isHappyCelebration = isAwesome || isSubmitting;

  return (
    <div
      className="relative w-full h-full min-h-[380px] md:min-h-[560px] flex flex-col items-center justify-center px-4 pt-8 pb-10 sm:px-8 sm:pt-8 sm:pb-12 select-none border-b md:border-b-0 md:border-r border-[#EFECE6] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #E6F4FE 0%, #F4FAFF 50%, #F7FDF4 76%, #DCF2CB 100%)',
      }}
    >
      {/* 1. SKY LAYER: Soft Sun & Seamlessly Drifting Clouds (Never cropped, responsive on every screen) */}
      <div className="absolute top-0 inset-x-0 h-[55%] pointer-events-none overflow-hidden z-[1]">
        {/* Gentle Glowing Sun (inset safely away from top-right close button) */}
        <motion.svg
          viewBox="0 0 120 120"
          animate={{ scale: [1, 1.06, 1], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-3 right-12 sm:top-5 sm:right-14 w-20 h-20 sm:w-24 sm:h-24 overflow-visible"
        >
          <defs>
            <radialGradient id="softSunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF4B8" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#FFE999" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFE999" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#softSunGlow)" />
          <circle cx="60" cy="60" r="20" fill="#FFE68A" opacity="0.9" />
        </motion.svg>

        {/* Cloud 1: Seamless horizontal drift */}
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] inset-x-0 h-14"
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 90 45" className="absolute left-[8%] top-0 w-20 sm:w-24 h-auto overflow-visible opacity-95">
              <ellipse cx="44" cy="26" rx="28" ry="13" fill="#FFFFFF" />
              <circle cx="28" cy="20" r="14" fill="#FFFFFF" />
              <circle cx="48" cy="14" r="17" fill="#FFFFFF" />
              <circle cx="64" cy="22" r="12" fill="#FFFFFF" />
              <path d="M 18,32 Q 46,37 72,31" fill="none" stroke="#E2F1FC" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 90 45" className="absolute -left-[92%] top-0 w-20 sm:w-24 h-auto overflow-visible opacity-95">
              <ellipse cx="44" cy="26" rx="28" ry="13" fill="#FFFFFF" />
              <circle cx="28" cy="20" r="14" fill="#FFFFFF" />
              <circle cx="48" cy="14" r="17" fill="#FFFFFF" />
              <circle cx="64" cy="22" r="12" fill="#FFFFFF" />
              <path d="M 18,32 Q 46,37 72,31" fill="none" stroke="#E2F1FC" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Cloud 2: Seamless horizontal drift at slower pace */}
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[30%] inset-x-0 h-12"
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 80 40" className="absolute left-[58%] top-0 w-16 sm:w-20 h-auto overflow-visible opacity-90">
              <ellipse cx="40" cy="22" rx="24" ry="10" fill="#FFFFFF" />
              <circle cx="25" cy="17" r="11" fill="#FFFFFF" />
              <circle cx="42" cy="12" r="14" fill="#FFFFFF" />
              <circle cx="56" cy="19" r="10" fill="#FFFFFF" />
              <path d="M 17,27 Q 40,31 63,26" fill="none" stroke="#E5F2FC" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 80 40" className="absolute -left-[42%] top-0 w-16 sm:w-20 h-auto overflow-visible opacity-90">
              <ellipse cx="40" cy="22" rx="24" ry="10" fill="#FFFFFF" />
              <circle cx="25" cy="17" r="11" fill="#FFFFFF" />
              <circle cx="42" cy="12" r="14" fill="#FFFFFF" />
              <circle cx="56" cy="19" r="10" fill="#FFFFFF" />
              <path d="M 17,27 Q 40,31 63,26" fill="none" stroke="#E5F2FC" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Cloud 3: Soft background wisp */}
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[50%] inset-x-0 h-10"
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 60 30" className="absolute left-[32%] top-0 w-12 sm:w-16 h-auto overflow-visible opacity-80">
              <ellipse cx="30" cy="16" rx="18" ry="8" fill="#FFFFFF" />
              <circle cx="22" cy="12" r="9" fill="#FFFFFF" />
              <circle cx="36" cy="10" r="10" fill="#FFFFFF" />
            </svg>
            <svg viewBox="0 0 60 30" className="absolute -left-[68%] top-0 w-12 sm:w-16 h-auto overflow-visible opacity-80">
              <ellipse cx="30" cy="16" rx="18" ry="8" fill="#FFFFFF" />
              <circle cx="22" cy="12" r="9" fill="#FFFFFF" />
              <circle cx="36" cy="10" r="10" fill="#FFFFFF" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* 2. BACK ROLLING HILL LAYER (z-[1], behind trees) */}
      <svg
        viewBox="0 0 800 180"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 w-full h-[38%] pointer-events-none z-[1]"
      >
        <defs>
          <linearGradient id="backHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DFF4CE" />
            <stop offset="100%" stopColor="#C8ECAE" />
          </linearGradient>
        </defs>
        <path
          d="M 0,48 Q 210,4 470,38 T 800,22 L 800,180 L 0,180 Z"
          fill="url(#backHillGrad)"
        />
      </svg>

      {/* 3. TREES LAYER (z-[2], height-driven aspect-safe SVGs so canopies never clip and trunks stay balanced across mobile/tablet/desktop) */}
      {/* Left Cute Storybook Tree */}
      <motion.svg
        viewBox="0 0 150 230"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        animate={{ rotate: [-1.3, 1.3, -1.3] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50% 88%' }}
        className="absolute bottom-[10%] md:bottom-[12%] left-[1%] sm:left-[3%] md:left-[1%] h-[54%] md:h-[46%] w-auto max-w-[30%] md:max-w-[34%] pointer-events-none z-[2] overflow-visible"
      >
        <defs>
          <linearGradient id="treeLeafMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9AE08E" />
            <stop offset="100%" stopColor="#6EC168" />
          </linearGradient>
          <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9C6B4B" />
            <stop offset="100%" stopColor="#7E5135" />
          </linearGradient>
        </defs>
        {/* Trunk extending down behind grass hill */}
        <path d="M 65,230 Q 68,155 67,108 L 83,108 Q 82,155 86,230 Z" fill="url(#treeTrunkGrad)" />
        <path d="M 71,134 L 49,112" stroke="#8C5C3E" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 79,124 L 98,105" stroke="#8C5C3E" strokeWidth="5" strokeLinecap="round" />
        {/* Lush Full Canopy (entirely inside viewBox with generous top padding) */}
        <circle cx="48" cy="92" r="29" fill="#7AC872" />
        <circle cx="101" cy="90" r="31" fill="#74C36C" />
        <circle cx="75" cy="56" r="37" fill="url(#treeLeafMain)" />
        <circle cx="57" cy="76" r="26" fill="url(#treeLeafMain)" />
        <circle cx="92" cy="74" r="26" fill="url(#treeLeafMain)" />
        {/* Sunlit Highlights & Blossoms */}
        <circle cx="70" cy="43" r="19" fill="#B6EBB0" opacity="0.65" />
        <circle cx="51" cy="68" r="11" fill="#BCEEB6" opacity="0.5" />
        <circle cx="57" cy="60" r="3.2" fill="#FFF7D6" />
        <circle cx="94" cy="70" r="2.8" fill="#FFD6E0" />
        <circle cx="80" cy="88" r="3" fill="#FFF7D6" />
      </motion.svg>

      {/* Right Cute Distant Tree */}
      <motion.svg
        viewBox="0 0 130 210"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        animate={{ rotate: [-1.1, 1.1, -1.1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50% 88%' }}
        className="absolute bottom-[12%] md:bottom-[14%] right-[1%] sm:right-[3%] md:right-[1%] h-[48%] md:h-[42%] w-auto max-w-[26%] md:max-w-[29%] pointer-events-none z-[2] overflow-visible"
      >
        <defs>
          <linearGradient id="treeLeafSoft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BEEBB4" />
            <stop offset="100%" stopColor="#8FD485" />
          </linearGradient>
        </defs>
        {/* Trunk extending down behind mid/foreground land layers */}
        <path d="M 59,210 L 61,96 L 69,96 L 71,210 Z" fill="#A67A5B" />
        <path d="M 65,120 L 80,104" stroke="#A67A5B" strokeWidth="3.8" strokeLinecap="round" />
        {/* Full Soft Canopy */}
        <circle cx="65" cy="72" r="31" fill="url(#treeLeafSoft)" />
        <circle cx="44" cy="89" r="22" fill="url(#treeLeafSoft)" />
        <circle cx="86" cy="87" r="23" fill="url(#treeLeafSoft)" />
        <circle cx="67" cy="60" r="18" fill="#D2F4C8" opacity="0.78" />
      </motion.svg>

      {/* 4. MID & FOREGROUND LAND LAYERS (z-[3], rendered IN FRONT OF trees so both tree bases are covered cleanly) */}
      <svg
        viewBox="0 0 800 180"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 w-full h-[32%] pointer-events-none z-[3]"
      >
        <defs>
          <linearGradient id="midLandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7EBA9" />
            <stop offset="100%" stopColor="#A9DC85" />
          </linearGradient>
          <linearGradient id="frontMeadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B3E290" />
            <stop offset="55%" stopColor="#9CD474" />
            <stop offset="100%" stopColor="#85C25C" />
          </linearGradient>
        </defs>

        {/* Mid Meadow Hill covering left & right tree bases */}
        <path
          d="M 0,44 Q 190,14 420,42 T 800,26 L 800,180 L 0,180 Z"
          fill="url(#midLandGrad)"
        />

        {/* Foreground Lush Land Mound rising over right tree base */}
        <path
          d="M 0,76 Q 225,104 495,62 Q 670,34 800,56 L 800,180 L 0,180 Z"
          fill="url(#frontMeadowGrad)"
        />

        {/* Deep foreground meadow band */}
        <path
          d="M 0,126 Q 330,104 800,130 L 800,180 L 0,180 Z"
          fill="#7EC154"
          opacity="0.34"
        />
      </svg>

      {/* 5. ANIMATED SWAYING GRASS TUFTS & WILDFLOWERS (z-[4], aspect-safe SVGs sitting cleanly on the meadow) */}
      <div className="absolute bottom-0 inset-x-0 h-[34%] pointer-events-none z-[4] overflow-hidden">
        {/* Left Grass Tuft near Left Tree Base */}
        <motion.svg
          viewBox="0 0 40 40"
          animate={{ rotate: [-3.5, 3.5, -3.5] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 92%' }}
          className="absolute bottom-[42%] left-[8%] w-7 h-7 sm:w-8 sm:h-8 overflow-visible"
        >
          <path d="M 16,38 Q 12,24 6,18 Q 15,25 19,38 Z" fill="#6BB14F" />
          <path d="M 20,38 Q 20,20 23,12 Q 24,23 23,38 Z" fill="#7EC461" />
          <path d="M 24,38 Q 30,25 36,21 Q 28,28 27,38 Z" fill="#62A348" />
        </motion.svg>

        {/* Mid-Left Grass & Daisy */}
        <motion.svg
          viewBox="0 0 40 40"
          animate={{ rotate: [-3, 3.5, -3] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          style={{ transformOrigin: '50% 92%' }}
          className="absolute bottom-[18%] left-[19%] w-7 h-7 sm:w-8 sm:h-8 overflow-visible"
        >
          <path d="M 16,38 Q 12,26 7,20 Q 15,26 19,38 Z" fill="#73B956" />
          <path d="M 20,38 Q 22,23 25,16 Q 25,27 23,38 Z" fill="#86CC69" />
          <path d="M 24,38 Q 29,27 34,24 Q 28,30 26,38 Z" fill="#68AD4D" />
          <circle cx="9" cy="19" r="3.4" fill="#FFFFFF" />
          <circle cx="9" cy="19" r="1.5" fill="#FFD166" />
        </motion.svg>

        {/* Grass & Flower Right at Base of Right Tree */}
        <motion.svg
          viewBox="0 0 40 40"
          animate={{ rotate: [-3.2, 3.2, -3.2] }}
          transition={{ duration: 4.9, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          style={{ transformOrigin: '50% 92%' }}
          className="absolute bottom-[40%] right-[13%] w-7 h-7 sm:w-8 sm:h-8 overflow-visible"
        >
          <path d="M 15,38 Q 10,24 4,18 Q 13,25 18,38 Z" fill="#6DB350" />
          <path d="M 20,38 Q 20,21 23,12 Q 24,24 23,38 Z" fill="#82C964" />
          <path d="M 25,38 Q 32,26 38,21 Q 29,28 28,38 Z" fill="#64A848" />
          <circle cx="37" cy="20" r="3.2" fill="#FFE3EC" />
          <circle cx="37" cy="20" r="1.4" fill="#FF9EBB" />
        </motion.svg>

        {/* Bottom-Right Foreground Grass Tuft */}
        <motion.svg
          viewBox="0 0 40 40"
          animate={{ rotate: [-2.5, 3, -2.5] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          style={{ transformOrigin: '50% 92%' }}
          className="absolute bottom-[14%] right-[9%] w-7 h-7 sm:w-8 sm:h-8 overflow-visible"
        >
          <path d="M 16,38 Q 12,27 8,22 Q 15,28 19,38 Z" fill="#66AB4B" />
          <path d="M 20,38 Q 22,25 25,19 Q 25,29 23,38 Z" fill="#7BC15E" />
          <circle cx="8" cy="21" r="3" fill="#FFFFFF" />
          <circle cx="8" cy="21" r="1.3" fill="#FFD166" />
        </motion.svg>
      </div>

      {/* MAIN STAGE: Speech Bubble + Cute Kitty in Box */}
      <div className="relative z-10 my-auto w-full max-w-[270px] sm:max-w-[280px] flex flex-col items-center justify-center">

        {/* 1. Dynamic Kawaii Speech Bubble */}
        <div className="relative w-full flex justify-center mb-3 sm:mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessage}
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className="relative px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#E5DECF] shadow-[0_8px_20px_rgba(74,59,50,0.10)] text-center max-w-[250px] sm:max-w-[260px]"
            >
              <p className="text-xs sm:text-sm font-bold text-[#3B2C24] font-['Lexend'] leading-snug">
                {activeMessage}
              </p>

              {/* Speech bubble pointer arrow */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-b border-r border-[#E5DECF] rotate-45"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. Interactive Kitty & Box Vector Unit */}
        <div
          onClick={handleKittyClick}
          className="relative w-56 h-48 sm:w-64 sm:h-56 flex items-center justify-center cursor-pointer"
          title="Mochi loves pats!"
        >
          {/* Meadow Grass Soft Shadow under Box (Constant gentle breathing pulse) */}
          <motion.div
            animate={{
              scale: [1, 0.97, 1],
              opacity: [0.36, 0.3, 0.36],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1 w-40 sm:w-44 h-6 rounded-full bg-[#4A7C36]/25 filter blur-xs"
          />

          {/* SVG Illustration: Mochi the Kitty in ResourceBox */}
          <svg
            viewBox="0 0 200 180"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Cardboard Box Warm Gradient */}
              <linearGradient id="boxFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E8B074" />
                <stop offset="100%" stopColor="#C98642" />
              </linearGradient>

              <linearGradient id="boxInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7A481B" />
                <stop offset="100%" stopColor="#54300E" />
              </linearGradient>

              <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2C18D" />
                <stop offset="100%" stopColor="#D69756" />
              </linearGradient>

              {/* Kitty Cream White Fur */}
              <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFF5E8" />
              </linearGradient>

              {/* Ginger Calico Patches */}
              <linearGradient id="gingerPatches" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9E42" />
                <stop offset="100%" stopColor="#E67B1E" />
              </linearGradient>
            </defs>

            {/* Back Flap of Box */}
            <polygon points="56,104 74,82 126,82 144,104" fill="#B87B3C" opacity="0.95" />

            {/* Inner Box Shadow / Cushion */}
            <rect x="56" y="102" width="88" height="22" rx="4" fill="url(#boxInnerGrad)" />

            {/* --- KITTY HEAD, BODY & TAIL (Smooth Constant Breathing Motion, No Mouse Tracking) --- */}
            <motion.g
              animate={{
                y: isHappyCelebration
                  ? [-10, -20, -10]
                  : isEmailFocused
                  ? [-8, -12, -8]
                  : [0, -3.5, 0],
                rotate: isHappyCelebration ? [-3, 3, -3] : [-0.8, 0.8, -0.8],
              }}
              transition={{
                duration: isHappyCelebration ? 1.1 : 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }}
            >
              {/* Tail Tucked Behind Mochi's Body — Only a Little Tip Peeks Out Behind the Right Side */}
              <motion.g
                animate={{
                  rotate: isHappyCelebration ? [-5, 6, -5] : [-3, 4, -3],
                }}
                transition={{
                  duration: isHappyCelebration ? 1.2 : 3.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '116px 108px', transformBox: 'view-box' }}
              >
                {/* Tail base stays tucked behind torso/box; only a small cute tip peeks out past the right flank */}
                <path
                  d="M 116,108 Q 134,107 140,97"
                  fill="none"
                  stroke="url(#gingerPatches)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  d="M 138.5,100 Q 139.5,98.5 140,97"
                  fill="none"
                  stroke="#FFF7ED"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Body (drawn IN FRONT OF the tail so the tail sits behind Mochi and only a small part is visible) */}
              <ellipse cx="100" cy="110" rx="38" ry="24" fill="url(#furGrad)" />

              {/* Left Ear */}
              <polygon points="74,74 62,44 88,58" fill="url(#furGrad)" stroke="#F2E3CE" strokeWidth="1" />
              <polygon points="75,72 67,49 86,59" fill="#FFB7B2" />

              {/* Right Ear */}
              <polygon points="126,74 138,44 112,58" fill="url(#furGrad)" stroke="#F2E3CE" strokeWidth="1" />
              <polygon points="125,72 133,49 114,59" fill="#FFB7B2" />

              {/* Head */}
              <ellipse cx="100" cy="78" rx="33" ry="26" fill="url(#furGrad)" />

              {/* Cute Ginger Tabby Patch */}
              <path d="M 88,54 Q 100,64 112,54 Q 100,58 88,54 Z" fill="url(#gingerPatches)" />
              <path d="M 64,55 Q 74,65 72,74 Q 66,66 64,55 Z" fill="url(#gingerPatches)" />

              {/* Blushing Cheeks */}
              <ellipse cx="76" cy="85" rx="5.5" ry="3.5" fill="#FFA3AF" opacity="0.85" />
              <ellipse cx="124" cy="85" rx="5.5" ry="3.5" fill="#FFA3AF" opacity="0.85" />

              {/* Whiskers */}
              <line x1="68" y1="83" x2="52" y2="81" stroke="#E0CDBB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="68" y1="87" x2="54" y2="89" stroke="#E0CDBB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="132" y1="83" x2="148" y2="81" stroke="#E0CDBB" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="132" y1="87" x2="146" y2="89" stroke="#E0CDBB" strokeWidth="1.5" strokeLinecap="round" />

              {/* Pink Nose */}
              <polygon points="98,81 102,81 100,84" fill="#FF8A9E" />

              {/* Kawaii W-Mouth */}
              <path
                d="M 95,85 Q 97.5,88 100,85 Q 102.5,88 105,85"
                fill="none"
                stroke="#4A3425"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              {/* --- EYES LOGIC (No Mouse Tracking, Constant Expressive Calm with Gentle Blink) --- */}
              {isPasswordFocused ? (
                <g>
                  <path d="M 83,76 Q 88,71 93,76" fill="none" stroke="#4A3425" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 107,76 Q 112,71 117,76" fill="none" stroke="#4A3425" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              ) : isEmailFocused || isHappyCelebration ? (
                <g>
                  <circle cx={88} cy={76} r="6" fill="#2E1C0C" />
                  <circle cx={86.5} cy={74} r="2" fill="#FFFFFF" />
                  <circle cx={90} cy={78} r="1" fill="#FFFFFF" />

                  <circle cx={112} cy={76} r="6" fill="#2E1C0C" />
                  <circle cx={110.5} cy={74} r="2" fill="#FFFFFF" />
                  <circle cx={114} cy={78} r="1" fill="#FFFFFF" />
                </g>
              ) : (
                <motion.g
                  animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
                  transition={{
                    duration: 4.6,
                    times: [0, 0.9, 0.94, 0.98, 1],
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '100px 76px', transformBox: 'view-box' }}
                >
                  <circle cx={88} cy={76} r="5.5" fill="#2E1C0C" />
                  <circle cx={86.5} cy={74} r="2" fill="#FFFFFF" />
                  <circle cx={90} cy={77.5} r="0.9" fill="#FFFFFF" />

                  <circle cx={112} cy={76} r="5.5" fill="#2E1C0C" />
                  <circle cx={110.5} cy={74} r="2" fill="#FFFFFF" />
                  <circle cx={114} cy={77.5} r="0.9" fill="#FFFFFF" />
                </motion.g>
              )}

              {/* --- PAWS LOGIC --- */}
              {isPasswordFocused ? (
                <motion.g
                  initial={{ y: 8 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <ellipse cx="86" cy="74" rx="8" ry="7" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="86" cy="74" rx="3.5" ry="2.5" fill="#FFB7B2" />
                  <ellipse cx="114" cy="74" rx="8" ry="7" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="114" cy="74" rx="3.5" ry="2.5" fill="#FFB7B2" />
                </motion.g>
              ) : isHappyCelebration ? (
                <motion.g
                  animate={{ y: [-4, 2, -4] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ellipse cx="78" cy="68" rx="7" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="78" cy="67" rx="3" ry="2" fill="#FFB7B2" />
                  <ellipse cx="122" cy="68" rx="7" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="122" cy="67" rx="3" ry="2" fill="#FFB7B2" />
                </motion.g>
              ) : (
                <g>
                  <ellipse cx="82" cy="106" rx="7.5" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="82" cy="105" rx="3" ry="2.2" fill="#FFB7B2" />
                  <ellipse cx="118" cy="106" rx="7.5" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="118" cy="105" rx="3" ry="2.2" fill="#FFB7B2" />
                </g>
              )}
            </motion.g>

            {/* --- CARDBOARD BOX FRONT --- */}
            <rect x="52" y="105" width="96" height="56" rx="7" fill="url(#boxFrontGrad)" />

            {/* Box Front Panel Rim Shadow */}
            <line x1="52" y1="105" x2="148" y2="105" stroke="#9E6126" strokeWidth="2.5" />

            {/* Larger Centered White Parcel Paper Label with clean margins */}
            <rect
              x="59"
              y="115"
              width="82"
              height="37"
              rx="4.5"
              fill="#FFFFFF"
              fillOpacity="0.96"
              stroke="#E6D6C1"
              strokeWidth="0.7"
            />
            <text
              x="100"
              y="128.5"
              textAnchor="middle"
              fontSize="8.2"
              fontWeight="800"
              fill="#523112"
              fontFamily="Lexend, sans-serif"
            >
              RESOURCEBOX
            </text>
            <text
              x="100"
              y="138"
              textAnchor="middle"
              fontSize="5"
              fontWeight="600"
              fill="#945A25"
              fontFamily="Lexend, sans-serif"
            >
              RENT · SHARE · COMMUNITY
            </text>

            {/* Cute mini heart seal centered cleanly below subtitle without overlapping text */}
            <circle cx="100" cy="145.5" r="3.4" fill="#FF8A9E" fillOpacity="0.32" />
            <path d="M 100,147 L 98.4,145.3 A 1.05 1.05 0 0 1 100,144.2 A 1.05 1.05 0 0 1 101.6,145.3 Z" fill="#E11D48" />

            {/* Left and Right Angled Flaps */}
            <polygon points="52,105 28,118 42,132 52,116" fill="url(#flapGrad)" />
            <polygon points="148,105 172,118 158,132 148,116" fill="url(#flapGrad)" />
            <path d="M 52,105 L 66,116 L 134,116 L 148,105 Z" fill="url(#flapGrad)" />
          </svg>
        </div>

        {/* Floating Heart reaction when clicked */}
        <AnimatePresence>
          {clickCount > 0 && (
            <motion.div
              key={clickCount}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -35, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute -top-2 right-16 pointer-events-none text-rose-500 font-bold text-xs flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Purrr~</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

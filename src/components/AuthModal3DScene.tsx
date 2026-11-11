import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [randomMessageIndex, setRandomMessageIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle gentle mouse tracking for eye and head gaze
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleKittyClick = () => {
    setClickCount((c) => c + 1);
    // Cycle to a random cute message
    const nextIdx = Math.floor(Math.random() * CUTE_RANDOM_MESSAGES.length);
    setRandomMessageIndex(nextIdx);
  };

  // Determine the active message displayed in the cat's speech bubble
  const getCatMessage = () => {
    // 1. If user clicked the cat recently, show cute random message
    if (randomMessageIndex !== null && !focusedField && !isSubmitting && !isAwesome) {
      return CUTE_RANDOM_MESSAGES[randomMessageIndex];
    }

    // 2. Form submission / enter key ("awesome after enter")
    if (isAwesome || isSubmitting) {
      return "Awesome! Here we go! 🚀✨";
    }

    // 3. User focus states
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

    // 4. Default mode messages
    if (mode === 'signin') {
      return isHovered ? "Log in here! Happy to see you! 🐾" : "Log in here! 🐱";
    } else {
      return isHovered ? "Sign up here! Join our circle! 🎉" : "Sign up here! 📦";
    }
  };

  const activeMessage = getCatMessage();

  // Reset random message when user focuses on an input
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative w-full h-full min-h-[360px] md:min-h-[560px] bg-[#FFFFFF] flex flex-col items-center justify-center p-6 sm:p-8 select-none border-b md:border-b-0 md:border-r border-[#EFECE6] overflow-hidden"
    >
      {/* Soft warm background aura */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 35%, #FFFBF5 0%, #FAF8F5 65%, #F5F2EC 100%)',
        }}
      />

      {/* MAIN STAGE: Speech Bubble + Cute Kitty in Box */}
      <div className="relative z-10 my-auto w-full max-w-[280px] flex flex-col items-center justify-center">

        {/* 1. Dynamic Kawaii Speech Bubble */}
        <div className="relative w-full flex justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessage}
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
              className="relative px-4 py-2.5 rounded-2xl bg-white border border-[#E5DECF] shadow-[0_8px_20px_rgba(74,59,50,0.08)] text-center max-w-[260px]"
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
          className="relative w-64 h-56 flex items-center justify-center cursor-pointer group"
          title="Mochi loves pats!"
        >
          {/* Floor Soft Shadow */}
          <motion.div 
            animate={{
              scale: isHovered ? [1, 1.05, 1] : [1, 0.96, 1],
              opacity: isHovered ? 0.45 : 0.35,
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 w-44 h-7 rounded-full bg-[#3B2C24]/15 filter blur-xs"
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

            {/* --- KITTY HEAD, BODY & TAIL (Mochi - unified anatomical motion) --- */}
            <motion.g
              animate={{
                y: isHappyCelebration 
                  ? [-12, -22, -12] 
                  : isEmailFocused 
                  ? [-10, -14, -10] 
                  : isHovered 
                  ? [-6, -12, -6] 
                  : [0, 3, 0],
                rotate: isHappyCelebration 
                  ? [-4, 4, -4] 
                  : mousePos.x * 3,
                originX: '100px',
                originY: '100px',
              }}
              transition={{
                duration: isHappyCelebration ? 1.0 : isHovered ? 1.6 : 3.0,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Fluffy Tail connected seamlessly to the right flank */}
              <motion.g
                animate={{
                  rotate: isHovered || isHappyCelebration ? [-12, 16, -12] : [-5, 8, -5],
                  originX: '126px',
                  originY: '110px',
                }}
                transition={{
                  duration: isHovered ? 1.0 : 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <path
                  d="M 126,110 Q 164,102 162,76 Q 158,60 144,64"
                  fill="none"
                  stroke="url(#gingerPatches)"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 154,69 Q 152,62 144,64"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Body (drawn over the tail base so they are permanently seamlessly connected) */}
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

              {/* --- EYES LOGIC (Interactive based on focusedField) --- */}
              {isPasswordFocused ? (
                // When entering password: Happy peek-a-boo slit / squint
                <g>
                  <path d="M 83,76 Q 88,71 93,76" fill="none" stroke="#4A3425" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 107,76 Q 112,71 117,76" fill="none" stroke="#4A3425" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              ) : isEmailFocused || isHovered || isHappyCelebration ? (
                // Wide attentive sparkly eyes (Looking at input / mouse)
                <g>
                  {/* Left Eye */}
                  <circle cx={88 + mousePos.x * 2} cy={76 + mousePos.y * 2} r="6" fill="#2E1C0C" />
                  <circle cx={86.5 + mousePos.x * 2} cy={74 + mousePos.y * 2} r="2" fill="#FFFFFF" />
                  <circle cx={90 + mousePos.x * 2} cy={78 + mousePos.y * 2} r="1" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <circle cx={112 + mousePos.x * 2} cy={76 + mousePos.y * 2} r="6" fill="#2E1C0C" />
                  <circle cx={110.5 + mousePos.x * 2} cy={74 + mousePos.y * 2} r="2" fill="#FFFFFF" />
                  <circle cx={114 + mousePos.x * 2} cy={78 + mousePos.y * 2} r="1" fill="#FFFFFF" />
                </g>
              ) : (
                // Default Sweet Closed Sleeping/Purring Eyes (^ _ ^)
                <g>
                  <path d="M 83,77 Q 88,72 93,77" fill="none" stroke="#4A3425" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M 107,77 Q 112,72 117,77" fill="none" stroke="#4A3425" strokeWidth="2.4" strokeLinecap="round" />
                </g>
              )}

              {/* --- PAWS LOGIC (Paws over eyes for password, or resting on box) --- */}
              {isPasswordFocused ? (
                // Paws covering eyes playfully ("I won't peek! 🙈")
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
                // Paws in air celebrating ("Awesome!")
                <motion.g
                  animate={{ y: [-4, 2, -4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <ellipse cx="78" cy="68" rx="7" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="78" cy="67" rx="3" ry="2" fill="#FFB7B2" />
                  <ellipse cx="122" cy="68" rx="7" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="122" cy="67" rx="3" ry="2" fill="#FFB7B2" />
                </motion.g>
              ) : (
                // Resting paws over the front lip of the box
                <g>
                  <ellipse cx="82" cy="106" rx="7.5" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="82" cy="105" rx="3" ry="2.2" fill="#FFB7B2" />
                  <ellipse cx="118" cy="106" rx="7.5" ry="6" fill="#FFFFFF" stroke="#EAD8C3" strokeWidth="1" />
                  <ellipse cx="118" cy="105" rx="3" ry="2.2" fill="#FFB7B2" />
                </g>
              )}
            </motion.g>

            {/* --- CARDBOARD BOX FRONT --- */}
            {/* Box Main Body */}
            <rect x="52" y="105" width="96" height="56" rx="7" fill="url(#boxFrontGrad)" />

            {/* Box Front Panel Rim Shadow */}
            <line x1="52" y1="105" x2="148" y2="105" stroke="#9E6126" strokeWidth="2.5" />

            {/* Parcel Label */}
            <rect x="68" y="118" width="64" height="26" rx="4" fill="#FFFFFF" fillOpacity="0.9" />
            <text
              x="100"
              y="130"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="800"
              fill="#523112"
              fontFamily="Lexend, sans-serif"
            >
              RESOURCEBOX
            </text>
            <text
              x="100"
              y="139"
              textAnchor="middle"
              fontSize="5.5"
              fontWeight="600"
              fill="#945A25"
              fontFamily="Lexend, sans-serif"
            >
              RENT · SHARE · COMMUNITY
            </text>

            {/* Cute mini heart seal on parcel */}
            <circle cx="124" cy="131" r="3.5" fill="#FF8A9E" fillOpacity="0.4" />
            <path d="M 124,131 L 122.5,129.5 A 1 1 0 0 1 124,128.5 A 1 1 0 0 1 125.5,129.5 Z" fill="#E11D48" />

            {/* Left and Right Angled Flaps */}
            <polygon points="52,105 28,118 42,132 52,116" fill="url(#flapGrad)" />
            <polygon points="148,105 172,118 158,132 148,116" fill="url(#flapGrad)" />
            <path d="M 52,105 L 66,116 L 134,116 L 148,105 Z" fill="url(#flapGrad)" />
          </svg>
        </div>

        {/* Floating Heart / Sparkle reaction when clicked */}
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

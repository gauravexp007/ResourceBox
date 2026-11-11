import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Camera, 
  Gamepad2, 
  Wrench, 
  Headphones, 
  Tent, 
  Leaf,
  ShieldCheck,
  RefreshCw,
  Gift
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AuthModal3DSceneProps {
  mode: 'signin' | 'signup';
}

export const AuthModal3DScene: React.FC<AuthModal3DSceneProps> = ({ mode }) => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover and interaction states
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [purrCount, setPurrCount] = useState(0);

  // Mouse tracking normalized (-1 to 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handlePetKitty = () => {
    setIsClicked(true);
    setPurrCount((prev) => prev + 1);
    setTimeout(() => setIsClicked(false), 900);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative w-full h-full min-h-[400px] md:min-h-[580px] flex flex-col justify-between p-6 sm:p-7 overflow-hidden select-none border-b md:border-b-0 md:border-r transition-all duration-700"
      style={{
        background: `radial-gradient(ellipse 130% 110% at 50% 15%, color-mix(in srgb, ${currentTheme.deep} 92%, #140924) 0%, color-mix(in srgb, ${currentTheme.deep} 98%, black) 75%, #080310 100%)`,
        borderColor: `color-mix(in srgb, ${currentTheme.accent} 25%, transparent)`,
      }}
    >
      {/* Dynamic Ambient Background Glow following cursor */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none filter blur-3xl opacity-35 transition-all duration-300 ease-out"
        style={{
          left: `calc(50% + ${mousePos.x * 70}px - 160px)`,
          top: `calc(50% + ${mousePos.y * 70}px - 160px)`,
          background: `radial-gradient(circle, ${currentTheme.accent} 0%, ${currentTheme.primary} 45%, transparent 70%)`,
        }}
      />

      {/* Decorative Kawaii Dot Matrix Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${currentTheme.accent} 1.2px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Banner: Status & Interactive hint */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs"
          style={{
            background: 'rgba(255, 255, 255, 0.09)',
            borderColor: `color-mix(in srgb, ${currentTheme.accent} 35%, transparent)`,
            color: '#FFFFFF',
          }}
        >
          <span className="text-sm">🐾</span>
          <span className="font-['Lexend'] tracking-wide">
            {isHovered ? 'Mochi is awake & excited!' : 'Mochi is guarding the box...'}
          </span>
        </motion.div>

        <div className="flex items-center gap-1.5 text-[11px] text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
          <Leaf className="w-3 h-3 text-emerald-400" />
          <span>Zero Waste</span>
        </div>
      </div>

      {/* CENTER STAGE: 2D Animated Cute Kitty in ResourceBox */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center">
        
        {/* Clickable / Interactive Kitty & Box Unit */}
        <div 
          onClick={handlePetKitty}
          className="relative w-72 h-72 flex items-center justify-center cursor-pointer group"
          title="Click to pet Mochi the ResourceBox cat!"
        >

          {/* Floating Zzz Sleepy Bubbles (When idle / sleeping) */}
          <AnimatePresence>
            {!isHovered && (
              <div className="absolute -top-4 right-12 z-30 pointer-events-none flex flex-col items-center">
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{ opacity: [0, 0.9, 0], y: [-5, -28], x: [0, 8] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
                  className="text-xs font-bold font-mono text-purple-200"
                >
                  Z
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{ opacity: [0, 0.9, 0], y: [-2, -22], x: [0, -6] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
                  className="text-[10px] font-bold font-mono text-purple-300"
                >
                  z
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{ opacity: [0, 0.9, 0], y: [0, -16], x: [0, 4] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 1.6 }}
                  className="text-[8px] font-bold font-mono text-purple-400"
                >
                  z
                </motion.span>
              </div>
            )}
          </AnimatePresence>

          {/* Alert Pop Exclamation & Hearts (When hovered or clicked) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -20 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-6 right-10 z-30 pointer-events-none flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/90 text-white text-[11px] font-bold shadow-lg backdrop-blur-md"
              >
                <Heart className="w-3 h-3 fill-white animate-pulse" />
                <span>{isClicked ? 'Purrr! ♥' : 'Meow! ✨'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- SATELLITE FLOATING RESOURCE BUBBLES --- */}
          {/* 1. Camera Bubble (Top Left) */}
          <motion.div
            animate={{
              y: isHovered ? [-8, 4, -8] : [0, -10, 0],
              x: isHovered ? mousePos.x * 14 - 15 : [0, 4, 0],
              rotate: isHovered ? [0, -8, 8, 0] : [0, 4, 0],
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{
              y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-2 -left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-500/80 flex items-center justify-center shadow-xs">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-sky-200">Sony Rig</span>
          </motion.div>

          {/* 2. Gaming Controller Bubble (Top Right) */}
          <motion.div
            animate={{
              y: isHovered ? [6, -8, 6] : [-5, 6, -5],
              x: isHovered ? mousePos.x * 16 + 15 : [0, -5, 0],
              rotate: isHovered ? [0, 10, -10, 0] : [0, -5, 0],
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              x: { duration: 4.0, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-1 -right-4 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-purple-500/80 flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-purple-200">PlayStation</span>
          </motion.div>

          {/* 3. Power Tools Bubble (Bottom Left) */}
          <motion.div
            animate={{
              y: isHovered ? [4, -6, 4] : [6, -4, 6],
              x: isHovered ? mousePos.x * -12 - 10 : [-2, 3, -2],
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
              x: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute bottom-6 -left-4 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/80 flex items-center justify-center shadow-xs">
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-amber-200">Rotary Tool</span>
          </motion.div>

          {/* 4. Headphones Bubble (Bottom Right) */}
          <motion.div
            animate={{
              y: isHovered ? [-6, 6, -6] : [-3, 7, -3],
              x: isHovered ? mousePos.x * 14 + 10 : [3, -2, 3],
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              y: { duration: 3.0, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
              x: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute bottom-5 -right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/80 flex items-center justify-center shadow-xs">
              <Headphones className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-emerald-200">Studio Audio</span>
          </motion.div>

          {/* --- MAIN 2D VECTOR ILLUSTRATION: KITTY & BOX --- */}
          <div className="relative w-56 h-56 flex items-center justify-center">

            {/* Pedestal Floor Glow Shadow */}
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.08, 1] : [1, 0.95, 1],
                opacity: isHovered ? 0.7 : 0.45,
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 w-44 h-8 rounded-full filter blur-md"
              style={{
                background: `radial-gradient(ellipse, ${currentTheme.primary} 0%, rgba(0,0,0,0.6) 70%)`,
              }}
            />

            {/* SVG Illustration Container */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full overflow-visible transition-transform duration-300"
              style={{
                transform: `rotate(${mousePos.x * 3}deg) translateY(${mousePos.y * 3}px)`,
              }}
            >
              <defs>
                {/* Box Gradients */}
                <linearGradient id="boxOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#E5A663" />
                  <stop offset="100%" stop-color="#BA7A38" />
                </linearGradient>

                <linearGradient id="boxInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#8C5320" />
                  <stop offset="100%" stop-color="#593211" />
                </linearGradient>

                <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F2BC7E" />
                  <stop offset="100%" stop-color="#D69149" />
                </linearGradient>

                {/* Kitty Fur Gradient */}
                <linearGradient id="kittyFur" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#FFFDF9" />
                  <stop offset="100%" stop-color="#FCEFD8" />
                </linearGradient>

                <linearGradient id="tabbyPatches" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFAE52" />
                  <stop offset="100%" stop-color="#E88A23" />
                </linearGradient>
              </defs>

              {/* Back Box Flap */}
              <polygon points="58,110 74,86 126,86 142,110" fill="#B07133" opacity="0.9" />

              {/* Inside Box Cavity */}
              <rect x="58" y="108" width="84" height="25" rx="4" fill="url(#boxInnerGrad)" />

              {/* Fluffy Kitty Tail (Peeking out behind box and swishing!) */}
              <motion.g
                animate={{
                  rotate: isHovered ? [-25, 20, -25] : [-8, 12, -8],
                  originX: '150px',
                  originY: '130px',
                }}
                transition={{
                  duration: isHovered ? 1.2 : 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Curved tail path */}
                <path
                  d="M 144,124 Q 170,118 166,94 Q 164,80 152,82"
                  fill="none"
                  stroke="url(#tabbyPatches)"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* White fluffy tail tip */}
                <path
                  d="M 160,86 Q 158,80 152,82"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* --- CUTE KITTY BODY & HEAD (Mochi) --- */}
              <motion.g
                animate={{
                  // Gentle rhythmic breathing roll when resting, excited stretch & head-bob when hovered
                  y: isHovered ? [-8, -16, -8] : [0, 4, 0],
                  rotate: isHovered ? [-4, 4, -4] : [-1.5, 1.5, -1.5],
                  originX: '100px',
                  originY: '110px',
                }}
                transition={{
                  duration: isHovered ? 1.8 : 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Kitty Body in box */}
                <ellipse cx="100" cy="116" rx="36" ry="24" fill="url(#kittyFur)" />

                {/* Left Ear */}
                <polygon points="76,82 66,54 90,68" fill="url(#kittyFur)" stroke="#F2E0C4" strokeWidth="1" />
                <polygon points="77,80 70,59 88,69" fill="#FFB7B2" />

                {/* Right Ear */}
                <polygon points="124,82 134,54 110,68" fill="url(#kittyFur)" stroke="#F2E0C4" strokeWidth="1" />
                <polygon points="123,80 130,59 112,69" fill="#FFB7B2" />

                {/* Kitty Chubby Head */}
                <ellipse cx="100" cy="88" rx="32" ry="26" fill="url(#kittyFur)" />

                {/* Cute Tabby Patch on Forehead / Ear */}
                <path d="M 88,64 Q 100,74 112,64 Q 100,68 88,64 Z" fill="url(#tabbyPatches)" />
                <path d="M 68,66 Q 78,74 76,82 Q 70,74 68,66 Z" fill="url(#tabbyPatches)" />

                {/* Cheeks - Rosy Pink Blushing */}
                <motion.ellipse
                  animate={{ opacity: isHovered ? [0.85, 1, 0.85] : 0.45 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  cx="77"
                  cy="94"
                  rx="6"
                  ry="4"
                  fill="#FF8A9E"
                />
                <motion.ellipse
                  animate={{ opacity: isHovered ? [0.85, 1, 0.85] : 0.45 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  cx="123"
                  cy="94"
                  rx="6"
                  ry="4"
                  fill="#FF8A9E"
                />

                {/* Whiskers */}
                {/* Left whiskers */}
                <line x1="68" y1="92" x2="52" y2="90" stroke="#E0C6A8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="68" y1="96" x2="54" y2="98" stroke="#E0C6A8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Right whiskers */}
                <line x1="132" y1="92" x2="148" y2="90" stroke="#E0C6A8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="132" y1="96" x2="146" y2="98" stroke="#E0C6A8" strokeWidth="1.5" strokeLinecap="round" />

                {/* Cute Pink Triangle Nose */}
                <polygon points="98,90 102,90 100,93" fill="#FF8A9E" />

                {/* W-Shaped Kawaii Mouth */}
                <path
                  d="M 95,94 Q 97.5,97 100,94 Q 102.5,97 105,94"
                  fill="none"
                  stroke="#5A3A1E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* EYES: Sleek Sleeping Arcs (Idle) VS Huge Sparkly Kawaii Eyes (Hovered) */}
                {!isHovered ? (
                  // Sleeping curved eyes (^ _ ^)
                  <g>
                    <path
                      d="M 83,86 Q 89,80 93,86"
                      fill="none"
                      stroke="#5A3A1E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 107,86 Q 111,80 117,86"
                      fill="none"
                      stroke="#5A3A1E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </g>
                ) : (
                  // Awake Big Sparkly Eyes (● _ ●) with specular stars & mouse gaze
                  <g>
                    {/* Left Eye */}
                    <circle cx={88 + mousePos.x * 2} cy={85 + mousePos.y * 2} r="6.5" fill="#2E1C0C" />
                    <circle cx={86.5 + mousePos.x * 2} cy={83 + mousePos.y * 2} r="2.2" fill="#FFFFFF" />
                    <circle cx={90.5 + mousePos.x * 2} cy={87 + mousePos.y * 2} r="1.1" fill="#FFFFFF" />

                    {/* Right Eye */}
                    <circle cx={112 + mousePos.x * 2} cy={85 + mousePos.y * 2} r="6.5" fill="#2E1C0C" />
                    <circle cx={110.5 + mousePos.x * 2} cy={83 + mousePos.y * 2} r="2.2" fill="#FFFFFF" />
                    <circle cx={114.5 + mousePos.x * 2} cy={87 + mousePos.y * 2} r="1.1" fill="#FFFFFF" />
                  </g>
                )}

                {/* Cute Front Paws resting over box lip */}
                <motion.g
                  animate={{
                    y: isHovered ? [-1, 2, -1] : [0, 0.5, 0],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Left Paw */}
                  <ellipse cx="84" cy="113" rx="7" ry="6" fill="#FFFFFF" stroke="#E5CEB0" strokeWidth="1" />
                  <ellipse cx="84" cy="112" rx="3" ry="2.2" fill="#FFB7B2" />
                  {/* Right Paw */}
                  <ellipse cx="116" cy="113" rx="7" ry="6" fill="#FFFFFF" stroke="#E5CEB0" strokeWidth="1" />
                  <ellipse cx="116" cy="112" rx="3" ry="2.2" fill="#FFB7B2" />
                </motion.g>
              </motion.g>

              {/* --- FRONT OF CARDBOARD BOX --- */}
              {/* Box Body */}
              <rect x="54" y="112" width="92" height="58" rx="8" fill="url(#boxOuterGrad)" />

              {/* Box Front Panel Shadow Crease */}
              <line x1="54" y1="112" x2="146" y2="112" stroke="#8A511C" strokeWidth="2.5" />

              {/* Cute ResourceBox Label & Stamp */}
              <rect x="68" y="126" width="64" height="26" rx="5" fill="#FFFFFF" fillOpacity="0.85" />
              <text
                x="100"
                y="138"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="800"
                fill="#593211"
                fontFamily="Lexend, sans-serif"
              >
                RESOURCEBOX
              </text>
              <text
                x="100"
                y="147"
                textAnchor="middle"
                fontSize="5.5"
                fontWeight="600"
                fill="#9B622A"
                fontFamily="Lexend, sans-serif"
              >
                RENT & SHARE HUB
              </text>

              {/* Heart Stamp on Box */}
              <circle cx="124" cy="139" r="4" fill="#FF8A9E" fillOpacity="0.3" />
              <path d="M 124,138 L 122.5,136.5 A 1 1 0 0 1 124,135.5 A 1 1 0 0 1 125.5,136.5 Z" fill="#E11D48" />

              {/* Left Open Flap */}
              <polygon points="54,112 30,126 44,142 54,124" fill="url(#flapGrad)" />

              {/* Right Open Flap */}
              <polygon points="146,112 170,126 156,142 146,124" fill="url(#flapGrad)" />

              {/* Front Lip Flap Fold */}
              <path d="M 54,112 L 68,124 L 132,124 L 146,112 Z" fill="url(#flapGrad)" />
            </svg>

          </div>

          {/* Floating Sparkle Stars around kitty */}
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.3, 1] : [0.7, 1, 0.7],
              rotate: [0, 90, 180, 270, 360],
              opacity: isHovered ? 0.9 : 0.4,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute top-14 left-8 text-amber-300 pointer-events-none"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.4, 1] : [0.6, 1, 0.6],
              rotate: [360, 270, 180, 90, 0],
              opacity: isHovered ? 0.9 : 0.35,
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-14 right-8 text-pink-300 pointer-events-none"
          >
            ✧
          </motion.div>
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-10 right-20 text-emerald-300 pointer-events-none text-xs"
          >
            ★
          </motion.div>

        </div>

        {/* Hover / Tap Interaction Prompt */}
        <p className="text-[11px] text-white/75 font-medium mt-1 flex items-center gap-1.5 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>
            {isHovered ? 'Hover around to play with Mochi!' : 'Hover or tap to awaken Mochi & resources'}
          </span>
        </p>
      </div>

      {/* BOTTOM TRUST CARDS: Circular Economy & Neighbor Charter */}
      <div className="relative z-10 space-y-2.5 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">100% Escrow Security</span>
          </div>
          <span className="text-[11px] text-white/60">Peer-to-Peer</span>
        </div>

        <p className="text-[11px] text-white/70 leading-relaxed font-light font-['Lexend']">
          Share power tools, camping gear, and cameras with neighbors. Earn money on idle items, or swap for what you need today.
        </p>

        {/* Micro-Features */}
        <div className="flex items-center gap-2 pt-0.5">
          <div 
            className="flex-1 py-1 px-2.5 rounded-xl border text-[10px] font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
            }}
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span>Direct Swap</span>
          </div>

          <div 
            className="flex-1 py-1 px-2.5 rounded-xl border text-[10px] font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
            }}
          >
            <Gift className="w-3 h-3 text-pink-400" />
            <span>Rent & Earn</span>
          </div>
        </div>
      </div>

    </div>
  );
};

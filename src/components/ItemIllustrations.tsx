import React from 'react';

// Crisp, high-fidelity SVG graphics for community items
export const ItemGraphics = {
  // 1. Pro DSLR / Mirrorless Camera
  Camera: () => (
    <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="camBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2c3036" />
          <stop offset="100%" stopColor="#14171a" />
        </linearGradient>
        <radialGradient id="camLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d233a" />
          <stop offset="65%" stopColor="#050b12" />
          <stop offset="100%" stopColor="#2a3b4c" />
        </radialGradient>
        <linearGradient id="lensRing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="15" y="28" width="90" height="62" rx="10" fill="url(#camBody)" stroke="#3f454d" strokeWidth="1.5" />
      {/* Grip */}
      <rect x="85" y="32" width="16" height="54" rx="6" fill="#1b1e22" />
      <line x1="88" y1="40" x2="98" y2="40" stroke="#2d3238" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="48" x2="98" y2="48" stroke="#2d3238" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="56" x2="98" y2="56" stroke="#2d3238" strokeWidth="2" strokeLinecap="round" />
      {/* Prism Viewfinder */}
      <polygon points="40,28 50,15 70,15 80,28" fill="#1e2226" />
      <rect x="52" y="10" width="16" height="5" rx="1.5" fill="#4b5563" />
      {/* Top Dials & Shutter */}
      <rect x="22" y="22" width="14" height="6" rx="2" fill="url(#lensRing)" />
      <rect x="80" y="23" width="10" height="5" rx="2" fill="#ef4444" />
      {/* Lens Barrel */}
      <circle cx="52" cy="59" r="32" fill="#1f2327" stroke="#374151" strokeWidth="2" />
      <circle cx="52" cy="59" r="28" fill="url(#lensRing)" />
      <circle cx="52" cy="59" r="25" fill="#111827" />
      <circle cx="52" cy="59" r="22" fill="url(#camLens)" />
      {/* Red ring accent (L-series) */}
      <circle cx="52" cy="59" r="27.5" fill="none" stroke="#ef4444" strokeWidth="1" />
      {/* Specular flare */}
      <ellipse cx="44" cy="51" rx="8" ry="4" transform="rotate(-30 44 51)" fill="#60a5fa" opacity="0.45" />
      <circle cx="58" cy="65" r="3" fill="#ffffff" opacity="0.6" />
    </svg>
  ),

  // 2. Acoustic Sunburst Guitar
  Guitar: () => (
    <svg viewBox="0 0 70 140" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <radialGradient id="sunburst" cx="50%" cy="75%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#381404" />
        </radialGradient>
        <linearGradient id="rosewood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2c1206" />
          <stop offset="50%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#2c1206" />
        </linearGradient>
      </defs>

      {/* Acoustic Body: Symmetrical Hourglass with Curved Lower & Upper Bouts */}
      <path
        d="M 23 72 C 12 76 10 92 20 102 C 11 112 11 133 26 137 C 44 139 58 135 60 120 C 61 111 51 103 50 102 C 60 92 58 76 47 72 C 39 68 31 68 23 72 Z"
        fill="url(#sunburst)"
        stroke="#270e02"
        strokeWidth="1.5"
      />

      {/* Soundhole with Rosette Rings */}
      <circle cx="35" cy="93" r="12" fill="#140601" stroke="#fde047" strokeWidth="1.2" />
      <circle cx="35" cy="93" r="14" fill="none" stroke="#ea580c" strokeWidth="0.75" />

      {/* Tortoiseshell Pickguard */}
      <path
        d="M 37 92 C 45 92 48 99 47 106 C 44 112 37 112 37 105 Z"
        fill="#260b02"
        opacity="0.85"
      />

      {/* Bridge with Saddle & 6 Bridge Pins */}
      <rect x="25" y="118" width="20" height="7" rx="2.5" fill="#2d1204" stroke="#170802" strokeWidth="0.8" />
      <rect x="27" y="119" width="16" height="2" rx="0.5" fill="#f8fafc" />
      {[28, 30.5, 33, 35.5, 38, 40.5].map((px, i) => (
        <circle key={i} cx={px} cy="122.5" r="0.9" fill="#fef08a" />
      ))}

      {/* Mahogany Neck running seamlessly into soundhole */}
      <rect x="30" y="24" width="10" height="62" rx="1" fill="url(#rosewood)" stroke="#1a0a03" strokeWidth="0.8" />

      {/* 9 Fret Wires */}
      {[31, 38, 45, 52, 59, 66, 73, 79, 84].map((fy, i) => (
        <line key={i} x1="30" y1={fy} x2="40" y2={fy} stroke="#cbd5e1" strokeWidth="0.75" />
      ))}

      {/* Pearlescent Fret Marker Inlays */}
      <circle cx="35" cy="48.5" r="0.9" fill="#f8fafc" />
      <circle cx="35" cy="62.5" r="0.9" fill="#f8fafc" />
      <circle cx="33.5" cy="76" r="0.8" fill="#f8fafc" />
      <circle cx="36.5" cy="76" r="0.8" fill="#f8fafc" />

      {/* Bone Nut */}
      <rect x="29.5" y="23" width="11" height="2" rx="0.5" fill="#f8fafc" />

      {/* Headstock & Tuning Peg Posts */}
      <polygon points="28,2 42,2 44,23 26,23" fill="#451a03" stroke="#220b02" strokeWidth="1" />
      
      {/* 6 Chrome Tuning Pegs with Solid Shafts */}
      {/* Left 3 */}
      <line x1="28" y1="6" x2="21" y2="6" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="20" cy="6" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />
      <line x1="27.5" y1="12" x2="21" y2="12" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="20" cy="12" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />
      <line x1="27" y1="18" x2="21" y2="18" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="20" cy="18" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />
      
      {/* Right 3 */}
      <line x1="42" y1="6" x2="49" y2="6" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="50" cy="6" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />
      <line x1="42.5" y1="12" x2="49" y2="12" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="50" cy="12" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />
      <line x1="43" y1="18" x2="49" y2="18" stroke="#94a3b8" strokeWidth="1.2" />
      <ellipse cx="50" cy="18" rx="2" ry="3.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6" />

      {/* 6 Full Metallic Strings from Bridge Saddle to Nut */}
      <line x1="32" y1="23" x2="28" y2="119" stroke="#f1f5f9" strokeWidth="0.8" opacity="0.95" />
      <line x1="33.2" y1="23" x2="30.5" y2="119" stroke="#f1f5f9" strokeWidth="0.75" opacity="0.9" />
      <line x1="34.4" y1="23" x2="33" y2="119" stroke="#f1f5f9" strokeWidth="0.7" opacity="0.9" />
      <line x1="35.6" y1="23" x2="35.5" y2="119" stroke="#f8fafc" strokeWidth="0.65" opacity="0.85" />
      <line x1="36.8" y1="23" x2="38" y2="119" stroke="#f8fafc" strokeWidth="0.6" opacity="0.85" />
      <line x1="38" y1="23" x2="40.5" y2="119" stroke="#f8fafc" strokeWidth="0.55" opacity="0.85" />
    </svg>
  ),

  // 3. PlayStation 5 Console
  PS5: () => (
    <svg viewBox="0 0 65 130" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="ps5White" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="ps5Black" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2429" />
          <stop offset="100%" stopColor="#090a0c" />
        </linearGradient>
      </defs>
      {/* Left White Curved Wing */}
      <path
        d="M 16 10 C 14 3 24 5 24 18 L 24 116 C 24 124 14 125 15 120 L 15 10 Z"
        fill="url(#ps5White)"
        stroke="#d1d5db"
        strokeWidth="1"
      />
      {/* Center Black Gloss Core */}
      <rect x="23" y="15" width="16" height="104" rx="3" fill="url(#ps5Black)" />
      {/* Glowing Blue LED Stripe */}
      <line x1="24.5" y1="18" x2="24.5" y2="112" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right White Curved Wing */}
      <path
        d="M 46 10 C 48 3 38 5 38 18 L 38 116 C 38 124 48 125 47 120 L 47 10 Z"
        fill="url(#ps5White)"
        stroke="#d1d5db"
        strokeWidth="1"
      />
      {/* Disc Drive Slot */}
      <rect x="39" y="85" width="4" height="28" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
      {/* Stand Base */}
      <ellipse cx="31" cy="122" rx="18" ry="5" fill="#111827" />
    </svg>
  ),

  // 4. Over-Ear Wireless Headphones
  Headphones: () => (
    <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="hpHeadband" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>
      {/* Headband Arc */}
      <path
        d="M 22 68 C 18 20 82 20 78 68"
        fill="none"
        stroke="url(#hpHeadband)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Soft Cushion inner band */}
      <path
        d="M 28 62 C 26 28 74 28 72 62"
        fill="none"
        stroke="#111827"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Metal Sliders */}
      <rect x="17" y="60" width="7" height="15" rx="2" fill="#9ca3af" />
      <rect x="76" y="60" width="7" height="15" rx="2" fill="#9ca3af" />
      {/* Left Ear Cup */}
      <g transform="rotate(8 20 85)">
        <ellipse cx="20" cy="85" rx="14" ry="20" fill="#111827" stroke="#374151" strokeWidth="1.5" />
        <ellipse cx="20" cy="85" rx="10" ry="16" fill="#1f2937" />
        <circle cx="20" cy="85" r="5" fill="#10b981" opacity="0.8" />
      </g>
      {/* Right Ear Cup */}
      <g transform="rotate(-8 80 85)">
        <ellipse cx="80" cy="85" rx="14" ry="20" fill="#111827" stroke="#374151" strokeWidth="1.5" />
        <ellipse cx="80" cy="85" rx="10" ry="16" fill="#1f2937" />
        <circle cx="80" cy="85" r="5" fill="#10b981" opacity="0.8" />
      </g>
    </svg>
  ),

  // 5. Open Laptop with Vibrant Display
  Laptop: () => (
    <svg viewBox="0 0 120 95" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="laptopBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      {/* Open Screen Lid */}
      <rect x="20" y="8" width="80" height="54" rx="4" fill="#1f2429" stroke="#9ca3af" strokeWidth="1.5" />
      {/* Screen Display */}
      <rect x="24" y="12" width="72" height="46" rx="2" fill="url(#laptopScreen)" />
      {/* Mountain Wallpaper graphic */}
      <polygon points="24,58 48,34 68,52 82,38 96,58" fill="#1e1b4b" opacity="0.75" />
      <circle cx="80" cy="24" r="6" fill="#fde047" opacity="0.9" />
      {/* Keyboard Base Deck */}
      <polygon points="8,76 112,76 98,62 22,62" fill="url(#laptopBody)" stroke="#6b7280" strokeWidth="1" />
      {/* Recessed Keyboard */}
      <polygon points="26,71 94,71 88,64 32,64" fill="#1f2937" />
      {/* Trackpad */}
      <polygon points="50,75 70,75 68,72 52,72" fill="#d1d5db" />
      {/* Front edge lip */}
      <rect x="8" y="76" width="104" height="4" rx="2" fill="#6b7280" />
    </svg>
  ),

  // 6. Mechanical RGB Keyboard
  Keyboard: () => (
    <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="rgbFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="75%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Chassis */}
      <rect x="6" y="8" width="108" height="44" rx="5" fill="#181d24" stroke="#2e3744" strokeWidth="1.5" />
      {/* Keycaps Grid with RGB Backlight glow */}
      <rect x="10" y="12" width="100" height="36" rx="3" fill="#0f1216" stroke="url(#rgbFlow)" strokeWidth="1.2" />
      {/* Key rows */}
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          {[...Array(11)].map((_, col) => {
            const isEsc = row === 0 && col === 0;
            const isSpace = row === 3 && col >= 3 && col <= 7;
            if (row === 3 && col > 3 && col <= 7) return null; // Spacebar span
            return (
              <rect
                key={col}
                x={13 + col * 8.6}
                y={15 + row * 8.2}
                width={isSpace ? 40 : 7}
                height={6.4}
                rx={1.5}
                fill={isEsc ? '#ef4444' : isSpace ? '#10b981' : '#374151'}
                stroke="#4b5563"
                strokeWidth="0.5"
              />
            );
          })}
        </g>
      ))}
    </svg>
  ),

  // 7. Nintendo Switch Handheld Console
  SwitchConsole: () => (
    <svg viewBox="0 0 110 50" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Left Neon Blue/Green Joy-Con */}
      <path d="M 6 10 C 6 6 12 5 22 5 L 22 45 C 12 45 6 44 6 40 Z" fill="#06b6d4" />
      <circle cx="14" cy="18" r="4" fill="#1f2937" />
      <rect x="11" y="27" width="6" height="6" rx="1" fill="#111827" />
      <circle cx="14" cy="38" r="2" fill="#111827" />

      {/* Center Black Tablet & Screen */}
      <rect x="22" y="5" width="66" height="40" fill="#111827" stroke="#1f2937" strokeWidth="1" />
      <rect x="26" y="8" width="58" height="34" rx="2" fill="#1e293b" />
      <circle cx="55" cy="25" r="8" fill="#3b82f6" opacity="0.3" />

      {/* Right Neon Red/Coral Joy-Con */}
      <path d="M 88 5 L 98 5 C 104 5 104 10 104 10 L 104 40 C 104 44 98 45 88 45 Z" fill="#f43f5e" />
      <circle cx="96" cy="16" r="2.5" fill="#111827" />
      <circle cx="92" cy="20" r="2.5" fill="#111827" />
      <circle cx="100" cy="20" r="2.5" fill="#111827" />
      <circle cx="96" cy="24" r="2.5" fill="#111827" />
      <circle cx="96" cy="33" r="4" fill="#1f2937" />
    </svg>
  ),

  // 8. Crisp White Streetwear Sneaker
  Sneaker: () => (
    <svg viewBox="0 0 110 65" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Chunky Sole */}
      <path
        d="M 12 52 C 25 54 85 54 98 50 C 102 48 102 44 98 44 C 70 45 35 44 14 46 C 8 47 8 51 12 52 Z"
        fill="#f3f4f6"
        stroke="#d1d5db"
        strokeWidth="1.5"
      />
      {/* Air cushion accent */}
      <rect x="25" y="47" width="16" height="4" rx="2" fill="#60a5fa" opacity="0.7" />
      {/* Shoe Upper */}
      <path
        d="M 14 46 C 12 36 22 24 35 24 C 42 24 50 32 65 35 C 80 37 96 42 98 44 C 95 44 30 44 14 46 Z"
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth="1.2"
      />
      {/* Tongue & Laces */}
      <path d="M 40 22 C 45 16 52 24 56 32" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="43" y1="26" x2="49" y2="28" stroke="#374151" strokeWidth="1.5" />
      <line x1="46" y1="30" x2="52" y2="32" stroke="#374151" strokeWidth="1.5" />
      <line x1="49" y1="34" x2="55" y2="36" stroke="#374151" strokeWidth="1.5" />
      {/* Swoosh / Wave Stripe */}
      <path
        d="M 28 36 C 45 38 60 44 80 39"
        fill="none"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Heel Tab */}
      <rect x="16" y="26" width="6" height="12" rx="2" fill="#10b981" />
    </svg>
  ),

  // 9. Stack of 3 Hardcover Books
  Books: () => (
    <svg viewBox="0 0 90 70" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Book 1 (Bottom, Emerald Green) */}
      <g transform="translate(4, 38)">
        <polygon points="4,16 78,16 72,2 0,2" fill="#15803d" stroke="#166534" strokeWidth="1" />
        <rect x="0" y="2" width="7" height="14" rx="2" fill="#14532d" />
        <polygon points="7,14 74,14 71,4 7,4" fill="#fef3c7" />
      </g>
      {/* Book 2 (Middle, Royal Blue, slightly angled) */}
      <g transform="translate(6, 20) rotate(-3)">
        <polygon points="4,16 76,16 70,2 0,2" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1" />
        <rect x="0" y="2" width="7" height="14" rx="2" fill="#1e3a8a" />
        <polygon points="7,14 72,14 69,4 7,4" fill="#fef3c7" />
        <line x1="16" y1="9" x2="40" y2="9" stroke="#fbbf24" strokeWidth="1.5" />
      </g>
      {/* Book 3 (Top, Amber/Orange) */}
      <g transform="translate(10, 4) rotate(4)">
        <polygon points="4,15 72,15 67,2 0,2" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
        <rect x="0" y="2" width="6" height="13" rx="2" fill="#9a3412" />
        <polygon points="6,13 68,13 65,4 6,4" fill="#fffbeb" />
        {/* Ribbon Bookmark */}
        <path d="M 60 4 L 60 18 L 63 15 L 66 18 L 66 4" fill="#ef4444" />
      </g>
    </svg>
  ),

  // 10. Wireless Gamepad Controller
  Gamepad: () => (
    <svg viewBox="0 0 90 65" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Main Body with Handgrips */}
      <path
        d="M 22 15 C 32 12 58 12 68 15 C 78 18 86 35 80 54 C 77 60 70 60 66 52 L 60 38 C 50 42 40 42 30 38 L 24 52 C 20 60 13 60 10 54 C 4 35 12 18 22 15 Z"
        fill="#1f2937"
        stroke="#374151"
        strokeWidth="1.5"
      />
      {/* D-Pad */}
      <polygon points="24,24 28,24 28,20 32,20 32,24 36,24 36,28 32,28 32,32 28,32 28,28 24,28" fill="#4b5563" />
      {/* Thumbsticks */}
      <circle cx="35" cy="38" r="7" fill="#111827" stroke="#4b5563" strokeWidth="1" />
      <circle cx="55" cy="38" r="7" fill="#111827" stroke="#4b5563" strokeWidth="1" />
      {/* Action Buttons */}
      <circle cx="66" cy="22" r="2.5" fill="#ef4444" />
      <circle cx="60" cy="26" r="2.5" fill="#3b82f6" />
      <circle cx="72" cy="26" r="2.5" fill="#10b981" />
      <circle cx="66" cy="30" r="2.5" fill="#f59e0b" />
      {/* Center glowing logo */}
      <circle cx="45" cy="20" r="3.5" fill="#10b981" opacity="0.9" />
    </svg>
  ),

  // 11. Smartwatch
  Smartwatch: () => (
    <svg viewBox="0 0 50 85" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Silicone Band */}
      <rect x="15" y="2" width="20" height="25" rx="3" fill="#374151" />
      <rect x="15" y="58" width="20" height="25" rx="3" fill="#374151" />
      {/* Watch Case */}
      <rect x="9" y="20" width="32" height="42" rx="8" fill="#111827" stroke="#4b5563" strokeWidth="1.5" />
      {/* Display Screen with Activity Rings */}
      <rect x="12" y="23" width="26" height="36" rx="6" fill="#030712" />
      <circle cx="25" cy="41" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="50 15" />
      <circle cx="25" cy="41" r="7" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="35 15" />
      <circle cx="25" cy="41" r="4" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="20 10" />
      {/* Digital Crown */}
      <rect x="41" y="28" width="2.5" height="8" rx="1" fill="#9ca3af" />
    </svg>
  ),

  // 12. Smartphone
  Smartphone: () => (
    <svg viewBox="0 0 55 95" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <defs>
        <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Metal Chassis */}
      <rect x="4" y="4" width="47" height="87" rx="8" fill="#1f2937" stroke="#6b7280" strokeWidth="1.2" />
      {/* Screen */}
      <rect x="6" y="6" width="43" height="83" rx="6" fill="url(#phoneScreen)" />
      {/* Dynamic Island Pill */}
      <rect x="20" y="9" width="15" height="4" rx="2" fill="#000000" />
      {/* Wallpaper Glow */}
      <circle cx="27" cy="50" r="14" fill="#10b981" opacity="0.3" />
    </svg>
  ),

  // 13. Adventure Backpack
  Backpack: () => (
    <svg viewBox="0 0 75 90" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Top Handle */}
      <path d="M 30 14 C 30 6 45 6 45 14" fill="none" stroke="#1f2937" strokeWidth="3" />
      {/* Main Body */}
      <rect x="12" y="14" width="51" height="68" rx="12" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
      {/* Front Zipper Pocket */}
      <rect x="18" y="44" width="39" height="32" rx="8" fill="#111827" stroke="#4b5563" strokeWidth="1" />
      <line x1="22" y1="48" x2="53" y2="48" stroke="#9ca3af" strokeWidth="1.2" />
      {/* Straps & Buckles */}
      <rect x="24" y="32" width="6" height="28" fill="#10b981" />
      <rect x="45" y="32" width="6" height="28" fill="#10b981" />
      <rect x="23" y="40" width="8" height="5" rx="1" fill="#d1d5db" />
      <rect x="44" y="40" width="8" height="5" rx="1" fill="#d1d5db" />
    </svg>
  ),

  // 14. Potted Succulent Plant
  Plant: () => (
    <svg viewBox="0 0 60 75" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Ceramic Pot */}
      <polygon points="15,40 45,40 40,70 20,70" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="13" y="36" width="34" height="6" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
      {/* Succulent Leaves */}
      <ellipse cx="30" cy="32" rx="7" ry="12" fill="#10b981" />
      <ellipse cx="23" cy="34" rx="6" ry="10" transform="rotate(-30 23 34)" fill="#059669" />
      <ellipse cx="37" cy="34" rx="6" ry="10" transform="rotate(30 37 34)" fill="#059669" />
      <ellipse cx="18" cy="36" rx="5" ry="8" transform="rotate(-55 18 36)" fill="#047857" />
      <ellipse cx="42" cy="36" rx="5" ry="8" transform="rotate(55 42 36)" fill="#047857" />
      <circle cx="30" cy="34" r="3" fill="#a7f3d0" />
    </svg>
  ),

  // 15. AirPods Charging Case
  AirPods: () => (
    <svg viewBox="0 0 50 60" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Open Lid Base */}
      <rect x="8" y="22" width="34" height="34" rx="9" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Green status LED */}
      <circle cx="25" cy="36" r="2" fill="#10b981" />
      {/* Lid seam */}
      <line x1="8" y1="23" x2="42" y2="23" stroke="#d1d5db" strokeWidth="1" />
      {/* Earbuds sticking out */}
      <circle cx="18" cy="15" r="5" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="16" y="15" width="4" height="10" rx="1.5" fill="#f3f4f6" />
      <circle cx="32" cy="15" r="5" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="30" y="15" width="4" height="10" rx="1.5" fill="#f3f4f6" />
    </svg>
  ),

  // 16. Insulated Hydro Flask
  Flask: () => (
    <svg viewBox="0 0 40 90" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      {/* Cap Handle Loop */}
      <path d="M 14 10 C 14 4 26 4 26 10" fill="none" stroke="#374151" strokeWidth="3" />
      {/* Screw Cap */}
      <rect x="12" y="10" width="16" height="12" rx="2" fill="#111827" stroke="#374151" strokeWidth="1" />
      {/* Flask Bottle Body */}
      <rect x="8" y="22" width="24" height="64" rx="5" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
      {/* Specular Highlight stripe */}
      <line x1="12" y1="26" x2="12" y2="82" stroke="#ffffff" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
    </svg>
  ),
};

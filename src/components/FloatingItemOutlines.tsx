import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Pure vector line-art outlines of rentable & exchangeable community items
// Faithfully matches user's reference image (/public/assets/aistudio/image_fbd78130.png):
// Pure transparent fill, clean crisp vector stroke outlines, no raster images.
export type ItemOutlineType =
  | 'headphones'
  | 'laptop'
  | 'earphone'
  | 'buds'
  | 'cycle'
  | 'keyboard'
  | 'camera'
  | 'football'
  | 'shoes'
  | 'smartwatch'
  | 'smartphone'
  | 'drone'
  | 'guitar'
  | 'drill'
  | 'gamepad'
  | 'tent'
  | 'skateboard';

interface OutlineItemDef {
  type: ItemOutlineType;
  label: string;
  render: () => React.ReactElement;
}

// Crisp, high-detail vector outline paths for every requested item
export const OUTLINE_CATALOG: OutlineItemDef[] = [
  // 1. Headphones — exact line-art match to user reference image image_fbd78130.png
  // Arched headband with padded top section, earcup yoke brackets with pivot pins, angled ear cushions
  {
    type: 'headphones',
    label: 'Over-Ear Headphones',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Outer and inner headband arch */}
        <path d="M 12 56 C 12 18, 88 18, 88 56" />
        <path d="M 18 54 C 18 24, 82 24, 82 54" />
        {/* Top Headband Cushion with segment lines */}
        <path d="M 28 34 C 36 28, 64 28, 72 34" strokeWidth="2" />
        <line x1="28" y1="28" x2="28" y2="34" strokeWidth="1.8" />
        <line x1="72" y1="28" x2="72" y2="34" strokeWidth="1.8" />

        {/* Left Side: Yoke bracket with pivot screw & angled earcup */}
        <g transform="translate(4, 2)">
          {/* Semicircular hinge bracket */}
          <path d="M 17 64 C 13 67, 13 76, 21 80" />
          <path d="M 21 80 L 26 87" />
          <circle cx="17.5" cy="72" r="2.2" strokeWidth="2" />
          {/* Angled Earcup outer shell and inner cushion */}
          <path d="M 23 51 C 20 54, 15 62, 19 75 C 23 88, 30 87, 33 83 L 38 73 C 41 66, 37 57, 31 52 Z" />
          <path d="M 22 55 C 25 53, 33 55, 36 62 L 41 72 C 43 78, 38 84, 32 82" />
        </g>

        {/* Right Side: Yoke bracket with pivot screw & angled earcup */}
        <g transform="translate(-4, 2)">
          {/* Semicircular hinge bracket */}
          <path d="M 83 64 C 87 67, 87 76, 79 80" />
          <path d="M 79 80 L 74 87" />
          <circle cx="82.5" cy="72" r="2.2" strokeWidth="2" />
          {/* Angled Earcup outer shell and inner cushion */}
          <path d="M 77 51 C 80 54, 85 62, 81 75 C 77 88, 70 87, 67 83 L 62 73 C 59 66, 63 57, 69 52 Z" />
          <path d="M 78 55 C 75 53, 67 55, 64 62 L 59 72 C 57 78, 62 84, 68 82" />
        </g>
      </svg>
    ),
  },

  // 2. Laptop — Screen bezel, inner display, keyboard bed & trackpad
  {
    type: 'laptop',
    label: 'Laptop',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Open Display Lid */}
        <rect x="20" y="22" width="60" height="42" rx="3" />
        {/* Inner Screen Display */}
        <rect x="25" y="27" width="50" height="32" rx="1.5" strokeDasharray="1 0" />
        {/* Camera notch dot */}
        <circle cx="50" cy="24.5" r="1.2" fill="currentColor" />
        {/* Laptop Base */}
        <path d="M 10 70 L 20 64 L 80 64 L 90 70 L 10 70 Z" />
        <path d="M 10 70 L 12 75 L 88 75 L 90 70" />
        {/* Keyboard key outline */}
        <line x1="26" y1="66.5" x2="74" y2="66.5" />
        {/* Trackpad */}
        <rect x="42" y="68.5" width="16" height="4.5" rx="1" />
      </svg>
    ),
  },

  // 3. Wired Earphones — In-ear earpieces, silicone tips, cables & 3.5mm jack
  {
    type: 'earphone',
    label: 'Wired Earphones',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Left earpiece */}
        <circle cx="26" cy="26" r="8" />
        <path d="M 22 22 Q 26 18 30 22" />
        <rect x="24" y="34" width="4" height="8" rx="1.5" />
        {/* Right earpiece */}
        <circle cx="74" cy="26" r="8" />
        <path d="M 70 22 Q 74 18 78 22" />
        <rect x="72" y="34" width="4" height="8" rx="1.5" />
        {/* Cables flowing down and merging */}
        <path d="M 26 42 C 26 62, 48 58, 50 68" />
        <path d="M 74 42 C 74 62, 52 58, 50 68" />
        {/* Y-Splitter */}
        <rect x="48" y="68" width="4" height="7" rx="1.5" />
        {/* Audio cable and 3.5mm jack */}
        <line x1="50" y1="75" x2="50" y2="86" />
        <rect x="47.5" y="86" width="5" height="8" rx="1" />
        <line x1="50" y1="94" x2="50" y2="98" strokeWidth="2.6" />
      </svg>
    ),
  },

  // 4. Wireless Buds — Charging case with lid seam + pair of stem earbuds
  {
    type: 'buds',
    label: 'Wireless Buds',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Charging Case Body */}
        <rect x="28" y="36" width="44" height="48" rx="14" />
        {/* Lid opening seam */}
        <path d="M 28 52 L 72 52" />
        {/* Charging LED */}
        <circle cx="50" cy="62" r="2" />
        {/* Left Floating Earbud */}
        <circle cx="18" cy="28" r="7.5" />
        <rect x="16" y="34" width="4" height="16" rx="2" />
        {/* Right Floating Earbud */}
        <circle cx="82" cy="28" r="7.5" />
        <rect x="80" y="34" width="4" height="16" rx="2" />
      </svg>
    ),
  },

  // 5. Bicycle / Cycle — Two spoked wheels, diamond frame, fork, handlebars, seat, pedals
  {
    type: 'cycle',
    label: 'Bicycle / Cycle',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Rear Wheel & Front Wheel */}
        <circle cx="22" cy="66" r="17" />
        <circle cx="22" cy="66" r="3.5" />
        <circle cx="78" cy="66" r="17" />
        <circle cx="78" cy="66" r="3.5" />
        {/* Wheel Spokes */}
        <line x1="22" y1="49" x2="22" y2="83" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="5" y1="66" x2="39" y2="66" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="78" y1="49" x2="78" y2="83" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="61" y1="66" x2="95" y2="66" strokeWidth="1" strokeDasharray="3 3" />
        {/* Crankset */}
        <circle cx="48" cy="66" r="4.5" />
        {/* Diamond Frame Tubes */}
        <path d="M 22 66 L 42 42 L 48 66 L 22 66" />
        <path d="M 42 42 L 70 42 L 48 66" />
        <path d="M 70 42 L 78 66" />
        {/* Seat post and saddle */}
        <line x1="42" y1="42" x2="40" y2="34" />
        <path d="M 33 34 L 48 34 Q 46 30 40 30 Z" />
        {/* Handlebars */}
        <line x1="70" y1="42" x2="72" y2="32" />
        <path d="M 68 32 L 76 32 Q 80 32 78 38" />
      </svg>
    ),
  },

  // 6. Mechanical Keyboard — Chassis, matrix of keycaps, spacebar
  {
    type: 'keyboard',
    label: 'Mechanical Keyboard',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <rect x="12" y="32" width="76" height="40" rx="4" />
        {/* Key Rows */}
        <line x1="18" y1="40" x2="82" y2="40" />
        <line x1="18" y1="48" x2="82" y2="48" />
        <line x1="18" y1="56" x2="82" y2="56" />
        <line x1="18" y1="64" x2="82" y2="64" />
        {/* Individual key dividers */}
        <line x1="28" y1="32" x2="28" y2="40" />
        <line x1="40" y1="32" x2="40" y2="40" />
        <line x1="52" y1="32" x2="52" y2="40" />
        <line x1="64" y1="32" x2="64" y2="40" />
        <line x1="76" y1="32" x2="76" y2="40" />
        <line x1="34" y1="40" x2="34" y2="48" />
        <line x1="46" y1="40" x2="46" y2="48" />
        <line x1="58" y1="40" x2="58" y2="48" />
        <line x1="70" y1="40" x2="70" y2="48" />
        {/* Spacebar */}
        <rect x="36" y="65" width="28" height="5" rx="1.5" />
      </svg>
    ),
  },

  // 7. Camera — DSLR body, shutter, top dials, concentric lens barrel
  {
    type: 'camera',
    label: 'Camera',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 16 38 L 34 38 L 40 30 L 60 30 L 66 38 L 84 38 C 87 38, 89 40, 89 44 L 89 74 C 89 77, 87 79, 84 79 L 16 79 C 13 79, 11 77, 11 74 L 11 44 C 11 40, 13 38, 16 38 Z" />
        {/* Concentric Lens Rings */}
        <circle cx="50" cy="57" r="17" />
        <circle cx="50" cy="57" r="12" />
        <circle cx="50" cy="57" r="6.5" />
        {/* Shutter button & Mode dial */}
        <rect x="22" y="32" width="8" height="6" rx="1.5" />
        <rect x="70" y="33" width="7" height="5" rx="1" />
        <circle cx="74" cy="46" r="2.5" />
      </svg>
    ),
  },

  // 8. Football — Spherical contour with center pentagon and radiating seam lines
  {
    type: 'football',
    label: 'Football',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <circle cx="50" cy="50" r="34" />
        {/* Center Pentagon */}
        <path d="M 50 36 L 62 45 L 58 58 L 42 58 L 38 45 Z" />
        {/* Seams */}
        <line x1="50" y1="36" x2="50" y2="16" />
        <line x1="62" y1="45" x2="80" y2="39" />
        <line x1="58" y1="58" x2="72" y2="74" />
        <line x1="42" y1="58" x2="28" y2="74" />
        <line x1="38" y1="45" x2="20" y2="39" />
        {/* Outer connecting seams */}
        <path d="M 50 16 L 68 22" />
        <path d="M 50 16 L 32 22" />
        <path d="M 80 39 L 84 56" />
        <path d="M 20 39 L 16 56" />
        <path d="M 72 74 L 50 84 L 28 74" />
      </svg>
    ),
  },

  // 9. Sneaker / Shoes — Running shoe profile, laces, sole tread, collar
  {
    type: 'shoes',
    label: 'Sneakers / Shoes',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Shoe upper profile */}
        <path d="M 14 66 C 14 55, 18 50, 22 45 L 34 45 C 38 45, 42 40, 48 48 L 62 58 L 84 58 C 88 58, 90 64, 88 68 L 82 72 L 14 72 Z" />
        {/* Sole outline */}
        <path d="M 12 72 L 88 72 L 88 78 C 88 80, 86 81, 84 81 L 14 81 C 12 81, 10 80, 10 78 L 12 72 Z" />
        {/* Tread grooves */}
        <line x1="24" y1="74" x2="24" y2="79" />
        <line x1="38" y1="74" x2="38" y2="79" />
        <line x1="52" y1="74" x2="52" y2="79" />
        <line x1="66" y1="74" x2="66" y2="79" />
        <line x1="80" y1="74" x2="80" y2="79" />
        {/* Laces */}
        <line x1="42" y1="46" x2="52" y2="52" />
        <line x1="46" y1="50" x2="56" y2="56" />
        <line x1="50" y1="54" x2="60" y2="60" />
      </svg>
    ),
  },

  // 10. Smartwatch — Square case, digital screen, crown & strap
  {
    type: 'smartwatch',
    label: 'Smartwatch',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 38 28 L 38 12 L 62 12 L 62 28" />
        <path d="M 38 72 L 38 88 L 62 88 L 62 72" />
        <rect x="28" y="28" width="44" height="44" rx="12" />
        <rect x="34" y="34" width="32" height="32" rx="7" strokeDasharray="1 0" />
        <rect x="72" y="38" width="4.5" height="10" rx="1.5" />
        <line x1="50" y1="50" x2="50" y2="42" />
        <line x1="50" y1="50" x2="58" y2="50" />
      </svg>
    ),
  },

  // 11. Smartphone — Slim bezel, front punch-hole, screen & buttons
  {
    type: 'smartphone',
    label: 'Smartphone',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <rect x="30" y="16" width="40" height="68" rx="8" />
        <rect x="33" y="21" width="34" height="58" rx="4" />
        <circle cx="50" cy="25" r="1.5" fill="currentColor" />
        <line x1="44" y1="75" x2="56" y2="75" strokeWidth="1.8" />
      </svg>
    ),
  },

  // 12. Drone Quadcopter — 4 arms, rotor guards & propellers
  {
    type: 'drone',
    label: 'Drone Quadcopter',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <rect x="42" y="42" width="16" height="16" rx="4" />
        <circle cx="50" cy="50" r="3.5" />
        <line x1="42" y1="42" x2="24" y2="24" />
        <line x1="58" y1="42" x2="76" y2="24" />
        <line x1="42" y1="58" x2="24" y2="76" />
        <line x1="58" y1="58" x2="76" y2="76" />
        <circle cx="22" cy="22" r="10" />
        <circle cx="78" cy="22" r="10" />
        <circle cx="22" cy="78" r="10" />
        <circle cx="78" cy="78" r="10" />
        <line x1="14" y1="22" x2="30" y2="22" strokeWidth="1.6" />
        <line x1="70" y1="22" x2="86" y2="22" strokeWidth="1.6" />
        <line x1="14" y1="78" x2="30" y2="78" strokeWidth="1.6" />
        <line x1="70" y1="78" x2="86" y2="78" strokeWidth="1.6" />
      </svg>
    ),
  },

  // 13. Acoustic Guitar — Soundhole, bridge, neck, frets & tuning pegs
  {
    type: 'guitar',
    label: 'Acoustic Guitar',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 32 82 C 18 74, 18 56, 32 50 C 30 44, 34 38, 44 42 C 54 46, 62 60, 56 74 C 50 86, 42 88, 32 82 Z" />
        <circle cx="41" cy="56" r="6" />
        <rect x="34" y="68" width="10" height="3" rx="1" transform="rotate(30 39 69)" />
        <path d="M 45 42 L 72 18 L 76 22 L 49 46 Z" />
        <path d="M 72 18 L 82 10 L 86 14 L 76 22 Z" />
        <circle cx="78" cy="11" r="1.5" />
        <circle cx="82" cy="15" r="1.5" />
      </svg>
    ),
  },

  // 14. Cordless Power Drill — Chuck, motor casing, trigger & battery base
  {
    type: 'drill',
    label: 'Cordless Power Drill',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <line x1="14" y1="38" x2="24" y2="38" strokeWidth="2.8" />
        <rect x="24" y="32" width="10" height="12" rx="2" />
        <path d="M 34 28 L 72 28 C 76 28, 78 31, 78 35 L 78 45 C 78 48, 75 50, 70 50 L 52 50 L 54 74 L 42 74 L 38 48 L 34 48 Z" />
        <path d="M 38 42 C 34 42, 34 46, 38 46" />
        <rect x="36" y="74" width="24" height="12" rx="3" />
      </svg>
    ),
  },

  // 15. Gaming Controller — D-pad, analog thumbsticks, ABXY buttons
  {
    type: 'gamepad',
    label: 'Gaming Controller',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 28 32 C 38 32, 44 36, 50 36 C 56 36, 62 32, 72 32 C 84 32, 90 44, 86 66 C 84 76, 75 80, 68 72 L 60 58 L 40 58 L 32 72 C 25 80, 16 76, 14 66 C 10 44, 16 32, 28 32 Z" />
        <path d="M 28 42 L 32 42 L 32 46 L 36 46 L 36 50 L 32 50 L 32 54 L 28 54 L 28 50 L 24 50 L 24 46 L 28 46 Z" />
        <circle cx="70" cy="42" r="2.2" />
        <circle cx="76" cy="48" r="2.2" />
        <circle cx="64" cy="48" r="2.2" />
        <circle cx="70" cy="54" r="2.2" />
        <circle cx="40" cy="50" r="4.5" />
        <circle cx="60" cy="50" r="4.5" />
      </svg>
    ),
  },

  // 16. Camping Tent — A-frame tent, front door flap & guy lines
  {
    type: 'tent',
    label: 'Camping Tent',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 50 24 L 20 74 L 80 74 Z" />
        <line x1="50" y1="24" x2="50" y2="74" />
        <path d="M 50 48 L 65 74" />
        <line x1="20" y1="74" x2="12" y2="78" />
        <line x1="80" y1="74" x2="88" y2="78" />
        <line x1="50" y1="24" x2="50" y2="18" />
      </svg>
    ),
  },

  // 17. Skateboard — Curved deck, trucks & wheels
  {
    type: 'skateboard',
    label: 'Skateboard',
    render: () => (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M 14 44 C 18 42, 26 48, 50 48 C 74 48, 82 42, 86 44 C 88 45, 87 48, 85 49 C 78 53, 72 50, 50 50 C 28 50, 22 53, 15 49 C 13 48, 12 45, 14 44 Z" />
        <rect x="26" y="50" width="8" height="5" rx="1" />
        <rect x="66" y="50" width="8" height="5" rx="1" />
        <circle cx="26" cy="60" r="5" />
        <circle cx="34" cy="60" r="5" />
        <circle cx="66" cy="60" r="5" />
        <circle cx="74" cy="60" r="5" />
      </svg>
    ),
  },
];

// Zone distribution to ensure nice coverage without clutter
const SLOT_ZONES = [
  { minX: 4, maxX: 22, minY: 8, maxY: 42 },     // Top-left
  { minX: 74, maxX: 92, minY: 10, maxY: 44 },    // Top-right
  { minX: 8, maxX: 26, minY: 52, maxY: 84 },     // Bottom-left
  { minX: 72, maxX: 90, minY: 54, maxY: 86 },    // Bottom-right
  { minX: 42, maxX: 58, minY: 6, maxY: 28 },     // Top-center
  { minX: 38, maxX: 62, minY: 68, maxY: 88 },    // Bottom-center
];

// Individual floating item slot that independently fades in, drifts, fades out, and shows the next item
interface SlotProps {
  slotIndex: number;
  initialDelay: number;
}

const FloatingSlot: React.FC<SlotProps> = ({ slotIndex, initialDelay }) => {
  const [catalogIndex, setCatalogIndex] = useState(() => (slotIndex * 3) % OUTLINE_CATALOG.length);
  const [cycle, setCycle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Position & drift configuration
  const zone = SLOT_ZONES[slotIndex % SLOT_ZONES.length];
  const [coords, setCoords] = useState(() => ({
    x: zone.minX + Math.random() * (zone.maxX - zone.minX),
    y: zone.minY + Math.random() * (zone.maxY - zone.minY),
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 36,
    rotateStart: (Math.random() - 0.5) * 16,
    rotateEnd: (Math.random() - 0.5) * 20,
    size: 58 + Math.floor(Math.random() * 22), // 58px to 80px (crisp, clearly visible)
    duration: 10 + (slotIndex % 3) * 2,       // 10s to 14s duration
  }));

  // Initial staggered start
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay * 1000);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  // When animation cycle completes, fade out and switch to another item
  const handleCycleComplete = () => {
    setIsVisible(false);
    // Pause briefly (1.2s) while hidden, then respawn with another item in a fresh location
    setTimeout(() => {
      setCatalogIndex((prev) => (prev + 1 + Math.floor(Math.random() * 2)) % OUTLINE_CATALOG.length);
      const newZone = SLOT_ZONES[slotIndex % SLOT_ZONES.length];
      setCoords({
        x: newZone.minX + Math.random() * (newZone.maxX - newZone.minX),
        y: newZone.minY + Math.random() * (newZone.maxY - newZone.minY),
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 36,
        rotateStart: (Math.random() - 0.5) * 16,
        rotateEnd: (Math.random() - 0.5) * 20,
        size: 58 + Math.floor(Math.random() * 22),
        duration: 9 + Math.random() * 4,
      });
      setCycle((c) => c + 1);
      setIsVisible(true);
    }, 1200);
  };

  const currentItem = OUTLINE_CATALOG[catalogIndex % OUTLINE_CATALOG.length];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`slot-${slotIndex}-cycle-${cycle}`}
          initial={{
            opacity: 0,
            scale: 0.82,
            x: 0,
            y: 0,
            rotate: coords.rotateStart,
          }}
          animate={{
            // Fades in smoothly, stays clearly visible while drifting, then fades out smoothly
            opacity: [0, 0.42, 0.42, 0.38, 0],
            scale: [0.85, 1, 1.03, 1, 0.92],
            x: [0, coords.driftX * 0.4, coords.driftX * 0.8, coords.driftX],
            y: [0, coords.driftY * 0.4, coords.driftY * 0.8, coords.driftY],
            rotate: [
              coords.rotateStart,
              (coords.rotateStart + coords.rotateEnd) / 2,
              coords.rotateEnd,
              coords.rotateEnd + 3,
            ],
          }}
          transition={{
            duration: coords.duration,
            ease: 'easeInOut',
            times: [0, 0.16, 0.55, 0.84, 1],
          }}
          onAnimationComplete={handleCycleComplete}
          style={{
            position: 'absolute',
            left: `${coords.x}%`,
            top: `${coords.y}%`,
            width: `${coords.size}px`,
            height: `${coords.size}px`,
            // Royal purple outline matching palette with crisp line-art clarity
            color: '#3B1E54',
          }}
          className="pointer-events-none select-none drop-shadow-[0_2px_10px_rgba(59,30,84,0.18)] filter"
          title={currentItem.label}
        >
          {currentItem.render()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FloatingItemOutlines: React.FC = () => {
  // Number of active visible slots (desktop = 5, mobile = 3)
  const [slotCount, setSlotCount] = useState<number>(5);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 640) {
        setSlotCount(3);
      } else if (window.innerWidth < 1024) {
        setSlotCount(4);
      } else {
        setSlotCount(5);
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Stagger delays so items do NOT appear all at once:
  // Slot 0 starts immediately, Slot 1 at 2.2s, Slot 2 at 4.6s, Slot 3 at 7.0s, Slot 4 at 9.4s
  const delays = [0.2, 2.4, 4.8, 7.2, 9.6, 12.0];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]"
      aria-hidden="true"
    >
      {Array.from({ length: slotCount }, (_, i) => (
        <FloatingSlot
          key={`floating-slot-${i}`}
          slotIndex={i}
          initialDelay={delays[i] || i * 2.2}
        />
      ))}
    </div>
  );
};

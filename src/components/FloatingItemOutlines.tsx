import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Pure crisp vector outlined icons (fill="none", stroke="currentColor")
// Multi-weight architectural line-art with realistic structural details
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
  | 'skateboard'
  | 'vr'
  | 'microphone'
  | 'lantern'
  | 'binoculars'
  | 'scooter'
  | 'backpack'
  | 'tennis'
  | 'tripod'
  | 'console'
  | 'turntable'
  | 'toolbox';

interface OutlineItemDef {
  type: ItemOutlineType;
  label: string;
  render: () => React.ReactElement;
}

export const OUTLINE_CATALOG: OutlineItemDef[] = [
  // 1. Over-Ear Studio Headphones
  {
    type: 'headphones',
    label: 'Over-Ear Headphones',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 14 56 C 14 18, 86 18, 86 56" />
        <path d="M 20 54 C 20 25, 80 25, 80 54" strokeWidth="1.5" />
        <path d="M 30 31 C 38 26, 62 26, 70 31" strokeWidth="1.4" />
        <line x1="30" y1="26" x2="30" y2="31" strokeWidth="1.4" />
        <line x1="70" y1="26" x2="70" y2="31" strokeWidth="1.4" />
        {/* Left yoke & earcup */}
        <path d="M 14 55 L 14 65 C 14 70, 18 73, 22 73" strokeWidth="1.7" />
        <circle cx="16.5" cy="65" r="2" strokeWidth="1.4" />
        <rect x="19" y="51" width="14" height="32" rx="7" transform="rotate(-10 26 67)" />
        <rect x="28" y="53" width="8" height="28" rx="4" transform="rotate(-10 32 67)" strokeWidth="1.5" />
        {/* Right yoke & earcup */}
        <path d="M 86 55 L 86 65 C 86 70, 82 73, 78 73" strokeWidth="1.7" />
        <circle cx="83.5" cy="65" r="2" strokeWidth="1.4" />
        <rect x="67" y="51" width="14" height="32" rx="7" transform="rotate(10 74 67)" />
        <rect x="64" y="53" width="8" height="28" rx="4" transform="rotate(10 68 67)" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 2. Pro Laptop
  {
    type: 'laptop',
    label: 'Pro Laptop',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="19" y="21" width="62" height="42" rx="3.5" />
        <rect x="23.5" y="25.5" width="53" height="33" rx="1.5" strokeWidth="1.5" />
        <circle cx="50" cy="23.3" r="1" strokeWidth="1.2" />
        <path d="M 28 36 L 44 36 M 28 42 L 56 42" strokeWidth="1.2" opacity="0.75" />
        <path d="M 19 63 L 81 63 L 91 72 L 9 72 Z" />
        <path d="M 9 72 L 11.5 76 L 88.5 76 L 91 72" strokeWidth="1.6" />
        <line x1="25" y1="66" x2="75" y2="66" strokeWidth="1.3" strokeDasharray="3 2" />
        <rect x="41" y="68.5" width="18" height="2.5" rx="0.8" strokeWidth="1.2" />
      </svg>
    ),
  },

  // 3. Wired Earphones
  {
    type: 'earphone',
    label: 'Wired Earphones',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="26" cy="25" r="8" />
        <ellipse cx="19" cy="25" rx="3" ry="4.5" strokeWidth="1.5" />
        <rect x="24" y="33" width="4" height="8" rx="1.5" strokeWidth="1.6" />
        <circle cx="74" cy="25" r="8" />
        <ellipse cx="81" cy="25" rx="3" ry="4.5" strokeWidth="1.5" />
        <rect x="72" y="33" width="4" height="8" rx="1.5" strokeWidth="1.6" />
        <path d="M 26 41 C 26 60, 48 58, 50 68" strokeWidth="1.8" />
        <path d="M 74 41 C 74 60, 52 58, 50 68" strokeWidth="1.8" />
        <rect x="68" y="47" width="4.5" height="8.5" rx="1.5" strokeWidth="1.4" />
        <rect x="47.5" y="68" width="5" height="7" rx="1.5" strokeWidth="1.6" />
        <line x1="50" y1="75" x2="50" y2="85" strokeWidth="1.8" />
        <rect x="47.5" y="85" width="5" height="7.5" rx="1" strokeWidth="1.6" />
        <line x1="50" y1="92.5" x2="50" y2="97" strokeWidth="2" />
      </svg>
    ),
  },

  // 4. Wireless Buds & Case
  {
    type: 'buds',
    label: 'Wireless Earbuds',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="28" y="38" width="44" height="45" rx="14" />
        <line x1="28" y1="53" x2="72" y2="53" strokeWidth="1.5" />
        <rect x="43" y="51.5" width="14" height="3" rx="1.2" strokeWidth="1.2" />
        <circle cx="50" cy="62" r="1.8" strokeWidth="1.4" />
        <g transform="rotate(-10 20 30)">
          <circle cx="19" cy="24" r="6.5" />
          <rect x="17.5" y="29" width="4" height="15" rx="2" strokeWidth="1.6" />
        </g>
        <g transform="rotate(10 80 30)">
          <circle cx="81" cy="24" r="6.5" />
          <rect x="78.5" y="29" width="4" height="15" rx="2" strokeWidth="1.6" />
        </g>
      </svg>
    ),
  },

  // 5. Road Bicycle
  {
    type: 'cycle',
    label: 'Bicycle',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="22" cy="66" r="17" />
        <circle cx="22" cy="66" r="13.5" strokeWidth="1.2" />
        <circle cx="22" cy="66" r="3" strokeWidth="1.5" />
        <circle cx="78" cy="66" r="17" />
        <circle cx="78" cy="66" r="13.5" strokeWidth="1.2" />
        <circle cx="78" cy="66" r="3" strokeWidth="1.5" />
        <g strokeWidth="1" opacity="0.75">
          <line x1="22" y1="52.5" x2="22" y2="79.5" />
          <line x1="8.5" y1="66" x2="35.5" y2="66" />
          <line x1="78" y1="52.5" x2="78" y2="79.5" />
          <line x1="64.5" y1="66" x2="91.5" y2="66" />
        </g>
        <circle cx="48" cy="66" r="4.5" strokeWidth="1.6" />
        <path d="M 22 66 L 42 41 L 48 66 Z" />
        <path d="M 42 41 L 70 41 L 48 66" />
        <line x1="69" y1="39" x2="78" y2="66" />
        <line x1="42" y1="41" x2="39" y2="33" />
        <path d="M 32 33 L 47 33 Q 45 29 38 29 Z" strokeWidth="1.7" />
        <line x1="69" y1="39" x2="71" y2="30" />
        <path d="M 67 30 L 76 30 C 81 30, 81 37, 75 37" strokeWidth="1.8" />
      </svg>
    ),
  },

  // 6. Mechanical Keyboard
  {
    type: 'keyboard',
    label: 'Mechanical Keyboard',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="10" y="31" width="80" height="41" rx="4.5" />
        <rect x="14" y="35" width="72" height="33" rx="2" strokeWidth="1.3" />
        <line x1="16" y1="42" x2="84" y2="42" strokeWidth="1.3" />
        <line x1="16" y1="49" x2="84" y2="49" strokeWidth="1.3" />
        <line x1="16" y1="56" x2="84" y2="56" strokeWidth="1.3" />
        <line x1="16" y1="63" x2="84" y2="63" strokeWidth="1.3" />
        {[26, 36, 46, 56, 66, 76].map((x) => (
          <line key={x} x1={x} y1="35" x2={x} y2="49" strokeWidth="1.1" />
        ))}
        {[31, 41, 51, 61, 71].map((x) => (
          <line key={x} x1={x} y1="49" x2={x} y2="63" strokeWidth="1.1" />
        ))}
        <rect x="34" y="64" width="32" height="3.5" rx="1" strokeWidth="1.3" />
      </svg>
    ),
  },

  // 7. DSLR Camera
  {
    type: 'camera',
    label: 'DSLR Camera',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 15 38 L 33 38 L 39 29 L 61 29 L 67 38 L 85 38 C 88 38, 90 40, 90 44 L 90 74 C 90 78, 88 80, 85 80 L 15 80 C 12 80, 10 78, 10 74 L 10 44 C 10 40, 12 38, 15 38 Z" />
        <line x1="23" y1="42" x2="23" y2="76" strokeWidth="1.4" />
        <circle cx="51" cy="58" r="17.5" />
        <circle cx="51" cy="58" r="13" strokeWidth="1.5" />
        <circle cx="51" cy="58" r="7.5" strokeWidth="1.4" />
        <path d="M 46 53 A 7 7 0 0 1 56 53" strokeWidth="1.2" />
        <rect x="20" y="32" width="8" height="6" rx="1.5" strokeWidth="1.5" />
        <rect x="70" y="33" width="8" height="5" rx="1" strokeWidth="1.5" />
        <circle cx="77" cy="46" r="2.2" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 8. Match Football
  {
    type: 'football',
    label: 'Football',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="50" cy="50" r="34" />
        <path d="M 50 36 L 63 45 L 58 59 L 42 59 L 37 45 Z" strokeWidth="1.8" />
        <line x1="50" y1="36" x2="50" y2="16" strokeWidth="1.6" />
        <line x1="63" y1="45" x2="82" y2="39" strokeWidth="1.6" />
        <line x1="58" y1="59" x2="72" y2="76" strokeWidth="1.6" />
        <line x1="42" y1="59" x2="28" y2="76" strokeWidth="1.6" />
        <line x1="37" y1="45" x2="18" y2="39" strokeWidth="1.6" />
        <path d="M 35 20 L 50 24 L 65 20" strokeWidth="1.4" />
        <path d="M 79 54 L 74 42 L 83 36" strokeWidth="1.4" />
        <path d="M 21 54 L 26 42 L 17 36" strokeWidth="1.4" />
        <path d="M 38 82 L 50 75 L 62 82" strokeWidth="1.4" />
      </svg>
    ),
  },

  // 9. Running Sneaker
  {
    type: 'shoes',
    label: 'Sneaker',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 14 67 C 14 55, 19 48, 23 42 L 34 42 C 38 42, 43 45, 50 51 L 63 58 L 83 58 C 88 58, 90 64, 88 69 L 83 72 L 14 72 Z" />
        <path d="M 12 72 L 89 72 L 89 78 C 89 80, 87 81, 84 81 L 14 81 C 11 81, 10 79, 12 76 Z" />
        <path d="M 27 64 Q 48 66 64 57" strokeWidth="1.4" />
        <rect x="21" y="74.5" width="14" height="3.5" rx="1.5" strokeWidth="1.2" />
        <line x1="43" y1="46" x2="51" y2="51" strokeWidth="1.6" />
        <line x1="47" y1="50" x2="55" y2="55" strokeWidth="1.6" />
        <line x1="51" y1="54" x2="59" y2="59" strokeWidth="1.6" />
      </svg>
    ),
  },

  // 10. Smartwatch
  {
    type: 'smartwatch',
    label: 'Smartwatch',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 38 28 L 39 12 L 61 12 L 62 28" />
        <path d="M 38 72 L 39 88 L 61 88 L 62 72" />
        <rect x="28" y="28" width="44" height="44" rx="12" />
        <rect x="33.5" y="33.5" width="33" height="33" rx="8" strokeWidth="1.5" />
        <rect x="72" y="38" width="4.5" height="9.5" rx="1.5" strokeWidth="1.6" />
        <line x1="72" y1="54" x2="72" y2="62" strokeWidth="2" />
        <circle cx="50" cy="50" r="8.5" strokeWidth="1.3" strokeDasharray="36 18" />
        <line x1="50" y1="50" x2="50" y2="44" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="55" y2="50" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 11. Smartphone
  {
    type: 'smartphone',
    label: 'Smartphone',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="29" y="14" width="42" height="72" rx="8" />
        <rect x="33" y="18.5" width="34" height="63" rx="5" strokeWidth="1.4" />
        <rect x="43" y="21.5" width="14" height="3" rx="1.5" strokeWidth="1.2" />
        <line x1="43" y1="77" x2="57" y2="77" strokeWidth="1.5" />
        <line x1="26.5" y1="31" x2="26.5" y2="39" strokeWidth="1.5" />
        <line x1="73.5" y1="35" x2="73.5" y2="45" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 12. Camera Drone Quadcopter
  {
    type: 'drone',
    label: 'Camera Drone',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="41" y="38" width="18" height="24" rx="5" />
        <circle cx="50" cy="50" r="4" strokeWidth="1.6" />
        <line x1="41" y1="41" x2="23" y2="23" />
        <line x1="59" y1="41" x2="77" y2="23" />
        <line x1="41" y1="59" x2="23" y2="77" />
        <line x1="59" y1="59" x2="77" y2="77" />
        {[
          [22, 22],
          [78, 22],
          [22, 78],
          [78, 78],
        ].map(([cx, cy], idx) => (
          <g key={idx}>
            <circle cx={cx} cy={cy} r="11" strokeWidth="1.6" />
            <circle cx={cx} cy={cy} r="2.5" strokeWidth="1.4" />
            <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} strokeWidth="1.4" />
          </g>
        ))}
      </svg>
    ),
  },

  // 13. Acoustic Guitar
  {
    type: 'guitar',
    label: 'Acoustic Guitar',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <g transform="rotate(35 50 50)">
          <path d="M 50 38 C 39 38, 36 48, 41 55 C 34 61, 33 77, 41 84 C 46 88, 54 88, 59 84 C 67 77, 66 61, 59 55 C 64 48, 61 38, 50 38 Z" />
          <circle cx="50" cy="53" r="6" strokeWidth="1.6" />
          <circle cx="50" cy="53" r="8.5" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="43" y="69" width="14" height="4" rx="1" strokeWidth="1.5" />
          <rect x="47.2" y="16" width="5.6" height="31" strokeWidth="1.6" />
          <polygon points="46,8 54,8 53,16 47,16" strokeWidth="1.6" />
          <line x1="44" y1="10" x2="46.5" y2="10" strokeWidth="1.3" />
          <line x1="44" y1="13.5" x2="46.5" y2="13.5" strokeWidth="1.3" />
          <line x1="53.5" y1="10" x2="56" y2="10" strokeWidth="1.3" />
          <line x1="53.5" y1="13.5" x2="56" y2="13.5" strokeWidth="1.3" />
          <line x1="50" y1="16" x2="50" y2="69" strokeWidth="0.9" opacity="0.7" />
        </g>
      </svg>
    ),
  },

  // 14. Cordless Power Drill
  {
    type: 'drill',
    label: 'Cordless Power Drill',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <line x1="12" y1="38" x2="23" y2="38" strokeWidth="2.4" />
        <rect x="23" y="31.5" width="11" height="13" rx="2" />
        <line x1="28.5" y1="31.5" x2="28.5" y2="44.5" strokeWidth="1.3" />
        <path d="M 34 28 L 72 28 C 76 28, 79 31, 79 35 L 79 44 C 79 47.5, 76 49.5, 70 49.5 L 52 49.5 L 55 74 L 42 74 L 38 48 L 34 48 Z" />
        <path d="M 38 49 C 34 49, 34 55, 39 55" strokeWidth="1.7" />
        <line x1="56" y1="35" x2="68" y2="35" strokeWidth="1.3" />
        <line x1="56" y1="39.5" x2="68" y2="39.5" strokeWidth="1.3" />
        <rect x="35" y="74" width="27" height="12" rx="3" />
      </svg>
    ),
  },

  // 15. Wireless Gaming Controller
  {
    type: 'gamepad',
    label: 'Gaming Controller',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 28 32 C 38 32, 44 36, 50 36 C 56 36, 62 32, 72 32 C 84 32, 90 44, 86 66 C 84 76, 75 80, 68 72 L 60 58 L 40 58 L 32 72 C 25 80, 16 76, 14 66 C 10 44, 16 32, 28 32 Z" />
        <path d="M 28 42 L 32 42 L 32 46 L 36 46 L 36 50 L 32 50 L 32 54 L 28 54 L 28 50 L 24 50 L 24 46 L 28 46 Z" strokeWidth="1.5" />
        <circle cx="70" cy="42" r="2.2" strokeWidth="1.6" />
        <circle cx="76" cy="48" r="2.2" strokeWidth="1.6" />
        <circle cx="64" cy="48" r="2.2" strokeWidth="1.6" />
        <circle cx="70" cy="54" r="2.2" strokeWidth="1.6" />
        <circle cx="40" cy="52" r="4.5" strokeWidth="1.6" />
        <circle cx="60" cy="52" r="4.5" strokeWidth="1.6" />
        <circle cx="50" cy="43" r="2.5" strokeWidth="1.3" />
      </svg>
    ),
  },

  // 16. Camping Tent
  {
    type: 'tent',
    label: 'Camping Tent',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 50 24 L 19 75 L 81 75 Z" />
        <line x1="50" y1="24" x2="50" y2="75" strokeWidth="1.6" />
        <path d="M 50 44 L 38 75" strokeWidth="1.5" />
        <path d="M 50 44 L 62 75" strokeWidth="1.5" />
        <line x1="19" y1="75" x2="11" y2="79" strokeWidth="1.5" />
        <line x1="81" y1="75" x2="89" y2="79" strokeWidth="1.5" />
        <line x1="50" y1="24" x2="50" y2="18" strokeWidth="1.8" />
      </svg>
    ),
  },

  // 17. Skateboard
  {
    type: 'skateboard',
    label: 'Skateboard',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 13 43 C 18 41, 25 47, 50 47 C 75 47, 82 41, 87 43 C 89 44, 88 48, 85 49 C 78 53, 72 50, 50 50 C 28 50, 22 53, 15 49 C 12 48, 11 44, 13 43 Z" />
        <rect x="26" y="50" width="8" height="5" rx="1" strokeWidth="1.6" />
        <rect x="66" y="50" width="8" height="5" rx="1" strokeWidth="1.6" />
        <circle cx="25" cy="59" r="5" />
        <circle cx="35" cy="59" r="5" />
        <circle cx="65" cy="59" r="5" />
        <circle cx="75" cy="59" r="5" />
      </svg>
    ),
  },

  // 18. VR Mixed Reality Headset
  {
    type: 'vr',
    label: 'VR Headset',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="18" y="34" width="64" height="34" rx="11" />
        <rect x="24" y="40" width="52" height="22" rx="7" strokeWidth="1.5" />
        <path d="M 38 68 C 43 60, 57 60, 62 68" strokeWidth="1.6" />
        <circle cx="28" cy="46" r="2.2" strokeWidth="1.4" />
        <circle cx="72" cy="46" r="2.2" strokeWidth="1.4" />
        <path d="M 18 48 L 10 48 C 9 48, 9 54, 10 54 L 18 54" strokeWidth="1.6" />
        <path d="M 82 48 L 90 48 C 91 48, 91 54, 90 54 L 82 54" strokeWidth="1.6" />
        <path d="M 30 34 C 36 22, 64 22, 70 34" strokeWidth="1.6" />
      </svg>
    ),
  },

  // 19. Studio Condenser Microphone
  {
    type: 'microphone',
    label: 'Studio Microphone',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="37" y="16" width="26" height="42" rx="13" />
        <line x1="37" y1="36" x2="63" y2="36" strokeWidth="1.5" />
        <line x1="42" y1="24" x2="58" y2="24" strokeWidth="1.2" />
        <line x1="40" y1="30" x2="60" y2="30" strokeWidth="1.2" />
        <path d="M 28 38 C 28 58, 72 58, 72 38" strokeWidth="1.8" />
        <line x1="50" y1="64" x2="50" y2="82" />
        <path d="M 32 82 L 68 82" strokeWidth="2.4" />
        <circle cx="50" cy="47" r="2" strokeWidth="1.4" />
      </svg>
    ),
  },

  // 20. Camping Lantern
  {
    type: 'lantern',
    label: 'Camping Lantern',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 36 30 C 36 14, 64 14, 64 30" strokeWidth="1.7" />
        <path d="M 32 30 L 68 30 L 64 38 L 36 38 Z" />
        <rect x="35" y="38" width="30" height="28" rx="3" strokeWidth="1.6" />
        <line x1="42" y1="38" x2="42" y2="66" strokeWidth="1.3" />
        <line x1="58" y1="38" x2="58" y2="66" strokeWidth="1.3" />
        <path d="M 50 45 C 46 50, 47 57, 50 59 C 53 57, 54 50, 50 45 Z" strokeWidth="1.5" />
        <rect x="31" y="66" width="38" height="15" rx="3" />
        <circle cx="50" cy="73.5" r="2.5" strokeWidth="1.4" />
      </svg>
    ),
  },

  // 21. Outdoor Binoculars
  {
    type: 'binoculars',
    label: 'Binoculars',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 29 24 L 41 24 L 44 68 L 22 68 Z" />
        <path d="M 59 24 L 71 24 L 78 68 L 56 68 Z" />
        <ellipse cx="33" cy="68" rx="11" ry="4.5" strokeWidth="1.6" />
        <ellipse cx="67" cy="68" rx="11" ry="4.5" strokeWidth="1.6" />
        <rect x="30" y="18" width="10" height="6" rx="1.5" strokeWidth="1.6" />
        <rect x="60" y="18" width="10" height="6" rx="1.5" strokeWidth="1.6" />
        <rect x="44" y="36" width="12" height="10" rx="2" strokeWidth="1.6" />
        <line x1="43" y1="53" x2="57" y2="53" strokeWidth="1.8" />
      </svg>
    ),
  },

  // 22. Electric Kick Scooter
  {
    type: 'scooter',
    label: 'Electric Scooter',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="23" cy="72" r="10" />
        <circle cx="23" cy="72" r="3" strokeWidth="1.4" />
        <circle cx="77" cy="72" r="10" />
        <circle cx="77" cy="72" r="3" strokeWidth="1.4" />
        <path d="M 28 72 L 62 72 L 70 62" strokeWidth="2.4" />
        <line x1="77" y1="72" x2="66" y2="23" />
        <line x1="59" y1="23" x2="73" y2="23" strokeWidth="2.4" />
        <path d="M 16 63 C 20 58, 28 58, 32 63" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 23. Hiking Backpack
  {
    type: 'backpack',
    label: 'Travel Backpack',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 42 22 C 42 15, 58 15, 58 22" />
        <path d="M 27 42 C 27 25, 38 22, 50 22 C 62 22, 73 25, 73 42 L 75 78 C 75 82, 72 84, 67 84 L 33 84 C 28 84, 25 82, 25 78 Z" />
        <path d="M 30 42 C 42 48, 58 48, 70 42" strokeWidth="1.6" />
        <rect x="34" y="54" width="32" height="22" rx="4" strokeWidth="1.6" />
        <line x1="40" y1="62" x2="60" y2="62" strokeWidth="1.3" />
        <line x1="40" y1="42" x2="40" y2="49" strokeWidth="1.6" />
        <line x1="60" y1="42" x2="60" y2="49" strokeWidth="1.6" />
      </svg>
    ),
  },

  // 24. Tennis Racket & Ball
  {
    type: 'tennis',
    label: 'Tennis Racket',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <g transform="rotate(35 46 46)">
          <ellipse cx="46" cy="36" rx="18" ry="23" />
          <ellipse cx="46" cy="36" rx="14.5" ry="19.5" strokeWidth="1.2" />
          <g strokeWidth="0.9" opacity="0.75">
            <line x1="37" y1="21" x2="37" y2="51" />
            <line x1="46" y1="16.5" x2="46" y2="55.5" />
            <line x1="55" y1="21" x2="55" y2="51" />
            <line x1="33" y1="28" x2="59" y2="28" />
            <line x1="31.5" y1="36" x2="60.5" y2="36" />
            <line x1="33" y1="44" x2="59" y2="44" />
          </g>
          <path d="M 38 56 L 44 68 L 48 68 L 54 56" strokeWidth="1.7" />
          <rect x="43" y="68" width="6" height="19" rx="1.5" />
        </g>
        <circle cx="75" cy="70" r="8" />
        <path d="M 69 65 Q 75 70 69 75" strokeWidth="1.2" />
        <path d="M 81 65 Q 75 70 81 75" strokeWidth="1.2" />
      </svg>
    ),
  },

  // 25. Studio Tripod Stand
  {
    type: 'tripod',
    label: 'Camera Tripod',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="40" y="16" width="20" height="10" rx="2" />
        <line x1="60" y1="21" x2="72" y2="17" strokeWidth="1.7" />
        <rect x="44" y="26" width="12" height="8" rx="1.5" strokeWidth="1.6" />
        <line x1="50" y1="34" x2="50" y2="82" strokeWidth="1.8" />
        <line x1="46" y1="34" x2="24" y2="86" />
        <line x1="54" y1="34" x2="76" y2="86" />
        <line x1="37" y1="54" x2="63" y2="54" strokeWidth="1.4" />
      </svg>
    ),
  },

  // 26. Handheld Switch Console
  {
    type: 'console',
    label: 'Handheld Console',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="10" y="32" width="80" height="36" rx="9" />
        <line x1="25" y1="32" x2="25" y2="68" strokeWidth="1.6" />
        <line x1="75" y1="32" x2="75" y2="68" strokeWidth="1.6" />
        <rect x="29" y="36.5" width="42" height="27" rx="2" strokeWidth="1.5" />
        <circle cx="17.5" cy="43" r="3" strokeWidth="1.5" />
        <circle cx="17.5" cy="54" r="1.5" strokeWidth="1.3" />
        <circle cx="82.5" cy="43" r="1.5" strokeWidth="1.3" />
        <circle cx="82.5" cy="54" r="3" strokeWidth="1.5" />
      </svg>
    ),
  },

  // 27. Vinyl Turntable
  {
    type: 'turntable',
    label: 'Vinyl Turntable',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="12" y="24" width="76" height="52" rx="4" />
        <circle cx="43" cy="50" r="20" />
        <circle cx="43" cy="50" r="13" strokeWidth="1.1" opacity="0.7" />
        <circle cx="43" cy="50" r="6" strokeWidth="1.5" />
        <circle cx="43" cy="50" r="1.5" strokeWidth="1.4" />
        <circle cx="76" cy="34" r="4" strokeWidth="1.6" />
        <path d="M 76 38 L 71 58 L 62 61" strokeWidth="1.8" />
        <circle cx="76" cy="68" r="2.5" strokeWidth="1.4" />
        <line x1="68" y1="68" x2="72" y2="68" strokeWidth="1.4" />
      </svg>
    ),
  },

  // 28. Workshop Toolbox
  {
    type: 'toolbox',
    label: 'Workshop Toolbox',
    render: () => (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M 38 34 L 38 25 C 38 23, 40 22, 42 22 L 58 22 C 60 22, 62 23, 62 25 L 62 34" />
        <rect x="14" y="34" width="72" height="44" rx="4" />
        <line x1="14" y1="49" x2="86" y2="49" strokeWidth="1.6" />
        <rect x="28" y="45" width="9" height="8" rx="1.5" strokeWidth="1.5" />
        <rect x="63" y="45" width="9" height="8" rx="1.5" strokeWidth="1.5" />
        <line x1="22" y1="60" x2="44" y2="60" strokeWidth="1.3" />
      </svg>
    ),
  },
];

// Zone distribution placing outlined icons cleanly around open background pockets
const SLOT_ZONES = [
  { minX: 0.8, maxX: 3.5, minY: 14, maxY: 38 },   // Far left upper margin
  { minX: 90, maxX: 95, minY: 10, maxY: 36 },     // Far right upper margin
  { minX: 0.8, maxX: 3.5, minY: 58, maxY: 84 },   // Far left lower margin
  { minX: 89, maxX: 95, minY: 58, maxY: 85 },     // Far right lower margin
  { minX: 48, maxX: 57, minY: 4, maxY: 16 },      // Open center-top gap
  { minX: 39, maxX: 54, minY: 75, maxY: 89 },     // Open center-bottom gap
  { minX: 18, maxX: 34, minY: 2, maxY: 11 },      // Upper sky gap above headline
];

interface SlotProps {
  slotIndex: number;
  initialDelay: number;
}

const FloatingSlot: React.FC<SlotProps> = ({ slotIndex, initialDelay }) => {
  const [catalogIndex, setCatalogIndex] = useState(
    () => (slotIndex * 4) % OUTLINE_CATALOG.length
  );
  const [cycle, setCycle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const zone = SLOT_ZONES[slotIndex % SLOT_ZONES.length];
  const [coords, setCoords] = useState(() => ({
    x: zone.minX + Math.random() * (zone.maxX - zone.minX),
    y: zone.minY + Math.random() * (zone.maxY - zone.minY),
    driftX: (Math.random() - 0.5) * 18,
    driftY: (Math.random() - 0.5) * 20,
    rotateStart: (Math.random() - 0.5) * 16,
    rotateEnd: (Math.random() - 0.5) * 20,
    size: 56 + Math.floor(Math.random() * 20), // 56px to 76px crisp architectural outlines
    duration: 9 + (slotIndex % 3) * 2,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay * 1000);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const handleCycleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Jump across catalog by a prime stride so every slot surfaces a wide variety of items
      setCatalogIndex(
        (prev) => (prev + 5 + Math.floor(Math.random() * 4)) % OUTLINE_CATALOG.length
      );
      const newZone = SLOT_ZONES[slotIndex % SLOT_ZONES.length];
      setCoords({
        x: newZone.minX + Math.random() * (newZone.maxX - newZone.minX),
        y: newZone.minY + Math.random() * (newZone.maxY - newZone.minY),
        driftX: (Math.random() - 0.5) * 32,
        driftY: (Math.random() - 0.5) * 28,
        rotateStart: (Math.random() - 0.5) * 16,
        rotateEnd: (Math.random() - 0.5) * 20,
        size: 56 + Math.floor(Math.random() * 20),
        duration: 8.5 + Math.random() * 3.5,
      });
      setCycle((c) => c + 1);
      setIsVisible(true);
    }, 900);
  };

  const currentItem = OUTLINE_CATALOG[catalogIndex % OUTLINE_CATALOG.length];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`slot-${slotIndex}-cycle-${cycle}`}
          initial={{
            opacity: 0,
            scale: 0.84,
            x: 0,
            y: 0,
            rotate: coords.rotateStart,
          }}
          animate={{
            opacity: [0, 0.36, 0.36, 0.30, 0],
            scale: [0.86, 1, 1.03, 1, 0.92],
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
            color: '#3B1E54',
          }}
          className="pointer-events-none select-none drop-shadow-[0_2px_8px_rgba(59,30,84,0.14)]"
          title={currentItem.label}
        >
          {currentItem.render()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FloatingItemOutlines: React.FC = () => {
  const [slotCount, setSlotCount] = useState<number>(7);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 640) {
        setSlotCount(3);
      } else if (window.innerWidth < 1024) {
        setSlotCount(5);
      } else {
        setSlotCount(7);
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const delays = [0.15, 1.35, 2.6, 3.85, 5.1, 6.4, 7.6];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-[1]"
      aria-hidden="true"
    >
      {Array.from({ length: slotCount }, (_, i) => (
        <FloatingSlot
          key={`floating-slot-${i}`}
          slotIndex={i}
          initialDelay={delays[i] || i * 1.3}
        />
      ))}
    </div>
  );
};

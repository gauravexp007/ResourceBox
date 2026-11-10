import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface WebsiteSkeletonLoaderProps {
  showHero?: boolean;
  cardsCount?: number;
}

export const WebsiteSkeletonLoader: React.FC<WebsiteSkeletonLoaderProps> = ({
  showHero = true,
  cardsCount = 8,
}) => {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden select-none"
      style={{
        background: `linear-gradient(180deg, ${currentTheme.canvas} 0%, color-mix(in srgb, ${currentTheme.canvas} 92%, ${currentTheme.accent}) 100%)`,
      }}
      aria-busy="true"
      aria-label="Loading ResourceBox..."
    >
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${currentTheme.primary} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentTheme.primary} 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* 1. Header / Navbar Skeleton */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-[var(--theme-accent-light)] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            {/* 3D Cube Logo Skeleton with pulsing halo */}
            <div 
              className="w-10 h-10 rounded-xl relative overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.deep} 0%, color-mix(in srgb, ${currentTheme.deep} 75%, black) 100%)`,
                borderColor: currentTheme.primary,
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              {/* Mini Cube outline wireframe */}
              <div className="w-5 h-5 rounded-md border border-white/60 rotate-12 relative">
                <div className="absolute inset-0.5 border border-white/40 -rotate-6" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>

            <div className="space-y-1.5 hidden xs:block">
              <div 
                className="h-4 w-28 rounded-md relative overflow-hidden"
                style={{ background: `color-mix(in srgb, ${currentTheme.deep} 18%, transparent)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
              </div>
              <div 
                className="h-2 w-16 rounded-md relative overflow-hidden"
                style={{ background: `color-mix(in srgb, ${currentTheme.primary} 25%, transparent)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-8 w-24 rounded-xl relative overflow-hidden"
                style={{ background: `color-mix(in srgb, ${currentTheme.accent} 40%, transparent)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
              </div>
            ))}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2.5">
            <div 
              className="hidden sm:block h-9 w-44 rounded-xl relative overflow-hidden"
              style={{ background: `color-mix(in srgb, ${currentTheme.accent} 35%, transparent)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>

            <div 
              className="h-9 w-28 rounded-xl relative overflow-hidden"
              style={{ background: `color-mix(in srgb, ${currentTheme.deep} 30%, transparent)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>

            <div 
              className="w-9 h-9 rounded-full relative overflow-hidden shrink-0"
              style={{ background: `color-mix(in srgb, ${currentTheme.primary} 35%, transparent)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>
          </div>

        </div>
      </header>

      {/* 2. Hero Section Skeleton */}
      {showHero && (
        <section className="relative pt-10 pb-14 border-b border-[var(--theme-accent-light)] px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & Action Buttons */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Kicker bar */}
              <div 
                className="h-3 w-48 rounded-full relative overflow-hidden"
                style={{ background: `color-mix(in srgb, ${currentTheme.primary} 30%, transparent)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
              </div>

              {/* Luxury Headline Skeleton (Matching Luxury Serif styling & straight underline) */}
              <div className="space-y-3">
                <div 
                  className="h-10 sm:h-12 w-4/5 rounded-2xl relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.deep} 20%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div className="relative inline-block w-full">
                  <div 
                    className="h-10 sm:h-12 w-11/12 rounded-2xl relative overflow-hidden"
                    style={{ background: `color-mix(in srgb, ${currentTheme.primary} 35%, transparent)` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                  </div>
                  {/* Straight accent underline bar */}
                  <div 
                    className="h-1.5 w-11/12 mt-2 rounded-full relative overflow-hidden"
                    style={{ background: currentTheme.primary }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-[shimmer-sweep_1.6s_infinite]" />
                  </div>
                </div>
              </div>

              {/* Subtitle paragraph */}
              <div className="space-y-2 pt-1 max-w-lg">
                <div 
                  className="h-3.5 w-full rounded-md relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.textMuted} 20%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div 
                  className="h-3.5 w-4/5 rounded-md relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.textMuted} 15%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
              </div>

              {/* CTA Buttons Skeleton */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <div 
                  className="h-11 w-36 rounded-xl relative overflow-hidden shadow-xs"
                  style={{ background: `white`, borderColor: currentTheme.accent, borderWidth: '1px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--theme-accent-light)] to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div 
                  className="h-11 w-44 rounded-xl relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.accent} 45%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div 
                  className="h-11 w-40 rounded-xl relative overflow-hidden shadow-md"
                  style={{ background: currentTheme.deep }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
              </div>

            </div>

            {/* Right Column: 3D Box Hub Skeleton */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div 
                className="w-72 h-72 sm:w-88 sm:h-88 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 border shadow-xl"
                style={{
                  background: `radial-gradient(circle, color-mix(in srgb, ${currentTheme.accent} 40%, white) 0%, white 100%)`,
                  borderColor: currentTheme.accent,
                }}
              >
                {/* Floating item silhouette tags */}
                <div className="flex gap-2 mb-6">
                  <div className="h-6 w-20 rounded-full bg-white/80 border border-[var(--theme-accent)] shadow-xs animate-pulse" />
                  <div className="h-6 w-24 rounded-full bg-white/80 border border-[var(--theme-accent)] shadow-xs animate-pulse" />
                </div>

                {/* 3D Box Wireframe Mockup */}
                <div 
                  className="w-36 h-36 rounded-2xl relative flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${currentTheme.deep} 75%, transparent) 0%, ${currentTheme.deep} 100%)`,
                    border: `1.5px solid ${currentTheme.primary}`,
                  }}
                >
                  <div className="w-20 h-20 border-2 border-white/50 rounded-xl rotate-12 flex items-center justify-center">
                    <div className="w-12 h-12 border border-white/30 rounded-lg -rotate-12" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>

                {/* Pedestal Shadow */}
                <div 
                  className="w-48 h-6 rounded-full mt-6 filter blur-xs"
                  style={{ background: `color-mix(in srgb, ${currentTheme.deep} 25%, transparent)` }}
                />

                {/* Interaction Hint */}
                <div className="mt-4 h-3.5 w-36 rounded-full bg-white/60 border border-[var(--theme-accent)]" />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. Category Filter Pill Bar Skeleton */}
      <section className="py-6 bg-white/70 backdrop-blur-md border-b border-[var(--theme-accent-light)] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden">
          {[80, 110, 95, 120, 105, 90, 115, 100].map((width, idx) => (
            <div 
              key={idx}
              className="h-9 rounded-xl relative overflow-hidden shrink-0"
              style={{
                width: `${width}px`,
                background: idx === 0 
                  ? currentTheme.primary 
                  : `color-mix(in srgb, ${currentTheme.accent} 35%, transparent)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Item Cards Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div 
              className="h-3 w-32 rounded-md relative overflow-hidden"
              style={{ background: `color-mix(in srgb, ${currentTheme.primary} 30%, transparent)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>
            <div 
              className="h-6 w-48 rounded-lg relative overflow-hidden"
              style={{ background: `color-mix(in srgb, ${currentTheme.deep} 25%, transparent)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
            </div>
          </div>
          <div 
            className="h-4 w-28 rounded-md relative overflow-hidden hidden sm:block"
            style={{ background: `color-mix(in srgb, ${currentTheme.primary} 35%, transparent)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
          </div>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: cardsCount }).map((_, i) => (
            <div 
              key={i}
              className="rounded-3xl p-4 bg-white/85 border border-[var(--theme-accent-light)] shadow-xs space-y-4 relative overflow-hidden"
            >
              {/* Card Image Area Skeleton */}
              <div 
                className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, ${currentTheme.canvas} 70%, white) 0%, color-mix(in srgb, ${currentTheme.accent} 25%, white) 100%)`,
                }}
              >
                <div className="w-12 h-12 rounded-xl border border-white/60 rotate-6 flex items-center justify-center opacity-60">
                  <div className="w-6 h-6 border border-white/40 rounded-md -rotate-6" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <div 
                  className="h-4 w-3/4 rounded-md relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.deep} 22%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div 
                  className="h-3 w-1/2 rounded-md relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.textMuted} 18%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="pt-3 border-t border-[var(--theme-accent-light)] flex items-center justify-between">
                <div 
                  className="h-5 w-20 rounded-md relative overflow-hidden"
                  style={{ background: `color-mix(in srgb, ${currentTheme.deep} 25%, transparent)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
                <div 
                  className="h-8 w-24 rounded-xl relative overflow-hidden shadow-xs"
                  style={{ background: currentTheme.deep }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer-sweep_2s_infinite]" />
                </div>
              </div>

              {/* Ambient diagonal sweep across the entire card */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none -translate-x-full animate-[shimmer-sweep_2.4s_infinite]" />
            </div>
          ))}
        </div>
      </section>

      {/* Floating Center Brand Badge Watermark */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <div 
          className="px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md border text-xs font-semibold"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: currentTheme.accent,
            color: currentTheme.deep,
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
          <span>Synchronizing Community Box...</span>
        </div>
      </div>
    </div>
  );
};

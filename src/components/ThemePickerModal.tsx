import React from 'react';
import { motion } from 'motion/react';
import { X, Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setThemeId, themes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-2xl bg-[#F8F6FA] rounded-3xl border border-[var(--theme-accent)] shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-[var(--theme-accent-light)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-accent-light)] text-[var(--theme-deep)] flex items-center justify-center border border-[var(--theme-accent)]">
              <Palette className="w-5 h-5 text-[var(--theme-primary)]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--theme-deep)]">
                Theme & Color Combinations
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Switch anytime — no sign in required
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close theme picker"
            className="w-9 h-9 rounded-full bg-white border border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Theme Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`p-3.5 rounded-2xl border transition-[border-color,transform] duration-150 hover:scale-[1.01] active:scale-[0.99] text-left flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white border-2 border-[var(--theme-deep)] shadow-md'
                      : 'bg-white border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)]'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 18px ${theme.glow}` : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {theme.previewColors.map((hex, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                      {isActive && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-black text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: theme.deep }}
                        >
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-xs sm:text-sm" style={{ color: theme.deep }}>
                      {theme.name}
                    </div>
                    <div className="text-[11px] text-[var(--theme-text-muted)] font-medium mt-0.5">
                      {theme.subtitle}
                    </div>
                    <p className="text-[10px] text-[var(--theme-text-muted)] line-clamp-2 mt-1 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div
                    className="h-2 w-full rounded-full mt-3 overflow-hidden border border-black/5"
                    style={{ background: theme.gradientShine }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-[var(--theme-accent-light)] flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[var(--theme-text-muted)]">
            Active: <strong className="text-[var(--theme-deep)]">{currentTheme.name}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--theme-deep)] text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

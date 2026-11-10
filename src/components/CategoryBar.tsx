import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Category, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';
import { CategoryIcon } from './CategoryIcon';
import { Sparkles, Search, Check, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  categories?: Category[];
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  const { currentTheme } = useTheme();
  const displayList = categories || CATEGORIES;
  const [customInput, setCustomInput] = useState('');

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectCategory(customInput.trim());
    }
  };

  // Check if selectedCategory is not one of the pre-listed categories
  const isSelectedCustom =
    selectedCategory !== 'all' &&
    !displayList.some((c) => c.id.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="py-6 sm:py-8 bg-white/70 backdrop-blur-md border-b border-[#D4BEE4]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#3B1E54] font-sans flex items-center gap-2">
              <span>Browse by Category</span>
              {selectedCategory !== 'all' && (
                <span className="text-[11px] font-semibold text-[#3B1E54] bg-[#D4BEE4]/45 px-2.5 py-0.5 rounded-full border border-[#D4BEE4] shadow-xs">
                  Active: {selectedCategory}
                </span>
              )}
            </h2>
            <p className="text-xs text-[#5C4B6E]">
              Choose equipment from neighborhood lenders or explore community additions
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onSelectCategory('all');
                setCustomInput('');
              }}
              className="text-xs font-semibold text-[#9B7EBD] hover:underline cursor-pointer self-start sm:self-auto flex items-center gap-1"
            >
              <span>Reset to all items</span>
            </motion.button>
          )}
        </div>

        {/* Responsive Category Cards Grid with Real Item Counts & Gradient Shining Shade */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {displayList.map((cat, idx) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            const count = cat.itemCount || 0;

            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(idx * 0.02, 0.25),
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
                whileHover={{ y: -5, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group card-shine-sweep flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[#9B7EBD] text-[#3B1E54] ring-1 ring-[#9B7EBD]'
                    : 'bg-white/75 hover:bg-white border-[#D4BEE4]/70 hover:border-[#9B7EBD] text-[#5C4B6E] shadow-2xs'
                }`}
                style={{
                  background: isSelected ? currentTheme.gradientShine : undefined,
                  boxShadow: isSelected 
                    ? `0 0 20px ${currentTheme.glow}` 
                    : undefined,
                  borderColor: isSelected ? currentTheme.primary : undefined,
                }}
              >
                {/* Shining gradient ambient corner flare */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${currentTheme.accentLight}, transparent 70%)`
                  }}
                />

                {cat.isCustom && (
                  <span 
                    className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-extrabold text-white uppercase tracking-wider z-10"
                    style={{ backgroundColor: currentTheme.deep }}
                  >
                    Custom
                  </span>
                )}

                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 transition-all duration-300 group-hover:scale-110 shrink-0 z-10"
                  style={{
                    backgroundColor: isSelected ? currentTheme.deep : currentTheme.accentLight,
                    color: isSelected ? currentTheme.accent : currentTheme.deep,
                    boxShadow: isSelected ? `0 0 12px ${currentTheme.glow}` : undefined,
                  }}
                >
                  <CategoryIcon name={cat.iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-1 w-full z-10" title={cat.name}>
                  {cat.isCustom ? cat.name : cat.name.split(' ')[0]}
                </span>
                
                {/* Real Dynamic Number of Items with theme-colored badge */}
                <span
                  className="text-[10px] font-semibold mt-1.5 px-2 py-0.5 rounded-full transition-colors z-10"
                  style={{
                    backgroundColor: isSelected ? currentTheme.deep : currentTheme.accentLight,
                    color: isSelected ? '#ffffff' : currentTheme.deep,
                    border: `1px solid ${isSelected ? currentTheme.deep : currentTheme.accent}`,
                  }}
                >
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Dedicated Custom Category Field - Allows typing any custom category */}
        <div 
          className="mt-4 pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all"
          style={{
            backgroundColor: 'color-mix(in srgb, #ffffff 80%, transparent)',
            borderColor: currentTheme.accent,
            boxShadow: `0 4px 20px ${currentTheme.accentLight}`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4BEE4]/50 text-[#3B1E54] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#3B1E54] flex items-center gap-1.5">
                <span>Custom Category Field</span>
                <span className="text-[10px] font-normal text-[#5C4B6E]">(Type any category)</span>
              </div>
              <p className="text-[11px] text-[#5C4B6E]">
                Need something specific like "Drones", "Camping", "Laptops", or "Gardening"? Type any category below:
              </p>
            </div>
          </div>

          <form onSubmit={handleApplyCustom} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Tag className="w-3.5 h-3.5 text-[#715F85] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type any custom category..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full pl-8.5 pr-8 py-2 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#9B7EBD] shadow-2xs"
              />
              {customInput && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomInput('');
                    if (isSelectedCustom) onSelectCategory('all');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#715F85] hover:text-[#3B1E54]"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-3.5 py-2 bg-[#3B1E54] hover:bg-[#2A143D] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Filter</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

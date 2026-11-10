import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight, X, RefreshCw } from 'lucide-react';
import { Category, CategoryId, ListingType } from '../types';
import { CATEGORIES } from '../data/mockData';

interface TopSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  listingType: ListingType | 'all';
  setListingType: (type: ListingType | 'all') => void;
  onSearchSubmit: () => void;
  categories?: Category[];
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  listingType,
  setListingType,
  onSearchSubmit,
  categories,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="glass-nav bg-white/75 backdrop-blur-md border-b border-[var(--theme-accent-light)] py-3 shadow-xs transition-all relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-2.5">
          
          {/* Symmetrical Left: Segmented Mode Selector with Jitter Pill animation */}
          <div className="flex items-center p-1 bg-[var(--theme-accent-light)] rounded-xl text-xs font-semibold shrink-0 w-full lg:w-auto justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                listingType === 'all'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              All Items
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('rent')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                listingType === 'rent'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              For Rent
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setListingType('exchange')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                listingType === 'exchange'
                  ? 'bg-white text-[var(--theme-deep)] font-bold shadow-xs'
                  : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)]'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-[var(--theme-primary)]" />
              <span>Exchange</span>
            </motion.button>
          </div>

          {/* Symmetrical Center: Search Input Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--theme-text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Cordless drill, mirrorless camera, camping tent, road bike..."
              className="w-full min-h-[48px] pl-11 pr-10 py-3 bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)]/80 focus:bg-white rounded-xl border border-[var(--theme-accent-light)] outline-none text-xs sm:text-sm font-semibold text-[var(--theme-deep)] placeholder-[var(--theme-text-muted)] focus:shadow-[0_0_0_2px_var(--theme-primary),0_0_22px_var(--theme-glow)] transition-all duration-200"
            />
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-deep)] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

          {/* Symmetrical Right: Category Dropdown + Find Button with Jitter tap */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
            {/* Category Select */}
            <div className="flex-1 lg:w-52">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
                className="w-full min-h-[48px] px-4 py-3 bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent-light)]/80 focus:bg-white rounded-xl border border-[var(--theme-accent-light)] outline-none text-xs sm:text-sm font-bold text-[var(--theme-deep)] focus:shadow-[0_0_0_2px_var(--theme-primary),0_0_22px_var(--theme-glow)] transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {(categories || CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.isCustom ? '(Community)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="py-2.5 px-5 bg-[var(--theme-deep)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_18px_var(--theme-glow)] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Find</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </form>
      </div>
    </div>
  );
};

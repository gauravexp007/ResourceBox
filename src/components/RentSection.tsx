import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  DollarSign, 
  Clock, 
  ArrowUpDown
} from 'lucide-react';
import { Item, Category, CategoryId, ItemCondition, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { ItemCard } from './ItemCard';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface RentSectionProps {
  items: Item[];
  savedItemIds: string[];
  currentUser?: User | null;
  onToggleSave: (id: string) => void;
  onSelectItem: (item: Item) => void;
  onRentItem: (item: Item) => void;
  onExchangeItem: (item: Item) => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
  categories?: Category[];
}

export const RentSection: React.FC<RentSectionProps> = ({
  items,
  savedItemIds,
  currentUser,
  onToggleSave,
  onSelectItem,
  onRentItem,
  onExchangeItem,
  onOpenProfile,
  categories,
}) => {
  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [priceBracket, setPriceBracket] = useState<'all' | 'under25' | '25to50' | 'over50'>('all');
  const [durationPref, setDurationPref] = useState<'all' | 'hourly' | 'daily' | 'weekly'>('all');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter items specifically for rental (listingType === 'rent' || 'both')
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Must be rentable
        if (item.listingType !== 'rent' && item.listingType !== 'both') return false;

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'all' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;

        // Price bracket
        if (priceBracket === 'under25' && item.priceDaily >= 25) return false;
        if (priceBracket === '25to50' && (item.priceDaily < 25 || item.priceDaily > 50)) return false;
        if (priceBracket === 'over50' && item.priceDaily <= 50) return false;

        // Duration preference
        if (durationPref === 'hourly' && !item.priceHourly) return false;
        if (durationPref === 'weekly' && !item.priceWeekly) return false;

        // Condition
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceDaily - b.priceDaily;
        if (sortBy === 'price-desc') return b.priceDaily - a.priceDaily;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [items, search, selectedCategory, priceBracket, durationPref, selectedCondition, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceBracket('all');
    setDurationPref('all');
    setSelectedCondition('all');
    setSortBy('featured');
  };

  const hasActiveFilters = 
    search !== '' || 
    selectedCategory !== 'all' || 
    priceBracket !== 'all' || 
    durationPref !== 'all' || 
    selectedCondition !== 'all';

  return (
    <section className="py-10 bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#3B1E54] uppercase tracking-wider mb-1">
              Community Rental Marketplace
            </div>
            <h2 className="text-3xl font-extrabold text-[#3B1E54] font-sans">
              Rent Quality Equipment
            </h2>
            <p className="text-sm text-[#5C4B6E] mt-1">
              Save up to 90% versus buying new. All rentals protected by security deposits and verified reviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D4BEE4] rounded-xl text-xs font-semibold text-[#3B1E54]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#9B7EBD]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-[#D4BEE4] rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#715F85]" />
              <span className="text-[#715F85] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-[#3B1E54] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filter Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white rounded-2xl border border-[#D4BEE4] p-5 sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#D4BEE4]/40">
                <div className="flex items-center gap-2 text-sm font-bold text-[#3B1E54]">
                  <SlidersHorizontal className="w-4 h-4 text-[#9B7EBD]" />
                  <span>Refine Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-[#E76F51] hover:underline font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                  Keywords
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#715F85] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search drill, bike, camera..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#EEEEEE]/50 border border-[#D4BEE4] rounded-xl text-[#3B1E54] placeholder-[#715F85] focus:outline-none focus:border-[#9B7EBD]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#D4BEE4]/45 text-[#3B1E54] font-bold'
                        : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {(categories || CATEGORIES).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-[#D4BEE4]/45 text-[#3B1E54] font-bold'
                          : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                      }`}
                    >
                      <span>{cat.name} {cat.isCustom ? '(Community)' : ''}</span>
                      <span className="text-[11px] text-[#715F85]">{cat.itemCount || ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Price Range */}
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                  Daily Rental Rate
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'Any Price' },
                    { id: 'under25', label: '< $25/day' },
                    { id: '25to50', label: '$25 – $50' },
                    { id: 'over50', label: '$50+/day' }
                  ].map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => setPriceBracket(bracket.id as any)}
                      className={`px-2 py-1.5 rounded-lg text-xs text-center border transition-all ${
                        priceBracket === bracket.id
                          ? 'bg-[#D4BEE4]/45 border-[#9B7EBD] text-[#3B1E54] font-bold'
                          : 'bg-white border-[#D4BEE4] text-[#5C4B6E] hover:bg-[#D4BEE4]/15'
                      }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rental Duration Preference */}
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                  Duration Options
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All durations (flexible)' },
                    { id: 'hourly', label: 'Offers hourly rates' },
                    { id: 'weekly', label: 'Offers weekly discounts' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDurationPref(opt.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        durationPref === opt.id
                          ? 'bg-[#D4BEE4]/45 text-[#3B1E54] font-bold'
                          : 'text-[#5C4B6E] hover:bg-[#D4BEE4]/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold text-[#3B1E54] mb-2 uppercase tracking-wider">
                  Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#EEEEEE]/50 border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#9B7EBD]"
                >
                  <option value="all">Any Condition</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Main Results Grid */}
          <div className="lg:col-span-3">
            {/* Results counter & active pills */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D4BEE4]/40">
              <div className="text-xs font-medium text-[#5C4B6E]">
                Showing <span className="font-bold text-[#3B1E54]">{filteredItems.length}</span> rental resources
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#9B7EBD] hover:underline font-semibold"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Grid of items */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isSaved={savedItemIds.includes(item.id)}
                    onToggleSave={onToggleSave}
                    onSelect={onSelectItem}
                    onRentClick={onRentItem}
                    onExchangeClick={onExchangeItem}
                    currentUserId={currentUser?.id}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            ) : (
              /* Polished Empty State */
              <div className="bg-white rounded-2xl border border-[#D4BEE4] p-12 text-center max-w-md mx-auto my-8">
                <div className="w-12 h-12 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#3B1E54]">No rental items found</h3>
                <p className="text-xs text-[#5C4B6E] mt-1 mb-5">
                  Try adjusting your price filter or search keywords to explore available equipment.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#3B1E54] text-white rounded-xl text-xs font-semibold hover:bg-[#2A143D] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

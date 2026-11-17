import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Item, Category, CategoryId, ItemCondition, User } from '../types';
import { ItemCard } from './ItemCard';
import { CatInBoxErrorState } from './CatInBoxErrorState';

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
  externalSearch?: string;
  externalCategory?: CategoryId | 'all';
}

export const RentSection: React.FC<RentSectionProps> = ({
  items,
  savedItemIds,
  currentUser,
  onToggleSave,
  onSelectItem,
  onRentItem,
  onExchangeItem,
  externalSearch = '',
  externalCategory = 'all',
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  useEffect(() => {
    setSelectedCondition('all');
  }, [externalSearch, externalCategory]);

  // Filter items specifically for rental (listingType === 'rent' || 'both')
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.listingType !== 'rent' && item.listingType !== 'both') return false;

        if (externalSearch.trim()) {
          const q = externalSearch.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        if (externalCategory !== 'all' && item.category?.toLowerCase() !== externalCategory.toLowerCase()) {
          return false;
        }

        if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceDaily - b.priceDaily;
        if (sortBy === 'price-desc') return b.priceDaily - a.priceDaily;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [items, externalSearch, externalCategory, selectedCondition, sortBy]);

  return (
    <section className="py-10 bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clean Heading + Single Line Description + Compact Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[var(--theme-accent-light)]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-deep)] font-sans">
              Available for Rent
            </h2>
            <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-1">
              Borrow tools, electronics, and everyday gear directly from verified community members.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-[var(--theme-accent)] rounded-xl text-[var(--theme-deep)] focus:outline-none focus:border-[var(--theme-primary)] cursor-pointer"
            >
              <option value="all">Any Condition</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <div className="flex items-center gap-2 bg-white border border-[var(--theme-accent)] rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-[var(--theme-deep)] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listed Rental Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <CatInBoxErrorState
            type="404"
            title="No Rental Items Found"
            message="No rental listings matched your filters. Try adjusting your search or category."
            className="my-6 shadow-xs"
          />
        )}

      </div>
    </section>
  );
};

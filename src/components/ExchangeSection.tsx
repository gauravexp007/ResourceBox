import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  Star,
  Heart
} from 'lucide-react';
import { Item, Category, CategoryId, ItemCondition, User } from '../types';
import { CatInBoxErrorState } from './CatInBoxErrorState';
import { AddToCartButton } from './AddToCartButton';
import { ViewDetailsButton } from './ViewDetailsButton';

interface ExchangeSectionProps {
  items: Item[];
  savedItemIds: string[];
  currentUser?: User | null;
  onToggleSave: (id: string) => void;
  onSelectItem: (item: Item) => void;
  onProposeExchange: (item: Item) => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
  onSelectCreator?: (creatorId: string) => void;
  categories?: Category[];
  externalSearch?: string;
  externalCategory?: CategoryId | 'all';
}

export const ExchangeSection: React.FC<ExchangeSectionProps> = ({
  items,
  savedItemIds,
  currentUser,
  onToggleSave,
  onSelectItem,
  onProposeExchange,
  onSelectCreator,
  externalSearch = '',
  externalCategory = 'all',
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');

  const exchangeItems = useMemo(() => {
    return items.filter((item) => {
      if (item.listingType !== 'exchange' && item.listingType !== 'both') return false;

      if (externalSearch.trim()) {
        const q = externalSearch.toLowerCase();
        const bareQ = q.replace(/^@/, '');
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchWish = item.preferredExchangeItems?.some((w) => w.toLowerCase().includes(q));
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchOwnerName = (item.owner?.name || '').toLowerCase().includes(q);
        const matchOwnerHandle = (item.owner?.username || '').toLowerCase().replace(/^@/, '').includes(bareQ);
        if (!matchTitle && !matchWish && !matchDesc && !matchOwnerName && !matchOwnerHandle) return false;
      }

      if (externalCategory !== 'all' && item.category?.toLowerCase() !== externalCategory.toLowerCase()) return false;
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

      return true;
    });
  }, [items, externalSearch, externalCategory, selectedCondition]);

  return (
    <section className="py-10 bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clean Heading + Single Line Description + Condition Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[var(--theme-accent-light)]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-deep)] font-sans">
              Available for Exchange
            </h2>
            <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-1">
              Swap tools, electronics, and everyday items directly with verified community members.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
          </div>
        </div>

        {/* Exchange Cards Grid or Polished Empty State */}
        {exchangeItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-[#D4BEE4] p-4 flex flex-col justify-between hover:shadow-lg hover:border-[#9B7EBD] transition-all group"
              >
                <div>
                  {/* Header: Clickable Owner Info */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D4BEE4]/40">
                    <button
                      type="button"
                      onClick={() => item.owner?.id && onSelectCreator?.(item.owner.id)}
                      className="flex items-center gap-2.5 text-left group/owner cursor-pointer rounded-xl pr-2 py-0.5 hover:bg-[#FAF8FC] transition-colors"
                      title={`View ${item.owner.username || item.owner.name}'s profile`}
                    >
                      <img 
                        src={item.owner.avatar} 
                        alt={item.owner.name} 
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-[#D4BEE4] group-hover/owner:ring-[#9B7EBD] transition-all" 
                      />
                      <div>
                        <div className="text-xs font-bold text-[#3B1E54] group-hover/owner:text-[#9B7EBD] flex items-center gap-1 transition-colors">
                          <span>
                            {item.owner.username
                              ? item.owner.username.startsWith('@')
                                ? item.owner.username
                                : `@${item.owner.username}`
                              : item.owner.name}
                          </span>
                          {item.owner.verified && <CheckCircle2 className="w-3 h-3 text-[#9B7EBD]" />}
                        </div>
                        <div className="text-[11px] text-[#5C4B6E]">
                          <span>{item.owner.username ? item.owner.name : 'Verified Member'}</span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 text-xs text-[#E76F51] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.owner.rating}</span>
                    </div>
                  </div>

                  {/* Item Image */}
                  <div className="relative mb-3.5">
                    <div 
                      className="relative aspect-video rounded-xl overflow-hidden bg-[#EEEEEE] cursor-pointer shadow-xs group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-0.5"
                      onClick={() => onSelectItem(item)}
                    >
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                        {item.condition}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        aria-label="Save item"
                        title={savedItemIds.includes(item.id) ? 'Remove from saved' : 'Save item'}
                        className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                          savedItemIds.includes(item.id)
                            ? 'bg-[#E76F51] text-white shadow-sm'
                            : 'bg-white/85 text-[#3B1E54] hover:bg-white hover:text-[#E76F51]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${savedItemIds.includes(item.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 
                    onClick={() => onSelectItem(item)}
                    className="text-xl sm:text-2xl font-extrabold text-[#3B1E54] line-clamp-1 cursor-pointer group-hover:text-[#9B7EBD] transition-colors tracking-tight"
                  >
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#5C4B6E] line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlighted Wishlist Section */}
                  <div className="mt-4 p-3 rounded-xl bg-[#D4BEE4]/30 border border-[#D4BEE4]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
                      <RefreshCw className="w-3.5 h-3.5 text-[#9B7EBD]" />
                      <span>Owner seeks in exchange:</span>
                    </div>
                    
                    {item.preferredExchangeItems && item.preferredExchangeItems.length > 0 ? (
                      <ul className="space-y-1.5">
                        {item.preferredExchangeItems.map((wish, idx) => (
                          <li key={idx} className="text-base sm:text-lg text-[#3B1E54] flex items-center gap-2 font-bold leading-snug">
                            <span className="w-2 h-2 rounded-full bg-[#9B7EBD] shrink-0" />
                            <span>{wish}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#5C4B6E]">Open to fair value barter proposals</p>
                    )}

                    {item.exchangeNotes && (
                      <p className="text-[11px] text-[#5C4B6E] mt-2 pt-2 border-t border-[#D4BEE4]/50 italic">
                        "{item.exchangeNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-[#D4BEE4]/40 grid grid-cols-2 gap-2 items-center">
                  <ViewDetailsButton
                    label="Full Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                  />
                  {currentUser && (
                    item.owner.id === currentUser.id ||
                    (currentUser as any).uid === item.owner.id ||
                    (item as any).ownerId === currentUser.id ||
                    ((item as any).ownerEmail && currentUser.email && (item as any).ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
                    (item.owner?.name && currentUser.name && item.owner.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
                  ) ? (
                    <button
                      type="button"
                      onClick={() => onSelectItem(item)}
                      className="py-2.5 px-3 rounded-xl bg-[#D4BEE4]/45 text-[#3B1E54] border border-[#D4BEE4] text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      title="This is your own listing"
                    >
                      <span>Your Product</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onProposeExchange(item)}
                      className="py-2.5 px-3 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-semibold transition-all shadow-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Propose Exchange</span>
                    </button>
                  )}
                </div>

                {/* Animated Add to Cart Button (catraco / plastic-moth-91) */}
                <div className="mt-2.5">
                  <AddToCartButton
                    isAdded={savedItemIds.includes(item.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(item.id);
                    }}
                    size="sm"
                  />
                </div>

              </div>
            ))}
          </div>
        ) : (
          <CatInBoxErrorState
            type="404"
            title="No Exchange Resources Found"
            message="No barter items matched your search. Adjust your keywords or be the first to list a swap offer!"
            className="my-6 shadow-xs"
          />
        )}

      </div>
    </section>
  );
};

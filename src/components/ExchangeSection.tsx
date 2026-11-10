import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Star
} from 'lucide-react';
import { Item, Category, CategoryId, ItemCondition, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface ExchangeSectionProps {
  items: Item[];
  savedItemIds: string[];
  currentUser?: User | null;
  onToggleSave: (id: string) => void;
  onSelectItem: (item: Item) => void;
  onProposeExchange: (item: Item) => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
  categories?: Category[];
}

export const ExchangeSection: React.FC<ExchangeSectionProps> = ({
  items,
  currentUser,
  onSelectItem,
  onProposeExchange,
  onOpenProfile,
  categories,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');

  const exchangeItems = useMemo(() => {
    return items.filter((item) => {
      // Must be exchangeable
      if (item.listingType !== 'exchange' && item.listingType !== 'both') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchWish = item.preferredExchangeItems?.some(w => w.toLowerCase().includes(q));
        if (!matchTitle && !matchWish) return false;
      }

      if (selectedCategory !== 'all' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

      return true;
    });
  }, [items, search, selectedCategory, selectedCondition]);

  return (
    <section className="py-10 bg-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Explaining Community Barter */}
        <div className="bg-gradient-to-r from-[#3B1E54] via-[#2A143D] to-[#1C0D2A] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(212,190,228,0.2),transparent)] pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D4BEE4] text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Direct Exchange Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              Trade What You Have for What You Need.
            </h2>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">
              Propose an item from your own collection or maker space to swap temporarily or permanently with verified members.
            </p>

            {/* 3 Step Barter Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#D4BEE4] text-[#3B1E54] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <span className="text-xs text-white/90">Find items matching what you have or want</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#D4BEE4] text-[#3B1E54] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <span className="text-xs text-white/90">Submit proposal with your item photo & terms</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#D4BEE4] text-[#3B1E54] text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <span className="text-xs text-white/90">Chat, agree on exchange date, and meet up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#3B1E54] font-['Plus_Jakarta_Sans']">
              Available for Exchange
            </h3>
            <p className="text-xs text-[#5C4B6E]">
              {exchangeItems.length} active items currently accepting exchange proposals
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#715F85] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items or wanted wishlist..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] placeholder-[#715F85] focus:outline-none focus:border-[#9B7EBD]"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#9B7EBD] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {(categories || CATEGORIES).map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isCustom ? '(Community)' : ''}
                </option>
              ))}
            </select>

            {/* Condition */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#9B7EBD] cursor-pointer"
            >
              <option value="all">Any Condition</option>
              <option value="Like New">Like New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
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
                  {/* Header: Owner Info */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D4BEE4]/40">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={item.owner.avatar} 
                        alt={item.owner.name} 
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-[#D4BEE4]" 
                      />
                      <div>
                        <div className="text-xs font-bold text-[#3B1E54] flex items-center gap-1">
                          <span>{item.owner.name}</span>
                          {item.owner.verified && <CheckCircle2 className="w-3 h-3 text-[#9B7EBD]" />}
                        </div>
                        <div className="text-[11px] text-[#5C4B6E]">
                          <span>Verified Member</span>
                        </div>
                      </div>
                    </div>

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
                    </div>
                  </div>

                  <h4 
                    onClick={() => onSelectItem(item)}
                    className="text-base font-bold text-[#3B1E54] line-clamp-1 cursor-pointer group-hover:text-[#9B7EBD] transition-colors"
                  >
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#5C4B6E] line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlighted Wishlist Section */}
                  <div className="mt-4 p-3 rounded-xl bg-[#D4BEE4]/30 border border-[#D4BEE4]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#9B7EBD]" />
                      <span>Owner seeks in exchange:</span>
                    </div>
                    
                    {item.preferredExchangeItems && item.preferredExchangeItems.length > 0 ? (
                      <ul className="space-y-1">
                        {item.preferredExchangeItems.map((wish, idx) => (
                          <li key={idx} className="text-xs text-[#3B1E54] flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9B7EBD]" />
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
                <div className="mt-5 pt-3 border-t border-[#D4BEE4]/40 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectItem(item)}
                    className="py-2.5 px-3 rounded-xl border border-[#D4BEE4] hover:border-[#9B7EBD] bg-white text-xs font-semibold text-[#3B1E54] transition-all text-center cursor-pointer"
                  >
                    Full Details
                  </button>
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

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#D4BEE4] p-12 text-center max-w-md mx-auto my-6 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#3B1E54]">No exchange resources found</h3>
            <p className="text-xs text-[#5C4B6E] mt-1 mb-4 leading-relaxed">
              Only items added by authorized community members are shown. Publish an item or adjust your search to start bartering!
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Star, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Item, User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ItemCardProps {
  item: Item;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (item: Item) => void;
  onRentClick: (item: Item) => void;
  onExchangeClick: (item: Item) => void;
  currentUserId?: string;
  currentUser?: User | null;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onSelect,
  onRentClick,
  onExchangeClick,
  currentUserId,
  currentUser,
}) => {
  const { currentTheme } = useTheme();
  const isOwner = Boolean(
    (currentUserId && (item.owner?.id === currentUserId || (item as any).ownerId === currentUserId)) ||
    (currentUser && (
      item.owner?.id === currentUser.id ||
      (currentUser as any).uid === item.owner?.id ||
      (item as any).ownerId === currentUser.id ||
      ((item as any).ownerEmail && currentUser.email && (item as any).ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (item.owner?.name && currentUser.name && item.owner.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
    ))
  );
  const isRentable = item.listingType === 'rent' || item.listingType === 'both';
  const isExchangeable = item.listingType === 'exchange' || item.listingType === 'both';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -7, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
      className="group glass-card card-shine-sweep card-gradient-border rounded-3xl border border-[var(--theme-accent-light)] overflow-hidden transition-all duration-300 flex flex-col will-change-transform relative hover:border-[var(--theme-primary)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1),0_0_28px_var(--theme-glow),0_0_55px_var(--theme-accent-light)]"
      style={{
        backgroundImage: `radial-gradient(circle at 95% 8%, var(--theme-accent-light) 0%, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)`,
      }}
    >
      {/* Luminous dynamic gradient wash that smoothly brightens on card hover */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 95% 75% at 92% -10%, color-mix(in srgb, ${currentTheme.primary} 22%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 85% 65% at 8% 110%, color-mix(in srgb, ${currentTheme.accent} 28%, transparent) 0%, transparent 60%),
            linear-gradient(135deg, color-mix(in srgb, ${currentTheme.accentLight} 85%, transparent) 0%, transparent 45%, color-mix(in srgb, ${currentTheme.deep} 10%, transparent) 100%)
          `,
        }}
      />

      {/* Top-Right radiant ambient glow flare on hover */}
      <div 
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl transform group-hover:scale-110 z-0"
        style={{ background: currentTheme.glowStrong }}
        aria-hidden="true"
      />

      {/* Bottom-Left subtle secondary accent flare on hover */}
      <div 
        className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-65 transition-all duration-500 blur-2xl transform group-hover:scale-110 z-0"
        style={{ background: currentTheme.accent }}
        aria-hidden="true"
      />

      {/* Image Container with Interactive Geometric Square Behind It */}
      <div className="relative p-3 pb-0 z-10">
        
        {/* Interactive Square Behind the Image */}
        <div 
          className="absolute inset-x-3 inset-y-1 rounded-2xl bg-gradient-to-tr from-[var(--theme-accent-light)] via-[var(--theme-accent)]/20 to-transparent border border-[var(--theme-accent)]/40 group-hover:bg-gradient-to-tr group-hover:from-[var(--theme-primary)]/20 group-hover:via-[var(--theme-accent)]/35 group-hover:to-[var(--theme-accent-light)] group-hover:rotate-2 group-hover:scale-[1.03] transition-all duration-300 ease-out pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${currentTheme.glow}`
          }}
          aria-hidden="true"
        />

        {/* Foreground Image Thumbnail Container */}
        <div 
          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EEEEEE] cursor-pointer shadow-xs group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-0.5" 
          onClick={() => onSelect(item)}
        >
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            loading="lazy"
          />

          {/* Floating gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-60 pointer-events-none" />

          {/* Top Badges: Type Indicator & Save Button */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              {item.listingType === 'both' && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#3B1E54]/90 backdrop-blur-md rounded-lg shadow-xs">
                  Rent & Exchange
                </span>
              )}
              {item.listingType === 'rent' && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#3B1E54]/95 backdrop-blur-md rounded-lg shadow-xs">
                  For Rent
                </span>
              )}
              {item.listingType === 'exchange' && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-[#3B1E54] bg-[#D4BEE4]/95 backdrop-blur-md rounded-lg shadow-xs flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-[#3B1E54]" />
                  Exchange
                </span>
              )}
              {item.featured && (
                <span className="px-2 py-0.5 text-[10px] font-semibold text-[#D4BEE4] bg-[#3B1E54]/90 backdrop-blur-md rounded-lg">
                  Featured
                </span>
              )}
            </div>

            {/* Jitter spring heart button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.75 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(item.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#E76F51] text-white shadow-sm'
                  : 'bg-white/85 text-[#3B1E54] hover:bg-white hover:text-[#E76F51]'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save item'}
              aria-label="Save item"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Bottom Overlay: Condition & Verification Badge */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs drop-shadow-sm z-10 pointer-events-none">
            <span className="text-[11px] text-white/95 bg-black/40 px-2.5 py-0.5 rounded-lg backdrop-blur-xs font-medium">
              {item.condition} Condition
            </span>
            <span className="text-[11px] text-white/90 bg-[#3B1E54]/80 px-2 py-0.5 rounded-lg backdrop-blur-xs font-semibold capitalize">
              {item.category}
            </span>
          </div>
        </div>

      </div>

      {/* Content Body */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#5C4B6E] mb-1 font-medium">
            <span className="capitalize">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>Min {item.minRentalDays} day{item.minRentalDays > 1 ? 's' : ''}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(item)}
            className="text-base font-bold text-[var(--theme-deep)] line-clamp-1 group-hover:text-[var(--theme-primary)] transition-colors cursor-pointer"
            title={item.title}
          >
            {item.title}
          </h3>

          <p className="text-xs text-[var(--theme-text-muted)] line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>

          {/* Exchange Wishlist Callout if exchangeable */}
          {isExchangeable && item.preferredExchangeItems && item.preferredExchangeItems.length > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-[var(--theme-accent-light)] border border-[var(--theme-accent)]/50 text-xs">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--theme-deep)] uppercase tracking-wider mb-0.5">
                <RefreshCw className="w-3 h-3 text-[var(--theme-primary)]" />
                <span>Wants to swap for:</span>
              </div>
              <p className="text-[var(--theme-deep)] line-clamp-1 text-xs">
                {item.preferredExchangeItems.slice(0, 2).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* Pricing, Owner & Action Bar */}
        <div className="mt-4 pt-3 border-t border-[var(--theme-accent-light)]">
          <div className="flex items-center justify-between mb-3">
            {/* Price display with country currency */}
            <div>
              {isRentable ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-[var(--theme-deep)] font-['Plus_Jakarta_Sans']">
                      {item.priceRateText || `${item.currencySymbol || '₹'}${item.priceDaily} / day`}
                    </span>
                  </div>
                  {item.availableTimeWindow && (
                    <span className="flex items-center gap-1 text-[10px] text-[var(--theme-primary)] font-semibold mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.availableTimeWindow}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold text-[var(--theme-deep)] uppercase tracking-wider block">
                    Barter Exchange
                  </span>
                  <span className="text-[11px] text-[var(--theme-text-muted)]">Direct item swap</span>
                </div>
              )}
            </div>

            {/* Owner Mini Avatar & Rating */}
            <div className="flex items-center gap-2 text-right">
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--theme-deep)] leading-tight">
                  {item.owner.name.split(' ')[0]}
                </div>
                <div className="flex items-center justify-end gap-0.5 text-[11px] text-[var(--theme-text-muted)]">
                  <Star className="w-3 h-3 text-[#E76F51] fill-current" />
                  <span>{item.owner.rating}</span>
                </div>
              </div>
              <img
                src={item.owner.avatar}
                alt={item.owner.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--theme-accent)]"
              />
            </div>
          </div>

          {/* Action Buttons with Jitter spring tap and theme glowing */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => onSelect(item)}
              className="w-full py-2 px-2.5 rounded-xl border border-[var(--theme-accent-light)] hover:border-[var(--theme-primary)] bg-white/80 hover:bg-[var(--theme-accent-light)] text-xs font-semibold text-[var(--theme-deep)] transition-all text-center cursor-pointer hover:shadow-[0_0_12px_var(--theme-glow)]"
            >
              Details
            </motion.button>

            {isOwner ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => onSelect(item)}
                className="w-full py-2 px-2.5 rounded-xl bg-[var(--theme-accent-light)] hover:bg-[var(--theme-accent)]/30 text-[var(--theme-deep)] text-xs font-bold border border-[var(--theme-accent)] text-center flex items-center justify-center gap-1 cursor-pointer"
                title="You own this resource (View Only)"
              >
                <span>Your Product</span>
              </motion.button>
            ) : isRentable ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => onRentClick(item)}
                className="w-full py-2 px-2.5 rounded-xl bg-[var(--theme-deep)] hover:bg-gradient-to-r hover:from-[var(--theme-deep)] hover:to-[var(--theme-primary)] text-white text-xs font-semibold shadow-xs text-center flex items-center justify-center gap-1 cursor-pointer transition-all hover:shadow-[0_0_20px_var(--theme-glow)]"
              >
                <span>Rent Now</span>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => onExchangeClick(item)}
                className="w-full py-2 px-2.5 rounded-xl bg-[var(--theme-deep)] hover:bg-gradient-to-r hover:from-[var(--theme-deep)] hover:to-[var(--theme-primary)] text-white text-xs font-semibold shadow-xs text-center flex items-center justify-center gap-1 cursor-pointer transition-all hover:shadow-[0_0_20px_var(--theme-glow)]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Propose Swap</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

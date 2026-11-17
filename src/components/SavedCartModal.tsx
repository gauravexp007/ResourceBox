import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  ShoppingCart,
  Heart,
  Trash2,
  RefreshCw,
  ArrowRight,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import { Item, User } from '../types';
import { ViewDetailsButton } from './ViewDetailsButton';

interface SavedCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: Item[];
  currentUser: User | null;
  onRemoveItem: (itemId: string) => void;
  onClearAll: () => void;
  onSelectItem: (item: Item) => void;
  onRentItem: (item: Item) => void;
  onExchangeItem: (item: Item) => void;
  onBrowseCatalog: () => void;
}

export const SavedCartModal: React.FC<SavedCartModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  currentUser,
  onRemoveItem,
  onClearAll,
  onSelectItem,
  onRentItem,
  onExchangeItem,
  onBrowseCatalog,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Saved & Liked Products Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 18 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-[var(--theme-accent)] max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Saved and liked products"
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--theme-accent-light)] bg-[#FAF8FC] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-deep)] text-white flex items-center justify-center shadow-xs shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[var(--theme-deep)] truncate">
                  Saved &amp; Liked Products
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[var(--theme-accent-light)] text-[var(--theme-deep)] border border-[var(--theme-accent)]">
                  {savedItems.length}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--theme-text-muted)] truncate">
                {currentUser
                  ? 'Stored to your account for quick future access across sessions'
                  : 'Stored for quick access — sign in anytime to sync across devices'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {savedItems.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2.5 py-1.5 rounded-xl border border-[var(--theme-accent)] text-[11px] font-bold text-[#C84A3B] hover:bg-[#FFF5F4] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close saved products"
              className="p-2 rounded-full bg-[#EEEEEE] text-[#5C4B6E] hover:text-[#3B1E54] hover:bg-[var(--theme-accent-light)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: Stored Product Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#EEEEEE]/45">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedItems.map((item) => {
                const isRentable = item.listingType === 'rent' || item.listingType === 'both';
                const isOwner = Boolean(
                  currentUser &&
                    (item.owner?.id === currentUser.id ||
                      (currentUser as any).uid === item.owner?.id ||
                      (item as any).ownerId === currentUser.id)
                );

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-[var(--theme-accent)] p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[var(--theme-primary)] transition-all"
                  >
                    <div>
                      <div className="flex gap-3">
                        <div
                          onClick={() => {
                            onClose();
                            onSelectItem(item);
                          }}
                          className="w-24 h-20 rounded-xl overflow-hidden bg-[#EEEEEE] shrink-0 cursor-pointer border border-[var(--theme-accent-light)]"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)] truncate">
                              {item.category} · {item.condition}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              aria-label={`Remove ${item.title} from saved products`}
                              title="Remove from saved"
                              className="p-1 rounded-lg text-[var(--theme-text-muted)] hover:text-[#C84A3B] hover:bg-[#FFF5F4] transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h3
                            onClick={() => {
                              onClose();
                              onSelectItem(item);
                            }}
                            className="text-sm sm:text-base font-extrabold text-[var(--theme-deep)] line-clamp-1 cursor-pointer hover:text-[var(--theme-primary)] mt-0.5"
                          >
                            {item.title}
                          </h3>

                          <div className="mt-1.5">
                            {isRentable ? (
                              <span className="text-sm font-extrabold text-[var(--theme-deep)]">
                                {item.priceRateText || `${item.currencySymbol || '₹'}${item.priceDaily} / day`}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--theme-deep)] bg-[var(--theme-accent-light)] px-2 py-0.5 rounded-md">
                                <RefreshCw className="w-3 h-3 text-[var(--theme-primary)]" />
                                <span>Barter Exchange</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[var(--theme-accent-light)] flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <ViewDetailsButton
                          label="View Details"
                          onClick={() => {
                            onClose();
                            onSelectItem(item);
                          }}
                        />
                      </div>

                      {!isOwner && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (isRentable) {
                              onRentItem(item);
                            } else {
                              onExchangeItem(item);
                            }
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-[var(--theme-deep)] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <span>{isRentable ? 'Rent Now' : 'Propose Swap'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[var(--theme-accent)] p-8 sm:p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--theme-accent-light)] text-[var(--theme-deep)] mx-auto flex items-center justify-center">
                <Heart className="w-7 h-7 text-[var(--theme-primary)]" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-base font-extrabold text-[var(--theme-deep)]">
                  Your saved collection is empty
                </h3>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1 leading-relaxed">
                  Click the <strong>Add to Cart</strong> button or heart icon on any product card to store liked items here for future access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseCatalog();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--theme-deep)] text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>Browse Marketplace</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Sync Indicator */}
        {savedItems.length > 0 && (
          <div className="px-5 sm:px-6 py-3 border-t border-[var(--theme-accent-light)] bg-white flex items-center justify-between text-[11px] text-[var(--theme-text-muted)] shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <BookmarkCheck className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>
                {currentUser
                  ? 'Saved items automatically sync with your profile'
                  : 'Saved on this browser for quick return'}
              </span>
            </span>
            <span className="font-bold text-[var(--theme-deep)]">
              {savedItems.length} item{savedItems.length === 1 ? '' : 's'} stored
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  ArrowRight, 
  Plus, 
  Check, 
  DollarSign, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Item, ItemCondition, User } from '../types';
import { SAMPLE_PHOTO_LIBRARY } from '../data/mockData';
import { CatInBoxErrorState } from './CatInBoxErrorState';

interface ProposeExchangeModalProps {
  targetItem: Item | null;
  currentUser: User | null;
  userItems: Item[];
  onClose: () => void;
  onSubmitProposal: (proposalData: {
    targetItem: Item;
    offeredItemTitle: string;
    offeredItemCategory: string;
    offeredItemImage: string;
    offeredItemCondition: ItemCondition;
    cashTopUp: number;
    message: string;
  }) => void;
  onOpenAuth: () => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
}

export const ProposeExchangeModal: React.FC<ProposeExchangeModalProps> = ({
  targetItem,
  currentUser,
  userItems,
  onClose,
  onSubmitProposal,
  onOpenAuth,
  onOpenProfile,
}) => {
  // Selected item from user's inventory OR custom item
  const [useExisting, setUseExisting] = useState(userItems.length > 0);
  const [selectedExistingId, setSelectedExistingId] = useState(userItems[0]?.id || '');
  
  // Custom offer fields
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState(targetItem?.category || 'tools');
  const [customImage, setCustomImage] = useState(SAMPLE_PHOTO_LIBRARY[0].url);
  const [customCondition, setCustomCondition] = useState<ItemCondition>('Excellent');
  
  // Cash balance & message
  const [cashTopUp, setCashTopUp] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!targetItem) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full z-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3B1E54]">Sign in to Propose an Exchange</h3>
          <p className="text-xs text-[#715F85]">
            You must be logged into a verified local account to propose an exchange with {targetItem.owner.name}.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#715F85]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex-1 py-2 rounded-xl bg-[#3B1E54] text-white text-xs font-bold"
            >
              Sign In / Switch Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalTitle = '';
    let finalCategory = '';
    let finalImage = '';
    let finalCondition: ItemCondition = 'Excellent';

    if (useExisting && userItems.length > 0) {
      const found = userItems.find(i => i.id === selectedExistingId);
      if (!found) {
        setError('Please select an item to offer');
        return;
      }
      finalTitle = found.title;
      finalCategory = found.category;
      finalImage = found.images[0];
      finalCondition = found.condition;
    } else {
      if (!customTitle.trim()) {
        setError('Please enter a name for the item you are offering');
        return;
      }
      finalTitle = customTitle.trim();
      finalCategory = customCategory;
      finalImage = customImage;
      finalCondition = customCondition;
    }

    onSubmitProposal({
      targetItem,
      offeredItemTitle: finalTitle,
      offeredItemCategory: finalCategory,
      offeredItemImage: finalImage,
      offeredItemCondition: finalCondition,
      cashTopUp: Number(cashTopUp) || 0,
      message: message.trim() || `Hi ${targetItem.owner.name.split(' ')[0]}, I'd love to exchange my ${finalTitle} for your ${targetItem.title}. Let me know if you are interested!`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#D4BEE4] max-w-xl w-full z-10 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF2EF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#3B1E54]">Propose an Item Exchange</h3>
              <p className="text-xs text-[#715F85]">With neighbor {targetItem.owner.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#715F85] hover:text-[#3B1E54] hover:bg-[#FAF8FC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item summary card */}
        <div className="my-4 p-3 rounded-2xl bg-[#F8FAF8] border border-[#D4BEE4] flex items-center gap-3">
          <img
            src={targetItem.images[0]}
            alt={targetItem.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#D4BEE4]"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#3B1E54] uppercase tracking-wider block">
              You want to borrow / swap:
            </span>
            <h4 className="text-xs font-bold text-[#3B1E54] truncate">{targetItem.title}</h4>
            {targetItem.preferredExchangeItems && (
              <p className="text-[11px] text-[#715F85] truncate mt-0.5">
                Owner wishlist: {targetItem.preferredExchangeItems.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Offer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <CatInBoxErrorState
              type="request"
              message={error}
              onClose={() => setError('')}
              actionText="Retry Proposal"
              onRetry={() => setError('')}
              className="my-2 shadow-xs"
            />
          )}

          {/* Toggle between existing inventory and new offer */}
          <div>
            <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-2">
              What will you offer in return?
            </label>
            
            {userItems.length > 0 && (
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUseExisting(true)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    useExisting
                      ? 'bg-[#D4BEE4]/40 border-[#3B1E54] text-[#3B1E54]'
                      : 'bg-white border-[#D4BEE4] text-[#715F85]'
                  }`}
                >
                  From My Listings ({userItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUseExisting(false)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    !useExisting
                      ? 'bg-[#D4BEE4]/40 border-[#3B1E54] text-[#3B1E54]'
                      : 'bg-white border-[#D4BEE4] text-[#715F85]'
                  }`}
                >
                  Offer a Different Item
                </button>
              </div>
            )}

            {useExisting && userItems.length > 0 ? (
              <div className="space-y-2">
                {userItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedExistingId === item.id
                        ? 'border-[#3B1E54] bg-[#FAF8FC] ring-1 ring-[#3B1E54]'
                        : 'border-[#D4BEE4] hover:bg-[#FAF8FC]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="existingItem"
                      checked={selectedExistingId === item.id}
                      onChange={() => setSelectedExistingId(item.id)}
                      className="accent-[#3B1E54]"
                    />
                    <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#3B1E54] truncate">{item.title}</p>
                      <span className="text-[11px] text-[#715F85] capitalize">{item.category} · {item.condition}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3 bg-[#FAF8FC] p-3.5 rounded-2xl border border-[#D4BEE4]">
                <div>
                  <label className="block text-[11px] font-semibold text-[#715F85] mb-1">
                    Item Name & Model
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., Korg Minilogue Synthesizer, Dewalt Mitre Saw, Osprey 65L..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54] focus:outline-none focus:border-[#3B1E54]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#715F85] mb-1">
                      Condition
                    </label>
                    <select
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54]"
                    >
                      <option value="Like New">Like New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#715F85] mb-1">
                      Select Sample Photo
                    </label>
                    <select
                      value={customImage}
                      onChange={(e) => setCustomImage(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D4BEE4] rounded-xl text-[#3B1E54]"
                    >
                      {SAMPLE_PHOTO_LIBRARY.map((s, idx) => (
                        <option key={idx} value={s.url}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <img src={customImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#D4BEE4]" />
                  <span className="text-[11px] text-[#715F85]">Selected item photo preview</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Cash Top-Up Balance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
                Cash Top-Up Balance (Optional Sweetener)
              </label>
              <span className="text-xs font-bold text-[#3B1E54]">+${cashTopUp}</span>
            </div>
            <p className="text-[11px] text-[#715F85] mb-2">
              If your item has slightly lower market value, you can offer a cash balance to balance the swap.
            </p>
            <div className="flex items-center gap-2">
              {[0, 10, 20, 35, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCashTopUp(amt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    cashTopUp === amt
                      ? 'bg-[#3B1E54] text-white border-[#3B1E54]'
                      : 'bg-white text-[#715F85] border-[#D4BEE4]'
                  }`}
                >
                  {amt === 0 ? '$0' : `+$${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1">
              Personal Proposal Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${targetItem.owner.name.split(' ')[0]}, I'd love to swap my gear for your ${targetItem.title}. Let me know if that works!`}
              className="w-full p-3 text-xs bg-[#FAF8FC] border border-[#D4BEE4] rounded-xl text-[#3B1E54] placeholder-[#715F85] focus:outline-none focus:border-[#3B1E54]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#715F85] hover:bg-[#FAF8FC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Send Exchange Proposal</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

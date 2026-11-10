import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Check, 
  ArrowRight, 
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Item, User, RentalBooking } from '../types';

interface RentalCheckoutModalProps {
  item: Item | null;
  bookingConfig?: {
    rentalDays: number;
    selectedPickup: string;
    totalDue: number;
  };
  currentUser: User | null;
  onClose: () => void;
  onConfirmBooking: (booking: RentalBooking) => void;
  onOpenAuth: () => void;
  onOpenProfile?: (highlightPhone?: boolean) => void;
}

export const RentalCheckoutModal: React.FC<RentalCheckoutModalProps> = ({
  item,
  bookingConfig,
  currentUser,
  onClose,
  onConfirmBooking,
  onOpenAuth,
  onOpenProfile,
}) => {
  const [days, setDays] = useState(bookingConfig?.rentalDays || item?.minRentalDays || 2);
  const [pickupMethod, setPickupMethod] = useState(bookingConfig?.selectedPickup || item?.location?.pickupOptions?.[0] || 'Self Pickup');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'googlepay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!item) return null;

  // Financial calculations
  const rentSubtotal = item.priceDaily * days;
  const serviceFee = Math.round(rentSubtotal * 0.1);
  const deposit = item.depositAmount;
  const grandTotal = rentSubtotal + serviceFee + deposit;

  // Dates
  const today = new Date();
  const startDateStr = today.toISOString().split('T')[0];
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);
  const endDateStr = endDate.toISOString().split('T')[0];

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full z-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3B1E54]">Sign in to Complete Rental</h3>
          <p className="text-xs text-[#715F85]">
            You must be logged in to reserve resources and hold escrow deposits.
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

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newBooking: RentalBooking = {
        id: `rent_${Date.now()}`,
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.images[0],
        ownerId: item.owner.id,
        ownerName: item.owner.name,
        renterId: currentUser.id,
        renterName: currentUser.name,
        startDate: startDateStr,
        endDate: endDateStr,
        durationDays: days,
        dailyRate: item.priceDaily,
        rentalTotal: rentSubtotal,
        depositAmount: deposit,
        serviceFee: serviceFee,
        grandTotal: grandTotal,
        pickupType: pickupMethod as any,
        status: 'upcoming',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setTimeout(() => {
        onConfirmBooking(newBooking);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#D4BEE4] max-w-xl w-full z-10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF2EF]">
          <div>
            <h3 className="text-lg font-bold text-[#3B1E54] font-['Plus_Jakarta_Sans']">
              Complete Your Rental Reservation
            </h3>
            <p className="text-xs text-[#715F85]">Direct from neighbor {item.owner.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#715F85] hover:text-[#3B1E54] hover:bg-[#FAF8FC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#3B1E54]">Reservation Confirmed!</h4>
            <p className="text-xs text-[#715F85] max-w-sm mx-auto">
              Your rental for <strong className="text-[#3B1E54]">{item.title}</strong> has been secured. Escrow deposit is safely held. Details sent to your Dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-5 my-4">
            {/* Item Card Summary */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4]">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#D4BEE4]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#3B1E54] truncate">{item.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#715F85] mt-0.5">
                  <span className="font-semibold text-[#3B1E54]">{item.condition} Condition</span>
                  <span>·</span>
                  <span className="capitalize">{item.category}</span>
                </div>
                <div className="text-xs font-extrabold text-[#3B1E54] mt-1">
                  ${item.priceDaily} / day
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-[#3B1E54] uppercase tracking-wider">Rental Dates</span>
                <span className="text-[#3B1E54] font-bold">{days} Days ({startDateStr} to {endDateStr})</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-semibold border transition-all ${
                      days === d
                        ? 'bg-[#3B1E54] border-[#3B1E54] text-white shadow-xs'
                        : 'bg-white border-[#D4BEE4] text-[#715F85]'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Handover Options */}
            <div>
              <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1.5">
                Handover Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.location.pickupOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPickupMethod(opt)}
                    className={`p-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                      pickupMethod === opt
                        ? 'bg-[#D4BEE4]/40 border-[#3B1E54] text-[#3B1E54]'
                        : 'bg-white border-[#D4BEE4] text-[#715F85]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-1.5">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-[#3B1E54] bg-[#D4BEE4]/40 text-[#3B1E54]'
                      : 'border-[#D4BEE4] bg-white text-[#715F85]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'applepay'
                      ? 'border-[#3B1E54] bg-[#D4BEE4]/40 text-[#3B1E54]'
                      : 'border-[#D4BEE4] bg-white text-[#715F85]'
                  }`}
                >
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'googlepay'
                      ? 'border-[#3B1E54] bg-[#D4BEE4]/40 text-[#3B1E54]'
                      : 'border-[#D4BEE4] bg-white text-[#715F85]'
                  }`}
                >
                  <span>Google Pay</span>
                </button>
              </div>
            </div>

            {/* Breakdown Price Box */}
            <div className="bg-[#FAF8FC] rounded-2xl border border-[#D4BEE4] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#715F85]">
                <span>Rental fee ({item.currencySymbol || '₹'}{item.priceDaily} × {days} days)</span>
                <span className="font-semibold text-[#3B1E54]">{item.currencySymbol || '₹'}{rentSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#715F85]">
                <span>Community Protection fee</span>
                <span className="font-semibold text-[#3B1E54]">{item.currencySymbol || '₹'}{serviceFee}</span>
              </div>
              <div className="flex justify-between text-[#715F85] pt-2 border-t border-[#EEF2EF]">
                <span className="flex items-center gap-1">
                  Refundable Security Deposit
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3B1E54]" />
                </span>
                <span className="font-semibold text-[#3B1E54]">{item.currencySymbol || '₹'}{deposit}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#3B1E54] pt-2 border-t border-[#EEF2EF]">
                <span>Total Amount</span>
                <span className="text-[#3B1E54] font-['Plus_Jakarta_Sans']">{item.currencySymbol || '₹'}{grandTotal}</span>
              </div>
            </div>

            {/* Escrow note */}
            <div className="flex items-center gap-2 text-[11px] text-[#715F85]">
              <Lock className="w-3.5 h-3.5 text-[#3B1E54] shrink-0" />
              <span>
                Funds are held in secure community escrow until you inspect and accept the equipment upon pickup.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="py-2.5 px-4 rounded-xl border border-[#D4BEE4] text-xs font-semibold text-[#715F85] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold transition-all shadow-md shadow-[#3B1E54]/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Reservation...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay ${grandTotal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

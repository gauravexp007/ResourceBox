import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Leaf,
  Star,
  MessageSquareHeart,
  X,
  Mail,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { InteractiveCubeLogo } from './InteractiveCubeLogo';
import { PeepingOrangeCat } from './PeepingOrangeCat';
import { FeedbackModal } from './FeedbackModal';
import { LegalSection, PlatformReview, User } from '../types';
import { subscribeToPlatformReviews } from '../services/firebaseService';

interface FooterProps {
  currentUser?: User | null;
  onOpenLegal: (section: LegalSection) => void;
  onSelectCategory?: (categoryId: string) => void;
  onReviewSubmitted?: (review: PlatformReview & { emailDelivered?: boolean }) => void;
  onOpenContact?: (topic?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentUser,
  onOpenLegal,
  onSelectCategory,
  onReviewSubmitted,
  onOpenContact,
}) => {
  const [reviews, setReviews] = useState<PlatformReview[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false);

  // Subscribe to persistent reviews from server DB & Firestore
  useEffect(() => {
    const unsub = subscribeToPlatformReviews((loadedReviews) => {
      setReviews(loadedReviews);
    });
    return () => unsub();
  }, []);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  const handleLegalClick = (section: LegalSection) => {
    onOpenLegal(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#3B1E54] text-white pt-14 pb-12 border-t border-[#4D296D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-8 lg:gap-10 pb-10 border-b border-white/10">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-3 min-w-0">
            <div
              className="relative flex items-center gap-2.5 group cursor-pointer p-1 -ml-1 rounded-2xl w-fit max-w-full"
              title="ResourceBox 3D Cube"
            >
              <div className="absolute inset-0 rounded-2xl bg-[var(--theme-primary)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out blur-xs pointer-events-none" />
              <div className="shrink-0 transition-transform duration-600 ease-out group-hover:scale-[1.03]">
                <InteractiveCubeLogo size="md" />
              </div>
              <span className="relative z-10 text-xl xl:text-2xl font-nokie whitespace-nowrap text-white group-hover:text-[var(--theme-accent-light)] transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_12px_var(--theme-glow)]">
                Resource
                <span className="text-[var(--theme-accent)] group-hover:text-white transition-colors duration-500">
                  Box
                </span>
              </span>
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              A community-powered platform for renting unused equipment and exchanging items with
              neighbors. Keep resources in active circulation, save money, and cut planetary carbon
              emissions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4BEE4]">
              <Leaf className="w-3.5 h-3.5 shrink-0" />
              <span>Zero Landfill Mission</span>
            </div>
            <p className="text-[11px] text-white/65 pt-1">
              Owned &amp; Operated by{' '}
              <span className="font-kugile text-white text-sm">Gaurav Kumar</span>
            </p>
            {onOpenContact && (
              <button
                type="button"
                onClick={() => onOpenContact('General Inquiry')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer whitespace-nowrap max-w-full"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4BEE4] shrink-0" />
                <span>Send Mail to Owner</span>
              </button>
            )}
          </div>

          {/* Column 2: Resource Categories */}
          <div className="min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              Resource Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              {[
                { label: 'Power & Hand Tools', id: 'tools' },
                { label: 'Cameras, Drones & AV', id: 'cameras' },
                { label: 'Gravel & Cargo Bikes', id: 'mobility' },
                { label: 'Backpacking & Camping Tents', id: 'outdoors' },
                { label: 'Home Steam Cleaners', id: 'home' },
              ].map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div className="min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              Trust &amp; Governance
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('terms')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4BEE4] shrink-0" />
                  <span>Escrow Security Deposits</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy &amp; Data Rights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Lender &amp; Barter Protections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLegalClick('charter')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium text-[#D4BEE4]"
                >
                  Community Charter
                </button>
              </li>
              {onOpenContact && (
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenContact('Rental or Exchange Support')}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-left text-white/85"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D4BEE4] shrink-0" />
                    <span>
                      Contact{' '}
                      <span className="font-kugile text-[13px] text-white">Gaurav Kumar</span>
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Rate Us & Feedback CTA Button + Peeping Cat */}
          <div className="flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-[#D4BEE4]" />
                  <span>Rate Us &amp; Feedback</span>
                </h4>
                {reviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsReviewsModalOpen(true)}
                    className="text-[11px] font-semibold text-[#D4BEE4] hover:text-white underline underline-offset-2 cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    ★ {averageRating} ({reviews.length})
                  </button>
                )}
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                Share your rating, feedback, and ideas on areas we can improve.
              </p>
            </div>

            {/* Peeping Orange Cat tucked directly behind the feedback button ledge */}
            <div className="relative pt-2">
              <div className="flex justify-end pr-2 relative z-10 pointer-events-none">
                <div className="pointer-events-auto">
                  <PeepingOrangeCat />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(true)}
                className="relative z-20 w-full py-2.5 px-4 rounded-xl bg-[#D4BEE4] hover:bg-white text-[#3B1E54] text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Star className="w-4 h-4 fill-[#3B1E54] shrink-0" />
                <span>Rate &amp; Give Feedback</span>
              </button>

              <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-white/65">
                {reviews.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsReviewsModalOpen(true)}
                    className="hover:text-white underline underline-offset-2 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Read community reviews ({reviews.length})
                  </button>
                ) : (
                  <span>Your review helps us grow</span>
                )}
                <span className="text-white/45 whitespace-nowrap">1-min form</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with Gaurav Kumar Ownership & Legal Navigation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/65 gap-4">
          <p className="text-center sm:text-left">
            © 2026 ResourceBox. Owned &amp; Operated by{' '}
            <span className="font-kugile text-white text-sm">Gaurav Kumar</span>. Designed for
            conscious community sharing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleLegalClick('privacy')}
              className="hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleLegalClick('terms')}
              className="hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            >
              Terms &amp; Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleLegalClick('charter')}
              className="hover:text-white cursor-pointer transition-colors whitespace-nowrap"
            >
              Community Charter
            </button>
          </div>
        </div>
      </div>

      {/* Centered Rate & Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <FeedbackModal
            key="footer-feedback-modal"
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            currentUser={currentUser}
            onSubmitted={(newReview) => {
              setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
              onReviewSubmitted?.(newReview);
            }}
          />
        )}
      </AnimatePresence>

      {/* Community Feedback & Reviews Modal */}
      {isReviewsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
          onClick={() => setIsReviewsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-reviews-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white text-[#3B1E54] rounded-3xl border border-[#D4BEE4] shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[#D4BEE4]/50 flex items-center justify-between bg-[#F8F6FA]">
              <div>
                <h3 id="community-reviews-title" className="text-base font-extrabold text-[#3B1E54]">
                  Community Feedback &amp; Reviews
                </h3>
                <p className="text-xs text-[#5C4B6E] mt-0.5">
                  {averageRating
                    ? `Average rating ${averageRating} / 5 across ${reviews.length} review${reviews.length > 1 ? 's' : ''}`
                    : 'Verified community feedback for ResourceBox'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewsModalOpen(false)}
                aria-label="Close reviews"
                className="p-2 rounded-xl hover:bg-[#D4BEE4]/30 text-[#3B1E54] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-[#5C4B6E] text-center py-6">
                  No reviews yet. Be the first to rate ResourceBox!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-[#D4BEE4]/60 bg-[#FCFAFD] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#3B1E54]">
                        {rev.reviewerName || 'Community Member'}
                      </span>
                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`${rev.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'text-[#F4A261] fill-[#F4A261]'
                                : 'text-[#D4BEE4]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.improvementAreas && rev.improvementAreas.length > 0 && (
                      <div className="text-[11px] text-[#715F85] font-medium">
                        Focus: {rev.improvementAreas.join(' · ')}
                      </div>
                    )}
                    <p className="text-xs text-[#4A3B59] leading-relaxed">{rev.comment}</p>
                    <div className="text-[10px] text-[#715F85] tabular-nums">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

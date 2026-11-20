import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Send,
  X,
  CheckCircle2,
  Loader2,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react';
import { PlatformReview, User } from '../types';
import { createPlatformReviewInFirestore } from '../services/firebaseService';
import { sendFeedbackEmail } from '../services/mailService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  onSubmitted: (review: PlatformReview & { emailDelivered?: boolean }) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Work',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const IMPROVEMENT_AREAS = [
  'Search & Filters',
  'Rental Checkout',
  'Barter & Swaps',
  'Messaging & Chat',
  'Listing Upload',
  'UI & Speed',
  'Trust & Safety',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [reviewerName, setReviewerName] = useState<string>(currentUser?.name || '');
  const [reviewerEmail, setReviewerEmail] = useState<string>(currentUser?.email || '');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<
    (PlatformReview & { emailDelivered?: boolean }) | null
  >(null);

  useEffect(() => {
    if (isOpen) {
      if (currentUser?.name && !reviewerName) setReviewerName(currentUser.name);
      if (currentUser?.email && !reviewerEmail) setReviewerEmail(currentUser.email);
      setErrorMsg('');
      setSubmittedResult(null);
    }
  }, [isOpen, currentUser?.name, currentUser?.email]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeStar = hoverRating || rating;

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedComment = comment.trim();
    if (rating < 1 || rating > 5) {
      setErrorMsg('Please choose a star rating from 1 to 5.');
      return;
    }
    if (trimmedComment.length < 3) {
      setErrorMsg('Please write at least 3 characters in your feedback.');
      return;
    }

    setIsSubmitting(true);
    const newReview: PlatformReview = {
      id: `rev_${Date.now()}`,
      rating,
      comment: trimmedComment.slice(0, 500),
      ...(selectedAreas.length > 0 ? { improvementAreas: selectedAreas } : {}),
      reviewerName:
        reviewerName.trim().slice(0, 80) || currentUser?.name || 'Community Member',
      ...(currentUser?.id ? { userId: currentUser.id } : {}),
      createdAt: new Date().toISOString(),
    };

    try {
      await createPlatformReviewInFirestore(newReview);
      const emailResult = await sendFeedbackEmail({
        rating: newReview.rating,
        reviewerName: newReview.reviewerName,
        reviewerEmail: reviewerEmail.trim() || currentUser?.email,
        improvementAreas: selectedAreas,
        comment: newReview.comment,
      });

      const finalResult = { ...newReview, emailDelivered: emailResult.success };
      setSubmittedResult(finalResult);
      setComment('');
      setSelectedAreas([]);
      onSubmitted(finalResult);
    } catch {
      setErrorMsg('Could not submit your feedback right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl border border-[var(--theme-accent)]/60 shadow-2xl overflow-hidden text-[var(--theme-deep)]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--theme-accent-light)] bg-[var(--theme-canvas)]/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-deep)] text-white flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 id="feedback-modal-title" className="text-base sm:text-lg font-extrabold tracking-tight">
                Rate Us &amp; Feedback
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Share your experience with{' '}
                <span className="font-kugile text-sm text-[var(--theme-deep)]">Gaurav Kumar</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback window"
            className="p-2 rounded-xl hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {submittedResult ? (
          <div className="p-7 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-extrabold text-[var(--theme-deep)]">
                Thank You for Your {submittedResult.rating}-Star Rating!
              </h4>
              <p className="text-sm text-[var(--theme-text-muted)] max-w-sm mx-auto leading-relaxed">
                {submittedResult.emailDelivered ? (
                  <>
                    Your feedback has been saved and emailed directly to{' '}
                    <span className="font-kugile text-base text-[var(--theme-deep)]">
                      Gaurav Kumar
                    </span>
                    .
                  </>
                ) : (
                  'Your feedback review has been saved to ResourceBox.'
                )}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmittedResult(null)}
                className="px-4 py-2 rounded-xl border border-[var(--theme-accent)] text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] cursor-pointer transition-colors"
              >
                Add Another Review
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[var(--theme-deep)] hover:bg-[var(--theme-primary)] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* 1. Star Rating */}
            <div className="p-3.5 rounded-2xl bg-[var(--theme-canvas)]/60 border border-[var(--theme-accent)]/40 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[var(--theme-deep)]">Your Rating</div>
                <div className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">
                  {RATING_LABELS[activeStar] || 'Select stars'}
                </div>
              </div>

              <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeStar;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                      aria-pressed={rating === starValue}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-deep)] rounded-lg"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'text-[#F4A261] fill-[#F4A261]'
                            : 'text-[var(--theme-accent)] hover:text-[#F4A261]/70'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Areas of Improvement */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--theme-deep)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                  <span>Areas of Improvement (Optional)</span>
                </span>
                {selectedAreas.length > 0 && (
                  <span className="text-[11px] font-semibold text-[var(--theme-primary)] tabular-nums">
                    {selectedAreas.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {IMPROVEMENT_AREAS.map((area) => {
                  const active = selectedAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[var(--theme-deep)] text-white border-[var(--theme-deep)] shadow-xs'
                          : 'bg-white text-[var(--theme-deep)] border-[var(--theme-accent)]/70 hover:bg-[var(--theme-accent-light)]'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Feedback Comment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="feedback-modal-comment"
                  className="text-xs font-bold text-[var(--theme-deep)]"
                >
                  Feedback &amp; Review *
                </label>
                <span className="text-[10px] text-[var(--theme-text-muted)] tabular-nums">
                  {comment.length}/500
                </span>
              </div>
              <textarea
                id="feedback-modal-comment"
                required
                rows={3}
                maxLength={500}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Tell us what you enjoyed or what we can make better..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)] resize-none"
              />
            </div>

            {/* 4. Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="feedback-modal-name"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1"
                >
                  Your Name (Optional)
                </label>
                <input
                  id="feedback-modal-name"
                  type="text"
                  maxLength={80}
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)]"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-modal-email"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1"
                >
                  Email (Optional)
                </label>
                <input
                  id="feedback-modal-email"
                  type="email"
                  maxLength={120}
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--theme-accent-light)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:bg-[var(--theme-primary)] text-white text-xs font-bold cursor-pointer transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, X, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { sendDirectMail } from '../services/mailService';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  initialTopic?: string;
  onMailSent?: (summary: { topic: string; senderEmail: string }) => void;
}

const TOPICS = [
  'General Inquiry',
  'Rental or Exchange Support',
  'Privacy & Data Request',
  'Feedback & Suggestions',
  'Report an Issue',
];

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTopic = 'General Inquiry',
  onMailSent,
}) => {
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTopic(initialTopic);
      if (currentUser?.name && !senderName) setSenderName(currentUser.name);
      if (currentUser?.email && !senderEmail) setSenderEmail(currentUser.email);
      setIsSent(false);
      setErrorMsg('');
    }
  }, [isOpen, initialTopic, currentUser?.name, currentUser?.email]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSending(true);

    const result = await sendDirectMail({
      senderName,
      senderEmail,
      topic,
      subject,
      message,
    });

    setIsSending(false);
    if (result.success) {
      setIsSent(true);
      setSubject('');
      setMessage('');
      onMailSent?.({ topic, senderEmail: senderEmail.trim() });
    } else {
      setErrorMsg(result.message);
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
        aria-labelledby="contact-owner-title"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl border border-[var(--theme-accent)]/60 shadow-2xl overflow-hidden text-[var(--theme-deep)]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--theme-accent-light)] bg-[var(--theme-canvas)]/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-deep)] text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 id="contact-owner-title" className="text-lg font-extrabold tracking-tight">
                Send Mail to Owner
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Direct message to{' '}
                <span className="font-kugile text-sm text-[var(--theme-deep)]">Gaurav Kumar</span>{' '}
                (pro.gaurav00@gmail.com)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close mail window"
            className="p-2 rounded-xl hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {isSent ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-extrabold text-[var(--theme-deep)]">
                Mail Sent to <span className="font-kugile font-normal">Gaurav Kumar</span>
              </h4>
              <p className="text-sm text-[var(--theme-text-muted)] max-w-sm mx-auto leading-relaxed">
                Your message has been delivered directly to the owner&apos;s inbox. Any reply will
                be sent to <strong className="text-[var(--theme-deep)]">{senderEmail}</strong>.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="px-4 py-2 rounded-xl border border-[var(--theme-accent)] text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] cursor-pointer transition-colors"
              >
                Send Another Mail
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="mail-sender-name"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1.5"
                >
                  Your Name *
                </label>
                <input
                  id="mail-sender-name"
                  type="text"
                  required
                  maxLength={80}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)]"
                />
              </div>

              <div>
                <label
                  htmlFor="mail-sender-email"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1.5"
                >
                  Your Email *
                </label>
                <input
                  id="mail-sender-email"
                  type="email"
                  required
                  maxLength={120}
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="mail-topic"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1.5"
                >
                  Topic
                </label>
                <select
                  id="mail-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] focus:outline-none focus:border-[var(--theme-deep)]"
                >
                  {TOPICS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="mail-subject"
                  className="block text-xs font-bold text-[var(--theme-deep)] mb-1.5"
                >
                  Subject (Optional)
                </label>
                <input
                  id="mail-subject"
                  type="text"
                  maxLength={120}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mail-message"
                className="block text-xs font-bold text-[var(--theme-deep)] mb-1.5"
              >
                Message *
              </label>
              <textarea
                id="mail-message"
                required
                rows={4}
                maxLength={1500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your question, feedback, or support request..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--theme-accent)]/70 bg-white text-[var(--theme-deep)] placeholder-[#715F85]/60 focus:outline-none focus:border-[var(--theme-deep)] resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-accent-light)]">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--theme-text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span>
                  Delivered directly to{' '}
                  <span className="font-kugile text-xs text-[var(--theme-deep)]">Gaurav Kumar</span>
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:bg-[var(--theme-primary)] text-white text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Mail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

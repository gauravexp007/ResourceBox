import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Copy, CheckCheck } from 'lucide-react';

interface InteractiveDescriptionViewerProps {
  description: string;
  className?: string;
}

/**
 * Intelligent parser that extracts the lead introductory narrative
 * and all key bullet points, handling inline bullets (•, -, *), 
 * newline-separated bullets, and multi-paragraph structures.
 */
export function parseDescription(rawText: string): {
  leadText: string;
  bulletPoints: string[];
} {
  if (!rawText || !rawText.trim()) {
    return { leadText: '', bulletPoints: [] };
  }

  const text = rawText.trim();
  const bullets: string[] = [];
  let lead = '';

  // Case 1: Text contains bullet symbol (•)
  if (text.includes('•')) {
    // Check if starts directly with bullet
    const startsWithBullet = text.startsWith('•');
    const segments = text.split('•').map((s) => s.trim()).filter(Boolean);

    if (startsWithBullet) {
      // All segments are bullets
      segments.forEach((seg) => {
        const cleaned = seg.replace(/^[-*•\s]+/, '').replace(/[-*•\s]+$/, '').trim();
        if (cleaned) bullets.push(cleaned);
      });
      lead = '';
    } else if (segments.length > 1) {
      lead = segments[0];
      for (let i = 1; i < segments.length; i++) {
        const cleaned = segments[i].replace(/^[-*•\s]+/, '').replace(/[-*•\s]+$/, '').trim();
        if (cleaned) bullets.push(cleaned);
      }
    } else {
      lead = segments[0] || text;
    }
  } 
  // Case 2: Newline-separated bullets with dashes or asterisks (- or *)
  else if (text.includes('\n- ') || text.includes('\n* ') || text.startsWith('- ') || text.startsWith('* ')) {
    const lines = text.split('\n');
    const leadLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const bullet = trimmed.replace(/^[-*]\s+/, '').trim();
        if (bullet) bullets.push(bullet);
      } else if (trimmed) {
        leadLines.push(trimmed);
      }
    }
    lead = leadLines.join(' ');
  } 
  // Case 3: Multiple paragraphs separated by double newline
  else if (text.includes('\n\n')) {
    const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length > 1) {
      lead = paragraphs[0];
      for (let i = 1; i < paragraphs.length; i++) {
        // If subsequent paragraph is short or starts with a list-like cue, treat as bullet
        bullets.push(paragraphs[i]);
      }
    } else {
      lead = text;
    }
  } 
  // Case 4: Single paragraph without bullet characters
  else {
    lead = text;
  }

  return {
    leadText: lead.trim(),
    bulletPoints: bullets.filter(Boolean),
  };
}

export const InteractiveDescriptionViewer: React.FC<InteractiveDescriptionViewerProps> = ({
  description,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const { leadText, bulletPoints } = parseDescription(description);

  const handleCopy = () => {
    if (!description) return;
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!description || !description.trim()) {
    return (
      <div className={`text-sm text-[#718579] italic ${className}`}>
        No description provided.
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Short Lead Introductory Paragraph */}
      {leadText && (
        <div className="relative p-4 sm:p-4.5 rounded-2xl bg-white border border-[#D4BEE4] text-[#3B1E54] shadow-xs">
          <p className="text-sm sm:text-base leading-relaxed font-medium">
            {leadText}
          </p>

          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#D4BEE4]/40">
            <div className="flex items-center gap-1.5 text-xs text-[#3B1E54] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B7EBD]" />
              <span>Owner Verified Description</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#5C4B6E] hover:text-[#9B7EBD] transition-colors cursor-pointer"
              title="Copy description"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-[#9B7EBD]" />
                  <span className="text-[#9B7EBD]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Key Highlights Bullet Points on Next Line */}
      {bulletPoints.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B1E54] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD]" />
              <span>Key Highlights & Verified Details</span>
            </div>
            <span className="text-[11px] font-bold text-[#3B1E54] bg-[#D4BEE4]/45 border border-[#D4BEE4] px-2.5 py-0.5 rounded-full">
              {bulletPoints.length} Key Points
            </span>
          </div>

          <div className="space-y-2">
            {bulletPoints.map((point, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-[#EEEEEE]/70 hover:bg-[#D4BEE4]/30 border border-[#D4BEE4] shadow-2xs hover:shadow-xs transition-all group cursor-default"
              >
                <div className="w-5 h-5 rounded-lg bg-[#3B1E54] text-[#D4BEE4] flex items-center justify-center shrink-0 mt-0.5 shadow-xs group-hover:scale-110 transition-transform">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#3B1E54] leading-snug">
                  {point}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

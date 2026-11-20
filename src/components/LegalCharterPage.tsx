import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Handshake,
  Mail,
  UserCheck,
  ArrowRight,
  Lock,
  Scale,
  Leaf,
} from 'lucide-react';
import { LegalSection } from '../types';

interface LegalCharterPageProps {
  activeSection: LegalSection;
  onChangeSection: (section: LegalSection) => void;
  onBackToMarketplace: () => void;
  onOpenContact?: (topic?: string) => void;
}

interface DocumentArticle {
  number: string;
  heading: string;
  body: string[];
  points?: string[];
}

const PRIVACY_ARTICLES: DocumentArticle[] = [
  {
    number: '01.',
    heading: 'Ownership, Data Controller & Scope',
    body: [
      'ResourceBox is solely owned, operated, and administered by Gaurav Kumar ("Owner", "we", "us"). Gaurav Kumar serves as the primary data controller responsible for how personal information is collected, processed, and safeguarded across the ResourceBox platform.',
      'This Privacy Policy applies to all visitors, guests, lenders, renters, and barter participants accessing the ResourceBox web application and its connected cloud services.',
    ],
  },
  {
    number: '02.',
    heading: 'Information You Provide & Automatic Sync Data',
    body: [
      'We collect only the information required to verify community trust, connect nearby neighbors, and coordinate rentals or exchanges safely:',
    ],
    points: [
      'Account & Identity Details: Name, email address, and profile avatar provided through Google or Firebase Authentication.',
      'Location & Handover Preferences: Country, state, city, neighborhood, postal/pincode, and preferred pickup methods entered in your profile so items can be matched locally.',
      'Verification & Contact Data: Optional mobile phone verification status used to strengthen lender and borrower confidence during in-person handovers.',
      'Listings, Messages & Proposals: Item photos, rental pricing, barter wishlists, rental booking dates, and direct chat conversations stored to fulfill active transactions.',
      'Saved Cart & Theme Preferences: Liked item IDs and chosen interface themes saved in browser localStorage and synced to your user profile when signed in.',
      'Ratings & Feedback Reviews: Star ratings, feedback comments, and display names voluntarily submitted through the footer Rate Us & Feedback form.',
    ],
  },
  {
    number: '03.',
    heading: 'How We Use Your Information',
    body: [
      'Your data is used strictly to operate and improve ResourceBox under the stewardship of Gaurav Kumar:',
    ],
    points: [
      'Displaying your equipment listings, availability windows, and neighborhood location to prospective borrowers and exchange partners.',
      'Enabling real-time chat, rental reservations, and barter proposal notifications between signed-in participants.',
      'Maintaining platform safety, preventing duplicate or fraudulent listings, and displaying honest community feedback.',
      'We never sell, rent, or trade your personal contact details, email address, or browsing history to third-party advertisers or data brokers.',
    ],
  },
  {
    number: '04.',
    heading: 'Data Storage, Cloud Infrastructure & Retention',
    body: [
      'Account profiles, marketplace listings, rental bookings, exchange proposals, chat threads, and community feedback reviews are stored using Google Firebase Authentication, Cloud Firestore, and synchronized persistent server storage.',
      'We retain your account records while your profile remains active. Items you delete from your Dashboard are removed from active marketplace listings, and local cart selections can be cleared at any time.',
    ],
  },
  {
    number: '05.',
    heading: 'Your Privacy Rights & Owner Contact',
    body: [
      'You remain in control of your personal information. Signed-in members may update their profile details, location, and listing availability directly through the Profile and Dashboard views.',
      'To request access to, correction of, or permanent deletion of your account data under this Privacy Policy, please contact the platform owner directly:',
    ],
    points: [
      'Platform Owner & Data Controller: Gaurav Kumar',
      'Contact Email: pro.gaurav00@gmail.com',
      'Response Commitment: Privacy and data deletion inquiries are reviewed promptly by the Owner.',
    ],
  },
];

const TERMS_ARTICLES: DocumentArticle[] = [
  {
    number: '01.',
    heading: 'Platform Ownership & Acceptance of Terms',
    body: [
      'ResourceBox—including its brand name, platform design, interactive 3D visuals, source code, and curated service workflows—is owned and operated by Gaurav Kumar.',
      'By browsing listings, submitting feedback, or signing in to rent, lend, or barter equipment on ResourceBox, you agree to abide by these Terms & Conditions and our Community Charter.',
    ],
  },
  {
    number: '02.',
    heading: 'Eligibility, Accounts & Verification',
    body: [
      'Guests may browse public equipment catalogs, switch themes, and save items locally without signing in. Publishing listings, initiating chat messages, confirming rental reservations, and submitting exchange proposals require signing in with a verified account.',
      'You agree to provide truthful identity, phone, and city/pincode location details and not to impersonate another individual or register automated accounts.',
    ],
  },
  {
    number: '03.',
    heading: 'Peer-to-Peer Rentals & Barter Exchanges',
    body: [
      'ResourceBox acts as a local community discovery and coordination platform owned by Gaurav Kumar. All rental contracts, pricing terms, refundable security deposits, and barter swaps are entered into directly between the item owner and the borrower or trader.',
    ],
    points: [
      'Owners must accurately disclose item condition, included accessories, usage guidelines, and daily rates or preferred barter items.',
      'Borrowers must inspect equipment at handover, follow the owner’s care rules, and return items on time in the same clean, working condition.',
      'Security deposits are intended solely to protect owners against verified damage, missing parts, or late return as mutually agreed before handover.',
    ],
  },
  {
    number: '04.',
    heading: 'Prohibited Items & Community Conduct',
    body: [
      'To keep ResourceBox safe and lawful for every neighborhood participant, the following are strictly prohibited:',
    ],
    points: [
      'Listing stolen, counterfeit, hazardous, explosive, restricted, or legally prohibited goods or weapons.',
      'Using ResourceBox messaging or feedback forms for spam, harassment, hate speech, deceptive pricing, or off-platform phishing links.',
      'Attempting to bypass platform safeguards, tamper with another member’s listings, or submit abusive automated reviews.',
    ],
  },
  {
    number: '05.',
    heading: 'Intellectual Property & Platform Rights',
    body: [
      'All original platform branding, layouts, interactive components, and documentation on ResourceBox are the intellectual property of Gaurav Kumar. Members retain ownership of the photographs and item descriptions they upload, while granting ResourceBox a non-exclusive license to display them within the marketplace.',
    ],
  },
  {
    number: '06.',
    heading: 'Limitation of Liability & Updates',
    body: [
      'Because equipment handovers take place directly between community members, Gaurav Kumar and ResourceBox are not liable for indirect losses, personal injury arising from improper tool operation, or private handover disputes outside documented platform rules.',
      'Gaurav Kumar reserves the right to update these Terms & Conditions or suspend listings that violate safety or community guidelines. Continued use of ResourceBox signifies acceptance of any updated terms.',
    ],
  },
];

const CHARTER_ARTICLES: DocumentArticle[] = [
  {
    number: '01.',
    heading: 'Our Zero-Landfill Community Mission',
    body: [
      'ResourceBox was created under the ownership and vision of Gaurav Kumar to turn idle household tools, cameras, camping kits, musical gear, and electronics into shared neighborhood abundance.',
      'Every borrowed drill, camera lens, or swapped gadget reduces unnecessary manufacturing, saves neighbors money, and builds stronger local trust.',
    ],
  },
  {
    number: '02.',
    heading: 'Pillar 1 — Honest Listings & Accurate Condition',
    body: [
      'Every listing starts with transparency. Owners commit to uploading clear, recent photos of the actual item, selecting honest condition ratings (Like New, Excellent, Good, or Fair), and clearly stating any quirks, missing accessories, or care requirements.',
    ],
  },
  {
    number: '03.',
    heading: 'Pillar 2 — Respectful Borrowing & Care',
    body: [
      'Borrowers pledge to treat every rented or exchanged item with greater care than their own. Wipe down tools after use, recharge batteries before return, report accidental wear immediately rather than hiding it, and respect agreed pickup and return times.',
    ],
  },
  {
    number: '04.',
    heading: 'Pillar 3 — Fair & Transparent Barter Exchanges',
    body: [
      'In the Exchange Hub, members negotiate swaps in good faith. Clearly describe the condition and approximate value of any offered item, confirm whether a cash top-up balances the swap, and inspect both items together before finalizing the trade.',
    ],
  },
  {
    number: '05.',
    heading: 'Pillar 4 — Safe Local Handovers',
    body: [
      'Safety comes first on every transaction. Use in-app messaging to confirm handover timing, verify member profiles and ratings, and choose well-lit public meetup spots or trusted local delivery options whenever meeting a neighbor for the first time.',
    ],
  },
  {
    number: '06.',
    heading: 'Pillar 5 — Constructive Reviews & Stewardship',
    body: [
      'Community trust grows through honest, respectful feedback. Share constructive ratings and reviews using the footer feedback panel so Gaurav Kumar and fellow members can continuously improve ResourceBox for everyone.',
    ],
  },
];

const DOCUMENT_META: Record<
  LegalSection,
  {
    title: string;
    subtitle: string;
    updated: string;
    icon: React.ComponentType<{ className?: string }>;
    articles: DocumentArticle[];
    nextLabel: string;
    nextSection: LegalSection;
  }
> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle:
      'How ResourceBox—owned and operated by Gaurav Kumar—collects, safeguards, and gives you full control over your personal data.',
    updated: 'Effective November 2026',
    icon: ShieldCheck,
    articles: PRIVACY_ARTICLES,
    nextLabel: 'Read Terms & Conditions',
    nextSection: 'terms',
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle:
      'Clear rights, responsibilities, rental and barter rules, and intellectual property ownership under Gaurav Kumar.',
    updated: 'Effective November 2026',
    icon: Scale,
    articles: TERMS_ARTICLES,
    nextLabel: 'Read Community Charter',
    nextSection: 'charter',
  },
  charter: {
    title: 'Community Charter',
    subtitle:
      'The shared code of trust, safety, honest listings, and circular sustainability upheld by Gaurav Kumar and every ResourceBox member.',
    updated: 'Charter v1.0 · November 2026',
    icon: Handshake,
    articles: CHARTER_ARTICLES,
    nextLabel: 'Read Privacy Policy',
    nextSection: 'privacy',
  },
};

function renderWithOwnerFont(text: string): React.ReactNode {
  const parts = text.split('Gaurav Kumar');
  if (parts.length === 1) return text;
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <span className="font-kugile text-[1.06em] text-[var(--theme-deep)]">Gaurav Kumar</span>
      )}
    </React.Fragment>
  ));
}

export const LegalCharterPage: React.FC<LegalCharterPageProps> = ({
  activeSection,
  onChangeSection,
  onBackToMarketplace,
  onOpenContact,
}) => {
  const currentDoc = DOCUMENT_META[activeSection];
  const ActiveIcon = currentDoc.icon;

  return (
    <section
      aria-labelledby="legal-page-heading"
      className="py-10 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Top Return & Ownership Context */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBackToMarketplace}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[var(--theme-accent-light)] text-[var(--theme-deep)] text-xs font-bold border border-[var(--theme-accent)]/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--theme-text-muted)] font-medium">
          <span>ResourceBox Governance</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--theme-deep)] font-semibold">
            Owned by <span className="font-kugile text-sm font-normal">Gaurav Kumar</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>{currentDoc.updated}</span>
        </div>
      </div>

      {/* Editorial Header & Document Selector */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl border border-[var(--theme-accent)]/50 shadow-xs overflow-hidden"
      >
        {/* Document Switcher Bar */}
        <div className="px-6 sm:px-10 pt-6 pb-4 border-b border-[var(--theme-accent-light)] bg-[var(--theme-canvas)]/45 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Legal and Community Documents"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-[var(--theme-accent)]/40"
          >
            {(
              [
                { id: 'privacy', label: 'Privacy Policy', Icon: Lock },
                { id: 'terms', label: 'Terms & Conditions', Icon: FileText },
                { id: 'charter', label: 'Community Charter', Icon: Leaf },
              ] as const
            ).map(({ id, label, Icon }) => {
              const isSelected = activeSection === id;
              return (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => onChangeSection(id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[var(--theme-deep)] text-white shadow-xs'
                      : 'text-[var(--theme-deep)]/75 hover:text-[var(--theme-deep)] hover:bg-[var(--theme-accent-light)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--theme-deep)] font-semibold">
            <UserCheck className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
            <span>
              Proprietor: <span className="font-kugile text-sm font-normal">Gaurav Kumar</span>
            </span>
          </div>
        </div>

        {/* Title & Summary */}
        <div className="px-6 sm:px-10 pt-8 pb-7 border-b border-[var(--theme-accent-light)]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--theme-accent-light)] text-[var(--theme-deep)] flex items-center justify-center shrink-0">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h1
                id="legal-page-heading"
                className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-deep)] tracking-tight"
              >
                {currentDoc.title}
              </h1>
              <p className="text-sm sm:text-base text-[var(--theme-text-muted)] mt-2 max-w-2xl leading-relaxed">
                {renderWithOwnerFont(currentDoc.subtitle)}
              </p>
            </div>
          </div>

          {/* Clear Ownership & Contact Strip */}
          <div className="mt-6 pt-5 border-t border-[var(--theme-accent-light)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-[var(--theme-text-muted)] font-medium">Platform Owner</div>
              <div className="font-kugile text-base text-[var(--theme-deep)] mt-0.5">
                Gaurav Kumar
              </div>
            </div>
            <div>
              <div className="text-[var(--theme-text-muted)] font-medium">Legal & Privacy Entity</div>
              <div className="text-[var(--theme-deep)] font-bold mt-0.5">
                ResourceBox (Sole Proprietorship)
              </div>
            </div>
            <div>
              <div className="text-[var(--theme-text-muted)] font-medium">Official Contact</div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <a
                  href="mailto:pro.gaurav00@gmail.com"
                  className="inline-flex items-center gap-1.5 text-[var(--theme-deep)] hover:text-[var(--theme-primary)] font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>pro.gaurav00@gmail.com</span>
                </a>
                {onOpenContact && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenContact(
                        activeSection === 'privacy'
                          ? 'Privacy & Data Request'
                          : 'General Inquiry'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-[var(--theme-deep)] hover:bg-[var(--theme-primary)] text-white text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Send Direct Mail
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Articles */}
        <div className="px-6 sm:px-10 py-8 space-y-8">
          {currentDoc.articles.map((article, idx) => (
            <article
              key={article.number}
              className={idx > 0 ? 'pt-7 border-t border-[var(--theme-accent-light)]' : ''}
            >
              <h2 className="text-base sm:text-lg font-bold text-[var(--theme-deep)] flex items-baseline gap-2.5">
                <span className="text-[var(--theme-primary)] font-extrabold tabular-nums">
                  {article.number}
                </span>
                <span>{article.heading}</span>
              </h2>

              <div className="mt-3 space-y-3 text-sm text-[#4A3B59] leading-relaxed max-w-3xl">
                {article.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>{renderWithOwnerFont(paragraph)}</p>
                ))}
              </div>

              {article.points && article.points.length > 0 && (
                <ul className="mt-4 space-y-2.5 text-sm text-[#4A3B59] max-w-3xl">
                  {article.points.map((point, ptIdx) => (
                    <li key={ptIdx} className="flex items-start gap-2.5 leading-relaxed">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] mt-2 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{renderWithOwnerFont(point)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        {/* Bottom Ownership Attestation & Cross-Document Navigation */}
        <div className="px-6 sm:px-10 py-6 border-t border-[var(--theme-accent-light)] bg-[var(--theme-canvas)]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
            © 2026 ResourceBox. All platform rights, branding, and governance belong solely to{' '}
            <span className="font-kugile text-sm text-[var(--theme-deep)]">Gaurav Kumar</span>.
          </div>

          <button
            type="button"
            onClick={() => onChangeSection(currentDoc.nextSection)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--theme-deep)] hover:bg-[var(--theme-primary)] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>{currentDoc.nextLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

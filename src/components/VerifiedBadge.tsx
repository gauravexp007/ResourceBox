import React from 'react';

export const ADMIN_USER_ID = 'admin-resourcebox-official';
export const ADMIN_EMAIL = 'fab.gaurav007@gmail.com';
export const ADMIN_USERNAME = '@resourcebox';

export function isAdminAccount(
  account?: {
    id?: string;
    email?: string;
    username?: string;
    role?: string;
    isAdmin?: boolean;
  } | null
): boolean {
  if (!account) return false;
  if (account.isAdmin === true) return true;
  if (typeof account.role === 'string' && account.role.toLowerCase() === 'admin') return true;
  if (account.id === ADMIN_USER_ID) return true;
  if (typeof account.email === 'string' && account.email.trim().toLowerCase() === ADMIN_EMAIL) return true;
  if (typeof account.username === 'string') {
    const clean = account.username.trim().replace(/^@+/, '').toLowerCase();
    if (clean === 'resourcebox') return true;
  }
  return false;
}

interface VerifiedBadgeProps {
  isAdmin?: boolean;
  verified?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showAdminLabel?: boolean;
  adminLabelTone?: 'dark' | 'light';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-4.5 h-4.5',
  lg: 'w-5 h-5',
};

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isAdmin = false,
  verified = true,
  size = 'sm',
  showAdminLabel = false,
  adminLabelTone = 'light',
  className = '',
}) => {
  if (!verified && !isAdmin) return null;

  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `rb-seal-${uid}`;
  const iconSize = SIZE_MAP[size];

  return (
    <span className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      <span
        className="inline-flex items-center justify-center shrink-0"
        title={isAdmin ? 'Verified Official ResourceBox Admin' : 'Verified Member'}
        aria-label={isAdmin ? 'Verified Official Admin' : 'Verified Account'}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${iconSize} drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {isAdmin ? (
              <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="48%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            ) : (
              <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="55%" stopColor="#0095F6" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
            )}
          </defs>
          {/* Scalloped Instagram-style verification seal */}
          <path
            d="M12 1.75L14.48 3.19L17.34 3.06L18.67 5.6L21.14 6.99L20.95 9.85L22.5 12.25L20.95 14.65L21.14 17.51L18.67 18.9L17.34 21.44L14.48 21.31L12 22.75L9.52 21.31L6.66 21.44L5.33 18.9L2.86 17.51L3.05 14.65L1.5 12.25L3.05 9.85L2.86 6.99L5.33 5.6L6.66 3.06L9.52 3.19L12 1.75Z"
            fill={`url(#${gradId})`}
          />
          <path
            d="M8.6 12.45L10.85 14.7L15.6 9.85"
            stroke={isAdmin ? '#1A1025' : '#FFFFFF'}
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {isAdmin && showAdminLabel && (
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase whitespace-nowrap shrink-0 ${
            adminLabelTone === 'dark'
              ? 'bg-[#F59E0B]/18 text-[#FDE68A] border border-[#F59E0B]/45'
              : 'bg-amber-50 text-amber-900 border border-amber-300'
          }`}
        >
          Admin
        </span>
      )}
    </span>
  );
};

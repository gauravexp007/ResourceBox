export interface CountryInfo {
  name: string;
  code: string;
  dialCode: string;
  currencySymbol: string;
  currencyCode: string;
  flag: string;
}

export const COUNTRIES: CountryInfo[] = [
  { name: 'India', code: 'IN', dialCode: '+91', currencySymbol: '₹', currencyCode: 'INR', flag: '🇮🇳' },
  { name: 'United States', code: 'US', dialCode: '+1', currencySymbol: '$', currencyCode: 'USD', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', currencySymbol: '£', currencyCode: 'GBP', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', currencySymbol: 'CA$', currencyCode: 'CAD', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', currencySymbol: 'A$', currencyCode: 'AUD', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '+49', currencySymbol: '€', currencyCode: 'EUR', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', currencySymbol: '€', currencyCode: 'EUR', flag: '🇫🇷' },
  { name: 'Spain', code: 'ES', dialCode: '+34', currencySymbol: '€', currencyCode: 'EUR', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', dialCode: '+39', currencySymbol: '€', currencyCode: 'EUR', flag: '🇮🇹' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', currencySymbol: '€', currencyCode: 'EUR', flag: '🇳🇱' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', currencySymbol: 'AED', currencyCode: 'AED', flag: '🇦🇪' },
  { name: 'Japan', code: 'JP', dialCode: '+81', currencySymbol: '¥', currencyCode: 'JPY', flag: '🇯🇵' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', currencySymbol: 'S$', currencyCode: 'SGD', flag: '🇸🇬' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', currencySymbol: 'CHF', currencyCode: 'CHF', flag: '🇨🇭' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', currencySymbol: 'NZ$', currencyCode: 'NZD', flag: '🇳🇿' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', currencySymbol: 'SAR', currencyCode: 'SAR', flag: '🇸🇦' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', currencySymbol: 'R$', currencyCode: 'BRL', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', currencySymbol: 'Mex$', currencyCode: 'MXN', flag: '🇲🇽' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', currencySymbol: 'R', currencyCode: 'ZAR', flag: '🇿🇦' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', currencySymbol: 'PKR', currencyCode: 'PKR', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', currencySymbol: '৳', currencyCode: 'BDT', flag: '🇧🇩' },
  { name: 'Nepal', code: 'NP', dialCode: '+977', currencySymbol: 'रू', currencyCode: 'NPR', flag: '🇳🇵' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', currencySymbol: 'Rs', currencyCode: 'LKR', flag: '🇱🇰' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', currencySymbol: '₦', currencyCode: 'NGN', flag: '🇳🇬' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', currencySymbol: 'KSh', currencyCode: 'KES', flag: '🇰🇪' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', currencySymbol: 'Rp', currencyCode: 'IDR', flag: '🇮🇩' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', currencySymbol: 'RM', currencyCode: 'MYR', flag: '🇲🇾' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', currencySymbol: '₱', currencyCode: 'PHP', flag: '🇵🇭' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', currencySymbol: '฿', currencyCode: 'THB', flag: '🇹🇭' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', currencySymbol: '₫', currencyCode: 'VND', flag: '🇻🇳' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', currencySymbol: '₩', currencyCode: 'KRW', flag: '🇰🇷' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', currencySymbol: '₺', currencyCode: 'TRY', flag: '🇹🇷' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', currencySymbol: 'E£', currencyCode: 'EGP', flag: '🇪🇬' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', currencySymbol: 'kr', currencyCode: 'SEK', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', dialCode: '+47', currencySymbol: 'kr', currencyCode: 'NOK', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', currencySymbol: 'kr', currencyCode: 'DKK', flag: '🇩🇰' },
  { name: 'Poland', code: 'PL', dialCode: '+48', currencySymbol: 'zł', currencyCode: 'PLN', flag: '🇵🇱' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', currencySymbol: '€', currencyCode: 'EUR', flag: '🇮🇪' },
];

/**
 * Find country info by name or code
 */
export function getCountryInfo(countryNameOrCode?: string): CountryInfo {
  if (!countryNameOrCode) {
    return COUNTRIES[0]; // default to India or first in list
  }
  const clean = countryNameOrCode.toLowerCase().trim();
  const found = COUNTRIES.find(
    (c) => c.name.toLowerCase() === clean || c.code.toLowerCase() === clean
  );
  return found || {
    name: countryNameOrCode,
    code: 'XX',
    dialCode: '+1',
    currencySymbol: '$',
    currencyCode: 'USD',
    flag: '🌐'
  };
}

/**
 * Returns currency symbol based on country name or user profile
 */
export function getCurrencySymbol(countryOrUser?: string | { country?: string; currency?: string } | null): string {
  if (!countryOrUser) return '₹';
  if (typeof countryOrUser === 'string') {
    return getCountryInfo(countryOrUser).currencySymbol;
  }
  if (countryOrUser.currency) {
    return countryOrUser.currency;
  }
  if (countryOrUser.country) {
    return getCountryInfo(countryOrUser.country).currencySymbol;
  }
  return '₹';
}

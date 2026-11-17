export interface CountryInfo {
  name: string;
  code: string;
  dialCode: string;
  currencySymbol: string;
  currencyCode: string;
  flag: string;
  states: string[];
}

export const COUNTRIES: CountryInfo[] = [
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    currencySymbol: '₹',
    currencyCode: 'INR',
    flag: '🇮🇳',
    states: [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Delhi (NCT)',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Ladakh',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Puducherry',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Andaman and Nicobar Islands',
      'Lakshadweep',
    ],
  },
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    currencySymbol: '$',
    currencyCode: 'USD',
    flag: '🇺🇸',
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
      'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
    ],
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    currencySymbol: '£',
    currencyCode: 'GBP',
    flag: '🇬🇧',
    states: [
      'England',
      'Scotland',
      'Wales',
      'Northern Ireland',
      'Greater London',
      'South East England',
      'North West England',
      'West Midlands',
      'Yorkshire and the Humber',
      'East Midlands',
      'South West England',
      'East of England',
      'North East England',
    ],
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    flag: '🇨🇦',
    states: [
      'Alberta',
      'British Columbia',
      'Manitoba',
      'New Brunswick',
      'Newfoundland and Labrador',
      'Northwest Territories',
      'Nova Scotia',
      'Nunavut',
      'Ontario',
      'Prince Edward Island',
      'Quebec',
      'Saskatchewan',
      'Yukon',
    ],
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    flag: '🇦🇺',
    states: [
      'Australian Capital Territory',
      'New South Wales',
      'Northern Territory',
      'Queensland',
      'South Australia',
      'Tasmania',
      'Victoria',
      'Western Australia',
    ],
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇩🇪',
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland',
      'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
    ],
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇫🇷',
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany',
      'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France',
      'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie',
      'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur',
    ],
  },
  {
    name: 'Spain',
    code: 'ES',
    dialCode: '+34',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇪🇸',
    states: [
      'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
      'Canary Islands', 'Cantabria', 'Castile and León', 'Castilla-La Mancha',
      'Catalonia', 'Community of Madrid', 'Extremadura', 'Galicia',
      'La Rioja', 'Murcia', 'Navarre', 'Valencian Community',
    ],
  },
  {
    name: 'Italy',
    code: 'IT',
    dialCode: '+39',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇮🇹',
    states: [
      'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria',
      'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio',
      'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont', 'Sardinia',
      'Sicily', 'Trentino-Alto Adige', 'Tuscany', 'Umbria', 'Veneto',
    ],
  },
  {
    name: 'Netherlands',
    code: 'NL',
    dialCode: '+31',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇳🇱',
    states: [
      'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen',
      'Limburg', 'North Brabant', 'North Holland', 'Overijssel',
      'South Holland', 'Utrecht', 'Zeeland',
    ],
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialCode: '+971',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    flag: '🇦🇪',
    states: [
      'Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah',
      'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain',
    ],
  },
  {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    flag: '🇯🇵',
    states: [
      'Aichi', 'Chiba', 'Fukuoka', 'Hiroshima', 'Hokkaido', 'Hyogo',
      'Kanagawa', 'Kyoto', 'Miyagi', 'Nagano', 'Okinawa', 'Osaka',
      'Saitama', 'Shizuoka', 'Tochigi', 'Tokyo', 'Other Prefecture',
    ],
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
    currencySymbol: 'S$',
    currencyCode: 'SGD',
    flag: '🇸🇬',
    states: [
      'Central Region', 'East Region', 'North Region',
      'North-East Region', 'West Region',
    ],
  },
  {
    name: 'Switzerland',
    code: 'CH',
    dialCode: '+41',
    currencySymbol: 'CHF',
    currencyCode: 'CHF',
    flag: '🇨🇭',
    states: [
      'Aargau', 'Basel-Stadt', 'Bern', 'Fribourg', 'Geneva', 'Graubünden',
      'Lucerne', 'Neuchâtel', 'St. Gallen', 'Ticino', 'Valais', 'Vaud', 'Zug', 'Zurich',
    ],
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    dialCode: '+64',
    currencySymbol: 'NZ$',
    currencyCode: 'NZD',
    flag: '🇳🇿',
    states: [
      'Auckland', 'Bay of Plenty', 'Canterbury', 'Gisborne', 'Hawke\'s Bay',
      'Manawatū-Whanganui', 'Marlborough', 'Nelson', 'Northland', 'Otago',
      'Southland', 'Taranaki', 'Tasman', 'Waikato', 'Wellington', 'West Coast',
    ],
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialCode: '+966',
    currencySymbol: 'SAR',
    currencyCode: 'SAR',
    flag: '🇸🇦',
    states: [
      'Al Bahah', 'Al Jawf', 'Al-Qassim', 'Asir', 'Eastern Province',
      'Ha\'il', 'Jazan', 'Madinah', 'Makkah', 'Najran', 'Northern Borders',
      'Riyadh', 'Tabuk',
    ],
  },
  {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    flag: '🇧🇷',
    states: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
      'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
      'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
      'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
      'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima',
      'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins',
    ],
  },
  {
    name: 'Mexico',
    code: 'MX',
    dialCode: '+52',
    currencySymbol: 'Mex$',
    currencyCode: 'MXN',
    flag: '🇲🇽',
    states: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
      'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
      'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico City', 'Mexico State',
      'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
      'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
      'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
    ],
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    currencySymbol: 'R',
    currencyCode: 'ZAR',
    flag: '🇿🇦',
    states: [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
      'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
    ],
  },
  {
    name: 'Pakistan',
    code: 'PK',
    dialCode: '+92',
    currencySymbol: 'PKR',
    currencyCode: 'PKR',
    flag: '🇵🇰',
    states: [
      'Azad Kashmir', 'Balochistan', 'Gilgit-Baltistan',
      'Islamabad Capital Territory', 'Khyber Pakhtunkhwa', 'Punjab', 'Sindh',
    ],
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    dialCode: '+880',
    currencySymbol: '৳',
    currencyCode: 'BDT',
    flag: '🇧🇩',
    states: [
      'Barishal', 'Chattogram', 'Dhaka', 'Khulna',
      'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet',
    ],
  },
  {
    name: 'Nepal',
    code: 'NP',
    dialCode: '+977',
    currencySymbol: 'रू',
    currencyCode: 'NPR',
    flag: '🇳🇵',
    states: [
      'Bagmati', 'Gandaki', 'Karnali', 'Koshi',
      'Lumbini', 'Madhesh', 'Sudurpashchim',
    ],
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    dialCode: '+94',
    currencySymbol: 'Rs',
    currencyCode: 'LKR',
    flag: '🇱🇰',
    states: [
      'Central', 'Eastern', 'North Central', 'North Western',
      'Northern', 'Sabaragamuwa', 'Southern', 'Uva', 'Western',
    ],
  },
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    currencySymbol: '₦',
    currencyCode: 'NGN',
    flag: '🇳🇬',
    states: [
      'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
      'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
      'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
      'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
      'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    ],
  },
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    currencySymbol: 'KSh',
    currencyCode: 'KES',
    flag: '🇰🇪',
    states: [
      'Central', 'Coast', 'Eastern', 'Nairobi',
      'North Eastern', 'Nyanza', 'Rift Valley', 'Western',
    ],
  },
  {
    name: 'Indonesia',
    code: 'ID',
    dialCode: '+62',
    currencySymbol: 'Rp',
    currencyCode: 'IDR',
    flag: '🇮🇩',
    states: [
      'Aceh', 'Bali', 'Banten', 'Central Java', 'East Java',
      'Jakarta', 'North Sumatra', 'Riau', 'South Sulawesi',
      'West Java', 'West Sumatra', 'Yogyakarta',
    ],
  },
  {
    name: 'Malaysia',
    code: 'MY',
    dialCode: '+60',
    currencySymbol: 'RM',
    currencyCode: 'MYR',
    flag: '🇲🇾',
    states: [
      'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca',
      'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
      'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
    ],
  },
  {
    name: 'Philippines',
    code: 'PH',
    dialCode: '+63',
    currencySymbol: '₱',
    currencyCode: 'PHP',
    flag: '🇵🇭',
    states: [
      'Bicol Region', 'Calabarzon', 'Central Luzon', 'Central Visayas',
      'Davao Region', 'Ilocos Region', 'Metro Manila (NCR)', 'Northern Mindanao',
      'Western Visayas', 'Zamboanga Peninsula',
    ],
  },
  {
    name: 'Thailand',
    code: 'TH',
    dialCode: '+66',
    currencySymbol: '฿',
    currencyCode: 'THB',
    flag: '🇹🇭',
    states: [
      'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Chonburi', 'Khon Kaen',
      'Nakhon Ratchasima', 'Nonthaburi', 'Pathum Thani', 'Phuket', 'Songkhla',
    ],
  },
  {
    name: 'Vietnam',
    code: 'VN',
    dialCode: '+84',
    currencySymbol: '₫',
    currencyCode: 'VND',
    flag: '🇻🇳',
    states: [
      'Can Tho', 'Da Nang', 'Hai Phong', 'Hanoi', 'Ho Chi Minh City',
      'Khanh Hoa', 'Nghe An', 'Quang Ninh', 'Thua Thien Hue',
    ],
  },
  {
    name: 'South Korea',
    code: 'KR',
    dialCode: '+82',
    currencySymbol: '₩',
    currencyCode: 'KRW',
    flag: '🇰🇷',
    states: [
      'Busan', 'Chungcheongbuk-do', 'Chungcheongnam-do', 'Daegu', 'Daejeon',
      'Gangwon-do', 'Gwangju', 'Gyeonggi-do', 'Gyeongsangbuk-do',
      'Gyeongsangnam-do', 'Incheon', 'Jeju', 'Jeollabuk-do', 'Jeollanam-do',
      'Sejong', 'Seoul', 'Ulsan',
    ],
  },
  {
    name: 'Turkey',
    code: 'TR',
    dialCode: '+90',
    currencySymbol: '₺',
    currencyCode: 'TRY',
    flag: '🇹🇷',
    states: [
      'Adana', 'Ankara', 'Antalya', 'Bursa', 'Diyarbakır', 'Eskişehir',
      'Gaziantep', 'Istanbul', 'İzmir', 'Kayseri', 'Konya', 'Mersin', 'Trabzon',
    ],
  },
  {
    name: 'Egypt',
    code: 'EG',
    dialCode: '+20',
    currencySymbol: 'E£',
    currencyCode: 'EGP',
    flag: '🇪🇬',
    states: [
      'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Cairo', 'Dakahlia',
      'Gharbia', 'Giza', 'Ismailia', 'Luxor', 'Port Said', 'Qalyubia',
      'Red Sea', 'Sharqia', 'Suez',
    ],
  },
  {
    name: 'Sweden',
    code: 'SE',
    dialCode: '+46',
    currencySymbol: 'kr',
    currencyCode: 'SEK',
    flag: '🇸🇪',
    states: [
      'Blekinge', 'Dalarna', 'Gävleborg', 'Gotland', 'Halland', 'Jämtland',
      'Jönköping', 'Kalmar', 'Kronoberg', 'Norrbotten', 'Örebro', 'Östergötland',
      'Skåne', 'Södermanland', 'Stockholm', 'Uppsala', 'Värmland', 'Västerbotten',
      'Västernorrland', 'Västmanland', 'Västra Götaland',
    ],
  },
  {
    name: 'Norway',
    code: 'NO',
    dialCode: '+47',
    currencySymbol: 'kr',
    currencyCode: 'NOK',
    flag: '🇳🇴',
    states: [
      'Agder', 'Akershus', 'Buskerud', 'Finnmark', 'Innlandet',
      'Møre og Romsdal', 'Nordland', 'Oslo', 'Østfold', 'Rogaland',
      'Telemark', 'Troms', 'Trøndelag', 'Vestfold', 'Vestland',
    ],
  },
  {
    name: 'Denmark',
    code: 'DK',
    dialCode: '+45',
    currencySymbol: 'kr',
    currencyCode: 'DKK',
    flag: '🇩🇰',
    states: [
      'Capital Region of Denmark',
      'Central Denmark Region',
      'North Denmark Region',
      'Region of Southern Denmark',
      'Region Zealand',
    ],
  },
  {
    name: 'Poland',
    code: 'PL',
    dialCode: '+48',
    currencySymbol: 'zł',
    currencyCode: 'PLN',
    flag: '🇵🇱',
    states: [
      'Greater Poland', 'Holy Cross', 'Kuyavian-Pomeranian', 'Lesser Poland',
      'Łódź', 'Lower Silesian', 'Lublin', 'Lubusz', 'Masovian', 'Opole',
      'Podlaskie', 'Pomeranian', 'Silesian', 'Subcarpathian',
      'Warmian-Masurian', 'West Pomeranian',
    ],
  },
  {
    name: 'Ireland',
    code: 'IE',
    dialCode: '+353',
    currencySymbol: '€',
    currencyCode: 'EUR',
    flag: '🇮🇪',
    states: [
      'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway',
      'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick',
      'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly',
      'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath',
      'Wexford', 'Wicklow',
    ],
  },
];

const EMPTY_COUNTRY_INFO: CountryInfo = {
  name: '',
  code: '',
  dialCode: '+91',
  currencySymbol: '₹',
  currencyCode: 'INR',
  flag: '🌍',
  states: [],
};

/**
 * Find country info by name or code.
 * Returns neutral placeholder info when no country is selected.
 */
export function getCountryInfo(countryNameOrCode?: string): CountryInfo {
  if (!countryNameOrCode || !countryNameOrCode.trim()) {
    return EMPTY_COUNTRY_INFO;
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
    flag: '🌐',
    states: [],
  };
}

/**
 * Returns the list of states/provinces for a selected country.
 */
export function getStatesForCountry(countryNameOrCode?: string): string[] {
  if (!countryNameOrCode || !countryNameOrCode.trim()) return [];
  return getCountryInfo(countryNameOrCode).states;
}

/**
 * Returns currency symbol based on country name or user profile.
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

export interface ProfileLocationLike {
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  postalCode?: string;
}

/**
 * Checks whether all required profile location fields have been filled by the user.
 */
export function getMissingProfileLocationFields(user?: ProfileLocationLike | null): string[] {
  if (!user) {
    return ['Country', 'State / Province', 'City', 'Pincode / Postal Code'];
  }
  const missing: string[] = [];
  if (!user.country?.trim()) missing.push('Country');
  if (!user.state?.trim()) missing.push('State / Province');
  if (!user.city?.trim()) missing.push('City');
  if (!(user.pincode?.trim() || user.postalCode?.trim())) missing.push('Pincode / Postal Code');
  return missing;
}

export function isProfileLocationComplete(user?: ProfileLocationLike | null): boolean {
  return getMissingProfileLocationFields(user).length === 0;
}

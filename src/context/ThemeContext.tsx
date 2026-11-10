import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  deep: string;        // Main text, dark buttons, dark contrast
  primary: string;     // Brand accent, focus, active states
  accent: string;      // Borders, soft pills, secondary outlines
  accentLight: string; // Translucent card/badge backgrounds
  canvas: string;      // Page canvas background
  textMuted: string;   // Secondary text
  glow: string;        // Ambient box-shadow glow
  glowStrong: string;  // Hover halo / focus glow
  gradientShine: string; // Gradient color shade
  previewColors: [string, string, string, string];
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'royal-lavender',
    name: 'Royal Lavender',
    subtitle: 'Midnight Violet & Soft Lilac',
    description: 'The signature Color Hunt palette with deep imperial violet, lilac mist and lavender glow.',
    deep: '#3B1E54',
    primary: '#9B7EBD',
    accent: '#D4BEE4',
    accentLight: 'rgba(212, 190, 228, 0.28)',
    canvas: '#EEEEEE',
    textMuted: '#715F85',
    glow: 'rgba(155, 126, 189, 0.45)',
    glowStrong: 'rgba(155, 126, 189, 0.75)',
    gradientShine: 'linear-gradient(135deg, rgba(212, 190, 228, 0.35) 0%, rgba(155, 126, 189, 0.18) 50%, rgba(59, 30, 84, 0.08) 100%)',
    previewColors: ['#3B1E54', '#9B7EBD', '#D4BEE4', '#EEEEEE'],
  },
  {
    id: 'emerald-oasis',
    name: 'Emerald Oasis',
    subtitle: 'Deep Evergreen & Mint Glow',
    description: 'Earthy botanical luxury featuring dark pine, forest green and luminous mint highlights.',
    deep: '#132E20',
    primary: '#2D6A4F',
    accent: '#80ED99',
    accentLight: 'rgba(128, 237, 153, 0.25)',
    canvas: '#F2F7F4',
    textMuted: '#475C51',
    glow: 'rgba(45, 106, 79, 0.45)',
    glowStrong: 'rgba(128, 237, 153, 0.75)',
    gradientShine: 'linear-gradient(135deg, rgba(128, 237, 153, 0.32) 0%, rgba(45, 106, 79, 0.18) 50%, rgba(19, 46, 32, 0.08) 100%)',
    previewColors: ['#132E20', '#2D6A4F', '#80ED99', '#F2F7F4'],
  },
  {
    id: 'ocean-cobalt',
    name: 'Ocean Cobalt',
    subtitle: 'Abyssal Navy & Electric Cyan',
    description: 'Crisp nautical high-tech vibe with deep midnight, electric cobalt and crystal azure shine.',
    deep: '#0A192F',
    primary: '#0284C7',
    accent: '#7DD3FC',
    accentLight: 'rgba(125, 211, 252, 0.28)',
    canvas: '#F0F6FA',
    textMuted: '#475569',
    glow: 'rgba(2, 132, 199, 0.45)',
    glowStrong: 'rgba(125, 211, 252, 0.75)',
    gradientShine: 'linear-gradient(135deg, rgba(125, 211, 252, 0.35) 0%, rgba(2, 132, 199, 0.18) 50%, rgba(10, 25, 47, 0.08) 100%)',
    previewColors: ['#0A192F', '#0284C7', '#7DD3FC', '#F0F6FA'],
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    subtitle: 'Espresso & Terracotta Ember',
    description: 'Warm artisan aesthetic with dark espresso, vibrant amber and golden sunset gradients.',
    deep: '#381208',
    primary: '#EA580C',
    accent: '#FDBA74',
    accentLight: 'rgba(253, 186, 116, 0.28)',
    canvas: '#FAF3EE',
    textMuted: '#785A52',
    glow: 'rgba(234, 88, 12, 0.45)',
    glowStrong: 'rgba(253, 186, 116, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(253, 186, 116, 0.38) 0%, rgba(234, 88, 12, 0.18) 50%, rgba(56, 18, 8, 0.08) 100%)',
    previewColors: ['#381208', '#EA580C', '#FDBA74', '#FAF3EE'],
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    subtitle: 'Velvet Wine & Radiant Fuchsia',
    description: 'Editorial boutique feel with deep wine, vivid magenta and glistening blush accents.',
    deep: '#350819',
    primary: '#BE185D',
    accent: '#F472B6',
    accentLight: 'rgba(244, 114, 182, 0.28)',
    canvas: '#FFF1F2',
    textMuted: '#7F4F61',
    glow: 'rgba(190, 24, 93, 0.45)',
    glowStrong: 'rgba(244, 114, 182, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(244, 114, 182, 0.35) 0%, rgba(190, 24, 93, 0.18) 50%, rgba(53, 8, 25, 0.08) 100%)',
    previewColors: ['#350819', '#BE185D', '#F472B6', '#FFF1F2'],
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    subtitle: 'Midnight Luxe & Champagne Aura',
    description: 'Prestige luxury styling with onyx black, imperial gold and sparkling champagne brilliance.',
    deep: '#18181B',
    primary: '#CA8A04',
    accent: '#FDE047',
    accentLight: 'rgba(253, 224, 71, 0.25)',
    canvas: '#F8F8F9',
    textMuted: '#64646E',
    glow: 'rgba(202, 138, 4, 0.45)',
    glowStrong: 'rgba(253, 224, 71, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(253, 224, 71, 0.35) 0%, rgba(202, 138, 4, 0.18) 50%, rgba(24, 24, 27, 0.08) 100%)',
    previewColors: ['#18181B', '#CA8A04', '#FDE047', '#F8F8F9'],
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    subtitle: 'Charcoal Minimal & Frost Indigo',
    description: 'Clean Scandinavian precision with deep slate, electric indigo and crisp silver glow.',
    deep: '#0F172A',
    primary: '#6366F1',
    accent: '#A5B4FC',
    accentLight: 'rgba(165, 180, 252, 0.28)',
    canvas: '#F8FAFC',
    textMuted: '#475569',
    glow: 'rgba(99, 102, 241, 0.45)',
    glowStrong: 'rgba(165, 180, 252, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(165, 180, 252, 0.35) 0%, rgba(99, 102, 241, 0.18) 50%, rgba(15, 23, 42, 0.08) 100%)',
    previewColors: ['#0F172A', '#6366F1', '#A5B4FC', '#F8FAFC'],
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    subtitle: 'Dark Abyssal & Toxic Emerald',
    description: 'Futuristic night aesthetic with dark carbon, fluorescent emerald and vivid glow rings.',
    deep: '#0B0F19',
    primary: '#059669',
    accent: '#34D399',
    accentLight: 'rgba(52, 211, 153, 0.28)',
    canvas: '#F0FDF4',
    textMuted: '#3E5C50',
    glow: 'rgba(5, 150, 105, 0.45)',
    glowStrong: 'rgba(52, 211, 153, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(52, 211, 153, 0.35) 0%, rgba(5, 150, 105, 0.18) 50%, rgba(11, 15, 25, 0.08) 100%)',
    previewColors: ['#0B0F19', '#059669', '#34D399', '#F0FDF4'],
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson Ruby',
    subtitle: 'Midnight Garnet & Ruby Flame',
    description: 'Passionate and bold palette with deep garnet, incandescent ruby red and warm glowing accents.',
    deep: '#2B0A11',
    primary: '#DC2626',
    accent: '#F87171',
    accentLight: 'rgba(248, 113, 113, 0.26)',
    canvas: '#FEF2F2',
    textMuted: '#7F1D1D',
    glow: 'rgba(220, 38, 38, 0.45)',
    glowStrong: 'rgba(248, 113, 113, 0.75)',
    gradientShine: 'linear-gradient(135deg, rgba(248, 113, 113, 0.35) 0%, rgba(220, 38, 38, 0.18) 50%, rgba(43, 10, 17, 0.08) 100%)',
    previewColors: ['#2B0A11', '#DC2626', '#F87171', '#FEF2F2'],
  },
  {
    id: 'electric-amethyst',
    name: 'Electric Amethyst',
    subtitle: 'Deep Obsidian & Neon Purple',
    description: 'High-energy cyberpunk aesthetic with obsidian night, vivid electric purple and fluorescent glow.',
    deep: '#150A21',
    primary: '#8B5CF6',
    accent: '#C4B5FD',
    accentLight: 'rgba(196, 181, 253, 0.28)',
    canvas: '#FAF5FF',
    textMuted: '#5B21B6',
    glow: 'rgba(139, 92, 246, 0.5)',
    glowStrong: 'rgba(196, 181, 253, 0.8)',
    gradientShine: 'linear-gradient(135deg, rgba(196, 181, 253, 0.35) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(21, 10, 33, 0.08) 100%)',
    previewColors: ['#150A21', '#8B5CF6', '#C4B5FD', '#FAF5FF'],
  },
];

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setThemeId: (id: string) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'resourcebox_selected_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch (e) {
      // Fallback
    }
    return 'royal-lavender';
  });

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const setThemeId = (newId: string) => {
    if (THEMES.some((t) => t.id === newId)) {
      setThemeIdState(newId);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newId);
      } catch (e) {
        // Storage fail
      }
    }
  };

  // Inject CSS custom properties directly onto :root and dynamically sync browser tab 3D cube favicon
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme.id);
    root.style.setProperty('--theme-deep', currentTheme.deep);
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-accent-light', currentTheme.accentLight);
    root.style.setProperty('--theme-canvas', currentTheme.canvas);
    root.style.setProperty('--theme-text-muted', currentTheme.textMuted);
    root.style.setProperty('--theme-glow', currentTheme.glow);
    root.style.setProperty('--theme-glow-strong', currentTheme.glowStrong);
    root.style.setProperty('--theme-gradient-shine', currentTheme.gradientShine);

    // Dynamically update browser tab favicon with 3D cube matching current theme
    try {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${currentTheme.deep}" />
      <stop offset="100%" stop-color="#0E0516" />
    </linearGradient>
    <linearGradient id="topFace" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${currentTheme.accent}" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
    <linearGradient id="leftFace" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${currentTheme.deep}" />
      <stop offset="100%" stop-color="${currentTheme.primary}" />
    </linearGradient>
    <linearGradient id="rightFace" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${currentTheme.primary}" />
      <stop offset="100%" stop-color="${currentTheme.deep}" />
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="116" height="116" rx="28" fill="url(#bgGrad)" stroke="${currentTheme.primary}" stroke-width="2.5" />
  <circle cx="64" cy="62" r="44" fill="${currentTheme.primary}" opacity="0.3" />
  <path d="M 30,42 L 64,61 L 64,100 L 30,81 Z" fill="url(#leftFace)" />
  <path d="M 64,61 L 98,42 L 98,81 L 64,100 Z" fill="url(#rightFace)" />
  <path d="M 64,23 L 98,42 L 64,61 L 30,42 Z" fill="url(#topFace)" />
  <line x1="30" y1="42" x2="64" y2="23" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  <line x1="64" y1="23" x2="98" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  <line x1="64" y1="61" x2="64" y2="100" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  <line x1="64" y1="61" x2="30" y2="42" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
  <line x1="64" y1="61" x2="98" y2="42" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
  <polygon points="64,44 76,61 64,78 52,61" fill="none" stroke="#FFFFFF" stroke-width="1.2" />
  <circle cx="64" cy="61" r="3" fill="#FFFFFF" />
</svg>`;

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/svg+xml';
      link.href = url;
    } catch (e) {
      // Fallback
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

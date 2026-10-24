/**
 * Shared application constants.
 * Single source of truth for paths, navigation, contact defaults, runtime meta, etc.
 */

import type { Locale, Theme } from '@/types';

/** GitHub Pages project base path (empty in local development). */
export const APP_BASE_PATH = process.env.NODE_ENV === 'production' ? '/portfolio-spa' : '';

/** App package / display name */
export const APP_NAME = 'portfolio-spa';

/** Runtime versions shown on the About page (align with package.json / engines). */
export const TYPESCRIPT_VERSION = '5.7';
export const NODE_VERSION = '24';

/** Theme options and default */
export const THEMES = ['light', 'dark', 'system'] as const satisfies readonly Theme[];
export const DEFAULT_THEME: Theme = 'system';

/** Locales */
export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const SUPPORTED_LOCALES: readonly Locale[] = ['pt-BR', 'en-GB'] as const;

/** Brief route-change loading overlay duration (ms) */
export const NAV_LOADING_DURATION_MS = 400;

/** Default dialling code for the contact form */
export const DEFAULT_COUNTRY_CODE = '+55';

export interface CountryCodeOption {
  value: string;
  label: string;
}

/** Country dial codes with flag emoji (single flag in label — no overlay). */
export const COUNTRY_CODES: readonly CountryCodeOption[] = [
  { value: '+55', label: '🇧🇷 +55 (BR)' },
  { value: '+1', label: '🇺🇸 +1 (US/CA)' },
  { value: '+44', label: '🇬🇧 +44 (UK)' },
  { value: '+351', label: '🇵🇹 +351 (PT)' },
  { value: '+34', label: '🇪🇸 +34 (ES)' },
  { value: '+33', label: '🇫🇷 +33 (FR)' },
  { value: '+49', label: '🇩🇪 +49 (DE)' },
  { value: '+39', label: '🇮🇹 +39 (IT)' },
  { value: '+81', label: '🇯🇵 +81 (JP)' },
  { value: '+86', label: '🇨🇳 +86 (CN)' },
  { value: '+91', label: '🇮🇳 +91 (IN)' },
  { value: '+54', label: '🇦🇷 +54 (AR)' },
  { value: '+56', label: '🇨🇱 +56 (CL)' },
  { value: '+57', label: '🇨🇴 +57 (CO)' },
  { value: '+52', label: '🇲🇽 +52 (MX)' },
  { value: '+61', label: '🇦🇺 +61 (AU)' },
] as const;

export type NavItemKey =
  'home' | 'experiences' | 'education' | 'skills' | 'projects' | 'about' | 'contact';

export interface NavItem {
  href: string;
  key: NavItemKey;
}

/** Primary navigation (order preserved in Header). */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', key: 'home' },
  { href: '/experiences/', key: 'experiences' },
  { href: '/education/', key: 'education' },
  { href: '/skills/', key: 'skills' },
  { href: '/projects/', key: 'projects' },
  { href: '/about/', key: 'about' },
  { href: '/contact/', key: 'contact' },
] as const;

export interface SocialLink {
  key: 'socialGithub' | 'socialMedium' | 'socialLinkedin';
  href: string;
  /** lucide icon name hint for consumers */
  icon: 'github' | 'medium' | 'linkedin';
}

/** Public profile links (footer, about page). */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { key: 'socialGithub', href: 'https://github.com/lwglg', icon: 'github' },
  { key: 'socialMedium', href: 'https://medium.com/@guligon90', icon: 'medium' },
  { key: 'socialLinkedin', href: 'https://www.linkedin.com/in/guligon90', icon: 'linkedin' },
] as const;

/** LocalStorage keys */
export const STORAGE_KEYS = {
  theme: 'theme',
  locale: 'locale',
} as const;

/** Public asset paths (without basePath — use with assetPath()). */
export const ASSET_PATHS = {
  photo: '/photo.svg',
  logo: '/logos/gg-ltda.svg',
  favicon: '/logos/gg-ltda.svg',
} as const;

/** Contact form Worker URL (Resend via Cloudflare). Empty = mock in development. */
export const CONTACT_API_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTACT_API_URL) || '';

// Configuration globale — lue depuis le fichier .env (préfixe VITE_ obligatoire)
const env = import.meta.env;

export const API_BASE_URL = (env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

// Si true : en cas d'API absente ou en erreur, on affiche les données de démonstration
export const USE_MOCK_FALLBACK = String(env.VITE_USE_MOCK_FALLBACK ?? 'true') !== 'false';

export const SITE = {
  name: 'ECHOSCIENCE',
  tagline: 'Faire résonner la science au Gabon et en Afrique',
  founded: '2026-10-05',
  law: 'loi n°35/62',
  address: 'Quartier Glass, Libreville — Gabon',
  email: 'contact@echoscience.ga',
  phone: '+241 00 00 00 00',
  membershipFee: '10 000 FCFA',
};

export const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
  { name: 'TikTok', href: 'https://www.tiktok.com/', icon: 'tiktok' },
  { name: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
];

export const PER_PAGE = 6;

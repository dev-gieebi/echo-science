// Tous les appels HTTP du site. Repli automatique sur les données de démo (src/data/mock.js).
import { API_BASE_URL, USE_MOCK_FALLBACK } from './config.js';
import { MOCK_ARTICLES, MOCK_CATEGORIES, MOCK_TEAM } from '../data/mock.js';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

const TIMEOUT_MS = 8000;

async function request(path, { method = 'GET', body, signal } = {}) {
  if (!API_BASE_URL) throw new ApiError('API non configurée', 0);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => ctrl.abort(), { once: true });

  try {
    const res = await fetch(API_BASE_URL + path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    let json = null;
    try { json = await res.json(); } catch { /* réponse vide */ }
    if (!res.ok) {
      throw new ApiError(json?.message || `Erreur ${res.status}`, res.status);
    }
    return json;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (signal?.aborted) throw err;
    throw new ApiError('Le serveur est injoignable. Réessayez plus tard.', 0);
  } finally {
    clearTimeout(timer);
  }
}

// Erreur « réseau » ou 5xx → on peut se replier sur la démo. Une 404 reste une 404.
const canFallback = (err) => USE_MOCK_FALLBACK && err?.name !== 'AbortError' && (err.status === 0 || err.status >= 500);

const qs = (params) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') p.set(k, v); });
  const s = p.toString();
  return s ? `?${s}` : '';
};

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function mockList({ page = 1, per_page = 6, category, search }) {
  let items = [...MOCK_ARTICLES].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  if (category) items = items.filter((a) => a.category.slug === category);
  if (search) {
    const q = normalize(search);
    items = items.filter((a) => normalize(a.title + ' ' + a.excerpt).includes(q));
  }
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / per_page));
  const current = Math.min(Math.max(1, page), last_page);
  const data = items.slice((current - 1) * per_page, current * per_page).map(({ content, ...rest }) => rest);
  return { data, meta: { current_page: current, last_page, total }, demo: true };
}

export async function getArticles(params = {}, signal) {
  try {
    return await request('/articles' + qs(params), { signal });
  } catch (err) {
    if (canFallback(err)) return mockList(params);
    throw err;
  }
}

export async function getArticle(slug, signal) {
  try {
    const json = await request(`/articles/${encodeURIComponent(slug)}`, { signal });
    return json.data;
  } catch (err) {
    if (canFallback(err)) {
      const found = MOCK_ARTICLES.find((a) => a.slug === slug);
      if (found) return found;
      throw new ApiError('Article introuvable', 404);
    }
    throw err;
  }
}

export async function getCategories(signal) {
  try {
    const json = await request('/categories', { signal });
    return json.data;
  } catch (err) {
    if (canFallback(err)) return MOCK_CATEGORIES;
    throw err;
  }
}

export async function getTeam(signal) {
  try {
    const json = await request('/team', { signal });
    return json.data;
  } catch (err) {
    if (canFallback(err)) return MOCK_TEAM;
    throw err;
  }
}

// Formulaires : jamais de repli silencieux, sauf en mode démo sans API configurée
async function post(path, body) {
  if (!API_BASE_URL && USE_MOCK_FALLBACK) {
    await new Promise((r) => setTimeout(r, 900));
    return { message: 'Mode démonstration : message simulé (aucun backend configuré).', demo: true };
  }
  return request(path, { method: 'POST', body });
}

export const sendContact = (data) => post('/contact', data);
export const sendAdhesion = (data) => post('/adhesions', data);
export const subscribeNewsletter = (email) => post('/newsletter', { email });

// Liste blanche minimale pour le HTML des articles (le serveur doit aussi nettoyer).
const ALLOWED_TAGS = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'A', 'UL', 'OL', 'LI', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'FIGURE', 'FIGCAPTION', 'IMG', 'CODE', 'PRE', 'HR', 'SPAN', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
const ALLOWED_ATTRS = { A: ['href', 'title'], IMG: ['src', 'alt', 'width', 'height'] };
const SAFE_URL = /^(https?:|mailto:|\/|#)/i;

export function sanitize(html = '') {
  if (typeof window === 'undefined' || !html) return '';
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const walk = (node) => {
    [...node.children].forEach((el) => {
      if (!ALLOWED_TAGS.has(el.tagName)) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(el.tagName)) el.remove();
        else { walk(el); el.replaceWith(...el.childNodes); }
        return;
      }
      const keep = ALLOWED_ATTRS[el.tagName] || [];
      [...el.attributes].forEach((attr) => {
        const ok = keep.includes(attr.name) && (!['href', 'src'].includes(attr.name) || SAFE_URL.test(attr.value.trim()));
        if (!ok) el.removeAttribute(attr.name);
      });
      if (el.tagName === 'A') { el.setAttribute('rel', 'noopener noreferrer'); el.setAttribute('target', '_blank'); }
      if (el.tagName === 'IMG') el.setAttribute('loading', 'lazy');
      walk(el);
    });
  };
  const root = doc.body.firstElementChild;
  walk(root);
  return root.innerHTML;
}

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

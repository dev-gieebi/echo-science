import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard, { PostSkeleton } from '../components/PostCard.jsx';
import { Icon } from '../components/Icons.jsx';
import { PageHeader } from '../components/Sections.jsx';
import { getArticles, getCategories } from '../lib/api.js';
import { PER_PAGE } from '../lib/config.js';

function Pagination({ current, last, onChange }) {
  if (last <= 1) return null;
  const pages = [];
  for (let p = 1; p <= last; p++) {
    if (p === 1 || p === last || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="pagination__btn" disabled={current <= 1} onClick={() => onChange(current - 1)} aria-label="Page précédente">
        <Icon name="arrowLeft" size={18} />
      </button>
      {pages.map((p, i) => p === '…'
        ? <span key={`e${i}`} className="pagination__ellipsis">…</span>
        : <button key={p} className={`pagination__btn${p === current ? ' is-active' : ''}`} aria-current={p === current ? 'page' : undefined} onClick={() => onChange(p)}>{p}</button>)}
      <button className="pagination__btn" disabled={current >= last} onClick={() => onChange(current + 1)} aria-label="Page suivante">
        <Icon name="arrow" size={18} />
      </button>
    </nav>
  );
}

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const category = params.get('categorie') || '';
  const search = params.get('q') || '';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(search);
  const listTop = useRef(null);

  useEffect(() => { document.title = 'Actualités — ECHOSCIENCE'; }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    getCategories(ctrl.signal).then(setCategories).catch(() => {});
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true); setError('');
    getArticles({ page, per_page: PER_PAGE, category, search }, ctrl.signal)
      .then((r) => { setResult(r); setLoading(false); })
      .catch((e) => { if (e.name !== 'AbortError') { setError(e.message); setLoading(false); } });
    return () => ctrl.abort();
  }, [page, category, search]);

  const update = (changes, { scroll = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page');
    if (next.get('page') === '1') next.delete('page');
    setParams(next, { replace: !scroll });
    if (scroll) listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Recherche avec délai de 350 ms
  useEffect(() => {
    if (query.trim() === search) return;
    const t = setTimeout(() => update({ q: query.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  // Synchronise le champ si l'URL change (précédent/suivant du navigateur)
  useEffect(() => { setQuery((q) => (q.trim() === search ? q : search)); }, [search]);

  const posts = result?.data || [];
  const meta = result?.meta || { current_page: 1, last_page: 1, total: 0 };
  const featured = page === 1 && !search && posts.length > 0;

  return (
    <>
      <PageHeader eyebrow="Le blog" title={<>Actualités &amp; <em className="grad-text">découvertes</em></>}>
        <p className="page-header__lead">La vie de l'ONG, nos événements et les recherches qui font avancer le Gabon et l'Afrique.</p>
      </PageHeader>

      <section className="section blog" aria-label="Articles">
        <div className="container">
          <div className="toolbar" ref={listTop}>
            <div className="toolbar__filters" role="group" aria-label="Filtrer par catégorie">
              <button className={`filter${!category ? ' is-active' : ''}`} aria-pressed={!category} onClick={() => update({ categorie: '' })}>Tout</button>
              {categories.map((c) => (
                <button key={c.slug} className={`filter${category === c.slug ? ' is-active' : ''}`} aria-pressed={category === c.slug}
                  onClick={() => update({ categorie: c.slug })}>{c.name}</button>
              ))}
            </div>
            <label className="toolbar__search">
              <Icon name="search" size={18} />
              <span className="sr-only">Rechercher un article</span>
              <input type="search" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={100} />
            </label>
          </div>

          {result?.demo && <p className="demo-note mono">Données de démonstration — le backend n'est pas encore connecté.</p>}

          {error && <div className="empty"><p>{error}</p></div>}

          {loading && !error && (
            <div className="posts-grid" aria-busy="true">
              {Array.from({ length: PER_PAGE }).map((_, i) => <PostSkeleton key={i} />)}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="empty">
              <svg viewBox="0 0 120 120" aria-hidden="true" className="empty__art">
                {[16, 32, 48].map((r) => <circle key={r} cx="60" cy="60" r={r} />)}
              </svg>
              <h2>Aucun article trouvé</h2>
              <p>Essayez une autre catégorie ou un autre mot-clé.</p>
              <button className="btn btn--outline" onClick={() => { setQuery(''); setParams({}); }}>Réinitialiser les filtres</button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="posts-grid" key={`${category}-${search}-${page}`}>
                {posts.map((p, i) => <PostCard key={p.id ?? p.slug} post={p} index={i} featured={featured && i === 0} />)}
              </div>
              <p className="blog__count mono">{meta.total} article{meta.total > 1 ? 's' : ''}</p>
              <Pagination current={meta.current_page} last={meta.last_page} onChange={(p) => update({ page: String(p) }, { scroll: true })} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { Cover } from '../components/PostCard.jsx';
import { Icon } from '../components/Icons.jsx';
import { formatDate, getArticle, getArticles, sanitize } from '../lib/api.js';
import NotFound from './NotFound.jsx';

function Share({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links = [
    { name: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'X', icon: 'x', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/?text=${t}%20${u}` },
    { name: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* presse-papiers indisponible */ }
  };
  return (
    <div className="share">
      <span className="mono share__label">Partager</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="share__btn" aria-label={`Partager sur ${l.name}`}>
          <Icon name={l.icon} size={18} />
        </a>
      ))}
      <button className={`share__btn${copied ? ' is-done' : ''}`} onClick={copy} aria-label="Copier le lien">
        <Icon name={copied ? 'check' : 'copy'} size={18} />
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Lien copié' : ''}</span>
    </div>
  );
}

export default function Article() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error
  const [error, setError] = useState('');
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading'); setPost(null); setRelated([]);
    getArticle(slug, ctrl.signal)
      .then((p) => { setPost(p); setStatus('ok'); document.title = `${p.title} — ECHOSCIENCE`; })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        if (e.status === 404) setStatus('notfound');
        else { setError(e.message); setStatus('error'); }
      });
    return () => ctrl.abort();
  }, [slug]);

  useEffect(() => {
    if (!post?.category?.slug) return;
    const ctrl = new AbortController();
    getArticles({ page: 1, per_page: 4, category: post.category.slug }, ctrl.signal)
      .then((r) => setRelated((r.data || []).filter((a) => a.slug !== post.slug).slice(0, 3)))
      .catch(() => {});
    return () => ctrl.abort();
  }, [post]);

  const html = useMemo(() => sanitize(post?.content || ''), [post]);

  if (status === 'notfound') return <NotFound message="Cet article n'existe pas ou a été retiré." />;

  return (
    <article className="article">
      <header className="article__header">
        <div className="page-header__ripples" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => <span key={i} style={{ '--i': i }} />)}
        </div>
        <div className="container container--narrow">
          <Link to="/blog" className="back-link mono"><Icon name="arrowLeft" size={16} /> Toutes les actualités</Link>
          {status === 'loading' && (
            <div aria-busy="true">
              <div className="skeleton skeleton--line short dark" />
              <div className="skeleton skeleton--title dark" />
            </div>
          )}
          {status === 'error' && <p className="article__error">{error}</p>}
          {post && (
            <>
              {post.category && (
                <Link to={`/blog?categorie=${post.category.slug}`} className="chip chip--light">{post.category.name}</Link>
              )}
              <h1 className="article__title">{post.title}</h1>
              <div className="article__meta mono">
                <span className="article__author">
                  <span className="article__avatar" aria-hidden="true">
                    {post.author?.avatar ? <img src={post.author.avatar} alt="" /> : (post.author?.name || 'E')[0]}
                  </span>
                  {post.author?.name}
                </span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                {post.reading_time ? <span><Icon name="clock" size={14} /> {post.reading_time} min de lecture</span> : null}
              </div>
            </>
          )}
        </div>
      </header>

      {post && (
        <>
          <div className="container container--narrow">
            <div className="article__cover"><Cover post={post} /></div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            <Share title={post.title} />
          </div>

          {related.length > 0 && (
            <section className="section related" aria-labelledby="related-title">
              <div className="container">
                <h2 className="h3" id="related-title">Dans la même catégorie</h2>
                <div className="posts-grid posts-grid--3">
                  {related.map((p, i) => <PostCard key={p.id ?? p.slug} post={p} index={i} />)}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </article>
  );
}

import { Link } from 'react-router-dom';
import { formatDate } from '../lib/api.js';
import { Icon } from './Icons.jsx';

// Couverture de repli : motif d'ondes généré selon l'id de l'article
export function Cover({ post, className = '' }) {
  if (post.cover_image) {
    return <img className={`cover ${className}`} src={post.cover_image} alt="" loading="lazy" />;
  }
  const v = (post.id || post.slug?.length || 1) % 4;
  return (
    <div className={`cover cover--art cover--v${v} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        {[20, 50, 80, 110, 140, 170, 200].map((r, i) => (
          <circle key={r} cx={v % 2 ? 320 : 80} cy={v < 2 ? 200 : 40} r={r} style={{ '--i': i }} />
        ))}
      </svg>
      <span className="cover__label mono">{post.category?.name}</span>
    </div>
  );
}

export default function PostCard({ post, featured = false, index = 0 }) {
  return (
    <article className={`post-card${featured ? ' post-card--featured' : ''}`} data-reveal style={{ '--d': `${(index % 3) * 90}ms` }}>
      <Link to={`/blog/${post.slug}`} className="post-card__link">
        <div className="post-card__media"><Cover post={post} /></div>
        <div className="post-card__body">
          <div className="post-card__meta mono">
            {post.category && <span className="chip">{post.category.name}</span>}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
          <h3 className="post-card__title">{post.title}</h3>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <span className="post-card__more">
            Lire l'article <Icon name="arrow" size={16} />
            {post.reading_time ? <span className="post-card__time mono"><Icon name="clock" size={14} /> {post.reading_time} min</span> : null}
          </span>
        </div>
      </Link>
    </article>
  );
}

export function PostSkeleton() {
  return (
    <div className="post-card post-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--media" />
      <div className="post-card__body">
        <div className="skeleton skeleton--line short" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" />
      </div>
    </div>
  );
}

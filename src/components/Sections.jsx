import { useEffect, useRef, useState } from 'react';
import { ACTIVITIES, DOMAINS, GOVERNANCE, MISSIONS, STATS } from '../data/content.js';
import { SITE } from '../lib/config.js';
import { useInView, prefersReducedMotion } from '../hooks/useReveal.js';
import { Icon } from './Icons.jsx';

export function SectionHead({ eyebrow, title, intro, light = false, center = false }) {
  return (
    <div className={`section-head${center ? ' section-head--center' : ''}`} data-reveal>
      <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>{eyebrow}</p>
      <h2 className={`h2${light ? ' h2--light' : ''}`}>{title}</h2>
      {intro && <p className={`section-head__intro${light ? ' is-light' : ''}`}>{intro}</p>}
    </div>
  );
}

/* ---------- En-tête des pages intérieures ---------- */
export function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="page-header">
      <div className="page-header__ripples" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <span key={i} style={{ '--i': i }} />)}
      </div>
      <div className="container page-header__inner">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1 className="page-header__title">{title}</h1>
        {children}
      </div>
    </header>
  );
}

/* ---------- Bandeau défilant incliné ---------- */
export function Marquee() {
  const items = [...DOMAINS, ...DOMAINS];
  return (
    <div className="marquee" aria-label="Nos disciplines">
      <div className="marquee__track">
        {items.map((d, i) => (
          <span key={i} className="marquee__item" aria-hidden={i >= DOMAINS.length}>
            {d.name}<span className="marquee__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Compteur animé ---------- */
function Counter({ value, suffix, label }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) { setN(value); return; }
    let raf = 0;
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div className="stat" ref={ref} data-reveal>
      <span className="stat__value" aria-hidden="true">{n}<span className="stat__suffix">{suffix}</span></span>
      <span className="sr-only">{value}{suffix}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

/* ---------- À propos ---------- */
export function About() {
  return (
    <section className="section about" id="apropos" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          <div className="about__text" data-reveal>
            <p className="eyebrow">À propos</p>
            <h2 className="h2" id="about-title">Une interface entre la <span className="text-green">science</span> et la société.</h2>
            <p>
              Créée le <strong>5 octobre 2026</strong> à Libreville (quartier Glass) et régie par la <strong>{SITE.law}</strong>,
              ECHOSCIENCE est une organisation non gouvernementale qui promeut la culture scientifique au Gabon et en Afrique.
            </p>
            <p>
              Elle réunit chercheurs, enseignants, ingénieurs, techniciens et passionnés pour rapprocher la recherche
              des citoyens, des écoles et des décideurs — et faire de chaque découverte un écho qui porte loin.
            </p>
          </div>
          <figure className="quote-card" data-reveal style={{ '--d': '120ms' }}>
            <svg className="quote-card__waves" viewBox="0 0 200 200" aria-hidden="true">
              {[30, 55, 80, 105, 130].map((r) => <circle key={r} cx="200" cy="0" r={r} />)}
            </svg>
            <span className="quote-card__mark" aria-hidden="true">“</span>
            <blockquote>
              La science n'appartient pas aux laboratoires : elle appartient à celles et ceux qu'elle éclaire.
            </blockquote>
            <figcaption className="mono">— Le bureau exécutif</figcaption>
          </figure>
        </div>
        <div className="stats">
          {STATS.map((s, i) => <Counter key={i} {...s} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Carte inclinable 3D ---------- */
function TiltCard({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (prefersReducedMotion() || e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <article ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </article>
  );
}

/* ---------- Missions ---------- */
export function Missions({ children }) {
  return (
    <section className="section missions" id="missions" aria-labelledby="missions-title">
      <div className="missions__grid-bg" aria-hidden="true" />
      <div className="container">
        <SectionHead light eyebrow="Nos missions" title={<span id="missions-title">Six engagements pour la culture scientifique.</span>}
          intro="Des actions concrètes pour rapprocher la recherche de la société, du laboratoire à la salle de classe." />
        <div className="missions__list">
          {MISSIONS.map((m, i) => (
            <div key={m.n} data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
              <TiltCard className="mission">
                <span className="mission__n mono">{m.n}</span>
                <h3 className="mission__title">{m.title}</h3>
                <p>{m.text}</p>
                <span className="mission__glow" aria-hidden="true" />
              </TiltCard>
            </div>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------- Domaines ---------- */
export function Domains({ dark = false, children }) {
  return (
    <section className={`section domains${dark ? ' domains--dark' : ''}`} id="domaines" aria-labelledby="domains-title">
      {dark && <div className="missions__grid-bg" aria-hidden="true" />}
      <div className="container">
        <SectionHead center light={dark} eyebrow="Domaines" title={<span id="domains-title">Dix disciplines, une même curiosité.</span>} />
        <ul className="domains__list">
          {DOMAINS.map((d, i) => (
            <li key={d.name} className="domain" data-reveal style={{ '--d': `${i * 50}ms` }} tabIndex={0}>
              <span className="domain__sym">
                <small>{i + 1}</small>{d.sym}
              </span>
              <span className="domain__name">{d.name}</span>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  );
}

/* ---------- Activités ---------- */
export function Activities({ children }) {
  return (
    <section className="section activities" id="activites" aria-labelledby="activities-title">
      <div className="container">
        <SectionHead eyebrow="Activités" title={<span id="activities-title">Ce que nous faisons.</span>}
          intro="Quatre façons de faire vivre la science, sur le terrain comme en ligne." />
        <div className="activities__list">
          {ACTIVITIES.map((a, i) => (
            <article key={a.key} className={`activity activity--${a.key}`} tabIndex={0} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <div className="activity__bg" aria-hidden="true" />
              <span className="activity__icon"><Icon name={a.icon} size={30} /></span>
              <div className="activity__body">
                <span className="mono activity__n">0{i + 1}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </article>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------- Gouvernance ---------- */
export function Governance() {
  return (
    <section className="section governance" id="gouvernance" aria-labelledby="gov-title">
      <div className="container">
        <SectionHead center eyebrow="Gouvernance" title={<span id="gov-title">Une organisation claire et collégiale.</span>} />
        <div className="gov">
          <span className="gov__line" aria-hidden="true" />
          <ol className="gov__list">
          {GOVERNANCE.map((g, i) => (
            <li key={g.title} className="gov__item" data-reveal style={{ '--d': `${i * 140}ms` }}>
              <span className="gov__node mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

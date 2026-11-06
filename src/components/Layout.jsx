import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/content.js';
import { SITE, SOCIALS } from '../lib/config.js';
import { subscribeNewsletter } from '../lib/api.js';
import { useReveal, prefersReducedMotion } from '../hooks/useReveal.js';
import { useFormSubmit, FormStatus } from './FormStatus.jsx';
import { Icon, Logo } from './Icons.jsx';

/* ---------- Préchargeur ---------- */
function Preloader() {
  const [state, setState] = useState('on'); // on → leaving → off
  useEffect(() => {
    const delay = prefersReducedMotion() ? 0 : 1100;
    const t1 = setTimeout(() => setState('leaving'), delay);
    const t2 = setTimeout(() => setState('off'), delay + 650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', state === 'on');
  }, [state]);
  if (state === 'off') return null;
  return (
    <div className={`preloader${state === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
      <Logo size="lg" />
      <div className="preloader__waves">
        {Array.from({ length: 9 }).map((_, i) => <span key={i} style={{ '--i': i }} />)}
      </div>
    </div>
  );
}

/* ---------- Curseur personnalisé (desktop, pointeur fin) ---------- */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      const hot = e.target.closest('a, button, input, textarea, select, label, [data-cursor]');
      ring.current?.classList.toggle('is-hover', !!hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => { x = y = -100; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ---------- Boutons magnétiques (délégation globale sur .magnetic) ---------- */
function useMagnetic() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    let current = null;
    const move = (e) => {
      const el = e.target.closest?.('.magnetic');
      if (current && current !== el) { current.style.transform = ''; current = null; }
      if (!el) return;
      current = el;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
}

/* ---------- Navigation ---------- */
function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);


  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${scrolled ? '' : ' is-dark'}${open ? ' is-open' : ''}`}>
      <div className="nav__progress" ref={bar} aria-hidden="true" />
      <div className="nav__inner container">
        <Link to="/" onClick={scrollTopNow} className="nav__brand" aria-label="ECHOSCIENCE — accueil">
          <Logo size="sm" />
        </Link>
        <nav className="nav__links" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              onClick={scrollTopNow} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/adhesion" className="btn btn--green btn--sm nav__cta magnetic">Adhérer</Link>
        <button className="nav__burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" aria-hidden={!open} inert={open ? undefined : ''}>
        <nav aria-label="Menu mobile">
          {NAV_LINKS.map((l, i) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} style={{ '--i': i }}
              onClick={() => { setOpen(false); scrollTopNow(); }}>{l.label}</NavLink>
          ))}
          <Link to="/adhesion" style={{ '--i': NAV_LINKS.length }} className="mobile-menu__cta" onClick={() => setOpen(false)}>Devenir membre</Link>
        </nav>
        <p className="mobile-menu__meta mono">{SITE.address}</p>
      </div>
    </header>
  );
}

/* ---------- Pied de page ---------- */
function Newsletter() {
  const [email, setEmail] = useState('');
  const { status, message, submit } = useFormSubmit(subscribeNewsletter);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (e.currentTarget.website.value) return; // piège anti-spam
    const ok = await submit(email, "Merci ! Vous êtes inscrit·e à notre lettre d'information.");
    if (ok) setEmail('');
  };
  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor="nl-email" className="mono newsletter__label">Lettre d'information</label>
      <div className="newsletter__row">
        <input id="nl-email" type="email" required placeholder="votre@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <button className="btn btn--green btn--sm" disabled={status === 'loading'}>
          {status === 'loading' ? '…' : "S'inscrire"}
        </button>
      </div>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <FormStatus status={status} message={message} />
    </form>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo size="md" />
          <p>{SITE.tagline}. ONG régie par la {SITE.law}, créée le 5 octobre 2026 à Libreville.</p>
          <ul className="socials">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="magnetic">
                  <Icon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer__title mono">Explorer</h3>
          <ul className="footer__links">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} onClick={scrollTopNow}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer__title mono">Contact</h3>
          <ul className="footer__links">
            <li>{SITE.address}</li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><Link to="/adhesion">Devenir membre</Link></li>
          </ul>
        </div>
        <Newsletter />
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} ECHOSCIENCE — Tous droits réservés.</span>
        <span className="mono">Libreville · Gabon</span>
      </div>
      <div className="footer__giant" aria-hidden="true">ECHOSCIENCE</div>
    </footer>
  );
}

/* ---------- Bouton flèche : descend en bas / remonte en haut ---------- */
function ScrollToggle() {
  const { pathname } = useLocation();
  const [state, setState] = useState({ show: false, down: true });
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        // flèche vers le bas dans la première moitié de la page, vers le haut ensuite
        setState({ show: max > 200, down: window.scrollY < max / 2 });
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('scroll', update); };
  }, [pathname]);

  const go = () => {
    const top = state.down ? document.documentElement.scrollHeight : 0;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  return (
    <button className={`to-top magnetic${state.show ? ' is-shown' : ''}${state.down ? ' is-down' : ''}`}
      aria-label={state.down ? 'Descendre en bas de la page' : 'Remonter en haut de la page'}
      tabIndex={state.show ? 0 : -1} onClick={go}>
      <Icon name="arrowUp" />
    </button>
  );
}

/* ---------- Chaque changement de page ramène en haut ---------- */
const scrollTopNow = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        else if (tries++ < 20) setTimeout(go, 50);
      };
      go();
    } else {
      scrollTopNow();
    }
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  useReveal();
  useMagnetic();
  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Aller au contenu
      </a>
      <Preloader />
      <Cursor />
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToggle />
    </>
  );
}

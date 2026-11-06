import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TYPEWRITER_WORDS } from '../data/content.js';
import { prefersReducedMotion } from '../hooks/useReveal.js';
import { Icon, Logo } from './Icons.jsx';

/* ---------- Constellation / réseau neuronal ---------- */
function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, running = false, visible = true;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 130, REPEL = 140;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 14000)));
      nodes = Array.from({ length: count }, () => {
        const x = Math.random() * w, y = Math.random() * h;
        return {
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.8, green: Math.random() < 0.28,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < REPEL && d > 0.1) {
            const f = (1 - d / REPEL) * 3.2;
            n.x += (dx / d) * f; n.y += (dy / d) * f;
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = 1 - Math.sqrt(d2) / LINK;
            ctx.strokeStyle = a.green && b.green ? `rgba(34,194,106,${o * 0.55})` : `rgba(120,150,230,${o * 0.32})`;
            ctx.lineWidth = o * 1.1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const pulse = reduced ? 1 : 0.75 + Math.sin(t / 700 + n.phase) * 0.25;
        ctx.fillStyle = n.green ? `rgba(34,194,106,${0.9 * pulse})` : `rgba(200,214,255,${0.8 * pulse})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (n.green ? 1.3 : 1), 0, Math.PI * 2); ctx.fill();
        if (n.green) {
          ctx.fillStyle = `rgba(34,194,106,${0.12 * pulse})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
    const start = () => { if (!running && visible && !reduced && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    init(); draw();
    start();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    let resizeT = 0;
    const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(() => { init(); draw(); }, 150); };
    const onVis = () => (document.hidden ? stop() : start());

    // Pause hors écran
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    const host = canvas.parentElement;
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop(); io.disconnect(); clearTimeout(resizeT);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />;
}

/* ---------- Machine à écrire ---------- */
function Typewriter({ words }) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // phases : delete → type → (pause) → delete…
    let i = 0, j = words[0].length, phase = 'delete', t = 0;
    const tick = () => {
      let delay = 45;
      if (phase === 'delete') {
        j--;
        if (j === 0) { i = (i + 1) % words.length; phase = 'type'; }
      } else {
        j++;
        delay = 85;
        if (j === words[i].length) { phase = 'delete'; delay = 1700; }
      }
      setText(words[i].slice(0, j));
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 2600);
    return () => clearTimeout(t);
  }, [words]);
  return (
    <span className="typewriter">
      <span className="typewriter__text">{text}</span>
      <span className="typewriter__caret" aria-hidden="true" />
    </span>
  );
}

/* ---------- Visuel d'orbites ---------- */
function Orbits() {
  const ref = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const move = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      ref.current?.style.setProperty('--px', cx.toFixed(3));
      ref.current?.style.setProperty('--py', cy.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <div className="orbits" ref={ref} aria-hidden="true">
      <div className="orbits__glow" />
      <div className="orbit orbit--1"><span className="orbit__planet" /></div>
      <div className="orbit orbit--2"><span className="orbit__planet orbit__planet--green" /></div>
      <div className="orbit orbit--3"><span className="orbit__planet" /><span className="orbit__planet orbit__planet--green orbit__planet--b" /></div>
      <div className="orbits__wave" />
      <div className="orbits__wave orbits__wave--2" />
      <div className="orbits__core"><Logo size="md" /></div>
      <span className="float-tag float-tag--1"><i />Physique nucléaire</span>
      <span className="float-tag float-tag--2"><i />Biologie · Virologie</span>
      <span className="float-tag float-tag--3"><i />Géologie &amp; fossiles</span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="accueil" aria-labelledby="hero-title">
      <Constellation />
      <div className="hero__grain" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow eyebrow--light hero__eyebrow">
            <span className="dot-live" /> ONG · Libreville, Gabon · depuis 2026
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="line"><span>Faire résonner</span></span>
            <span className="line"><span>la <em className="grad-text">science</em></span></span>
            <span className="line"><span>en Afrique.</span></span>
          </h1>
          <p className="hero__lead">
            Chercheurs, enseignants, ingénieurs et passionnés réunis pour partager {' '}
            <Typewriter words={TYPEWRITER_WORDS} />
          </p>
          <div className="hero__actions">
            <Link to="/adhesion" className="btn btn--green magnetic">Devenir membre <Icon name="arrow" size={18} /></Link>
            <Link to="/missions" className="btn btn--ghost magnetic">Nos missions</Link>
          </div>
        </div>
        <Orbits />
      </div>
      <button type="button" className="hero__scroll" aria-label="Défiler vers la suite de la page"
        onClick={() => window.scrollTo({ top: window.innerHeight - 60, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}>
        <span className="mono">Défiler</span><span className="hero__scroll-line" />
      </button>
    </section>
  );
}

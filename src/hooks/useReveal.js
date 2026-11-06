import { useEffect, useRef, useState } from 'react';

// Ajoute .is-visible aux éléments [data-reveal] quand ils entrent à l'écran.
// Un MutationObserver prend en charge les éléments ajoutés plus tard (données de l'API).
export function useReveal() {
  useEffect(() => {
    const all = () => document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      all().forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    // Suivi propre à chaque exécution de l'effet : en développement, StrictMode monte deux fois
    // les composants ; un marqueur posé sur l'élément empêchait le second observateur de le voir.
    const bound = new WeakSet();
    const scan = () => all().forEach((el) => {
      if (!bound.has(el)) { bound.add(el); io.observe(el); }
    });
    scan();
    let raf = 0;
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);
}

// Renvoie [ref, visible] pour un élément unique (compteurs, canvas…)
export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting && once) io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

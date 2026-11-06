import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getTeam } from '../lib/api.js';
import { SectionHead } from './Sections.jsx';

const TABS = [
  { key: 'bureau', label: 'Bureau exécutif' },
  { key: 'comite', label: 'Comité scientifique' },
];

const initials = (name) =>
  name.replace(/^(Dr|Ing\.|Pr)\s+/i, '').split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

// « Dr Éric NGUEMA » → « dr-eric-nguema »
export const photoSlug = (name) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Photos : d'abord celle fournie par l'API / mock.js, sinon public/equipe/<nom>.jpg|jpeg|png|webp
const photoCandidates = (member) => [
  member.photo,
  ...['jpg', 'jpeg', 'png', 'webp'].map((ext) => `/equipe/${photoSlug(member.name)}.${ext}`),
].filter(Boolean);

function Avatar({ member }) {
  const candidates = photoCandidates(member);
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = candidates[idx];
  return (
    <div className={`member__avatar${loaded ? ' has-photo' : ''}`}>
      <span aria-hidden="true">{initials(member.name)}</span>
      {src && (
        <img src={src} alt={`Photo de ${member.name}`} loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(false); setIdx((i) => i + 1); }} />
      )}
      <span className="member__ring" aria-hidden="true" />
    </div>
  );
}

function MemberCard({ member, index }) {
  return (
    <li className="member" style={{ '--i': index }}>
      <Avatar member={member} />
      <h3 className="member__name">{member.name}</h3>
      <p className="member__role">{member.role}</p>
      {member.profession && <p className="member__job mono">{member.profession}</p>}
    </li>
  );
}

const Skeletons = ({ n }) => (
  <ul className="team__grid" aria-busy="true">
    {Array.from({ length: n }).map((_, i) => (
      <li key={i} className="member member--skeleton">
        <div className="skeleton skeleton--circle" /><div className="skeleton skeleton--line" /><div className="skeleton skeleton--line short" />
      </li>
    ))}
  </ul>
);

function useTeam() {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const ctrl = new AbortController();
    getTeam(ctrl.signal)
      .then(setTeam)
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message); });
    return () => ctrl.abort();
  }, []);
  return [team, error];
}

/* ---------- Page Équipe : onglets ---------- */
export default function Team() {
  const [team, error] = useTeam();
  const [tab, setTab] = useState('bureau');
  const tabsRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // Pastille glissante sous l'onglet actif
  useLayoutEffect(() => {
    const measure = () => {
      const btn = tabsRef.current?.querySelector(`[data-tab="${tab}"]`);
      if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [tab]);

  const onKey = (e) => {
    const idx = TABS.findIndex((t) => t.key === tab);
    let next = null;
    if (e.key === 'ArrowRight') next = TABS[(idx + 1) % TABS.length];
    if (e.key === 'ArrowLeft') next = TABS[(idx - 1 + TABS.length) % TABS.length];
    if (next) {
      e.preventDefault();
      setTab(next.key);
      tabsRef.current.querySelector(`[data-tab="${next.key}"]`)?.focus();
    }
  };

  const members = team?.[tab] || [];

  return (
    <section className="section team" id="equipe" aria-labelledby="team-title">
      <div className="container">
        <SectionHead center eyebrow="Équipe" title={<span id="team-title">Les visages d'ECHOSCIENCE.</span>}
          intro="Un bureau exécutif pour agir, un comité scientifique pour garantir la rigueur." />
        <div className="tabs" role="tablist" aria-label="Équipe" ref={tabsRef} onKeyDown={onKey} data-reveal>
          <span className="tabs__pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} aria-hidden="true" />
          {TABS.map((t) => (
            <button key={t.key} role="tab" id={`tab-${t.key}`} data-tab={t.key} aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`} tabIndex={tab === t.key ? 0 : -1}
              className={`tabs__btn${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
              {team && <span className="tabs__count">{team[t.key]?.length || 0}</span>}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="team__panel">
          {error && <p className="empty">{error}</p>}
          {!team && !error && <Skeletons n={6} />}
          {team && (
            <ul className="team__grid" key={tab}>
              {members.map((m, i) => <MemberCard key={m.name + i} member={m} index={i} />)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import { Marquee } from '../components/Sections.jsx';
import { Icon } from '../components/Icons.jsx';
import { formatDate, getArticles } from '../lib/api.js';
import { SITE } from '../lib/config.js';

// Bloc de présentation : texte court + visuel + bouton « En savoir plus »
function Feature({ id, eyebrow, title, children, to, cta, visual, reverse = false, tone = '' }) {
  return (
    <section className={`feature${tone ? ` feature--${tone}` : ''}`} aria-labelledby={`${id}-title`}>
      <div className={`container feature__grid${reverse ? ' feature__grid--reverse' : ''}`}>
        <div className="feature__text" data-reveal>
          <p className={`eyebrow${tone === 'dark' ? ' eyebrow--light' : ''}`}>{eyebrow}</p>
          <h2 className={`h2${tone === 'dark' ? ' h2--light' : ''}`} id={`${id}-title`}>{title}</h2>
          {children}
          <Link to={to} className={`btn ${tone === 'dark' ? 'btn--green' : 'btn--blue'} magnetic`}>
            {cta} <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="feature__visual" data-reveal style={{ '--d': '120ms' }} aria-hidden="true">
          {visual}
        </div>
      </div>
    </section>
  );
}

const Waves = () => (
  <svg className="feature__waves" viewBox="0 0 400 400">
    {[40, 80, 120, 160, 200].map((r) => <circle key={r} cx="400" cy="400" r={r} />)}
  </svg>
);

/* ---------- Visuels ---------- */
const FactsVisual = () => (
  <div className="panel panel--blue">
    <Waves />
    <dl className="facts">
      <div><dt className="mono">Création</dt><dd>5 octobre 2026</dd></div>
      <div><dt className="mono">Siège</dt><dd>Libreville, quartier Glass</dd></div>
      <div><dt className="mono">Statut</dt><dd>ONG — {SITE.law}</dd></div>
      <div><dt className="mono">Champ d'action</dt><dd>Gabon &amp; Afrique</dd></div>
    </dl>
  </div>
);

const NumberVisual = ({ value, label, sub }) => (
  <div className="panel panel--glow">
    <Waves />
    <span className="panel__big">{value}</span>
    <span className="panel__label">{label}</span>
    {sub && <span className="panel__sub mono">{sub}</span>}
  </div>
);

const FORMATS = [
  { icon: 'mic', label: 'Conférences & ateliers' },
  { icon: 'play', label: 'Vidéos & podcasts' },
  { icon: 'chart', label: 'Études & enquêtes' },
  { icon: 'link', label: 'Partenariats' },
];
const FormatsVisual = () => (
  <div className="panel panel--light">
    <ul className="formats">
      {FORMATS.map((f) => (
        <li key={f.label}><span><Icon name={f.icon} size={22} /></span>{f.label}</li>
      ))}
    </ul>
  </div>
);

/* ---------- Actualités : liste compacte ---------- */
function NewsList() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const ctrl = new AbortController();
    getArticles({ page: 1, per_page: 4 }, ctrl.signal)
      .then((r) => setPosts(r.data || []))
      .catch((e) => { if (e.name !== 'AbortError') setPosts([]); });
    return () => ctrl.abort();
  }, []);
  if (posts && posts.length === 0) return <p className="news-list__empty">Les premiers articles arrivent bientôt.</p>;
  return (
    <ul className="news-list">
      {(posts || [0, 1, 2, 3]).map((p, i) => (
        <li key={p?.slug ?? i}>
          {p?.slug ? (
            <Link to={`/blog/${p.slug}`}>
              <time className="mono" dateTime={p.published_at}>{formatDate(p.published_at)}</time>
              <span className="news-list__title">{p.title}</span>
              <Icon name="arrow" size={18} />
            </Link>
          ) : <div className="news-list__skeleton"><div className="skeleton skeleton--line" /></div>}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  useEffect(() => { document.title = 'ECHOSCIENCE — La culture scientifique au Gabon et en Afrique'; }, []);
  return (
    <>
      <Hero />
      <Marquee />

      <Feature id="qui" eyebrow="Qui sommes-nous" to="/a-propos" cta="En savoir plus" visual={<FactsVisual />}
        title={<>Une ONG pour rapprocher la <span className="text-green">science</span> de la société.</>}>
        <p>
          ECHOSCIENCE est née d'un constat simple : la recherche menée au Gabon et en Afrique reste trop peu connue du grand public.
          L'association réunit chercheurs, enseignants, ingénieurs, techniciens et passionnés pour que chaque découverte trouve son écho.
        </p>
      </Feature>

      <Feature id="ambition" eyebrow="Notre ambition" to="/missions" cta="Voir nos missions" reverse tone="dark"
        visual={<NumberVisual value="10" label="disciplines réunies" sub="des mathématiques à l'innovation" />}
        title="Fédérer, diffuser, éclairer.">
        <p>
          Nous voulons créer des ponts entre les disciplines, rendre la recherche accessible à tous et apporter
          un regard scientifique, rigoureux et apaisé sur les grands débats de société.
        </p>
      </Feature>

      <Feature id="terrain" eyebrow="Sur le terrain" to="/activites" cta="Découvrir nos activités" visual={<FormatsVisual />}
        title="De la salle de classe à l'écran.">
        <p>
          Conférences grand public, interventions dans les lycées, contenus en ligne, enquêtes sur la culture scientifique :
          nos actions s'adressent aux élèves, aux citoyens comme aux décideurs.
        </p>
      </Feature>

      <Feature id="equipe" eyebrow="L'équipe" to="/equipe" cta="Rencontrer l'équipe" reverse tone="white"
        visual={<NumberVisual value="15" label="personnes engagées" sub="6 au bureau · 9 au comité scientifique" />}
        title="Des femmes et des hommes de science.">
        <p>
          Un bureau exécutif élu pilote l'association au quotidien ; un comité scientifique de spécialistes
          veille à la rigueur de tout ce que nous publions.
        </p>
      </Feature>

      <section className="feature" aria-labelledby="news-home-title">
        <div className="container feature__grid">
          <div className="feature__text" data-reveal>
            <p className="eyebrow">Actualités</p>
            <h2 className="h2" id="news-home-title">Ce qui se passe chez nous.</h2>
            <p>Vie de l'ONG, événements à venir, recherches à découvrir : suivez notre actualité sur le blog.</p>
            <Link to="/blog" className="btn btn--blue magnetic">Lire le blog <Icon name="arrow" size={18} /></Link>
          </div>
          <div data-reveal style={{ '--d': '120ms' }}><NewsList /></div>
        </div>
      </section>

      <section className="section join" aria-labelledby="join-title">
        <div className="container">
          <div className="adhesion__box join__box" data-reveal>
            <div className="blob blob--1" aria-hidden="true" />
            <div className="blob blob--2" aria-hidden="true" />
            <div className="blob blob--3" aria-hidden="true" />
            <div className="join__text">
              <p className="eyebrow eyebrow--light">Rejoignez-nous</p>
              <h2 className="h2 h2--light" id="join-title">Faites résonner la science avec nous.</h2>
              <p>Adhésion ouverte à toutes et à tous — droit d'adhésion : {SITE.membershipFee}.</p>
            </div>
            <div className="join__actions">
              <Link to="/adhesion" className="btn btn--green magnetic">Devenir membre <Icon name="arrow" size={18} /></Link>
              <Link to="/contact" className="btn btn--ghost magnetic">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

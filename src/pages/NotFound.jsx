import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';

export default function NotFound({ message = "La page que vous cherchez s'est perdue dans le cosmos." }) {
  useEffect(() => { document.title = 'Page introuvable — ECHOSCIENCE'; }, []);
  return (
    <section className="notfound">
      <div className="notfound__ripples" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ '--i': i }} />)}
      </div>
      <div className="container notfound__inner">
        <p className="notfound__code" aria-hidden="true">4<span>0</span>4</p>
        <h1 className="h2 h2--light">Aucun écho ici…</h1>
        <p>{message}</p>
        <Link to="/" className="btn btn--green magnetic">Retour à l'accueil <Icon name="arrow" size={18} /></Link>
      </div>
    </section>
  );
}

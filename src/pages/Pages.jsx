// Pages intérieures : une page par onglet de la navigation
import { useEffect } from 'react';
import { About, Activities, Domains, Governance, Missions, PageHeader } from '../components/Sections.jsx';
import Team from '../components/Team.jsx';
import { Adhesion, Contact } from '../components/Forms.jsx';

const useTitle = (title) => {
  useEffect(() => { document.title = `${title} — ECHOSCIENCE`; }, [title]);
};

export function AboutPage() {
  useTitle('À propos');
  return (
    <>
      <PageHeader eyebrow="À propos" title={<>Qui <em className="grad-text">sommes-nous</em> ?</>}>
        <p className="page-header__lead">Une ONG gabonaise née à Libreville pour rapprocher la science de la société.</p>
      </PageHeader>
      <About />
      <Governance />
    </>
  );
}

export function MissionsPage() {
  useTitle('Missions');
  return (
    <>
      <PageHeader eyebrow="Missions" title={<>Nos <em className="grad-text">engagements</em></>}>
        <p className="page-header__lead">Six missions et dix disciplines pour faire vivre la culture scientifique.</p>
      </PageHeader>
      <Missions />
      <Domains />
    </>
  );
}

export function ActivitiesPage() {
  useTitle('Activités');
  return (
    <>
      <PageHeader eyebrow="Activités" title={<>Ce que nous <em className="grad-text">faisons</em></>}>
        <p className="page-header__lead">Événements, diffusion en ligne, études et partenariats.</p>
      </PageHeader>
      <Activities />
    </>
  );
}

export function TeamPage() {
  useTitle('Équipe');
  return (
    <>
      <PageHeader eyebrow="Équipe" title={<>Les visages d'<em className="grad-text">ECHOSCIENCE</em></>}>
        <p className="page-header__lead">Le bureau exécutif et le comité scientifique de l'ONG.</p>
      </PageHeader>
      <Team />
    </>
  );
}

export function AdhesionPage() {
  useTitle('Adhésion');
  return (
    <>
      <PageHeader eyebrow="Adhésion" title={<>Devenir <em className="grad-text">membre</em></>}>
        <p className="page-header__lead">Rejoignez une communauté de chercheurs, d'enseignants et de passionnés.</p>
      </PageHeader>
      <Adhesion />
    </>
  );
}

export function ContactPage() {
  useTitle('Contact');
  return (
    <>
      <PageHeader eyebrow="Contact" title={<>Parlons <em className="grad-text">science</em></>}>
        <p className="page-header__lead">Une question, un projet, un partenariat ? Écrivez-nous.</p>
      </PageHeader>
      <Contact />
    </>
  );
}

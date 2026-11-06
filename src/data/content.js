// Textes statiques de la page d'accueil

export const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/missions', label: 'Missions' },
  { to: '/activites', label: 'Activités' },
  { to: '/equipe', label: 'Équipe' },
  { to: '/blog', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
];

export const DOMAINS = [
  { name: 'les Mathématiques', sym: 'Ma' },
  { name: 'la Physique', sym: 'Ph' },
  { name: 'la Chimie', sym: 'Ch' },
  { name: 'la Biologie', sym: 'Bi' },
  { name: 'l\'Informatique', sym: 'If' },
  { name: 'la Géologie', sym: 'Gé' },
  { name: 'l\'Archéologie', sym: 'Ar' },
  { name: 'la Géographie', sym: 'Gg' },
  { name: 'l\'Environnement', sym: 'En' },
  { name: 'l\'Innovation technologique', sym: 'In' },
];

export const TYPEWRITER_WORDS = DOMAINS.map((d) => d.name.toLowerCase());

export const STATS = [
  { value: 10, suffix: '+', label: 'disciplines scientifiques' },
  { value: 9, suffix: '', label: 'experts au comité scientifique' },
  { value: 6, suffix: '', label: 'membres du bureau exécutif' },
  { value: 4, suffix: '', label: "formats d'événements" },
];

export const MISSIONS = [
  { n: '01', title: 'Fédérer les acteurs', text: 'Rassembler chercheurs, enseignants, ingénieurs, techniciens et passionnés autour d’une ambition commune.' },
  { n: '02', title: 'Dialogue interdisciplinaire', text: 'Faire se rencontrer les disciplines pour croiser les regards et faire émerger des idées nouvelles.' },
  { n: '03', title: 'Diffuser la recherche', text: 'Rendre visibles et accessibles les travaux scientifiques menés au Gabon et en Afrique.' },
  { n: '04', title: 'Valoriser les formations', text: 'Promouvoir les filières scientifiques et techniques, et susciter des vocations chez les jeunes.' },
  { n: '05', title: 'Éclairer les sujets sensibles', text: 'Apporter un regard scientifique, rigoureux et apaisé sur les débats qui traversent la société.' },
  { n: '06', title: 'Médiation scientifique', text: 'Traduire la science en mots simples, en expériences et en rencontres pour tous les publics.' },
];

export const ACTIVITIES = [
  { key: 'events', title: 'Événements', icon: 'mic', text: 'Conférences, tables rondes, ateliers et journées portes ouvertes, en présentiel comme en ligne.' },
  { key: 'online', title: 'Diffusion en ligne', icon: 'play', text: 'Articles, vidéos, podcasts et contenus courts sur nos réseaux pour toucher le plus grand nombre.' },
  { key: 'studies', title: 'Études & enquêtes', icon: 'chart', text: 'Mesurer la place de la science dans la société gabonaise et publier des données ouvertes.' },
  { key: 'partners', title: 'Interface & partenariats', icon: 'link', text: 'Relier chercheurs, institutions, entreprises et décideurs autour de projets concrets.' },
];

export const GOVERNANCE = [
  { title: 'Assemblée générale', text: 'Organe souverain : elle réunit tous les membres, adopte les orientations et élit le bureau.' },
  { title: 'Comité scientifique', text: 'Neuf experts garants de la rigueur et de la qualité des contenus diffusés.' },
  { title: 'Bureau exécutif', text: 'Six membres qui pilotent les actions au quotidien et représentent l’ONG.' },
];

export const MEMBER_TYPES = [
  { title: 'Membres fondateurs', text: 'À l’origine de la création de l’ONG le 5 octobre 2026.' },
  { title: 'Membres actifs', text: 'Participent aux activités et à la vie de l’association.' },
  { title: 'Membres bienfaiteurs', text: 'Soutiennent l’ONG par leurs dons ou leur expertise.' },
];

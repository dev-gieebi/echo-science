// Données de démonstration — utilisées tant que le backend n'est pas branché.

export const MOCK_CATEGORIES = [
  { slug: 'vie-ong', name: "Vie de l'ONG" },
  { slug: 'evenements', name: 'Événements' },
  { slug: 'recherche', name: 'Recherche' },
  { slug: 'mediation', name: 'Médiation' },
  { slug: 'partenariats', name: 'Partenariats' },
];

const cat = (slug) => MOCK_CATEGORIES.find((c) => c.slug === slug);
const bureau = { name: 'Bureau exécutif', avatar: null };
const comite = { name: 'Comité scientifique', avatar: null };

const body = (intro, h2, quote, rest) => `
<p>${intro}</p>
<h2>${h2}</h2>
<p>${rest}</p>
<blockquote>${quote}</blockquote>
<p>Vous souhaitez contribuer ? Rejoignez ECHOSCIENCE en tant que membre actif ou bienfaiteur, ou écrivez-nous via le formulaire de contact.</p>`;

export const MOCK_ARTICLES = [
  {
    id: 1, slug: 'naissance-echoscience', title: 'ECHOSCIENCE est née',
    excerpt: "Le 5 octobre 2026, à Libreville, chercheurs, enseignants et passionnés ont fondé une ONG pour faire résonner la science au Gabon.",
    cover_image: null, category: cat('vie-ong'), author: bureau, published_at: '2026-10-05T14:35:00Z', reading_time: 3,
    content: body(
      "Le 5 octobre 2026, dans le quartier Glass à Libreville, l'assemblée générale constitutive d'ECHOSCIENCE s'est tenue en présence d'une trentaine de chercheurs, d'enseignants, d'ingénieurs et de passionnés de sciences.",
      'Une interface entre la science et la société',
      "La science n'appartient pas aux laboratoires : elle appartient à celles et ceux qu'elle éclaire.",
      "Régie par la loi n°35/62, l'association se donne pour mission de fédérer les acteurs scientifiques du pays, de diffuser la recherche produite au Gabon et en Afrique, et d'éclairer le débat public sur les sujets scientifiques sensibles."
    ),
  },
  {
    id: 2, slug: 'cycle-conferences-2027', title: 'Un cycle de conférences grand public pour 2027',
    excerpt: 'Dix disciplines, dix soirées : le programme de nos premières conférences ouvertes à tous se dessine.',
    cover_image: null, category: cat('evenements'), author: bureau, published_at: '2026-10-28T09:00:00Z', reading_time: 4,
    content: body(
      "Chaque mois, une discipline sera mise à l'honneur lors d'une soirée ouverte au public, avec un chercheur invité et un temps d'échange.",
      'Le format',
      'Une heure pour comprendre, trente minutes pour débattre.',
      'Mathématiques, physique, chimie, biologie, informatique, géologie, archéologie, géographie, environnement et innovation technologique : toutes les disciplines représentées au sein de l’ONG auront leur soirée.'
    ),
  },
  {
    id: 3, slug: 'fossiles-franceville', title: 'Les fossiles de Franceville, un trésor scientifique mondial',
    excerpt: 'Retour sur les découvertes du biote francevillien, parmi les plus anciennes traces de vie multicellulaire connues.',
    cover_image: null, category: cat('recherche'), author: comite, published_at: '2026-10-21T10:00:00Z', reading_time: 6,
    content: body(
      'Découverts dans la région de Franceville, ces fossiles vieux d’environ 2,1 milliards d’années ont bousculé notre compréhension de l’histoire du vivant.',
      'Pourquoi ces fossiles comptent',
      'Le Gabon garde dans ses roches une page essentielle de l’histoire de la vie.',
      'Le comité scientifique d’ECHOSCIENCE souhaite faire connaître ce patrimoine aux élèves et au grand public, en lien avec les équipes de recherche concernées.'
    ),
  },
  {
    id: 4, slug: 'science-dans-les-lycees', title: 'La science s’invite dans les lycées',
    excerpt: 'Ateliers, expériences et rencontres avec des chercheurs : notre programme de médiation scolaire.',
    cover_image: null, category: cat('mediation'), author: bureau, published_at: '2026-10-15T08:30:00Z', reading_time: 4,
    content: body(
      'Faire naître des vocations, c’est d’abord montrer que la science se pratique ici, au Gabon, par des femmes et des hommes accessibles.',
      'Des ateliers pratiques',
      'Un élève qui manipule retient ; un élève qui questionne invente.',
      'Nos membres interviendront dans les établissements de Libreville puis de l’intérieur du pays.'
    ),
  },
  {
    id: 5, slug: 'virologie-comprendre', title: 'Virologie : comprendre pour mieux se protéger',
    excerpt: 'Démêler le vrai du faux sur les virus émergents : une série de fiches pédagogiques en préparation.',
    cover_image: null, category: cat('recherche'), author: comite, published_at: '2026-10-10T11:00:00Z', reading_time: 5,
    content: body(
      'Les épidémies récentes ont montré combien l’information scientifique fiable est précieuse.',
      'Des fiches claires et sourcées',
      'Informer juste, c’est déjà protéger.',
      'Rédigées par les membres du comité scientifique, ces fiches seront publiées ici et sur nos réseaux sociaux.'
    ),
  },
  {
    id: 6, slug: 'appel-partenaires', title: 'Appel à partenaires : universités, entreprises, institutions',
    excerpt: 'ECHOSCIENCE souhaite tisser des liens durables avec les acteurs de la recherche et de l’innovation.',
    cover_image: null, category: cat('partenariats'), author: bureau, published_at: '2026-10-08T16:00:00Z', reading_time: 2,
    content: body(
      'Nous voulons être une interface entre le monde scientifique, les décideurs et la société.',
      'Comment s’associer',
      'Seul on va vite, ensemble on va loin.',
      'Conventions, co-organisation d’événements, études et enquêtes : écrivez-nous pour en discuter.'
    ),
  },
  {
    id: 7, slug: 'podcast-echo', title: 'Bientôt : « Écho », le podcast de la science gabonaise',
    excerpt: 'Des entretiens avec celles et ceux qui font la recherche au Gabon, diffusés sur YouTube et TikTok.',
    cover_image: null, category: cat('mediation'), author: bureau, published_at: '2026-11-02T12:00:00Z', reading_time: 3,
    content: body(
      'Diffuser la recherche passe aussi par la voix : « Écho » donnera la parole aux chercheurs.',
      'Un épisode toutes les deux semaines',
      'Chaque découverte mérite d’être racontée.',
      'Les premiers épisodes aborderont la géologie, l’informatique et l’environnement.'
    ),
  },
  {
    id: 8, slug: 'enquete-culture-scientifique', title: 'Grande enquête sur la culture scientifique au Gabon',
    excerpt: 'Quelle place la science occupe-t-elle dans la vie des Gabonais ? Participez à notre première enquête.',
    cover_image: null, category: cat('recherche'), author: comite, published_at: '2026-10-31T09:00:00Z', reading_time: 3,
    content: body(
      'Pour agir efficacement, il faut d’abord mesurer : c’est l’objet de cette enquête nationale.',
      'Méthode',
      'Des données fiables pour des actions utiles.',
      'Les résultats seront publiés en accès libre sur ce site.'
    ),
  },
  {
    id: 9, slug: 'premiere-assemblee', title: 'Compte rendu de la première assemblée générale',
    excerpt: 'Élection du bureau exécutif, installation du comité scientifique et feuille de route 2027.',
    cover_image: null, category: cat('vie-ong'), author: bureau, published_at: '2026-10-06T18:00:00Z', reading_time: 5,
    content: body(
      'L’assemblée générale a élu les six membres du bureau exécutif et installé un comité scientifique de neuf experts.',
      'La feuille de route',
      'Une ONG utile se juge à ses actions.',
      'Priorités : conférences, médiation scolaire, diffusion en ligne et partenariats.'
    ),
  },
];

export const MOCK_TEAM = {
  bureau: [
    { name: 'Florent NGUEMA NDONG', role: 'Trésorier et membre du comité scientifique', profession: 'Mathématiciens', photo: null },
    { name: 'BIEDZO BI ONDO', role: 'Secrétaire général Adjoint du comité scientifique', profession: null, photo: null },
    { name: 'Cédric LIGNA', role: 'Enseignante-chercheur et Membre du comité scientifique', profession: 'géologue', photo: null },
    { name: 'Léna Leontine NZAMO OBIANG', role: null, profession: 'Chargé de la communication et de l\'audiovisuel de l\'ONG', photo: null },
    { name: 'Victory NFOUMOU OBAME', role: 'Enseignante-chercheuse', profession: 'géologue', photo: null },
    { name: 'Béatrice MBENGONNE OBAME', role: 'Etudiante, Agronomie et Agro foresterie', profession: null, photo: null },
  
  ],
  comite: [
  ],
};

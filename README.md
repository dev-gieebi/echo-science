# ECHOSCIENCE — frontend

Site vitrine + blog de l'ONG ECHOSCIENCE (React 18 + Vite + React Router 6, sans librairie d'UI).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # génère dist/
npm run preview    # sert dist/ en local
```

## Brancher le backend

Copier `.env.example` en `.env` puis renseigner :

```
VITE_API_BASE_URL=https://api.echoscience.ga/api
VITE_USE_MOCK_FALLBACK=true   # false = jamais de données de démo
```

- `VITE_API_BASE_URL` vide → tout le site tourne sur `src/data/mock.js` (les formulaires sont simulés).
- API renseignée mais injoignable / 5xx → repli sur la démo pour la lecture ; les formulaires affichent l'erreur.
- Relancer `npm run build` après toute modification du `.env` (les variables sont figées à la compilation).

Le contrat d'API (`/articles`, `/articles/{slug}`, `/categories`, `/team`, `/contact`, `/adhesions`, `/newsletter`) est décrit dans le cahier des charges ; tous les appels sont dans `src/lib/api.js`.

## Déploiement (Apache / Hostinger)

Envoyer le **contenu** de `dist/` dans `public_html/`. Le fichier `.htaccess` (copié depuis `public/`) renvoie toutes les routes vers `index.html`.

## Arborescence

```
src/
  lib/config.js, lib/api.js     configuration .env, appels HTTP, sanitize()
  data/mock.js, data/content.js données de démo, textes statiques
  hooks/useReveal.js            apparitions au scroll
  components/                   Layout, Hero, Sections, Team, PostCard, Forms, FormStatus, Icons
  pages/                        Home, Blog, Article, NotFound
  styles.css                    design complet
```

Coordonnées, e-mail, téléphone et liens des réseaux sociaux : `src/lib/config.js`.

## Photos de l'équipe

Déposez les photos dans `public/equipe/`, nommées d'après le nom du membre (minuscules, sans accents, espaces remplacés par des tirets), en `.jpg`, `.jpeg`, `.png` ou `.webp`. Elles s'affichent automatiquement ; sans photo, les initiales restent affichées. Idéalement : image carrée d'au moins 300×300 px.

| Membre | Fichier attendu |
|---|---|
| Florent NGUEMA NDONG | `public/equipe/florent-nguema-ndong.jpg` |
| Aïcha MBOUMBA | `public/equipe/aicha-mboumba.jpg` |
| Jordan MOUSSAVOU | `public/equipe/jordan-moussavou.jpg` |
| Clarisse NDONG | `public/equipe/clarisse-ndong.jpg` |
| Patrick OBIANG | `public/equipe/patrick-obiang.jpg` |
| Sandrine MINKO | `public/equipe/sandrine-minko.jpg` |
| Dr Éric NGUEMA | `public/equipe/dr-eric-nguema.jpg` |
| Dr Mireille ESSONO | `public/equipe/dr-mireille-essono.jpg` |
| Dr Alain MBA | `public/equipe/dr-alain-mba.jpg` |
| Dr Linda OYANE | `public/equipe/dr-linda-oyane.jpg` |
| Dr Serge KOUMBA | `public/equipe/dr-serge-koumba.jpg` |
| Dr Nadège BIYOGO | `public/equipe/dr-nadege-biyogo.jpg` |
| Dr Hervé ELLA | `public/equipe/dr-herve-ella.jpg` |
| Dr Rose MEYE | `public/equipe/dr-rose-meye.jpg` |
| Ing. Fabrice ONDO | `public/equipe/ing-fabrice-ondo.jpg` |

Si vous changez un nom dans `src/data/mock.js`, le nom du fichier attendu change aussi. Vous pouvez également indiquer un chemin précis dans le champ `photo` (ex. `photo: '/equipe/president.jpg'`). Une fois le backend branché, le champ `photo` renvoyé par `GET /team` est prioritaire.

## Fiche d'un membre de l'équipe

Chaque membre (dans `src/data/mock.js`, puis dans la réponse de `GET /team`) a les champs : `name`, `role` (poste), `profession`, `specialty` (spécialité) et `photo`. Laissez `specialty: null` pour ne pas afficher la ligne « Spécialité ».

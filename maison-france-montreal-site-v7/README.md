# Site web — Maison France–Montréal

## Contenu
- `index.html` : page principale du site
- `styles.css` : design et responsive
- `script.js` : chargement dynamique des contenus
- `data/site.json` : textes principaux + réseaux sociaux
- `data/program.json` : programme
- `data/candidates.json` : candidats + bios uniformisées
- `data/events.json` : événements à venir
- `assets/` : photos, affiche, visuels

## Modifier facilement le site
### 1) Mettre à jour les événements
Édite `data/events.json`.

### 2) Changer les liens sociaux
Édite `data/site.json`, section `socials`.

### 3) Corriger ou enrichir une bio
Édite `data/candidates.json`.

### 4) Remplacer une photo
Remplace l’image dans `assets/candidates/` en gardant le même nom de fichier.

## Mise en ligne
Tu peux publier ce site sur :
- GitHub Pages
- Netlify
- Vercel

## Prévisualiser en local
Comme le site charge des fichiers JSON, il faut lancer un petit serveur local.

Avec Python :
```bash
python -m http.server 8000
```

Puis ouvrir :
```bash
http://localhost:8000
```

## Notes
- Les liens sociaux sont pour l’instant des placeholders.
- Le style “stroboscope” est appliqué dans la galerie des candidats avec un effet visuel animé.
- Les bios ont été uniformisées dans les cinq rubriques demandées.

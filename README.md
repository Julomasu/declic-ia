# Déclic

Formation gratuite à l'IA pour tous les niveaux, en exercices interactifs. Règles du projet : `CLAUDE.md`.

Site statique sans dépendance, sans compte, sans traceur ; la progression reste dans le navigateur. Aucun appel à une API d'IA : les démonstrations sont scénarisées.

## Contenu

- **Test d'entrée** (5 questions) qui oriente vers 7 profils : débutant·e/senior (gros texte), jeune, particulier, entrepreneur·e, équipe en entreprise, pro du numérique, expert·e IA.
- **Séance de 30 minutes** : 7 exercices (bon ou mauvais prompt, prompt par blocs, hallucination, vrai ou faux, conversation simulée, défi chrono « coller ou pas », quel type d'outil), puis 3 prompts prêts à copier et les outils adaptés.
- **4 paliers** : savoir demander ; documents et outils ; automatiser ; construire et déployer (coûts, injection de prompt, évaluation).
- **Quelle IA pour moi ?** questionnaire + comparateur de 12 outils, **Choisis ton outil** (recettes), **bibliothèque de prompts**, **Ne colle pas ça**, **Kit entreprise**, **Actus des IA**, **Sources et vérifications**.

## Lancer et tester

```
npm install               # seulement pour Playwright (tests)
npx http-server -p 8080   # ou tout serveur statique, puis http://localhost:8080
npm test                  # intégrité des données + parcours complets en navigateur (bureau, mobile, clair, sombre)
npm run liens             # vérifie en ligne que chaque lien répond (réseau libre requis)
```

Les captures des tests sont écrites dans `tests/captures/` (ignoré par git).

## Mettre à jour les faits

Voir `docs/MISE-A-JOUR.md` : rythme hebdomadaire, procédure, consigne pour une routine planifiée. Un workflow GitHub ouvre chaque lundi une demande de vérification.

## À décider par Jules

- Renseigner l'éditeur dans `js/core.js` (champs vides tant que non fait), puis faire valider mentions légales et confidentialité.
- Activer GitHub Pages (source : GitHub Actions) pour que `pages.yml` publie le site.

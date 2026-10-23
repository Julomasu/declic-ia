# Mettre à jour les actus, les prix et les fiches d'outils

Les offres d'IA changent vite. Règle d'or du projet : **aucun chiffre sans page officielle lue pendant le travail, avec sa date.**

## Rythme

- **Chaque semaine** : relire les actus et les prix (15 minutes).
- Un rappel automatique ouvre une demande « Vérifier les actus et les prix » chaque lundi (`.github/workflows/rappel-actus.yml`). Il ne modifie jamais le contenu.
- `npm run integrite` signale en avertissement : une fiche vérifiée il y a plus de 60 jours, ou une actu la plus récente de plus de 14 jours.

## Procédure (humaine, avec ou sans assistant)

1. Pour chaque outil de `js/data/outils.js`, ouvrir `url_prix`, relever offres, prix en dollars, offre gratuite, politique de données si affichée.
2. Corriger la fiche, puis mettre `verifie` à la date du jour. Un fait introuvable est retiré ou marqué « non relevé ». Ne jamais écrire un prix de mémoire.
3. Pour une nouveauté : ajouter une entrée dans `js/data/actus.js` (date de constat, titre, résumé en langage simple, « ce que ça change pour toi », source officielle, fiabilité `officielle` ou `partielle`).
4. Un nouvel outil (par exemple un outil cité par quelqu'un) : vérifier d'abord qu'il existe et ce qu'il est (site officiel). Si on ne trouve pas l'éditeur ou le produit, on ne le cite pas.
5. Si un nouvel hôte de lien apparaît, l'ajouter à la liste `hotesVerifies` de `tests/integrite.cjs` **après** avoir ouvert le lien.
6. `npm test` doit passer (intégrité + navigateur bureau et mobile) avant de pousser sur `main`.

## Routine planifiée avec un assistant (proposition, à activer par Jules)

Une tâche planifiée hebdomadaire peut préparer un brouillon : relire les pages `url_prix`, comparer avec `outils.js`, rédiger les actus candidates et ouvrir une demande avec le détail. Un humain relit chaque source avant de fusionner. Exemple de consigne :

> Relis chaque `url_prix` de `js/data/outils.js`. Liste ce qui a changé (prix, offres, noms) avec le lien et la date de lecture. Propose des entrées pour `js/data/actus.js` en langage simple (public de 15 à 25 ans), chacune avec « ce que ça change pour toi ». N'écris aucun fait que tu n'as pas lu sur la page officielle. Ne modifie rien : ouvre une demande avec tes propositions.

Les outils de lecture web peuvent être bloqués ou en maintenance (la CNIL l'était le 23 octobre 2026) : dans ce cas, l'actu est marquée `partielle`.

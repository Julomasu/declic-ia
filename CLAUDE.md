# Règles universelles (communes à tous les projets de Jules)

Ces règles s'appliquent à Paperasse, Aiguillage et au projet de formation IA. Une règle propre à un projet va dans la section « Ce projet » en bas.

## Ton et langue
- Français, tutoiement, phrases courtes, aucun jargon sans explication. On parle à des jeunes de 15 à 25 ans.
- Direct et utile : on dit quoi faire, dans quel ordre, et ce qui coûte de l'argent si on attend.

## Style (premium, « affiche sportive »)
- Rendu soigné comme une marque de sport : typographie condensée Barlow auto-hébergée, gros titres, aplats de couleur, fort contraste, beaucoup d'air.
- Couleurs en jetons CSS (`:root`), mode clair et sombre, `body` avec un fond explicite.
- Mobile d'abord : aucune barre de défilement horizontale, marges de 16 px, zones tactiles d'au moins 44 px.
- Accessibilité : libellés, focus visibles, contraste, `aria-*` corrects (un lien n'est pas un bouton).

## Qualité avant de livrer
- Rien n'est livré sans test dans un vrai navigateur (Playwright, bureau et mobile) : aucune erreur JS, aucun débordement, toutes les routes ouvertes.
- Un script d'intégrité vérifie les données (références croisées, liens, étiquettes). Zéro erreur avant de pousser.
- Pas de doublons d'information, pas de page vide, pas de lien mort connu.
- Rendre compte honnêtement : ce qui est fait, vérifié, non vérifié ou en échec.

## Règle d'or : chaque fait est sourcé et daté
- Tout chiffre, plafond, délai ou règle vient d'une source officielle consultée pendant le travail, avec sa date de vérification affichée.
- Les liens officiels sont vérifiés (ne jamais écrire une URL de mémoire). Ce qu'on ne peut pas vérifier est retiré ou signalé.
- Les modèles (lettres, simulateurs) donnent un ordre de grandeur, pas un conseil juridique personnalisé.

## Vie privée et gratuité
- Gratuit, sans compte, données stockées uniquement sur l'appareil. Aucun traceur ; au plus une mesure d'audience sans cookie et respectueuse de la vie privée.
- Ne jamais publier l'identité, l'adresse e-mail ou des données personnelles de Jules : les champs d'éditeur restent vides tant qu'il ne les renseigne pas.
- Les pages légales (mentions, confidentialité) sont à faire valider par Jules avant toute communication large.

## Git
- Commits clairs en français. Pas de pull request sans demande. Aucun nom de modèle d'IA dans les commits, le code ou les contenus publiés.
- Pousser sur `main` seulement quand le travail est vérifié.

## Ce projet
- **Déclic** : formation gratuite à l'IA pour tous les niveaux (jeunes, seniors, particuliers, entrepreneurs, entreprises, professionnels de l'IA). Presque tout en exercices interactifs et ludiques, peu de texte. Objectif : après 30 minutes, la personne a envie d'ouvrir son compte Claude et de l'essayer, avec des prompts prêts à copier. Une section « Actus et mises à jour des IA » expliquée simplement, datée et sourcée.
- Site statique sans dépendance, sans compte, progression stockée sur l'appareil, aucun appel à une API d'IA (les démonstrations sont scénarisées ou simulées).
- **Au-delà du prompt** : la formation mène jusqu'à l'automatisation. Parcours en 4 paliers : (1) savoir demander (prompts), (2) travailler avec ses documents et ses outils (projets, fichiers, recherche, connecteurs), (3) automatiser les tâches répétitives (tâches planifiées, skills, agents, workflows), (4) construire et déployer (API, outils personnalisés, évaluation, coûts, sécurité). Pour chaque besoin, un « choisis ton outil » indique quel outil et quelle fonctionnalité utiliser, avec une recette pas à pas à reproduire. Les fonctionnalités citées sont vérifiées sur la documentation officielle de l'éditeur et datées.

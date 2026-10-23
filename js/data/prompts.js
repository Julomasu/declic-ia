/* Bibliothèque de prompts : à copier, remplacer les [CROCHETS], coller dans l'outil de ton choix.
   Écrits pour fonctionner dans n'importe quel assistant. `profils` = pour qui ils sont mis en avant. */
(function (g) {
  const D = (g.D = g.D || {});

  D.categories = {
    usage: { ecrire: "Écrire", apprendre: "Apprendre", organiser: "S'organiser", creer: "Créer", chercher: "Chercher" },
    metier: { enseignement: "Enseignement et formation", commerce: "Commerce et vente", rh: "Ressources humaines", gestion: "Gestion et compta", marketing: "Marketing et contenu", support: "Support client", tech: "Tech et data", direction: "Direction et management" }
  };

  const P = (id, titre, groupe, cat, niveau, profils, prompt, astuce) => ({ id, titre, groupe, cat, niveau, profils, prompt, astuce });

  D.prompts = [
    P("ecrire-mail", "Un mail clair et poli", "usage", "ecrire", 0, ["senior", "jeune", "particulier", "entrepreneur", "entreprise"],
      "Écris un e-mail pour [DESTINATAIRE] afin de [OBJECTIF]. Ton : [cordial / ferme / formel]. 6 lignes maximum, avec un objet. Termine par une demande précise : [ACTION ATTENDUE].",
      "Relis toujours avant d'envoyer. Remplace les [CROCHETS] par tes informations dans l'outil, pas avant."),
    P("ecrire-reformuler", "Reformuler sans changer le sens", "usage", "ecrire", 0, ["senior", "jeune", "particulier", "entrepreneur", "entreprise", "pro"],
      "Reformule le texte ci-dessous pour qu'il soit plus clair et plus court, sans changer le sens ni inventer d'information. Garde mon style. Texte : [TEXTE]",
      "Ajoute « Signale ce que tu as changé » pour garder le contrôle."),
    P("ecrire-lettre", "Une lettre de réclamation", "usage", "ecrire", 0, ["particulier", "senior", "jeune"],
      "Aide-moi à écrire une lettre de réclamation à [ORGANISME] au sujet de [PROBLÈME] survenu le [DATE]. Reste factuel et courtois. Structure : rappel des faits, ma demande, délai souhaité. N'invente aucun article de loi : si tu penses qu'une règle s'applique, dis-moi laquelle chercher sur un site officiel.",
      "Pour un droit précis, vérifie sur service-public.gouv.fr avant d'envoyer."),
    P("apprendre-coach", "Un entraîneur pour réviser", "usage", "apprendre", 0, ["jeune", "senior", "particulier"],
      "Aide-moi à réviser [SUJET] pour [ÉCHÉANCE]. Pose-moi une question à la fois, attends ma réponse, corrige-la, puis passe à la suivante. Ne donne pas la solution avant que j'aie essayé. Commence par un quiz de 5 questions de niveau [DÉBUTANT / MOYEN].",
      "Dis ce que tu as raté en fin de séance : « Résume mes erreurs en 3 points »."),
    P("apprendre-simple", "Expliquer simplement", "usage", "apprendre", 0, ["senior", "jeune", "particulier", "entreprise"],
      "Explique [NOTION] comme si je n'y connaissais rien, avec un exemple de la vie courante, en 8 lignes maximum. Termine par 2 questions pour vérifier que j'ai compris.",
      "Si c'est encore trop dur : « Explique plus simplement, avec une image »."),
    P("apprendre-questions", "Fais-moi préciser mon besoin", "usage", "apprendre", 0, ["senior", "jeune", "particulier", "entrepreneur", "entreprise", "pro", "expert"],
      "Avant de répondre, pose-moi jusqu'à 5 questions pour bien comprendre ma situation. Voici mon objectif : [OBJECTIF]. Une fois mes réponses reçues, propose-moi un plan en étapes.",
      "Le prompt le plus utile pour démarrer quand tu ne sais pas comment demander."),
    P("organiser-repas", "Plan de repas et courses", "usage", "organiser", 0, ["particulier", "senior"],
      "Planifie [NOMBRE] dîners pour [NOMBRE] personnes avec un budget de [MONTANT] € pour la semaine. Contraintes : [RÉGIME, ALLERGIES, TEMPS]. Donne un tableau jour / plat et la liste de courses regroupée par rayon, avec une estimation des prix.",
      "Les prix sont indicatifs. Compare avec ton magasin."),
    P("organiser-semaine", "Organiser ma semaine", "usage", "organiser", 0, ["jeune", "particulier", "entrepreneur", "entreprise"],
      "Voici mes tâches de la semaine avec leur durée estimée : [LISTE]. Mes contraintes fixes : [RENDEZ-VOUS]. Propose un planning réaliste, avec des pauses, et dis-moi ce que tu repousserais si je suis débordé·e.",
      "Demande « Qu'est-ce que j'oublie ? » à la fin."),
    P("organiser-decision", "Décider entre deux options", "usage", "organiser", 0, ["particulier", "jeune", "entrepreneur", "entreprise", "pro"],
      "Je dois choisir entre [OPTION A] et [OPTION B]. Mes critères, du plus important au moins important : [CRITÈRES]. Fais un tableau comparatif, donne les risques de chaque option et dis ce qui te manque comme information pour trancher.",
      "L'IA aide à structurer. La décision reste la tienne."),
    P("creer-image", "Décrire une image à générer", "usage", "creer", 0, ["jeune", "particulier", "entrepreneur", "pro"],
      "Écris-moi 3 descriptions détaillées pour générer une image de [SUJET]. Précise : le style, la lumière, le cadrage, les couleurs et l'ambiance. Format : une description par paragraphe, en [LANGUE].",
      "Colle ensuite la description dans l'outil d'images de ton choix."),
    P("creer-site", "Un petit site de présentation", "usage", "creer", 1, ["jeune", "entrepreneur", "pro", "particulier"],
      "Crée une page web d'une seule page pour [ACTIVITÉ] avec : un titre, une phrase d'accroche, 3 services, des coordonnées [À REMPLIR PAR MOI] et un bouton de contact. Style sobre, lisible sur téléphone. Donne le code HTML et CSS dans un seul fichier.",
      "Ne mets jamais tes vraies coordonnées dans le prompt : ajoute-les à la main ensuite."),
    P("chercher-sources", "Une recherche avec sources à vérifier", "usage", "chercher", 0, ["jeune", "particulier", "entrepreneur", "entreprise", "pro", "senior"],
      "Cherche des informations récentes sur [SUJET]. Donne-moi 5 points clés, chacun avec un lien vers sa source. Précise la date de chaque source et signale ce sur quoi les sources se contredisent. Si tu ne trouves pas de source fiable, dis-le.",
      "Ouvre les liens : une source citée peut ne pas dire ce que l'IA lui fait dire."),
    P("ens-cours", "Préparer un cours en 4 temps", "metier", "enseignement", 0, ["entreprise", "pro", "jeune"],
      "Prépare une séance de [DURÉE] sur [SUJET] pour un public [NIVEAU]. Structure : accroche, explication, exercice, bilan. Propose 3 questions d'évaluation avec les réponses attendues. Signale les notions sur lesquelles les élèves bloquent souvent.",
      "N'utilise jamais de données d'élèves identifiables."),
    P("com-prospect", "Un mail de prospection", "metier", "commerce", 0, ["entrepreneur", "entreprise"],
      "Écris un e-mail de prospection pour [OFFRE] à destination de [TYPE DE CLIENT]. Accroche liée à un problème concret : [PROBLÈME]. 120 mots maximum, une seule demande : [RENDEZ-VOUS / APPEL]. Propose 2 objets différents.",
      "Pas de fichier clients complet dans l'IA : un exemple anonymisé suffit."),
    P("com-objections", "Préparer les objections", "metier", "commerce", 1, ["entrepreneur", "entreprise", "pro"],
      "Voici mon offre : [OFFRE]. Liste les 8 objections les plus probables d'un client [TYPE], classées par fréquence supposée, et propose pour chacune une réponse honnête en 2 phrases. Précise ce que tu supposes.",
      "Teste ensuite en jouant le client : « Joue le client sceptique, je réponds »."),
    P("rh-annonce", "Une annonce d'emploi inclusive", "metier", "rh", 0, ["entreprise", "entrepreneur"],
      "Rédige une annonce pour un poste de [POSTE] : missions, profil recherché, ce que nous offrons. Évite les termes discriminants, privilégie les critères mesurables. Longueur : 250 mots.",
      "Fais relire par une personne des RH avant de publier."),
    P("rh-entretien", "Préparer un entretien", "metier", "rh", 0, ["entreprise", "jeune", "entrepreneur"],
      "Prépare une grille d'entretien pour le poste de [POSTE] avec 8 questions, ce qu'une bonne réponse contient et les signaux d'alerte. Les questions doivent porter uniquement sur les compétences et l'expérience professionnelle.",
      "Ne colle jamais de CV avec des données personnelles dans un outil non validé."),
    P("gestion-relance", "Relancer une facture", "metier", "gestion", 0, ["entrepreneur", "entreprise"],
      "Écris un e-mail de relance cordial et ferme pour la facture [N° FACTURE] de [MONTANT] €, échéance dépassée de [NOMBRE] jours. Rappelle le mode de paiement et propose une nouvelle date : [DATE]. 5 lignes maximum.",
      "Pour les pénalités de retard, vérifie les règles sur un site officiel."),
    P("gestion-synthese", "Résumer un tableau de chiffres", "metier", "gestion", 1, ["entrepreneur", "entreprise", "pro"],
      "Voici un extrait de chiffres anonymisés : [DONNÉES]. Résume en 5 points les évolutions notables, signale les anomalies possibles et liste 3 questions que je devrais me poser. N'invente aucun chiffre absent des données.",
      "Pour des calculs importants, refais-les dans un tableur."),
    P("mkt-post", "Un post pour les réseaux", "metier", "marketing", 0, ["entrepreneur", "entreprise", "jeune", "pro"],
      "Écris 3 versions d'un post [RÉSEAU] sur [SUJET] pour [CIBLE]. Ton : [TON]. Une version courte, une narrative, une avec une question. Évite les promesses exagérées et les chiffres que je n'ai pas fournis.",
      "Le chiffre inventé est l'erreur la plus fréquente."),
    P("mkt-plan", "Un plan éditorial de 4 semaines", "metier", "marketing", 1, ["entrepreneur", "entreprise", "pro"],
      "Propose un calendrier éditorial de 4 semaines pour [ACTIVITÉ], 3 publications par semaine, avec le thème, le format et l'objectif de chaque publication. Présente-le dans un tableau.",
      "Demande ensuite de rédiger la première semaine seulement."),
    P("sup-reponse", "Répondre à un client mécontent", "metier", "support", 0, ["entreprise", "entrepreneur"],
      "Voici le message d'un client mécontent (anonymisé) : [MESSAGE]. Rédige une réponse qui reconnaît le problème, propose une solution concrète : [SOLUTION], et reste sous 8 lignes. Ton empathique, pas de promesse que nous ne pouvons pas tenir.",
      "Retire noms, adresses et numéros de commande avant de coller."),
    P("sup-faq", "Transformer des tickets en FAQ", "metier", "support", 1, ["entreprise", "pro"],
      "À partir de ces 20 demandes clients anonymisées : [DEMANDES], regroupe-les par thème, propose 8 questions fréquentes avec réponses courtes et indique pour chacune combien de demandes elle couvre.",
      "Compte à la main sur 5 demandes pour vérifier que le regroupement est juste."),
    P("tech-revue", "Une revue de code utile", "metier", "tech", 2, ["pro", "expert"],
      "Fais la revue de ce code : [CODE SANS SECRET]. Classe tes remarques par gravité (bloquant, important, détail), cite la ligne concernée et propose une correction minimale. Dis explicitement ce que tu n'as pas pu vérifier sans exécuter le code.",
      "Retire clés d'API, mots de passe et données réelles avant de coller."),
    P("tech-tests", "Générer des cas de test", "metier", "tech", 2, ["pro", "expert"],
      "Pour la fonction suivante : [DESCRIPTION OU CODE], liste 15 cas de test : 5 cas normaux, 5 cas limites, 5 entrées invalides ou hostiles. Donne l'entrée et le résultat attendu pour chacun. Signale les comportements qui ne sont pas définis par la spécification.",
      "Exécute les tests : l'IA se trompe parfois sur le résultat attendu."),
    P("dir-note", "Une note de cadrage d'une page", "metier", "direction", 1, ["entreprise", "pro", "entrepreneur"],
      "Rédige une note de cadrage d'une page pour [PROJET] : contexte, objectif mesurable, périmètre, risques, décisions attendues, calendrier. Si une information manque, écris « À CONFIRMER » plutôt que de l'inventer.",
      "Demande « Quelles hypothèses as-tu faites ? » avant de partager.")
  ];

  /* Pour la page de fin de séance : prompt personnalisé selon l'objectif du test. */
  D.promptParObjectif = { ecrire: "ecrire-mail", apprendre: "apprendre-coach", organiser: "organiser-semaine", creer: "creer-image" };
  D.promptMeta = "apprendre-questions";
})(typeof window !== "undefined" ? window : globalThis);

/* Profils, test d'entrée et scénarios personnalisés de la séance de 30 minutes.
   Tout est scénarisé : aucune réponse ne vient d'une vraie IA. */
(function (g) {
  const D = (g.D = g.D || {});

  D.profils = {
    senior: { nom: "Débutant·e / senior", court: "Je démarre", couleur: "#0B8F55", simple: true,
      accroche: "Pas à pas, en gros caractères, sans jargon.", but: "Écrire, comprendre, organiser le quotidien." },
    jeune: { nom: "Jeune", court: "Études et premiers jobs", couleur: "#2340FF",
      accroche: "Réviser, rédiger, te lancer, sans tricher avec toi-même.", but: "Apprendre plus vite et mieux." },
    particulier: { nom: "Particulier", court: "Vie de tous les jours", couleur: "#D6246E",
      accroche: "Repas, budget, démarches, voyages : gagne du temps.", but: "Simplifier le quotidien." },
    entrepreneur: { nom: "Entrepreneur·e", court: "Indépendant, TPE", couleur: "#E8480C",
      accroche: "Devis, relances, contenus : fais plus avec moins d'heures.", but: "Gagner du temps de gestion." },
    entreprise: { nom: "Équipe en entreprise", court: "Salarié·e, manager", couleur: "#0A7EA4",
      accroche: "Des usages sûrs et partagés dans l'équipe.", but: "Déployer sans risque." },
    pro: { nom: "Pro du numérique", court: "Métier du digital, data, produit", couleur: "#7A2CF0",
      accroche: "Prompts structurés, automatisations, agents.", but: "Industrialiser ses usages." },
    expert: { nom: "Expert·e IA", court: "Dev, data, ML", couleur: "#111111",
      accroche: "Évaluation, coûts, sécurité : les angles morts.", but: "Fiabiliser ce que tu construis." }
  };

  /* Test d'entrée : 5 questions, une seule réponse chacune. */
  D.test = [
    { id: "qui", q: "Tu te reconnais plutôt dans…", r: [
      ["senior", "Je débute, ou j'ai plus de 60 ans et je veux y aller doucement"],
      ["jeune", "Je suis lycéen·ne, étudiant·e ou en début de carrière"],
      ["particulier", "Je veux surtout m'aider dans ma vie perso"],
      ["entrepreneur", "Je suis indépendant·e ou je dirige une petite structure"],
      ["entreprise", "Je travaille dans une entreprise et je veux un usage cadré"],
      ["pro", "Je travaille dans le numérique, la data ou le produit"]
    ] },
    { id: "niveau", q: "Ton expérience avec l'IA ?", r: [
      ["0", "Jamais essayé"], ["1", "Quelques essais, sans méthode"],
      ["2", "J'en utilise souvent"], ["3", "Je l'intègre dans du code ou des automatisations"]
    ] },
    { id: "objectif", q: "Ton premier objectif ?", r: [
      ["ecrire", "Écrire (mails, textes, lettres)"], ["apprendre", "Comprendre et apprendre"],
      ["organiser", "M'organiser et décider"], ["creer", "Créer (images, sites, code)"]
    ] },
    { id: "donnees", q: "Tes données sont…", r: [
      ["libres", "Banales : je ne mets rien de sensible"],
      ["sensibles", "Parfois sensibles (clients, santé, contrats)"]
    ] },
    { id: "budget", q: "Ton budget ?", r: [
      ["0", "Zéro : je veux du gratuit"], ["20", "Jusqu'à 20 € par mois"], ["plus", "Plus si ça vaut le coup"]
    ] }
  ];

  /* Calcule le profil à partir des réponses. */
  D.calculerProfil = function (rep) {
    let p = rep.qui || "particulier";
    if (p === "pro" && rep.niveau === "3") p = "expert";
    if (p === "particulier" && rep.niveau === "0") p = "senior";
    return p;
  };

  /* Scénarios personnalisés pour les exercices 1 (bon/mauvais prompt), 2 (blocs) et 5 (conversation). */
  D.scenarios = {
    senior: {
      situation: "Tu veux écrire un petit mot pour l'anniversaire de ta petite-fille Léa, 12 ans, qui adore les chevaux.",
      mauvais: "Écris un message d'anniversaire.",
      bon: "Écris un message d'anniversaire pour ma petite-fille Léa, 12 ans, qui adore les chevaux. Ton chaleureux et un peu drôle, 4 phrases maximum.",
      pourquoi: "Le bon prompt dit pour qui, sur quel ton et quelle longueur. L'IA n'a plus à deviner.",
      blocs: { role: "Tu es un auteur de cartes de vœux.", contexte: "C'est pour ma petite-fille Léa, 12 ans, qui adore les chevaux.", tache: "Écris un message d'anniversaire.", format: "4 phrases maximum.", contraintes: "Ton chaleureux et un peu drôle, sans mot compliqué." },
      conv: { prompt: "Écris un message d'anniversaire.",
        premiere: "Joyeux anniversaire ! Que cette nouvelle année t'apporte joie, santé et bonheur. Profite bien de ta journée !",
        o1: [["Non, refais.", false, "Trop vague : l'IA ne sait pas ce qui ne va pas."],
             ["C'est trop banal. Elle a 12 ans et adore les chevaux : ajoute une touche d'humour, en 4 phrases.", true, "Tu dis ce qui manque. C'est la bonne méthode."],
             ["Merci, ça ira.", false, "Tu t'arrêtes à la première réponse. On peut presque toujours mieux faire."]],
        reponse1: "Joyeux anniversaire Léa ! À 12 ans, tu galopes déjà plus vite que moi dans la vie. Que cette année te réserve de belles balades et zéro crottin sur les bottes. Je t'embrasse très fort !",
        o2: [["Super. Donne-moi une version plus courte pour une carte.", true, "Tu demandes une variante : la façon la plus simple d'affiner."],
             ["Tu es nul.", false, "Une critique sans précision n'apprend rien à l'IA."],
             ["Écris-en dix autres.", false, "Beaucoup de textes, mais sans direction : tu devras tout relire."]],
        reponse2: "Joyeux anniversaire Léa ! Que cette année galope à toute vitesse. Je t'embrasse fort !" } },
    jeune: {
      situation: "Tu as un oral de 5 minutes sur la Révolution industrielle dans deux jours.",
      mauvais: "Explique la Révolution industrielle.",
      bon: "Je suis en première et j'ai un oral de 5 minutes sur la Révolution industrielle dans 2 jours. Pose-moi 5 questions, une par une, corrige mes réponses et ne me donne pas la solution avant que j'aie essayé.",
      pourquoi: "Le bon prompt transforme l'IA en entraîneur : tu apprends en répondant, pas en lisant.",
      blocs: { role: "Tu es un professeur d'histoire bienveillant.", contexte: "Je suis en première, j'ai un oral de 5 minutes sur la Révolution industrielle dans 2 jours.", tache: "Pose-moi 5 questions, une par une, et corrige mes réponses.", format: "Une question à la fois, puis une note sur 10 et un conseil.", contraintes: "Ne me donne pas la solution avant que j'aie essayé." },
      conv: { prompt: "Explique la Révolution industrielle.",
        premiere: "La Révolution industrielle est une période de profonds changements économiques et sociaux, marquée par la mécanisation, l'essor des usines et l'urbanisation.",
        o1: [["Plus long.", false, "Plus long ne veut pas dire plus utile."],
             ["Je dois la présenter à l'oral en 5 minutes. Pose-moi des questions une par une pour que je m'entraîne.", true, "Tu précises ton but : l'IA change de rôle."],
             ["Fais-moi mon exposé complet.", false, "Tu apprendras moins, et ton prof reconnaîtra un texte d'IA."]],
        reponse1: "D'accord, on s'entraîne. Question 1 : peux-tu citer deux changements apportés par la machine à vapeur dans la production ?",
        o2: [["Voici mes deux réponses. Corrige-les et dis-moi ce qui manque.", true, "Tu joues le jeu : c'est là que tu progresses."],
             ["Passe à la solution.", false, "Sans effort de ta part, tu retiens beaucoup moins."],
             ["Change de sujet.", false, "Tu laisses l'entraînement en plan."]],
        reponse2: "Bien vu pour l'usine. Il manque l'idée de transport : le chemin de fer relie les marchés. Question 2 : quelles sont les conséquences pour les villes ?" } },
    particulier: {
      situation: "Tu dois planifier les repas de la semaine pour 3 personnes avec 80 € de budget.",
      mauvais: "Donne-moi des idées de repas.",
      bon: "Planifie 5 dîners pour 3 personnes avec un budget de 80 € pour la semaine, sans porc, avec des plats de moins de 30 minutes. Donne aussi la liste de courses regroupée par rayon.",
      pourquoi: "Budget, contraintes et format de sortie : tu reçois un plan utilisable, pas une liste d'idées.",
      blocs: { role: "Tu es un cuisinier malin qui connaît les prix en supermarché.", contexte: "Nous sommes 3 à la maison, 80 € de budget pour la semaine.", tache: "Planifie 5 dîners et la liste de courses.", format: "Un tableau jour / plat, puis la liste de courses par rayon.", contraintes: "Sans porc, moins de 30 minutes par plat." },
      conv: { prompt: "Donne-moi des idées de repas.",
        premiere: "Voici quelques idées : pâtes, salade composée, poulet rôti, soupe de légumes, omelette.",
        o1: [["Autre chose.", false, "L'IA recommencera au hasard."],
             ["On est 3, budget 80 € pour 5 dîners, sans porc, 30 minutes maximum. Fais un plan et la liste de courses.", true, "Quantité, budget, contraintes : exactement ce qu'il faut."],
             ["Quel est le meilleur plat du monde ?", false, "Question trop large pour t'aider ce soir."]],
        reponse1: "Lundi : curry de pois chiches (25 min). Mardi : omelette aux légumes. Mercredi : poulet et riz. Jeudi : gratin de courgettes. Vendredi : pâtes aux lentilles. Courses estimées : environ 70 €.",
        o2: [["Remplace jeudi par un plat sans four et vérifie que le total reste sous 80 €.", true, "Une modification précise et un contrôle du budget."],
             ["Parfait, j'achète tout sans relire.", false, "Les prix sont des estimations : compare avec ton magasin."],
             ["Recommence tout.", false, "Tu perds le bon travail déjà fait."]],
        reponse2: "Jeudi : galettes de lentilles à la poêle. Total estimé : 72 €. Les prix sont indicatifs : vérifie-les dans ton magasin." } },
    entrepreneur: {
      situation: "Un client a une facture en retard de 15 jours. Tu veux le relancer poliment, sans le froisser.",
      mauvais: "Écris une relance de facture.",
      bon: "Écris un e-mail de relance poli et ferme pour la facture [N° FACTURE] de [MONTANT] €, échéance dépassée de 15 jours. Ton cordial, 5 lignes maximum, avec un rappel du mode de paiement et une nouvelle date limite.",
      pourquoi: "Les [crochets] te permettent de ne jamais coller de vrai nom ni de vrai montant dans l'IA : tu les remplis après.",
      blocs: { role: "Tu es un assistant administratif d'une petite entreprise.", contexte: "La facture [N° FACTURE] de [MONTANT] € est en retard de 15 jours. Le client est habituellement fiable.", tache: "Écris un e-mail de relance.", format: "5 lignes maximum, avec objet.", contraintes: "Ton cordial mais ferme, propose une nouvelle date limite." },
      conv: { prompt: "Écris une relance de facture.",
        premiere: "Bonjour, sauf erreur de ma part, votre facture reste impayée. Merci de procéder au règlement dans les meilleurs délais.",
        o1: [["Plus agressif.", false, "Tu risques de perdre le client."],
             ["Ce client est fiable : sois cordial, rappelle le mode de paiement et propose une date limite.", true, "Tu donnes le contexte de la relation : le ton devient juste."],
             ["Colle ici le contrat complet du client pour que tu comprennes.", false, "Évite : ne colle pas de documents clients complets dans une IA."]],
        reponse1: "Objet : Rappel de facture [N° FACTURE]. Bonjour [PRÉNOM], je me permets de vous rappeler que la facture [N° FACTURE] est arrivée à échéance il y a 15 jours. Pourriez-vous procéder au virement d'ici le [DATE] ? Merci d'avance.",
        o2: [["Ajoute une phrase si le paiement est déjà parti, et raccourcis.", true, "Tu anticipes un cas courant et tu demandes plus court."],
             ["Envoie-le directement au client.", false, "Relis toujours avant d'envoyer, c'est ton nom dessus."],
             ["Invente une pénalité de retard.", false, "Les pénalités ont des règles légales : vérifie sur un site officiel."]],
        reponse2: "Si votre paiement est déjà parti, merci de ne pas tenir compte de ce message. Objet : Rappel facture [N° FACTURE]. Pourriez-vous régler d'ici le [DATE] ?" } },
    entreprise: {
      situation: "Tu sors d'une réunion d'équipe et tu dois envoyer un compte rendu avec les actions à mener.",
      mauvais: "Fais le compte rendu de la réunion.",
      bon: "Voici mes notes de réunion anonymisées (personnes : A, B, C). Fais un compte rendu en 3 parties : décisions, actions (qui, quoi, pour quand) et points ouverts. Maximum une page, ton neutre.",
      pourquoi: "Anonymiser avant de coller protège les personnes ; la structure demandée évite un texte fleuve.",
      blocs: { role: "Tu es un chef de projet rigoureux.", contexte: "Notes d'une réunion d'équipe, personnes anonymisées en A, B, C.", tache: "Rédige le compte rendu.", format: "3 parties : décisions, actions (qui, quoi, quand), points ouverts. Une page maximum.", contraintes: "Ton neutre. N'invente aucune décision absente des notes." },
      conv: { prompt: "Fais le compte rendu de la réunion.",
        premiere: "Compte rendu : l'équipe s'est réunie et a discuté de plusieurs sujets importants. Des actions seront menées.",
        o1: [["Sois plus précis.", false, "Précis sur quoi ? L'IA n'a pas d'élément nouveau."],
             ["Voici les notes (personnes anonymisées A, B, C). Structure : décisions, actions avec responsable et date, points ouverts.", true, "Matière + structure + anonymisation."],
             ["Colle l'enregistrement complet avec les noms des clients.", false, "Vérifie d'abord ce que ton entreprise autorise : données clients et outil validé."]],
        reponse1: "Décisions : lancer le test en novembre. Actions : A prépare la maquette (15/11) ; B contacte le prestataire (10/11). Points ouverts : budget à confirmer.",
        o2: [["Vérifie que chaque action vient bien de mes notes et signale ce que tu as supposé.", true, "Tu demandes à l'IA de séparer le sûr du supposé."],
             ["Envoie à toute l'équipe.", false, "Relis d'abord : un compte rendu faux a des conséquences."],
             ["Ajoute des idées pour avoir l'air plus complet.", false, "Un compte rendu ne doit pas contenir d'invention."]],
        reponse2: "Toutes les actions viennent de tes notes, sauf la date du 10/11 pour B, que j'ai déduite. À confirmer." } },
    pro: {
      situation: "Tu construis un assistant qui trie des demandes clients en catégories pour ton équipe produit.",
      mauvais: "Classe ces demandes clients.",
      bon: "Classe chaque demande dans exactement une catégorie parmi : bug, question, demande de fonctionnalité, autre. Réponds en JSON {\"id\":…, \"categorie\":…, \"confiance\":0-1}. Si la demande est ambiguë, mets « autre » et confiance < 0.5. Exemples : « Le bouton ne marche pas » → bug ; « Pouvez-vous ajouter l'export PDF ? » → demande de fonctionnalité.",
      pourquoi: "Catégories fermées, format de sortie, règle pour les cas ambigus et exemples : c'est un prompt exploitable en production.",
      blocs: { role: "Tu es un classificateur de tickets support.", contexte: "Les demandes viennent du formulaire de contact d'un produit logiciel.", tache: "Classe chaque demande dans exactement une catégorie : bug, question, demande de fonctionnalité, autre.", format: "JSON : {\"id\", \"categorie\", \"confiance\"} sans texte autour.", contraintes: "Cas ambigu : catégorie « autre » et confiance inférieure à 0.5. Donne 2 exemples." },
      conv: { prompt: "Classe ces demandes clients.",
        premiere: "Voici le classement : la demande 1 semble être un bug, la 2 est probablement une question, la 3 pourrait être autre chose.",
        o1: [["Plus de détails.", false, "Tu obtiens plus de texte, pas plus de structure."],
             ["Réponds en JSON strict avec des catégories fermées et un score de confiance. Cas ambigu : « autre ».", true, "Tu rends la sortie lisible par une machine."],
             ["Classe-les comme tu veux.", false, "Sans contrat de sortie, ton code cassera."]],
        reponse1: "[{\"id\":1,\"categorie\":\"bug\",\"confiance\":0.92},{\"id\":2,\"categorie\":\"question\",\"confiance\":0.81},{\"id\":3,\"categorie\":\"autre\",\"confiance\":0.4}]",
        o2: [["Je vais tester ce prompt sur 30 demandes que j'ai déjà classées à la main, avant de l'utiliser.", true, "Mesurer avant de déployer : c'est le réflexe clé."],
             ["Parfait, en production.", false, "Un seul essai ne prouve rien."],
             ["Ajoute 20 exemples au hasard.", false, "Plus d'exemples n'aide que s'ils couvrent les cas difficiles."]],
        reponse2: "Bonne idée. Garde 10 cas en réserve pour vérifier que les exemples du prompt ne faussent pas la mesure." } },
    expert: {
      situation: "Tu veux vérifier qu'un changement de prompt n'a pas dégradé ton assistant.",
      mauvais: "Compare l'ancienne et la nouvelle réponse et dis laquelle est meilleure.",
      bon: "Tu es juge. Pour chaque cas, note chaque réponse de 1 à 5 selon la grille : exactitude, respect du format, utilité. Justifie en une phrase par critère avant de donner la note. Ne connais pas l'ordre des réponses : elles sont mélangées. Réponds en JSON.",
      pourquoi: "Grille explicite, justification avant la note, ordre masqué : trois protections contre les biais classiques d'un modèle juge.",
      blocs: { role: "Tu es un évaluateur impartial.", contexte: "Deux versions d'un prompt ont produit des réponses sur les mêmes cas de test, présentées dans un ordre aléatoire.", tache: "Note chaque réponse de 1 à 5.", format: "JSON par cas : critères, justification en une phrase, note.", contraintes: "Justifie avant de noter. Pas de préférence de longueur ou de position. Grille : exactitude, format, utilité." },
      conv: { prompt: "Compare l'ancienne et la nouvelle réponse et dis laquelle est meilleure.",
        premiere: "La deuxième réponse est meilleure car plus détaillée.",
        o1: [["Merci, je garde la deuxième.", false, "Un modèle juge préfère souvent la réponse la plus longue : biais connu."],
             ["Utilise une grille, justifie avant de noter et mélange l'ordre des réponses.", true, "Tu contrôles les biais de longueur et de position."],
             ["Redemande jusqu'à ce que la réponse me plaise.", false, "Tu mesures ton envie, pas la qualité."]],
        reponse1: "Cas 12 : A exactitude 4, format 5, utilité 3. B exactitude 4, format 3, utilité 4. Les notes sont justifiées cas par cas.",
        o2: [["Je compare les notes du juge avec un échantillon noté par un humain pour voir s'ils s'accordent.", true, "Calibrer le juge sur des étiquettes humaines : la vraie validation."],
             ["Je fais confiance au juge.", false, "Sans calibrage, tu ne sais pas s'il mesure ce que tu veux."],
             ["Je passe au modèle suivant.", false, "Le même défaut se reproduira."]],
        reponse2: "Calcule l'accord (par exemple un coefficient kappa) sur 50 cas. En dessous d'un seuil que tu fixes, revois la grille avant de t'y fier." } }
  };
})(typeof window !== "undefined" ? window : globalThis);

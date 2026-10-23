/* Kit entreprise : modèle de charte d'usage, check-list de déploiement, cas d'usage par service.
   Ce sont des modèles d'ordre de grandeur, pas un conseil juridique. À faire valider par le DPO ou un juriste. */
(function (g) {
  const D = (g.D = g.D || {});

  D.charte = [
    ["Objet", "Cette charte fixe les règles d'usage des outils d'intelligence artificielle générative chez [NOM DE L'ENTREPRISE]. Elle vise à profiter de ces outils sans exposer les données de l'entreprise, de ses clients ou de ses salariés."],
    ["Outils autorisés", "Seuls les outils listés par [RESPONSABLE / DSI] sont autorisés pour un usage professionnel : [LISTE]. Les comptes personnels gratuits ne sont pas utilisés pour des données de l'entreprise."],
    ["Données interdites", "Il est interdit de saisir : données de santé, numéros d'identification, mots de passe et clés d'accès, données personnelles de clients ou de salariés non anonymisées, secrets d'affaires, contrats et documents confidentiels, code source non public."],
    ["Anonymiser avant de coller", "Remplace les noms, adresses, montants et références par des [CRÉNEAUX]. En cas de doute, ne colle pas et demande à [CONTACT]."],
    ["Vérifier avant d'utiliser", "Toute production de l'IA est relue et vérifiée par la personne qui l'utilise : faits, chiffres, citations, liens. La personne reste responsable du contenu qu'elle diffuse."],
    ["Transparence", "Quand un contenu destiné à l'extérieur a été produit avec l'aide d'une IA, [RÈGLE : mention / pas de mention selon le cas], conformément à [POLITIQUE]."],
    ["Décisions sur des personnes", "Aucune décision concernant une personne (recrutement, évaluation, sanction, accès à un service) n'est prise uniquement par une IA. Une personne décide et peut l'expliquer."],
    ["Agents et automatisations", "Un agent ou une automatisation qui agit sans validation (envoi, paiement, suppression) doit être déclaré à [RESPONSABLE] et limité aux droits minimaux."],
    ["Incident", "En cas de fuite ou de doute (donnée collée par erreur), prévenir [CONTACT] sous [DÉLAI]. Aucune sanction pour un signalement de bonne foi."],
    ["Mise à jour", "Cette charte est revue tous les [PÉRIODE] ou à l'arrivée d'un nouvel outil. Dernière révision : [DATE]."]
  ];

  D.checklist = [
    ["Cadrer", ["Désigner une personne responsable de l'IA dans l'entreprise", "Lister les usages déjà en place (y compris non officiels)", "Associer le DPO ou la personne chargée de la protection des données", "Choisir 2 ou 3 cas d'usage de départ, à faible risque"]],
    ["Choisir l'outil", ["Comparer au moins 3 outils avec la page « Quelle IA pour moi ? »", "Lire pour chacun la politique de données (entraînement, conservation, hébergement)", "Choisir une offre professionnelle plutôt que des comptes personnels", "Vérifier les droits d'administration et la gestion des accès"]],
    ["Protéger", ["Publier la charte d'usage et la faire lire", "Mettre à disposition la liste « Ne colle pas ça »", "Définir qui peut relier l'IA aux messageries et aux documents", "Prévoir un contact pour les doutes et les incidents"]],
    ["Former", ["Faire la séance de 30 minutes à toute l'équipe", "Partager 5 prompts validés par métier", "Désigner des ambassadeurs dans chaque service"]],
    ["Mesurer", ["Fixer un indicateur simple par cas d'usage (temps gagné, erreurs évitées)", "Relire un échantillon de productions chaque mois", "Faire un point à 3 mois : on garde, on ajuste, on arrête"]]
  ];

  D.cas = [
    { service: "Ressources humaines", cas: [
      ["Rédiger une annonce d'emploi", "rh-annonce", "Aucune donnée de candidat dans l'outil."],
      ["Préparer une grille d'entretien", "rh-entretien", "Ne pas confier le tri des candidatures à l'IA seule."]] },
    { service: "Commercial", cas: [
      ["Écrire une prospection", "com-prospect", "Pas de fichier clients complet."],
      ["Préparer les objections", "com-objections", "Teste avec un cas anonymisé."]] },
    { service: "Finance et gestion", cas: [
      ["Relancer une facture", "gestion-relance", "Remplace noms et montants par des créneaux."],
      ["Résumer des chiffres", "gestion-synthese", "Recalcule dans le tableur."]] },
    { service: "Marketing", cas: [
      ["Rédiger des posts", "mkt-post", "Relis les chiffres et promesses."],
      ["Plan éditorial", "mkt-plan", "Valide avec la marque."]] },
    { service: "Support client", cas: [
      ["Répondre à un client mécontent", "sup-reponse", "Anonymise le message."],
      ["Créer une FAQ", "sup-faq", "Vérifie le regroupement sur un échantillon."]] },
    { service: "Technique et data", cas: [
      ["Revue de code", "tech-revue", "Retire les secrets."],
      ["Cas de test", "tech-tests", "Exécute les tests."]] },
    { service: "Direction", cas: [
      ["Note de cadrage", "dir-note", "Demande les hypothèses."]] },
    { service: "Formation interne", cas: [
      ["Préparer une séance", "ens-cours", "Aucune donnée identifiable."]] }
  ];
})(typeof window !== "undefined" ? window : globalThis);

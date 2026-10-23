/* Fiches d'outils. Chaque fait vient de la page officielle citée (champ url_prix), consultée à la date `verifie`.
   Pas d'affiliation, pas de classement : l'ordre d'affichage est alphabétique.
   Les prix sont ceux des pages américaines (en dollars) : ils peuvent différer en France. */
(function (g) {
  const D = (g.D = g.D || {});
  const V = "2026-10-23";

  D.besoins = {
    ecrire: "Écrire et reformuler", apprendre: "Comprendre et apprendre", chercher: "Chercher avec des sources",
    documents: "Travailler avec mes documents", creer: "Créer (images, voix, sites)", coder: "Coder avec un agent",
    automatiser: "Automatiser des tâches", perso: "Un assistant qui agit à ma place"
  };

  D.outils = [
    { id: "chatgpt", nom: "ChatGPT", editeur: "OpenAI", famille: "Assistant généraliste",
      besoins: ["ecrire", "apprendre", "chercher", "documents", "creer", "automatiser", "coder"], niveau: 0,
      gratuit: "oui", gratuitTxt: "Offre Free : conversations texte illimitées (soumises aux règles anti-abus), le reste est limité.",
      prix: [["Free", "0 $"], ["Go", "8 $ / mois"], ["Plus", "20 $ / mois"], ["Pro", "à partir de 100 $ / mois"]],
      forts: ["Recherche web, projets et voix dans toutes les offres", "Tâches planifiées dès l'offre Go (pas en Free)", "Création d'images (limitée en Free)", "Codex et fonctions d'agent dans les offres payantes"],
      limites: ["En Free : fichiers, recherche approfondie, mémoire et Codex sont limités", "L'offre Go « peut inclure des publicités » (page officielle)"],
      donnees: "La page tarifs indique que l'utilisation des contenus pour entraîner les modèles peut être refusée (opt-out) sur toutes les offres individuelles.", controle: true,
      url: "https://chatgpt.com/", url_prix: "https://openai.com/chatgpt/pricing/", verifie: V },
    { id: "claude", nom: "Claude", editeur: "Anthropic", famille: "Assistant généraliste",
      besoins: ["ecrire", "apprendre", "chercher", "documents", "creer", "automatiser", "coder"], niveau: 0,
      gratuit: "oui", gratuitTxt: "Offre Free à 0 $ : recherche web, création de fichiers, exécution de code, mémoire, connexion d'applications.",
      prix: [["Free", "0 $"], ["Pro", "17 $ / mois (facturé 200 $ par an) ou 20 $ au mois"], ["Max", "à partir de 100 $ / mois"], ["Team", "20 $ par siège et par mois (annuel), 25 $ au mois"]],
      forts: ["Projects, tâches planifiées et Claude Code dans l'offre Pro", "Offre Team : aucun entraînement sur le contenu par défaut"],
      limites: ["L'usage de l'offre Free est moins élevé que celui de Pro (la page parle de « plus d'utilisation » en Pro)", "Politique de données des offres individuelles : non relevée sur la page tarifs, à lire dans les réglages"],
      donnees: "Offre Team : « aucun entraînement de modèle sur votre contenu par défaut » (page tarifs). Offres individuelles : à vérifier dans la politique de confidentialité.", controle: false,
      url: "https://claude.com/", url_prix: "https://claude.com/pricing", verifie: V },
    { id: "copilot", nom: "Microsoft Copilot", editeur: "Microsoft", famille: "Assistant dans les apps Microsoft",
      besoins: ["ecrire", "documents"], niveau: 0,
      gratuit: "non confirmé", gratuitTxt: "La page consultée ne mentionne pas d'offre gratuite permanente, seulement un essai d'un mois sur certaines formules.",
      prix: [["Microsoft 365 Personal", "9,99 $ / mois ou 99,99 $ / an"], ["Microsoft 365 Family", "12,99 $ / mois ou 129,99 $ / an"], ["Microsoft 365 Premium", "19,99 $ / mois ou 199,99 $ / an"], ["Microsoft 365 Pro", "99,99 $ / mois"]],
      forts: ["Copilot intégré à Word, Excel et PowerPoint"],
      limites: ["Passe par un abonnement Microsoft 365", "Offre gratuite non confirmée sur la page consultée"],
      donnees: "Non relevée sur la page tarifs : lis la déclaration de confidentialité de Microsoft avant d'y mettre des données sensibles.", controle: false,
      url: "https://www.microsoft.com/en-us/copilot/solutions/individuals", url_prix: "https://www.microsoft.com/en-us/microsoft-copilot/for-individuals", verifie: V },
    { id: "cursor", nom: "Cursor", editeur: "Cursor", famille: "Agent de code",
      besoins: ["coder", "automatiser"], niveau: 2,
      gratuit: "oui", gratuitTxt: "Offre Free : requêtes d'agent et de chat limitées.",
      prix: [["Free", "0 $"], ["Plus", "8 $ / mois"], ["Premium", "30 $ / mois"], ["Super", "100 $ / mois"], ["Ultra", "200 $ / mois"], ["Teams", "30 $ et plus par utilisateur et par mois"]],
      forts: ["Agent de code et chat (la page parle de requêtes d'agent et de chat)", "Paliers d'usage de Plus (1x) à Ultra (50x)"],
      limites: ["Pensé pour écrire du code : peu utile si tu ne programmes pas", "Usage de la formule Free limité"],
      donnees: "Non relevée sur la page tarifs : lis la politique de confidentialité avant d'ouvrir du code d'entreprise.", controle: false,
      url: "https://cursor.com/", url_prix: "https://cursor.com/pricing", verifie: V },
    { id: "gemini", nom: "Gemini", editeur: "Google", famille: "Assistant généraliste",
      besoins: ["ecrire", "apprendre", "chercher", "documents", "creer"], niveau: 0,
      gratuit: "oui", gratuitTxt: "Offre gratuite avec un compte Google : modèle Flash-Lite, images, Deep Research, Gemini Live, Canvas, Gems, Gemini Notebook, 15 Go de stockage.",
      prix: [["Gratuit", "0 $"], ["Google AI Plus", "4,99 $ / mois"], ["Google AI Pro", "19,99 $ / mois"], ["Google AI Ultra", "à partir de 99,99 $ / mois"]],
      forts: ["Génération et édition d'images et recherche approfondie dès l'offre gratuite", "Gemini Live (conversation vocale) et Gems (assistants personnalisés)", "Intégré à Gmail, Docs et Vids dans les offres payantes"],
      limites: ["Demande un compte Google", "Offre gratuite limitée au modèle Flash-Lite"],
      donnees: "Non relevée sur la page des abonnements : consulte la politique de confidentialité de Gemini et les réglages de ton compte Google.", controle: false,
      url: "https://gemini.google/", url_prix: "https://gemini.google/subscriptions/", verifie: V },
    { id: "instinct", nom: "Instinct", editeur: "Instinct (éditeur non précisé sur le site)", famille: "Assistant personnel qui agit",
      besoins: ["perso"], niveau: 0,
      gratuit: "inconnu", gratuitTxt: "Aucun prix publié sur la page d'accueil officielle consultée.",
      prix: [["Prix", "non publié sur le site officiel consulté"]],
      forts: ["On lui écrit ou on l'appelle : « pas de nouvelle interface » (site officiel)", "Il peut utiliser un téléphone et un ordinateur comme toi : commander, réserver un train, trouver un terrain de tennis (exemples du site)"],
      limites: ["Accès sur invitation d'après des articles tiers : non confirmé par le site officiel", "Il agit à ta place : donne-lui le minimum d'accès", "Peu d'informations officielles publiques (prix, données) au 23 octobre 2026"],
      donnees: "Non précisée sur la page d'accueil consultée. Des articles tiers parlent d'un accès large à la vie numérique : lis les conditions avant tout essai.", controle: false, fiabilite: "partielle",
      url: "https://instinct.com/", url_prix: "https://instinct.com/", verifie: V },
    { id: "make", nom: "Make", editeur: "Make", famille: "Automatisation",
      besoins: ["automatiser"], niveau: 1,
      gratuit: "oui", gratuitTxt: "Offre Free : 1 000 crédits par mois.",
      prix: [["Free", "0 $ (1 000 crédits / mois)"], ["Core", "9 $ / mois"], ["Pro", "16 $ / mois"], ["Teams", "29 $ / mois"]],
      forts: ["Crédits supplémentaires achetables (par exemple 0,90 $ les 1 000 en Core)"],
      limites: ["Le nombre de crédits des offres payantes n'est pas affiché dans l'en-tête des offres"],
      donnees: "Non relevée : consulte la politique de confidentialité avant de relier des comptes clients.", controle: false,
      url: "https://www.make.com/", url_prix: "https://www.make.com/en/pricing", verifie: V },
    { id: "vibe", nom: "Vibe by Mistral (anciennement Le Chat)", editeur: "Mistral AI", famille: "Assistant généraliste",
      besoins: ["ecrire", "apprendre", "chercher", "creer", "coder", "automatiser"], niveau: 0,
      gratuit: "oui", gratuitTxt: "Offre Free : messages et recherches web limités, codage limité, images de base, plus de 100 connecteurs.",
      prix: [["Free", "0 $"], ["Pro", "14,99 $ / mois (5,99 $ pour les étudiants vérifiés)"], ["Team", "24,99 $ par utilisateur et par mois"], ["Enterprise", "sur contact"]],
      forts: ["Plus de 100 connecteurs dès l'offre Free", "Pro : codage en ligne de commande, IDE ou web, tableurs et présentations"],
      limites: ["Le site officiel a renommé l'assistant : « Vibe (formerly Le Chat) »", "Free : messages, recherches web et sessions de codage limités"],
      donnees: "Pro, Team et Enterprise : option de refus de l'entraînement (« Opt-out » dans la page tarifs). Free : non précisé.", controle: true,
      url: "https://chat.mistral.ai/", url_prix: "https://mistral.ai/pricing", verifie: V },
    { id: "n8n", nom: "n8n", editeur: "n8n", famille: "Automatisation",
      besoins: ["automatiser", "coder"], niveau: 2,
      gratuit: "oui", gratuitTxt: "La Community Edition est gratuite, mais auto-hébergée : tu installes et maintiens toi-même.",
      prix: [["Community (auto-hébergée)", "gratuite"], ["Starter (cloud)", "20 $ / mois, facturé annuellement, 2,5 K exécutions"], ["Pro (cloud)", "50 $ / mois, 10 K exécutions"], ["Business (auto-hébergée)", "800 $ / mois, 40 K exécutions"], ["Enterprise", "sur contact"]],
      forts: ["Possibilité d'héberger chez soi : tes données restent sur ton serveur"],
      limites: ["Auto-héberger demande des compétences techniques", "La formule gratuite n'est pas hébergée pour toi"],
      donnees: "Auto-hébergé : les données restent chez toi. Cloud : lire la politique de n8n.", controle: true,
      url: "https://n8n.io/", url_prix: "https://n8n.io/pricing", verifie: V },
    { id: "perplexity", nom: "Perplexity", editeur: "Perplexity AI", famille: "Recherche avec sources",
      besoins: ["chercher", "documents", "apprendre"], niveau: 0,
      gratuit: "oui", gratuitTxt: "Offre Free (connexion gratuite). Le détail des limites n'est pas listé sur la page consultée.",
      prix: [["Free", "0 $"], ["Pro", "17 $ / mois, facturé annuellement"], ["Max", "167 $ / mois, facturé annuellement"]],
      forts: ["Recherche approfondie (Deep research) et choix entre plusieurs modèles en Pro", "Création de documents et d'applications en Pro"],
      limites: ["Détail de l'offre Free non listé sur la page tarifs consultée"],
      donnees: "Non relevée sur la page tarifs : lis la politique de confidentialité.", controle: false,
      url: "https://www.perplexity.ai/", url_prix: "https://www.perplexity.ai/pro", verifie: V },
    { id: "v0", nom: "v0 de Vercel", editeur: "Vercel", famille: "Création de sites et d'applications",
      besoins: ["creer", "coder"], niveau: 1,
      gratuit: "oui", gratuitTxt: "Offre Free : 5 $ de crédits uniques pour les nouveaux comptes.",
      prix: [["Free", "0 $ (5 $ de crédits uniques)"], ["Plus", "30 $ par utilisateur et par mois (un ancien prix barré est affiché)"], ["Business", "100 $ par utilisateur et par mois"], ["Enterprise", "sur contact"]],
      forts: ["Décrire un site ou une application et la voir apparaître", "2 $ de crédits gratuits par jour de connexion dans Plus et Business"],
      limites: ["Les crédits de l'offre Free ne se renouvellent pas : 5 $ une seule fois"],
      donnees: "Non relevée sur la page tarifs : lis la politique de Vercel.", controle: false,
      url: "https://v0.app/", url_prix: "https://v0.app/pricing", verifie: V },
    { id: "zapier", nom: "Zapier", editeur: "Zapier", famille: "Automatisation",
      besoins: ["automatiser"], niveau: 1,
      gratuit: "oui", gratuitTxt: "Offre Free : 100 tâches par mois.",
      prix: [["Free", "0 $ (100 tâches / mois)"], ["Professional", "à partir de 19,99 $ / mois"], ["Team", "à partir de 69 $ / mois"], ["Enterprise", "sur contact"]],
      forts: ["Relier des applications entre elles par des « zaps »"],
      limites: ["100 tâches par mois en Free : épuisées vite si l'automatisation tourne souvent"],
      donnees: "Non relevée : lis la politique de confidentialité avant de relier des comptes professionnels.", controle: false,
      url: "https://zapier.com/", url_prix: "https://zapier.com/pricing", verifie: V }
  ];
  D.outils.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  /* Questionnaire « quelle IA est faite pour moi ? » */
  D.questionnaire = [
    { id: "besoin", q: "Qu'est-ce que tu veux faire en premier ?", r: Object.entries(D.besoins) },
    { id: "budget", q: "Ton budget ?", r: [["0", "Zéro"], ["20", "Jusqu'à 20 € / $ par mois"], ["plus", "Peu importe si ça vaut le coup"]] },
    { id: "donnees", q: "Tes données ?", r: [["libres", "Banales"], ["sensibles", "Sensibles (clients, santé…)"]] },
    { id: "niveau", q: "Ton aisance technique ?", r: [["0", "Débutant·e"], ["1", "À l'aise avec les outils numériques"], ["2", "Je code ou j'installe des outils"]] }
  ];

  /* Recommandation : filtre dur sur le besoin, points pour le reste. Chaque raison est affichée. */
  D.recommander = function (rep) {
    const out = [];
    D.outils.forEach(o => {
      if (!o.besoins.includes(rep.besoin)) return;
      let pts = 1; const raisons = [];
      raisons.push("Couvre ton besoin : " + D.besoins[rep.besoin].toLowerCase());
      if (rep.budget === "0") {
        if (o.gratuit === "oui") { pts += 2; raisons.push("Offre gratuite : " + o.gratuitTxt); }
        else { pts -= 2; raisons.push("Pas d'offre gratuite confirmée"); }
      } else if (rep.budget === "20") {
        const bas = o.prix.some(p => /^(0|[0-9],|1[0-9],|20 )/.test(p[1]) || /gratuit/.test(p[1]));
        if (bas) { pts += 1; raisons.push("Une formule à 20 $ ou moins existe"); } else { pts -= 1; raisons.push("Formules payantes au-dessus de 20 $"); }
      }
      if (rep.donnees === "sensibles") {
        if (o.controle) { pts += 2; raisons.push("Contrôle des données : " + o.donnees); }
        else { pts -= 1; raisons.push("Politique de données non relevée : lis-la avant d'y mettre du sensible"); }
      }
      if (Number(rep.niveau) < o.niveau) { pts -= 2; raisons.push("Demande plus d'aisance technique que la tienne"); }
      else if (Number(rep.niveau) >= o.niveau) { pts += 0.5; }
      if (o.fiabilite === "partielle") { pts -= 1; raisons.push("Peu d'informations officielles : prudence"); }
      out.push({ o, pts, raisons });
    });
    return out.sort((a, b) => b.pts - a.pts || a.o.nom.localeCompare(b.o.nom, "fr"));
  };
})(typeof window !== "undefined" ? window : globalThis);

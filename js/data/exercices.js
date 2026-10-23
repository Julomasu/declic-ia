/* Exercices partagés de la séance de 30 minutes (les scénarios personnalisés sont dans profils.js). */
(function (g) {
  const D = (g.D = g.D || {});

  D.session = [
    { id: "bonmauvais", titre: "Bon ou mauvais prompt ?", min: 2, type: "choix" },
    { id: "blocs", titre: "Construis ton prompt par blocs", min: 5, type: "blocs" },
    { id: "halluc", titre: "Repère l'hallucination", min: 4, type: "halluc" },
    { id: "vraifaux", titre: "Vrai ou faux ?", min: 3, type: "qcm" },
    { id: "conversation", titre: "Simule une vraie conversation", min: 6, type: "conversation" },
    { id: "chrono", titre: "Défi chrono : coller ou pas ?", min: 3, type: "chrono" },
    { id: "outilrapide", titre: "Quel type d'outil ?", min: 3, type: "qcm" }
  ];

  D.blocsNoms = [
    ["role", "Rôle", "Qui l'IA doit être"],
    ["contexte", "Contexte", "La situation, pour qui, pourquoi"],
    ["tache", "Tâche", "Ce qu'elle doit faire"],
    ["format", "Format", "La forme de la réponse"],
    ["contraintes", "Contraintes", "Ce qu'il faut éviter ou respecter"]
  ];

  D.halluc = {
    question: "Tu as demandé : « Parle-moi de la tour Eiffel. » Voici la réponse d'une IA. Touche les phrases qui te semblent inventées ou douteuses.",
    phrases: [
      ["La tour Eiffel se trouve à Paris, sur le Champ-de-Mars.", false, "Exact : l'Exposition universelle de 1889 occupait le Champ-de-Mars."],
      ["Elle a ouvert au public en 1889, pour l'Exposition universelle.", false, "Exact : ouverture au public le 15 mai 1889."],
      ["Selon une étude de l'Université de Lyon (2023, Pr Martin Delorme), 87 % des visiteurs la trouvent « moins belle que prévu ».", true, "Piège : chiffre très précis, source impossible à retrouver. Les IA inventent des études qui ont l'air vraies. Cherche l'étude avant de la citer."],
      ["Sa structure est entièrement en béton armé.", true, "Faux : c'est une tour métallique (fer et acier selon le site officiel)."],
      ["Pour réserver, va sur www.tour-eiffel-billets-officiel.fr/promo.", true, "Piège : lien inventé. Ne clique jamais sur un lien donné par une IA sans vérifier : passe par le site officiel de la tour Eiffel."]
    ],
    source: ["Tour Eiffel officielle : 15 choses essentielles à savoir", "https://www.toureiffel.paris/fr/actualites/histoire-et-culture/15-choses-essentielles-savoir-sur-la-tour-eiffel"]
  };

  /* Questions à réponses fermées. Chaque entrée : [énoncé, bonne réponse (index), explication, source (optionnel)] */
  D.qcm = {
    vraifaux: {
      options: ["Vrai", "Faux"],
      items: [
        ["Une IA comprend ce que tu dis comme un être humain.", 1, "Faux. Elle prédit les mots les plus probables à la suite de ton texte. Elle peut très bien sonner juste et se tromper."],
        ["Une IA peut inventer une source ou une citation qui n'existe pas.", 0, "Vrai. C'est ce qu'on appelle une hallucination. Vérifie toujours une source avant de la citer."],
        ["Plus ton prompt est précis, plus la réponse est utile en général.", 0, "Vrai. Qui, pour qui, quel format, quelles limites : tout ce que tu précises, l'IA n'a plus à le deviner."],
        ["Tu peux coller un contrat client avec les noms dans n'importe quelle IA gratuite.", 1, "Faux. Remplace les noms par des [CRÉNEAUX] ou utilise un outil validé par ton employeur. Voir la page « Ne colle pas ça »."],
        ["Si l'IA répond avec assurance, c'est qu'elle a raison.", 1, "Faux. Le ton sûr n'est pas une preuve. Demande-lui ses sources et vérifie les chiffres importants."],
        ["Il faut forcément payer pour essayer une IA sérieuse.", 1, "Faux. ChatGPT, Claude et Gemini ont une offre gratuite (pages officielles de tarifs consultées le 23 octobre 2026). Elle est plus limitée, c'est tout.", "https://claude.com/pricing"]
      ]
    },
    outilrapide: {
      options: ["Assistant généraliste", "Recherche avec sources", "Automatisation", "Création de site ou de code"],
      items: [
        ["Tu veux écrire un mot pour l'anniversaire d'un proche.", 0, "Un assistant généraliste (ChatGPT, Claude, Gemini, Vibe de Mistral, Copilot…) suffit."],
        ["Tu veux un résumé d'un sujet d'actualité, avec les liens des sources.", 1, "Un outil pensé pour la recherche sourcée, comme Perplexity, ou le mode recherche d'un assistant. Clique toujours sur les sources."],
        ["Tu veux que chaque lundi, un résumé de tes factures arrive tout seul par mail.", 2, "Une automatisation : tâche planifiée dans un assistant, ou outil comme Zapier, Make ou n8n. C'est le palier 3."],
        ["Tu veux un petit site de présentation sans savoir coder.", 3, "Un outil de création comme v0 de Vercel, ou un assistant qui sait générer du code. Tu vois le résultat tout de suite."]
      ]
    }
  };

  D.chrono = {
    secondes: 45,
    consigne: "Tu as 45 secondes. Pour chaque élément, dis si tu peux le coller dans une IA grand public.",
    options: ["Je peux coller", "Je ne colle pas"],
    items: [
      ["Ton numéro de sécurité sociale", 1, "Donnée très sensible : jamais."],
      ["Un article de Wikipédia à résumer", 0, "Contenu public : pas de risque pour tes données."],
      ["Le mot de passe de ta box", 1, "Les mots de passe ne se partagent avec aucun outil."],
      ["Un e-mail client avec son nom et son adresse", 1, "Données de tiers. Anonymise d'abord."],
      ["Le même e-mail, avec [CLIENT] et [ADRESSE] à la place", 0, "Anonymisé : c'est la bonne méthode."],
      ["Ta question sur une recette de crêpes", 0, "Rien de sensible."],
      ["Ton ordonnance avec ton nom", 1, "Donnée de santé : à ne pas coller."],
      ["Une clé d'accès (API) de ton projet", 1, "Un secret : celui qui la voit peut l'utiliser à tes frais."]
    ]
  };

  D.ressources = {
    cnil: ["CNIL : les fiches pratiques IA", "https://www.cnil.fr/fr/les-fiches-pratiques-ia"],
    cnilPlan: ["CNIL : le plan d'action sur l'intelligence artificielle", "https://www.cnil.fr/fr/intelligence-artificielle-le-plan-daction-de-la-cnil"],
    owasp: ["OWASP : LLM01 Injection de prompt", "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"],
    juge: ["Zheng et al., 2023 : LLM-as-a-Judge (arXiv)", "https://arxiv.org/abs/2306.05685"]
  };
})(typeof window !== "undefined" ? window : globalThis);

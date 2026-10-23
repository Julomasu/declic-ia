/* Actus et mises à jour. Chaque entrée : date de CONSTAT (jour où la page officielle a été lue), source officielle,
   explication simple, « ce que ça change pour toi ». `fiabilite` : "officielle" (page de l'éditeur lue) ou "partielle"
   (extrait de moteur de recherche ou source tierce, à confirmer). La procédure de mise à jour est dans docs/MISE-A-JOUR.md. */
(function (g) {
  const D = (g.D = g.D || {});
  D.actus = [
    { id: "mistral-vibe", date: "2026-10-23", sujet: "Mistral", titre: "Le Chat de Mistral s'appelle maintenant Vibe",
      resume: "Sur le site officiel, l'assistant est présenté comme « Vibe by Mistral » et décrit comme « formerly Le Chat ». La page des prix parle de Mistral Vibe.",
      change: "Si tu cherches « Le Chat », cherche aussi « Vibe ». Les liens et tutoriels anciens peuvent employer l'ancien nom.",
      source: ["Mistral : page de l'assistant", "https://chat.mistral.ai/"], fiabilite: "officielle" },
    { id: "chatgpt-go", date: "2026-10-23", sujet: "ChatGPT", titre: "ChatGPT : une formule Go à 8 $ par mois, qui peut inclure des publicités",
      resume: "La page officielle des tarifs affiche Free (0 $), Go (8 $), Plus (20 $) et Pro (à partir de 100 $). Pour Go, elle précise : « This plan may include ads ».",
      change: "Entre le gratuit et Plus, il existe un palier intermédiaire. Si tu l'évalues, sache qu'il peut afficher des pubs.",
      source: ["OpenAI : tarifs ChatGPT", "https://openai.com/chatgpt/pricing/"], fiabilite: "officielle" },
    { id: "claude-free", date: "2026-10-23", sujet: "Claude", titre: "Claude gratuit : recherche web, fichiers, code et connexion d'applications",
      resume: "La page des offres indique que l'offre Free inclut la recherche web, la création de fichiers, l'exécution de code, la mémoire entre conversations et la connexion d'applications. Pro ajoute notamment la planification de tâches et Claude Code.",
      change: "Pour essayer l'automatisation légère, tu n'as pas besoin de payer tout de suite. Les tâches planifiées demandent une offre payante.",
      source: ["Claude : offres et tarifs", "https://claude.com/pricing"], fiabilite: "officielle" },
    { id: "gemini-offres", date: "2026-10-23", sujet: "Gemini", titre: "Gemini : quatre formules, de gratuit à 99,99 $ par mois",
      resume: "La page des abonnements liste Gratuit, Google AI Plus (4,99 $), Google AI Pro (19,99 $) et Google AI Ultra (à partir de 99,99 $). L'offre gratuite inclut déjà la recherche approfondie et la génération d'images.",
      change: "Tu peux tester Gemini sans payer avec un compte Google. Plus à 4,99 $ est le palier le moins cher des assistants relevés ici.",
      source: ["Google : abonnements Gemini", "https://gemini.google/subscriptions/"], fiabilite: "officielle" },
    { id: "cursor-paliers", date: "2026-10-23", sujet: "Cursor", titre: "Cursor : cinq niveaux d'usage, de 8 à 200 $ par mois",
      resume: "La page des tarifs liste Free, Plus (8 $), Premium (30 $), Super (100 $) et Ultra (200 $), avec des quantités d'usage multipliées par rapport à Plus (4x, 15x, 50x).",
      change: "Commence par Free ou Plus pour évaluer. Les gros paliers ne servent que si tu codes tous les jours avec un agent.",
      source: ["Cursor : tarifs", "https://cursor.com/pricing"], fiabilite: "officielle" },
    { id: "instinct", date: "2026-10-23", sujet: "Instinct", titre: "Instinct : un assistant à qui l'on écrit ou téléphone, qui agit à ta place",
      resume: "Le site officiel présente un assistant personnel qu'on contacte par texte ou par appel, et qui peut utiliser un téléphone et un ordinateur comme toi (commander, réserver). Des articles tiers parlent d'un accès sur invitation ; le site officiel consulté ne le dit pas.",
      change: "Les assistants qui agissent demandent beaucoup d'accès. Avant d'essayer, lis les conditions et commence par une tâche sans enjeu.",
      source: ["Instinct : site officiel", "https://instinct.com/"], fiabilite: "partielle" },
    { id: "cnil-agentique", date: "2026-07-20", dateType: "publication", sujet: "Vie privée", titre: "La CNIL publie une note sur l'IA agentique et les données personnelles",
      resume: "Un extrait de la page de la CNIL indique que le passage de l'IA générative à l'IA agentique marque un changement d'échelle qui renouvelle et amplifie les risques pour les données personnelles. La page était en maintenance le 23 octobre 2026 : le détail de la note n'a pas pu être relu.",
      change: "Plus un assistant agit seul, plus il faut limiter ses accès et les données qu'on lui confie. Lis la note complète quand la page est de nouveau disponible.",
      source: ["CNIL : IA agentique et données personnelles", "https://www.cnil.fr/fr/ia-agentique-cnil-cianum-note"], fiabilite: "partielle" }
  ];
  D.sujetsActus = ["Tous", "ChatGPT", "Claude", "Gemini", "Mistral", "Cursor", "Instinct", "Vie privée"];
})(typeof window !== "undefined" ? window : globalThis);

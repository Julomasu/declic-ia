/* Prompts, données à ne pas coller, kit entreprise, actus, sources. */
(function (g) {
  const P = g.P, D = g.D, e = P.e;

  P.carteTexte = (id, titre, txt, astuce, etiq) => `
    <article class="carte-prompt-lib"><p class="surtitre">${e(etiq || "")}</p><h3>${e(titre)}</h3>
      <pre class="prompt-bloc" id="${e(id)}" data-texte="${e(txt)}">${P.surligne(txt)}</pre>
      ${astuce ? `<p class="petit">${e(astuce)}</p>` : ""}
      <p class="actions"><button type="button" class="btn" data-copie="${e(id)}">Copier</button></p></article>`;

  P.pages.prompts = el => {
    const f = { q: "", g: P.requete().get("g") || "", c: "", id: P.requete().get("p") || "" };
    const tous = Object.entries(D.categories.usage).map(([k, l]) => ["usage", k, l]).concat(Object.entries(D.categories.metier).map(([k, l]) => ["metier", k, l]));
    const dessine = (garderFocus) => {
      const liste = D.prompts.filter(p => (!f.c || p.cat === f.c) && (!f.q || (p.titre + " " + p.prompt).toLowerCase().includes(f.q.toLowerCase())) && (!f.g || p.profils.includes(f.g)) && (!f.id || p.id === f.id));
      const zone = el.querySelector("#liste-prompts");
      if (zone) { zone.innerHTML = rendu(liste); el.querySelector("#nb").textContent = `${liste.length} prompt${liste.length > 1 ? "s" : ""}`; return; }
      el.innerHTML = `
        ${P.tete("Bibliothèque de prompts", "À copier en un clic. Remplace les [CROCHETS] dans l'outil, pas avant : ne colle jamais de vraies données personnelles. Ils fonctionnent dans n'importe quel assistant.")}
        <div class="filtres">
          <div class="champ"><label for="rech">Chercher</label><input id="rech" type="search" placeholder="mail, révision, facture…" autocomplete="off"></div>
          <div class="champ"><label for="selprof">Pour qui</label><select id="selprof"><option value="">Tous les profils</option>${Object.entries(D.profils).map(([k, p]) => `<option value="${k}" ${f.g === k ? "selected" : ""}>${e(p.nom)}</option>`).join("")}</select></div>
        </div>
        <div class="chips" role="group" aria-label="Catégorie"><button type="button" class="chip" data-c="" aria-pressed="true">Tout</button>${tous.map(([, k, l]) => `<button type="button" class="chip" data-c="${k}" aria-pressed="false">${e(l)}</button>`).join("")}</div>
        <p class="petit" id="nb" role="status"></p>${f.id ? `<p><a class="lien-fleche" href="#/prompts">Voir tous les prompts</a></p>` : ""}
        <div class="liste-prompts" id="liste-prompts"></div>`;
      el.querySelector("#rech").addEventListener("input", ev => { f.q = ev.target.value; dessine(); });
      el.querySelector("#selprof").addEventListener("change", ev => { f.g = ev.target.value; dessine(); });
      el.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => { f.c = b.dataset.c; el.querySelectorAll("[data-c]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); dessine(); }));
      dessine();
    };
    const rendu = liste => liste.length ? liste.map(p => P.carteTexte("pl-" + p.id, p.titre, p.prompt, p.astuce, (D.categories[p.groupe][p.cat]) + (p.niveau ? " · niveau avancé" : ""))).join("") : `<p class="vide">Aucun prompt ne correspond. Essaie un autre mot.</p>`;
    dessine();
  };

  P.pages.donnees = el => {
    const ne = [["Mots de passe, codes, clés d'accès (API)", "Un secret copié peut être utilisé par d'autres."], ["Numéros d'identification (sécurité sociale, pièce d'identité, carte bancaire)", "Aucun besoin pour que l'IA t'aide."], ["Données de santé", "Parmi les plus sensibles : ne les colle pas dans un outil grand public."], ["Informations sur des tiers : clients, élèves, collègues, avec nom ou adresse", "Ce ne sont pas tes données : tu n'as pas le droit de les partager n'importe où."], ["Documents confidentiels de ton entreprise (contrats, chiffres internes, code non public)", "Vérifie d'abord ce que ton entreprise autorise."]];
    const ok = [["Du texte public (articles, lois, notices)", "Aucun risque pour toi."], ["Tes notes anonymisées : [CLIENT], [MONTANT], [DATE]", "La méthode clé : ne colle que la forme, remets les vrais détails après."], ["Des questions générales", "« Comment relancer poliment un retard de paiement ? »"]];
    el.innerHTML = `
      ${P.tete("Ne colle pas ça", "Ce que tu écris dans une IA peut être conservé, relu ou utilisé selon l'outil et ton réglage. Mieux vaut prendre quelques réflexes simples.", "var(--bad)")}
      <section aria-labelledby="t-non"><div class="titre-section"><h2 id="t-non">Ne colle jamais</h2></div>
        <ul class="liste-regles non">${ne.map(([t, d]) => `<li><strong>${e(t)}</strong><span>${e(d)}</span></li>`).join("")}</ul></section>
      <section aria-labelledby="t-ok"><div class="titre-section"><h2 id="t-ok">Tu peux coller</h2></div>
        <ul class="liste-regles oui">${ok.map(([t, d]) => `<li><strong>${e(t)}</strong><span>${e(d)}</span></li>`).join("")}</ul></section>
      <section class="enbref"><h2>4 réflexes</h2><ul>
        <li><strong>Anonymise</strong> : remplace noms, adresses et montants par des [CRÉNEAUX].</li>
        <li><strong>Regarde les réglages</strong> : beaucoup d'outils proposent de refuser que tes conversations servent à entraîner les modèles. Vérifie sur la fiche de l'outil.</li>
        <li><strong>Sépare pro et perso</strong> : n'utilise pas un compte personnel gratuit pour des données d'entreprise.</li>
        <li><strong>Moins d'accès</strong> : un assistant relié à ta messagerie ou à tes fichiers voit tout ce que tu lui ouvres.</li></ul></section>
      <section aria-labelledby="t-def"><div class="titre-section"><h2 id="t-def">Teste-toi en 45 secondes</h2></div><div class="exo" id="exo-hote"></div></section>
      <section class="bloc"><h2>Pour aller plus loin</h2><ul>
        <li>${P.lienExt(D.ressources.cnil[1], D.ressources.cnil[0])}</li>
        <li>${P.lienExt(D.ressources.cnilPlan[1], D.ressources.cnilPlan[0])}</li></ul>
        <p class="petit">Ces pages de la CNIL sont l'autorité française sur les données personnelles. Ce site donne des réflexes, pas un avis juridique. Dernière vérification des liens : ${P.date("2026-10-23")} (résultats de recherche ; la page de la note sur l'IA agentique était en maintenance).</p></section>`;
    P.exo.chrono(el.querySelector("#exo-hote"), D.chrono, () => { el.querySelector("#exo-hote").insertAdjacentHTML("beforeend", `<p class="petit">Bravo, tu peux recommencer en rechargeant la page.</p>`); });
  };

  P.pages.entreprise = el => {
    const charteTxt = D.charte.map(([t, c], k) => `${k + 1}. ${t}\n${c}`).join("\n\n");
    el.innerHTML = `
      ${P.tete("Kit entreprise", "Pour déployer l'IA sans mauvaise surprise : une charte à adapter, une check-list à cocher, des cas d'usage par service. Ce sont des modèles, pas un avis juridique : fais-les valider par ta personne chargée des données ou un·e juriste.", "var(--t-travail)")}
      <nav class="chips" aria-label="Sections"><a class="chip" href="#charte" data-ancre="charte">Charte d'usage</a><a class="chip" href="#check" data-ancre="check">Check-list</a><a class="chip" href="#cas" data-ancre="cas">Cas d'usage</a></nav>
      <section id="charte" aria-labelledby="t-charte"><div class="titre-section"><h2 id="t-charte">Modèle de charte d'usage</h2><button type="button" class="btn" data-copie="charte-txt">Copier la charte</button></div>
        <pre class="prompt-bloc charte" id="charte-txt" data-texte="${e(charteTxt)}">${P.surligne(charteTxt)}</pre></section>
      <section id="check" aria-labelledby="t-check"><div class="titre-section"><h2 id="t-check">Check-list de déploiement</h2></div>
        ${D.checklist.map(([titre, items], g1) => `<fieldset class="fq"><legend>${e(titre)}</legend>${items.map((t, k) => { const id = `ck-${g1}-${k}`; return `<label class="ligne-case" for="${id}"><input type="checkbox" id="${id}" ${P.etat.checklist[id] ? "checked" : ""}> ${e(t)}</label>`; }).join("")}</fieldset>`).join("")}</section>
      <section id="cas" aria-labelledby="t-cas"><div class="titre-section"><h2 id="t-cas">Cas d'usage par service</h2></div>
        <div class="liste-guides">${D.cas.map(c => `<div class="guide-carte"><h3>${e(c.service)}</h3>${c.cas.map(([t, pid, risque]) => `<p><a href="#/prompts?p=${pid}">${e(t)}</a><br><span class="petit">Vigilance : ${e(risque)}</span></p>`).join("")}</div>`).join("")}</div></section>
      <p class="actions"><button type="button" class="btn btn-ligne" onclick="window.print()">Imprimer</button></p>`;
    el.querySelectorAll("#check input").forEach(i => i.addEventListener("change", () => { P.etat.checklist[i.id] = i.checked; P.sauve(); }));
    el.querySelectorAll("[data-ancre]").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); document.getElementById(a.dataset.ancre).scrollIntoView({ behavior: "smooth" }); }));
  };

  P.pages.actus = el => {
    let sujet = "Tous";
    const dessine = () => {
      const liste = D.actus.filter(a => sujet === "Tous" || a.sujet === sujet).sort((a, b) => b.date.localeCompare(a.date));
      el.innerHTML = `
        ${P.tete("Actus et mises à jour des IA", "Ce qui change, expliqué simplement. Chaque actu a une date, une source officielle et un « ce que ça change pour toi ».")}
        <div class="alerte info"><strong>Comment lire les dates</strong><span>« Constat » = jour où la page officielle a été lue. Quand la date d'annonce est connue, on l'écrit « publiée le ». Les actus « à confirmer » reposent sur un extrait ou une source tierce.</span></div>
        <div class="chips" role="group" aria-label="Filtrer par sujet">${D.sujetsActus.map(s => `<button type="button" class="chip" data-s="${e(s)}" aria-pressed="${s === sujet}">${e(s)}</button>`).join("")}</div>
        <div class="actus">${liste.map(a => `
          <article class="actu"><p class="meta"><span>${a.dateType === "publication" ? "Publiée le" : "Constat du"} ${P.date(a.date)}</span><span>${e(a.sujet)}</span>${a.fiabilite === "partielle" ? `<span class="etiq">À confirmer</span>` : `<span class="etiq ok">Source officielle lue</span>`}</p>
            <h2>${e(a.titre)}</h2><p>${e(a.resume)}</p>
            <div class="change"><b>Ce que ça change pour toi</b><p>${e(a.change)}</p></div>
            <p class="petit">Source : ${P.lienExt(a.source[1], a.source[0])}</p></article>`).join("") || `<p class="vide">Aucune actu pour ce sujet.</p>`}</div>
        <section class="bloc"><h2>Comment cette page reste à jour</h2>
          <p>Chaque semaine, un rappel automatique ouvre une demande de vérification dans le dépôt du projet : on relit les pages officielles des outils (prix, offres, noms), on ajoute les actus utiles et on retire ou date celles qui ont vieilli. Rien n'est publié sans relecture humaine. La procédure est décrite dans le dépôt du projet : ${P.lienExt(P.CONFIG.depot + "/blob/main/docs/MISE-A-JOUR.md", "docs/MISE-A-JOUR.md")}.</p></section>`;
      el.querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => { sujet = b.dataset.s; dessine(); el.querySelector(`[data-s="${sujet}"]`)?.focus(); }));
    };
    dessine();
  };

  P.pages.sources = el => {
    const sources = [];
    D.outils.forEach(o => sources.push([o.nom.split(" (")[0] + " : tarifs et offres", o.url_prix, o.verifie]));
    sources.push([D.halluc.source[0], D.halluc.source[1], "2026-10-23"]);
    Object.values(D.ressources).forEach(r => sources.push([r[0], r[1], "2026-10-23"]));
    D.actus.forEach(a => sources.push([a.source[0], a.source[1], a.date]));
    const uniques = []; const vus = new Set(); sources.forEach(s => { if (!vus.has(s[1])) { vus.add(s[1]); uniques.push(s); } });
    el.innerHTML = `
      ${P.tete("Sources et vérifications", "Règle d'or : chaque chiffre, prix, plafond ou règle vient d'une page officielle lue pendant le travail, avec sa date.")}
      <section class="bloc"><h2>Ce qui est vérifié</h2><ul>
        <li>Prix, offres gratuites et fonctions des outils : pages officielles, lues le ${P.date("2026-10-23")}.</li>
        <li>Nom actuel de l'assistant de Mistral (« Vibe ») : page officielle.</li>
        <li>Faits de l'exercice sur la tour Eiffel : site officiel de la tour Eiffel.</li>
        <li>Biais des modèles juges : article de recherche (arXiv).</li>
        <li>Mesures de prévention de l'injection de prompt : OWASP.</li></ul></section>
      <section class="bloc"><h2>Ce qui n'est pas (encore) vérifié</h2><ul>
        <li>Politiques de données de plusieurs outils : non relevées, signalées comme telles sur chaque fiche.</li>
        <li>Prix en dollars des pages américaines : ils peuvent différer en France.</li>
        <li>Instinct : le site officiel est très peu détaillé ; l'accès sur invitation vient d'articles tiers.</li>
        <li>Note de la CNIL sur l'IA agentique : page en maintenance, seul un extrait a été lu.</li>
        <li>Outils de niche (image, vidéo, voix, notes et réunions) : pas encore vérifiés donc pas encore listés.</li>
        <li>Les conseils de méthode (comment écrire un prompt) sont des pratiques courantes, pas des faits chiffrés.</li></ul></section>
      <section><div class="titre-section"><h2>Liens consultés</h2></div>
        <ul class="liste-sources">${uniques.map(s => `<li>${P.lienExt(s[1], s[0])} <span class="petit">· ${P.date(s[2])}</span></li>`).join("")}</ul></section>`;
  };
})(window);

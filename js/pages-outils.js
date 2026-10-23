/* Quelle IA est faite pour moi ? comparateur, fiches d'outils et « choisis ton outil ». */
(function (g) {
  const P = g.P, D = g.D, e = P.e;
  const lignes = (o) => `
    <dl class="fiche">
      <dt>Éditeur</dt><dd>${e(o.editeur)}</dd>
      <dt>Offre gratuite</dt><dd>${e(o.gratuit === "oui" ? "Oui" : o.gratuit === "non confirmé" ? "Non confirmée" : "Inconnue")} : ${e(o.gratuitTxt)}</dd>
      <dt>Prix</dt><dd><ul>${o.prix.map(p => `<li><b>${e(p[0])}</b> : ${e(p[1])}</li>`).join("")}</ul></dd>
      <dt>Points forts</dt><dd><ul>${o.forts.map(x => `<li>${e(x)}</li>`).join("")}</ul></dd>
      <dt>Limites</dt><dd><ul>${o.limites.map(x => `<li>${e(x)}</li>`).join("")}</ul></dd>
      <dt>Tes données</dt><dd>${e(o.donnees)}</dd>
    </dl>`;

  P.pages.quelleIa = el => {
    const rep = Object.assign({}, P.etat.questionnaire || {});
    const choisis = new Set((P.requete().get("vs") || "").split(",").filter(id => D.outils.some(o => o.id === id)).slice(0, 3));
    const complet = () => D.questionnaire.every(q => rep[q.id]);
    const dessine = () => {
      const res = complet() ? D.recommander(rep) : null;
      el.innerHTML = `
        ${P.tete("Quelle IA est faite pour moi ?", "Quatre questions. Le résultat dépend de ton besoin, pas d'une marque. Chaque fait est relevé sur le site officiel, avec sa date.")}
        <section class="questionnaire" aria-label="Questionnaire">
          ${D.questionnaire.map(q => `<fieldset class="fq"><legend>${e(q.q)}</legend><div class="chips">${q.r.map(([v, l]) => `<button type="button" class="chip" data-q="${q.id}" data-v="${e(v)}" aria-pressed="${rep[q.id] === v}">${e(l)}</button>`).join("")}</div></fieldset>`).join("")}
        </section>
        <section aria-live="polite" aria-labelledby="t-res">
          <div class="titre-section"><h2 id="t-res">${res ? "Ce qui correspond" : "Ton résultat"}</h2></div>
          ${res ? (res.length ? `<div class="liste-guides">${res.map(r => P.carteOutil(r.o, r.raisons)).join("")}</div>` : `<p class="vide">Aucun outil relevé ne couvre ce besoin. Regarde « Choisis ton outil ».</p>`) : `<p class="vide">Réponds aux 4 questions pour voir les outils adaptés.</p>`}
        </section>
        <section aria-labelledby="t-comp">
          <div class="titre-section"><h2 id="t-comp">Comparateur</h2><span class="petit">Coche jusqu'à 3 outils.</span></div>
          <div class="chips" role="group" aria-label="Outils à comparer">${D.outils.map(o => `<button type="button" class="chip" data-vs="${o.id}" aria-pressed="${choisis.has(o.id)}">${e(o.nom.split(" (")[0])}</button>`).join("")}</div>
          ${choisis.size ? `<div class="comparaison">${[...choisis].map(id => { const o = D.outils.find(x => x.id === id); return `<article class="carte-outil large"><h3><a href="#/outil/${o.id}">${e(o.nom)}</a></h3>${lignes(o)}<p class="petit">Vérifié le ${P.date(o.verifie)} · ${P.lienExt(o.url_prix, "Page officielle")}</p></article>`; }).join("")}</div>` : `<p class="vide">Choisis au moins deux outils pour les voir côte à côte.</p>`}
        </section>
        <section class="alerte info"><strong>Comment lire ce comparateur</strong><span>Aucun lien d'affiliation, aucun classement sponsorisé : les résultats ne dépendent que de tes réponses. Les prix sont ceux des pages américaines, en dollars. Les offres changent vite : la date de vérification est toujours affichée. Un outil absent n'est pas jugé mauvais : il n'a simplement pas encore été vérifié.</span></section>`;
      el.querySelectorAll("[data-q]").forEach(b => b.addEventListener("click", () => { rep[b.dataset.q] = b.dataset.v; P.etat.questionnaire = rep; P.sauve(); dessine(); el.querySelector(`[data-q="${b.dataset.q}"][data-v="${b.dataset.v}"]`)?.focus(); }));
      el.querySelectorAll("[data-vs]").forEach(b => b.addEventListener("click", () => { const id = b.dataset.vs; if (choisis.has(id)) choisis.delete(id); else if (choisis.size < 3) choisis.add(id); else P.toast("3 outils au maximum."); dessine(); el.querySelector(`[data-vs="${id}"]`)?.focus(); }));
    };
    dessine();
  };

  P.pages.outil = (el, { id }) => {
    const o = D.outils.find(x => x.id === id); if (!o) return P.pages.introuvable(el);
    const recettes = D.recettes.filter(r => r.outils.some(x => x[0] === id));
    el.innerHTML = `
      <section class="tete-theme"><div class="barre-theme"></div><p class="fil"><a href="#/quelle-ia">Quelle IA ?</a> · ${e(o.famille)}</p><h1>${e(o.nom)}</h1>
        <p class="chapo">${e(o.editeur)}. Fiche relevée le ${P.date(o.verifie)} sur le site officiel.</p></section>
      ${o.fiabilite ? `<div class="alerte warn"><strong>Informations partielles.</strong><span>Peu de choses sont publiées par l'éditeur. Ce qui n'est pas confirmé est signalé.</span></div>` : ""}
      ${lignes(o)}
      <p class="petit">Prix en dollars, relevés sur les pages américaines : ils peuvent différer en France. ${P.lienExt(o.url_prix, "Page officielle des prix")} · ${P.lienExt(o.url, "Site de l'outil")}</p>
      ${recettes.length ? `<section><div class="titre-section"><h2>Recettes avec cet outil</h2></div><div class="liste-guides">${recettes.map(r => `<a class="guide-carte" href="#/choisis?b=${r.besoin}&r=${r.id}"><h3>${e(r.titre)}</h3><p>${e(D.besoins[r.besoin])}</p></a>`).join("")}</div></section>` : ""}
      <p class="actions"><a class="btn" href="#/quelle-ia?vs=${o.id}">Comparer</a><a class="btn btn-ligne" href="#/quelle-ia">Retour au questionnaire</a></p>`;
  };

  P.pages.choisis = el => {
    let filtre = P.requete().get("b") || "";
    const dessine = () => {
      const liste = D.recettes.filter(r => !filtre || r.besoin === filtre);
      el.innerHTML = `
        ${P.tete("Choisis ton outil", "Un besoin, l'outil et la fonction qui conviennent, puis la recette. Les étapes décrivent des actions : les menus changent, la documentation officielle fait foi.")}
        <div class="chips" role="group" aria-label="Filtrer par besoin"><button type="button" class="chip" data-b="" aria-pressed="${!filtre}">Tous</button>${Object.entries(D.besoins).map(([k, l]) => `<button type="button" class="chip" data-b="${k}" aria-pressed="${filtre === k}">${e(l)}</button>`).join("")}</div>
        <div class="recettes">${liste.map(r => `
          <details class="recette" id="${r.id}" ${P.requete().get("r") === r.id ? "open" : ""}>
            <summary><span class="surtitre">Palier ${r.palier} · ${e(D.besoins[r.besoin])}</span><h3>${e(r.titre)}</h3></summary>
            <h4>Quel outil, quelle fonction</h4>
            <ul class="outils-reco">${r.outils.map(([id, f]) => { const o = D.outils.find(x => x.id === id); return `<li><a href="#/outil/${id}"><b>${e(o.nom.split(" (")[0])}</b></a> : ${e(f)}</li>`; }).join("")}</ul>
            <h4>La recette</h4>
            <ol class="etapes-simples">${r.etapes.map(x => `<li>${e(x)}</li>`).join("")}</ol>
            <div class="alerte warn"><strong>Piège</strong><span>${e(r.piege)}</span></div>
          </details>`).join("")}</div>
        <p class="petit">Les fonctions citées viennent des pages de tarifs et d'offres officielles consultées le ${P.date("2026-10-23")}. Elles dépendent de ton offre : voir la fiche de chaque outil.</p>`;
      el.querySelectorAll("[data-b]").forEach(b => b.addEventListener("click", () => { filtre = b.dataset.b; dessine(); el.querySelector(`[data-b="${filtre}"]`)?.focus(); }));
    };
    dessine();
  };
})(window);

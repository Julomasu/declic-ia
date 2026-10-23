/* Les quatre paliers et leurs exercices. */
(function (g) {
  const P = g.P, D = g.D, e = P.e;
  const fait = id => P.etat.paliers[id];

  P.pages.paliers = el => {
    el.innerHTML = `${P.tete("Les 4 paliers", "Après la séance de 30 minutes, monte à ton rythme : de savoir demander jusqu'à construire et déployer. Même un·e expert·e y apprend quelque chose.")}
      <div class="tuiles">${D.paliers.map(p => {
        const n = p.exos.filter(fait).length;
        return `<a class="tuile" href="#/palier/${p.n}" style="--c:${p.couleur}"><span class="fond-chiffre" aria-hidden="true">${p.n}</span>
          <div><p class="surtitre" style="color:#fff;opacity:.85">Palier ${p.n} · ${p.min} min</p><h2>${e(p.titre)}</h2><p>${e(p.promesse)}</p></div>
          <div class="bas"><span>${n} / ${p.exos.length} exercices</span><span class="fleche" aria-hidden="true">→</span></div></a>`; }).join("")}</div>`;
  };

  P.pages.palier = (el, { n }) => {
    const p = D.paliers[Number(n) - 1]; if (!p) return P.pages.introuvable(el);
    const recettes = D.recettes.filter(r => r.palier === p.n);
    el.innerHTML = `
      <section class="tete-theme" style="--c:${p.couleur}"><div class="barre-theme"></div><p class="fil"><a href="#/paliers">Paliers</a> · palier ${p.n} sur 4 · ${p.min} min</p><h1>${e(p.titre)}</h1><p class="chapo">${e(p.promesse)}</p></section>
      <section aria-labelledby="t-cartes"><div class="titre-section"><h2 id="t-cartes">L'essentiel</h2></div>
        <div class="liste-guides">${p.cartes.map(([t, d]) => `<div class="guide-carte"><h3>${e(t)}</h3><p>${e(d)}</p></div>`).join("")}</div></section>
      <section aria-labelledby="t-exos"><div class="titre-section"><h2 id="t-exos">Exercices</h2></div>
        <ol class="etapes liste-seance">${p.exos.map((id, k) => { const x = D.exosPalier[id], f = fait(id);
          return `<li class="etape ${f ? "fait" : ""}"><span class="num-etape" aria-hidden="true">${String(k + 1).padStart(2, "0")}</span><div class="etape-corps"><h3><a href="#/exo/${id}">${e(x.titre)}</a></h3><p class="petit">${f ? `Fait · ${f.pts}/${f.max}` : "À faire"}</p></div></li>`; }).join("")}</ol></section>
      <section class="enbref"><h2>Pour aller plus loin, même si tu es expert·e</h2><ul><li>${e(p.avance)}</li></ul></section>
      ${recettes.length ? `<section><div class="titre-section"><h2>Recettes de ce palier</h2><a class="lien-fleche" href="#/choisis">Toutes les recettes</a></div><div class="liste-guides">${recettes.map(r => `<a class="guide-carte" href="#/choisis?b=${r.besoin}&r=${r.id}"><h3>${e(r.titre)}</h3><p>${e(D.besoins[r.besoin])}</p></a>`).join("")}</div></section>` : ""}
      <p class="actions">${p.n > 1 ? `<a class="btn btn-ligne" href="#/palier/${p.n - 1}">Palier précédent</a>` : ""}${p.n < 4 ? `<a class="btn" href="#/palier/${p.n + 1}">Palier suivant</a>` : ""}</p>`;
  };

  P.pages.exoPalier = (el, { id }) => {
    const x = D.exosPalier[id]; if (!x) return P.pages.introuvable(el);
    const p = D.paliers.find(pp => pp.exos.includes(id));
    el.innerHTML = `
      <section class="tete-theme" style="--c:${p.couleur}"><div class="barre-theme"></div><p class="fil"><a href="#/palier/${p.n}">Palier ${p.n} · ${e(p.titre)}</a></p><h1>${e(x.titre)}</h1>${x.consigne ? `<p class="chapo">${e(x.consigne)}</p>` : ""}</section>
      <section class="exo" id="exo-hote" aria-live="polite"></section>`;
    const hote = el.querySelector("#exo-hote");
    const suivant = p.exos[p.exos.indexOf(id) + 1];
    const fini = (pts, max) => { P.etat.paliers[id] = { pts, max }; P.sauve(); location.hash = suivant ? "#/exo/" + suivant : "#/palier/" + p.n; };
    if (x.type === "qcm") P.exo.question(hote, x, fini);
    else if (x.type === "tri") P.exo.depuisItems(hote, { items: x.items, options: x.bins }, fini);
    else if (x.type === "ordre") P.exo.ordre(hote, x, fini);
    else if (x.type === "cout") P.exo.cout(hote, x, fini);
  };
})(window);

/* Accueil et test d'entrée. */
(function (g) {
  const P = g.P, D = g.D, e = P.e;
  P.tete = (titre, chapo, couleur) => `<section class="tete-theme" style="--c:${couleur || "var(--accent)"}"><div class="barre-theme"></div><h1>${titre}</h1>${chapo ? `<p class="chapo">${chapo}</p>` : ""}</section>`;
  P.minutesTotal = () => D.session.reduce((s, x) => s + x.min, 0);
  P.faits = () => D.session.filter(x => P.etat.seance.fait[x.id]).length;

  P.pages.accueil = el => {
    const prof = P.profil(), faits = P.faits(), total = D.session.length;
    const cta = !prof ? `<a class="btn btn-signal" href="#/test">Fais le test de 2 minutes</a>`
      : faits >= total ? `<a class="btn btn-signal" href="#/resultat">Revoir mes prompts</a>`
      : `<a class="btn btn-signal" href="#/seance">${faits ? "Reprendre ma séance" : "Commencer ma séance"}</a>`;
    el.innerHTML = `
      <section class="hero plein"><div class="cadre">
        <p class="surtitre">Formation gratuite à l'IA</p>
        <h1>Le déclic en <em>30 minutes</em></h1>
        <p class="chapo">Des exercices, pas des cours. À la fin, tu sais quelle IA ouvrir et quoi lui demander. Sans compte, sans pub, sans traceur.</p>
        <div class="actions">${cta}<a class="btn btn-ligne" href="#/quelle-ia">Quelle IA pour moi ?</a></div>
        ${prof ? `<p class="petit">Ton parcours : <strong>${e(prof.nom)}</strong> · <a href="#/test">changer</a></p>` : ""}
      </div></section>

      <section aria-labelledby="t-seance">
        <div class="titre-section"><h2 id="t-seance">Ta séance, étape par étape</h2><span class="petit">${P.minutesTotal()} minutes d'exercices + tes prompts à copier</span></div>
        <ol class="frise">${D.session.map((s, k) => `<li class="${P.etat.seance.fait[s.id] ? "fait" : ""}"><a href="#/seance/${s.id}"><span class="num">${String(k + 1).padStart(2, "0")}</span><span class="nom">${e(s.titre)}</span><span class="petit">${s.min} min${P.etat.seance.fait[s.id] ? " · fait" : ""}</span></a></li>`).join("")}</ol>
      </section>

      <section aria-labelledby="t-paliers">
        <div class="titre-section"><h2 id="t-paliers">Ensuite, monte d'un palier</h2><a class="lien-fleche" href="#/paliers">Voir les 4 paliers</a></div>
        <div class="tuiles">${D.paliers.map(p => `
          <a class="tuile" href="#/palier/${p.n}" style="--c:${p.couleur}"><span class="fond-chiffre" aria-hidden="true">${p.n}</span>
            <div><p class="surtitre" style="color:#fff;opacity:.85">Palier ${p.n}</p><h2>${e(p.titre)}</h2><p>${e(p.promesse)}</p></div>
            <div class="bas"><span>${p.min} min</span><span class="fleche" aria-hidden="true">→</span></div></a>`).join("")}</div>
      </section>

      <section aria-labelledby="t-outils">
        <div class="titre-section"><h2 id="t-outils">Tout pour te lancer</h2></div>
        <div class="liste-guides">
          ${[["#/quelle-ia", "Quelle IA pour moi ?", "4 questions, des outils comparés honnêtement : points forts, limites, prix, données."],
             ["#/prompts", "Prompts à copier", "Par usage et par métier. Un clic, tu colles dans l'outil de ton choix."],
             ["#/donnees", "Ne colle pas ça", "Ce qu'il ne faut jamais mettre dans une IA, et comment anonymiser."],
             ["#/choisis", "Choisis ton outil", "Un besoin, l'outil et la fonction qui conviennent, la recette pas à pas."],
             ["#/entreprise", "Kit entreprise", "Charte d'usage, check-list de déploiement, cas d'usage par service."],
             ["#/actus", "Actus des IA", "Ce qui change, daté, sourcé, expliqué simplement."]]
            .map(([h, t, d]) => `<a class="guide-carte" href="${h}"><h3>${t}</h3><p>${d}</p></a>`).join("")}
        </div>
      </section>

      <section class="bloc promesses"><h2>Nos règles</h2>
        <ul><li>Gratuit, sans compte. Ta progression reste sur ton appareil.</li>
        <li>Aucune vraie IA n'est appelée : les démonstrations sont écrites à l'avance.</li>
        <li>Aucune affiliation, aucun classement sponsorisé. Chaque prix est daté et sourcé.</li>
        <li>Neutre : on te dit quel outil convient à ton besoin, pas celui d'un éditeur.</li></ul></section>`;
  };

  P.pages.test = el => {
    let i = 0; const rep = Object.assign({}, P.etat.test);
    const dessine = () => {
      if (i >= D.test.length) return fin();
      const q = D.test[i];
      el.innerHTML = `
        ${P.tete("Test d'entrée", "5 questions, 2 minutes. Elles servent à choisir ton parcours, rien n'est envoyé.")}
        <section class="question" aria-labelledby="q-titre">
          <div class="avancee" role="progressbar" aria-valuemin="0" aria-valuemax="${D.test.length}" aria-valuenow="${i}" aria-label="Progression du test"><i style="width:${(i / D.test.length) * 100}%"></i></div>
          <p class="surtitre">Question ${i + 1} sur ${D.test.length}</p>
          <h2 id="q-titre">${e(q.q)}</h2>
          <div class="choix" role="group" aria-labelledby="q-titre">${q.r.map(([v, l]) => `<button type="button" class="option" data-v="${e(v)}">${e(l)}</button>`).join("")}</div>
          ${i ? `<p class="actions"><button type="button" class="btn btn-ligne" id="retour">Question précédente</button></p>` : ""}
        </section>`;
      el.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => { rep[q.id] = b.dataset.v; i++; dessine(); const h = el.querySelector("h2"); if (h) h.focus(); }));
      const r = el.querySelector("#retour"); if (r) r.addEventListener("click", () => { i--; dessine(); });
    };
    const fin = () => {
      const p = D.calculerProfil(rep), pr = D.profils[p];
      const change = P.etat.profil !== p;
      P.etat.test = rep; P.etat.profil = p; if (change) P.etat.seance.fait = {}; P.sauve(); P.applique(); P.construisNav();
      el.innerHTML = `
        <section class="plein hero" style="--accent:${pr.couleur === "#111111" ? "var(--accent)" : pr.couleur}"><div class="cadre">
          <p class="surtitre">Ton parcours</p><h1>${e(pr.nom)}</h1><p class="chapo">${e(pr.accroche)}</p>
          <div class="actions"><a class="btn btn-signal" href="#/seance">Lancer ma séance de 30 minutes</a><a class="btn btn-ligne" href="#/test">Refaire le test</a></div>
        </div></section>
        <section class="bloc"><h2>Ce qui change pour toi</h2><ul>
          <li>Les exercices utilisent des situations de ton quotidien : ${e(pr.but.toLowerCase())}</li>
          ${pr.simple ? "<li>Texte plus grand et menu simplifié. Tu peux changer la taille dans « Plus ».</li>" : ""}
          ${rep.donnees === "sensibles" ? "<li>Tu manipules des données sensibles : lis la page <a href='#/donnees'>Ne colle pas ça</a> avant tout.</li>" : ""}
          ${p === "expert" ? "<li>Tu iras vite au palier 4 : évaluation, coûts, sécurité.</li>" : ""}
        </ul></section>`;
      el.querySelector("h1").focus();
    };
    dessine();
  };
})(window);

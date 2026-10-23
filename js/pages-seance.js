/* La séance de 30 minutes et la page finale de prompts. */
(function (g) {
  const P = g.P, D = g.D, e = P.e;

  const exigeProfil = el => {
    if (P.profil()) return false;
    el.innerHTML = `${P.tete("D'abord, le test", "2 minutes pour choisir ton parcours. Tu peux aussi passer directement.")}
      <p class="actions"><a class="btn btn-signal" href="#/test">Faire le test</a><button type="button" class="btn btn-ligne" id="passe">Passer, parcours « Particulier »</button></p>`;
    el.querySelector("#passe").addEventListener("click", () => { P.etat.profil = "particulier"; P.sauve(); P.applique(); P.construisNav(); P.affiche(); });
    return true;
  };

  P.pages.seance = el => {
    if (exigeProfil(el)) return;
    const prof = P.profil(), faits = P.faits(), total = D.session.length;
    const prochain = D.session.find(s => !P.etat.seance.fait[s.id]);
    el.innerHTML = `
      ${P.tete("Ma séance de 30 minutes", `Parcours <strong>${e(prof.nom)}</strong>. ${total} exercices, un par un. Tu peux t'arrêter et reprendre : on garde tout sur ton appareil.`, prof.couleur)}
      <div class="avancee" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${faits}" aria-label="Avancement de la séance"><i style="width:${(faits / total) * 100}%"></i></div>
      <ol class="etapes liste-seance">${D.session.map((s, k) => {
        const f = P.etat.seance.fait[s.id];
        return `<li class="etape ${f ? "fait" : ""}"><span class="num-etape" aria-hidden="true">${String(k + 1).padStart(2, "0")}</span>
          <div class="etape-corps"><h3><a href="#/seance/${s.id}">${e(s.titre)}</a></h3><p class="petit">${s.min} min${f ? ` · ${f.pts}/${f.max}` : ""}</p></div></li>`; }).join("")}</ol>
      <p class="actions">${prochain ? `<a class="btn btn-signal" href="#/seance/${prochain.id}">${faits ? "Continuer" : "C'est parti"}</a>` : `<a class="btn btn-signal" href="#/resultat">Voir mes prompts</a>`}
      <a class="btn btn-ligne" href="#/test">Changer de parcours</a></p>`;
  };

  P.pages.etape = (el, { id }) => {
    if (exigeProfil(el)) return;
    const k = D.session.findIndex(s => s.id === id);
    if (k < 0) return P.pages.introuvable(el);
    const s = D.session[k], sc = D.scenarios[P.etat.profil];
    el.innerHTML = `
      <section class="tete-theme" style="--c:${P.profil().couleur}"><div class="barre-theme"></div>
        <p class="fil"><a href="#/seance">Ma séance</a> · étape ${k + 1} sur ${D.session.length} · ${s.min} min</p>
        <h1>${e(s.titre)}</h1></section>
      <section class="exo" id="exo-hote" aria-live="polite"></section>`;
    const hote = el.querySelector("#exo-hote");
    const fini = (pts, max) => {
      P.etat.seance.fait[id] = { pts, max }; P.sauve();
      const suivant = D.session[k + 1];
      location.hash = suivant ? "#/seance/" + suivant.id : "#/resultat";
    };
    const q = D.qcm;
    switch (s.id) {
      case "bonmauvais": P.exo.choix(hote, sc, fini); break;
      case "blocs": P.exo.blocs(hote, sc, fini); break;
      case "halluc": P.exo.halluc(hote, D.halluc, fini); break;
      case "vraifaux": P.exo.depuisItems(hote, q.vraifaux, fini); break;
      case "conversation": P.exo.conversation(hote, sc, fini); break;
      case "chrono": P.exo.chrono(hote, D.chrono, fini); break;
      case "outilrapide": P.exo.depuisItems(hote, q.outilrapide, fini); break;
    }
  };

  /* Traduit les réponses du test en entrées du questionnaire « quelle IA ». */
  P.besoinDepuisTest = t => ({ ecrire: "ecrire", apprendre: "apprendre", organiser: "ecrire", creer: "creer" }[t.objectif] || "ecrire");
  P.reponsesQuelleIa = () => {
    const t = P.etat.test || {};
    return { besoin: P.besoinDepuisTest(t), budget: t.budget || "0", donnees: t.donnees || "libres", niveau: String(Math.min(2, Number(t.niveau || 0))) };
  };

  P.carteOutil = (o, raisons) => `
    <article class="carte-outil">
      <p class="surtitre">${e(o.famille)}</p>
      <h3><a href="#/outil/${o.id}">${e(o.nom)}</a></h3>
      ${raisons ? `<ul class="raisons">${raisons.slice(0, 3).map(r => `<li>${e(r)}</li>`).join("")}</ul>` : `<p>${e(o.gratuitTxt)}</p>`}
      <p class="petit">Vérifié le ${P.date(o.verifie)} · <a href="#/outil/${o.id}">Fiche, prix et limites</a></p>
      <p class="actions">${P.lienExt(o.url, "Ouvrir " + o.nom)}</p>
    </article>`;

  P.pages.resultat = el => {
    if (exigeProfil(el)) return;
    const prof = P.profil(), t = P.etat.test || {}, sc = D.scenarios[P.etat.profil];
    const faits = D.session.filter(s => P.etat.seance.fait[s.id]);
    const pts = faits.reduce((a, s) => a + P.etat.seance.fait[s.id].pts, 0), max = faits.reduce((a, s) => a + P.etat.seance.fait[s.id].max, 0);
    const parId = id => D.prompts.find(p => p.id === id);
    const lot = [
      { titre: "Ton prompt de la séance", txt: sc.bon, astuce: sc.pourquoi },
      (() => { const p = parId(D.promptParObjectif[t.objectif] || "ecrire-mail"); return { titre: p.titre, txt: p.prompt, astuce: p.astuce }; })(),
      (() => { const p = parId(D.promptMeta); return { titre: p.titre, txt: p.prompt, astuce: p.astuce }; })()
    ];
    const reco = D.recommander(P.reponsesQuelleIa()).slice(0, 3);
    const suivantPalier = P.etat.profil === "expert" ? 4 : P.etat.profil === "pro" ? 3 : P.etat.profil === "entreprise" || P.etat.profil === "entrepreneur" ? 2 : 1;
    el.innerHTML = `
      <section class="hero plein"><div class="cadre">
        <p class="surtitre">Séance terminée</p><h1>Tu as <em>le déclic</em></h1>
        <p class="chapo">${faits.length === D.session.length ? `Score : ${pts} sur ${max}.` : `Il te reste ${D.session.length - faits.length} exercice${D.session.length - faits.length > 1 ? "s" : ""} : <a href="#/seance" style="color:#fff">termine ta séance</a>.`} Voici de quoi passer à l'action tout de suite.</p>
      </div></section>
      <section aria-labelledby="t-prompts"><div class="titre-section"><h2 id="t-prompts">3 prompts prêts à copier</h2><span class="petit">Remplace les [CROCHETS] dans l'outil, pas avant.</span></div>
        <div class="liste-prompts">${lot.map((p, k) => `
          <article class="carte-prompt-lib"><h3>${e(p.titre)}</h3><pre class="prompt-bloc" id="rp-${k}" data-texte="${e(p.txt)}">${P.surligne(p.txt)}</pre>
            <p class="petit">${e(p.astuce)}</p><p class="actions"><button type="button" class="btn" data-copie="rp-${k}">Copier</button></p></article>`).join("")}</div></section>
      <section aria-labelledby="t-outil"><div class="titre-section"><h2 id="t-outil">Ouvre une IA maintenant</h2><a class="lien-fleche" href="#/quelle-ia">Comparer tous les outils</a></div>
        <p class="chapo">D'après tes réponses au test, ces outils couvrent ton besoin. Ils sont listés sans parti pris, par ordre de correspondance.</p>
        <div class="liste-guides">${reco.map(r => P.carteOutil(r.o, r.raisons)).join("")}</div></section>
      <section class="bloc"><h2>Et après ?</h2><ul>
        <li><a href="#/palier/${suivantPalier}">Palier ${suivantPalier} : ${e(D.paliers[suivantPalier - 1].titre)}</a></li>
        <li><a href="#/donnees">Ne colle pas ça</a> : protège tes données</li>
        <li><a href="#/prompts">Toute la bibliothèque de prompts</a></li></ul>
        <p class="actions"><button type="button" class="btn btn-ligne" onclick="window.print()">Imprimer cette page</button></p></section>`;
  };
})(window);

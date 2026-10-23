/* Moteurs d'exercices. Chaque moteur reçoit l'élément hôte, sa configuration et un rappel `fini(points, max)`.
   Les réponses sont toujours expliquées : on apprend aussi en se trompant. */
(function (g) {
  const P = g.P, e = P.e;

  const suite = (hote, txt, f) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = txt; b.addEventListener("click", f);
    const w = document.createElement("p"); w.className = "actions"; w.appendChild(b); hote.appendChild(w); b.focus({ preventScroll: false }); return b;
  };

  /* Questions à choix : items = [{q, options, bon, expl, src}] */
  P.exo.qcm = (hote, cfg, fini) => {
    let i = 0, bons = 0;
    const montre = () => {
      const it = cfg.items[i];
      hote.innerHTML = `
        <p class="surtitre">Question ${i + 1} sur ${cfg.items.length}</p>
        <h3 class="enonce" id="enonce">${e(it.q)}</h3>
        <div class="choix" role="group" aria-labelledby="enonce">${it.options.map((o, k) => `<button type="button" class="option" data-k="${k}">${e(o)}</button>`).join("")}</div>
        <div class="retour" aria-live="polite"></div>`;
      hote.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.k), ok = k === it.bon; if (ok) bons++;
        hote.querySelectorAll(".option").forEach(x => { x.disabled = true; const kk = Number(x.dataset.k); if (kk === it.bon) x.classList.add("juste"); else if (x === b) x.classList.add("faux"); });
        hote.querySelector(".retour").innerHTML = `<div class="alerte ${ok ? "ok" : "warn"}"><strong>${ok ? "Bien vu." : "Pas tout à fait."}</strong><span>${e(it.expl)}${it.src ? ` ${P.lienExt(it.src, "Source")}` : ""}</span></div>`;
        suite(hote.querySelector(".retour"), i + 1 < cfg.items.length ? "Question suivante" : "Terminer", () => { i++; if (i < cfg.items.length) montre(); else fini(bons, cfg.items.length); });
      }));
    };
    montre();
  };

  /* Adaptateurs : vrai/faux, tri et question isolée passent par le même moteur. */
  P.exo.depuisItems = (hote, conf, fini) => P.exo.qcm(hote, { items: conf.items.map(([q, bon, expl, src]) => ({ q, options: conf.options, bon, expl, src })) }, fini);
  P.exo.question = (hote, c, fini) => P.exo.qcm(hote, { items: [{ q: c.q, options: c.r, bon: c.bon, expl: c.expl }] }, fini);

  /* Bon ou mauvais prompt : deux cartes dans un ordre fixe mais non évident. */
  P.exo.choix = (hote, sc, fini) => {
    const ordreInverse = sc.mauvais.length % 2 === 0;
    const cartes = ordreInverse ? [["bon", sc.bon], ["mauvais", sc.mauvais]] : [["mauvais", sc.mauvais], ["bon", sc.bon]];
    hote.innerHTML = `
      <p class="situation">${e(sc.situation)}</p>
      <h3 id="enonce">Lequel de ces deux prompts donnera la meilleure réponse ?</h3>
      <div class="duo" role="group" aria-labelledby="enonce">${cartes.map(([t, txt], k) => `<button type="button" class="option carte-prompt" data-t="${t}"><span class="lettre">${"AB"[k]}</span><span>${e(txt)}</span></button>`).join("")}</div>
      <div class="retour" aria-live="polite"></div>`;
    hote.querySelectorAll(".carte-prompt").forEach(b => b.addEventListener("click", () => {
      const ok = b.dataset.t === "bon";
      hote.querySelectorAll(".carte-prompt").forEach(x => { x.disabled = true; x.classList.add(x.dataset.t === "bon" ? "juste" : "faux"); });
      hote.querySelector(".retour").innerHTML = `<div class="alerte ${ok ? "ok" : "warn"}"><strong>${ok ? "Exact." : "Pas celui-là."}</strong><span>${e(sc.pourquoi)}</span></div>`;
      suite(hote.querySelector(".retour"), "Continuer", () => fini(ok ? 1 : 0, 1));
    }));
  };

  /* Prompt par blocs : on place chaque morceau dans le bon bloc. */
  P.exo.blocs = (hote, sc, fini) => {
    const noms = g.D.blocsNoms, pieces = P.melange(noms.map(([k]) => k), 7);
    const place = {}; let actif = noms[0][0]; let verifie = false;
    const dessine = () => {
      const utilises = Object.values(place);
      hote.innerHTML = `
        <p class="situation">${e(sc.situation)}</p>
        <p>Choisis un bloc, puis touche le morceau de texte qui y va.</p>
        <div class="blocs-grille">
          <ol class="slots" aria-label="Blocs du prompt">${noms.map(([k, nom, aide]) => {
            const val = place[k]; const etat = verifie ? (val === k ? "juste" : "faux") : "";
            return `<li><button type="button" class="slot ${k === actif && !verifie ? "actif" : ""} ${etat}" data-slot="${k}" aria-pressed="${k === actif}" ${verifie ? "disabled" : ""}>
              <b>${e(nom)}</b><small>${e(aide)}</small><span class="rempli">${val ? e(sc.blocs[val]) : "Touche pour choisir"}</span></button></li>`; }).join("")}</ol>
          <div class="pieces" role="group" aria-label="Morceaux de texte">${pieces.map(k => `<button type="button" class="piece" data-piece="${k}" ${utilises.includes(k) || verifie ? "disabled" : ""}>${e(sc.blocs[k])}</button>`).join("")}</div>
        </div>
        <div class="retour" aria-live="polite"></div>
        ${verifie ? "" : `<p class="actions"><button type="button" class="btn" id="verif" ${utilises.length < noms.length ? "disabled" : ""}>Vérifier mon prompt</button><button type="button" class="btn btn-ligne" id="vide" ${utilises.length ? "" : "disabled"}>Tout effacer</button></p>`}`;
      hote.querySelectorAll(".slot").forEach(b => b.addEventListener("click", () => { if (place[b.dataset.slot]) delete place[b.dataset.slot]; actif = b.dataset.slot; dessine(); hote.querySelector(`.slot[data-slot="${actif}"]`)?.focus(); }));
      hote.querySelectorAll(".piece").forEach(b => b.addEventListener("click", () => {
        place[actif] = b.dataset.piece;
        const libre = noms.find(([k]) => !place[k]); if (libre) actif = libre[0];
        dessine(); (hote.querySelector(".piece:not(:disabled)") || hote.querySelector("#verif"))?.focus();
      }));
      const v = hote.querySelector("#verif"); if (v) v.addEventListener("click", () => {
        verifie = true; dessine();
        const bons = noms.filter(([k]) => place[k] === k).length;
        const prompt = noms.map(([k]) => sc.blocs[k]).join("\n");
        const r = hote.querySelector(".retour");
        r.innerHTML = `<div class="alerte ${bons === noms.length ? "ok" : "warn"}"><strong>${bons} bloc${bons > 1 ? "s" : ""} sur ${noms.length}.</strong><span>${bons === noms.length ? "Voici le prompt complet, prêt à copier." : "Les blocs en rouge étaient ailleurs. Voici le prompt dans le bon ordre."}</span></div>
          <pre class="prompt-bloc" id="bloc-final" data-texte="${e(prompt)}">${P.surligne(prompt)}</pre>
          <p class="actions"><button type="button" class="btn btn-ligne" data-copie="bloc-final">Copier ce prompt</button></p>`;
        suite(r, "Continuer", () => fini(bons, noms.length));
      });
      const c = hote.querySelector("#vide"); if (c) c.addEventListener("click", () => { Object.keys(place).forEach(k => delete place[k]); actif = noms[0][0]; dessine(); });
    };
    dessine();
  };

  /* Repérer l'hallucination : on touche les phrases douteuses. */
  P.exo.halluc = (hote, cfg, fini) => {
    const sel = new Set(); let verifie = false;
    const dessine = () => {
      hote.innerHTML = `
        <p class="situation">${e(cfg.question)}</p>
        <ul class="phrases" aria-label="Réponse de l'IA">${cfg.phrases.map(([txt, piege, expl], k) => {
          const cl = verifie ? (piege ? (sel.has(k) ? "juste" : "rate") : (sel.has(k) ? "faux" : "")) : (sel.has(k) ? "choisi" : "");
          return `<li><button type="button" class="phrase ${cl}" data-k="${k}" aria-pressed="${sel.has(k)}" ${verifie ? "disabled" : ""}>${e(txt)}</button>${verifie ? `<p class="petit expl">${piege ? "⚠ " : "✓ "}${e(expl)}</p>` : ""}</li>`; }).join("")}</ul>
        <div class="retour" aria-live="polite"></div>
        ${verifie ? "" : `<p class="actions"><button type="button" class="btn" id="verif">Vérifier</button></p>`}`;
      hote.querySelectorAll(".phrase").forEach(b => b.addEventListener("click", () => { const k = Number(b.dataset.k); sel.has(k) ? sel.delete(k) : sel.add(k); dessine(); hote.querySelector(`.phrase[data-k="${k}"]`)?.focus(); }));
      const v = hote.querySelector("#verif"); if (v) v.addEventListener("click", () => {
        verifie = true; dessine();
        const pieges = cfg.phrases.filter(p => p[1]).length;
        let bons = 0, fausses = 0; cfg.phrases.forEach((p, k) => { if (sel.has(k)) { if (p[1]) bons++; else fausses++; } });
        const pts = Math.max(0, bons - fausses);
        const r = hote.querySelector(".retour");
        r.innerHTML = `<div class="alerte ${pts === pieges ? "ok" : "warn"}"><strong>${bons} piège${bons > 1 ? "s" : ""} trouvé${bons > 1 ? "s" : ""} sur ${pieges}${fausses ? `, ${fausses} fausse alerte${fausses > 1 ? "s" : ""}` : ""}.</strong><span>Réflexe à garder : un chiffre très précis, une source, un lien, une citation. Vérifie-les ailleurs avant de les utiliser. ${cfg.source ? P.lienExt(cfg.source[1], cfg.source[0]) : ""}</span></div>`;
        suite(r, "Continuer", () => fini(pts, pieges));
      });
    };
    dessine();
  };

  /* Conversation simulée : deux tours, rien n'est envoyé nulle part. */
  P.exo.conversation = (hote, sc, fini) => {
    const c = sc.conv; let pts = 0;
    const log = [["moi", c.prompt], ["ia", c.premiere]];
    const fil = () => `<div class="chat" role="log" aria-label="Conversation simulée">${log.map(([qui, t]) => `<div class="bulle ${qui}"><span class="qui">${qui === "moi" ? "Toi" : "IA (simulée)"}</span>${e(t)}</div>`).join("")}</div>`;
    const tour = (opts, rep, suivant) => {
      hote.innerHTML = fil() + `<p class="situation">Que réponds-tu ?</p><div class="choix" role="group" aria-label="Ta réponse">${opts.map((o, k) => `<button type="button" class="option" data-k="${k}">${e(o[0])}</button>`).join("")}</div><div class="retour" aria-live="polite"></div>`;
      hote.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
        const o = opts[Number(b.dataset.k)]; if (o[1]) pts++;
        hote.querySelectorAll(".option").forEach(x => { x.disabled = true; if (opts[Number(x.dataset.k)][1]) x.classList.add("juste"); else if (x === b) x.classList.add("faux"); });
        log.push(["moi", o[0]]);
        hote.querySelector(".retour").innerHTML = `<div class="alerte ${o[1] ? "ok" : "warn"}"><strong>${o[1] ? "Bon réflexe." : "À éviter."}</strong><span>${e(o[2])}</span></div>`;
        suite(hote.querySelector(".retour"), "Voir la réponse de l'IA", () => { log.push(["ia", rep]); suivant(); });
      }));
    };
    tour(c.o1, c.reponse1, () => tour(c.o2, c.reponse2, () => {
      hote.innerHTML = fil() + `<div class="alerte info"><strong>${pts} bon${pts > 1 ? "s" : ""} réflexe${pts > 1 ? "s" : ""} sur 2.</strong><span>Une conversation se construit : tu précises, l'IA s'ajuste. Cette démonstration est écrite à l'avance, aucune vraie IA n'a répondu.</span></div>`;
      suite(hote, "Continuer", () => fini(pts, 2));
    }));
  };

  /* Défi chronométré : coller ou pas. */
  P.exo.chrono = (hote, cfg, fini) => {
    const sans = P.etat.reglages.sansChrono;
    let i = 0, bons = 0, reste = cfg.secondes, t = null, fin = false;
    const arret = () => { if (t) { clearInterval(t); t = null; } };
    P.nettoyages.push(arret);
    const termine = () => {
      if (fin) return; fin = true; arret();
      hote.innerHTML = `<div class="alerte ${bons === cfg.items.length ? "ok" : "info"}"><strong>${bons} bonne${bons > 1 ? "s" : ""} réponse${bons > 1 ? "s" : ""} sur ${cfg.items.length}.</strong><span>${i < cfg.items.length ? "Le temps est écoulé. " : ""}Règle d'or : si c'est personnel, secret ou concerne un tiers, tu n'y mets rien, ou tu anonymises avant.</span></div>
        <ul class="recap">${cfg.items.map(it => `<li><b>${e(it[0])}</b> : ${e(cfg.options[it[1]])}. ${e(it[2])}</li>`).join("")}</ul>`;
      suite(hote, "Continuer", () => fini(bons, cfg.items.length));
    };
    const montre = () => {
      const it = cfg.items[i];
      hote.innerHTML = `
        <p class="situation">${e(cfg.consigne)}${sans ? " Chrono désactivé dans tes réglages." : ""}</p>
        ${sans ? "" : `<div class="minuteur" aria-hidden="true"><i style="width:${(reste / cfg.secondes) * 100}%"></i></div><p class="petit" id="reste" role="timer" aria-live="off">${reste} s</p>`}
        <p class="surtitre">${i + 1} sur ${cfg.items.length}</p>
        <h3 class="enonce" id="enonce">${e(it[0])}</h3>
        <div class="choix duo" role="group" aria-labelledby="enonce">${cfg.options.map((o, k) => `<button type="button" class="option" data-k="${k}">${e(o)}</button>`).join("")}</div>`;
      hote.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => { if (Number(b.dataset.k) === it[1]) bons++; i++; if (i < cfg.items.length) montre(); else termine(); }));
    };
    montre();
    if (!sans) t = setInterval(() => {
      reste--; const el = hote.querySelector("#reste"), barre = hote.querySelector(".minuteur i");
      if (el) el.textContent = reste + " s"; if (barre) barre.style.width = (Math.max(reste, 0) / cfg.secondes) * 100 + "%";
      if (reste <= 0) termine();
    }, 1000);
  };

  /* Ordonner des étapes en les touchant dans l'ordre. */
  P.exo.ordre = (hote, cfg, fini) => {
    const melange = P.melange(cfg.etapes.map((_, k) => k), 11);
    const choisi = []; let verifie = false;
    const dessine = () => {
      hote.innerHTML = `
        <p class="situation">${e(cfg.consigne)}</p>
        <p class="petit">Touche les étapes dans l'ordre. Touche une étape choisie pour la retirer.</p>
        <ol class="ordre-choisi" aria-label="Ton ordre">${choisi.map((k, n) => `<li><button type="button" class="piece ${verifie ? (k === n ? "juste" : "faux") : ""}" data-retire="${k}" ${verifie ? "disabled" : ""}>${e(cfg.etapes[k])}</button></li>`).join("") || "<li class='petit'>Rien encore.</li>"}</ol>
        <div class="pieces" role="group" aria-label="Étapes à placer">${melange.filter(k => !choisi.includes(k)).map(k => `<button type="button" class="piece" data-ajoute="${k}" ${verifie ? "disabled" : ""}>${e(cfg.etapes[k])}</button>`).join("")}</div>
        <div class="retour" aria-live="polite"></div>
        ${verifie ? "" : `<p class="actions"><button type="button" class="btn" id="verif" ${choisi.length < cfg.etapes.length ? "disabled" : ""}>Vérifier</button></p>`}`;
      hote.querySelectorAll("[data-ajoute]").forEach(b => b.addEventListener("click", () => { choisi.push(Number(b.dataset.ajoute)); dessine(); }));
      hote.querySelectorAll("[data-retire]").forEach(b => b.addEventListener("click", () => { choisi.splice(choisi.indexOf(Number(b.dataset.retire)), 1); dessine(); }));
      const v = hote.querySelector("#verif"); if (v) v.addEventListener("click", () => {
        verifie = true; dessine();
        const bons = choisi.filter((k, n) => k === n).length;
        const r = hote.querySelector(".retour");
        r.innerHTML = `<div class="alerte ${bons === cfg.etapes.length ? "ok" : "warn"}"><strong>${bons} étape${bons > 1 ? "s" : ""} bien placée${bons > 1 ? "s" : ""} sur ${cfg.etapes.length}.</strong><span>${e(cfg.expl)}</span></div><ol class="recap">${cfg.etapes.map(x => `<li>${e(x)}</li>`).join("")}</ol>`;
        suite(r, "Terminer", () => fini(bons, cfg.etapes.length));
      });
    };
    dessine();
  };

  /* Calculateur de coût : les prix sont à saisir depuis la page officielle du fournisseur. */
  P.exo.cout = (hote, cfg, fini) => {
    hote.innerHTML = `
      <p class="situation">Tu construis un assistant qui traite des demandes par API. Renseigne tes chiffres : les prix d'exemple sont <strong>fictifs</strong>, remplace-les par ceux de la page officielle du fournisseur que tu choisis.</p>
      <div class="formulaire cout">
        ${[["tin", "Texte envoyé par appel (tokens)", 1500], ["tout", "Texte reçu par appel (tokens)", 400], ["appels", "Appels par jour", 2000], ["pin", "Prix pour 1 million de tokens envoyés (exemple fictif)", 1], ["pout", "Prix pour 1 million de tokens reçus (exemple fictif)", 5]]
          .map(([id, l, v]) => `<div class="champ"><label for="c-${id}">${l}</label><input id="c-${id}" type="number" inputmode="decimal" min="0" step="any" value="${v}"></div>`).join("")}
      </div>
      <div class="grand" aria-live="polite"><span class="petit">Coût estimé par mois (30 jours)</span><span class="chiffre" id="c-total">0</span><span class="petit" id="c-detail"></span></div>
      <div class="alerte info"><strong>Trois leviers pour baisser la facture</strong><span>Raccourcir le prompt répété à chaque appel, limiter la longueur des réponses, et réutiliser le début identique des prompts quand le fournisseur propose une mise en cache (à vérifier dans sa documentation).</span></div>
      <div class="retour"></div>`;
    const v = id => Number(hote.querySelector("#c-" + id).value) || 0;
    const calc = () => {
      const jour = v("appels") * ((v("tin") * v("pin") + v("tout") * v("pout")) / 1e6);
      hote.querySelector("#c-total").textContent = (jour * 30).toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " $";
      hote.querySelector("#c-detail").textContent = `${jour.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $ par jour · ${(jour / (v("appels") || 1) * 1000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} $ pour 1 000 appels`;
    };
    hote.querySelectorAll("input").forEach(i => i.addEventListener("input", calc)); calc();
    suite(hote.querySelector(".retour"), "J'ai fait mon calcul", () => fini(1, 1));
  };
})(window);

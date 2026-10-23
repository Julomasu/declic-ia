/* Noyau : état local, aides, routeur. Aucune requête réseau, aucune donnée envoyée. */
(function (g) {
  const D = g.D;
  const P = (g.P = { pages: {}, exo: {}, nettoyages: [], D });

  P.CONFIG = {
    depot: "https://github.com/julomasu/declic-ia",
    maj: "23 octobre 2026",
    /* Champs d'éditeur laissés vides tant que Jules ne les renseigne pas. */
    editeur: { nom: "", statut: "", adresse: "", contact: "", directeurPublication: "" }
  };

  /* ——— Échappement et petits outils */
  P.e = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  P.mois = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  P.date = iso => { const [a, m, j] = iso.split("-").map(Number); return `${j} ${P.mois[m - 1]} ${a}`; };
  P.melange = (arr, graine) => {
    const a = arr.slice(); let s = graine || 1;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  P.surligne = txt => P.e(txt).replace(/\[([^\]]+)\]/g, '<mark class="creneau">[$1]</mark>');
  P.lienExt = (url, txt) => `<a class="lien-ext" href="${P.e(url)}" target="_blank" rel="noopener noreferrer">${P.e(txt)}</a>`;

  /* ——— État, stocké uniquement sur l'appareil */
  const CLE = "declic.v1";
  const defaut = () => ({ v: 1, profil: null, test: {}, seance: { fait: {} }, paliers: {}, checklist: {}, reglages: { zoom: 1, theme: "auto", sansChrono: false, zoomChoisi: false } });
  P.etat = defaut();
  try { const brut = localStorage.getItem(CLE); if (brut) P.etat = Object.assign(defaut(), JSON.parse(brut)); } catch (_) { /* navigation privée : on continue sans mémoire */ }
  P.sauve = () => { try { localStorage.setItem(CLE, JSON.stringify(P.etat)); } catch (_) { /* ignoré */ } };
  P.efface = () => { P.etat = defaut(); try { localStorage.removeItem(CLE); } catch (_) { /* ignoré */ } P.applique(); };

  P.profil = () => (P.etat.profil && D.profils[P.etat.profil]) || null;
  P.simple = () => !!(P.profil() && P.profil().simple);

  P.applique = () => {
    const r = P.etat.reglages, rac = document.documentElement;
    let z = r.zoom || 1;
    if (!r.zoomChoisi && P.simple()) z = 1.3;
    rac.style.setProperty("--zoom", z);
    if (r.theme === "auto") rac.removeAttribute("data-theme"); else rac.setAttribute("data-theme", r.theme);
    document.body.classList.toggle("simple", P.simple());
  };

  /* ——— Retours à l'utilisateur */
  P.toast = msg => {
    const c = document.getElementById("toasts"); const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 2400);
  };
  P.copie = async txt => {
    try { await navigator.clipboard.writeText(txt); P.toast("Copié. Colle-le dans l'outil de ton choix."); return true; }
    catch (_) {
      const ta = document.createElement("textarea"); ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (_e) { ok = false; }
      ta.remove(); P.toast(ok ? "Copié. Colle-le dans l'outil de ton choix." : "Copie impossible ici : sélectionne le texte et copie-le à la main."); return ok;
    }
  };
  /* Les boutons « Copier » portent data-copie="id texte" ou lisent le texte voisin. */
  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-copie]"); if (!b) return;
    const cible = document.getElementById(b.dataset.copie);
    if (cible) P.copie(cible.dataset.texte || cible.textContent.trim());
  });

  /* ——— Routeur à base de hash */
  P.routes = [
    ["", "accueil", "Accueil"], ["test", "test", "Test d'entrée"], ["seance", "seance", "Ma séance de 30 minutes"],
    ["seance/:id", "etape", "Séance"], ["resultat", "resultat", "Tes prompts"], ["paliers", "paliers", "Les 4 paliers"],
    ["palier/:n", "palier", "Palier"], ["exo/:id", "exoPalier", "Exercice"], ["quelle-ia", "quelleIa", "Quelle IA est faite pour moi ?"],
    ["outil/:id", "outil", "Fiche d'outil"], ["choisis", "choisis", "Choisis ton outil"], ["prompts", "prompts", "Bibliothèque de prompts"],
    ["donnees", "donnees", "Ne colle pas ça"], ["entreprise", "entreprise", "Kit entreprise"], ["actus", "actus", "Actus des IA"],
    ["sources", "sources", "Sources et vérifications"], ["mentions", "mentions", "Mentions légales"], ["confidentialite", "confidentialite", "Confidentialité"]
  ];
  P.resout = hash => {
    const chemin = (hash || "").replace(/^#\/?/, "").split("?")[0].replace(/\/$/, "");
    for (const [modele, page, titre] of P.routes) {
      const m = modele.split("/"), c = chemin.split("/");
      if (m.length !== c.length) continue;
      const args = {}; let ok = true;
      m.forEach((seg, i) => { if (seg.startsWith(":")) args[seg.slice(1)] = decodeURIComponent(c[i]); else if (seg !== c[i]) ok = false; });
      if (ok) return { page, titre, args, chemin };
    }
    return null;
  };
  P.requete = () => new URLSearchParams((location.hash.split("?")[1]) || "");

  P.affiche = () => {
    P.nettoyages.splice(0).forEach(f => { try { f(); } catch (_) { /* ignoré */ } });
    const el = document.getElementById("app");
    const r = P.resout(location.hash) || { page: "introuvable", titre: "Page introuvable", args: {}, chemin: "" };
    el.className = "app entree";
    el.scrollTop = 0; window.scrollTo(0, 0);
    try { (P.pages[r.page] || P.pages.introuvable)(el, r.args, r); }
    catch (err) { console.error(err); el.innerHTML = `<section class="tete-theme"><h1>Oups</h1><p class="chapo">Cette page ne s'est pas affichée. Reviens à l'<a href="#/">accueil</a>.</p></section>`; }
    document.title = (r.chemin ? r.titre + " · " : "") + "Déclic";
    P.marqueNav(r.chemin);
    const h1 = el.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
  };

  P.pages.introuvable = el => {
    el.innerHTML = `<section class="tete-theme"><div class="barre-theme"></div><h1>Page introuvable</h1><p class="chapo">Ce lien ne mène nulle part.</p><p class="actions"><a class="btn" href="#/">Retour à l'accueil</a></p></section>`;
  };

  /* ——— Navigation */
  P.nav = [
    ["#/", "Accueil", "<path d='M3 11 12 3l9 8M5 10v10h14V10'/>"],
    ["#/seance", "Séance", "<circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/>"],
    ["#/quelle-ia", "Quelle IA ?", "<circle cx='11' cy='11' r='7'/><path d='m20 20-4-4'/>"],
    ["#/prompts", "Prompts", "<path d='M5 4h14v12H9l-4 4z'/>"],
    ["#/actus", "Actus", "<path d='M4 5h16v14H4zM8 9h8M8 13h5'/>"]
  ];
  P.navPlus = [
    ["#/paliers", "Les 4 paliers", "Savoir demander, documents, automatiser, construire"],
    ["#/choisis", "Choisis ton outil", "Un besoin, un outil, une recette"],
    ["#/donnees", "Ne colle pas ça", "Données personnelles et RGPD"],
    ["#/entreprise", "Kit entreprise", "Charte, check-list, cas d'usage"],
    ["#/test", "Refaire le test d'entrée", "Change de parcours"],
    ["#/sources", "Sources et vérifications", "D'où viennent les faits"],
    ["#/mentions", "Mentions légales", ""], ["#/confidentialite", "Confidentialité", ""]
  ];
  P.construisNav = () => {
    const haut = P.simple() ? P.nav.filter(n => n[0] !== "#/actus") : P.nav;
    document.getElementById("nav-haut").innerHTML = P.nav.concat([["#/paliers", "Paliers", ""]]).filter(n => !(P.simple() && ["#/actus", "#/paliers"].includes(n[0])))
      .map(n => `<a href="${n[0]}" data-nav="${n[0]}">${P.e(n[1])}</a>`).join("");
    document.getElementById("onglets").innerHTML = haut.slice(0, 4).map(n => `<a href="${n[0]}" data-nav="${n[0]}"><svg viewBox="0 0 24 24" aria-hidden="true">${n[2]}</svg>${P.e(n[1])}</a>`).join("") +
      `<button type="button" id="btn-plus-m" aria-expanded="false" aria-controls="plus"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>Plus</button>`;
    const r = P.etat.reglages;
    document.getElementById("plus").innerHTML = `
      <nav aria-label="Autres pages">${P.navPlus.map(n => `<a href="${n[0]}" data-nav="${n[0]}">${P.e(n[1])}${n[2] ? `<span>${P.e(n[2])}</span>` : ""}</a>`).join("")}</nav>
      <div class="reglages">
        <b class="petit">Taille du texte</b>
        <div class="reg-ligne" role="group" aria-label="Taille du texte">
          ${[[1, "A", "", "normal"], [1.15, "A", "t2", "grand"], [1.3, "A", "t3", "très grand"]].map(([z, l, c, nom]) => `<button type="button" class="${c}" data-zoom="${z}" aria-pressed="${((!r.zoomChoisi && P.simple()) ? 1.3 : r.zoom) === z}" aria-label="Texte ${nom}">${l}</button>`).join("")}
        </div>
        <b class="petit">Thème</b>
        <div class="reg-ligne" role="group" aria-label="Thème">
          ${[["auto", "Auto"], ["light", "Clair"], ["dark", "Sombre"]].map(([v, l]) => `<button type="button" data-theme-set="${v}" aria-pressed="${r.theme === v}">${l}</button>`).join("")}
        </div>
        <label class="ligne-case"><input type="checkbox" id="opt-chrono" ${r.sansChrono ? "checked" : ""}> Sans chrono dans les défis</label>
        <button type="button" class="btn btn-ligne" id="btn-efface">Effacer ma progression</button>
      </div>`;
    document.getElementById("pied").innerHTML = `
      <p><strong>Déclic</strong> : formation gratuite à l'IA. Sans compte, sans traceur : ta progression reste dans ton navigateur. Les démonstrations sont scénarisées, aucune vraie IA n'est appelée.</p>
      <p>Chaque prix et chaque fonction sont relevés sur le site officiel de l'outil, avec la date de vérification. Aucune affiliation, aucun classement sponsorisé. <a href="#/sources">Voir les sources</a> · <a href="#/mentions">Mentions légales</a> · <a href="#/confidentialite">Confidentialité</a>.</p>
      <p class="petit">Dernière mise à jour des contenus : ${P.CONFIG.maj}.</p>`;
  };
  P.marqueNav = chemin => {
    const cible = "#/" + chemin;
    document.querySelectorAll("[data-nav]").forEach(a => {
      const h = a.dataset.nav; const actif = h === cible || (h !== "#/" && cible.startsWith(h + "/"));
      a.classList.toggle("actif", actif); if (actif) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  };
  P.menuPlus = ouvert => {
    const m = document.getElementById("plus"); m.hidden = !ouvert;
    document.querySelectorAll("#btn-plus, #btn-plus-m").forEach(b => b.setAttribute("aria-expanded", String(ouvert)));
  };
  document.addEventListener("click", ev => {
    const t = ev.target;
    if (t.closest("#btn-plus, #btn-plus-m")) { P.menuPlus(document.getElementById("plus").hidden); return; }
    const z = t.closest("[data-zoom]");
    if (z) { P.etat.reglages.zoom = Number(z.dataset.zoom); P.etat.reglages.zoomChoisi = true; P.sauve(); P.applique(); P.construisNav(); P.marqueNav(P.resout(location.hash)?.chemin || ""); P.menuPlus(true); return; }
    const th = t.closest("[data-theme-set]");
    if (th) { P.etat.reglages.theme = th.dataset.themeSet; P.sauve(); P.applique(); P.construisNav(); P.marqueNav(P.resout(location.hash)?.chemin || ""); P.menuPlus(true); return; }
    if (t.closest("#btn-efface")) { if (confirm("Effacer ton profil, tes scores et tes réglages sur cet appareil ?")) { P.efface(); P.construisNav(); P.menuPlus(false); location.hash = "#/"; P.affiche(); } return; }
    if (!t.closest("#plus")) P.menuPlus(false);
  });
  document.addEventListener("change", ev => {
    if (ev.target.id === "opt-chrono") { P.etat.reglages.sansChrono = ev.target.checked; P.sauve(); }
  });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape") P.menuPlus(false); });
  window.addEventListener("hashchange", () => { P.menuPlus(false); P.affiche(); });
})(window);

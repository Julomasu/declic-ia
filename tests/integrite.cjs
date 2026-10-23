/* Script d'intégrité : références croisées, données, liens, hygiène. Zéro erreur exigée avant de pousser.
   Usage : node tests/integrite.cjs [--liens]  (--liens vérifie en ligne que chaque URL répond) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const racine = path.join(__dirname, "..");
const erreurs = [], avertissements = [];
const err = m => erreurs.push(m), warn = m => avertissements.push(m);
const lis = f => fs.readFileSync(path.join(racine, f), "utf8");

/* ——— Chargement des données dans un bac à sable */
const ctx = vm.createContext({});
["profils", "exercices", "outils", "prompts", "paliers", "entreprise", "actus"].forEach(n => vm.runInContext(lis(`js/data/${n}.js`), ctx, { filename: n }));
const D = vm.runInContext("D", ctx);

const uniques = (liste, nom) => { const vus = new Set(); liste.forEach(x => { if (vus.has(x)) err(`${nom} : identifiant en double « ${x} »`); vus.add(x); }); return vus; };
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const aujourdhui = new Date(); const jours = iso => (aujourdhui - new Date(iso + "T00:00:00Z")) / 864e5;

/* ——— Outils */
const idsOutils = uniques(D.outils.map(o => o.id), "outils");
D.outils.forEach(o => {
  ["nom", "editeur", "famille", "gratuit", "gratuitTxt", "donnees", "url", "url_prix", "verifie"].forEach(k => { if (!o[k]) err(`outil ${o.id} : champ « ${k} » manquant`); });
  if (!o.prix || !o.prix.length) err(`outil ${o.id} : pas de prix`);
  if (!o.forts || !o.forts.length) err(`outil ${o.id} : pas de points forts`);
  if (!o.limites || !o.limites.length) err(`outil ${o.id} : pas de limites (une fiche honnête en a)`);
  if (typeof o.controle !== "boolean") err(`outil ${o.id} : « controle » doit être vrai ou faux`);
  if (!ISO.test(o.verifie || "")) err(`outil ${o.id} : date de vérification invalide`);
  else { if (jours(o.verifie) < 0) err(`outil ${o.id} : date de vérification dans le futur`); if (jours(o.verifie) > 60) warn(`outil ${o.id} : vérifié il y a ${Math.round(jours(o.verifie))} jours, à revérifier`); }
  (o.besoins || []).forEach(b => { if (!D.besoins[b]) err(`outil ${o.id} : besoin inconnu « ${b} »`); });
  if (!["oui", "non confirmé", "inconnu"].includes(o.gratuit)) err(`outil ${o.id} : valeur « gratuit » inconnue`);
});
Object.keys(D.besoins).forEach(b => { if (!D.outils.some(o => o.besoins.includes(b))) err(`besoin « ${b} » sans aucun outil`); });
/* Le questionnaire doit produire au moins un résultat pour chaque besoin. */
Object.keys(D.besoins).forEach(b => ["0", "20", "plus"].forEach(bu => ["libres", "sensibles"].forEach(dn => ["0", "1", "2"].forEach(n => { if (!D.recommander({ besoin: b, budget: bu, donnees: dn, niveau: n }).length) err(`recommandation vide pour ${b}/${bu}/${dn}/${n}`); }))));

/* ——— Profils, test, scénarios */
const profils = Object.keys(D.profils);
if (profils.length !== 7) err(`7 profils attendus, ${profils.length} trouvés`);
profils.forEach(p => {
  const s = D.scenarios[p]; if (!s) return err(`scénario manquant pour ${p}`);
  ["situation", "mauvais", "bon", "pourquoi"].forEach(k => { if (!s[k]) err(`scénario ${p} : « ${k} » manquant`); });
  D.blocsNoms.forEach(([k]) => { if (!s.blocs || !s.blocs[k]) err(`scénario ${p} : bloc « ${k} » manquant`); });
  if (s.blocs) { const v = Object.values(s.blocs); if (new Set(v).size !== v.length) err(`scénario ${p} : deux blocs identiques`); }
  const c = s.conv; if (!c) return err(`conversation manquante pour ${p}`);
  ["prompt", "premiere", "reponse1", "reponse2"].forEach(k => { if (!c[k]) err(`conversation ${p} : « ${k} » manquant`); });
  ["o1", "o2"].forEach(o => { if (!c[o] || c[o].length !== 3) err(`conversation ${p} : ${o} doit avoir 3 choix`); else if (c[o].filter(x => x[1]).length !== 1) err(`conversation ${p} : ${o} doit avoir exactement 1 bon choix`); });
});
const toutesReponses = D.test.map(q => q.r.map(r => r[0]));
const rec = (i, acc) => { if (i === toutesReponses.length) { const rep = {}; D.test.forEach((q, k) => rep[q.id] = acc[k]); const p = D.calculerProfil(rep); if (!D.profils[p]) err(`profil inconnu pour ${JSON.stringify(rep)}`); return; } toutesReponses[i].forEach(v => rec(i + 1, acc.concat(v))); };
rec(0, []);
const atteints = new Set(); (function r(i, acc) { if (i === toutesReponses.length) { const rep = {}; D.test.forEach((q, k) => rep[q.id] = acc[k]); atteints.add(D.calculerProfil(rep)); return; } toutesReponses[i].forEach(v => r(i + 1, acc.concat(v))); })(0, []);
profils.forEach(p => { if (!atteints.has(p)) err(`le test d'entrée n'atteint jamais le profil « ${p} »`); });

/* ——— Exercices de séance */
D.session.forEach(s => { if (!["choix", "blocs", "halluc", "qcm", "conversation", "chrono"].includes(s.type)) err(`séance ${s.id} : type inconnu`); });
const total = D.session.reduce((a, s) => a + s.min, 0); if (total < 20 || total > 30) err(`durée de la séance : ${total} min (attendu 20 à 30 hors page finale)`);
if (D.session.length < 6 || D.session.length > 8) err(`la séance doit compter 6 à 8 exercices (${D.session.length})`);
Object.entries(D.qcm).forEach(([k, q]) => q.items.forEach((it, i) => { if (!(it[1] >= 0 && it[1] < q.options.length)) err(`qcm ${k}#${i} : bonne réponse hors limites`); if (!it[2]) err(`qcm ${k}#${i} : explication manquante`); }));
if (!D.halluc.phrases.some(p => p[1])) err("hallucination : aucun piège");
D.halluc.phrases.forEach((p, i) => { if (!p[2]) err(`hallucination#${i} : explication manquante`); });
D.chrono.items.forEach((it, i) => { if (!(it[1] >= 0 && it[1] < D.chrono.options.length)) err(`chrono#${i} : indice hors limites`); });

/* ——— Paliers */
uniques(D.paliers.map(p => p.id), "paliers");
const exosListes = new Set();
D.paliers.forEach(p => { if (p.cartes.length < 3) err(`palier ${p.n} : pas assez de cartes`); if (!p.avance) err(`palier ${p.n} : bloc « même les experts » manquant`); p.exos.forEach(id => { exosListes.add(id); if (!D.exosPalier[id]) err(`palier ${p.n} : exercice inconnu ${id}`); }); });
Object.keys(D.exosPalier).forEach(id => { if (!exosListes.has(id)) err(`exercice ${id} rattaché à aucun palier`); const x = D.exosPalier[id];
  if (x.type === "qcm") { if (!(x.bon >= 0 && x.bon < x.r.length)) err(`${id} : bonne réponse hors limites`); if (!x.expl) err(`${id} : explication manquante`); }
  if (x.type === "tri") x.items.forEach((it, i) => { if (!(it[1] >= 0 && it[1] < x.bins.length)) err(`${id}#${i} : indice hors limites`); });
  if (x.type === "ordre" && x.etapes.length < 3) err(`${id} : trop peu d'étapes`);
  if (!["qcm", "tri", "ordre", "cout"].includes(x.type)) err(`${id} : type inconnu`); });
if (D.paliers.length !== 4) err("4 paliers attendus");

/* ——— Recettes, prompts, entreprise, actus */
const idsRec = uniques(D.recettes.map(r => r.id), "recettes");
D.recettes.forEach(r => { if (!D.besoins[r.besoin]) err(`recette ${r.id} : besoin inconnu`); if (![1, 2, 3, 4].includes(r.palier)) err(`recette ${r.id} : palier invalide`); if (r.etapes.length < 4) err(`recette ${r.id} : moins de 4 étapes`); if (!r.piege) err(`recette ${r.id} : piège manquant`);
  r.outils.forEach(([id, f]) => { if (!idsOutils.has(id)) err(`recette ${r.id} : outil inconnu ${id}`); if (!f) err(`recette ${r.id} : fonction manquante pour ${id}`); }); });
Object.keys(D.besoins).forEach(b => { if (!D.recettes.some(r => r.besoin === b)) err(`besoin « ${b} » sans recette`); });
const idsPrompts = uniques(D.prompts.map(p => p.id), "prompts");
D.prompts.forEach(p => { if (!D.categories[p.groupe] || !D.categories[p.groupe][p.cat]) err(`prompt ${p.id} : catégorie inconnue`); p.profils.forEach(x => { if (!D.profils[x]) err(`prompt ${p.id} : profil inconnu ${x}`); });
  if (!p.astuce) err(`prompt ${p.id} : astuce manquante`); if (p.prompt.length > 900) err(`prompt ${p.id} : trop long`);
  if (/\b\d{2}[ .]?\d{2}[ .]?\d{2}[ .]?\d{2}[ .]?\d{2}\b/.test(p.prompt)) err(`prompt ${p.id} : ressemble à un numéro réel`);
  if (!/\[[^\]]+\]/.test(p.prompt) && !/dis-moi|pose-moi/i.test(p.prompt)) warn(`prompt ${p.id} : aucun [CRÉNEAU] à remplir`); });
Object.keys(D.categories.usage).concat(Object.keys(D.categories.metier)).forEach(c => { if (!D.prompts.some(p => p.cat === c)) err(`catégorie ${c} sans prompt`); });
Object.values(D.promptParObjectif).concat(D.promptMeta).forEach(id => { if (!idsPrompts.has(id)) err(`prompt final inconnu : ${id}`); });
profils.forEach(p => { if (!D.prompts.some(x => x.profils.includes(p))) err(`profil ${p} sans prompt dédié`); });
D.cas.forEach(c => c.cas.forEach(([t, pid]) => { if (!idsPrompts.has(pid)) err(`cas d'usage « ${t} » : prompt inconnu ${pid}`); }));
if (D.charte.length < 8) err("charte : trop courte");
const idsActus = uniques(D.actus.map(a => a.id), "actus");
D.actus.forEach(a => { if (!ISO.test(a.date)) err(`actu ${a.id} : date invalide`); else if (jours(a.date) < 0) err(`actu ${a.id} : date future`);
  if (!a.source || !/^https:\/\//.test(a.source[1])) err(`actu ${a.id} : source manquante ou non https`); if (!a.change) err(`actu ${a.id} : « ce que ça change » manquant`);
  if (!["officielle", "partielle"].includes(a.fiabilite)) err(`actu ${a.id} : fiabilité invalide`); if (!D.sujetsActus.includes(a.sujet)) err(`actu ${a.id} : sujet absent du filtre`); });
const recente = Math.min(...D.actus.map(a => jours(a.date))); if (recente > 14) warn(`actus : la plus récente a ${Math.round(recente)} jours, lancer la mise à jour (docs/MISE-A-JOUR.md)`);
D.sujetsActus.slice(1).forEach(s => { if (!D.actus.some(a => a.sujet === s)) err(`filtre d'actus « ${s} » sans actu`); });

/* ——— Liens : tous en https et vers des hôtes dont l'existence a été vérifiée à la main */
const hotesVerifies = new Set(["chatgpt.com", "openai.com", "claude.com", "gemini.google", "mistral.ai", "chat.mistral.ai", "www.microsoft.com", "cursor.com", "v0.app", "www.make.com", "n8n.io", "zapier.com", "www.perplexity.ai", "instinct.com", "www.toureiffel.paris", "www.cnil.fr", "genai.owasp.org", "arxiv.org", "github.com", "docs.github.com"]);
const urls = new Set();
const collecte = (txt, src) => { for (const m of txt.matchAll(/https?:\/\/[^\s"'`)<>\\]+/g)) { const u = m[0].replace(/[.,;]+$/, ""); if (/^https?:\/\/(www\.)?w3\.org|localhost|exemple\.test|\$\{/.test(u)) continue; urls.add(u); if (!u.startsWith("https://")) err(`${src} : lien non sécurisé ${u}`); let h; try { h = new URL(u).hostname; } catch (_) { err(`${src} : URL invalide ${u}`); continue; } if (!hotesVerifies.has(h)) err(`${src} : hôte non vérifié ${h} (ajoute-le seulement après vérification manuelle)`); } };
["js/data/profils.js", "js/data/exercices.js", "js/data/outils.js", "js/data/prompts.js", "js/data/paliers.js", "js/data/entreprise.js", "js/data/actus.js", "js/core.js", "js/exos.js", "js/pages-accueil.js", "js/pages-seance.js", "js/pages-outils.js", "js/pages-paliers.js", "js/pages-ressources.js", "js/pages-legal.js"].forEach(f => collecte(lis(f), f));

/* ——— Routes : chaque lien interne mène à une route existante */
const routes = [...lis("js/core.js").split("P.routes = [")[1].split("];")[0].matchAll(/\["([^"]*)", "[a-zA-Z]+", "/g)].map(m => m[1].split("/")[0]);
["js/core.js", "js/pages-accueil.js", "js/pages-seance.js", "js/pages-outils.js", "js/pages-paliers.js", "js/pages-ressources.js", "js/pages-legal.js"].forEach(f => { for (const m of lis(f).matchAll(/#\/([a-z-]*)/g)) if (!routes.includes(m[1])) err(`${f} : lien vers une route inconnue « #/${m[1]} »`); });
const blocRoutes = lis("js/core.js").split("P.routes = [")[1].split("];")[0];
const pages = [...blocRoutes.matchAll(/\["[^"]*", "([a-zA-Z]+)", "/g)].map(m => m[1]);
const toutesPages = lis("js/pages-accueil.js") + lis("js/pages-seance.js") + lis("js/pages-outils.js") + lis("js/pages-paliers.js") + lis("js/pages-ressources.js") + lis("js/pages-legal.js") + lis("js/core.js");
pages.forEach(p => { if (!new RegExp("P\\.pages\\." + p + "\\s*=").test(toutesPages)) err(`route « ${p} » sans page`); });

/* ——— Fichiers et hygiène */
const html = lis("index.html");
for (const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) { const u = m[1]; if (/^(https?:|data:)/.test(u)) { if (/^https?:/.test(u)) err(`index.html : ressource externe ${u}`); continue; } if (!fs.existsSync(path.join(racine, u))) err(`index.html : fichier absent ${u}`); }
for (const m of lis("css/fonts.css").matchAll(/url\("\.\.\/([^"]+)"\)/g)) if (!fs.existsSync(path.join(racine, m[1]))) err(`police absente ${m[1]}`);
const toutLeCode = ["index.html", ...fs.readdirSync(path.join(racine, "js")).filter(f => f.endsWith(".js")).map(f => "js/" + f), ...fs.readdirSync(path.join(racine, "js/data")).map(f => "js/data/" + f), "README.md", "docs/MISE-A-JOUR.md"].filter(f => fs.existsSync(path.join(racine, f)));
toutLeCode.forEach(f => { const t = lis(f);
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/.test(t.replace(/contact@exemple\.test/g, ""))) err(`${f} : adresse e-mail trouvée (ne jamais publier de donnée personnelle)`);
  if (/\.js$/.test(f) && /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|navigator\.geolocation|document\.cookie/.test(t)) err(`${f} : appel réseau ou cookie interdit`);
  if (/utm_|[?&]ref=|affili(?!ation|é)/i.test(t.replace(/Aucune affiliation|aucun lien d'affiliation/gi, ""))) warn(`${f} : mot lié à l'affiliation à relire`);
  if (/Claude Sonnet|Claude Opus|Co-Authored/i.test(t)) err(`${f} : nom de modèle ou attribution à retirer du contenu publié`); });
const ed = lis("js/core.js").match(/editeur: \{([^}]*)\}/)[1]; if (/:\s*"[^"]+"/.test(ed)) err("champs d'éditeur renseignés dans core.js : à laisser vides jusqu'à décision de Jules");
if (!fs.existsSync(path.join(racine, ".github/workflows/pages.yml"))) err("workflow de déploiement manquant");

/* ——— Vérification en ligne (optionnelle) */
(async () => {
  if (process.argv.includes("--liens")) {
    for (const u of urls) { try { const r = await fetch(u, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Mozilla/5.0 declic-integrite" } }); if (r.status >= 400) warn(`lien ${u} : HTTP ${r.status}`); } catch (e) { warn(`lien ${u} : non vérifiable (${e.cause ? e.cause.code : e.message})`); } }
  }
  console.log(`Intégrité : ${D.outils.length} outils, ${D.prompts.length} prompts, ${D.recettes.length} recettes, ${D.actus.length} actus, ${Object.keys(D.exosPalier).length} exercices de palier, ${urls.size} liens distincts.`);
  avertissements.forEach(w => console.log("  ⚠ " + w));
  if (erreurs.length) { erreurs.forEach(x => console.log("  ✗ " + x)); console.log(`ÉCHEC : ${erreurs.length} erreur(s).`); process.exit(1); }
  console.log("OK : zéro erreur.");
})();

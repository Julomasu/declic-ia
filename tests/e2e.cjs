/* Test dans un vrai navigateur (Playwright) : bureau et mobile, clair et sombre.
   Vérifie : aucune erreur JS, aucun débordement, toutes les routes, zones tactiles, accessibilité de base,
   et le parcours complet (test d'entrée, 7 exercices, prompts, copie) pour chacun des 7 profils. */
const http = require("http"), fs = require("fs"), path = require("path");
let chromium; try { ({ chromium } = require("playwright")); } catch (_) { ({ chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright")); }
const racine = path.join(__dirname, ".."), captures = path.join(__dirname, "captures");
fs.mkdirSync(captures, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".txt": "text/plain" };
const serveur = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(racine, p); if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end("404"); } r.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r); });

const echecs = [], notes = []; let verifs = 0;
const ok = (cond, msg) => { verifs++; if (!cond) echecs.push(msg); };

const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find(f => fs.existsSync(f));

async function gardes(page, nom) {
  const r = await page.evaluate(() => {
    const L = window.innerWidth, out = { debordement: document.documentElement.scrollWidth - L, larges: [], petits: [], sansNom: [], h1: document.querySelectorAll("h1").length, dup: [], sansLabel: [] };
    const visible = el => { const s = getComputedStyle(el), b = el.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && b.width > 0 && b.height > 0 && !el.closest("[hidden]"); };
    document.querySelectorAll("body *").forEach(el => { if (!visible(el)) return; const b = el.getBoundingClientRect(); if (b.right > L + 1 && !el.closest("pre") && getComputedStyle(el).position !== "fixed") out.larges.push(el.tagName + "." + (el.className || "") + " " + Math.round(b.right)); });
    document.querySelectorAll("button, .btn, .chip, .option, .piece, .slot, .phrase, summary, select, input:not([type=checkbox]), .onglets a, .nav-haut a, .plus a").forEach(el => { if (!visible(el)) return; const b = el.getBoundingClientRect(); if (b.height < 43.5 || b.width < 43.5) out.petits.push(el.tagName + "." + (el.className || "") + " " + Math.round(b.width) + "x" + Math.round(b.height) + " « " + (el.textContent || "").trim().slice(0, 20) + " »"); });
    document.querySelectorAll("button, a[href], summary").forEach(el => { if (!visible(el)) return; const n = (el.getAttribute("aria-label") || el.textContent || "").trim(); if (!n) out.sansNom.push(el.outerHTML.slice(0, 80)); });
    document.querySelectorAll("input, select, textarea").forEach(el => { if (!visible(el)) return; if (!(el.labels && el.labels.length) && !el.getAttribute("aria-label")) out.sansLabel.push(el.outerHTML.slice(0, 80)); });
    const ids = {}; document.querySelectorAll("[id]").forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; }); out.dup = Object.keys(ids).filter(k => ids[k] > 1);
    out.lang = document.documentElement.lang;
    return out;
  });
  ok(r.debordement <= 1, `${nom} : barre de défilement horizontale (+${r.debordement}px)`);
  ok(r.larges.length === 0, `${nom} : éléments qui dépassent : ${r.larges.slice(0, 3).join(" | ")}`);
  ok(r.petits.length === 0, `${nom} : zones tactiles < 44 px : ${r.petits.slice(0, 4).join(" | ")}`);
  ok(r.sansNom.length === 0, `${nom} : boutons ou liens sans nom : ${r.sansNom.slice(0, 2).join(" | ")}`);
  ok(r.sansLabel.length === 0, `${nom} : champs sans libellé : ${r.sansLabel.slice(0, 2).join(" | ")}`);
  ok(r.h1 === 1, `${nom} : ${r.h1} titres h1 (1 attendu)`);
  ok(r.dup.length === 0, `${nom} : id en double : ${r.dup.join(", ")}`);
  ok(r.lang === "fr", `${nom} : attribut lang absent`);
}

/* Réalise un exercice de séance ou de palier en donnant les bonnes réponses. */
async function clique(page, sel) { await page.locator(sel).first().click(); }
async function continuer(page, texte) { await page.getByRole("button", { name: texte }).first().click(); }

async function parcours(page, base, profil, nom, avecCaptures) {
  const reponses = { senior: ["senior", "0"], jeune: ["jeune", "1"], particulier: ["particulier", "2"], entrepreneur: ["entrepreneur", "1"], entreprise: ["entreprise", "2"], pro: ["pro", "2"], expert: ["pro", "3"] }[profil];
  await page.goto(base + "#/test"); await page.evaluate(() => { localStorage.clear(); }); await page.reload();
  const valeurs = [reponses[0], reponses[1], "ecrire", profil === "entreprise" ? "sensibles" : "libres", "0"];
  for (const v of valeurs) { await page.locator(`.option[data-v="${v}"]`).click(); }
  await page.waitForSelector(".hero h1");
  const etat = await page.evaluate(() => P.etat.profil);
  ok(etat === profil, `${nom} : profil attendu ${profil}, obtenu ${etat}`);
  if (avecCaptures) await page.screenshot({ path: path.join(captures, `${nom}-profil.png`) });
  await page.goto(base + "#/seance/bonmauvais");
  const { sc, D } = await page.evaluate(() => ({ sc: D.scenarios[P.etat.profil], D: { halluc: D.halluc, qcm: D.qcm, chrono: D.chrono, noms: D.blocsNoms } }));
  // 1. bon / mauvais
  await clique(page, '.carte-prompt[data-t="bon"]'); await continuer(page, "Continuer");
  // 2. blocs
  await page.waitForSelector(".slots");
  for (const [k] of D.noms) { await page.locator(`.slot[data-slot="${k}"]`).click(); await page.locator(".piece:not([disabled])", { hasText: sc.blocs[k] }).first().click(); }
  if (avecCaptures) await page.screenshot({ path: path.join(captures, `${nom}-blocs.png`) });
  await page.locator("#verif").click(); await page.locator(".prompt-bloc").waitFor();
  const juste = await page.locator(".slot.juste").count(); ok(juste === 5, `${nom} : blocs, ${juste}/5 justes`);
  await continuer(page, "Continuer");
  // 3. hallucination
  await page.waitForSelector(".phrases");
  for (let k = 0; k < D.halluc.phrases.length; k++) if (D.halluc.phrases[k][1]) await page.locator(`.phrase[data-k="${k}"]`).click();
  await page.locator("#verif").click(); await continuer(page, "Continuer");
  // 4. vrai ou faux
  const qa = async (items) => { for (let i = 0; i < items.length; i++) { await page.locator(`.option[data-k="${items[i][1]}"]`).click(); await continuer(page, i + 1 < items.length ? "Question suivante" : "Terminer"); } };
  await page.waitForSelector(".option"); await qa(D.qcm.vraifaux.items);
  // 5. conversation
  await page.waitForSelector(".chat");
  const conv = sc.conv;
  for (const o of [conv.o1, conv.o2]) { const bon = o.findIndex(x => x[1]); await page.locator(`.option[data-k="${bon}"]`).click(); await continuer(page, "Voir la réponse de l'IA"); }
  if (avecCaptures) await page.screenshot({ path: path.join(captures, `${nom}-conversation.png`) });
  await continuer(page, "Continuer");
  // 6. chrono
  await page.waitForSelector(".minuteur");
  for (let i = 0; i < D.chrono.items.length; i++) await page.locator(`.option[data-k="${D.chrono.items[i][1]}"]`).click();
  await continuer(page, "Continuer");
  // 7. quel type d'outil
  await page.waitForSelector(".option"); await qa(D.qcm.outilrapide.items);
  await page.waitForURL(/#\/resultat/);
  await page.waitForSelector(".carte-prompt-lib");
  const n = await page.locator(".carte-prompt-lib").count(); ok(n === 3, `${nom} : 3 prompts attendus en fin de séance, ${n} trouvés`);
  const attendu = await page.locator("#rp-0").getAttribute("data-texte"); ok(attendu === sc.bon, `${nom} : le premier prompt final n'est pas celui du profil`);
  await page.locator('[data-copie="rp-0"]').click();
  const presse = await page.evaluate(() => navigator.clipboard.readText().catch(() => null));
  ok(presse === sc.bon, `${nom} : copie dans le presse-papiers incorrecte`);
  const reco = await page.locator(".liste-guides .carte-outil").count(); ok(reco >= 1, `${nom} : aucune recommandation d'outil`);
  const scoreTxt = await page.locator(".hero .chapo").textContent(); ok(/Score : (\d+) sur (\d+)/.test(scoreTxt), `${nom} : score non affiché`);
  const m = scoreTxt.match(/Score : (\d+) sur (\d+)/); if (m) ok(m[1] === m[2], `${nom} : score parfait attendu, ${m[1]}/${m[2]}`);
  await gardes(page, `${nom} /resultat`);
  if (avecCaptures) await page.screenshot({ path: path.join(captures, `${nom}-resultat.png`), fullPage: true });
}

async function exosPalier(page, base, nom) {
  const ids = await page.evaluate(() => Object.keys(D.exosPalier));
  for (const id of ids) {
    await page.goto(base + "#/exo/" + id);
    const x = await page.evaluate(i => D.exosPalier[i], id);
    if (x.type === "qcm") { await page.locator(`.option[data-k="${x.bon}"]`).click(); await continuer(page, "Terminer"); }
    else if (x.type === "tri") { for (let i = 0; i < x.items.length; i++) { await page.locator(`.option[data-k="${x.items[i][1]}"]`).click(); await continuer(page, i + 1 < x.items.length ? "Question suivante" : "Terminer"); } }
    else if (x.type === "ordre") { for (const k of x.etapes.map((_, i) => i)) await page.locator(".pieces .piece", { hasText: x.etapes[k] }).first().click(); await page.locator("#verif").click(); const j = await page.locator(".piece.juste").count(); ok(j === x.etapes.length, `${nom} ${id} : ordre non reconnu`); await continuer(page, "Terminer"); }
    else if (x.type === "cout") { const avant = await page.locator("#c-total").textContent(); await page.fill("#c-appels", "4000"); const apres = await page.locator("#c-total").textContent(); ok(avant !== apres, `${nom} ${id} : le calcul ne réagit pas`); await continuer(page, "J'ai fait mon calcul"); }
    await page.waitForFunction(i => location.hash !== "#/exo/" + i, id);
    const fait = await page.evaluate(i => !!P.etat.paliers[i], id); ok(fait, `${nom} ${id} : exercice non enregistré`);
  }
}

async function routes(page, base, nom, erreursJs) {
  const liste = await page.evaluate(() => {
    const r = ["", "test", "seance", "resultat", "paliers", "quelle-ia", "choisis", "prompts", "donnees", "entreprise", "actus", "sources", "mentions", "confidentialite"];
    D.session.forEach(s => r.push("seance/" + s.id)); [1, 2, 3, 4].forEach(n => r.push("palier/" + n)); Object.keys(D.exosPalier).forEach(i => r.push("exo/" + i)); D.outils.forEach(o => r.push("outil/" + o.id)); return r;
  });
  for (const r of liste) {
    const avant = erreursJs.length; await page.goto(base + "#/" + r); await page.waitForSelector("#app h1, #app h2", { timeout: 5000 }).catch(() => {});
    await page.evaluate(() => P.nettoyages.splice(0).forEach(f => f()));
    const vide = await page.evaluate(() => document.getElementById("app").innerText.trim().length < 40);
    ok(!vide, `${nom} #/${r} : page vide`);
    ok(erreursJs.length === avant, `${nom} #/${r} : erreur JS ${erreursJs.slice(avant).join(" ; ")}`);
    await gardes(page, `${nom} #/${r}`);
  }
  await page.goto(base + "#/n-importe-quoi"); ok(/introuvable/i.test(await page.locator("h1").textContent()), `${nom} : page 404 absente`);
  return liste.length;
}

async function interactions(page, base, nom) {
  // Quelle IA : questionnaire et comparateur
  await page.goto(base + "#/quelle-ia");
  for (const q of ["besoin", "budget", "donnees", "niveau"]) await page.locator(`[data-q="${q}"]`).first().click();
  ok(await page.locator("#t-res").count() === 1 && (await page.locator(".liste-guides .carte-outil").count()) >= 1, `${nom} : le questionnaire ne donne aucun résultat`);
  for (const id of ["chatgpt", "claude", "gemini", "cursor"]) await page.locator(`[data-vs="${id}"]`).click();
  ok(await page.locator(".comparaison .carte-outil").count() === 3, `${nom} : le comparateur doit se limiter à 3 outils`);
  const dates = await page.locator(".comparaison .petit").allTextContents(); ok(dates.every(t => /Vérifié le \d+ \S+ 2026/.test(t)), `${nom} : date de vérification absente du comparateur`);
  // Prompts : recherche, filtre, copie
  await page.goto(base + "#/prompts"); const tous = await page.locator(".carte-prompt-lib").count();
  await page.fill("#rech", "facture"); const filtres = await page.locator(".carte-prompt-lib").count(); ok(filtres > 0 && filtres < tous, `${nom} : recherche de prompts (${filtres}/${tous})`);
  await page.locator(".carte-prompt-lib [data-copie]").first().click(); const txt = await page.evaluate(() => navigator.clipboard.readText()); ok(/\[/.test(txt), `${nom} : copie de prompt vide`);
  await page.fill("#rech", "zzzzzz"); ok(await page.locator(".vide").count() === 1, `${nom} : état « aucun résultat » absent`);
  // Actus : filtre
  await page.goto(base + "#/actus"); const na = await page.locator(".actu").count(); await page.locator('[data-s="Claude"]').click(); const nc = await page.locator(".actu").count(); ok(nc >= 1 && nc < na, `${nom} : filtre d'actus`);
  const actus = await page.locator(".actu").allTextContents(); ok(actus.every(t => /Ce que ça change/.test(t) && /Source/.test(t)), `${nom} : actu sans « ce que ça change » ou sans source`);
  // Entreprise : la check-list se souvient
  await page.goto(base + "#/entreprise"); await page.locator("#ck-0-0").check(); await page.reload(); ok(await page.locator("#ck-0-0").isChecked(), `${nom} : check-list non mémorisée`);
  // Choisis ton outil : filtre et ouverture
  await page.goto(base + "#/choisis?b=automatiser&r=planifiee"); ok(await page.locator("details[open]").count() === 1, `${nom} : recette non ouverte via le lien`);
  // Mentions : champs d'éditeur vides
  await page.goto(base + "#/mentions"); ok(/à compléter/i.test(await page.locator("#app").innerText()), `${nom} : champs d'éditeur supposés vides`);
  // Réglages : thème et zoom
  await page.locator("#btn-plus, #btn-plus-m").filter({ visible: true }).first().click(); await page.locator('[data-theme-set="dark"]').click();
  ok(await page.evaluate(() => document.documentElement.getAttribute("data-theme")) === "dark", `${nom} : thème sombre non appliqué`);
  await page.locator('[data-theme-set="auto"]').click(); await page.locator('[data-zoom="1.3"]').click(); ok(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--zoom").trim()) === "1.3", `${nom} : zoom non appliqué`);
  await page.keyboard.press("Escape");
  // Clavier : le focus visible atterrit sur le titre après navigation
  await page.goto(base + "#/paliers"); await page.locator("a.tuile").first().click(); await page.waitForURL(/#\/palier\//); const foc = await page.waitForFunction(() => document.activeElement && document.activeElement.tagName === "H1", null, { timeout: 3000 }).then(() => true, () => false); ok(foc, `${nom} : focus non placé sur le titre`);
}

(async () => {
  await new Promise(r => serveur.listen(0, r));
  const base = `http://localhost:${serveur.address().port}/index.html`;
  const navigateur = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
  const configs = [
    { nom: "bureau-clair", opts: { viewport: { width: 1280, height: 800 }, colorScheme: "light" }, profils: ["senior", "jeune", "particulier", "entrepreneur", "entreprise", "pro", "expert"] },
    { nom: "mobile-clair", opts: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, colorScheme: "light" }, profils: ["senior", "jeune", "entrepreneur", "expert"] },
    { nom: "mobile-petit", opts: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, colorScheme: "light" }, profils: ["particulier"] },
    { nom: "mobile-sombre", opts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "dark" }, profils: ["pro"] },
    { nom: "bureau-sombre", opts: { viewport: { width: 1440, height: 900 }, colorScheme: "dark" }, profils: ["entreprise"] }
  ];
  for (const c of configs) {
    const ctx = await navigateur.newContext(c.opts); await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(base).origin }).catch(() => {});
    const page = await ctx.newPage(); const erreursJs = [];
    page.on("pageerror", e => erreursJs.push("PAGEERR " + e.message)); page.on("console", m => { if (m.type() === "error") erreursJs.push("CONSOLE " + m.text()); });
    page.on("requestfailed", r => erreursJs.push("REQFAIL " + r.url()));
    page.on("response", r => { if (r.status() >= 400) erreursJs.push("HTTP" + r.status() + " " + r.url()); });
    await page.goto(base); await page.waitForSelector("h1");
    await gardes(page, `${c.nom} accueil`);
    // Les requêtes sortantes sont interdites : seul le serveur local est autorisé.
    page.on("request", r => { if (!r.url().startsWith("http://localhost") && !r.url().startsWith("data:")) erreursJs.push("EXTERNE " + r.url()); });
    for (const p of c.profils) await parcours(page, base, p, `${c.nom}-${p}`, p === "senior" || p === "entrepreneur");
    const nr = await routes(page, base, c.nom, erreursJs);
    await exosPalier(page, base, c.nom);
    if (c.nom.startsWith("bureau-clair") || c.nom === "mobile-clair") await interactions(page, base, c.nom);
    for (const r of ["", "paliers", "quelle-ia", "prompts", "palier/3", "actus", "entreprise"]) { await page.goto(base + "#/" + r); await page.screenshot({ path: path.join(captures, `${c.nom}-${(r || "accueil").replace("/", "-")}.png`), fullPage: true }); }
    ok(erreursJs.length === 0, `${c.nom} : erreurs JS ou réseau : ${erreursJs.slice(0, 4).join(" ; ")}`);
    notes.push(`${c.nom} : ${nr} routes, ${c.profils.length} parcours complet(s)`);
    await ctx.close();
  }
  await navigateur.close(); serveur.close();
  notes.forEach(n => console.log("  · " + n));
  console.log(`${verifs} vérifications.`);
  if (echecs.length) { [...new Set(echecs)].forEach(m => console.log("  ✗ " + m)); console.log(`ÉCHEC : ${echecs.length} problème(s).`); process.exit(1); }
  console.log("OK : tout passe.");
})().catch(e => { console.error(e); process.exit(2); });

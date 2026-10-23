/* Mentions légales et confidentialité, sur le modèle de Paperasse. Le texte décrit ce que le site fait réellement :
   toute évolution technique (service externe, donnée stockée) doit être reportée ici. Champs d'éditeur vides jusqu'à décision de Jules. */
(function (g) {
  const P = g.P, e = P.e;
  const ed = () => P.CONFIG.editeur || {};
  const ligne = (l, v) => v ? `<li><strong>${l}</strong> : ${e(v)}</li>` : "";
  const complet = () => !!(ed().nom && ed().contact);

  P.pages.mentions = el => {
    const d = ed();
    el.innerHTML = `
      ${P.tete("Mentions légales", "Qui édite ce site, qui l'héberge, d'où viennent les informations.")}
      <div class="legal">
        <section><h2>Éditeur du site</h2>
          ${complet() ? `<ul>${ligne("Éditeur", d.nom)}${ligne("Statut", d.statut)}${ligne("Directeur·rice de la publication", d.directeurPublication || d.nom)}${ligne("Adresse", d.adresse)}${ligne("Contact", d.contact)}</ul>`
            : `<p class="alerte warn"><strong>Informations de l'éditeur à compléter.</strong> <span>Renseigne le nom et un moyen de contact dans <code>js/core.js</code> (rubrique <code>editeur</code>) avant toute communication large.</span></p>`}
          <p>Déclic est un service d'information et de formation gratuit, indépendant et sans but lucratif. Ce n'est pas un site officiel des éditeurs d'outils cités : aucun partenariat, aucune affiliation, aucune rémunération.</p></section>
        <section><h2>Hébergement</h2>
          <p>Le site est hébergé par GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis. ${P.lienExt("https://github.com", "github.com")}.</p></section>
        <section><h2>Contenus et responsabilité</h2>
          <p>Les prix, offres et fonctions des outils sont relevés sur leurs sites officiels, avec la date de vérification affichée. Ils changent souvent : une information peut être dépassée. Ils ne remplacent ni la page officielle de l'outil, ni l'avis d'un·e professionnel·le (juriste, délégué·e à la protection des données). Les modèles de la charte d'usage et les conseils sur les données donnent un cadre de départ, pas un conseil juridique personnalisé.</p>
          <p>Une erreur, un contenu à retirer ? ${d.contact ? `Écris à <strong>${e(d.contact)}</strong> ou ` : ""}ouvre une demande sur ${P.lienExt(P.CONFIG.depot + "/issues", "le dépôt du projet")}.</p></section>
        <section><h2>Sources et licences</h2>
          <ul><li>Informations relevées sur les sites officiels cités sur chaque fiche et sur la page <a href="#/sources">Sources et vérifications</a>.</li>
          <li>Polices Barlow et Barlow Condensed : licence SIL Open Font License 1.1, hébergées sur ce site.</li></ul></section>
        <section><h2>Droits sur le site</h2>
          <p>Les textes rédigés, la structure et le code de Déclic sont publiés sur ${P.lienExt(P.CONFIG.depot, "GitHub")}. Les noms d'outils et d'entreprises cités appartiennent à leurs propriétaires et servent uniquement à les identifier.</p></section>
        <p class="petit">Dernière mise à jour : octobre 2026. Voir aussi <a href="#/confidentialite">Confidentialité</a>. Ces pages sont à faire valider par l'éditeur avant toute communication large.</p>
      </div>`;
  };

  P.pages.confidentialite = el => {
    el.innerHTML = `
      ${P.tete("Confidentialité", "Ce que le site garde, ce qu'il n'envoie pas, et les services extérieurs concernés.")}
      <div class="legal">
        <section class="bloc"><h2>L'essentiel</h2><ul>
          <li>Pas de compte, pas de formulaire d'inscription, <strong>pas de cookie</strong>, pas de traceur.</li>
          <li>Ta progression, ton profil et tes réglages restent <strong>dans ton navigateur</strong>. Le site ne les envoie à personne.</li>
          <li>Aucune mesure d'audience n'est active.</li>
          <li>Aucune vraie IA n'est appelée : les démonstrations sont écrites à l'avance, ce que tu tapes ne part nulle part.</li></ul></section>
        <section><h2>Ce qui reste dans ton navigateur</h2>
          <p>Pour fonctionner, le site enregistre sur ton appareil (stockage local du navigateur, qui n'est pas un cookie) : ton parcours et les réponses au test d'entrée, les exercices terminés et leurs scores, les cases cochées de la check-list entreprise, tes réponses au questionnaire « Quelle IA ? » et tes réglages (taille du texte, thème, chrono). Tu peux tout effacer avec « Effacer ma progression » dans le menu « Plus », ou en vidant les données du site dans ton navigateur.</p></section>
        <section><h2>Les services extérieurs qui peuvent voir ton adresse IP</h2><ul>
          <li><strong>Hébergement (GitHub Pages)</strong> : chaque visite génère des journaux techniques standard chez GitHub, Inc. ${P.lienExt("https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement", "Politique de confidentialité de GitHub")}.</li>
          <li><strong>Polices</strong> : hébergées sur ce site, aucune requête vers Google Fonts.</li>
          <li><strong>Liens sortants</strong> (sites des outils, CNIL…) : une fois le lien ouvert, tu es sur un autre site, avec sa propre politique.</li></ul>
          <p>Le site ne charge ni carte, ni vidéo, ni réseau social, ni publicité.</p></section>
        <section><h2>Tes droits</h2>
          <p>Le site ne détient aucune donnée personnelle te concernant : il n'y a rien à consulter ou rectifier côté serveur. Pour les journaux d'hébergement, voir la politique de GitHub. Pour toute question : ${ed().contact ? `<strong>${e(ed().contact)}</strong> ou ` : ""}${P.lienExt(P.CONFIG.depot + "/issues", "le dépôt du projet")}.</p></section>
        <p class="petit">Dernière mise à jour : octobre 2026. Voir aussi <a href="#/mentions">Mentions légales</a>. Cette page est à faire valider par l'éditeur avant toute communication large.</p>
      </div>`;
  };
})(window);
